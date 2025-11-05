"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { getAllTestimonials, deleteTestimonial, updateTestimonialStatus } from "@/services/testimonial.service";
import { formatDate } from "@/lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { Testimonial } from "@/types/testimonial";
import { Button } from "@/components/ui/Button";
import Loader from '@/components/ui/loader'

export default function TestimonialListPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllTestimonials(page, limit);
      const data: Testimonial[] = (response?.result?.data || []);
      setFilteredData(data);
      setTotalRows(response?.result?.total);
    } catch (error) {
      console.error("Failed to fetch Testimonial:", error);
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
      text: "You want to delete this testimonial?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTestimonial(id);
        Swal.fire("Deleted!", "Testimonial has been deleted.", "success");
        fetchData();
      } catch {
        Swal.fire("Error!", "Failed to delete testimonial.", "error");
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
        await updateTestimonialStatus(id, { status: newStatus });
        Swal.fire(
          "Updated!",
          "Testimonial status has been changed.",
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
        selector: (_: Testimonial, index: number) =>
          (page - 1) * limit + index + 1,
        width: "5%",
      },
      {
        name: "Name",
        selector: (row: Testimonial) => row.name || "",
        cell: (row: Testimonial) => (
          <div className="max-w-xs truncate" title={row.name}>
            {row.name}
          </div>
        ),
      },
      {
        name: "Client Image",
        selector: (row: Testimonial) => row.image || "",
        cell: (row: Testimonial) =>
          row.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.image}`}
              alt="Testimonial"
              className="w-auto max-h-20 object-cover rounded"
            />
          ) : (
            <img
              src="../assest/image/defaultUser.webp"
              alt="Testimonial"
              className="w-auto max-h-20 object-cover rounded"
            />
          ),
        width: "16%",
      },
      {
        name: "Company Logo",
        selector: (row: Testimonial) => row.company_logo || "",
        cell: (row: Testimonial) =>
          row.company_logo ? (
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.company_logo}`}
              alt={`${row.createdAt}`}
              className="w-auto max-h-20 object-cover rounded"
            />
          ) : (
            <img
              src="../assest/image/nologo.webp"
              alt="Company Logo"
              className="w-auto max-h-20 object-cover rounded"
            />
          ),
        width: "16%",
      },
      {
        name: "Date",
        selector: (row: Testimonial) =>
          row.createdAt ? formatDate(row.createdAt, "DD-MM-YYYY") : "—",
        width: "10%",
      },
      {
        name: "Actions",
        cell: (row: Testimonial) => (
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
              onClick={() =>
                router.push(`/user/testimonials/edit/${row.id}`)
              }
            >
              <Edit size={18} color="green" />
            </button>
            <button title="Delete" onClick={() => handleDelete(row.id)}>
              <Trash2 size={16} color="red" />
            </button>
          </div>
        ),
        width: "15%",
      },
    ],
    [page, limit],
  );

  const handleClick = () => {
    setIsLoading(true);
    router.push("/user/testimonials/add");
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              Testimonial Manager
            </h2>
            <Button
              title="Add Testimonial"
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
                title="Testimonial"
                columns={columns}
                data={filteredData}
                page={page}
                itemsPerPage={limit}
                totalCount={totalRows}
                onPageChange={setPage}
                onPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1); // Reset to page 1 when limit changes
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};