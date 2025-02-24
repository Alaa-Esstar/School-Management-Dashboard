import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import prisma from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { currentUserId, role } from "@/app/lib/utils";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type ExamList = Exam & {
    lesson: {
        subject: Subject,
        class: Class,
        teacher: Teacher
    }
}

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
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    ...((role === "admin" || role === "teacher") ? [{
        header: "Actions",
        accessor: "actions",
    }] : []),
]

const renderRow = (item: ExamList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="p-4">{item.lesson.subject.name}</td>
        <td>{item.lesson.class.name}</td>
        <td className="hidden md:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("fr").format(item.startTime)}</td>
        <td>
            <div className="flex items-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table="exam" type="update" data={item} />
                        <FormModal table="exam" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const ExamList = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
    const { page, ...queryParams } = await searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITIONS

    const query: Prisma.ExamWhereInput = {}
    query.lesson = {};
    if (queryParams !== undefined) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value) {
                switch (key) {
                    case "classId":
                        query.lesson.classId = parseInt(value)
                        break;
                    case "teacherId":
                        query.lesson.teacherId = value
                        break;
                    case "search":
                        query.lesson.subject = { name: { contains: value, mode: "insensitive" } }
                        break;
                    default: break;
                }
            }
        }
    }

    // Role Consditons
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.lesson.teacherId = currentUserId!;
            break;
        case "student":
            query.lesson.class = { students: { some: { id: currentUserId! } } }
            break;
        case "parent":
            query.lesson.class = { students: { some: { parentId: currentUserId! } } }
            break;
        default: break;
    }

    const [Exams, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true } }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)

        }),
        prisma.exam.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="size-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="filter" width={14} height={14} />
                        </button>
                        <button className="size-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="filter" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") &&
                            <FormModal table="exam" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={Exams} />
            {/* Pagination */}
            <Pagination count={count} page={p} />
        </div>
    );
}

export default ExamList;