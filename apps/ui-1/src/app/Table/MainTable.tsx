import React from "react";
import docData from "./data.json";
import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import SubTable from "./SubTable";

type Template = {
  id: string;
  document_id: string;
  name: string;
};

type Doc = {
  id: string;
  file_path: string;
  templates: Template[];
};

const MainTable = () => {
  const columns: ColumnDef<Doc>[] = useMemo(
    () => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? "👇" : "👉"}
            </button>
          ) : (
            "🔵"
          );
        },
      },
      {
        header: "id",
        accessorKey: "id",
      },
      {
        header: "file path",
        accessorKey: "file_path",
      },
    ],
    [],
  );

  const { documents, templates } = docData;
  const data = useMemo(
    () =>
      documents.map((doc) => ({
        ...doc,
        templates: templates.filter(
          (template) => template.document_id == doc.id,
        ),
      })),
    [documents, templates],
  );

  console.log(data);
  // Columns and data are defined in a stable reference, will not cause infinite loop!
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(), // 2. Add this line
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <div>
      hello
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="p-2" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                {row.getVisibleCells().map((cell) => (
                  <td className="border p-2" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() && (
                <tr>
                  <td colSpan={row.getVisibleCells().length}>
                    <SubTable parentRow={row.original} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainTable;
