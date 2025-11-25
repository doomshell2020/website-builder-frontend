"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ToggleRight, ToggleLeft, Edit, Plus, ChevronDown, History, Eye, Wallet, Mail, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSubscriptionsByUserId, updateSubscriptionStatus, updatePaymentStatus, searchSubscription, sendEmail, InactivateExpiredSubs } from "@/services/subscription.service";
import { getAllUsers } from "@/services/userService";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/price";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { SubscriptionAttribute } from "@/types/subscription";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import Loader from '@/components/ui/loader'
import { Label } from "@/components/ui/Label";
import { generateInvoicePdf } from "@/components/InvoicePdf"

export default function BillingListPage() {
    const router = useRouter();
    const params = useParams();
    const id = String(params.id);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<SubscriptionAttribute[]>([]);
    const [filteredData, setFilteredData] = useState<SubscriptionAttribute[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [search, setsearch] = useState<{
        searchTerm: string;
        fromDate: Date | null;
        toDate: Date | null;
    }>({
        searchTerm: "",
        fromDate: null,
        toDate: null,
    });

    const handleReset = () => {
        setsearch({
            searchTerm: "",
            fromDate: null,
            toDate: null,
        });
        setSearchQuery("");
        setPage(1);
        setActiveSearch({ searchTerm: "", fromDate: "", toDate: "" });
    };

    const [activeSearch, setActiveSearch] = useState<{ searchTerm: string; fromDate?: string; toDate?: string }>({
        searchTerm: "",
        fromDate: "",
        toDate: "",
    });

    const handleSubscriptionSearch = () => {
        setPage(1);
        const formattedFrom = search.fromDate
            ? `${search.fromDate.getFullYear()}-${String(search.fromDate.getMonth() + 1).padStart(2, "0")}-${String(search.fromDate.getDate()).padStart(2, "0")}`
            : "";

        const formattedTo = search.toDate
            ? `${search.toDate.getFullYear()}-${String(search.toDate.getMonth() + 1).padStart(2, "0")}-${String(search.toDate.getDate()).padStart(2, "0")}`
            : "";

        setActiveSearch({
            searchTerm: search.searchTerm || "",
            fromDate: formattedFrom,
            toDate: formattedTo,
        });
    };

    const fetchData = useCallback(
        async (searchParams = activeSearch, currentPage = page, currentLimit = limit) => {
            try {
                // 1️⃣ Call your Inactivate API silently (no UI, no toast)
                // await InactivateExpiredSubs();
                setLoading(true);
                const isSearchActive =
                    searchParams &&
                    (searchParams.searchTerm.trim() !== "" ||
                        (searchParams.fromDate && searchParams.fromDate !== "") ||
                        (searchParams.toDate && searchParams.toDate !== ""));

                const res = isSearchActive
                    ? await searchSubscription(searchParams, currentPage, currentLimit)
                    : await getSubscriptionsByUserId(id, currentPage, currentLimit);

                const result = res?.result;
                const data: SubscriptionAttribute[] = Array.isArray(result?.data) ? result.data : [];
                setData(data);
                setFilteredData(data);
                setTotalRows(result?.total || 0);
            } catch (error) {
                console.error("Failed to fetch subscription:", error);
            } finally {
                setLoading(false);
            }
        },
        [activeSearch, page, limit]
    );

    useEffect(() => {
        fetchData(activeSearch, page, limit);
    }, [fetchData, activeSearch, page, limit]);

    const [company, setCompanies] = useState([]);
    const handleBack = () => { router.back(); };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1️⃣ Call your Inactivate API silently (no UI, no toast)
                await InactivateExpiredSubs();
                const res: any = await getAllUsers();
                const data: any = Array.isArray(res?.result?.data) ? res.result.data : [];
                setCompanies(data);
            } catch (error) {
                SwalError({ title: "Failed!", message: error?.message ?? "Failed to load Companies.", });
            }
        };

        fetchData();
    }, []);

    // RUNTIME SEARCH
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

            const statusText =
                item.status === "Y" ? "active" :
                    item.status === "N" ? "inactive" : "";

            const dropText =
                item.isdrop === "Y" ? "paid" :
                    item.isdrop === "N" ? "unpaid" : "";

            // PARTIAL STATUS MATCH
            if (["active", "inactive"].some(s => s.startsWith(q))) {
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

    const handleStatusChange = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === "Y" ? "N" : "Y";
        const result = await Swal.fire({
            title: "Are you sure",
            text: `You want to change status to ${newStatus === "Y" ? "active" : "inactive"}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, change it!",
        });

        if (result.isConfirmed) {
            try {
                await updateSubscriptionStatus(id, { status: newStatus });
                Swal.fire("Updated!", "Subscription status has been changed.", "success");
                fetchData();
            } catch {
                Swal.fire("Error", "Failed to update status.", "error");
            }
        }
    };

    const handlePaymentStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === "Y" ? "N" : "Y";
        const result = await Swal.fire({
            title: "Are you sure",
            text: `You want to mark payment as ${newStatus === "Y" ? "paid" : "unpaid"}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, change it!",
        });

        if (result.isConfirmed) {
            try {
                await updatePaymentStatus(id, { isdrop: newStatus });
                Swal.fire("Updated!", "Payment status has been changed.", "success");
                fetchData();
            } catch {
                Swal.fire("Error", "Failed to update payment status.", "error");
            }
        }
    };

    const handleView = (id: number) => {
        const invoice = data.find(item => Number(item.id) === Number(id));
        if (!invoice) {
            console.warn("Invoice not found for ID:", id, data);
            return;
        }
        setSelectedInvoice(invoice);
        setOpenCustomerDetail(true);
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

    const handleSendEmail = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure",
            text: `You want to send email?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Send",
        });

        if (result.isConfirmed) {
            try {
                const emailData = await sendEmail(id);
                if (emailData?.result == 'true') {
                    Swal.fire("Updated!", "Email have been send successfully.", "success");
                    fetchData();
                } else {
                    Swal.fire("Error", "Failed to send email.", "error");
                }
            } catch (error: any) {
                Swal.fire("Error", error?.message ?? "Failed to send email.", "error");
            }
        }
    };

    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [openCustomerDetail, setOpenCustomerDetail] = useState(false);

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

    const StatusPill = ({ type }) => {
        const styles = {
            Y: "bg-green-100 text-green-700",
            N: "bg-red-100 text-red-700",
            default: "bg-gray-200 text-gray-600"
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[type] || styles.default}`}>
                {type === "Y" ? "Active" : type === "N" ? "Inactive" : "N/A"}
            </span>
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
                            title="View Company"
                            onClick={() => router.push(`/admin/users/view/${sub.id}`)}
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
            name: "Company Detail",
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
                                title={
                                    isExpired
                                        ? "Subscription Expired"
                                        : sub?.status === "Y"
                                            ? "Click to deactivate"
                                            : "Click to activate"
                                }
                                disabled={isExpired || !sub?.status}
                                onClick={() =>
                                    !isExpired && handleStatusChange(sub?.id, sub?.status)
                                }
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
                            title={row.isdrop === "Y" ? "Mark as unpaid" : "Mark as paid"}
                            onClick={() => handlePaymentStatus(row.id, row.isdrop)}
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

                        <button
                            title="Update Subscription"
                            disabled={isExpired}
                            onClick={() => router.push(`/admin/subscription/update/${row.id}`)}
                        >
                            <Edit size={18} color={isExpired ? "gray" : "green"} />
                        </button>

                        <button
                            title="Send Email"
                            disabled={row.status === "N" || isExpired}
                            onClick={() => handleSendEmail(row.Customer.id)}
                        >
                            <Mail
                                size={18}
                                className={row.status === "N"
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-purple-600 hover:text-purple-800"}
                            />
                        </button>
                    </div>)
            }
        }
    ], [page, limit]);

    const handleClick = () => { setIsLoading(true); router.push("/admin/subscription/add"); };

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            {/* Billing Manager */}
                            Subscription Records
                        </h2>
                    </div>

                    <header className="bg-white shadow-sm border-b">
                        <div className="mx-auto px-4 sm:px-6 lg:px-4 bg-white rounded-lg shadow-sm border py-4 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                {/* <div className="flex md:col-span-3 gap-4 items-end">
                                    <div className="flex flex-col w-[70%]">
                                        <Label className="text-sm font-medium">Company</Label>
                                        <div className="relative">
                                            <select
                                                id="company"
                                                className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-white border border-gray-300 rounded-[5px] appearance-none dark:bg-dark-900 h-10 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
                                                value={search.searchTerm}
                                                onChange={(e) =>
                                                    setsearch((prev) => ({
                                                        ...prev,
                                                        searchTerm: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">
                                                    -- Select Company --
                                                </option>
                                                {company.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.company_name}
                                                    </option>
                                                ))}
                                            </select>

                                            <ChevronDown
                                                size={16}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-[120%]">
                                        <div className="w-full flex gap-2">
                                            <div>
                                                <Label className="text-sm font-medium">Invoice From Date</Label>
                                                <DatePicker
                                                    selected={search.fromDate}
                                                    maxDate={search.toDate}
                                                    onChange={(date: Date | null) =>
                                                        setsearch((prev) => ({ ...prev, fromDate: date }))
                                                    }
                                                    placeholderText="From Date"
                                                    className="w-full text-sm h-10 px-2 border border-gray-200 shadow-lg rounded-[5px] text-black"
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium">Invoice To Date</Label>
                                                <DatePicker
                                                    selected={search.toDate}
                                                    minDate={search.fromDate}
                                                    onChange={(date: Date | null) =>
                                                        setsearch((prev) => ({ ...prev, toDate: date }))
                                                    }
                                                    placeholderText="To Date"
                                                    className="w-full text-sm h-10 px-2 border border-gray-200 shadow-lg rounded-[5px] text-black"
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex gap-2 items-end">
                                        <Button
                                            onClick={handleSubscriptionSearch}
                                            className={`max-w-[30] text-white rounded-[5px] bg-blue-500 hover:bg-blue-700`}  >
                                            Search
                                        </Button>
                                        <Button
                                            onClick={handleReset}
                                            className={`max-w-[30] text-white rounded-[5px] bg-yellow-600 hover:bg-yellow-700`} >
                                            Reset
                                        </Button>
                                    </div>
                                </div> */}
                                <div className="flex md:col-span-3 gap-4 items-end">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-medium text-gray-800">
                                            {/* Billing Manager
                                            Orders/Invoice Manager */}
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
                                    <div className="flex flex-row gap-2 ml-2">
                                        <Button
                                            type="button"
                                            title="Click to go back"
                                            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-[5px]"
                                            onClick={handleBack}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            title="Add Subscription"
                                            onClick={handleClick}
                                            className="min-w-[80px] p-2 rounded-[5px] bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            {isLoading
                                                ? (<span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>)
                                                : (<> <Plus className="h-5 w-5 text-white" /> Add Subscription </>)}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* <hr /> */}

                    {/* <div className="flex justify-between items-center mt-2 mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                             Billing Manager  
                            Orders/Invoice Manager 
                        </h2>
                        <Input
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-[200px]"
                        />
                    </div> */}

                    <div className="relative">
                        {loading ? (<Loader />) : (
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
                        )}
                    </div>
                </div>
            </main >
            {openCustomerDetail && selectedInvoice && (() => {
                // ----------------- SAFE CALCULATIONS -----------------
                function numberToWords(num) {
                    if (num === 0) return "Zero Rupees Only";

                    const a = [
                        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
                        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
                        "Sixteen", "Seventeen", "Eighteen", "Nineteen"
                    ];

                    const b = [
                        "", "", "Twenty", "Thirty", "Forty", "Fifty",
                        "Sixty", "Seventy", "Eighty", "Ninety"
                    ];

                    const toWords = (n) => {
                        if (n < 20) return a[n];
                        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
                        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + toWords(n % 100) : "");
                        return "";
                    };

                    const crore = Math.floor(num / 10000000);
                    const lakh = Math.floor((num % 10000000) / 100000);
                    const thousand = Math.floor((num % 100000) / 1000);
                    const hundred = Math.floor((num % 1000) / 100);

                    let result = "";

                    if (crore) result += toWords(crore) + " Crore ";
                    if (lakh) result += toWords(lakh) + " Lakh ";
                    if (thousand) result += toWords(thousand) + " Thousand ";
                    if (hundred) result += toWords(hundred) + " Hundred ";

                    const last = num % 100;
                    if (last) result += toWords(last) + " ";

                    return result.trim() + " Rupees Only";
                }
                const roundedPrice = Number(selectedInvoice?.plantotalprice || 0).toFixed(2);
                const hasIGST = Number(selectedInvoice.igst) > 0;

                return (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2 sm:p-4">
                        <div className="bg-white w-full max-w-[900px] max-h-[95vh] rounded shadow-xl overflow-hidden">
                            <div className="overflow-y-auto max-h-[95vh] p-4">
                                {/* HEADER */}
                                <div className="bg-[#3b414f] text-white px-4 sm:px-6 py-3 flex justify-between items-center">
                                    <h2 className="text-base sm:text-lg font-semibold">Invoice Detail</h2>
                                    <button
                                        onClick={() => setOpenCustomerDetail(false)}
                                        className="text-white text-xl hover:text-gray-200"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* BODY */}
                                <div className="p-4 sm:p-6">

                                    {/* TOP SECTION */}
                                    <div className="flex flex-col sm:flex-row justify-between border-b pb-4 gap-3">
                                        <div>
                                            <h3 className="font-bold text-lg">Doomshell</h3>
                                            <p className="text-xs sm:text-sm text-gray-700">A-3 Mall Road, Vidhyadhar Nagar, jaipur 302039 India</p>
                                        </div>

                                        <div className="text-right text-xs sm:text-sm">
                                            <p className="font-semibold">Invoice</p>
                                            <p className="mt-1">
                                                <span className="font-semibold">Invoice No:</span> {selectedInvoice.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* BILLING TO */}
                                    <div className="mt-4 border-b pb-4">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Billing To:</p>

                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-sm sm:text-base">{selectedInvoice.Customer?.company_name}</p>
                                            <p className="text-gray-600 text-sm whitespace-nowrap font-bold">
                                                Invoice Date: <span>{formatDate(selectedInvoice.created)}</span>
                                            </p>
                                        </div>


                                        <p className="text-xs sm:text-sm text-gray-700">{selectedInvoice.Customer?.mobile_no}</p>
                                        <p className="text-xs sm:text-sm text-gray-700">{selectedInvoice.Customer?.address1}</p>
                                        <p className="text-xs sm:text-sm text-gray-700">GST: {selectedInvoice.Customer?.gstin}</p>
                                    </div>

                                    {/* DESCRIPTION TABLE */}
                                    <div className="mt-4 overflow-x-auto">
                                        <table className="w-full border border-gray-300 text-xs sm:text-sm">
                                            <thead>
                                                <tr className="bg-[#3b414f] text-white">
                                                    <th className="text-left p-2">Description</th>
                                                    <th className="text-right p-2">Amount (In Rs.)</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="border-b">
                                                    <td className="p-3">
                                                        <div>
                                                            <p className="font-semibold">{selectedInvoice.Plan?.name}</p>
                                                        </div>

                                                        <p className="mt-1">
                                                            Plan @ Rs. {selectedInvoice?.per_user_rate}
                                                        </p>

                                                        <p className="text-gray-600">
                                                            •Billing Period : {formatDate(selectedInvoice.created, "DD-MM-YYYY")} to {formatDate(selectedInvoice.expiry_date)}
                                                        </p>

                                                        <p className="mt-2">Thank you for your Business!</p>
                                                    </td>

                                                    <td className="text-right p-3 font-semibold">
                                                        ₹{selectedInvoice.plantotalprice}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* TOTALS SECTION */}
                                    <div className="flex justify-end mt-4">
                                        <div className="w-full sm:w-1/3 text-xs sm:text-sm mr-1">

                                            {/* Subtotal */}
                                            <p className="flex justify-between border-b py-1">
                                                <span>Sub Total</span>
                                                <span>₹{selectedInvoice?.per_user_rate}</span>
                                            </p>

                                            {/* Discount */}
                                            <p className="flex justify-between border-b py-1">
                                                <span>Discount</span>
                                                <span>- ₹{selectedInvoice?.discount}</span>
                                            </p>

                                            {/* GST — IGST OR CGST+SGST */}
                                            {hasIGST ? (
                                                <p className="flex justify-between border-b py-1">
                                                    <span>IGST (18%)</span>
                                                    <span>₹{selectedInvoice?.igst}</span>
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="flex justify-between border-b py-1">
                                                        <span>CGST (9%)</span>
                                                        <span>₹{selectedInvoice?.cgst}</span>
                                                    </p>

                                                    <p className="flex justify-between border-b py-1">
                                                        <span>SGST (9%)</span>
                                                        <span>₹{selectedInvoice?.sgst}</span>
                                                    </p>
                                                </>
                                            )}

                                            {/* Total Tax */}
                                            <p className="flex justify-between text-sm font-bold py-2 text-gray-800">
                                                <span>Total Tax (18%)</span>
                                                <span>₹{selectedInvoice?.taxprice}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* TOTAL ORDER VALUE */}
                                    <div className="flex justify-end mt-2">
                                        <div className="w-full sm:w-1/3 bg-[#3b414f] text-white px-2 py-2 text-xs sm:text-sm font-semibold text-right rounded flex justify-between">
                                            <p>Total Order Value — </p>
                                            <p>₹{(Math.round(Number(roundedPrice)))}</p>
                                        </div>
                                    </div>

                                    {/* AMOUNT IN WORDS */}
                                    <p className="mt-6 text-xs sm:text-sm font-semibold flex justify-between">
                                        Amount in Words:{" "}
                                        <span className="font-bold">
                                            {numberToWords(Math.round(Number(roundedPrice)))}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>)
            })()}
        </div >
    );
};