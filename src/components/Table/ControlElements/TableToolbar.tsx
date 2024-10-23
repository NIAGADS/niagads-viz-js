import React, { useMemo, useCallback } from "react"

import { Column as ReactTableColumn, Table as ReactTable } from "@tanstack/react-table"
import { ViewColumnsIcon } from '@heroicons/react/24/solid'

import { Button, SearchInput, Tooltip } from "@components/UI"
import { FileFormat } from "@common/types"
import { TableRow } from "@table/TableProperties"
import { TableExportControls, exportTable } from "./TableExportControls"
import { _get } from "@common/utils"


// column.getCanHide

interface ToolbarProps {
    table: ReactTable<TableRow>
    tableId: string
    enableExport: boolean
}

// if all columns are required, then cannot toggle column visibility for the table
const __canToggleColumns = (columns: ReactTableColumn<TableRow>[]) => {
    const requiredColumns = columns.map((col) => (!col.getCanHide()))
    return requiredColumns.some(x => (x === false))
}


export const TableToolbar = ({ table, tableId, enableExport }: ToolbarProps) => {
    const canToggleColumns = useMemo(() => (__canToggleColumns(table.getAllColumns())), [])
    const tableIsFiltered: boolean = table.getState().globalFilter !== '' /* && table.getState().columnFilters ? -> array so not sure what to test yet */

    const handleTableExport = useCallback((options: any) => { // FIXME:? Not sure if useCallback is necessary here
        exportTable(table, tableId, _get('filtered_only', options, false), options.format)
    }, [])

    return <div className="relative flex justify-end gap-2 m-2">
        <SearchInput value={table.getState().globalFilter} onChange={val => table.setGlobalFilter(val)} />
        {canToggleColumns && <Tooltip message="Show/Hide Columns">
            <Button variant="white" onClick={() => alert('show hide columns')} >
                <ViewColumnsIcon className={`icon-button`}></ViewColumnsIcon>
                <span className="ml-2 uppercase">Columns</span>
            </Button>
        </Tooltip>}
        {enableExport && 
            <TableExportControls onSubmit={handleTableExport} isFiltered={tableIsFiltered}/>
        }


    </div>
}

