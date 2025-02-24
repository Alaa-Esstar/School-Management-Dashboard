import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import prisma from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { currentUserId, role } from "@/app/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";

type ResultsList = {
    id: number;
    title: string;
    studentName: string;
    studentSurname: string;
    teacherName: string;
    teacherSurname: string;
    score: number;
    className: string;
    startTime: Date;
}

const columns = [
    {
        header: "Title",
        accessor: "title",
        className: "px-2"
    },
    {
        header: "Student",
        accessor: "student",
    },
    {
        header: "Score",
        accessor: "score",
        className: "hidden md:table-cell",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Class",
        accessor: "class",
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

const renderRow = (item: ResultsList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="p-4">{item.title}</td>
        <td>{item.studentName + " " + item.studentSurname}</td>
        <td className="hidden md:table-cell">{item.score}</td>
        <td className="hidden md:table-cell">{item.teacherName + " " + item.teacherSurname}</td>
        <td className="hidden md:table-cell">{item.className}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("fr").format(item.startTime)}</td>
        <td>
            <div className="flex items-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table="result" type="update" data={item} />
                        <FormModal table="result" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const ResultsList = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
    const { page, ...queryParams } = await searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITIONS

    const query: Prisma.ResultWhereInput = {}
    if (queryParams !== undefined) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value) {
                switch (key) {
                    case "studentId":
                        query.studentId = value
                        break;
                    case "search":
                        query.OR = [
                            { exam: { title: { contains: value, mode: "insensitive" } } },
                            { student: { name: { contains: value, mode: "insensitive" } } },
                            { assignment: { title: { contains: value, mode: "insensitive" } } }
                        ]
                        break;
                    default: break;
                }
            }
        }
    }

    // role condition
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.OR = [
                { exam: { lesson: { teacherId: currentUserId! } } },
                { assignment: { lesson: { teacherId: currentUserId! } } },
            ]
            break;
        case "student":
            query.studentId = currentUserId!;
            break;
        case "parent":
            query.student = { parentId: currentUserId! }
        default: break;
    }

    const [dataResponse, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                student: { select: { name: true, surname: true } },
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true, surname: true } }
                            }
                        }
                    }
                },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)

        }),
        prisma.result.count({ where: query })
    ])

    const Results = dataResponse.map((item) => {
        const assesment = item.exam || item.assignment;
        if (!assesment) return null;
        const isExam = "startTime" in assesment;

        return {
            id: item.id,
            title: assesment.title,
            studentName: item.student.name,
            studentSurname: item.student.surname,
            teacherName: assesment.lesson.teacher.name,
            teacherSurname: assesment.lesson.teacher.surname,
            score: item.score,
            className: assesment.lesson.class.name,
            startTime: isExam ? assesment.startTime : assesment.startDate,
        }
    })
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
                            <FormModal table="result" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={Results} />
            {/* Pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default ResultsList;