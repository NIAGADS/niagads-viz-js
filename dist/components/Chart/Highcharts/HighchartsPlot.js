import t,{useState as e,useLayoutEffect as r}from"react";import{merge as o,omit as a}from"lodash";import{buildChartOptions as s,addCategories as i,addSeries as h,addTitle as p}from"./HighchartsOptions.js";import c from"highcharts";import m from"highcharts-react-official";import n from"highcharts/modules/exporting";import l from"highcharts/modules/export-data";import g from"highcharts/modules/data";import d from"highcharts/modules/heatmap";function f(t,e,r){let a=s(e.type);return t&&(t.categories&&(a=o(a,i(t.categories))),t.ycategories&&(a=o(a,i(t.ycategories,"yAxis"))),t.series&&(a=o(a,h(t.series))),t.title&&(a=o(a,p(t.title)))),r&&(a=o(a,r)),a}n(c),l(c),g(c),d(c),require("highcharts/highcharts-more")(c);const u=o=>{const{data:s,properties:i,noDataMessage:h,displayNoDataMessage:p,plotOptions:n,callback:l,containerProps:g}=o,[d,u]=e(n);r((()=>{u(f(s,i,n))}),[s,n]);const y=d?"Loading...":h||"None reported.",x=!1!==p,D=a(o,["data","properties","noDataMessage","displayNoDataMessage","plotOptions"]);return d?t.createElement(m,Object.assign({highcharts:c,options:d},D,g)):x?t.createElement("div",null,y):null};export{f as buildOptions,u as default};
//# sourceMappingURL=HighchartsPlot.js.map