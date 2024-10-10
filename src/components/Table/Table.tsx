// TODO: put sorting back in
// TODO: filtering

import React, { useMemo, useState, useLayoutEffect, useEffect, useRef } from "react"
import { withErrorBoundary } from "react-error-boundary";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    createColumnHelper,
    ColumnDef,
    HeaderGroup,
    SortingFnOption,
    getSortedRowModel,
    RowSelectionState,
    TableOptions,
    Table as ReactTable
} from "@tanstack/react-table"

import { TrashIcon } from '@heroicons/react/24/outline'

import { _get, _hasOwnProperty, toTitleCase } from "@common/utils"
import { errorFallback } from "@common/errors"

import {
    Cell,
    GenericCell,
    getCellValue,
    renderCell,
    resolveCell,
    validateCellType
} from "@table/Cell"
import { TableConfig, TableData, TableRow } from "@table/TableProperties";
import { GenericColumn, getColumn } from "@table/Column"
import { PaginationControls } from "@table/PaginationControls";
import { TableColumnHeader } from "@table/TableColumnHeader";
import { CustomSortingFunctions } from "./TableSortingFunctions";

import { Checkbox } from "@components/UI/Checkbox";
import { Button, Tooltip } from "@components/UI";
import { RadioButton } from "@components/UI/RadioButton";

const __TAILWIND_CSS = {
    container: "block mx-2 max-w-full", //"block max-w-full relative shadow-md",
    table_border: "border-collapse border-0 border-t-[4px] border-solid border-black",
    table_layout: "w-full overflow-x-scroll",
    table_text: "text-sm text-left rtl:text-right text-gray-700",
    td: "py-1.5 pr-6 pl-4 text-xs font-roboto border-solid border-slate-200 border-0 border-b-[1px] border-r-[1px]",
    dtr: "hover:bg-gray-50 bg-white border-b odd:border-gray-700"
}

const TABLE_CLASSES = `${__TAILWIND_CSS.table_border} ${__TAILWIND_CSS.table_layout} ${__TAILWIND_CSS.table_text}`

export interface Table {
    options?: TableConfig
    columns: GenericColumn[]
    data: TableData
}

const __resolveSortingFn = (col: GenericColumn) => {
    if (col.type === 'boolean') {
        return 'boolean';
    }
    if (col.type === 'float') {
        return 'scientific';
    }
    return 'alphanumeric';
}

// wrapper to catch any errors thrown during cell type and properties validation so that 
// user can more easily identify the problematic table cell by row/column
const __resolveCell = (userCell: GenericCell | GenericCell[], column: GenericColumn, index: number) => {
    try {
        return resolveCell(userCell, column)
    }
    catch (e: any) {
        throw Error("Validation Error parsing field value for row " + index + " column `" + column.id + "`.\n" + e.message)
    }
}


// TODO: (maybe?) catch hidden to skip during rendering
// NOTE: according to documentation https://tanstack.com/table/latest/docs/guide/column-visibility#column-visibility-state
// the HeaderGroup API will take column visibility into account

// render the table header
const __renderTableHeader = (hGroups: HeaderGroup<TableRow>[]) => (
    <thead>
        {hGroups.map((headerGroup: HeaderGroup<TableRow>) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                        <TableColumnHeader key={header.id} header={header} />
                    );
                })}
            </tr>
        ))}
    </thead>
)


// checks to see if a field contains a unique value for each row in the table
// allowing it to be used as a valid "primary key" or row_id for row selection
const __isValidRowId = (data: TableData, columnId: string) => {
    const values = data.map((row) => getCellValue(row[columnId as keyof typeof row] as Cell))
    return (Array.from(new Set(values)).length == data.length)
}


// builds data structure to initialize row selection state
const __setInitialRowSelection = (columnIds: string[] | undefined) => {
    let rSelection: RowSelectionState = {}
    if (columnIds) {
        columnIds.forEach((colId) => { rSelection[colId] = true })
    }
    return rSelection
}


export interface Table {
    options?: TableConfig
    columns: GenericColumn[]
    data: TableData
}

// TODO: use table options to initialize the state (e.g., initial sort, initial filter)
const Table: React.FC<Table> = ({ columns, data, options }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(__setInitialRowSelection(options?.rowSelect?.selectedValues))
    const initialRender = useRef(true) // to regulate callbacks affected by the initial state
    const enableRowSelect = !!options?.rowSelect?.onRowSelect

    // Translate GenericColumns provided by user into React Table ColumnDefs
    // also adds in checkbox column if rowSelect options are set for the table
    const resolvedColumns = useMemo<ColumnDef<TableRow>[]>(() => {
        const columnHelper = createColumnHelper<TableRow>();
        const columnDefs: ColumnDef<TableRow>[] = [];

        if (enableRowSelect) {
            const multiSelect: boolean = !!options?.rowSelect?.enableMultiRowSelect;
            columnDefs.push(
                {
                    id: 'select-col',
                    header: ({ table }) => (
                        multiSelect ?
                            <div className="inline-flex">
                                <div className="group relative inline-block bottom-[2px]">
                                    <Tooltip message="Reset selected rows">
                                        <Button size="sm" variant="primary"
                                            disabled={!table.getIsSomeRowsSelected()}
                                            onClick={() => { table.resetRowSelection(true) }}>
                                            <TrashIcon className="icon-button"></TrashIcon>
                                        </Button>
                                    </Tooltip>
                                </div>
                                <span className="ml-4">{options?.rowSelect?.header}</span>
                            </div>
                            : options?.rowSelect?.header
                    ),
                    enableSorting: true, // FIXME: enable sorting doesn't seem to work / header.canSort() returns false
                    meta: { description: options?.rowSelect?.description },
                    cell: ({ row }) => (
                        multiSelect ? <Checkbox
                            variant="default"
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                            alignCenter={true}
                        /> : <RadioButton
                            variant="default"
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                            alignCenter={true} />
                    ),
                },
            )
        }

        columns.forEach((col: GenericColumn) => {
            try {
                col.type = validateCellType(col.type)
            }
            catch (e: any) {
                throw Error("Error processing column definition for `" + col.id + "`.\n" + e.message)
            }

            columnDefs.push(
                columnHelper.accessor(row => getCellValue(row[col.id as keyof typeof row] as Cell),
                    {
                        id: col.id,
                        header: _get('header', col, toTitleCase(col.id)),
                        enableColumnFilter: _get('canFilter', col, true),
                        enableGlobalFilter: _get('disableGlobalFilter', col, false),
                        enableSorting: !col.disableSorting,
                        sortingFn: __resolveSortingFn(col) as SortingFnOption<TableRow>,
                        enableHiding: !(_get('required', col, false)), // if required is true, enableHiding is false
                        meta: { description: _get('description', col) },
                        cell: props => renderCell(props.cell.row.original[col.id] as Cell),
                    }
                )
            )
        });
        return columnDefs;
    }, []);

    const resolvedData = useMemo<TableData>(() => {
        let tableData: TableData = []
        const enFields = columns.length // expected number of fields
        try {
            data.forEach((row: TableRow, index: number) => {
                // validate expected number of fields per row observed
                const onFields = Object.keys(row).length // observed number of fields
                if (onFields > enFields) {
                    throw new Error(`Too many values detected in row ${index}: expected ${enFields}; found ${onFields}`)
                }
                if (onFields < enFields) {
                    throw new Error(`Missing columns in row ${index}: each row must provide a value for every column`)
                }

                const tableRow: TableRow = {}
                for (const [columnId, value] of Object.entries(row)) {
                    let currentColumn = getColumn(columnId, columns)
                    if (currentColumn === undefined) {
                        throw new Error("Invalid column name found in table data definition `" + columnId + "`");
                    }
                    tableRow[columnId] = __resolveCell(value, currentColumn, index)
                }
                tableData.push(tableRow)
            });
        }
        catch (e: any) {
            throw Error(e.message)
        }
        return tableData;
    }, [columns])


    // build table options conditionally
    // cannot memoize this b/c it depends on the state; 
    // doing so leads to very slow rerenders
    let reactTableOptions: TableOptions<TableRow> = {
        data: resolvedData,
        columns: resolvedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        /*defaultColumn: {
            size: 150,
            minSize: 0,
            maxSize: 300,
        },*/
        state: {
            sorting,
            rowSelection
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),      
        sortingFns: CustomSortingFunctions,
        enableColumnResizing: true,
    }

    if (enableRowSelect) {
        const enableMultiRowSelect = !!options?.rowSelect?.enableMultiRowSelect
        Object.assign(reactTableOptions, {
            enableMultiRowSelection: enableMultiRowSelect,
            onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
        })

        const rowIdColumn = options?.rowSelect?.rowId
        if (!!rowIdColumn) {
            if (__isValidRowId(resolvedData, rowIdColumn)) {
                Object.assign(reactTableOptions, {
                    getRowId: (row: TableRow) => getCellValue(row[rowIdColumn as keyof typeof row] as Cell)
                })
            }
            else {
                throw Error(`The field ${rowIdColumn} does not contain a unique value for each row.  It cannot be used as the 'rowId' for the rowSelect callback.`)
            }
        }
    }

    const table = useReactTable(reactTableOptions);

    useLayoutEffect(() => {
        if (options?.onTableLoad) {
            // TODO: if (firstUpdate.current)  // firstUpdate is a useRef / from GenomicsDB code; has to do w/pre-selected rows
            table && options.onTableLoad(table);
        }
    }, [table]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        options?.rowSelect?.onRowSelect(rowSelection)
        // TODO: if (firstUpdate.current)  // firstUpdate is a useRef / from GenomicsDB code; has to do w/pre-selected rows
    }, [rowSelection])

    return (
        table ? (<>
            <div className={__TAILWIND_CSS.container}>
                <PaginationControls table={table} />
                <div className="overflow-auto">
                    <table className={TABLE_CLASSES}>
                        {__renderTableHeader(table.getHeaderGroups())}
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className={__TAILWIND_CSS.dtr}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td className={__TAILWIND_CSS.td} key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
        ) :
            <div>No data</div>
    )
}

const TableWithErrorBoundary = withErrorBoundary(Table, {
    FallbackComponent: errorFallback,
    onError(error, info) {
        console.error(error);
    },
})

export default TableWithErrorBoundary