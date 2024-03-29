import React from "react";

import { LinkProps } from "@mui/material";
import Link from "@mui/material/Link";

import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme: Theme) =>
    ({
        secondary: {
            color: theme.palette.secondary.main,
            "&:hover": {
                color: theme.palette.secondary.light,
            },
        },
    })
);

// just a wrapper to set target="_blank"
// using .forwardRef so that tooltips / mouse over events can be associated w/the links
interface CustomLinkProps {
    style?: "secondary" | "default";
}
export const CustomLink = React.forwardRef((props: LinkProps & CustomLinkProps, ref) => {
    const { href, color, children, className, style } = props;
    const classes = useStyles();

    const linkStyle = style ? (style === "secondary" ? classes.secondary : undefined) : undefined;
    const linkClassName = className ? (linkStyle ? className + " " + linkStyle : className) : linkStyle ? linkStyle : undefined;

    return (
        <Link
            // innerRef={ref} -- TODO: fix this
            href={href}
            color={color ? color : undefined}
            className={linkClassName}
            target={props.target ? props.target : "_blank"}
            rel="noopener"
        >
            {children}
        </Link>
    );
});
