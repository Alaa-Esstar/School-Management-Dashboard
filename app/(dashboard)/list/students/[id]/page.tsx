import Announcements from "@/app/components/Announcements";
import BigCalendar from "@/app/components/BigCalendar";
import Performance from "@/app/components/Performance";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = () => {
    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* Left */}
            <div className="w-full xl:w-2/3">
                {/* Top */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* User info card */}
                    <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image src="https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="Student image" width={144} height={144} className="size-36 rounded-full object-cover" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <h1 className="text-xl font-semibold">Cameron blue</h1>
                            <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                                    <Image src="/blood.png" alt="blood type" width={14} height={14} />
                                    <span>A+</span>
                                </div>
                                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                                    <Image src="/date.png" alt="Date" width={14} height={14} />
                                    <span>January 2025</span>
                                </div>
                                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                                    <Image src="/mail.png" alt="Email" width={14} height={14} />
                                    <span>user@gmail.com</span>
                                </div>
                                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                                    <Image src="/phone.png" alt="Phone" width={14} height={14} />
                                    <span>+216 22222222</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Small card */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[47%] xl:w-[47%] 2xl:w-[48%]">
                            <Image src="/singleAttendance.png" alt="single attendance" width={24} height={24} className="size-6" />
                            <div>
                                <h1 className="text-xl font-semibold">90%</h1>
                                <span className="text-sm text-gray-400">Attendance</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[47%] xl:w-[47%] 2xl:w-[48%]">
                            <Image src="/singleBranch.png" alt="single Branch" width={24} height={24} className="size-6" />
                            <div>
                                <h1 className="text-xl font-semibold">6th</h1>
                                <span className="text-sm text-gray-400">Grade</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[47%] xl:w-[47%] 2xl:w-[48%]">
                            <Image src="/singleLesson.png" alt="single Lesson" width={24} height={24} className="size-6" />
                            <div>
                                <h1 className="text-xl font-semibold">18</h1>
                                <span className="text-sm text-gray-400">Lessons</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[47%] xl:w-[47%] 2xl:w-[48%]">
                            <Image src="/singleClass.png" alt="single Class" width={24} height={24} className="size-6" />
                            <div>
                                <h1 className="text-xl font-semibold">6A</h1>
                                <span className="text-sm text-gray-400">Class</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom */}
                <div className="mt-4 bg-white rounded-md p-4">
                    <h1>Student&rsquo;s Schedule</h1>
                    <BigCalendar />
                </div>
            </div>
            {/* Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/lessons?classId=${2}`} >Student&rsquo;s Lessons</Link>
                        <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/teachers?classId=${2}`} >Student&rsquo;s Teachers</Link>
                        <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/results?studentId=${"student2"}`} >Student&rsquo;s Results</Link>
                        <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${2}`} >Student&rsquo;s Exams</Link>
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?classId=${2}`} >Student&rsquo;s Assignments</Link>
                    </div>
                </div>
                <Performance />
                <Announcements />
            </div>
        </div>
    );
}

export default SingleStudentPage;