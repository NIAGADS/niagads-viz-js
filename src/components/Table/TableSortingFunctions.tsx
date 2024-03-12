// adapted from: https://github.com/TanStack/table/blob/3e760e3eab4dfc1c7168e418741566e42ba7dd25/packages/table-core/src/sortingFns.ts
// basically, wrappers to parseValues from objects in the table
// and catch N/A's to treat them like null values

import { Row } from "@tanstack/react-table";
import { parseFieldValue } from "./utils";
import { TableData } from "./types";

const reSplitAlphaNumeric = /([0-9]+)/gm;

interface SortingFunction {
    (rowA: Row<TableData>, rowB: Row<TableData>, columnId: string): number;
}

const getValue: any = (row: Row<TableData>, columnId: string, retString: boolean = true) => {
    const value = row.getValue(columnId);
    const parsed = parseFieldValue(value, "N/A");
    return retString ? toString(parsed) : parsed;
};

const getBooleanValue: any = (row: Row<TableData>, columnId: string) => {
    const value = row.getValue(columnId);
    const parsed = parseFieldValue(value, "N/A");
    return parsed === "Yes" ? 1 : 0;
};

export const barChartSort: SortingFunction = (rowA, rowB, columnId, ) => {
    return compareAlphanumeric(getValue(rowA, columnId), getValue(rowB, columnId));
};

export const booleanFlagSort: SortingFunction = (rowA, rowB, columnId, ) => {
    const a = getBooleanValue(rowA, columnId),
        b = getBooleanValue(rowB, columnId);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

export const linkSort: SortingFunction = (rowA, rowB, columnId, ) => {
    return compareBasic(getValue(rowA, columnId).toLowerCase(), getValue(rowB, columnId).toLowerCase());
};

export const scientificNotationSort: SortingFunction = (rowA, rowB, columnId, ) => {
    let a = getValue(rowA, columnId, false),
        b = getValue(rowB, columnId, false);
    (a = a === null || a === undefined ? -Infinity : a), (b = b === null || b === undefined ? -Infinity : b);
    a = /\d\.\d+e-\d+/.test(a) ? +a : a;
    b = /\d\.\d+e-\d+/.test(b) ? +b : b;
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
};

export const alphanumericSort: SortingFunction = (rowA, rowB, columnId) => {
    return compareAlphanumeric(getValue(rowA, columnId).toLowerCase(), getValue(rowB, columnId).toLowerCase());
};

export const alphanumericCaseSensitiveSort: SortingFunction = (rowA, rowB, columnId) => {
    return compareAlphanumeric(getValue(rowA, columnId), getValue(rowB, columnId));
};

// The text filter is more basic (less numeric support)
// but is much faster
export const textSort: SortingFunction = (rowA, rowB, columnId) => {
    return compareBasic(getValue(rowA, columnId).toLowerCase(), getValue(rowB, columnId).toLowerCase());
};

// The text filter is more basic (less numeric support)
// but is much faster
export const textCaseSensitiveSort: SortingFunction = (rowA, rowB, columnId) => {
    return compareBasic(getValue(rowA, columnId), getValue(rowB, columnId));
};

export const basicSort: SortingFunction = (rowA, rowB, columnId) => {
    return compareBasic(getValue(rowA, columnId, false), getValue(rowB, columnId, false));
};

// Utils
function toString(a: any) {
    if (typeof a === "number") {
        if (isNaN(a) || a === Infinity || a === -Infinity) {
            return "";
        }
        return String(a);
    }
    if (typeof a === "string") {
        return a;
    }
    return "";
}

function resolveNAs(aStr: string, bStr: string) {
    switch (true) {
        case aStr == "N/A" && bStr == "N/A":
            return 0;
        case aStr != "N/A" && bStr == "N/A":
            return -1;
        case aStr == "N/A" && bStr != "N/A":
            return 1;
        default: // neither na
            return null;
    }
}

function compareBasic(a: any, b: any) {
    const naComparison = resolveNAs(a, b);
    if (naComparison != null) {
        return naComparison;
    }
    return a === b ? 0 : a > b ? 1 : -1;
}

// Mixed sorting is slow, but very inclusive of many edge cases.
// It handles numbers, mixed alphanumeric combinations, and even
// null, undefined, and Infinity
function compareAlphanumeric(aStr: string, bStr: string) {
    // Split on number groups, but keep the delimiter
    // Then remove falsey split values

    const naComparison = resolveNAs(aStr, bStr);
    if (naComparison != null) {
        return naComparison;
    }

    const a = aStr.split(reSplitAlphaNumeric).filter(Boolean);
    const b = bStr.split(reSplitAlphaNumeric).filter(Boolean);

    // While
    while (a.length && b.length) {
        const aa = a.shift()!;
        const bb = b.shift()!;

        const an = parseInt(aa, 10);
        const bn = parseInt(bb, 10);

        const combo = [an, bn].sort();

        // Both are string
        if (isNaN(combo[0]!)) {
            if (aa > bb) {
                return 1;
            }
            if (bb > aa) {
                return -1;
            }
            continue;
        }

        // One is a string, one is a number
        if (isNaN(combo[1]!)) {
            return isNaN(an) ? -1 : 1;
        }

        // Both are numbers
        if (an > bn) {
            return 1;
        }
        if (bn > an) {
            return -1;
        }
    }

    return a.length - b.length;
}

const TableSortingFunctions = {
    alphanumeric: alphanumericSort,
    alphanumericCaseSensitive: alphanumericCaseSensitiveSort,
    basic: basicSort,
    textCaseSensitive: textCaseSensitiveSort,
    text: textSort,
    barChart: barChartSort,
    booleanFlag:booleanFlagSort,
    link: linkSort,
    scientificNotation: scientificNotationSort,
};

export default TableSortingFunctions;
