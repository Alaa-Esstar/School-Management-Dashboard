"use client"

import Image from "next/image";
import { useState } from "react";

const FormModal = ({ table, type, data, id }: {
    table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignement" | "result" | " attendance" | "event" | "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number;
}) => {
    const size = type === "create" ? "size-8" : "size-7"
    const bgColor = type === "create" ? "bg-lamaYellow" : type === "update" ? "bg-lamaSky" : "bg-lamaPurple";

    const [open, setOpen] = useState(false);

    const Form = () => {
        return type === "delete" && id ? (
            <form action="" className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this {table}</span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
            </form>
        ) : "create or update form "
    }

    return (
        <>
            <button className={`${size} ${bgColor} flex items-center justify-center rounded-full`} onClick={() => setOpen(true)} >
                <Image src={`/${type}.png`} alt={`${type}`} width={14} height={14} />
            </button>
            {open &&
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] ">
                        <Form />
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
                            <Image src="/close.png" alt="close" width={14} height={14} />
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default FormModal;