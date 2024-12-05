import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { lessonsData, role } from "@/app/lib/data";
import prisma from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type LessonList = Lesson & { teacher: Teacher } & { subject: Subject } & { class: Class }

const columns = [
    {
        header: "Subject Name",
        accessor: "name",
        className: "px-2"
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]

const renderRow = (item: LessonList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="p-4">{item.subject.name}</td>
        <td>{item.class.name}</td>
        <td className="hidden md:table-cell">{item.teacher.name + " " + item.teacher.surname}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="lesson" type="update" data={item} />
                        <FormModal table="lesson" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const LessonList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { page, ...queryParams } = await searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITIONS
    const query: Prisma.LessonWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.teacherId = value
                        break;
                    case "classId":
                        query.classId = parseInt(value)
                        break;
                    case "search":
                        query.OR = [
                            { subject: { name: { contains: value, mode: "insensitive" } } },
                            { teacher: { name: { contains: value, mode: "insensitive" } } }
                        ]
                        break;
                    default: break;
                }
            }
        }
    }

    const [lessons, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include: {
                teacher: { select: { name: true, surname: true } },
                subject: { select: { name: true } },
                class: { select: { name: true } }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.lesson.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
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
                            <FormModal table="lesson" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={lessons} />
            {/* Pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default LessonList;