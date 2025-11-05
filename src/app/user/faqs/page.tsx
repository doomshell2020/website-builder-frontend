"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Trash, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button"
import Swal from "sweetalert2";
import { findFAQs, deleteFAQ, deleteMultipleFAQ, updateFAQStatus } from "@/services/faq.service";
import { formatDate } from "@/lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { FAQAttributes } from "@/types/faq";
import Loader from '@/components/ui/loader'

export default function FAQListPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState<FAQAttributes[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = (await findFAQs(page, limit)) as FAQAttributes[];
            const data: FAQAttributes[] = (res?.result?.data || []);
            setFilteredData(data.slice(0, limit));
            setTotalRows(res?.result?.total);
        } catch (error) {
            console.error("Failed to fetch FAQs:", error);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                await updateFAQStatus(id, { status: newStatus });
                Swal.fire("Updated!", "FAQ status has been changed.", "success",);
                fetchData();
            } catch {
                Swal.fire("Error", "Failed to update status.", "error");
            }
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure",
            text: "You want to delete this FAQ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#506ae5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await deleteFAQ(id);
                Swal.fire("Deleted!", "FAQ has been deleted.", "success");
                fetchData();
            } catch {
                Swal.fire("Error!", "Failed to delete FAQ.", "error");
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            Swal.fire("No selection", "Please select at least one FAQ.", "warning");
            return;
        }
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${selectedIds.length} FAQ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#506ae5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete them!",
        });

        if (result.isConfirmed) {
            try {
                await deleteMultipleFAQ(selectedIds.map(String)); // Send all at once
                Swal.fire("Deleted!", "Selected FAQs have been deleted.", "success");
                setSelectedIds([]);
                fetchData();
            } catch {
                Swal.fire("Error!", "Failed to delete FAQs.", "error");
            }
        }
    };

    const handleClick = () => { setIsLoading(true); router.push("/user/faqs/add") };

    const columns = useMemo(
        () => [
            {
                name: (
                    <input
                        type="checkbox"
                        checked={
                            filteredData.length > 0 &&
                            filteredData.every((q) => selectedIds.includes(q.id!))
                        }
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedIds((prev) => [
                                    ...prev,
                                    ...filteredData.map((q) => q.id!).filter((id) => !prev.includes(id)),
                                ]);
                            } else {
                                setSelectedIds((prev) =>
                                    prev.filter((id) => !filteredData.some((q) => q.id === id))
                                );
                            }
                        }}
                    />
                ),
                cell: (row: FAQAttributes) => (
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id!)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedIds((prev) =>
                                    prev.includes(row.id!) ? prev : [...prev, row.id!]
                                );
                            } else {
                                setSelectedIds((prev) => prev.filter((id) => id !== row.id!));
                            }
                        }}
                    />
                ),
                width: "4%",
            },
            {
                name: "S.No",
                selector: (_: FAQAttributes, index: number) => (page - 1) * limit + index + 1,
                width: "5%",
            },
            {
                name: "Question",
                selector: (row: FAQAttributes) => row.question || "N/A",
                width: "20%",
            },
            {
                name: "Answer",
                selector: (row: FAQAttributes) => row.answer || "N/A",
            },
            {
                name: "Created",
                selector: (row: FAQAttributes) => row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY") : "—",
                width: "10%",
            },
            {
                name: "Actions",
                cell: (row: FAQAttributes) => (
                    <div className="flex space-x-3 items-center">
                        <div
                            className="cursor-pointer"
                            title={`Click to mark as ${row.status === "Y" ? "inactive" : "active"}`}
                            onClick={() => handleStatusChange(row.id, row.status)}
                        >
                            {row.status === "Y" ? (
                                <ToggleRight size={20} className="text-green-500" />
                            ) : (
                                <ToggleLeft size={20} className="text-red-500" />
                            )}
                        </div>
                        <button
                            title="Edit"
                            onClick={() => router.push(`/user/faqs/edit/${row.id}`)}
                        >
                            <Edit size={18} color="green" />
                        </button>
                        <button title="Delete" onClick={() => handleDelete(row.id)}>
                            <Trash2 size={16} color="red" />
                        </button>
                    </div>
                ),
                width: "10%",
            },
        ],
        [page, limit, filteredData, selectedIds, handleDelete],
    );

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            FAQ Manager
                        </h2>

                        <div className="flex justify-start items-center">
                            <Button
                                title="Add FAQ"
                                onClick={handleClick}
                                className="min-w-[40px] p-2 mr-2 rounded-[5px] bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {isLoading ? (
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (<Plus className="h-5 w-5 text-white" />)}
                            </Button>
                            <Button
                                title="Delete Quotes"
                                onClick={handleBulkDelete}
                                disabled={filteredData.length === 0 || selectedIds.length === 0} // ✅ disable if no data
                                className={`min-w-[60px] p-2 rounded-[5px] text-white flex items-center gap-1 bg-red-500
                            ${filteredData.length === 0 || selectedIds.length === 0
                                        ? "cursor-not-allowed" // disabled state
                                        : "hover:bg-red-700"}`
                                } >
                                <Trash size={16} color="white" />
                                Delete
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        {loading ? (<Loader />) : (
                            <PaginatedDataTable
                                title="FAQs"
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
            </main>
        </div>
    );
};
