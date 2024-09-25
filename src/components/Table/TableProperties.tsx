import { BasicType, FileFormat } from "@common/types"
import { GenericCell } from "@table/Cell"
import { RowSelectionState } from "@tanstack/react-table"

export interface RowSelectOptions {
    onRowSelect: (rowSelection: RowSelectionState) => void // behavior on select
    header: string,
    description?: string,
    enableMultiRowSelect?: boolean // optional: allow selection of multiple rows, false if missing
    selectedValues?: string[], // a list of unique row identifiers the be selected in advance
    rowId?: string // specify a field containing unique values to return as the row_id (e.g., browser track key) instead of the index
}

interface SortConfig {[column: string]: 'asc' | 'desc'}
interface FilterConfig {[column: string]: BasicType}

interface InitialTableState {
    sort?: SortConfig
    filter?: FilterConfig
}

export interface TableConfig {
    title?: string
    id?:string // optional: internal id for the table
    initialize?: InitialTableState // optional: set initial sort and/or filter state for the table
    description?: string // optional: descriptive text describing the table for info popup
    canFilter?: boolean // optional: disables all filtering on the table when false; default TRUE
    exportFileTypes?: FileFormat[] // optional: enable exports in the listed file formats; exports disabled if missing
    rowSelect?: RowSelectOptions // optional: enables row selection and related state change options
    defaultColumns?: string[] // optional: any column ids not listed will be hidden by default
    onTableLoad?: any,
    disableMultiSelect?: boolean //optional: only allows a single row to be selected; uses radio buttons instead of checkboxes
}

export type TableRow = Record<string, GenericCell | GenericCell[]>
export type TableData = TableRow[]




