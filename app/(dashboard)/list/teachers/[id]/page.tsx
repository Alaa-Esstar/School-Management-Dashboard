import Announcements from "@/app/components/Announcements";
import BigCalendar from "@/app/components/BigCalendar";
import FormModal from "@/app/components/FormModal";
import Performance from "@/app/components/Performance";
import Image from "next/image";
import Link from "next/link";

const SingleTeacherPage = () => {
    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* Left */}
            <div className="w-full xl:w-2/3">
                {/* Top */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* User info card */}
                    <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="teacher image" width={144} height={144} className="size-36 rounded-full object-cover" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">Leonard Synder</h1>
                                <div className="border rounded-full border-white">
                                    <FormModal table="teacher" type="update" data={{
                                        id: 1,
                                        username: "deangd",
                                        email: "test@test.com",
                                        password: "xxxxxxxx",
                                        firstName: "Dean",
                                        lastName: "Dean",
                                        phone: "qs4d56464",
                                        address: "asdjbsfgauh saodjai",
                                        bloodType: "A+",
                                        dateOfBirth: "2000-01-01",
                                        sex: "Male",
                                        img: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
                                    }} />
                                </div>
                            </div>
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
                                <h1 className="text-xl font-semibold">2</h1>
                                <span className="text-sm text-gray-400">Branches</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[47%] xl:w-[47%] 2xl:w-[48%]">
                            <Image src="/singleLesson.png" alt="single Lesson" width={24} height={24} className="size-6" />
                            <div>
                                <h1 className="text-xl font-semibold">6</h1>
                                <span className="text-sm text-gray-400">Lessons</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[47%] xl:w-[47%] 2xl:w-[48%]">
                            <Image src="/singleClass.png" alt="single Class" width={24} height={24} className="size-6" />
                            <div>
                                <h1 className="text-xl font-semibold">6</h1>
                                <span className="text-sm text-gray-400">Classes</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom */}
                <div className="mt-4 bg-white rounded-md p-4">
                    <h1>Teacher&rsquo;s Schedule</h1>
                    <BigCalendar />
                </div>
            </div>
            {/* Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/classes?supervisorId=${"teacher2"}`} >Teacher&rsquo;s Classes</Link>
                        <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/students?teacherId=${"teacher2"}`} >Teacher&rsquo;s Students</Link>
                        <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/lessons?teacherId=${"teacher2"}`} >Teacher&rsquo;s Lessons</Link>
                        <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?teacherId=${"teacher2"}`} >Teacher&rsquo;s Exams</Link>
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?teacherId=${"teacher2"}`} >Teacher&rsquo;s Assignments</Link>
                    </div>
                </div>
                <Performance />
                <Announcements />
            </div>
        </div>
    );
}

export default SingleTeacherPage;