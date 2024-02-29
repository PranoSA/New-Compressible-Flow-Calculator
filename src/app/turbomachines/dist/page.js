'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Flow_1 = require("@/utils/Flow");
var Turbomachines_1 = require("@/utils/Turbomachines");
var FlowDisplay_1 = require("@/components/FlowDisplay");
var FlowEnergyCharts_1 = require("@/components/FlowEnergyCharts");
var Flow_Form_1 = require("@/components/Flow_Form");
var Home = function () {
    //flow = inputFlow
    var _a = react_1.useState(new Flow_1["default"](0, 0, 0, 1.4, 287)), flow = _a[0], setFlow = _a[1];
    var _b = react_1.useState(0), pressureOptionValue = _b[0], setPressureOptionValue = _b[1];
    var _c = react_1.useState('Compressor'), turbomachine = _c[0], setTurbomachine = _c[1];
    var _d = react_1.useState('Polytropic'), efficiencySetting = _d[0], setEfficiencySetting = _d[1];
    var _e = react_1.useState(1.0), efficiency = _e[0], setEfficiency = _e[1];
    var _f = react_1.useState(1.0), pressureRatio = _f[0], setPressureRatio = _f[1];
    var _g = react_1.useState(new Flow_1["default"](0, 0, 0, 1.4, 287)), outputFlow = _g[0], setOutputFlow = _g[1];
    var transformSameValue = function (value) {
        //Limit to 3 decimals or NaN
        return isNaN(value) ? 'NaN' : value.toFixed(3);
    };
    react_1.useEffect(function () {
        if (turbomachine === 'Compressor') {
            if (efficiencySetting === 'Isentropic') {
                var comp = new Turbomachines_1.Compressor(efficiency, null, pressureRatio, 0);
                setOutputFlow(comp.compressFlow(flow));
            }
            else {
                var comp = new Turbomachines_1.Compressor(null, efficiency, pressureRatio, 0);
                setOutputFlow(comp.compressFlow(flow));
            }
        }
        else {
            if (efficiencySetting === 'Isentropic') {
                var turbine = new Turbomachines_1.Turbine(efficiency, null, 0, pressureRatio);
                setOutputFlow(turbine.expandFlow(flow));
            }
            else {
                var turbine = new Turbomachines_1.Turbine(null, efficiency, 0, pressureRatio);
                setOutputFlow(turbine.expandFlow(flow));
            }
        }
    }, [flow, turbomachine, efficiencySetting, efficiency, pressureRatio]);
    //Later Add Graphs of Isentropic Efficiency vs. Ideal Isentropic Efficiency
    return (react_1["default"].createElement("div", { className: "flex flex-wrap md:flex-row md:justify-between" },
        react_1["default"].createElement("div", { className: "w-full text-center p-10 text-3xl" }, "Turbomachine Analysis"),
        react_1["default"].createElement("div", { className: "w-full flex flex-wrap" },
            react_1["default"].createElement(Flow_Form_1["default"], { flow: flow, setFlow: setFlow, setTraits: function () { } })),
        react_1["default"].createElement("div", { className: "w-full text-center p-10 " },
            react_1["default"].createElement("form", { className: "flex flex-wrap justify-center" },
                react_1["default"].createElement("div", { className: "w-full md:w-1/2 flex flex-col items-center p-4" },
                    react_1["default"].createElement("label", null, "Turbomachine"),
                    react_1["default"].createElement("select", { className: "w-3/4", value: turbomachine, onChange: function (e) {
                            return setTurbomachine(e.target.value);
                        } },
                        react_1["default"].createElement("option", { value: "Compressor" }, "Compressor"),
                        react_1["default"].createElement("option", { value: "Turbine" }, "Turbine"))),
                react_1["default"].createElement("div", { className: "w-full md:w-1/2 flex flex-col items-center p-4" },
                    react_1["default"].createElement("label", null, "Efficiency Setting"),
                    react_1["default"].createElement("select", { className: "w-3/4", value: efficiencySetting, onChange: function (e) {
                            return setEfficiencySetting(e.target.value);
                        } },
                        react_1["default"].createElement("option", { value: "Isentropic" }, "Isentropic"),
                        react_1["default"].createElement("option", { value: "Polytropic" }, "Polytropic"))),
                react_1["default"].createElement("div", { className: "w-full md:w-1/2 flex flex-col items-center p-4" },
                    react_1["default"].createElement("label", null, "Efficiency"),
                    react_1["default"].createElement("input", { className: "w-3/4", type: "number", step: "0.01", value: efficiency, onChange: function (e) { return setEfficiency(Number(e.target.value)); } })),
                react_1["default"].createElement("div", { className: "w-full md:w-1/2 flex flex-col items-center p-4" },
                    react_1["default"].createElement("label", null, turbomachine === 'Compressor'
                        ? 'Pressure Ratio'
                        : 'Work (Joules)'),
                    react_1["default"].createElement("input", { className: "w-3/4", type: "number", value: pressureRatio, onChange: function (e) { return setPressureRatio(Number(e.target.value)); } }))),
            react_1["default"].createElement("div", { className: "w-full md:w-1/2 flex items-center" },
                "Work :",
                ' ',
                Math.abs(flow.Cp * (flow.TotalTemp - outputFlow.TotalTemp)).toPrecision(4)),
            react_1["default"].createElement("div", { className: "w-full md:w-1/2 flex items-center" })),
        react_1["default"].createElement("div", { className: "w-full md:w-1/2" },
            react_1["default"].createElement(FlowEnergyCharts_1["default"], { flow: flow, output_pressure: flow.Pressure })),
        react_1["default"].createElement("div", { className: "w-full md:w-1/2" },
            react_1["default"].createElement(FlowEnergyCharts_1["default"], { flow: outputFlow, output_pressure: flow.Pressure })),
        react_1["default"].createElement("div", { className: "w-full flex flex-wrap" },
            react_1["default"].createElement(FlowDisplay_1["default"], { flow: outputFlow, filter_traits: [] }))));
};
exports["default"] = Home;
