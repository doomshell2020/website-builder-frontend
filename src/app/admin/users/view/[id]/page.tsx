"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MoveLeft, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getUserById } from "@/services/userService";
import { User } from "@/types/user";
import Loader from "@/components/ui/loader";
import { formatDate } from "@/lib/date";
import Link from "next/link";

const UsersViewPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const handleBack = () => router.back();

    const fetchData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res: any = await getUserById(id as string);
            setData(res?.result || null);
        } catch (err) {
            console.error("Error fetching customer:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <Loader />;
    if (!data) return <p className="text-center text-gray-500 mt-10">No customer data found.</p>;
    const companyLogo = data.company_logo
        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.company_logo}`
        : "/assest/image/defaultCompanyLogo.png";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-14">
                        <Button
                            onClick={handleBack}
                            className="flex items-center justify-center w-9 h-9 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                            <MoveLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-semibold text-gray-800 ml-3">
                            User Detail
                        </h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-10 grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* LEFT SIDE */}
                        <div className="space-y-10">
                            {/* Personal Information */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Personal Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Full Name</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {data.name || "N/A"}
                                        </p>
                                        <span
                                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${data.status === "Y"
                                                ? "bg-green-100 text-green-700 border border-green-300"
                                                : "bg-red-100 text-red-700 border border-red-300"
                                                }`}
                                        >
                                            {data.status === "Y" ? "Active" : "Inactive"}
                                        </span>

                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Mobile Number</p>
                                        <p className="text-base text-gray-800">
                                            {data.mobile_no ? `+91 ${data.mobile_no}` : "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Email</p>
                                        <p className="text-base text-gray-800">{data.email || "N/A"}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Address Information */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Address Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Current Address</p>
                                        <p className="text-base text-gray-800">{data.address1 || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Permanent Address</p>
                                        <p className="text-base text-gray-800">{data.address2 || "N/A"}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="space-y-10">
                            {/* Company Details */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Company Details
                                </h2>

                                <div className="space-y-4">


                                    <div className="flex items-center justify-between gap-4 mb-6">
                                        {/* Left Side: Company Info */}
                                        <div className="flex flex-col space-y-2">
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Company Name</p>
                                                <p className="text-base text-gray-800 font-semibold">
                                                    {data.company_name || "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Company Theme</p>
                                                <p className="text-base text-gray-800">
                                                    {data.Theme?.name || data.websiteType?.name || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side: Company Logo */}
                                        <div className="w-28 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shadow-sm">
                                            <Image
                                                src={companyLogo}
                                                alt="Company Logo"
                                                width={96}
                                                height={96}
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Database Name</p>
                                        <p className="text-base text-gray-800">
                                            {data.schema_name || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Company Subdomain</p>
                                        <p className="text-base text-gray-800">
                                            {data.subdomain || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Company Phone No.</p>
                                        <p className="text-base text-gray-800">
                                            {data.office_no || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">GSTIN</p>
                                        <p className="text-base text-gray-800">
                                            {data.gstin || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Contact / Social Links */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                                    Contact & Social Links
                                </h2>
                                <div className="space-y-3">
                                    {data.fburl && (
                                        <Link
                                            href={data.fburl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                                        >
                                            <Facebook className="w-4 h-4" />
                                            <span>Facebook</span>
                                        </Link>
                                    )}

                                    {data.xurl && (
                                        <Link
                                            href={data.xurl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                                        >
                                            <Twitter className="w-4 h-4" />
                                            <span>X (Twitter)</span>
                                        </Link>
                                    )}

                                    {data.linkedinurl && (
                                        <Link
                                            href={data.linkedinurl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            <span>LinkedIn</span>
                                        </Link>
                                    )}

                                    {data.instaurl && (
                                        <Link
                                            href={data.instaurl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                                        >
                                            <Instagram className="w-4 h-4" />
                                            <span>Instagram</span>
                                        </Link>
                                    )}

                                    {data.yturl && (
                                        <Link
                                            href={data.yturl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                                        >
                                            <Youtube className="w-4 h-4" />
                                            <span>YouTube</span>
                                        </Link>
                                    )}

                                    {!data.fburl &&
                                        !data.xurl &&
                                        !data.linkedinurl &&
                                        !data.instaurl &&
                                        !data.yturl && (
                                            <p className="text-gray-400 text-sm italic">
                                                No social links provided
                                            </p>
                                        )}
                                </div>

                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="max-w-6xl mx-auto mt-10 px-4 text-sm text-gray-500 text-right">
                        <p>
                            Created On:{" "}
                            <span className="font-medium text-gray-700">
                                {formatDate(data.createdAt, "DD MMM YYYY, hh:mm A")}
                            </span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UsersViewPage;