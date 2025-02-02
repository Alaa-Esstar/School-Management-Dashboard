import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import prisma from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { currentUserId, role } from "@/app/lib/utils";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";

type EventList = Event & { class: Class }

const columns = [
    {
        header: "Title",
        accessor: "title",
        className: "px-2"
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    {
        header: "Start Time",
        accessor: "startTime",
        className: "hidden md:table-cell",
    },
    {
        header: "End Time",
        accessor: "endtime",
        className: "hidden md:table-cell",
    },
    ...(role === "admin" ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),
]

const renderRow = (item: EventList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="p-4">{item.title}</td>
        <td>{item.class?.name || "-"}</td>
        <td className="hidden md:table-cell">
            {new Intl.DateTimeFormat("fr").format(item.startTime)}
        </td>
        <td className="hidden md:table-cell">
            {item.startTime.toLocaleTimeString("fr", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            })}
        </td>
        <td className="hidden md:table-cell">
            {item.endTime.toLocaleTimeString("fr", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            })}
        </td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="event" type="update" data={item} />
                        <FormModal table="event" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const EventList = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
    const { page, ...queryParams } = await searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITIONS

    const query: Prisma.EventWhereInput = {}
    if (queryParams !== undefined) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value) {
                switch (key) {
                    case "search":
                        query.title = { contains: value, mode: "insensitive" }
                        break;
                    default: break;
                }
            }
        }
    }

    // ROle Conditions
    const roleCondition = {
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } },
    }

    query.OR = [
        { classId: null }, {
            class: roleCondition[role as keyof typeof roleCondition] || {}
        }
    ]

    const [events, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            include: {
                class: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)

        }),
        prisma.event.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="size-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="filter" width={14} height={14} />
                        </button>
                        <button className="size-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="filter" width={14} height={14} />
                        </button>
                        {role === "admin" &&
                            <FormModal table="event" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={events} />
            {/* Pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default EventList;