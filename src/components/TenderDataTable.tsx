"use client";
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

export const customStyles = {
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
    
       // right border for column separation
    },
  },
  rows: {
    style: {
      fontSize: "12px",
      minHeight: "60px",
      alignitem: "top",
      borderBottom: "1px solid #e5e7eb", // bottom border for each row
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
      // vertical border between cells
    },
  },
};

interface DataTableComponentProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  selectableRows?: boolean;
  onSelectedRowsChange?: (rows: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: T[];
  }) => void;
  pagination?: boolean;
  clearSelectedRows?: boolean;
}

const DataTableComponent = <T extends object>({
  title,
  columns,
  data,
  selectableRows = false,
  onSelectedRowsChange,
  pagination = true,
  clearSelectedRows = false,
}: DataTableComponentProps<T>) => {
  return (  
    <DataTable
      title={title}
      columns={columns}
      data={data}
      pagination={false}
    
      onSelectedRowsChange={onSelectedRowsChange}
      clearSelectedRows={clearSelectedRows}
      customStyles={customStyles} // ✅ Inject custom styles here
      highlightOnHover
      pointerOnHover
      responsive
      striped
    />
  );
};

export default DataTableComponent;
