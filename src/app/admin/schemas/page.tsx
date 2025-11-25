"use client";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllSchemas, getAllUsers, downloadSchemaZip } from "@/services/userService";
import { DatabaseBackup } from "lucide-react";
import Swal from "sweetalert2";
import { SwalSuccess, SwalError } from "@/components/ui/SwalAlert";
import PaginatedDataTable from "@/components/PaginatedDataTablet";
import Loader from "@/components/ui/loader";
import { Schemas, User } from "@/types/user";
import { formatDate } from "@/lib/date";

const SchemaListPage = () => {
    const router = useRouter();
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllSchemas(page, limit);
            const data: any = Array.isArray(response?.result?.schemas) ? response.result.schemas : [];
            const pagination = response?.result?.pagination;
            // console.log("data: ", data);
            // console.log("pagination: ", pagination);

            setFilteredData(data);
            setTotalRows(pagination?.total || 0);
        } catch (error) {
            console.error("Failed to fetch schemas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData()
    }, [page, limit]);

    const handleDownloadZip = async (schemaName: string) => {
        if (!schemaName) return;

        const result = await Swal.fire({
            title: "Select export type",
            html: `
             <div id="exportOptions">
                <label><input type="checkbox" class="export-opt" value="json" checked> JSON</label><br>
                <label><input type="checkbox" class="export-opt" value="excel" checked> Excel</label><br>
                <label><input type="checkbox" class="export-opt" value="sql" checked> SQL</label>
             </div>
             `,
            showCancelButton: true,
            confirmButtonText: "Download",
            didOpen: () => {
                const checkboxes = document.querySelectorAll(".export-opt");

                checkboxes.forEach((box) => {
                    box.addEventListener("change", () => {
                        const checkedCount = [...checkboxes].filter((cb: any) => cb.checked).length;

                        // Prevent unchecking last remaining checkbox
                        if (checkedCount === 0) {
                            (box as HTMLInputElement).checked = true;
                        }
                    });
                });
            },
            preConfirm: () => {
                const selected = [...document.querySelectorAll(".export-opt")]
                    .filter((cb: any) => cb.checked)
                    .map((cb: any) => cb.value);

                return selected;
            },
        });

        if (!result.isConfirmed) return;

        const chosenFormats = result.value.length ? result.value : ["json", "excel", "sql"];

        Swal.fire({
            title: "Preparing download...",
            text: "Please wait while we generate your export.",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            await downloadSchemaZip(schemaName, chosenFormats);

            Swal.fire({
                icon: "success",
                title: "Download Started",
                text: `Exporting: ${chosenFormats.join(", ")}`,
                timer: 2000,
                showConfirmButton: false,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "Something went wrong while generating the backup.",
            });
        }
    };

    const columns = useMemo(
        () => [
            {
                name: "S.No",
                selector: (_row: Schemas, index: number) =>
                    ((page - 1) * limit + index + 1).toString(),
                width: "5%",
            },
            {
                name: "Platform Name",
                selector: (row: Schemas) => row?.schemaName || "N/A",
                sortable: true,
            },
            {
                name: "Users Details",
                cell: (row: Schemas) => (
                    <div className="flex flex-col gap-1 space-y-1">
                        {row.users?.map((u, userIndex) => (
                            <div key={userIndex} className="mb-2 space-y-1">
                                <button
                                    title="Click to view user"
                                    onClick={() => router.push(`/admin/users/view/${u.id}`)}
                                    className="pl-1 text-blue-600 hover:text-green-600 hover:pl-2 hover:underline transition-colors duration-200"
                                >
                                    {u.name}
                                </button>
                                {/* <div> {u.name}</div> */}
                                <div> {u.email}</div>
                                <div> {u.mobile_no || "N/A"}</div>
                                {/* <div>Name: {u.name}</div>
                                <div>Email: {u.email}</div>
                                <div>Mobile: {u.mobile_no || "N/A"}</div> */}
                            </div>
                        )) || "N/A"}
                    </div>
                ),
                sortable: false,
            },
            {
                name: "Counts",
                cell: (row: Schemas) => (
                    <div className="flex flex-col">
                        {row.tables?.map((tbl, index) => (
                            <span key={index}>
                                {tbl.tableName} ({tbl.rowCount > 0 ? tbl.rowCount : 0})
                            </span>
                        )) || "N/A"}
                    </div>
                ),
                sortable: false,
            },
            {
                name: "Created",
                selector: (row: Schemas) =>
                    row.users?.[0]?.createdAt
                        ? formatDate(row.users[0].createdAt, "DD-MM-YYYY")
                        : "--",
                width: "15%",
                sortable: true,
            },
            {
                name: "Actions",
                width: "8%",
                cell: (row) => {
                    return (<div className="flex gap-2">
                        <button
                            title="Download DB ZIP (JSON / Excel / SQL)"
                            onClick={() => handleDownloadZip(row?.schemaName || "")}
                        >
                            <DatabaseBackup size={18} className="text-green-600 hover:text-green-800" />
                        </button>
                    </div>)
                }
            }
        ],
        [page, limit]
    );

    return (
        <div className="min-h-screen">
            <main className="max-w-10xl py-2">
                <div className="border shadow-xl p-2">
                    <div className="min-h-screen bg-gray-50">
                        <div className="flex justify-start items-center mb-6">
                            {/* <Button
                                onClick={handleBack}
                                className="flex items-center justify-center w-10 h-10 ml-2 mr-6 text-white bg-blue-500 hover:bg-blue-700 rounded-[5px] font-normal focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                aria-label="Go back"
                            >
                                <MoveLeft className="w-5 h-5" strokeWidth={3} />
                            </Button> */}
                            <h2 className="text-xl font-medium text-gray-800">
                                Platform Manager
                            </h2>
                        </div>
                        <div className="relative">
                            {loading ? (<Loader />)
                                : (<PaginatedDataTable<any>
                                    title="Schema"
                                    columns={columns}
                                    data={filteredData}
                                    page={page}
                                    totalCount={totalRows}
                                    itemsPerPage={limit}
                                    onPageChange={setPage}
                                    onPerPageChange={setLimit}
                                />
                                )
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SchemaListPage;