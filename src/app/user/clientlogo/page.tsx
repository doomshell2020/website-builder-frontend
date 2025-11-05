"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { getAllClientLogos, deleteClientLogo, updateClientLogoStatus } from "@/services/clientlogo.service";
import { formatDate } from "@/lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { ClientLogo } from "@/types/clientlogo";
import { Button } from "@/components/ui/Button";
import Loader from '@/components/ui/loader'

export default function ClientLogoListPage() {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllClientLogos(page, limit);
      const result = res?.result;
      const data: ClientLogo[] = Array.isArray(result?.data) ? result.data : [];
      setFilteredData(data);
      setTotalRows(result?.total || 0);
    } catch (error) {
      console.error("Failed to fetch Client logo:", error);
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
      text: "You want to delete this Client logo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteClientLogo(id);
        Swal.fire("Deleted!", "Client logo has been deleted.", "success");
        fetchData();
      } catch {
        Swal.fire("Error!", "Failed to delete ClientLogo.", "error");
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
        await updateClientLogoStatus(id, { status: newStatus });
        Swal.fire(
          "Updated!",
          "Client logo status has been changed.",
          "success",
        );
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
        selector: (_: ClientLogo, index: number) =>
          ((page - 1) * limit + index + 1).toString(),
        width: "5%",
      },
      {
        name: "Url",
        selector: (row: ClientLogo) => row.url || "",
        cell: (row: ClientLogo) => (
          <div className="max-w-xs truncate" title={row.url}>
            {row.url}
          </div>
        ),
      },
      {
        name: "Created",
        selector: (row: ClientLogo) =>
          row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY hh:mm A") : "—",
        width: "20%",
        sortable: true,
      },
      {
        name: "Image",
        selector: (row: ClientLogo) => row.image || "",
        cell: (row: ClientLogo) =>
          row.image ? (
            <div className="h-14 max-w-[120px] flex items-center justify-center rounded-md border border-gray-200 shadow-sm bg-gray-300 p-1">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.image}`}
                alt="Client Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <span className="text-gray-400 italic">No Image</span>
          ),
        width: "20%",
      },
      {
        name: "Status",
        selector: (row: ClientLogo) =>
          row.status === "Y" ? "Active" : "Inactive",
        cell: (row: ClientLogo) => (
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
        name: "Actions",
        cell: (row: ClientLogo) => (
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
              onClick={() => router.push(`/user/clientlogo/edit/${row.id}`)}
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
    router.push("/user/clientlogo/add");
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Client Logo Manager
            </h2>
            <Button
              title="Add ClientLogo"
              onClick={handleClick}
              className="min-w-[40px] p-2 rounded-[5px] bg-blue-500 text-black hover:bg-blue-700"
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
                title="ClientLogo"
                columns={columns}
                data={filteredData}
                page={page}
                totalCount={totalRows}
                itemsPerPage={limit}
                onPageChange={setPage}
                onPerPageChange={setLimit}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};