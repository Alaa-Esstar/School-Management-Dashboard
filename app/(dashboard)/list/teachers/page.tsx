import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { role, teachersData } from "@/app/lib/data";
import prisma from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { Class, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] }

const columns = [
    {
        header: "Info",
        accessor: "info",
        className: "px-2"
    },
    {
        header: "Teacher ID",
        accessor: "teacherid",
        className: "hidden md:table-cell",
    },
    {
        header: "Subjects",
        accessor: "subjects",
        className: "hidden md:table-cell",
    },
    {
        header: "Classes",
        accessor: "classes",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden lg:table-cell",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
]

const renderRow = (item: TeacherList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex flex-col md:flex-row items-center gap-2 p-4">
            <Image src={item.img || "/noAvatar.png"} alt="photo" width={40} height={40} className="md:hidden xl:block size-10 rounded-full object-cover" />
            <div className="flex flex-col items-center md:items-start">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.username}</td>
        <td className="hidden md:table-cell">{item.subjects.map(subject => subject.name).join(",")}</td>
        <td className="hidden md:table-cell">{item.classes.map(clas => clas.name).join(",")}</td>
        <td className="hidden lg:table-cell">{item.phone}</td>
        <td className="hidden lg:table-cell">{item.address}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/teachers/${item.id}`} >
                    <button className="size-7 flex items-center justify-center rounded-full bg-lamaSky">
                        <Image src="/view.png" alt="view" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" && (
                    <FormModal table="teacher" type="delete" id={item.id} />
                )}
            </div>
        </td>
    </tr>
)

const TeacherList = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...queryParams } = await searchParams;
    const p = page ? parseInt(page) : 1;

    const [teachers, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            include: {
                subjects: true,
                classes: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.teacher.count(),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
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
                            <FormModal table="teacher" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={teachers} />
            {/* Pagination */}
            <Pagination page={p} count={count} />
        </div>
    );
}

export default TeacherList;