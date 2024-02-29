'use client';
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
function FlowDisplayChart(props) {
    var flow = props.flow;
    var filter_traits = props.filter_traits;
    var transformSameValue = function (value) {
        //Limit to 3 decimals or NaN
        return isNaN(value) ? 'NaN' : value.toPrecision(4);
    };
    return (React.createElement("div", { className: "w-full flex flex-wrap" },
        React.createElement("div", { className: "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, __spreadArrays(Object.getOwnPropertyNames(flow), Object.getOwnPropertyNames(Object.getPrototypeOf(flow))).map(function (key) {
            return !filter_traits.includes(key) && (React.createElement("div", { key: key, className: "border p-4 flex flex-col items-center justify-center" },
                React.createElement("label", { className: "font-bold" }, key),
                React.createElement("div", null, 
                //@ts-ignore
                transformSameValue(flow[key]))));
        }))));
}
exports["default"] = FlowDisplayChart;
