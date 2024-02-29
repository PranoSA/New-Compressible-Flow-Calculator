'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Flow_1 = require("@/utils/Flow");
function FlowForm(props) {
    var setFlow = props.setFlow, flow = props.flow, setTraits = props.setTraits;
    var _a = react_1.useState('Mach Number'), machOption = _a[0], setMachOption = _a[1];
    var _b = react_1.useState(0.8), machOptionValue = _b[0], setMachOptionValue = _b[1];
    var _c = react_1.useState(''), errorMessageMach = _c[0], setErrorMessageMach = _c[1];
    var _d = react_1.useState(''), errorMessageTemperature = _d[0], setErrorMessageTemperature = _d[1];
    var _e = react_1.useState(''), errorMessagePressure = _e[0], setErrorMessagePressure = _e[1];
    var _f = react_1.useState('Total Temperature'), temperatureOption = _f[0], setTemperatureOption = _f[1];
    var _g = react_1.useState(0), temperatureOptionValue = _g[0], setTemperatureOptionValue = _g[1];
    var _h = react_1.useState('Total Pressure'), pressureOption = _h[0], setPressureOption = _h[1];
    var _j = react_1.useState(0), pressureOptionValue = _j[0], setPressureOptionValue = _j[1];
    var flowKeys = ['Mach', 'TotalTemp', 'TotalPressure'];
    react_1.useEffect(function () {
        var new_flow = Flow_1["default"].CopyFlow(flow);
        setTraits([machOption, temperatureOption, pressureOption]);
        switch (machOption) {
            case 'Mach Number':
                //Make sure more than 0
                if (machOptionValue < 0) {
                    setErrorMessageMach('Mach Number must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].MachFromMach(new_flow, machOptionValue);
                break;
            case 'Temperature Ratio(t/to)':
                //Make sure more than 0 and less than 1
                if (machOptionValue < 0 || machOptionValue > 1) {
                    setErrorMessageMach('Temperature Ratio must be between 0 and 1');
                    return;
                }
                new_flow = Flow_1["default"].MachFromTR(new_flow, machOptionValue);
                break;
            case 'Pressure Ratio (p / po)':
                //Make sure more than 0 and less than 1
                if (machOptionValue < 0 || machOptionValue > 1) {
                    setErrorMessageMach('Pressure Ratio must be between 0 and 1');
                    return;
                }
                new_flow = Flow_1["default"].MachFromPR(new_flow, machOptionValue);
                break;
            case 'Density Ratio':
                //Make sure more than 0 and less than 1
                if (machOptionValue < 0 || machOptionValue > 1) {
                    setErrorMessageMach('Density Ratio must be between 0 and 1');
                    return;
                }
                new_flow = Flow_1["default"].MachFromDR(new_flow, machOptionValue);
                break;
            case 'Mach Angle':
                //Make sure more than 0 and less than 90
                if (machOptionValue < 0 || machOptionValue > 90) {
                    setErrorMessageMach('Mach Angle must be between 0 and 90');
                    return;
                }
                new_flow = Flow_1["default"].MachFromMA(new_flow, machOptionValue);
                break;
            case 'Area Ratio':
                //Make sure more than 0
                if (machOptionValue < 0) {
                    setErrorMessageMach('Area Ratio must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].MachFromARSubsonic(new_flow, machOptionValue);
                break;
            case 'Supersonic Area Ratio':
                //Make sure more than 0
                if (machOptionValue < 0) {
                    setErrorMessageMach('Supersonic Area Ratio must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].MachFromARSupersonic(new_flow, machOptionValue);
                break;
        }
        setErrorMessageMach('');
        switch (temperatureOption) {
            case 'Total Temperature':
                // Make sure more than 0
                if (temperatureOptionValue < 0) {
                    setErrorMessageTemperature('Total Temperature must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].TTFromTT(new_flow, temperatureOptionValue);
                break;
            case 'Static Temperature':
                // Make sure more than 0
                if (temperatureOptionValue < 0) {
                    setErrorMessageTemperature('Static Temperature must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].TTFromTemperature(new_flow, temperatureOptionValue);
                break;
            case 'Sound Speed':
                // make sure more than 0
                if (temperatureOptionValue < 0) {
                    setErrorMessageTemperature('Sound Speed must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].TTFromSoundSpeed(new_flow, temperatureOptionValue);
                break;
        }
        setErrorMessageTemperature('');
        switch (pressureOption) {
            case 'Static Pressure':
                // Make sure more than 0
                if (pressureOptionValue < 0) {
                    setErrorMessagePressure('Static Pressure must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].TPFromPressure(new_flow, pressureOptionValue);
                break;
            case 'Total Pressure':
                //Make sure more than 0
                if (pressureOptionValue < 0) {
                    setErrorMessagePressure('Total Pressure must be greater than 0');
                    return;
                }
                new_flow = Flow_1["default"].TPFromTP(new_flow, pressureOptionValue);
                break;
        }
        setErrorMessagePressure('');
        setFlow(new_flow);
    }, [
        machOption,
        machOptionValue,
        temperatureOption,
        temperatureOptionValue,
        pressureOption,
        pressureOptionValue,
    ]);
    return (React.createElement("div", { className: "w-full flex flex-wrap" },
        React.createElement("div", { className: "md:w-1/3 p-2" },
            React.createElement("label", { className: "block" }, "Mach Constraint"),
            React.createElement("input", { type: "number", className: "w-full p-2 border rounded mt-1", value: machOptionValue, onChange: function (e) {
                    setMachOptionValue(parseFloat(e.target.value));
                } }),
            React.createElement("select", { className: "w-full p-2 border rounded mt-1", onChange: function (e) {
                    setMachOption(e.target.value);
                }, value: machOption },
                React.createElement("option", null, "Mach Number "),
                React.createElement("option", null, "Temperature Ratio(t/to)"),
                React.createElement("option", null, "Pressure Ratio (p / po)"),
                React.createElement("option", null, "Density Ratio"),
                React.createElement("option", null, "Mach Angle"),
                React.createElement("option", null, "Area Ratio"),
                React.createElement("option", null, "Supersonic Area Ratio")),
            errorMessageMach != '' && (React.createElement("div", { className: "text-red-500" }, errorMessageMach))),
        React.createElement("div", { className: "md:w-1/3 p-2" },
            React.createElement("label", { className: "block" }, "Temperature Constraint"),
            React.createElement("input", { type: "number", className: "w-full p-2 border rounded mt-1", value: temperatureOptionValue, onChange: function (e) {
                    setTemperatureOptionValue(parseFloat(e.target.value));
                } }),
            React.createElement("select", { className: "w-full p-2 border rounded mt-1", onChange: function (e) {
                    setTemperatureOption(e.target.value);
                }, value: temperatureOption },
                React.createElement("option", null, "Total Temperature"),
                React.createElement("option", null, "Static Temperature"),
                React.createElement("option", null, "Sound Speed"))),
        React.createElement("div", { className: "md:w-1/3 p-2" },
            React.createElement("label", { className: "block" }, "Pressure Constraint "),
            React.createElement("input", { type: "number", className: "w-full p-2 border rounded mt-1", value: pressureOptionValue, onChange: function (e) {
                    setPressureOptionValue(parseFloat(e.target.value));
                } }),
            React.createElement("select", { className: "w-full p-2 border rounded mt-1", onChange: function (e) {
                    console.log(e.target.value);
                    setPressureOption(e.target.value);
                }, value: pressureOption },
                React.createElement("option", null, "Static Pressure"),
                React.createElement("option", null, "Total Pressure")))));
}
exports["default"] = FlowForm;
