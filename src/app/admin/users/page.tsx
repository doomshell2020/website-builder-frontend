"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Trash2, ToggleRight, ToggleLeft, Edit, Plus,
    CornerRightDown, CircleAlert, CircleCheckBig, ExternalLink, Link as LinkIcon,
    EyeIcon
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "@/lib/date";
import Swal from "sweetalert2";
import { getAllUsers, deleteUser, updateUserStatus, searchUsers, approveUser } from "@/services/userService";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { User } from "@/types/user";
import { Button } from "@/components/ui/Button";
import { exportToExcel } from "@/lib/exportToExcel";
import { exportToPdf } from "@/lib/exportToPdf";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import Loader from "@/components/ui/loader";
import DomainSetup from "@/components/domains/CustomDomainSetup";

const UsersListPage = () => {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [allData, setAllData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [openCustomDomainSetup, setOpenCustomDomainSetup] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) { setOpen(false); }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, []);

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

    const handleSearch = () => {
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
                setLoading(true);
                const isSearchActive =
                    searchParams &&
                    (searchParams.searchTerm.trim() !== "" ||
                        (searchParams.fromDate && searchParams.fromDate !== "") ||
                        (searchParams.toDate && searchParams.toDate !== ""));

                const res = isSearchActive
                    ? await searchUsers(searchParams, currentPage, currentLimit)
                    : await getAllUsers(currentPage, currentLimit);

                const result = res?.result;
                const data: User[] = Array.isArray(result?.data) ? result.data : [];
                // console.log("data: ", data);
                setAllData(data);
                setFilteredData(data);
                setTotalRows(result?.total || 0);
                setTotalPages(result?.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        },
        [activeSearch, page, limit]
    );

    useEffect(() => {
        fetchData(activeSearch, page, limit);
    }, [fetchData, activeSearch, page, limit]);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure",
            text: "You want to delete this user ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#506ae5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                Swal.fire("Deleted!", "User has been deleted.", "success");
                fetchData();
            } catch {
                Swal.fire("Error!", "Failed to delete user.", "error");
            }
        }
    };

    const handleClick = () => {
        setIsLoading(true);
        router.push("/admin/users/add");
    };

    const handleExport = () => {
        if (filteredData.length === 0) {
            Swal.fire("Error!", "No user data available to export.", "error");
            return;
        }
        const exportData = filteredData.map((row) => ({
            "Company Name": row.company_name || "N/A",
            "User Name": row.name || "N/A",
            "Email": row.email || "N/A",
            "Mobile No": row.mobile_no || "N/A",
            "Subdomain": row.subdomain || "N/A",
            "Custom Domain": row.custom_domain || "N/A",
            "Approval": row.approval || "N/A",
            "Facebook": row.fburl || "N/A",
            "Twitter": row.xurl || "N/A",
            "Instagram": row.instaurl || "N/A",
            "LinkedIn": row.linkedinurl || "N/A",
            "Youtube": row.yturl || "N/A",
            "Address": row.address1 || "N/A",
            // "Status": row.status || "N/A",
            "Created": row.createdAt || "N/A",
        }));
        exportToExcel(exportData, "user_report");
    };

    const handleExportPDF = () => {
        if (filteredData.length === 0) {
            Swal.fire("Error!", "No user data available to Generate PDF.", "error",);
            return;
        }
        exportToPdf({
            data: filteredData,
            filename: "user_report",
            heading: "User Report",
            showSerialNo: true,
            columns: [
                { key: "company_name", label: "Company Name" },
                // { key: "name", label: "User Name" },
                { key: "email", label: "Email" },
                // { key: "mobile_no", label: "Mobile No" },
                { key: "subdomain", label: "Subdomain" },
                { key: "custom_domain", label: "Custom Domain" },
                { key: "approval", label: "Approval Status" },
                { key: "createdAt", label: "Created" },
            ],
        });

    };

    const columns = useMemo(
        () => [
            {
                name: "S.No",
                selector: (_: User, index: number) =>
                    ((page - 1) * limit + index + 1).toString(),
                width: "5%",
            },
            {
                name: "Company Detail",
                cell: (row: User) => {
                    const validLogo =
                        row?.company_logo &&
                            row?.company_logo !== "undefined" &&
                            row?.company_logo.trim() !== ""
                            ? row.company_logo.startsWith("http")
                                ? row.company_logo
                                : `${process.env.NEXT_PUBLIC_IMAGE_URL}${row.company_logo}`
                            : "/assest/image/defaultUser.webp";

                    const [imgSrc, setImgSrc] = React.useState(validLogo);

                    return (
                        <button
                            title="View Company Details"
                            onClick={() => router.push(`/admin/users/view/${row.id}`)}
                            className="flex items-center gap-2 text-blue-600 hover:underline max-w-full truncate"
                        >
                            {/* Logo */}
                            <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200 rounded-full">
                                <Image
                                    src={imgSrc}
                                    alt={`${row.company_name || "Company"} Logo`}
                                    width={36}
                                    height={36}
                                    className="object-cover"
                                    onError={() => setImgSrc("/assest/image/defaultUser.webp")}
                                />
                            </div>

                            {/* Company Name */}
                            <span className="font-medium text-gray-800 truncate max-w-[100px] sm:max-w-[160px] md:max-w-[200px]">
                                {row.company_name || "N/A"}
                            </span>
                        </button>
                    );
                },
                sortable: true,
            },
            {
                name: "Customer Detail",
                selector: (row: User) => row.name || row.email || row.mobile_no || "N/A",
                sortable: true,
                cell: (row: User) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{row.name || "N/A"}</span>
                        <span className="text-sm text-gray-500">{row.email || "N/A"}</span>
                        <span className="text-sm text-gray-500">{row.mobile_no || "N/A"}</span>
                    </div>
                ),
                width: "20%",
            },
            {
                name: "Subdomain",
                selector: (row: User) => row?.subdomain || "N/A",
                cell: (row: User) =>
                    row?.subdomain ? (
                        <div className="flex items-center gap-2">
                            {/* <Link
                                href={`https://${row.subdomain}.baaraat.com`}
                                target="_blank"
                                className="text-blue-600 hover:underline"
                            >
                            </Link> */}
                            {/* {`${row.subdomain}`} */}
                            <Link
                                href={`https://${row.subdomain}.baaraat.com`}
                                target="_blank"
                                className="text-black font-medium hover:text-blue-700" >
                                {/* <ExternalLink className="w-4 h-4" /> */}
                                {/* <LinkIcon className="w-4 h-4" /> */}
                                {`${row.subdomain}`}
                            </Link>
                        </div>
                    ) : (
                        "N/A"
                    ),
                width: "15%",
                sortable: true,
            },
            {
                name: "Custom Domain",
                cell: (row: User) => (
                    <div className="flex items-center justify-start">
                        {row?.custom_domain ? (
                            <div className="flex items-center justify-between flex-row gap-2">
                                <div className="flex items-center text-gray-800 font-medium">
                                    <Link
                                        href={`https://${row.custom_domain}`}
                                        target="_blank"
                                        // title="Visit Domain"
                                        className="text-black font-medium hover:text-blue-700">
                                        {row.custom_domain}
                                    </Link>
                                </div>

                                <div className="flex items-center gap-3 text-gray-500">
                                    <button
                                        onClick={() => {
                                            setSelectedUserId(row.id);
                                            setOpenCustomDomainSetup(true);
                                        }}
                                        // title="Change / Remove Custom Domain"
                                        className="text-blue-500 hover:text-blue-700">
                                        <EyeIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                onClick={() => {
                                    setSelectedUserId(row.id);
                                    setOpenCustomDomainSetup(true);
                                }}
                                className="inline-flex items-center justify-center gap-1 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs md:text-sm font-medium px-2 md:px-2 shadow hover:from-blue-700 hover:to-blue-600 transition-all duration-200 w-full sm:w-auto truncate rounded-[5px]"
                            >
                                <span className="text-base font-bold leading-none">+</span>
                                <span className="hidden sm:inline">Custom Domain</span>
                            </Button>
                        )}
                    </div>
                ),
                sortable: false,
            },
            {
                name: "Subscription",
                width: "15%",
                cell: (row: User) => {
                    const sub = row?.subscriptionData?.[0]; // shorter & safer

                    const start = sub?.created
                        ? formatDate(sub.created, "DD-MM-YYYY")
                        : "—";

                    const end = sub?.expiry_date
                        ? formatDate(sub.expiry_date, "DD-MM-YYYY")
                        : "—";

                    const status = sub?.status === "Y"
                        ? "Active"
                        : sub?.status === "N"
                            ? "Inactive"
                            : "N/A";

                    return (
                        <div className="flex flex-col text-xs leading-tight">
                            <span><strong>Start:</strong> {start}</span>
                            <span><strong>End:</strong> {end}</span>
                            <span><strong>Status:</strong> {status}</span>
                        </div>
                    );
                },
            },
            {
                name: "Approval",
                cell: (row: User) => (
                    <div className="flex space-x-3 items-center w-full justify-center">
                        {row?.roleData?.id === 2 && ( // ✅ Show only if role ID is 2
                            <div
                                className={`${row.approval === "Y" ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                                    }`}
                                title={
                                    row.approval === "Y"
                                        ? "Already approved"
                                        : "Click to approve this user"
                                }
                                onClick={async () => {
                                    if (row.approval === "Y") return;

                                    try {
                                        const result = await Swal.fire({
                                            title: "Are you sure?",
                                            text: "You want to approve this user?",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#506ae5",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText: "Yes, approve!",
                                        });

                                        if (!result.isConfirmed) return;

                                        try {
                                            const response: any = await approveUser(row.id!.toString(), {
                                                approval: "Y",
                                                newSchema: row.schema_name!.toString(),
                                                role: row?.roleData?.id,
                                            });

                                            if (response?.status === 400) {
                                                Swal.fire("Error", response?.message || "Failed to approve user", "error");
                                                return;
                                            }

                                            Swal.fire("Approved", "User has been approved successfully", "success");
                                            await fetchData();
                                        } catch (apiError: any) {
                                            Swal.fire(
                                                "Error",
                                                apiError?.response?.data?.message || apiError?.message || "Something went wrong while approving",
                                                "error"
                                            );
                                        }
                                    } catch (outerError: any) {
                                        Swal.fire("Error", "Unexpected error occurred. Please try again later.", "error");
                                    }
                                }}
                            >
                                {row.approval === "Y" ? (
                                    <CircleCheckBig size={20} className="text-green-500" />
                                ) : (
                                    <CircleAlert size={20} className="text-red-500" />
                                )}
                            </div>
                        )}
                    </div>
                ),
                width: "6%",
            },
            {
                name: "Actions",
                cell: (row: User) => (
                    <div className="flex space-x-3 items-center">
                        {/* Status toggle - implement updateStatusEnjoyer when available */}
                        <div
                            className="cursor-pointer"
                            title={`Click to mark as ${row.status == "Y" ? "Inactive" : "Active"}`}
                            onClick={async () => {
                                // TODO: Implement updateUserStatus
                                const result = await Swal.fire({
                                    title: "Are you sure",
                                    text: "You want to update this user's status?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#506ae5",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, update it!",
                                });

                                if (result.isConfirmed) {
                                    await updateUserStatus(row.id!.toString(), { status: row.status == "Y" ? "N" : "Y", });
                                    Swal.fire("updated", `User has been successfully ${row.status === "Y" ? "deactivated" : "activated"}.`, "success",);
                                    fetchData();
                                }
                            }}>
                            {row.status == "Y" ? (
                                <ToggleRight size={20} className="text-green-500" />
                            ) : (
                                <ToggleLeft size={20} className="text-red-500" />
                            )}
                        </div>
                        {/* <button
                            title="View"
                            onClick={() => router.push(`/users/view/${row.id}`)}
                        >
                            <Info size={18} color="blue" />
                        </button> */}
                        <button
                            title="Edit"
                            onClick={() => router.push(`/admin/users/update/${row.id}`)}
                        >
                            <Edit size={18} color="green" />
                        </button>
                        <button title="Delete" onClick={() => handleDelete(row.id!)}>
                            <Trash2 size={16} color="red" />
                        </button>
                    </div>
                ),
                width: "10%",
            },
        ],
        [page, limit],
    );

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="min-h-screen bg-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium text-gray-800">
                                User Manager
                            </h2>
                        </div>
                        <header className="bg-white shadow-sm border-b">
                            <div className="mx-auto px-4 sm:px-6 lg:px-4 bg-white rounded-lg shadow-sm border py-4 px-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="flex md:col-span-3">
                                        <Input
                                            type="text"
                                            placeholder="Search by company name / email"
                                            className="h-10 text-black text-sm border max-w-[240px] border-gray-200 rounded-[5px] px-3"
                                            value={search.searchTerm}
                                            onChange={(e) =>
                                                setsearch((prev) => ({
                                                    ...prev,
                                                    searchTerm: e.target.value,
                                                }))
                                            }
                                        />

                                        <div className="w-full flex gap-1 ml-4 min-w-[200px] max-w-[260px] ">
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

                                        <div className="w-full flex gap-2 ml-4">
                                            <Button
                                                onClick={handleSearch}
                                                className={`max-w-[30] text-white rounded-[5px] bg-blue-500 hover:bg-blue-700`}  >
                                                Search
                                            </Button>
                                            <Button
                                                onClick={handleReset}
                                                // variant="outline"
                                                className={`max-w-[30] text-white rounded-[5px] bg-yellow-600 hover:bg-yellow-700`} >
                                                Reset
                                            </Button>
                                        </div>
                                    </div>



                                    <div className="flex justify-end relative">
                                        <div
                                            className="relative inline-block text-left"
                                            ref={dropdownRef}
                                        >
                                            <Button
                                                onClick={() => setOpen((prev) => !prev)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Export <CornerRightDown />
                                            </Button>

                                            {open && (
                                                <div className="absolute right-0 mt-2 w-auto bg-white border rounded shadow-lg z-10 flex flex-col gap-1 p-1">
                                                    <Button
                                                        onClick={() => {
                                                            setOpen(false);
                                                            handleExportPDF();
                                                        }}
                                                        className="text-left px-4 py-2 text-black rounded hover:bg-red-500 hover:text-white"
                                                    >
                                                        Download PDF
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setOpen(false);
                                                            handleExport();
                                                        }}
                                                        className="text-left px-4 py-2 text-black rounded hover:bg-green-500 hover:text-white"
                                                    >
                                                        Export to Excel
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-2">
                                            <Button
                                                title="Add Users"
                                                onClick={handleClick}
                                                className="min-w-[80px] p-2 rounded-[5px] bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                {isLoading ? (
                                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <>
                                                        Add <Plus className="h-5 w-5 text-white" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="relative">
                            {loading ? (<Loader />)
                                : (<PaginatedDataTable
                                    title="Users"
                                    columns={columns}
                                    data={filteredData}
                                    page={page}
                                    totalCount={totalRows}
                                    itemsPerPage={limit}
                                    onPageChange={setPage}
                                    onPerPageChange={setLimit}
                                />)
                            }
                        </div>
                    </div>
                </div>
            </main>
            {openCustomDomainSetup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
                        <button
                            onClick={() => {
                                setOpenCustomDomainSetup(false);
                                fetchData();
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            🌐 Custom Domain Setup
                        </h2>

                        <div className="space-y-4">
                            {selectedUserId && (
                                <DomainSetup
                                    userId={Array.isArray(selectedUserId) ? selectedUserId?.[0] : selectedUserId}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersListPage;