import React from 'react';
import { BasicType, TypeMapper, NAString, Expand, Modify } from '@common/types';
import { GenericCell } from '@table/Cell';
import { RowSelectionState } from '@tanstack/react-table';
import { Color } from '@common/palettes';
import { BadgeIconType } from '@text/Badge';

interface RowSelectOptions {
    onRowSelect: (rowSelection: RowSelectionState) => void;
    header: string;
    description?: string;
    enableMultiRowSelect?: boolean;
    selectedValues?: string[];
    rowId?: string;
}
interface SortConfig {
    [column: string]: 'asc' | 'desc';
}
interface FilterConfig {
    [column: string]: BasicType;
}
interface InitialTableState {
    sort?: SortConfig;
    filter?: FilterConfig;
}
interface TableConfig {
    title?: string;
    initialize?: InitialTableState;
    description?: string;
    disableColumnFilters?: boolean;
    disableExport?: boolean;
    rowSelect?: RowSelectOptions;
    defaultColumns?: string[];
    onTableLoad?: any;
    disableMultiSelect?: boolean;
}
type TableRow = Record<string, GenericCell | GenericCell[]>;
type TableData = TableRow[];

type AbstractCell = {
    type: "abstract";
    value: BasicType | null;
    rowId: number;
    columnId: number;
    nullValue?: BasicType | null;
    naValue?: NAString;
};
type FloatCell = Expand<Modify<AbstractCell, {
    type: "float";
    value: number | null;
    precision?: number;
}>>;
type TextCell = Expand<Modify<AbstractCell, {
    type: "text";
    truncateTo?: number;
    color?: Color;
    tooltip?: string;
}>>;
type TextListCell = Expand<Modify<AbstractCell, {
    type: "text_list";
    value: string;
    items: TextCell[];
}>>;
type BadgeCell = Expand<Modify<TextCell, {
    type: "badge";
    backgroundColor?: Color;
    borderColor?: Color;
    icon?: BadgeIconType;
}>>;
type BooleanCell = Expand<Modify<BadgeCell, {
    type: "boolean";
    value: boolean | null;
    displayText?: BasicType;
}>>;
type LinkCell = Expand<Modify<AbstractCell, {
    type: "link";
    url: string;
    tooltip?: string;
}>>;
type LinkListCell = Expand<Modify<AbstractCell, {
    type: "link_list";
    value: string;
    items: LinkCell[];
}>>;
type PercentageBarCell = Expand<Modify<FloatCell, {
    type: "percentage_bar";
    colors?: [Color, Color];
}>>;
type Cell = PercentageBarCell | FloatCell | AbstractCell | TextCell | TextListCell | BadgeCell | BooleanCell | LinkCell | LinkListCell;
type CellTypeMapper = TypeMapper<Cell>;
type CellType = keyof CellTypeMapper;

interface ColumnValueFormat {
    nullValue?: BasicType | null;
    naValue?: NAString;
    trueValue?: BasicType;
    precision?: number;
}
interface GenericColumn {
    header?: string;
    id: string;
    description?: string;
    type?: CellType;
    canFilter?: boolean;
    disableGlobalFilter?: boolean;
    disableSorting?: boolean;
    required?: boolean;
    format?: ColumnValueFormat;
}

interface TableProps {
    id: string;
    options?: TableConfig;
    columns: GenericColumn[];
    data: TableData;
}
declare const TableWithErrorBoundary: React.ForwardRefExoticComponent<TableProps & React.RefAttributes<any>>;

export { TableWithErrorBoundary as Table };
