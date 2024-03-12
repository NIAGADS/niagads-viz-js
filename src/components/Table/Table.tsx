import React, { useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    createColumnHelper,
    BuiltInSortingFn,
    ColumnDef,
} from "@tanstack/react-table";

import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";

import { Column, TableData } from "./types";
import { resolveColumnAccessor } from "@table/ColumnAccessors";
import PaginationControls from "@table/PaginationControls";
import sortingFunctions from "./TableSortingFunctions";

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
}


const Table: React.FC<TableProps<TableData>> = ({ data, columns }) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const resolvedColumns = useMemo<ColumnDef<TableData>[]>(() => {
        const columnHelper = createColumnHelper<TableData>();

        const resolved: ColumnDef<TableData>[] = [];

        columns.forEach((col) => {
            resolved.push(columnHelper.accessor(
                resolveColumnAccessor(col.id, col.accessorType),
                {
                    id: col.id,
                    cell: c => c.getValue(),
                    sortingFn: col.sortType as BuiltInSortingFn,
                    enableSorting: col.canSort,
                }
            ))
        });

        return resolved;
    }, [columns]);

    const table = useReactTable({
        data,
        columns: resolvedColumns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        defaultColumn: {
            size: 150,
            minSize: 20,
            maxSize: Number.MAX_SAFE_INTEGER,
        },
        sortingFns: sortingFunctions,
    });

    return (
        <>
            <table className="table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse">
                <thead className="uppercase text-xs text-left text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan} scope="col" className="px-2">
                                        {header.isPlaceholder ? null : (
                                            <div
                                                style={
                                                    header.column.getCanSort() ? {"cursor": "pointer"} : {}
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    sort: <ArrowsUpDownIcon className="h4 text-blue-600 pl-px" />,
                                                    asc: <ArrowUpIcon className="h-4 text-blue-600 pl-px" />,
                                                    desc: <ArrowDownIcon className="h-4 text-blue-600 pl-px" />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className=" hover:bg-gray-50 bg-white border-b dark:bg-gray-800 odd:border-gray-700">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <PaginationControls table={table} />
        </>
    );
};

export default Table;
