class Flow {
    Mach : number;
    TotalTemp : number;
    TotalPressure : number;
    gamma :number; 
    R : number;

    static EntropyDifference = (flow1:Flow, flow2:Flow) => {
        // The Entropy Difference between 1 and 2 [Going From State 2 to 1]

        // Negative if 1 has more entropy than 2
        return flow1.Cp*Math.log(flow1.Temp/flow2.Temp)-flow1.R*Math.log(flow1.Pressure/flow2.Pressure);
    }

    //getter block
    //S=Cp​ln(T0​T​)−Rln(P0​P​)+S0​
    
    get PressureCorrection() : number {
        // Actual Pressure
        const actual_pressure = this.Pressure;

        // Incompressed Pressure
        const incompressible_pressure = this.TotalPressure - this.Velocity * this.Velocity * this.Density / 2;

        return actual_pressure/incompressible_pressure;
    }

    get PCorrectionFreeStream() : number {
        // 
        const actual_stagnation_pressure = this.TotalPressure;

        //theoretical based on Bernoulli's
        const incompressible_pressure = this.TotalPressure - this.Velocity * this.Velocity * this.Density / 2;

        return actual_stagnation_pressure/incompressible_pressure;
    }
    get KE () : number {return this.Velocity*this.Velocity/2}
    get entropy() : number {return this.Cp*Math.log(this.Temp)-this.R*Math.log(this.Pressure)}
    get expr() : number {return (1+Math.pow(this.Mach,2)*(this.gamma-1)/2)};
    get Temp() : number {return (this.TotalTemp/this.expr)}
    get SoundSpeed() : number{return (Math.sqrt(this.gamma*this.R*this.Temp))}
    get Velocity() : number{return (this.SoundSpeed*this.Mach)}
    get Pressure() : number{return (this.TotalPressure*this.PressureRatio)};
    get PressureRatio() : number{return (Math.pow(this.expr, -this.gamma/(this.gamma-1)))}
    get TemperatureRatio() : number{return (Math.pow(this.expr, -1))}
    get DensityRatio() : number{return (Math.pow(this.expr, -1/(this.gamma-1)))}
    get MachAngle() : number{return Math.asin(1/this.Mach)*180/Math.PI}
    get Cp() : number {return this.R*(this.gamma/(this.gamma-1))}
    //get AreaRatio() : number{return Math.pow((this.gamma+1)/2, -(this.gamma+1)/(2*(this.gamma-1)))*Math.pow((1+(this.gamma-1)/2*this.Mach*this.Mach), (this.gamma+1)/(2*(this.gamma-1))/this.Mach)};
    //get Enthalpy() : number{return Math.pow(this.Velocity,2)/2/1000+this.Pressure}
    get Enthalpy() : number{return 1*this.TotalTemp*this.Cp};
    //get Density() : number{return this.Pressure/this.R/this.Temp}
    get Density() : number {return (this.Pressure/this.R/this.Temp)}
    get PrantlMeyer() : number{return (Math.sqrt((this.gamma-1)/(this.gamma+1))*Math.atan(Math.sqrt((this.gamma-1)/(this.gamma+1)*Math.pow(this.Mach,2)))-Math.atan(Math.pow(this.Mach,2)-1))*180/Math.PI}
    get AreaRatio2() : number{
        const A1 = (this.gamma+1)/2;
        const A2 = -(this.gamma+1)/2/(this.gamma-1);
        const A3 = Math.pow(A1,A2);
        const A4= (1+(this.gamma-1)/2*Math.pow(this.Mach,2));
        const A5 = (this.gamma+1)/2/(this.gamma-1);
        const A6 = Math.pow(A4,A5);
        return A6*A3/this.Mach;
    }
    get Cv () : number {return this.R/(this.gamma-1)}

    //default 
    static NewFlow = () => new Flow(0,0,0,1.4,287);
    static CopyFlow = (flow:Flow) => new Flow(flow.Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R)
    //default : change
    constructor(Mach:number, TotalTemp:number, TotalPressure:number, gamma:number, R : number){      
        this.Mach = Mach;
        this.TotalTemp = TotalTemp;
        this.TotalPressure = TotalPressure;
        this.gamma = gamma;
        this.R = R;
    }
    //Mach Changers
    //From Mach
    static MachFromMach = (flow : Flow, Mach : number) => new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);

    // Maximum Output Work Done By Flow 
    expansionToPressurePE = (Pressure:number):number => {

        //p​⋅T0,1​⋅(1−(P1​P2​​)γγ−1​)
        //Wmax​=Cp​⋅T0,1​⋅(1−(P1​P2​​)γγ−1​)
        //Essentailly -> 
        return this.Cp*this.TotalTemp*(1-Math.pow(Pressure/this.TotalPressure,(this.gamma-1)/ this.gamma));
    }

    expansionToDensityVolume = (Volume:number):number => {

        // Density is inverse
        const density= 1/Volume;

        // Expand to Density Ratio of density/Stagntation Density 
        const reference_density_flow = Flow.MachFromDR(this, 0);

        // Density Ratio Would be d/d0 ??
        const density_ratio = density/reference_density_flow.Density;

        const density_flow = Flow.MachFromDR(this, density_ratio);

        return this.Cp*(this.Temp - density_flow.Temp) //Isentropic

    }

    //
    expansionToKineticPE = (OutputPressure:number):number => {

        //This Would Be THe Most Kinetic Energy You Can Get Out oF Expanding The Flow
        //const newFlow = Flow.TPFromPressure(this, OutputPressure);
        const newFlow = Flow.MachFromPR(this, OutputPressure/this.TotalPressure);

        const kineticEnergy = newFlow.Velocity*newFlow.Velocity/2;

        return kineticEnergy;
    }

    //From Pressure Ratio
    static MachFromPR = (flow : Flow, PR:number) => {
        //console.log(Math.asin(1));
        const Mach1 = Math.pow(PR, -(flow.gamma-1)/flow.gamma);
        const Mach2 = (Mach1 - 1)*2/(flow.gamma-1);
        const Mach3 = Math.sqrt(Mach2);
        const Mach = Math.sqrt((Math.pow(PR, (-flow.gamma-1)/flow.gamma)-1)*(2/(flow.gamma-1)));
        return new Flow(Mach3, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    }
    //From Temperature Ratio
    static MachFromTR = (flow : Flow, TR:number) => {
        const Mach = Math.sqrt((Math.pow(TR,-1)-1)*(2/(flow.gamma-1)));
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    }
    //From Density Ratio 
    static MachFromDR = (flow : Flow, DR:number) => {
        const Mach = Math.sqrt(Math.pow(DR, (-flow.gamma-1)*flow.gamma)*(2/(flow.gamma-1)));
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    }

    //From Mach Angle 
    static MachFromMA = (flow: Flow, MA:number) => {
        const Mach = Math.asin(MA*Math.PI/180)
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    }
    //From Prandtl-Meyer Angle


    //From Area Ratio 
    static MachToAR = (Mach: number, gamma: number) => {
        const A1 = (gamma+1)/2;
        const A2 = -(gamma+1)/2/(gamma-1);
        const A3 = Math.pow(A1,A2);
        const A4= (1+(gamma-1)/2*Math.pow(Mach,2));
        const A5 = (gamma+1)/2/(gamma-1);
        const A6 = Math.pow(A4,A5);
        return A6*A3/Mach;
    }

    static MachFromARSubsonic = (flow:Flow, AR:number, Mach:number=.5) => {
        //var Mach = .5;
        while(Math.abs(AR-Flow.MachToAR(Mach, flow.gamma))>.0000005){
            Mach = Mach-.00001*(AR-Flow.MachToAR(Mach, flow.gamma))
        }
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    }

    static MachFromARSupersonic = (flow:Flow, AR:number) => {
        var Mach = 2;
        while(Math.abs(AR-Flow.MachToAR(Mach, flow.gamma))>.00005){
            Mach = Mach+.001*(AR-Flow.MachToAR(Mach, flow.gamma))
        }
        return new Flow(Mach, flow.TotalTemp, flow.TotalPressure, flow.gamma, flow.R);
    }
    //Set Total Pressure (From Density, etc...)
    static TPFromTP = (flow : Flow, TP:number) => new Flow(flow.Mach, flow.TotalTemp, TP, flow.gamma, flow.R);
    
    static TPFromPressure = ( flow : Flow, Pressure:number) => {
        //PP0​​=(1+2γ−1​M2)γ−1γ​
        const TP = Pressure*Math.pow(1+(flow.gamma-1)/2*Math.pow(flow.Mach,2), (flow.gamma/(flow.gamma-1)))
        //const TP = Pressure*Math.pow((1+(flow.gamma-1)/2*Math.pow(flow.Mach,2)),(flow.gamma/(flow.gamma-1)))
        return new Flow(flow.Mach, flow.TotalTemp, TP, flow.gamma, flow.R);
    }

    //Set Total Temperature Ratio
    static TTFromTT = (flow:Flow, TT:number) => new Flow(flow.Mach, TT, flow.TotalPressure, flow.gamma, flow.R);

    static TTFromTemperature = (flow:Flow, Temperature:number) => {
        const TT = Temperature*flow.expr;
        return new Flow(flow.Mach, TT, flow.TotalPressure, flow.gamma, flow.R)
    }

    static TTFromSoundSpeed = (flow:Flow,SoundSpeed:number) => {
        const StaticTemperature = Math.pow(SoundSpeed,2)/(flow.R*flow.gamma);
        return Flow.TTFromTemperature(flow, StaticTemperature);
    }

}

export default Flow;