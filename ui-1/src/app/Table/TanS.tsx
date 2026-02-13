// // import data from "./data.json";
// import { useState, useMemo } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import { useMemo } from "react";

// const Table = () => {
//   //✅ GOOD: This will not cause an infinite loop of re-renders because `columns` is a stable reference
//   const columns = useMemo(
//     () => [
//       {
//         header: "First Name",
//         accessorKey: "name.first",
//       },
//       {
//         header: "Last Name",
//         accessorKey: "name.last",
//       },
//       //   {
//       //     header: "Age",
//       //     accessorFn: (row: any) => row.info.age,
//       //   },
//     ],
//     [],
//   );

//   //✅ GOOD: This will not cause an infinite loop of re-renders because `data` is a stable reference
//   const [data, _setData] = useState(() => [
//     {
//       firstName: "Tanner",
//       lastName: "Linsley",
//       age: 33,
//       visits: 100,
//       progress: 50,
//       status: "Married",
//     },
//     {
//       firstName: "Kevin",
//       lastName: "Vandy",
//       age: 27,
//       visits: 200,
//       progress: 100,
//       status: "Single",
//     },
//   ]);

//   // Columns and data are defined in a stable reference, will not cause infinite loop!
//   const table = useReactTable({
//     columns,
//     data,
//     getCoreRowModel: getCoreRowModel(), // 2. Add this line
//   });

//   console.log(data);
//   console.log(table.getRowModel().rows);

//   return (
//     <div>
//       <h2>Basic Table Example with TanStack Table v8</h2>
//       {/* <table>
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table> */}
//     </div>
//   );
// };

// import data from "./data.json";
import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const TanS = () => {
  const columns = useMemo(
    () => [
      {
        header: "First Name",
        accessorKey: "firstName",
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
      },
    ],
    [],
  );
  const [data, _setData] = useState(() => [
    {
      firstName: "Tanner",
      lastName: "Linsley",
      age: 33,
      visits: 100,
      progress: 50,
      status: "Married",
    },
    {
      firstName: "Kevin",
      lastName: "Vandy",
      age: 27,
      visits: 200,
      progress: 100,
      status: "Single",
    },
  ]);
  // Columns and data are defined in a stable reference, will not cause infinite loop!
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(), // 2. Add this line
  });

  console.log(data);
  //   console.log(table.getRowModel().rows);

  return (
    <div>
      hello
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
    </div>
  );
};

export default TanS;
