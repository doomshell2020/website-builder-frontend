"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ToggleRight, ToggleLeft, Edit, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/Button";
import { getAllSeo, deleteSeo, updateSeoStatus, searchSeo } from "@/services/seo.service";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import { Seo } from "@/types/seo";
import { Input } from "@/components/ui/Input";
import Loader from '@/components/ui/loader'

export default function SeoListPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<Seo[]>([]);
  const [filteredData, setFilteredData] = useState<Seo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [searchOptions, setSearchOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");

  const handleReset = () => {
    setSearchType("");
    setSearchQuery("");
    fetchData();
  };

  const fetchData = useCallback(
    async (searchQuery = "", searchType = "") => {
      try {
        setLoading(true);
        const response =
          searchQuery && searchType
            ? await searchSeo(searchType, searchQuery, page, limit)
            : await getAllSeo(page, limit);

        const data: Seo[] = response?.result?.data || [];

        if (data.length > 0) {
          const dynamicKeys = Object.keys(data[0]).filter(
            (key) =>
              ![
                "id",
                "orgid",
                "type",
                "createdAt",
                "updatedAt",
                "status",
              ].includes(key),
          );
          const options = dynamicKeys.map((key) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: key,
          }));
          setSearchOptions(options);
        }
        setAllData(data);
        setFilteredData(data);
        setTotalRows(response?.result?.total);
      } catch (error) {
        console.error("Failed to fetch Seo:", error);
      } finally {
        setLoading(false);
      }
    },
    [page, limit],
  );

  useEffect(() => {
    fetchData(searchQuery, searchType);
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure",
      text: "You want to delete this seo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#506ae5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSeo(id);
        Swal.fire("Deleted!", "Seo has been deleted.", "success");
        fetchData(searchQuery);
      } catch {
        Swal.fire("Error!", "Failed to delete seo.", "error");
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
        await updateSeoStatus(id, { status: newStatus });
        Swal.fire("Updated!", "Seo status has been changed.", "success");
        fetchData(searchQuery);
      } catch {
        Swal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const handleClick = () => { setIsLoading(true); router.push("/user/seo/add") };

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        selector: (_: Seo, index: number) => (page - 1) * limit + index + 1,
        width: "5%",
      },
      {
        name: "Page",
        selector: (row: Seo) => row.page || "",
        cell: (row: Seo) => row.page || "",
      },
      {
        name: "Page Location",
        selector: (row: Seo) => row.location || "",
        cell: (row: Seo) => row.location || "",
      },
      {
        name: "Title",
        selector: (row: Seo) => row.title || "",
        cell: (row: Seo) => row.title || "",
        width: "10%",
      },
      {
        name: "Description",
        selector: (row: Seo) => row.description || "",
        cell: (row: Seo) => (
          <button
            title="View Description"
            onClick={() => {
              const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");
              const text = row.description?.trim();
              const isInvalid =
                !text || ["null", "undefined"].includes(text.toLowerCase());

              setSelectedDescription(isInvalid ? "N/A" : stripHtml(text));
              setIsDescriptionModalOpen(true);
            }}
            className="text-xs px-[8px] py-[4px] text-white list-[gurmukhi] rounded-[1rem] bg-[#66686b] font-bold no-underline"
          >
            view
          </button>
        ),
        width: "10%",
      },
      {
        name: "Keyword",
        selector: (row: Seo) => row.keyword || "",
        cell: (row: Seo) => (
          <button
            title="View Keyword"
            onClick={() => {
              const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");
              const text = row.keyword?.trim();
              const isInvalid =
                !text || ["null", "undefined"].includes(text.toLowerCase());

              setSelectedKeyword(isInvalid ? "N/A" : stripHtml(text));
              setIsKeywordModalOpen(true);
            }}
            className="text-xs px-[8px] py-[4px] text-white list-[gurmukhi] rounded-[1rem] bg-[#66686b] font-bold no-underline"
          >
            view
          </button>
        ),
        width: "10%",
      },

      {
        name: "Actions",
        cell: (row: Seo) => (
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
              onClick={() => router.push(`/user/seo/edit/${row.id}`)}
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

  return (
    <div className="min-h-screen">
      <main className="max-w-10xl py-2">
        <div className="border shadow-xl p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">SEO Manager</h2>
            <Button
              title="Add SEO"
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
          <header className="bg-white shadow-sm border-b">
            <div className="mx-auto px-4 sm:px-6 lg:px-4 bg-white rounded-lg shadow-sm border py-4 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="flex">
                  <div className="flex gap-2 items-center">
                    <select
                      className="w-2/3 h-10 text-black text-sm border border-gray-200 rounded-[5px] px-3"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {searchOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <Input
                      type="text"
                      placeholder={`Search by ${searchOptions.find((opt) => opt.value === searchType)?.label || "..."}`}
                      className="w-2/3 h-10 text-black text-sm border border-gray-200 rounded-[5px] px-3"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={!searchType}
                    />
                  </div>

                  <div className="flex gap-2 ml-6">
                    <Button
                      onClick={() => {
                        if (!searchType) {
                          Swal.fire(
                            "Warning !",
                            "Please select a search type.",
                            "warning",
                          );
                          return;
                        }
                        fetchData(searchQuery, searchType);
                      }}
                      className="w-full text-white bg-blue-500 hover:bg-blue-700 rounded-[5px]"
                    >
                      Search
                    </Button>
                    <Button
                      onClick={handleReset}
                      // variant="outline"
                      className="w-full text-white bg-yellow-600 hover:bg-yellow-700 rounded-[5px]"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </header>
          <div className="relative">
            {loading ? (<Loader />) : (
              <PaginatedDataTable
                title="Seo"
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
              />)}
          </div>
        </div>
      </main>
      {isKeywordModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
              onClick={() => setIsKeywordModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Keyword</h2>
            <hr className="mb-2" />
            <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words">
              <p>{selectedKeyword || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
      {isDescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
              onClick={() => setIsDescriptionModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <hr className="mb-2" />
            <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap break-words">
              <p>{selectedDescription || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

