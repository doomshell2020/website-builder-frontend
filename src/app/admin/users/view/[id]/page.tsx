"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { getUserById } from "@/services/userService";
import { User } from "@/types/user";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/date";
import Loader from "@/components/ui/loader";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, } from "lucide-react";
import DomainSetup from "@/components/domains/CustomDomainSetup";

const UsersViewPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [allData, setAllData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const handleBack = () => {
        router.back();
    };

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res: any = await getUserById(id as string);
            setAllData([res]);
        } catch (err) {
            console.error("Error fetching user:", err);
            setAllData([]);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [id, fetchData]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b mb-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-start items-center">
                    <Button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 hover:bg-blue-700 rounded-[5px] font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        aria-label="Go back"
                    >
                        <MoveLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-800 ml-2">
                        User Detail
                    </h1>
                </div>
            </header>

            {/* Main Content Area (relative for loader overlay) */}
            <div className="relative max-w-4xl mx-auto p-4">
                {/* Loader Overlay */}
                {loading ? (<Loader />) : (
                    <main className="bg-white shadow-md rounded-lg p-4">
                        {allData.length === 0 ? (
                            <p className="text-center text-gray-500">No customer data found.</p>
                        ) : (
                            <div className="grid gap-8 grid-cols-1 md:grid-cols xl:grid-cols">
                                {allData.map((user, index) => {
                                    const data = user?.result;
                                    const imageUrl = data?.image
                                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.image}`
                                        : "/assest/image/defaultUser.webp";
                                    const companyLogoUrl = data?.company_logo
                                        && `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.company_logo}`

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex flex-col space-y-4"
                                        >
                                            {/* Profile Section */}
                                            <div className="flex justify-between items-center space-x-4 mb-2">
                                                <div className="flex items-center space-x-4 mb-2">
                                                    <Image
                                                        src={imageUrl}
                                                        alt="Profile"
                                                        width={80}
                                                        height={80}
                                                        className="w-28 h-28 object-cover rounded-full border-4 border-gray-100"
                                                    />
                                                    <div>
                                                        <h1 className="text-lg font-semibold text-gray-800">
                                                            {data?.name}
                                                        </h1>
                                                        <p className="text-sm text-gray-500">{data?.email}</p>
                                                        <p
                                                            className={`text-xs font-medium px-2 py-1 mt-1 rounded-full w-fit ${data?.status == "Y"
                                                                ? "text-green-700 bg-green-100"
                                                                : "text-red-700 bg-red-100"
                                                                }`}
                                                        >
                                                            {data?.status == "Y" ? "Active" : "Inactive"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                <Info label="Mobile No." value={data?.mobile_no?.toString()} />
                                                <Info label="Phone No." value={data?.office_no?.toString()} />
                                                <Info label="Fax No." value={data?.fax_no} />
                                                <Info label="Company" value={data?.company_name} />
                                                {data?.gstin &&
                                                    <Info label="GST no." value={data?.gstin} />
                                                }
                                                <Info label="Current Address" value={data?.address1} />
                                                {data?.address2 &&
                                                    <Info label="Parmanent Address" value={data?.address2} />
                                                }
                                                <Info label="Created" value={formatDate(data?.createdAt, "DD-MM-YYYY hh:mm A",)} />
                                                <div>
                                                    <Label className="text-[0.83rem] text-gray-600">Company Logo</Label>
                                                    <div className="w-32 h-28 rounded-2 overflow-hidden flex items-center border-2 border-gray-300">
                                                        {companyLogoUrl ? (
                                                            <img
                                                                src={companyLogoUrl}
                                                                alt="Company Logo"
                                                                className="object-cover w-auto h-auto"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                                                                No Logo
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Social Links Section */}
                                            <div className="mt-4">
                                                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                                                    Social Profiles
                                                </h2>

                                                {data?.fburl?.trim() || data?.xurl?.trim() || data?.linkedinurl?.trim() || data?.instaurl?.trim() || data?.yturl?.trim() ? (
                                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                                        {data.fburl?.trim() && (
                                                            <a
                                                                href={data.fburl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
                                                            >
                                                                <Facebook className="w-5 h-5 text-black hover:text-gray-600" strokeWidth={2.2} />
                                                                <span>Facebook</span>
                                                            </a>
                                                        )}
                                                        {data.xurl?.trim() && (
                                                            <a
                                                                href={data.xurl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-700 hover:text-black flex items-center gap-2 text-sm"
                                                            >
                                                                <Twitter className="w-5 h-5 text-black hover:text-gray-600" strokeWidth={2.2} />
                                                                <span>Twitter</span>
                                                            </a>
                                                        )}
                                                        {data.linkedinurl?.trim() && (
                                                            <a
                                                                href={data.linkedinurl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-700 hover:text-black flex items-center gap-2 text-sm"
                                                            >
                                                                <Linkedin className="w-5 h-5 text-black hover:text-gray-600" strokeWidth={2.2} />
                                                                <span>LinkedIn</span>
                                                            </a>
                                                        )}
                                                        {data.instaurl?.trim() && (
                                                            <a
                                                                href={data.instaurl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-700 hover:text-black flex items-center gap-2 text-sm"
                                                            >
                                                                <Instagram className="w-5 h-5 text-black hover:text-gray-600" strokeWidth={2.2} />
                                                                <span>Instagram</span>
                                                            </a>
                                                        )}
                                                        {data.yturl?.trim() && (
                                                            <a
                                                                href={data.yturl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-700 hover:text-black flex items-center gap-2 text-sm"
                                                            >
                                                                <Youtube className="w-5 h-5 text-black hover:text-gray-600" strokeWidth={2.2} />
                                                                <span>Youtube</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-400 text-sm italic">
                                                        No social links provided
                                                    </p>
                                                )}
                                            </div>
                                            {/* 🌐 Custom Domain Setup Section */}
                                            <div className="mt-8 border-t pt-6">
                                                <h2 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
                                                    🌐 Custom Domain Setup
                                                </h2>
                                                {/* <DomainSetup userId={id} /> */}
                                                <DomainSetup userId={Array.isArray(id) ? id[0] : id} />;
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                )}
            </div>
        </div >
    );
};

export default UsersViewPage;
// 🧩 Reusable Field Component
const Info = ({
    label,
    value,
    isLink = false,
}: {
    label: string;
    value?: string | null;
    isLink?: boolean;
}) => (
    <div className="flex flex-col max-w-[320px]">
        <span className="font-medium text-gray-600">{label}</span>
        {isLink && value ? (
            <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline "
            >
                {value}
            </a>
        ) : (
            <span className="text-gray-900 break-all whitespace-pre-wrap">
                {value || "N/A"}
            </span>
        )}
    </div>

);