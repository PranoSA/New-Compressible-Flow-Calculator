import Flow from './Flow';
import {NormalShock} from './ShockWaves';

//Think Of the Cases
//Define Outlet Pressure + Inlet Pressure + Exit Area/Entrance Area
//Can There be a shock in just a Diffuser??? Supersonic Entrance -> Too High Pressure ...
//If Subsonic in Entrance -> Just Going To Slow Down To The End 
//Very Supersonic -> Normal Shock at Entrance?? 
//No Shock Solution 

export class Diffuser {
    area_ratio:number|null = null; //Outlet vs Inlet
    adiabatic_effeciency : number|null = null;
    outlet_mach : number|null = null;

    constructor(area_ratio:number|null, adiabatic_effeciency:number|null, outlet_mach:number|null){
        this.area_ratio=area_ratio;
        this.adiabatic_effeciency = adiabatic_effeciency;
        this.outlet_mach = outlet_mach;
    }

    //pressure drive will determine the velocity??
    // Input Mach Will Be Subject to Change Based on the BackPressure
    expandToPressure = () => {
        const normalEntranceMach = 0;
        // What does this do exactly -> 

        //Find 
    }

    // Area expansion / decreasion will determine the out Mach and Static properties
    // Should We Assume lossless expansion? 
    // How would we account for isentropic efficiency?
    expandToArea = (flow:Flow) => {
        // also - how do we account for shock waves if input flow is supersonic -> Ignore this for now 
        if(this.area_ratio===null || this.adiabatic_effeciency===null){
            throw new Error('No Area Ratio Specified');
        }

        // Starting Guess
        let area_ratio = this.area_ratio;

        let actual_area_ratio = area_ratio;
        //What We Return
        let actual_pressure_flow = flow;



            const ideal_flow = Flow.MachFromARSubsonic(flow,flow.AreaRatio2*area_ratio);
            console.log("ideal Mach", ideal_flow);

            const ideal_temperature = ideal_flow.Temp;

            const actual_temperature = flow.Temp + (ideal_temperature-flow.Temp)/this.adiabatic_effeciency;

            if (actual_temperature > flow.TotalTemp){
                throw new Error('Diffuser Not Possible, Out of Kinetic Energy ');
            }

           // const actual_pressure = ideal_flow.Pressure // We Are assuming that there is a constant target pressure
            //This is an il-advised assumption
            const ideal_pressure = ideal_flow.Pressure;

            const actual_mach_flow = Flow.MachFromTR(ideal_flow,actual_temperature/flow.TotalTemp);
            //What if we used the actual mach number to find the actual pressure?
            //const actual_pressure = actual_mach_flow.Pressure
            const actual_pressure = ideal_pressure;


            // The Mach Should Be lower, right??
            

            actual_pressure_flow = Flow.TPFromPressure(actual_mach_flow,actual_pressure);

            console.log("Actual Mass FLow", actual_pressure_flow.Density*actual_pressure_flow.Velocity*this.area_ratio);
            console.log("Input Mass Flow", flow.Density*flow.Velocity);

            return actual_pressure_flow;


    }

}

export class Nozzle {
    
}

export class DiffuserNozzle {
    outlet_pressure: number|null


    constructor(outlet_pressure:number|null){
        this.outlet_pressure = outlet_pressure;
    }
}


export {}