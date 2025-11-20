"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToggleRight, ToggleLeft, Plus, ChevronDown, Eye, Wallet, Mail, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllSubscriptions, updateSubscriptionStatus, updatePaymentStatus, searchSubscription, sendEmail, InactivateExpiredSubs } from "@/services/subscription.service";
import { getAllUsers } from "@/services/userService";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/price";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { SubscriptionAttribute } from "@/types/subscription";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Loader from '@/components/ui/loader'
import { Label } from "@/components/ui/Label";
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
                    : await getAllSubscriptions(currentPage, currentLimit);

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
    const handleSearch = (value: string) => {
        setSearchText(value);

        if (value.trim() === "") {
            setFilteredData(data);
            return;
        }

        const query = value.toLowerCase();

        const filtered = data.filter((item) => {
            // =============== CUSTOMER ===============
            const company = (item.Customer?.company_name || "").toLowerCase();
            const email = (item.Customer?.email || "").toLowerCase();

            // =============== PLAN ===============
            const planName = (item.Plan?.name || "").toLowerCase();
            const planPrice = String(item.Plan?.price || "").toLowerCase();
            const planDesc = `${item.totaluser || 0} users plan @ rs.${item.Plan?.price || 0}`.toLowerCase();

            // =============== INVOICE FIELDS ===============
            const invoiceId = String(item.id || "").toLowerCase();
            const amount = String(item.plantotalprice || "").toLowerCase();
            const status = (item.status || "").toLowerCase();
            const isdrop = (item.isdrop || "").toLowerCase();

            // =============== DATES (formatted text) ===============
            const startDate = item.created ? formatDate(item.created, "DD-MM-YYYY").toLowerCase() : "";
            const expiryDate = item.expiry_date ? formatDate(item.expiry_date, "DD-MM-YYYY").toLowerCase() : "";
            const invoiceDate = item.createdAt ? formatDate(item.createdAt, "DD-MM-YYYY").toLowerCase() : "";
            const paymentDate = item.payment_date ? formatDate(item.payment_date, "DD-MM-YYYY").toLowerCase() : "";

            return (
                // -------- CUSTOMER --------
                company.includes(query) ||
                email.includes(query) ||

                // -------- PLAN --------
                planName.includes(query) ||
                planPrice.includes(query) ||
                planDesc.includes(query) ||

                // -------- INVOICE --------
                invoiceId.includes(query) ||
                amount.includes(query) ||
                status.includes(query) ||
                isdrop.includes(query) ||

                // -------- DATES --------
                startDate.includes(query) ||
                expiryDate.includes(query) ||
                invoiceDate.includes(query) ||
                paymentDate.includes(query)
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
            text: `You want to mark payment as ${newStatus === "Y" ? "paid" : "pending"}?`,
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

    const handleExportPDF = (id: number) => {
        const invoice = data.find(item => Number(item.id) === Number(id));
        if (!invoice) {
            console.warn("Invoice not found for ID:", id);
            return;
        }
        const customer = {
            name: invoice.Customer?.name || "",
            address1: invoice.Customer?.address1 || "",
            gstin: invoice.Customer?.gstin || "",
        };
        const plan = {
            name: invoice.Plan?.name || "",
            price: invoice.Plan?.price || ""
        };
        const subscription = invoice;
        generateInvoicePdf({
            customer,
            plan,
            subscription,
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

    const columns = useMemo(
        () => [
            {
                name: "S.No",
                selector: (row) => row.id,
                sortable: true,
                cell: (_row: SubscriptionAttribute, index: number) => (page - 1) * limit + index + 1,
                width: "6%",
            },
            {
                name: "Company Detail",
                selector: (row) => row?.Customer?.company_name || "",
                sortable: true,
                cell: (row) => (
                    <div className="flex flex-col leading-5">
                        {/* Company Name */}
                        <span className="font-semibold text-gray-900">
                            {row?.Customer?.company_name || "N/A"}
                        </span>

                        {/* Email */}
                        <span className="text-gray-600 text-sm">
                            {row?.Customer?.email || "N/A"}
                        </span>

                        {/* Plan */}
                        <span className="text-gray-700 text-sm mt-1">
                            {row?.Plan?.name || "N/A"}
                        </span>

                        {/* Plan Description */}
                        <span className="text-gray-500 text-sm">
                            {/* ${row?.totaluser || 0} Users */}
                            {`Plan @ Rs.${formatPrice(row?.Plan?.price) || 0}`}
                        </span>
                    </div>
                ),
            },
            {
                name: "Invoice Detail",
                selector: (row) => row.id,
                sortable: true,
                cell: (row) => (
                    <div className="flex flex-col text-xs leading-tight">

                        {/* Invoice ID */}
                        <div className="flex flex-row">
                            <span className="font-medium text-black">Invoice ID: </span>
                            <button
                                title="Invoice"
                                onClick={() => handleExportPDF(row.id)}
                                className="w-fit text-blue-600 hover:underline hover:text-blue-800"
                            >
                                #{row.id}
                            </button>
                        </div>

                        {/* Invoice Date */}
                        <div className="flex flex-row mt-1">
                            <span className="font-medium text-black">Invoice Date: </span>
                            <span className="text-black ">
                                {row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY") : "—"}
                            </span>
                        </div>

                    </div>
                ),
            },
            {
                name: "Subscription Period",
                width: "16%",
                selector: (row) => row.expiry_date,
                sortable: true,
                cell: (row) => {
                    const isExpired = row.expiry_date && new Date(row.expiry_date) < new Date();

                    return (<div className="flex flex-col text-xs leading-tight">

                        <span className="text-black">
                            <span className="font-medium text-black">Start: </span>
                            {row.created ? formatDate(row.created, "DD-MM-YYYY") : "—"}
                        </span>

                        <span className={isExpired ? "text-red-600 font-semibold" : "text-black"}>
                            <span className="font-medium text-black">End: </span>
                            {row.expiry_date ? formatDate(row.expiry_date, "DD-MM-YYYY") : "—"}
                        </span>

                    </div>
                    )
                }
            },
            // {
            //     name: "Start Date",
            //     selector: (row) =>
            //         row.created
            //             ? formatDate(row.created, "DD-MM-YYYY")
            //             : "—",
            //     sortable: true,
            // },
            // {
            //     name: "Expiry Date",
            //     selector: (row) =>
            //         row.expiry_date
            //             ? formatDate(row.expiry_date, "DD-MM-YYYY")
            //             : "—",
            //     sortable: true,
            // },
            // {
            //     name: "Invoice Date",
            //     selector: (row) =>
            //         row.createdAt
            //             ? formatDate(row.createdAt, "DD-MM-YYYY")
            //             : "—",
            //     sortable: true,
            // },
            // {
            //     name: "Payment Date",
            //     selector: (row) =>
            //         row.payment_date
            //             ? formatDate(row.payment_date, "DD-MM-YYYY")
            //             : "—",
            //     sortable: true,
            // },
            // {
            //     name: "Payment Status",
            //     selector: (row) => row.isdrop,
            //     sortable: true,
            //     width: "12%",
            //     cell: (row) => (
            //         <span
            //             className={`px-2 py-1 text-xs font-semibold rounded-md ${row.isdrop === "Y"
            //                 ? "text-green-700" : "text-red-700 "
            //                 }`}
            //         >
            //             {row.isdrop === "Y" ? "Paid" : "Pending"}
            //         </span>
            //     ),
            // },
            {
                name: "Payment Detail",
                selector: (row) => row.isdrop, // sorting based on payment date
                sortable: true,
                cell: (row) => {
                    const statusText = row.isdrop === "Y" ? "Paid" : "Pending";
                    const statusColor =
                        row.isdrop === "Y" ? "text-green-700" : "text-red-700";

                    return (
                        <div className="flex flex-col text-xs leading-tight">

                            {/* Payment Date */}
                            <span className="text-black">
                                <span className="font-medium text-black">Date: </span>
                                {row.payment_date ? formatDate(row.payment_date, "DD-MM-YYYY") : "—"}
                            </span>

                            {/* Payment Status */}
                            <span className={`font-semibold ${statusColor}`}>
                                <span className="font-medium text-black">Status: </span>
                                {statusText}
                            </span>

                        </div>
                    );
                },
            },
            {
                name: "Amount",
                width: "10%",
                selector: (row) => formatPrice(row.plantotalprice) ?? "N/A",
                // Math.round(Number(row.plantotalprice))
                sortable: true,
                sortFunction: (rowA, rowB) => {
                    return Number(rowA.plantotalprice) - Number(rowB.plantotalprice);
                }
            },
            {
                name: "Actions",
                cell: (row) => (
                    <div className="flex gap-2">
                        <button
                            title="Payment"
                            onClick={() => handlePaymentStatus(row.id, row.isdrop)}
                        // className={
                        //     row.isdrop === "Y"
                        //         ? "px-1 py-0.5 bg-green-500 text-white rounded-[5px]"
                        //         : "px-1 py-0.5 bg-red-500 text-white rounded-[5px]"
                        // }
                        >
                            {row.isdrop === "Y" ? (
                                <Wallet size={18} className="text-green-600 hover:text:green-800" />
                            ) : (
                                <Wallet size={18} className="text-red-600 hover:text:red-800" />
                            )}
                        </button>
                        <button
                            title="status"
                            onClick={() => handleStatusChange(row.id, row.status)}>
                            {row.status === "Y"
                                ? <ToggleRight size={20} className="text-green-500" />
                                : <ToggleLeft size={20} className="text-red-500" />}
                        </button>
                        {/* <button
                            title="view"
                            onClick={() => handleView(Number(row.id))}>
                            <Eye size={18} className="text-blue-500 hover:text-blue-700" />
                        </button> */}
                        <button
                            title="invoice"
                            onClick={() => handleExportPDF(row.id)}>
                            <FileText size={18} className="text-red-600 hover:text-red-800" />
                        </button>
                        <button
                            title="email"
                            onClick={() => handleSendEmail(row?.Customer?.id)}
                            disabled={row?.status === 'N'}
                        >
                            <Mail size={18} className={`${row?.status === 'N'
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-purple-600 hover:text-purple-800"}`}
                            />
                        </button>
                    </div>
                ),
                width: "10%",
            }
        ], [data, page, limit]
    );

    const handleClick = () => { setIsLoading(true); router.push("/admin/subscription/add"); };

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            {/* Billing Manager */}
                            Orders/Invoice Manager
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
                        <div className="flex md:col-span-3">
                            <div className="flex flex-col mr-2">
                                <Label className="text-sm font-medium">Company</Label>
                                <div className="relative">
                                    <select
                                        id="company"
                                        className="max-w-[260px] py-2 pl-3 pr-8 text-sm text-gray-800 bg-white border border-gray-300 rounded-[5px] appearance-none dark:bg-dark-900 h-10 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
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

                            <div className="flex flex-col">
                                <Label className="text-sm font-medium ml-2">Invoice Date</Label>
                                <div className="w-full flex gap-1 ml-2 min-w-[220px] max-w-[260px] ">
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

                            <div className="w-full flex gap-2 ml-6 items-end">
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
                        </div>

                        <div className="flex justify-end relative">
                            <div className="ml-2">
                                <Button
                                    title="Add Users"
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

                    <hr />

                    <div className="flex justify-between items-center mt-2 mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            {/* Billing Manager  */}
                            {/* Orders/Invoice Manager */}
                        </h2>
                        <Input
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-[200px]"
                        />
                    </div>

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