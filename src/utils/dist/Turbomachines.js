"use strict";
exports.__esModule = true;
exports.Turbine = exports.Compressor = void 0;
var Flow_1 = require("./Flow");
var Compressor = /** @class */ (function () {
    function Compressor(iseneff, polyeff, pressure_ratio, work) {
        var _this = this;
        this.convertPolyEffToIsenEff = function (polyeff, pr, gamma) {
            return (polyeff * (Math.pow(pr, (gamma - 1) / gamma)) - 1);
        };
        this.compressFlow = function (flow) {
            var new_flow = Flow_1["default"].CopyFlow(flow);
            if (_this.polyeff && _this.pressure_ratio) {
                /*let current_pressure_ratio = 1;
                while(current_pressure_ratio < this.pressure_ratio){
                    //Change Flow Properties at Each Stage with Isentrpoic Efficiency = PolyEfficiency
                    //For that particular stage
                    let stage_pressure_ratio = (current_pressure_ratio+.001)/current_pressure_ratio;
    
                    const TFactor = (Math.pow(stage_pressure_ratio, (flow.gamma-1)/flow.gamma));
    
                    // New Total Temperature
                    let ideal_isen_heat_change = flow.TotalTemp*(TFactor-1)
                    let actual_isen_heat_change = ideal_isen_heat_change/this.polyeff;
    
                    new_flow.TotalTemp = new_flow.TotalTemp+actual_isen_heat_change;
    
                    current_pressure_ratio = current_pressure_ratio+.001;
                }*/
                //
                new_flow.TotalTemp = Math.pow(_this.pressure_ratio, (flow.gamma - 1) / (flow.gamma * _this.polyeff)) * flow.TotalTemp;
                //new_flow.TotalTemp = this.pressure_ratio*(Math.pow(flow.TotalTemp, (flow.gamma-1)/flow.gamma));
                return new_flow;
            }
            if (_this.iseneff !== null && _this.pressure_ratio !== null) {
                var TFactor = ((Math.pow(_this.pressure_ratio, (flow.gamma - 1) / flow.gamma)));
                // Isentropic Output Total Temperature
                // Pressure Ratio ^((gamma-1)/ gamma)
                //P2/P1 *TFactor= T2/T1
                var ideal_isen_heat_change = flow.TotalTemp * (TFactor - 1);
                // Actual Change in Total Temperature
                var actual_isen_heat_change = ideal_isen_heat_change / _this.iseneff;
                new_flow.TotalTemp = flow.TotalTemp + actual_isen_heat_change;
                new_flow.TotalPressure = flow.TotalPressure * _this.pressure_ratio;
                //Flow.MachFromVelocity
            }
            //ηi​sentropic=(n1​)×[(P1P2​)nn−1​−1]
            if (_this.polyeff && _this.work) {
                // Find Pressure Ratio From Work and Polytropic Efficiency????
                //  const nisentropic = this.convertPolyEffToIsenEff(this.polyeff, this.pressure_ratio, flow.gamma);
                // How to go from work to pressure ratio? Using Polytropic Efficiency
                //const TFactor = (Math.pow(this.pressure_ratio, (flow.gamma-1)/flow.gamma)-1)/nisentropic;
                //new_flow.TotalPressure = flow.TotalPressure*this.pressure_ratio;
                //new_flow.TotalTemp = flow.TotalTemp*TFactor;
                // Find Isentropic Work
                //The Isentropic Work would ressemble the output pressure ratio
                // if perfectly isentropic process ?????
                // Essentially, ideal isentropic work is the work done by the compressor
                // Find isentropic work
                //This is incorrect btw
                var isen_work = _this.work / _this.polyeff;
                //THis makes no sense -> First find perfectly isentropic work 
                // Perfect isentropic work
                //wisentropic​=cp​⋅(T2​−T1​)
                var output_total_temp = flow.TotalTemp + isen_work / flow.Cp;
                //solve for P2/P1 using 
                //T1​T2​​=(P1​P2​​)nn−1​
                var output_total_pressure = flow.TotalPressure * Math.pow(output_total_temp / flow.TotalTemp, flow.gamma / (flow.gamma - 1));
                // Create new flow
                new_flow.TotalPressure = output_total_pressure;
                new_flow.TotalTemp = output_total_temp;
                return new_flow;
            }
            if (_this.iseneff && _this.work) {
                // Find isentropic work
                var isen_work = _this.work / _this.iseneff;
                //wisentropic​=cp​⋅(T2​−T1​)
                var output_total_temp_isen = flow.TotalTemp + isen_work / flow.Cp;
                //solve for P2/P1 using 
                //T1​T2​​=(P1​P2​​)nn−1​
                var output_total_pressure = flow.TotalPressure * Math.pow(output_total_temp_isen / flow.TotalTemp, flow.gamma / (flow.gamma - 1));
                // Create new flow
                new_flow.TotalPressure = output_total_pressure;
                new_flow.TotalTemp = output_total_temp_isen;
                return new_flow;
            }
            flow.Mach = 1;
            return new_flow;
        };
        this.polyeff = polyeff;
        this.iseneff = iseneff;
        this.pressure_ratio = pressure_ratio;
        this.work = work; //This is the work done by the compressor per unit mass flow
    }
    // Add Getters for 
    // Isentropic Efficiency
    // Polytropic Efficiency
    // Ideal Isentropic Efficiency
    // Ideal Polytropic Efficiency = 1
    // Polytropic Efficiency = Actual Efficiency / Ideal Isentropic Efficiency
    Compressor.prototype.IdealIsenEff = function (Flow) {
        if (!this.pressure_ratio) {
            return 0;
        }
        return (Math.pow(this.pressure_ratio, (Flow.gamma - 1) / Flow.gamma) - 1);
    };
    return Compressor;
}());
exports.Compressor = Compressor;
var Turbine = /** @class */ (function () {
    function Turbine(iseneff, polyeff, pressure_ratio, work) {
        var _this = this;
        this.polyeff = null;
        this.iseneff = null;
        this.pressure_ratio = null;
        this.work = null;
        this.expandFlow = function (flow) {
            var new_flow = Flow_1["default"].CopyFlow(flow);
            if (_this.polyeff && _this.pressure_ratio) {
            }
            if (_this.iseneff && _this.pressure_ratio) {
            }
            if (_this.polyeff && _this.work) {
                // The Turbine Will Drive the Compressor So Usually Work Will Be Used 
                //ηt = (1- (𝑟𝑝𝑡 )(𝛾−1)/𝛾* ηtp)/ (1- 1 / (𝑟𝑝𝑡 )(𝛾−1)/𝛾).
                //new_flow.TotalTemp = Math.pow(this.pressure_ratio, (flow.gamma-1)/(flow.gamma*this.polyeff))*flow.TotalTemp;
                // We Want Output Static Presssure difference todrive the compressor,right?
                //or -> isentropic total temperature difference drives the compressor
                var idea_output_total_temp = flow.TotalTemp - (_this.work / flow.Cp);
                //new_flow.TotalTemp = Math.pow(this.pressure_ratio, (flow.gamma-1)/(flow.gamma*this.polyeff))*flow.TotalTemp;
                //Preliminary Attempt
                //Now Ideal Pressure Ratio
            }
            if (_this.iseneff && _this.work) {
                // The Isentropic Efficiency of a Turbine Describes The Change in Energy of a flow 
                // Versus the amount of energy needed to drive the turbine (Driven By Pressure Differences)
                // Would We Include Total Pressure in the equation ???
                // Or Just Static Pressure - Lets Assume the Mach is Constant ??
                // For Now Ignore The Effects of Mach Number
                var ideal_isen_temp_change = _this.work / flow.Cp;
                var actual_isen_temp_change = ideal_isen_temp_change / _this.iseneff;
                var t_output_total_temp = flow.TotalTemp - actual_isen_temp_change;
                //  Or assume the density is constant?
                // The Work Done Per Unit Mass is the difference in pressure 
                //Find P2/P1 based on (ideal_isen_temp_change+T1)/(T1)
                var pressure_change_ratio = Math.pow((ideal_isen_temp_change + flow.TotalTemp) / (flow.TotalTemp), flow.gamma / (flow.gamma - 1));
                var output_total_pressure = Flow_1["default"].TPFromTP(flow, pressure_change_ratio);
                var output_total_temp = Flow_1["default"].TTFromTT(output_total_pressure, t_output_total_temp);
                return output_total_temp;
            }
            return Flow_1["default"].NewFlow();
        };
        this.polyeff = polyeff;
        this.iseneff = iseneff;
        this.pressure_ratio = pressure_ratio;
        this.work = work;
    }
    return Turbine;
}());
exports.Turbine = Turbine;
