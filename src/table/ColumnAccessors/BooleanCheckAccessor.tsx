import React from "react";
import Box from "@mui/material/Box";

import CheckIcon from "@mui/icons-material/Check";
import { ColumnAccessor } from "@table/ColumnAccessors";

export const BooleanCheckAccessor: React.FC<ColumnAccessor> = ({ value, className, htmlColor, muiColor }) => {
    if (value && ["true", "yes"].includes(value.toString().toLowerCase())) {
        return (
            <Box component="span">
                <CheckIcon
                    className={className ? className : undefined}
                    color={muiColor ? muiColor : undefined}
                    htmlColor={htmlColor ? htmlColor : undefined}
                    fontSize="inherit"
                ></CheckIcon>
            </Box>
        );
    }
    return null;
};
