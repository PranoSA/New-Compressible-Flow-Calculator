"use strict";
exports.__esModule = true;
exports.DiffuserNozzle = exports.Nozzle = exports.Diffuser = void 0;
var Flow_1 = require("./Flow");
//Think Of the Cases
//Define Outlet Pressure + Inlet Pressure + Exit Area/Entrance Area
//Can There be a shock in just a Diffuser??? Supersonic Entrance -> Too High Pressure ...
//If Subsonic in Entrance -> Just Going To Slow Down To The End 
//Very Supersonic -> Normal Shock at Entrance?? 
//No Shock Solution 
var Diffuser = /** @class */ (function () {
    function Diffuser(area_ratio, adiabatic_effeciency, outlet_mach) {
        var _this = this;
        this.area_ratio = null; //Outlet vs Inlet
        this.adiabatic_effeciency = null;
        this.outlet_mach = null;
        //pressure drive will determine the velocity??
        // Input Mach Will Be Subject to Change Based on the BackPressure
        this.expandToPressure = function () {
            var normalEntranceMach = 0;
            // What does this do exactly -> 
            //Find 
        };
        // Area expansion / decreasion will determine the out Mach and Static properties
        // Should We Assume lossless expansion? 
        // How would we account for isentropic efficiency?
        this.expandToArea = function (flow) {
            // also - how do we account for shock waves if input flow is supersonic -> Ignore this for now 
            if (_this.area_ratio === null || _this.adiabatic_effeciency === null) {
                throw new Error('No Area Ratio Specified');
            }
            // Starting Guess
            var area_ratio = _this.area_ratio;
            var actual_area_ratio = area_ratio;
            //What We Return
            var actual_pressure_flow = flow;
            do {
                var ideal_flow = Flow_1["default"].MachFromARSubsonic(flow, flow.AreaRatio2 * area_ratio);
                console.log("ideal Mach", ideal_flow);
                var ideal_temperature = ideal_flow.Temp;
                var actual_temperature = flow.Temp + (ideal_temperature - flow.Temp) / _this.adiabatic_effeciency;
                if (actual_temperature > flow.TotalTemp) {
                    throw new Error('Diffuser Not Possible, Out of Kinetic Energy ');
                }
                // const actual_pressure = ideal_flow.Pressure // We Are assuming that there is a constant target pressure
                //This is an il-advised assumption
                var ideal_pressure = ideal_flow.Pressure;
                var actual_mach_flow = Flow_1["default"].MachFromTR(ideal_flow, actual_temperature / flow.TotalTemp);
                //What if we used the actual mach number to find the actual pressure?
                //const actual_pressure = actual_mach_flow.Pressure
                var actual_pressure = ideal_pressure;
                // The Mach Should Be lower, right??
                actual_pressure_flow = Flow_1["default"].TPFromPressure(actual_mach_flow, actual_pressure);
                // What We Actually Discovered -> We Want this to Converge onto this.area_ratio
                actual_area_ratio = flow.Density / actual_pressure_flow.Density * flow.Velocity / actual_pressure_flow.Velocity;
                // Now -> guess the next area ratio
                console.log("Actual Area Ratio", actual_area_ratio);
                // Next Guess on Fake Area Ratio
                // It Should Get Bigger -> The Output Mach Should Get Smaller
                area_ratio = area_ratio + (_this.area_ratio - actual_area_ratio) / 50;
                // If actual_area_ratio is too high, we need to decrease the fake area ratio
            } while (Math.abs(actual_area_ratio - _this.area_ratio) > 0.001);
            console.log("Affective Area Ratio", area_ratio);
            return actual_pressure_flow;
        };
        this.area_ratio = area_ratio;
        this.adiabatic_effeciency = adiabatic_effeciency;
        this.outlet_mach = outlet_mach;
    }
    return Diffuser;
}());
exports.Diffuser = Diffuser;
var Nozzle = /** @class */ (function () {
    function Nozzle() {
    }
    return Nozzle;
}());
exports.Nozzle = Nozzle;
var DiffuserNozzle = /** @class */ (function () {
    function DiffuserNozzle(outlet_pressure) {
        this.outlet_pressure = outlet_pressure;
    }
    return DiffuserNozzle;
}());
exports.DiffuserNozzle = DiffuserNozzle;
