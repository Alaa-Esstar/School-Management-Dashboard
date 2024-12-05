import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { classesData, role } from "@/app/lib/data";
import prisma from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { Class, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ClassesList = Class & { supervisor: Teacher }

const columns = [
    {
        header: "Class Name",
        accessor: "name",
        className: "px-2"
    },
    {
        header: "Capacity",
        accessor: "capacity",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "hidden md:table-cell",
    },
    {
        header: "Supervisor",
        accessor: "supervisor",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]

const renderRow = (item: ClassesList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="p-4">{item.name}</td>
        <td className="hidden md:table-cell">{item.capacity}</td>
        <td className="hidden md:table-cell">{item.name[0]}</td>
        <td className="hidden md:table-cell">{item.supervisor.name + " " + item.supervisor.surname}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="class" type="update" data={item} />
                        <FormModal table="class" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const ClassList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { page, ...queryParams } = await searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITIONS
    const query: Prisma.ClassWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "supervisorId":
                        query.supervisorId = value
                        break;
                    case "search":
                        query.name = { contains: value, mode: "insensitive" }
                        break;
                    default: break;
                }
            }
        }
    }

    const [classes, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.class.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
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
                            <FormModal table="class" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={classes} />
            {/* Pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default ClassList;