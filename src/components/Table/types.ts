import { TextRendererType , TextRenderer } from "../Text";

export type ColumnAccessorType = TextRendererType;

export interface ColumnAccessor extends TextRenderer {};

export type AllowableTableDataValue = string | number | boolean | { [key: string] : string } | null;

export type TableData = Record<string, AllowableTableDataValue>;

export interface Column<T> {
    header: string;
    canSort: boolean;
    disable: boolean;
    accessorType: ColumnAccessorType
    id: string;
    sortType: string;
    help?: string;
    show?: boolean;
    filter?: string;
    accessorFn?: (row: T) => any;
}
