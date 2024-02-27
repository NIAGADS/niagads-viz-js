import e,{useState as t}from"react";import a from"clsx";import{makeStyles as r}from"@mui/styles";import{Grid as n,Button as i,Divider as o,Box as l,AppBar as s,Toolbar as m,Drawer as c}from"@mui/material";import d from"@mui/icons-material/ChevronLeft";import{StyledTooltip as p}from"../Tooltips.js";import{DRAWER_WIDTH as g}from"./types.js";const w=w=>{const{navigation:E,navigationProps:h,drawerContents:f,drawerSections:u,drawerProps:y,drawerHeaderContents:v,toggleAnchor:C,toggleIcon:x,toggleHelp:b,toggleText:N,children:k,className:j,drawerCloseLabel:H,width:T,encapsulated:D}=w,W=(e=>r((t=>({drawerHeader:{},drawerHeaderContents:{marginBottom:t.spacing(1)},title:{fontSize:t.typography.pxToRem(12)},actionButton:{marginTop:t.spacing(1)},divider:{marginTop:t.spacing(1)},children:{marginTop:t.spacing(1)},content:{},sideDrawer:{width:e.width||g,flexShrink:0},sideDrawerPaper:{width:e.width||g},fullWidth:{margin:"auto"}}))))(w)(),[I,L]=t(!1),P=()=>{L(!I)},z=e.createElement(n,{container:!0,className:W.drawerHeader,justifyContent:"center",spacing:2},e.createElement(n,{item:!0},e.createElement(i,{variant:"text",color:"primary",endIcon:e.createElement(d,null),onClick:P,fullWidth:!0,size:"small",className:W.actionButton},H||"Close")),e.createElement(n,{className:W.drawerHeaderContents,item:!0},v)),B=e.createElement(e.Fragment,null,null==u?void 0:u.map(((t,a)=>e.createElement("div",{key:a},t)))),F=e.createElement(e.Fragment,null,z,e.createElement(o,{className:W.divider}),f&&e.createElement(l,{className:W.content},f),u&&e.createElement(l,{className:W.content},B)),S=e.createElement(n,{container:!0,direction:"row",justifyContent:"flex-start",alignItems:"flex-start"},e.createElement(l,{style:{minWidth:g,width:g}},F),e.createElement(l,{sx:{maxWidth:"lg"},style:{marginLeft:"36px",width:"70%"}},k));return e.createElement(e.Fragment,{key:C},e.createElement(s,Object.assign({position:"static",elevation:0},h,{className:j}),e.createElement(m,{variant:"dense",disableGutters:!0},x&&e.createElement(p,{title:b,"aria-label":b},e.createElement(i,{style:"right"===C?{marginLeft:"auto"}:{},color:"primary",variant:"contained","aria-label":"toggle-secondary-navigation",onClick:P,startIcon:x,size:"small",disableElevation:!0},N)),E&&E)),e.createElement(c,Object.assign({anchor:C,open:I,classes:{paper:a(W.sideDrawerPaper,{"":"top"===C||"bottom"===C})},className:a(W.sideDrawer,{[W.fullWidth]:"top"===C||"bottom"===C}),variant:"temporary",onClose:(e,t)=>{"backdropClick"!==t&&"escapeKeyDown"!==t||L(!1)}},y),D?S:F),!D&&k)};export{w as NavigationDrawer};
//# sourceMappingURL=NavigationDrawer.js.map