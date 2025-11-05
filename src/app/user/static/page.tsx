"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { getAllStatics, deleteStatic, updateStaticStatus } from "@/services/static.service";
import { formatDate } from "@/lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { Static } from "@/types/static";
import { Button } from "@/components/ui/Button";
import Loader from '@/components/ui/loader'

export default function StaticListPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<Static[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await getAllStatics(page, limit);
      const data: Static[] = ((res as any)?.result?.data || []).map((item: Static) => ({
        ...item,
        description:
          item.content === null ||
            item.content === undefined ||
            item.content === "null" ||
            item.content === "undefined"
            ? "N/A"
            : item.content,
      }));
      setFilteredData(data);
      setTotalRows(res?.result?.total || 0);
    } catch (error) {
      console.error("Failed to fetch Static:", error);
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
      text: "You want to delete this Static?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteStatic(id);
        Swal.fire("Deleted!", "Static has been deleted.", "success");
        fetchData();
      } catch {
        Swal.fire("Error!", "Failed to delete Static.", "error");
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
        await updateStaticStatus(id, { status: newStatus });
        Swal.fire("Updated!", "Static status has been changed.", "success");
        fetchData();
      } catch {
        Swal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (_: Static, index: number) => (page - 1) * limit + index + 1,
        width: "5%",
      },
      {
        name: "Title",
        selector: (row: Static) => row.title || "N/A",
        cell: (row: Static) => (
          <div className="max-w-xs truncate" title={row.title}>
            {row.title}
          </div>
        ),
      },
      {
        name: "Url",
        selector: (row: Static) => row.url || "N/A",
        cell: (row: Static) => (
          <div className="max-w-xs truncate" title={row.url}>
            {row.url}
          </div>
        ),
      },
      {
        name: "Status",
        selector: (row: Static) => (row.status === "Y" ? "Active" : "Inactive"),
        cell: (row: Static) => (
          <span
            className={`px-2 py-1 rounded text-xs ${row.status === "Y"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {row.status === "Y" ? "Active" : "Inactive"}
          </span>
        ),
        width: "15%",
      },
      {
        name: "Created",
        selector: (row: Static) => row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY hh:mm A") : "—",
        width: "15%",
      },
      {
        name: "Actions",
        cell: (row: Static) => (
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
              onClick={() => router.push(`/user/static/edit/${row.id}`)}
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
    [page, limit],
  );

  const handleClick = () => {
    setIsLoading(true);
    router.push("/user/static/add");
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Static Manager
            </h2>
            <Button
              title="Add Static"
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
                title="Static"
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