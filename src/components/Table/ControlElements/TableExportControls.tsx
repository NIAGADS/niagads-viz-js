import React, { useState, useEffect, useId } from "react"
import { Table as ReactTable } from "@tanstack/react-table"
import exportFromJson from "export-from-json"

import { Button, Checkbox, RadioButton, Select } from "@components/UI"
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"
import { _get } from "@common/utils"


type __EXPORT_FROM_JSON_TYPES = typeof exportFromJson.types

export const buildTableExport = (table: ReactTable<any>, filteredRowsOnly: boolean, format: string) => {
    const exportType = exportFromJson.types[format as keyof __EXPORT_FROM_JSON_TYPES]
}


interface ExportMenuOptions {
    onSubmit?: any
    isFiltered: boolean
    exportOptions: string[]
}

// working from https://www.creative-tim.com/twcomponents/component/pure-css-dropdown-using-focus-within
// idea to create a drop down menu w/select which data and which format

export const TableExportControls = ({ isFiltered, exportOptions, onSubmit }: ExportMenuOptions) => {
    const [exportAllRows, setExportAllRows] = useState<boolean>(isFiltered);
    const formId = useId()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event.currentTarget);
        const formData = new FormData(event.currentTarget);
        onSubmit(Object.fromEntries(formData))
    };



    useEffect(() => {
        setExportAllRows(isFiltered)
    }, [isFiltered])

    return (
        <div className="relative inline-block text-left dropdown">
            <Button variant="white">
                <ArrowDownTrayIcon className="icon-button"></ArrowDownTrayIcon>
                <span className="ml-2 uppercase">Export</span>
            </Button>

            <div className="hidden dropdown-menu">
                <div className="z-50 absolute left-0 w-56 mt-2 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                    <div className="px-4 py-3">
                        <form id={formId} onSubmit={handleSubmit}>
                            {isFiltered &&
                                <Checkbox name='export_all' variant="accent"
                                    value={exportAllRows.toString()}
                                    label="Visible Rows Only" checked={exportAllRows}
                                    onChange={() => setExportAllRows(!exportAllRows)}></Checkbox>}
                            <Select id={`${formId}_select_export_format"`} name="format" fields={exportOptions} label="Export table data as"></Select>
                            <div className="mt-2 flex justify-center">
                                <Button variant="accent" size="sm" >Export</Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}