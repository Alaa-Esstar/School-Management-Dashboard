import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import prisma from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { role } from "@/app/lib/utils";
import { Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type SubjectList = Subject & { teachers: Teacher[] }

const columns = [
    {
        header: "Subject Name",
        accessor: "name",
        className: "px-2"
    },
    {
        header: "Teachers",
        accessor: "teachers",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]

const renderRow = (item: SubjectList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="p-4">{item.name}</td>
        <td className="hidden md:table-cell">{item.teachers.map(teacher => teacher.name).join(", ")}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="subject" type="update" data={item} />
                        <FormModal table="subject" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const SubjectList = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
    const { page, ...queryParams } = await searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITIONS

    const query: Prisma.SubjectWhereInput = {}
    if (queryParams !== undefined) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value) {
                switch (key) {
                    case "search":
                        query.name = { contains: value, mode: "insensitive" }
                        break;
                    default: break;
                }
            }
        }
    }

    const [subjects, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: query,
            include: {
                teachers: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)

        }),
        prisma.subject.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
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
                            <FormModal table="subject" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={subjects} />
            {/* Pagination */}
            <Pagination count={count} page={p} />
        </div>
    );
}

export default SubjectList;