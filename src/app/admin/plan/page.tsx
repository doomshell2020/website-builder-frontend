"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import {
  getAllPlans, deletePlan, updatePlanStatus,
  createPlan, getPlanById, updatePlan
} from "@/services/plan.service";
import { formatPrice } from "@/lib/price";
import { PlanAttribute } from "@/types/plan";
import { createPlanSchema } from "@/schemas/plan.schema";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function PlanPage() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlanAttribute>({
    resolver: zodResolver(createPlanSchema),
  });

  const [data, setData] = useState<PlanAttribute[]>([]);
  const [filteredData, setFilteredData] = useState<PlanAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // FETCH DATA
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await getAllPlans(page, limit);
      const result: PlanAttribute[] = res?.result?.data || [];

      setData(result);
      setFilteredData(result);
      setTotalRows(res?.result?.total || 0);

    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset filteredData when original data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // SEARCH
  const handleSearch = (value: string) => {
    setSearchText(value);

    if (value.trim() === "") {
      setFilteredData(data);
      return;
    }

    const query = value.toLowerCase();
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.price.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this plan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#506ae5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (!confirm.isConfirmed) return;

      const response: any = await deletePlan(id);

      if (response?.status == true) {
        Swal.fire("Deleted!", "Plan has been deleted successfully.", "success");
      } else {
        throw new Error(response?.message || "Something went wrong");
      }
      fetchData(); // Refresh list

    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to delete plan.";
      Swal.fire("Error!", msg, "error");
    }
  };

  // CHANGE STATUS
  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Y" ? "N" : "Y";

    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: `Change status to ${newStatus === "Y" ? "Active" : "Inactive"}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!"
      });
      if (!confirm.isConfirmed) return;

      const response: any = await updatePlanStatus(id, { status: newStatus });

      if (response?.status === true) {
        Swal.fire("Updated!", "Plan status has been updated successfully.", "success");
        fetchData();
      } else {
        throw new Error(response?.message || "Something went wrong");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to update status.";
      Swal.fire("Error!", msg, "error");
    }
  };

  // EDIT: LOAD DATA INTO FORM
  const handleEdit = async (id: number) => {
    try {
      setEditId(id);

      const res: any = await getPlanById(id);

      if (!res?.result) {
        Swal.fire("Error!", "Plan not found.", "error"); return;
      }

      const plan = res.result;

      // Fill the form
      setValue("name", plan.name || "");
      setValue("price", plan.price || "");

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to load plan details.";
      Swal.fire("Error!", message, "error");
    }
  };

  // SUBMIT FORM
  const onSubmit = async (formData: PlanAttribute) => {
    try {
      if (editId) {
        // UPDATE
        await updatePlan(editId, formData);
        Swal.fire("Updated!", "Plan updated successfully.", "success");
      } else {
        // CREATE
        await createPlan(formData);
        Swal.fire("Success!", "Plan created successfully.", "success");
      }
      reset();
      setEditId(null);
      fetchData();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Something went wrong.";
      Swal.fire("Error!", message, "error");
    }
  };

  // TABLE
  const columns = useMemo(() => [
    {
      name: "S.No",
      cell: (_row: PlanAttribute, index: number) => (page - 1) * limit + index + 1,
      width: "6%",
      sortable: true,
      sortFunction: (a, b) => a.id - b.id
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: "Price",
      selector: (row) => formatPrice(row.price) ?? row.price,
      sortable: true,
      sortFunction: (rowA, rowB) => {
        return Number(rowA.price) - Number(rowB.price);
      }
    },
    {
      name: "Status",
      width: "16%",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        const status = row.status === "Y" ? "Active" : "Inactive";
        const statusColor = row.status === "Y" ? "text-green-600" : "text-red-600";
        return (<span className={`text-sm font-medium ${statusColor}`}> {status} </span>);
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">

          <button onClick={() => handleStatusChange(row.id, row.status)}>
            {row.status === "Y"
              ? <ToggleRight size={20} className="text-green-500" />
              : <ToggleLeft size={20} className="text-red-500" />}
          </button>

          <button onClick={() => handleEdit(row.id)}>
            <Edit size={18} color="green" />
          </button>

          <button onClick={() => handleDelete(row.id)}>
            <Trash2 size={16} color="red" />
          </button>

        </div>
      ),
      width: "10%",
    }
  ], [page, limit]);

  return (
    <div className="min-h-screen p-4">

      {/* ------------------ FORM ------------------ */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-medium mb-4">
          {editId ? "Update Plan" : "Create Plan"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-3 gap-6 items-start">

            {/* Name */}
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-1 font-medium">
                Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter Plan Name"
              />

              {/* Reserve fixed height */}
              <span className="text-red-600 text-sm h-5 block">
                {errors.name?.message}
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-1 font-medium">
                Price <span className="text-red-600">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="any"
                min="0"
                {...register("price")}
                placeholder="Enter Price"
              />
              <span className="text-red-600 text-sm h-5 block">
                {errors.price?.message}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 h-full pb-[2px]">
              <Button
                type="button"
                onClick={() => { reset(); setEditId(null); }}
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-[5px]"
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 rounded-[5px] text-white px-6 py-2 min-w-[100px] flex items-center justify-center disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  editId ? "Update" : "Create"
                )}
              </Button>
            </div>

          </div>

        </form>
      </div>

      {/* ------------------ LIST ------------------ */}
      <div className="bg-white mt-8 p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Plan List</h2>
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-[200px]"
          />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <PaginatedDataTable
            title="Plan List"
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
  );
};