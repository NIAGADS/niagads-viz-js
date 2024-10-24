import React, { useState, useEffect, useId } from "react";

import { Button } from "@components/UI";
import { ViewColumnsIcon } from "@heroicons/react/24/solid";
import { _get } from "@common/utils";
import { GenericColumn } from "@table/Column";
import { Column } from "@tanstack/react-table";
import { TableRow } from "@table/TableProperties";

interface ColumnControlsProps {
    columns: Column<TableRow, unknown>[];
    onSelect: (col: GenericColumn) => void;
}

// working from https://www.creative-tim.com/twcomponents/component/pure-css-dropdown-using-focus-within
// idea to create a drop down menu w/select which data and which format

export const ColumnControls = ({ columns, onSelect }: ColumnControlsProps) => {
    console.log(columns);

    return (
        <div className="relative inline-block text-left dropdown">
            <Button variant="white">
                <ViewColumnsIcon className={`icon-button`}></ViewColumnsIcon>
                <span className="ml-2 uppercase">Columns</span>
            </Button>

            <div className="hidden dropdown-menu">
                <div
                    className="z-50 absolute left-0 w-56 mt-2 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                    role="menu"
                >
                    <div className="flex flex-col px-4 py-3">
                        {columns.map((col) => {
                            console.log(col);
                            return col.getCanHide() ? (
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={col.getIsVisible()}
                                        onChange={col.getToggleVisibilityHandler()}
                                    />
                                    {col.columnDef.header?.toString()}
                                </label>
                            ) : (
                                <></>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
