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

        do {


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
            console.log("actual pressure", actual_pressure);
            console.log("Ideal Pressure", ideal_pressure);
            console.log("ideal mach", ideal_flow.Mach);
            console.log("actual mach", actual_mach_flow.Mach);

            // The Mach Should Be lower, right??
            

            actual_pressure_flow = Flow.TPFromPressure(actual_mach_flow,actual_pressure);

            return actual_pressure_flow;
            console.log("Ideal Total PRessure", ideal_flow.TotalPressure);
            console.log("Actual Total Pressure", actual_pressure_flow.TotalPressure);

            // What We Actually Discovered -> We Want this to Converge onto this.area_ratio
            actual_area_ratio = flow.Density / actual_pressure_flow.Density * flow.Velocity / actual_pressure_flow.Velocity;

            // Now -> guess the next area ratio
            console.log("Actual Area Ratio", actual_area_ratio);

            // Next Guess on Fake Area Ratio
            // It Should Get Bigger -> The Output Mach Should Get Smaller
            area_ratio = area_ratio + (this.area_ratio-actual_area_ratio)/50;
            // If actual_area_ratio is too high, we need to decrease the fake area ratio

        }while(Math.abs(actual_area_ratio-this.area_ratio)>0.001)

        console.log("Affective Area Ratio", area_ratio);

        return actual_pressure_flow;

        // Now Try Something Else -> We assume based on he the area ratio -> The Output static pressure 
        /*const ideal_flow = Flow.MachFromARSubsonic(flow,flow.AreaRatio2*this.area_ratio);

        const ideal_temperature = ideal_flow.Temp;

        //More THan Idea 
        const actual_temperature = flow.Temp + (ideal_temperature-flow.Temp)/this.adiabatic_effeciency; 

        if (actual_temperature > flow.TotalTemp){
            throw new Error('Diffuser Not Possible, Out of Kinetic Energy ');
        }

        const actual_pressure = ideal_flow.Pressure

        const actual_mach_flow = Flow.MachFromTR(flow,actual_temperature/flow.TotalTemp);

        // Now, We Need a way to solve for stagnation pressure
        //const actual_pressure_flow = Flow.TPFromPressure(actual_mach_flow,actual_pressure);

        // Now -> The Actual Area Ratio is ...
        // p2 * V2 * A2 = p1 * V1 * A1
        // A2/A1 = p1 * V1 / p2 * V2
        console.log("Actual Area Ratio", flow.Density / actual_mach_flow.Density * flow.Velocity / actual_mach_flow.Velocity);


        return actual_pressure_flow;*/
    

        // Find Isentropic Pressure From Expansion
       /* const ideal_flow = Flow.MachFromARSubsonic(flow,flow.AreaRatio2*this.area_ratio);

        const ideal_pressure = flow.Pressure; 

        //isentropic efficiency = [delta P Actual]/[delta P Ideal]
        const actual_preesure = this.adiabatic_effeciency*(ideal_flow.Pressure - flow.Pressure) + flow.Pressure;

        console.log("actual pressure", actual_preesure);
        console.log("Ideal Pressure", ideal_flow.Pressure);

        // || This is the actual pressure you are "expanding to"

        if(actual_preesure < 0) {
            throw new Error('Diffuser Not Possible -> Not Enough Pressure To Put Through ');
            return;
        }

        //Maybe Find A Better Method for solving exit velocity ->

        // We Don't Know THe Density and we don't know the velocity or temperature
        //P1rho1V1 = P2rho2V2*area_ratio -> Conservation of Mass
        // V2 = V1*rho1*P1/(rho2*P2*area_ratio)
        //T2 = rho2/rho1*P2/P1*T1 -> Gas Constant 
        // Plug in T2
        
        // We don't know the density of the output flow
        const new_TP =  Flow.TPFromPressure(ideal_flow,actual_preesure);

        return new_TP;*/
    


        // Now We Have Ideal pressure -> can we get temperature to get the mach number ?
        
        // Maybe We Can Try Also Assuming T2 raises similarly ?
       /* const actual_temperature = flow.Temp + (ideal_flow.Temp-flow.Temp)/this.adiabatic_effeciency;

        if(actual_temperature>flow.TotalTemp){
            throw new Error('Diffuser Not Possible, Not Enough Energy to Push Through');
            return;
        }

        const actual_mach_flow = Flow.MachFromTR(flow,actual_temperature/flow.TotalTemp);

        console.log("Actual Mach",  actual_mach_flow);

        return Flow.TPFromPressure(actual_mach_flow,actual_preesure);

    */



        //Find Isentropic Temperature from expansion

        //This is the Ideal ISentropic Expansion -> No change in Total Pressure 
        // We Won't use this flow again except tocalculate actual_temperature
        /*const newflow = Flow.MachFromARSubsonic(flow,flow.AreaRatio2*this.area_ratio);

        console.log("ideal Mach", newflow.Mach);

        //Find Isentropic Pressure from expansion
        // Actual Temperature = Total Temperature if Adiabatic Efficiency is 100%
        const actual_temperature = flow.Temp + (newflow.Temp-flow.Temp)/this.adiabatic_effeciency;


        //Here is what should be happening --------
        //Higher Temperature -> Should Lead to Lower Total Pressures ???

        // Higher Temperature at the output means that 

        //onst actual_temperature = flow.Temp + (flow.Temp/this.adiabatic_effeciency)*(newflow.Temp /flow.Temp-1);
        // Not Enough Energy TO Push THrough
        if(actual_temperature>flow.TotalTemp){
            throw new Error('Diffuser Not Possible');
            return;
        }


        //  Now -> That We have the actual Temperature -> We Now Need to find actual mach flow 
        // Really, new_flow is no different than flow for this purpose, or shouldn't be 
        const actual_mach_flow = Flow.MachFromTR(flow,actual_temperature/flow.TotalTemp);

        console.log("Actual Mach",  actual_mach_flow.Mach);
       

        // Now, We also Know the Total Temperature (Adiabatic Process) 
        // Do We Need this -> No ... It shouldn't do anything
        // We already set the Mach and Total Temperature (Its the same)
        
    
        //Now -> Lets USe Conservation of Mass to Find the Density of the Output sssssssssss

        // density*Velocity*Area = constant 
        //d1V1A1 = d2V2A2
        //(A1/A2) = 1/area_ratio
        //d2 = d1 * V1 / V2 * 1/area_ratio
        
        // Why Might This Assumption Not Be Right ?
        // Conservation of mass seems fairly straight forward
        // could flow.Density be wrong?
        const output_density = (flow.Density*flow.Velocity) /(this.area_ratio*actual_mach_flow.Velocity);
         //times the p1V1A1 = p2V2A2, so output_density = p1 * V1 / V2 * 1/area_ratio
         //Conservation of Mass

         //Lets Try Conservation of Energy per unit mass
         //OutputPressure/output_density + 1/2*V2^2 + temp*cv = InputPressure/InputDensity + 1/2*V1^2 +tempcv

         const diff_ke_terms = 1/2*(flow.Velocity ** 2 - actual_mach_flow.Velocity**2);
         const diff_te_terms = flow.Cv*flow.Temp - actual_temperature*flow.Cv;
        
         const output_pressure = (diff_ke_terms + diff_te_terms + flow.Pressure/flow.Density)*output_density;

         console.log("output Pressure", output_pressure);
         //Try Conservation of Energy Instead
         //Pressure = Density * R * Temp
         // Pressure / Density = R * Temp
         //Pressure / Density + Temp *Cv = Constant
         // 
         console.log("area ratio", this.area_ratio);

        //Pressure = Density * R * Temp
        const pressure = output_density * flow.R * actual_temperature;
        console.log("output Pressure", pressure);

        console.log("old flow", flow);
        
       console.log("output Flow Rate", output_density*actual_mach_flow.Velocity*this.area_ratio);
       console.log("input Flow Rate", flow.Density*flow.Velocity);

        //const actual_pressure_flow = Flow.TPFromTP(newflow,new_total_pressure);
        const actual_pressure_flow = Flow.TPFromPressure(actual_mach_flow,pressure);

        //P0,1​P0,2​​=(1+βηisentropic​​(γ(γ−1)β2γ−1​)M12​)γ−1γ​
        const expr_inner = (this.area_ratio**2-1)/(flow.gamma*(flow.gamma-1));
        const expr = (1+this.adiabatic_effeciency/this.area_ratio*expr_inner*flow.Mach**2);
        //const new_total_pressure = flow.TotalPressure*(expr**(flow.gamma/(flow.gamma-1)));

        //return Flow.TPFromTP(actual_mach_flow,new_total_pressure);
        return actual_pressure_flow;


        //We know the mach now -> But can we assume about the pressure ?
        */

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