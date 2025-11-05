"use client";
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#293042",
      minHeight: "42px",
      borderBottom: "1px solid #d1d5db",
    },
  },
  headCells: {
    style: {
      color: "white",
      fontSize: "12px",
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  rows: {
    style: {
      fontSize: "12px",
      minHeight: "60px",
      alignItems: "top",
      borderBottom: "1px solid #e5e7eb",
    },
  },
  cells: {
    style: {
      paddingTop: "8px",
      paddingBottom: "8px",
      paddingLeft: "12px",
      paddingRight: "12px",
      whiteSpace: "pre-wrap",
      borderRight: "1px solid #e5e7eb",
    },
  },
};

interface PaginatedDataTableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  page: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (newLimit: number) => void;
  selectableRows?: boolean;
  onSelectedRowsChange?: (rows: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: T[];
  }) => void;
}

const PaginatedDataTable = <T extends object>({
  title,
  columns,
  data,
  page,
  totalCount,
  itemsPerPage,
  onPageChange,
  onPerPageChange,
  selectableRows = false,
  onSelectedRowsChange,
}: PaginatedDataTableProps<T>) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        pagination={false}
        onSelectedRowsChange={onSelectedRowsChange}
        selectableRows={selectableRows}
        highlightOnHover
        pointerOnHover
        responsive
        striped
        customStyles={customStyles}
      />

      {/* Pagination & Rows per page */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700 gap-4">
        {/* Rows Per Page Dropdown */}
        <div className="flex items-center">
          <label className="mr-2 font-medium text-gray-700">Rows per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex flex-wrap gap-2 items-end">
          <button
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded border ${
                pageNum === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PaginatedDataTable;
