"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { getAllSliders, deleteSlider, updateSliderStatus } from "@/services/slider.service";
import { formatDate } from "@/lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { Slider } from "@/types/slider";
import { Button } from "@/components/ui/Button";
import Loader from '@/components/ui/loader'

export default function SliderListPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = (await getAllSliders(page, limit)) as Slider[];
      const data: Slider[] = (res?.result?.data || []).map((item: Slider) => ({
        ...item,
        description:
          item.description === null ||
            item.description === undefined ||
            item.description === "null" ||
            item.description === "undefined"
            ? "N/A"
            : item.description,
      }));
      setFilteredData(data.slice(0, limit));
      setTotalRows(res?.result?.total || 0);
    } catch (error) {
      console.error("Failed to fetch Slider:", error);
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
      text: "You want to delete this Slider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSlider(id);
        Swal.fire("Deleted!", "Slider has been deleted.", "success");
        fetchData();
      } catch {
        Swal.fire("Error!", "Failed to delete Slider.", "error");
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
        await updateSliderStatus(id, { status: newStatus });
        Swal.fire("Updated!", "Slider status has been changed.", "success");
        fetchData();
      } catch {
        Swal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const handleClick = () => {
    setIsLoading(true);
    router.push("/user/slider/add");
  };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (_: Slider, index: number) => (page - 1) * limit + index + 1,
        width: "5%",
      },
      {
        name: "Title",
        selector: (row: Slider) => row.title || "N/A",
        cell: (row: Slider) => (
          <div className="max-w-xs truncate" title={row.title}>
            {row.title}
          </div>
        ),
      },
      {
        name: "Image",
        selector: (row: Slider) => row.images || "N/A", // ✅ primitive
        cell: (row: Slider) =>
          row.images ? (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.images}`}
              alt="Slider"
              className="w-auto h-12 object-cover rounded"
            />
          ) : (
            "No Image"
          ),
        width: "15%",
      },
      {
        name: "Description",
        selector: (row: Slider) =>
          row.description ? row.description.replace(/<[^>]+>/g, "") : "", // ✅ plain text for sorting/search
        cell: (row: Slider) => {
          const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");
          const truncateWords = (text: string, wordLimit: number) => {
            const words = text.split(/\s+/);
            return (
              words.slice(0, wordLimit).join(" ") +
              (words.length > wordLimit ? "..." : "")
            );
          };

          const plainText = row.description ? stripHtml(row.description) : "";

          return plainText ? (
            <div
              className="max-w-xs truncate"
              title={plainText}
              dangerouslySetInnerHTML={{
                __html: truncateWords(plainText, 10),
              }}
            />
          ) : (
            <div>N/A</div>
          );
        },
        width: "20%",
      },
      {
        name: "Status",
        selector: (row: Slider) => (row.status === "Y" ? "Active" : "Inactive"), // ✅ primitive
        cell: (row: Slider) => (
          <span
            className={`px-2 py-1 rounded text-xs ${row.status === "Y"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {row.status === "Y" ? "Active" : "Inactive"}
          </span>
        ),
        width: "10%",
      },
      {
        name: "Created",
        selector: (row: Slider) =>
          row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY") : "—", // ✅ primitive
        width: "10%",
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row: Slider) => (
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
              onClick={() => router.push(`/user/slider/edit/${row.id}`)}
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
              Slider Manager
            </h2>
            <Button
              title="Add Slider"
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
                title="Slider"
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