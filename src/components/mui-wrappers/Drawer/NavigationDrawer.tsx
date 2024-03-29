/* drawer tied to navigation toolbar */
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import {
  AppBar,
  Toolbar,
  Drawer,
  Divider,
  Grid,
  Button,
  Box,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { StyledTooltip as Tooltip } from "@mui-wrappers/Tooltips";
import { DrawerProps, DrawerContentsProps, DRAWER_WIDTH } from "./types"

const useDrawerStyles = (props: any) =>
  makeStyles((theme: Theme) => ({
    drawerHeader: {
      //display: "flex",
      //alignItems: "center",
      //padding: theme.spacing(0, 3),
      // necessary for content to be below app bar
      //...theme.mixins.toolbar,
      //justifyContent: "flex-end",
      //marginTop: theme.spacing(1),
    },
    drawerHeaderContents: {
      //backgroundColor: theme.palette.secondary.main,
      //borderRadius: 4,
      marginBottom: theme.spacing(1),
    },
    title: {
      fontSize: theme.typography.pxToRem(12),
    },
    actionButton: {
      marginTop: theme.spacing(1),
      // justifyContent: "left"
    },
    divider: {
      marginTop: theme.spacing(1),
    },
    children: {
      marginTop: theme.spacing(1),
    },
    content: {
      //padding: theme.spacing(3),
    },
    sideDrawer: {
      width: props.width || DRAWER_WIDTH,
      flexShrink: 0,
    },
    sideDrawerPaper: {
      width: props.width || DRAWER_WIDTH,
    },
    fullWidth: {
      margin: "auto",
    },
  }));

export const NavigationDrawer: React.FC<DrawerProps & DrawerContentsProps> = (props) => {
  const {
    navigation,
    navigationProps,
    drawerContents,
    drawerSections,
    drawerProps,
    drawerHeaderContents,
    toggleAnchor,
    toggleIcon,
    toggleHelp,
    toggleText,
    children,
    className,
    drawerCloseLabel,
    width,
    encapsulated,
  } = props;
  const classes = useDrawerStyles(props)();
  const [open, setOpen] = useState(false);

  const handleToggleClick = () => {
    setOpen(!open);
  };

  const renderDrawerHeader = (
    <Grid
      container
      className={classes.drawerHeader}
      justifyContent="center"
      spacing={2}>
      <Grid item>
        <Button
          variant="text"
          color="primary"
          endIcon={<ChevronLeftIcon />}
          onClick={handleToggleClick}
          fullWidth={true}
          size="small"
          className={classes.actionButton}>
          {drawerCloseLabel ? drawerCloseLabel : "Close"}
        </Button>
      </Grid>
      <Grid className={classes.drawerHeaderContents} item>
        {drawerHeaderContents}
      </Grid>
    </Grid>
  );

  const renderDrawerSections = (
    <>
      {drawerSections?.map((section, index) => {
        return <div key={index}>{section}</div>;
      })}
    </>
  );

  const renderDrawer = (
    <>
      {renderDrawerHeader}
      <Divider className={classes.divider}></Divider>
      {drawerContents && (
        <Box className={classes.content}>{drawerContents}</Box>
      )}
      {drawerSections && (
        <Box className={classes.content}>{renderDrawerSections}</Box>
      )}
    </>
  );

  /*const renderEncapsulatedDrawer = (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item style={{ minWidth: DRAWER_WIDTH, width: DRAWER_WIDTH}}>
                {renderDrawer}
            </Grid>
            <Grid item style={{ marginLeft: "36px" }}>
                {children}
            </Grid>
        </Grid>
    );*/

  const renderEncapsulatedDrawer = (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start">
      <Box style={{ minWidth: DRAWER_WIDTH, width: DRAWER_WIDTH }}>
        {renderDrawer}
      </Box>
      <Box sx={{ maxWidth: "lg" }} style={{ marginLeft: "36px", width: "70%" }}>
        {children}
      </Box>
    </Grid>
  );

  return (
    <React.Fragment key={toggleAnchor}>
      <AppBar
        position="static"
        elevation={0}
        {...navigationProps}
        className={className}>
        <Toolbar variant="dense" disableGutters>
          {toggleIcon && (
            <Tooltip title={toggleHelp} aria-label={toggleHelp}>
              <Button
                style={toggleAnchor === "right" ? { marginLeft: "auto" } : {}}
                color="primary"
                variant="contained"
                aria-label="toggle-secondary-navigation"
                onClick={handleToggleClick}
                startIcon={toggleIcon}
                size="small"
                disableElevation={true}>
                {toggleText}
              </Button>
            </Tooltip>
          )}
          {navigation && navigation}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={toggleAnchor}
        open={open}
        classes={{
          paper: clsx(classes.sideDrawerPaper, {
            "": toggleAnchor === "top" || toggleAnchor === "bottom",
          }),
        }}
        className={clsx(classes.sideDrawer, {
          [classes.fullWidth]:
            toggleAnchor === "top" || toggleAnchor === "bottom",
        })}
        variant="temporary"
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            setOpen(false);
          }
        }}
        {...drawerProps}>
        {encapsulated ? renderEncapsulatedDrawer : renderDrawer}
      </Drawer>

      {!encapsulated && children}
    </React.Fragment>
  );
};
