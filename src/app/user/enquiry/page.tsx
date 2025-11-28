"use client";

import { useMemo,  useEffect, useState } from "react";
import { Trash2, Trash } from "lucide-react";
import { Button } from "@/components/ui/Button"
import Swal from "sweetalert2";
import { getEnquiries, deleteEnquiry, deleteMultipleEnquiry } from "@/services/enquiry.service";
import { formatDate } from "@/lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { EnquiryAttributes } from "@/types/enquiry";
import Loader from '@/components/ui/loader'

export default function EnquiryListPage() {
    const [filteredData, setFilteredData] = useState<EnquiryAttributes[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const fetchData = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const res: any = (await getEnquiries(page, limit)) as EnquiryAttributes[];
            const data: EnquiryAttributes[] = (res?.result?.data || []);
            setFilteredData(data.slice(0, limit));
            setTotalRows(res?.result?.total);
        } catch (error) {
            console.error("Failed to fetch enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page, limit);
    }, [page, limit]);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure",
            text: "You want to delete this enquiry?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#506ae5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await deleteEnquiry(id);
                Swal.fire("Deleted!", "Enquiry has been deleted.", "success");
                fetchData(page, limit);
            } catch {
                Swal.fire("Error!", "Failed to delete enquiry.", "error");
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            Swal.fire("No selection", "Please select at least one enquiry.", "warning");
            return;
        }
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${selectedIds.length} enquiry?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#506ae5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete them!",
        });

        if (result.isConfirmed) {
            try {
                await deleteMultipleEnquiry(selectedIds.map(String)); // Send all at once
                Swal.fire("Deleted!", "Selected enquiry have been deleted.", "success");
                setSelectedIds([]);
                fetchData(page, limit);
            } catch {
                Swal.fire("Error!", "Failed to delete some enquiry.", "error");
            }
        }
    };

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
                cell: (row: EnquiryAttributes) => (
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
                selector: (_: EnquiryAttributes, index: number) => (page - 1) * limit + index + 1,
                width: "5%",
            },
            {
                name: "Name",
                selector: (row: EnquiryAttributes) => row.name || "N/A",
                width: "15%",
            },
            {
                name: "Email",
                selector: (row: EnquiryAttributes) => row.email || "N/A",
                width: "20%",
            },
            {
                name: "Mobile",
                selector: (row: EnquiryAttributes) => row.mobile || "N/A",
                width: "10%",
            },
            {
                name: "Enquiry",
                selector: (row: EnquiryAttributes) => row.subject || "N/A",
                width: "30%",
            },
            {
                name: "Created",
                selector: (row: EnquiryAttributes) => row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY") : "—",
                width: "10%",
            },
            {
                name: "Actions",
                cell: (row: EnquiryAttributes) => (
                    <div className="flex justify-center items-center">
                        <button title="Delete" onClick={() => handleDelete(row.id)}>
                            <Trash2 size={17} color="red" />
                        </button>
                    </div>
                ),
                width: "6%",
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
                            Enquiry Manager
                        </h2>
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
                    <div className="relative">
                        {loading ? (<Loader />) : (
                            <PaginatedDataTable
                                title="Enquiry"
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
            {selectedSubject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Full Enquiry</h2>
                        <p className="mb-4">{selectedSubject}</p>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={() => setSelectedSubject(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};