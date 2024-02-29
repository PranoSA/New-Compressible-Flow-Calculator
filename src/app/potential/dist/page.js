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
var react_1 = require("react");
var Flow_1 = require("@/utils/Flow");
var Flow_Form_1 = require("@/components/Flow_Form");
var FlowEnergyCharts_1 = require("@/components/FlowEnergyCharts");
var FlowDisplay_1 = require("@/components/FlowDisplay");
var FilterTraits = [
    'expr',
    'entropy',
    'constructor',
    'gamma',
    'R',
    'Cp',
    'Cv',
    'Enthalpy',
    'expansionToPressurePE',
    'expansionToKineticPE',
    'expansionToDensityVolume',
];
var PotentialComparisonPage = function () {
    var _a = react_1.useState(new Flow_1["default"](0, 0, 0, 1.4, 287)), flow1 = _a[0], setFlow1 = _a[1];
    var _b = react_1.useState(new Flow_1["default"](0, 0, 0, 1.4, 287)), flow2 = _b[0], setFlow2 = _b[1];
    //What We Want to Do Here is Have Two flows
    var _c = react_1.useState(0), entropyDifference = _c[0], setEntropyDifference = _c[1];
    var _d = react_1.useState(0), expansionPressure = _d[0], setExpansionPressure = _d[1];
    //THis WIll Be Used For Both KE and Expansion work potential
    var _e = react_1.useState(0), expansionWork1 = _e[0], setExpansionWork1 = _e[1];
    var _f = react_1.useState(0), kineticEnergy1 = _f[0], setKineticEnergy1 = _f[1];
    var _g = react_1.useState(0), expansionWork2 = _g[0], setExpansionWork2 = _g[1];
    var _h = react_1.useState(0), kineticEnergy2 = _h[0], setKineticEnergy2 = _h[1];
    var _j = react_1.useState([]), chosenTraits = _j[0], setChosenTraits = _j[1];
    react_1.useEffect(function () {
        setExpansionWork1(flow1.expansionToPressurePE(expansionPressure));
        setExpansionWork2(flow2.expansionToPressurePE(expansionPressure));
        setKineticEnergy1(flow1.expansionToKineticPE(expansionPressure));
        setKineticEnergy2(flow2.expansionToKineticPE(expansionPressure));
        setEntropyDifference(Flow_1["default"].EntropyDifference(flow1, flow2));
    }, [flow1, flow2, expansionPressure]);
    // And Then Display the different potential kinetic energy and expansion pressure energy of the flow
    return (React.createElement("div", { className: "w-full flex flex-wrap" },
        React.createElement("div", { className: "w-full flex flex-wrap" },
            "Flow 1",
            React.createElement(Flow_Form_1["default"], { flow: flow1, setFlow: setFlow1, setTraits: function (traits) { return setChosenTraits(traits); } })),
        React.createElement("div", { className: "w-full flex flex-wrap" },
            "Flow 2",
            React.createElement(Flow_Form_1["default"], { flow: flow2, setFlow: setFlow2, setTraits: function (traits) { return setChosenTraits(traits); } })),
        React.createElement("div", { className: "w-full flex flex-wrap md:w-1/2" },
            React.createElement("div", { className: "md:w-1/2 p-2" },
                React.createElement("label", { className: "block" }, "Expansion Pressure"),
                React.createElement("input", { type: "number", value: expansionPressure, onChange: function (e) { return setExpansionPressure(parseFloat(e.target.value)); } })),
            React.createElement("div", { className: "md:w-1/2 p-2" },
                React.createElement("label", { className: "block" }, "Entropy Difference"),
                React.createElement("h2", null,
                    entropyDifference.toPrecision(4),
                    " J/K "))),
        React.createElement("div", { className: "w-full flex flex-wrap md:w-1/2 p-15" },
            React.createElement("div", { className: "md:w-1/2 p-2" },
                React.createElement("label", { className: "block" }, "Expansion Work 1"),
                React.createElement("h2", null,
                    " ",
                    expansionWork1.toPrecision(4),
                    " Joules ")),
            React.createElement("div", { className: "md:w-1/2 p-2" },
                React.createElement("label", { className: "block" }, "Expansion Work 2"),
                React.createElement("h2", null,
                    " ",
                    expansionWork2.toPrecision(4),
                    " Joules "))),
        React.createElement("div", { className: "w-full p-5" }),
        React.createElement("div", { className: "w-full md:w-1/2" },
            React.createElement(FlowEnergyCharts_1["default"], { flow: flow1, output_pressure: expansionPressure })),
        React.createElement("div", { className: "w-full md:w-1/2" },
            React.createElement(FlowEnergyCharts_1["default"], { flow: flow2, output_pressure: expansionPressure })),
        React.createElement("div", { className: "w-full md:w-1/2" },
            React.createElement(FlowDisplay_1["default"], { flow: flow1, filter_traits: __spreadArrays(FilterTraits, chosenTraits) })),
        React.createElement("div", { className: "w-full md:w-1/2" },
            React.createElement(FlowDisplay_1["default"], { flow: flow2, filter_traits: __spreadArrays(FilterTraits, chosenTraits) }))));
};
exports["default"] = PotentialComparisonPage;
