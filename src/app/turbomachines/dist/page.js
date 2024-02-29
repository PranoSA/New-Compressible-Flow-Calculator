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
var Turbomachines_1 = require("@/utils/Turbomachines");
var d3 = require("d3");
var Home = function () {
    //flow = inputFlow
    var _a = react_1.useState(new Flow_1["default"](0, 0, 0, 1.4, 287)), flow = _a[0], setFlow = _a[1];
    var _b = react_1.useState('Mach Number'), machOption = _b[0], setMachOption = _b[1];
    var _c = react_1.useState(0), machOptionValue = _c[0], setMachOptionValue = _c[1];
    var _d = react_1.useState(''), errorMessageMach = _d[0], setErrorMessageMach = _d[1];
    var _e = react_1.useState(''), errorMessageTemperature = _e[0], setErrorMessageTemperature = _e[1];
    var _f = react_1.useState(''), errorMessagePressure = _f[0], setErrorMessagePressure = _f[1];
    var _g = react_1.useState('Total Temperature'), temperatureOption = _g[0], setTemperatureOption = _g[1];
    var _h = react_1.useState(0), temperatureOptionValue = _h[0], setTemperatureOptionValue = _h[1];
    var _j = react_1.useState('Static Pressure'), pressureOption = _j[0], setPressureOption = _j[1];
    var _k = react_1.useState(0), pressureOptionValue = _k[0], setPressureOptionValue = _k[1];
    var _l = react_1.useState('Compressor'), turbomachine = _l[0], setTurbomachine = _l[1];
    var _m = react_1.useState('Polytropic'), efficiencySetting = _m[0], setEfficiencySetting = _m[1];
    var _o = react_1.useState(1.0), efficiency = _o[0], setEfficiency = _o[1];
    var _p = react_1.useState(1.0), pressureRatio = _p[0], setPressureRatio = _p[1];
    var _q = react_1.useState(new Flow_1["default"](0, 0, 0, 1.4, 287)), outputFlow = _q[0], setOutputFlow = _q[1];
    var chartInput = react_1.useRef(null);
    var chartOutput = react_1.useRef(null);
    react_1.useEffect(function () {
        var margin = { top: 30, right: 30, bottom: 70, left: 60 };
        if (chartInput.current) {
            d3.select(chartInput.current).selectAll('*').remove();
            var inputEnergy_1 = [
                flow.TotalTemp * flow.Cv,
                (flow.TotalPressure / flow.Density) * flow.DensityRatio,
                flow.Enthalpy,
                0.5 * Math.pow(flow.Velocity, 2),
                flow.Pressure / flow.Density,
                flow.Temp * flow.Cv,
                0.5 * Math.pow(flow.Velocity, 2) +
                    flow.Pressure / flow.Density +
                    flow.Temp * flow.Cv,
            ];
            console.log(flow);
            var inputLabels = ['TT', 'TP', 'Energy', 'KE', 'SP', 'ST', 'TE'];
            var inputColor_1 = d3.scaleOrdinal(d3.schemeCategory10);
            var inputSvg = d3
                .select(chartInput.current)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', '0 0 400 180');
            console.log(inputEnergy_1);
            var inputG = inputSvg.append('g').attr('transform', 'translate(50,0)'); // Adjust the translate values here
            var y = d3.scaleLinear().domain([0, inputEnergy_1[2]]).range([100, 0]);
            var bars = inputG
                .selectAll('rect')
                .data(inputEnergy_1)
                .enter()
                .append('rect')
                .attr('x', function (d, i) { return i * 50; })
                .attr('y', function (d) { return y(d); }) // Use 500 - d to draw bars upwards
                .attr('width', 20)
                .attr('height', function (d) { return 100 - y(d); }
            //(d) => (d * 500) / 1.1 / (flow.TotalTemp + flow.TotalPressure)
            )
                //@ts-ignore
                .attr('fill', function (d, i) { return inputColor_1(i); });
            /*const labels = inputG
              .selectAll('text')
              .data(inputLabels)
              .enter()
              .append('text')
              .attr('x', (d, i) => i * 50 + 10) // Center the labels under the bars
              //.attr('y', (d, i) => -inputEnergy[i] + 30) // Position the labels just below the bars
              .attr('y', (d, i) => 120)
              .text((d) => d)
              .attr('font-size', '5px')
              .attr('text-anchor', 'middle');*/
            inputG
                .append('g')
                .call(d3.axisLeft(y).tickFormat(function (d) { return d.valueOf().toPrecision(2); }))
                .attr('transform', 'translate(-10,0)')
                .attr('font-size', '10px');
            var x = d3
                .scaleBand()
                .range([35, 385])
                .domain(inputLabels.map(function (d, i) {
                return d + "   :  " + (inputEnergy_1[i] > 100 ? inputEnergy_1[i].toPrecision(4) : inputEnergy_1[i].toFixed(3));
            }))
                .padding(0.2);
            inputSvg
                .append('g')
                .attr('transform', 'translate(0,' + 100 + ')')
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'translate(-10,0)rotate(-45)')
                .style('text-anchor', 'end')
                .attr('font-size', '10px');
        }
    }, [flow]);
    react_1.useEffect(function () {
        var margin = { top: 30, right: 30, bottom: 70, left: 60 };
        if (chartOutput.current) {
            d3.select(chartOutput.current).selectAll('*').remove();
            //Create a Bar Graph With FOllow Labels
            // Total Temperature Energy -> flow.total_temperature
            // Total Pressure Energy -> flow.total_pressure
            // Total Energy -> flow.total_pressure + flow.total_temperature
            // Kinetic Energy -> 1/2*(flow.Mach * flow.sound_speed)^2
            // Static Pressure Energy -> flow.static_pressure
            // Static Temperature Energy -> flow.static_temperature
            var inputEnergy_2 = [
                outputFlow.TotalTemp * outputFlow.Cv,
                (outputFlow.TotalPressure / outputFlow.Density) *
                    outputFlow.DensityRatio,
                outputFlow.Enthalpy * 1000,
                0.5 * Math.pow(outputFlow.Velocity, 2),
                outputFlow.Pressure / outputFlow.Density,
                outputFlow.Temp * outputFlow.Cv,
                0.5 * Math.pow(outputFlow.Velocity, 2) +
                    outputFlow.Pressure / outputFlow.Density +
                    outputFlow.Temp * outputFlow.Cv,
            ];
            var inputLabels = ['TT', 'TP', 'Energy', 'KE', 'SP', 'ST', 'TE'];
            var inputColor_2 = d3.scaleOrdinal(d3.schemeCategory10);
            var inputSvg = d3
                .select(chartOutput.current)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', '0 0 400 180');
            console.log(inputEnergy_2);
            var inputG = inputSvg.append('g').attr('transform', 'translate(50,0)'); // Adjust the translate values here
            var y = d3.scaleLinear().domain([0, inputEnergy_2[2]]).range([100, 0]);
            var bars = inputG
                .selectAll('rect')
                .data(inputEnergy_2)
                .enter()
                .append('rect')
                .attr('x', function (d, i) { return i * 50; })
                .attr('y', function (d) { return y(d); }) // Use 500 - d to draw bars upwards
                .attr('width', 20)
                .attr('height', function (d) { return 100 - y(d); }
            //(d) => (d * 500) / 1.1 / (flow.TotalTemp + flow.TotalPressure)
            )
                //@ts-ignore
                .attr('fill', function (d, i) { return inputColor_2(i); });
            /*const labels = inputG
              .selectAll('text')
              .data(inputLabels)
              .enter()
              .append('text')
              .attr('x', (d, i) => i * 50 + 10) // Center the labels under the bars
              //.attr('y', (d, i) => -inputEnergy[i] + 30) // Position the labels just below the bars
              .attr('y', (d, i) => 120)
              .text((d) => d)
              .attr('font-size', '5px')
              .attr('text-anchor', 'middle');*/
            inputG
                .append('g')
                .call(d3.axisLeft(y).tickFormat(function (d) { return d.valueOf().toPrecision(2); }))
                .attr('transform', 'translate(-10,0)')
                .attr('font-size', '10px');
            var x = d3
                .scaleBand()
                .range([35, 385])
                .domain(inputLabels.map(function (d, i) {
                return d + "   :  " + (inputEnergy_2[i] > 100 ? inputEnergy_2[i].toPrecision(4) : inputEnergy_2[i].toFixed(3));
            }))
                .padding(0.2);
            inputSvg
                .append('g')
                .attr('transform', 'translate(0,' + 100 + ')')
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'translate(-10,0)rotate(-45)')
                .style('text-anchor', 'end')
                .attr('font-size', '10px');
        }
    }, [outputFlow]);
    var transformSameValue = function (value) {
        //Limit to 3 decimals or NaN
        return isNaN(value) ? 'NaN' : value.toFixed(3);
    };
    // Any Changes in the input flow, turbomachine, efficiency setting, efficiency, or pressure ratio will trigger changes in output flow
    react_1.useEffect(function () {
        var new_flow = Flow_1["default"].CopyFlow(flow);
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
                var turbine = new Turbomachines_1.Turbine(efficiency, null, pressureRatio, 0);
                setOutputFlow(turbine.expandFlow(flow));
            }
            else {
                var turbine = new Turbomachines_1.Turbine(null, efficiency, pressureRatio, 0);
                setOutputFlow(turbine.expandFlow(flow));
            }
        }
    }, [flow, turbomachine, efficiencySetting, efficiency, pressureRatio]);
    //Later Add Graphs of Isentropic Efficiency vs. Ideal Isentropic Efficiency
    return (react_1["default"].createElement("div", { className: "flex flex-col flex-wrap md:flex-row md:justify-between" },
        react_1["default"].createElement("div", { className: "w-full text-center p-10 text-3xl" }, "Turbomachine Analysis"),
        react_1["default"].createElement("div", { className: "md:w-1/3 p-2" },
            react_1["default"].createElement("label", { className: "block" }, "Mach Constraint"),
            react_1["default"].createElement("input", { type: "number", className: "w-full p-2 border rounded mt-1", step: "0.01", value: machOptionValue, onChange: function (e) {
                    setMachOptionValue(parseFloat(e.target.value));
                } }),
            react_1["default"].createElement("select", { className: "w-full p-2 border rounded mt-1", onChange: function (e) {
                    setMachOption(e.target.value);
                }, value: machOption },
                react_1["default"].createElement("option", null, "Mach Number "),
                react_1["default"].createElement("option", null, "Temperature Ratio(t/to)"),
                react_1["default"].createElement("option", null, "Pressure Ratio (p / po)"),
                react_1["default"].createElement("option", null, "Density Ratio"),
                react_1["default"].createElement("option", null, "Mach Angle"),
                react_1["default"].createElement("option", null, "Area Ratio"),
                react_1["default"].createElement("option", null, "Supersonic Area Ratio")),
            errorMessageMach != '' && (react_1["default"].createElement("div", { className: "text-red-500" }, errorMessageMach))),
        react_1["default"].createElement("div", { className: "md:w-1/3 p-2" },
            react_1["default"].createElement("label", { className: "block" }, "Temperature Constraint"),
            react_1["default"].createElement("input", { type: "number", className: "w-full p-2 border rounded mt-1", value: temperatureOptionValue, onChange: function (e) {
                    setTemperatureOptionValue(parseFloat(e.target.value));
                } }),
            react_1["default"].createElement("select", { className: "w-full p-2 border rounded mt-1", onChange: function (e) {
                    setTemperatureOption(e.target.value);
                }, value: temperatureOption },
                react_1["default"].createElement("option", null, "Total Temperature"),
                react_1["default"].createElement("option", null, "Static Temperature"),
                react_1["default"].createElement("option", null, "Sound Speed"))),
        react_1["default"].createElement("div", { className: "md:w-1/3 p-2" },
            react_1["default"].createElement("label", { className: "block" }, "Pressure Constraint "),
            react_1["default"].createElement("input", { type: "number", className: "w-full p-2 border rounded mt-1", value: pressureOptionValue, onChange: function (e) {
                    setPressureOptionValue(parseFloat(e.target.value));
                } }),
            react_1["default"].createElement("select", { className: "w-full p-2 border rounded mt-1", onChange: function (e) {
                    setPressureOption(e.target.value);
                }, value: pressureOption },
                react_1["default"].createElement("option", null, "Static Pressure"),
                react_1["default"].createElement("option", null, "Total Pressure"))),
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
                    react_1["default"].createElement("label", null, "Pressure Ratio"),
                    react_1["default"].createElement("input", { className: "w-3/4", type: "number", value: pressureRatio, onChange: function (e) { return setPressureRatio(Number(e.target.value)); } })))),
        react_1["default"].createElement("div", { className: "w-full flex" },
            react_1["default"].createElement("div", { ref: chartInput, className: "w-full" }),
            react_1["default"].createElement("div", { ref: chartOutput, className: "w-full" })),
        react_1["default"].createElement("div", { className: "w-full flex flex-wrap" },
            react_1["default"].createElement("div", { className: "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, __spreadArrays(Object.getOwnPropertyNames(outputFlow), Object.getOwnPropertyNames(Object.getPrototypeOf(outputFlow))).map(function (key) { return (react_1["default"].createElement("div", { key: key, className: "border p-4 flex flex-col items-center justify-center" },
                react_1["default"].createElement("label", { className: "font-bold" }, key),
                react_1["default"].createElement("div", null, 
                //@ts-ignore
                transformSameValue(outputFlow[key])))); })))));
};
exports["default"] = Home;
