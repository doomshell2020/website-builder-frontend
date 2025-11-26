"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FileText } from "lucide-react";
import { logout } from "@/lib/auth";
import { AdminProfile } from "@/services/admin.service";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import { getUserSubscriptionsById, getUserSubscriptionByInvoiceId } from "@/services/subscription.service";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/price";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { SubscriptionAttribute } from "@/types/subscription";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import Loader from '@/components/ui/loader'
import { generateInvoicePdf } from "@/components/InvoicePdf"

export default function BillingListPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<SubscriptionAttribute[]>([]);
    const [filteredData, setFilteredData] = useState<SubscriptionAttribute[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [userId, setUserId] = useState<string | number>("");
    const [subscription, setSubscription] = useState<SubscriptionAttribute | null>(null);
    const handleBack = () => { router.back(); };

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            try {
                const res = await AdminProfile();
                const data: any = res.result;
                const fetchedId = data?.id;
                setUserId(fetchedId);
            } catch (error) {
                // SwalError({ title: "Error", message: error?.message ?? "Failed to load user data." });
                console.log("Failed to load user data.", error?.message);
                // logout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const fetchAllData = useCallback(
        async (currentPage = page, currentLimit = limit) => {
            if (!userId) return;

            try {
                setLoading(true);

                const [subsListRes, activeSubRes]: any = await Promise.all([
                    getUserSubscriptionsById(userId, currentPage, currentLimit),
                    getUserSubscriptionByInvoiceId(userId)
                ]);

                // List data
                const result = subsListRes?.result;
                const data: SubscriptionAttribute[] = Array.isArray(result?.data) ? result.data : [];
                setData(data);
                setFilteredData(data);
                setTotalRows(result?.total || 0);

                // Active subscription
                setSubscription(activeSubRes?.result || null);

            } catch (error) {
                console.error("Failed to fetch subscription data:", error);
            } finally {
                setLoading(false);
            }
        },
        [userId, page, limit]
    );

    useEffect(() => {
        fetchAllData(page, limit);
    }, [fetchAllData]);

    const normalize = (str: string) => str.toLowerCase().trim().replace(/[\s₹,.-]/g, "");
    const normalizeNumber = (num: any) => String(num || "").toLowerCase().replace(/[^0-9]/g, "");

    const formatForSearch = (dateStr: string) => {
        if (!dateStr) return "";
        return dateStr.replace(/[-\/]/g, ""); // convert 17-11-2025 → 17112025
    };

    const handleSearch = (value: string) => {
        setSearchText(value);

        const q = normalize(value);
        if (!q) { setFilteredData(data); return; }

        const filtered = data.filter((item) => {
            // ================= CUSTOMER FIELDS =================
            const company = normalize(item.Customer?.company_name || "");
            const email = normalize(item.Customer?.email || "");

            // ================= PLAN FIELDS =================
            const planName = normalize(item.Plan?.name || "") + "plans";
            const planPrice = normalizeNumber(item.Plan?.price);
            const planTotalPrice = normalizeNumber(item.plantotalprice);

            const planDesc = normalize(
                `${item.totaluser || 0} users plan @ rs.${item.Plan?.price || 0}`
            );

            const invoiceId = "#" + String(item.id);
            const invoiceIdNormalized = normalize(invoiceId);

            // ================= STATUS FIELDS =================
            const q = normalize(value);

            const now = new Date();
            const expiry = new Date(item.expiry_date);

            const statusText =
                item.status === "Y" && expiry >= now ? "active" :
                    expiry < now ? "expired" :
                        item.status === "N" ? "inactive" :
                            "";

            const dropText =
                item.isdrop === "Y" ? "paid" :
                    item.isdrop === "N" ? "unpaid" : "";

            // PARTIAL STATUS MATCH
            if (["active", "inactive", "expired"].some(s => s.startsWith(q))) {
                return statusText.startsWith(q);
            }

            // PARTIAL PAYMENT MATCH
            if (["paid", "unpaid"].some(s => s.startsWith(q))) {
                return dropText.startsWith(q);
            }

            // ================= DATES =================
            const startDate = item.created
                ? formatForSearch(formatDate(item.created, "DD-MM-YYYY"))
                : "";

            const expiryDate = item.expiry_date
                ? formatForSearch(formatDate(item.expiry_date, "DD-MM-YYYY"))
                : "";

            const invoiceDate = item.createdAt
                ? formatForSearch(formatDate(item.createdAt, "DD-MM-YYYY"))
                : "";

            const paymentDate = item.payment_date
                ? formatForSearch(formatDate(item.payment_date, "DD-MM-YYYY"))
                : "";

            const dateQuery = q.replace(/[-\/]/g, ""); // allow user to type 17-11-25 or 171125

            return (
                // ================= CUSTOMER =================
                company.includes(q) ||
                email.includes(q) ||

                // ================= PLAN =================
                planName.includes(q) ||
                planPrice.includes(q) ||
                planTotalPrice.includes(q) ||
                planDesc.includes(q) ||

                // ================= INVOICE =================
                invoiceIdNormalized.includes(q) ||
                String(item.id).includes(q) ||

                // ================= DATE SEARCH =================
                startDate.includes(dateQuery) ||
                expiryDate.includes(dateQuery) ||
                invoiceDate.includes(dateQuery) ||
                paymentDate.includes(dateQuery)
            );
        });

        setFilteredData(filtered);
    };

    const handleExportPDF = (invoice: any) => {
        if (!invoice) { console.warn("Invoice missing"); return; }

        const customer = {
            name: invoice.Customer?.name || "",
            address1: invoice.Customer?.address1 || "",
            gstin: invoice.Customer?.gstin || "",
        };

        const plan = {
            name: invoice.Plan?.name || "",
            price: invoice.Plan?.price || ""
        };

        generateInvoicePdf({
            customer,
            plan,
            subscription: invoice,
            filename: "invoice" + (invoice.order_id || invoice.id),
        });
    };

    const LogoImage = ({ src }) => {
        const [imgSrc, setImgSrc] = React.useState(src);

        return (
            <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200 rounded-full">
                <Image
                    src={imgSrc}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-cover"
                    onError={() => setImgSrc("/assest/image/defaultUser.webp")}
                />
            </div>
        );
    };

    const columns = useMemo(() => [
        {
            name: "S.No",
            width: "4.2%",
            cell: (_row, index) => (
                <span className="text-gray-600">
                    {(page - 1) * limit + index + 1}
                </span>
            )
        },
        {
            name: "Company Detail",
            selector: (row) => row?.Customer?.company_name || "",
            sortable: true,
            cell: (row) => {
                const sub = row.Customer;
                const logo = sub?.company_logo
                    ? sub.company_logo.startsWith("http")
                        ? sub.company_logo
                        : `${process.env.NEXT_PUBLIC_IMAGE_URL}${sub.company_logo}`
                    : "/assest/image/defaultUser.webp";

                return (
                    <div className="flex flex-row items-center gap-2">
                        <button
                            className="flex items-center gap-2 text-left transition-transform duration-200 hover:scale-105"
                        > <LogoImage src={logo} />
                            <div className="flex flex-col w-full whitespace-normal break-words">
                                <span className="font-semibold text-gray-800">
                                    {sub?.company_name || "N/A"}
                                </span>
                            </div>
                        </button>
                    </div>
                );
            }
        },
        {
            name: "Customer Details",
            selector: (row) => row?.Customer?.name || row?.Customer?.email || "",
            sortable: true,
            cell: (row) => {
                const user = row?.Customer;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{user.name || "N/A"}</span>
                        <span className="text-sm text-gray-500">{user.email || "N/A"}</span>
                        <span className="text-sm text-gray-500">{user.mobile_no || "N/A"}</span>
                    </div>
                )
            },
            width: "20%",
        },
        {
            name: "Plan Details",
            selector: (row) => row?.Plan?.name,
            sortable: true,
            cell: (row) => {
                const plan = row.Plan;

                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                            {plan.name} Plan
                        </span>
                        <span className="text-xs text-gray-500">
                            ₹{formatPrice(plan.price)} / year
                        </span>
                    </div>
                );
            }
        },
        {
            name: "Invoice Details",
            selector: (row) => row.id,
            sortable: true,
            width: "11%",
            cell: (row) => (
                <div className="flex flex-col text-xs">
                    <span className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">ID:</span>
                        <button
                            title="View Invoice"
                            onClick={() => handleExportPDF(row)}
                            className="text-blue-600 hover:underline"
                        >
                            #{row.id}
                        </button>
                    </span>

                    <span className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">Date:</span>
                        {row.createdAt ? formatDate(row.createdAt) : "—"}
                    </span>
                </div>
            )
        },
        {
            name: "Subscription Details",
            width: "14%",
            cell: (row) => {
                const sub = row;
                const start = sub?.created ? formatDate(sub.created, "DD-MM-YYYY") : "—";
                const expiryDate = sub?.expiry_date ? new Date(sub.expiry_date) : null;
                const today = new Date();
                const isExpired = expiryDate ? expiryDate < today : false;
                const end = sub?.expiry_date ? formatDate(sub.expiry_date, "DD-MM-YYYY") : "—";

                // Handle status mapping
                let status = "N/A";
                if (isExpired) status = "Expired";
                else status = sub?.status === "Y" ? "Active" : "Inactive";

                // Colors based on situation
                const statusClasses =
                    isExpired
                        ? "bg-red-200 text-red-700"
                        : sub?.status === "Y"
                            ? "bg-green-100 text-green-700"
                            : sub?.status === "N"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-200 text-gray-600";

                return (
                    <div className="flex flex-col text-xs leading-tight gap-1">

                        {/* Date Range */}
                        <span className="flex items-center gap-1">
                            <span>{start}</span>
                            <span>-</span>
                            <strong className={isExpired ? "text-red-700" : "text-gray-700"}>
                                {end}
                            </strong>
                        </span>

                        <div className="flex flex-row gap-2 items-center">

                            {/* STATUS PILL */}
                            <button
                                // title={
                                //     isExpired
                                //         ? "Subscription Expired"
                                //         : sub?.status === "Y"
                                //             ? "Click to deactivate"
                                //             : "Click to activate"
                                // }
                                disabled={isExpired || !sub?.status}
                                // onClick={() =>
                                //     !isExpired && handleStatusChange(sub?.id, sub?.status)
                                // }
                                className="w-fit disabled:cursor-not-allowed"
                            >
                                <span
                                    className={`px-2 py-0.5 text-[12px] font-semibold rounded-full ${statusClasses}`}
                                > {status} </span>
                            </button>
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Payment Details",
            selector: (row) => row.isdrop, // sorting based on payment date
            sortable: true,
            width: "11%",
            cell: (row) => {
                const statusText = row.isdrop === "Y" ? "Paid" : "Unpaid";
                return (
                    <div className="flex flex-col text-xs">
                        <span>
                            <span className="font-semibold text-gray-900">Date:</span>{" "}
                            {row.payment_date ? formatDate(row.payment_date) : "—"}
                        </span>

                        <button
                            // title={row.isdrop === "Y" ? "Mark as unpaid" : "Mark as paid"}
                            // onClick={() => handlePaymentStatus(row.id, row.isdrop)}
                            className="w-fit disabled:cursor-not-allowed"
                        >
                            <span className={`px-2 py-0.5 text-[12px] font-semibold rounded-full ${row.isdrop === "Y" ? "bg-green-100 text-green-700" : "bg-red-200 text-red-700"}`}>
                                {statusText}
                            </span>
                        </button>
                    </div>
                );
            }
        },
        {
            name: <div className="w-full text-right pr-2">Amount</div>,
            width: "8%",
            sortable: true,
            selector: (row) => row.plantotalprice,
            cell: (row) => (
                <div className="w-full text-right pr-2 font-semibold text-gray-800">
                    ₹{formatPrice(row.plantotalprice)}
                </div>
            ),
            sortFunction: (a, b) => Number(a.plantotalprice) - Number(b.plantotalprice)
        },
        {
            name: "Actions",
            width: "8%",
            cell: (row) => {

                const expiryDate = row?.expiry_date ? new Date(row.expiry_date) : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (expiryDate) { expiryDate.setHours(0, 0, 0, 0); }
                const isExpired = expiryDate ? expiryDate < today : false;

                return (
                    <div className="flex gap-2">
                        <button
                            title="View Invoice"
                            onClick={() => handleExportPDF(row)}>
                            <FileText size={18} className="text-red-600 hover:text-red-800" />
                        </button>
                    </div>)
            }
        }
    ], [page, limit]);

    const handleClick = () => { setIsLoading(true); router.push(`/user/subscription/active`); };

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            Active Subscription
                        </h2>
                        {/* <Button
                            title="Click to back"
                            onClick={handleBack}
                            className="min-w-[80px] p-2 rounded-[5px] bg-yellow-600 text-white hover:bg-yellow-700"
                        >
                            {isLoading ? (
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <> Back to Invoices </>
                            )}
                        </Button> */}
                    </div>

                    {loading
                        ? (
                            // 1️⃣ LOADING STATE
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        )
                        : !subscription
                            ? (
                                // 2️⃣ EMPTY RESULT STATE
                                <div className="bg-white border border-gray-200 rounded-xl shadow-md p-10 text-center">
                                    <p className="text-lg font-semibold text-gray-700">
                                        No subscription purchased yet
                                    </p>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        Once you purchase a plan, details will appear here.
                                    </p>
                                </div>
                            )
                            : (
                                <div className="relative bg-white border border-gray-200 rounded-xl shadow-md p-5">
                                    {subscription?.status === 'N' && (
                                        <div className="mb-4 p-2">
                                            <span className="text-2xl font-bold text-red-600"> You currently don’t have an active plan. If you believe this is a mistake, please review your last purchase or contact support.</span>
                                        </div>
                                    )}
                                    <div className="border p-5 rounded-xl shadow-sm bg-white">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-lg font-semibold text-gray-900">{subscription?.Plan?.name} Plan</h2>
                                            <span className={`px-3 py-1 text-sm rounded 
                                            ${subscription?.status === 'Y' ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'}`}>
                                                {subscription?.status === 'Y' ? 'Active' : 'Inactive'}
                                            </span>

                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-4 text-sm text-gray-600">
                                            <p><strong>Price:</strong> ₹{subscription?.Plan?.price || "price"}</p>
                                            <p><strong>Yearly Plan</strong></p>
                                            <p><strong>Start Date:</strong> {formatDate(subscription?.created)}</p>
                                            <p><strong>Expiry Date:</strong> {formatDate(subscription?.expiry_date)}</p>
                                        </div>

                                        {/* <div className="mt-3 text-blue-600 font-medium">
                                            {"daysLeft"} days remaining
                                        </div> */}
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="font-medium text-gray-800 mb-2">Billing & Invoices</h3>
                                        <table className="w-full text-sm border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                                                    <th className="p-2 text-left">Invoice</th>
                                                    <th className="p-2 text-left">Date</th>
                                                    <th className="p-2 text-left">Amount</th>
                                                    <th className="p-2 text-left">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b">
                                                    <td className="p-2">{String(subscription?.id ?? 0).padStart(6, "0")}</td>
                                                    <td className="p-2">{formatDate(subscription?.created)}</td>
                                                    <td className="p-2 font-medium">
                                                        ₹{formatPrice(Math.round(Number(subscription?.plantotalprice ?? "0")))}
                                                    </td>

                                                    <td className="p-2">
                                                        <button className="text-blue-600 hover:underline"
                                                            onClick={() => handleExportPDF(subscription)}>Download PDF</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-800">Renewal Settings</h3>
                                        <p className="text-sm text-gray-600 mt-3">
                                            All renewals and plan changes are managed by our admin team.
                                            If you need help updating your plan, billing details, or if there’s any issue,
                                            please contact our support:
                                        </p>

                                        <div className="mt-2 text-sm text-gray-700">
                                            📧 <strong>contact@doomshell.com</strong><br />
                                            📞 <strong>+91 8005523567</strong>
                                        </div>
                                    </div>
                                    {/* <div className="fixed bottom-8 right-4 flex gap-3">
                                        <Button
                                            onClick={() => handleExportPDF(subscription)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-[6px] hover:bg-green-700">

                                            Download Invoice
                                        </Button>
                                    </div> */}
                                </div>
                            )}
                </div>
            </main >

            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            Invoices & Subscriptions
                        </h2>
                    </div>
                    <header className="bg-white shadow-sm border-b">
                        <div className="mx-auto px-4 sm:px-6 lg:px-4 bg-white rounded-lg shadow-sm border py-4 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

                                <div className="flex md:col-span-3 gap-4 items-end">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-medium text-gray-800">
                                        </h2>
                                        <Input
                                            placeholder="Search"
                                            value={searchText}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="max-w-[200px]"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end relative">
                                    <div className="ml-2">
                                        {/* <Button
                                            title="Click to view active subscription details"
                                            onClick={handleClick}
                                            className="min-w-[80px] p-2 rounded-[5px] bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            {isLoading ? (
                                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            ) : (
                                                <>
                                                    <FileText className="h-5 w-5 text-white" />
                                                    View Active Subscription
                                                </>
                                            )}
                                        </Button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="relative">
                        <PaginatedDataTable
                            title="Subscription"
                            columns={columns}
                            data={filteredData}
                            page={page}
                            itemsPerPage={limit}
                            totalCount={totalRows}
                            onPageChange={setPage}
                            onPerPageChange={(newLimit) => {
                                setLimit(newLimit);
                                setPage(1);
                            }}
                        />
                    </div>
                </div>
            </main >
        </div >
    );
};