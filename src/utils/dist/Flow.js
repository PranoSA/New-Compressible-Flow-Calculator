"use strict";
exports.__esModule = true;
var Flow = /** @class */ (function () {
    //default : change
    function Flow(Mach, TotalTemp, TotalPressure, gamma, R) {
        var _this = this;
        // Maximum Output Work Done By Flow 
        this.expansionToPressurePE = function (Pressure) {
            //p​⋅T0,1​⋅(1−(P1​P2​​)γγ−1​)
            //Wmax​=Cp​⋅T0,1​⋅(1−(P1​P2​​)γγ−1​)
            //Essentailly -> 
            return _this.Cp * _this.TotalTemp * (1 - Math.pow(Pressure / _this.TotalPressure, (_this.gamma - 1) / _this.gamma));
        };
        this.expansionToDensityVolume = function (Volume) {
            // Density is inverse
            var density = 1 / Volume;
            // Expand to Density Ratio of density/Stagntation Density 
            var reference_density_flow = Flow.MachFromDR(_this, 0);
            // Density Ratio Would be d/d0 ??
            var density_ratio = density / reference_density_flow.Density;
            var density_flow = Flow.MachFromDR(_this, density_ratio);
            return _this.Cp * (_this.Temp - density_flow.Temp); //Isentropic
        };
        //
        this.expansionToKineticPE = function (OutputPressure) {
            //This Would Be THe Most Kinetic Energy You Can Get Out oF Expanding The Flow
            //const newFlow = Flow.TPFromPressure(this, OutputPressure);
            var newFlow = Flow.MachFromPR(_this, OutputPressure / _this.TotalPressure);
            var kineticEnergy = newFlow.Velocity * newFlow.Velocity / 2;
            return kineticEnergy;
        };
        this.Mach = Mach;
        this.TotalTemp = TotalTemp;
        this.TotalPressure = TotalPressure;
        this.gamma = gamma;
        this.R = R;
    }
    Object.defineProperty(Flow.prototype, "PressureCorrection", {
        //getter block
        //S=Cp​ln(T0​T​)−Rln(P0​P​)+S0​
        get: function () {
            // Actual Pressure
            var actual_pressure = this.Pressure;
            // Incompressed Pressure
            var incompressible_pressure = this.TotalPressure - this.Velocity * this.Velocity * this.Density / 2;
            return actual_pressure / incompressible_pressure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "PCorrectionFreeStream", {
        get: function () {
            // 
            var actual_stagnation_pressure = this.TotalPressure;
            //theoretical based on Bernoulli's
            var incompressible_pressure = this.TotalPressure - this.Velocity * this.Velocity * this.Density / 2;
            return actual_stagnation_pressure / incompressible_pressure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "KE", {
        get: function () { return this.Velocity * this.Velocity / 2; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "entropy", {
        get: function () { return this.Cp * Math.log(this.Temp) - this.R * Math.log(this.Pressure); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "expr", {
        get: function () { return (1 + Math.pow(this.Mach, 2) * (this.gamma - 1) / 2); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Flow.prototype, "Temp", {
        get: function () { return (this.TotalTemp / this.expr); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "SoundSpeed", {
        get: function () { return (Math.sqrt(this.gamma * this.R * this.Temp)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "Velocity", {
        get: function () { return (this.SoundSpeed * this.Mach); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "Pressure", {
        get: function () { return (this.TotalPressure * this.PressureRatio); },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Flow.prototype, "PressureRatio", {
        get: function () { return (Math.pow(this.expr, -this.gamma / (this.gamma - 1))); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "TemperatureRatio", {
        get: function () { return (Math.pow(this.expr, -1)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "DensityRatio", {
        get: function () { return (Math.pow(this.expr, -1 / (this.gamma - 1))); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "MachAngle", {
        get: function () { return Math.asin(1 / this.Mach) * 180 / Math.PI; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "Cp", {
        get: function () { return this.R * (this.gamma / (this.gamma - 1)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "Enthalpy", {
        //get AreaRatio() : number{return Math.pow((this.gamma+1)/2, -(this.gamma+1)/(2*(this.gamma-1)))*Math.pow((1+(this.gamma-1)/2*this.Mach*this.Mach), (this.gamma+1)/(2*(this.gamma-1))/this.Mach)};
        //get Enthalpy() : number{return Math.pow(this.Velocity,2)/2/1000+this.Pressure}
        get: function () { return 1 * this.TotalTemp * this.Cp; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Flow.prototype, "Density", {
        //get Density() : number{return this.Pressure/this.R/this.Temp}
        get: function () { return (this.Pressure / this.R / this.Temp); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "PrantlMeyer", {
        get: function () { return (Math.sqrt((this.gamma - 1) / (this.gamma + 1)) * Math.atan(Math.sqrt((this.gamma - 1) / (this.gamma + 1) * Math.pow(this.Mach, 2))) - Math.atan(Math.pow(this.Mach, 2) - 1)) * 180 / Math.PI; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "AreaRatio2", {
        get: function () {
            var A1 = (this.gamma + 1) / 2;
            var A2 = -(this.gamma + 1) / 2 / (this.gamma - 1);
            var A3 = Math.pow(A1, A2);
            var A4 = (1 + (this.gamma - 1) / 2 * Math.pow(this.Mach, 2));
            var A5 = (this.gamma + 1) / 2 / (this.gamma - 1);
            var A6 = Math.pow(A4, A5);
            return A6 * A3 / this.Mach;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Flow.prototype, "Cv", {
        get: function () { return this.R / (this.gamma - 1); },
        enumerable: false,
        configurable: true
    });
    Flow.EntropyDifference = function (flow1, flow2) {
        // The Entropy Difference between 1 and 2 [Going From State 2 to 1]
        // Negative if 1 has more entropy than 2
        return flow1.Cp * Math.log(flow1.Temp / flow2.Temp) - flow1.R * Math.log(flow1.Pressure / flow2.Pressure);
    };
    //default 
    Flow.NewFlow = function () { return new Flow(0, 0, 0, 1.4, 287); };
    Flow.CopyFlow = function (flow) { return new Flow(flow.Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R); };
    //Mach Changers
    //From Mach
    Flow.MachFromMach = function (flow, Mach) { return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R); };
    //From Pressure Ratio
    Flow.MachFromPR = function (flow, PR) {
        //console.log(Math.asin(1));
        var Mach1 = Math.pow(PR, -(flow.gamma - 1) / flow.gamma);
        var Mach2 = (Mach1 - 1) * 2 / (flow.gamma - 1);
        var Mach3 = Math.sqrt(Mach2);
        var Mach = Math.sqrt((Math.pow(PR, (-flow.gamma - 1) / flow.gamma) - 1) * (2 / (flow.gamma - 1)));
        return new Flow(Mach3, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    };
    //From Temperature Ratio
    Flow.MachFromTR = function (flow, TR) {
        var Mach = Math.sqrt((Math.pow(TR, -1) - 1) * (2 / (flow.gamma - 1)));
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    };
    //From Density Ratio 
    Flow.MachFromDR = function (flow, DR) {
        var Mach = Math.sqrt(Math.pow(DR, (-flow.gamma - 1) * flow.gamma) * (2 / (flow.gamma - 1)));
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    };
    //From Mach Angle 
    Flow.MachFromMA = function (flow, MA) {
        var Mach = Math.asin(MA * Math.PI / 180);
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    };
    //From Prandtl-Meyer Angle
    //From Area Ratio 
    Flow.MachToAR = function (Mach, gamma) {
        var A1 = (gamma + 1) / 2;
        var A2 = -(gamma + 1) / 2 / (gamma - 1);
        var A3 = Math.pow(A1, A2);
        var A4 = (1 + (gamma - 1) / 2 * Math.pow(Mach, 2));
        var A5 = (gamma + 1) / 2 / (gamma - 1);
        var A6 = Math.pow(A4, A5);
        return A6 * A3 / Mach;
    };
    Flow.MachFromARSubsonic = function (flow, AR, Mach) {
        if (Mach === void 0) { Mach = .5; }
        //var Mach = .5;
        while (Math.abs(AR - Flow.MachToAR(Mach, flow.gamma)) > .0000005) {
            Mach = Mach - .00001 * (AR - Flow.MachToAR(Mach, flow.gamma));
        }
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    };
    Flow.MachFromARSupersonic = function (flow, AR) {
        var Mach = 2;
        while (Math.abs(AR - Flow.MachToAR(Mach, flow.gamma)) > .00005) {
            Mach = Mach + .001 * (AR - Flow.MachToAR(Mach, flow.gamma));
        }
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    };
    //Set Total Pressure (From Density, etc...)
    Flow.TPFromTP = function (flow, TP) { return new Flow(flow.Mach, flow.TotalTemp, TP, flow.gamma, flow.R); };
    Flow.TPFromPressure = function (flow, Pressure) {
        //PP0​​=(1+2γ−1​M2)γ−1γ​
        var TP = Pressure * Math.pow(1 + (flow.gamma - 1) / 2 * Math.pow(flow.Mach, 2), (flow.gamma / (flow.gamma - 1)));
        //const TP = Pressure*Math.pow((1+(flow.gamma-1)/2*Math.pow(flow.Mach,2)),(flow.gamma/(flow.gamma-1)))
        return new Flow(flow.Mach, flow.TotalTemp, TP, flow.gamma, flow.R);
    };
    //Set Total Temperature Ratio
    Flow.TTFromTT = function (flow, TT) { return new Flow(flow.Mach, TT, flow.TotalPressure, flow.gamma, flow.R); };
    Flow.TTFromTemperature = function (flow, Temperature) {
        var TT = Temperature * flow.expr;
        return new Flow(flow.Mach, TT, flow.TotalPressure, flow.gamma, flow.R);
    };
    Flow.TTFromSoundSpeed = function (flow, SoundSpeed) {
        var StaticTemperature = Math.pow(SoundSpeed, 2) / (flow.R * flow.gamma);
        return Flow.TTFromTemperature(flow, StaticTemperature);
    };
    return Flow;
}());
exports["default"] = Flow;
