"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToggleRight, ToggleLeft, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { getAllSubscriptions, updateSubscriptionStatus, searchSubscription } from "@/services/subscription.service";
import { formatDate } from "@/lib/date";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { SubscriptionAttribute } from "@/types/subscription";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/price";
import { Input } from "@/components/ui/Input";
import Loader from '@/components/ui/loader'

export default function SubscriptionListPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SubscriptionAttribute[]>([]);
  const [filteredData, setFilteredData] = useState<SubscriptionAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchText, setSearchText] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await getAllSubscriptions(page, limit);
      const result: SubscriptionAttribute[] = res?.result?.data || [];
      setData(result);
      setFilteredData(result);
      setTotalRows(res?.result?.total || 0);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
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

    const filtered = data.filter((item) => {

      // --- Customer ---
      const company = (item.Customer?.company_name || "").toLowerCase();
      const email = (item.Customer?.email || "").toLowerCase();

      // --- Plan ---
      const planName = (item.Plan?.name || "").toLowerCase();
      const planPrice = String(item.Plan?.price || "").toLowerCase();

      // --- Plan Description (e.g., "5 users plan @ 200") ---
      const planDesc = `${item.totaluser || 0} users plan @ rs.${item.Plan?.price || 0}`.toLowerCase();

      // --- Other fields ---
      const status = (item.status || "").toLowerCase();
      const isdrop = (item.isdrop || "").toLowerCase();

      // Dates
      const startDate = item.created ? formatDate(item.created, "DD-MM-YYYY").toLowerCase() : "";
      const expiryDate = item.expiry_date ? formatDate(item.expiry_date, "DD-MM-YYYY").toLowerCase() : "";
      const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleString().toLowerCase() : "";
      const updatedAt = item.updatedAt ? new Date(item.updatedAt).toLocaleString().toLowerCase() : "";
      // const invoiceDate = item.createdAt ? formatDate(item.createdAt, "DD-MM-YYYY").toLowerCase() : "";
      // const paymentDate = item.payment_date ? formatDate(item.payment_date, "DD-MM-YYYY").toLowerCase() : "";



      return (
        // --- Customer fields ---
        company.includes(query) ||
        email.includes(query) ||

        // --- Plan fields ---
        planName.includes(query) ||
        planPrice.includes(query) ||
        planDesc.includes(query) ||

        // --- Status / Drop ---
        status.includes(query) ||
        isdrop.includes(query) ||

        // --- Dates ---
        startDate.includes(query) ||
        expiryDate.includes(query) ||
        createdAt.includes(query) ||
        updatedAt.includes(query)
        // || invoiceDate.includes(query) ||
        // paymentDate.includes(query)
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
          </div>
        ),
      },
      {
        name: "Plan Detail",
        selector: (row) => row?.Plan?.name || "",
        sortable: true,
        cell: (row) => (
          <div className="flex flex-col leading-5">
            {/* Plan */}
            <span className="text-gray-700 text-sm mt-1">
              {row?.Plan?.name || "N/A"}
            </span>

            {/* Plan Description */}
            <span className="text-gray-500 text-sm">
              {`Plan @ Rs.${formatPrice(row?.Plan?.price) || 0}`}
            </span>
          </div>
        ),
      },
      {
        name: "Start Date",
        selector: (row) =>
          row.created
            ? formatDate(row.created, "DD-MM-YYYY")
            : "—",
        sortable: true,
        width: "15%",
      },
      {
        name: "Expiry Date",
        selector: (row) => row.expiry_date ? formatDate(row.expiry_date, "DD-MM-YYYY") : "—",
        width: "15%",
        sortable: true,
        cell: (row) => {
          const isExpired = row.expiry_date && new Date(row.expiry_date) < new Date();

          return (
            <span className={isExpired ? "text-red-600 font-semibold" : "text-gray-700"}>
              {row.expiry_date ? formatDate(row.expiry_date, "DD-MM-YYYY") : "—"}
            </span>
          );
        },
      },
      {
        name: "Status",
        cell: (row) => (
          <div className="flex gap-2">

            <button onClick={() => handleStatusChange(row.id, row.status)}>
              {row.status === "Y"
                ? <ToggleRight size={20} className="text-green-500" />
                : <ToggleLeft size={20} className="text-red-500" />}
            </button>

          </div>
        ),
        width: "10%",
      }
    ], [page, limit]
  );

  const handleClick = () => {
    setIsLoading(true);
    router.push("/admin/subscription/add");
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800">
                Subscription Manager
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
        </div>
      </main >
    </div >
  );
};