"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/date";
import Loader from '@/components/ui/loader'
import { getAllGallery, deleteGallery, updateGalleryStatus } from "@/services/gallery.service";
import { Gallery } from "@/types/gallery";

export default function GalleryList() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = (await getAllGallery(page, limit)) as Gallery[];
            const data: Gallery[] = res?.result?.data || [];
            setFilteredData(data.slice(0, limit));
            setTotalRows(res?.result?.total || 0);
        } catch (error) {
            console.error("Failed to fetch Gallery:", error);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure",
            text: "You want to delete this Gallery?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#506ae5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await deleteGallery(id);
                Swal.fire("Deleted!", "Gallery has been deleted.", "success");
                fetchData();
            } catch {
                Swal.fire("Error!", "Failed to delete gallery.", "error");
            }
        }
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
                await updateGalleryStatus(id, { status: newStatus });
                Swal.fire("Updated!", "Gallery status has been changed.", "success");
                fetchData();
            } catch {
                Swal.fire("Error", "Failed to update status.", "error");
            }
        }
    };

    const handleClick = () => { setIsLoading(true); router.push("/user/gallery/add"); };

    const columns = useMemo(
        () => [
            {
                name: "S.No",
                selector: (_: Gallery, index: number) => (page - 1) * limit + index + 1,
                width: "5%",
            },
            {
                name: "Title",
                selector: (row: Gallery) => row.title || "N/A",
                cell: (row: Gallery) => (
                    <div className="max-w-xs truncate" title={row.title}>
                        {row.title}
                    </div>
                ),
                width: "20%",
                sortable: true,
            },
            {
                name: "Slug",
                selector: (row: Gallery) => row.slug || "N/A",
                cell: (row: Gallery) => (
                    <div className="max-w-xs truncate" title={row.slug}>
                        {row.slug}
                    </div>
                ),
                width: "20%",
                sortable: true,
            },
            {
                name: "Images",
                selector: (row: Gallery) => row.images?.length || 0,
                cell: (row: Gallery) => {
                    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
                    const images = Array.isArray(row.images) ? row.images : [];

                    if (!images.length) return "No Images";

                    const handleView = () => {
                        router.push(`/user/gallery/view/${row.id}`);
                    };

                    const overlap = 32;
                    const totalWidth = Math.min(images.length, 10) * overlap + 68;

                    return (
                        <div
                            onClick={handleView}
                            title="Open Gallery"
                            className="flex items-center relative cursor-pointer group"
                            style={{
                                width: `${totalWidth}px`,
                                height: "75px",
                            }}
                        >
                            {images.slice(0, 8).map((img, index) => {
                                const isHovered = hoveredIndex === index;

                                return (
                                    <div
                                        key={img}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        className={`absolute rounded-lg overflow-hidden border-[3px] border-white shadow-md transition-all duration-300 ease-out ${isHovered ? "scale-110 brightness-110" : "scale-100"
                                            }`}
                                        style={{
                                            left: `${index * 32}px`,
                                            zIndex: isHovered ? 99 : index, // 👈 only hovered one comes to top
                                            width: "65px",
                                            height: "65px",
                                            boxShadow: isHovered
                                                ? "0 6px 14px rgba(0,0,0,0.3)"
                                                : "0 3px 10px rgba(0,0,0,0.15)",
                                        }}
                                    >
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                );
                            })}

                            {images.length > 8 && (
                                <div
                                    className="absolute flex items-center justify-center bg-gray-900 text-white font-semibold text-sm rounded-lg shadow-lg border-[3px] border-white transition-all duration-200 group-hover:bg-gray-700"
                                    style={{
                                        left: `${8 * 32}px`,
                                        width: "65px",
                                        height: "65px",
                                        zIndex: 8,
                                    }}
                                >
                                    +{images.length - 8}
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                        </div>
                    );
                },
            },
            {
                name: "Created",
                selector: (row: Gallery) =>
                    row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY") : "—", // ✅ primitive
                width: "10%",
                sortable: true,
            },
            {
                name: "Actions",
                cell: (row: Gallery) => (
                    <div className="flex space-x-3 items-center">
                        <div
                            className="cursor-pointer"
                            title={`Click to ${row.status === "Y" ? "inactive" : "active"}`}
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
                            onClick={() => router.push(`/user/gallery/edit/${row.id}`)}
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
        [page, limit]
    );

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800">
                            Gallery Manager
                        </h2>
                        <Button
                            title="Add Gallery/Images"
                            onClick={handleClick}
                            className="min-w-[40px] p-2 rounded-[5px] bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isLoading ? (
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <Plus className="h-5 w-5 text-white" />
                            )}
                        </Button>
                    </div>
                    <div className="relative">
                        {loading ? (<Loader />) : (
                            <PaginatedDataTable
                                title="Gallery"
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