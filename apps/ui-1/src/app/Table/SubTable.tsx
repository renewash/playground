import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
// import docData from "./data.json";
import { useMemo } from "react";
type Template = {
  id: string;
  document_id: string;
  name: string;
};

const SubTable = ({ parentRow }: { parentRow: { templates: Template[] } }) => {
  const templates = parentRow.templates;
  const data = useMemo(() => templates, [templates]);

  const columns: ColumnDef<Template>[] = [
    {
      header: "id",
      accessorKey: "id",
    },
    {
      header: "document id",
      accessorKey: "document_id",
    },
    {
      header: "name",
      accessorKey: "name",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="p-2" key={header.id}>
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
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubTable;
