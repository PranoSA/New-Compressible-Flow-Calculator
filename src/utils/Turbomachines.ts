import Flow from "./Flow";

export class Compressor {
    polyeff : number|null;
    iseneff : number|null;
    pressure_ratio : number|null;
    work : number|null; 

    // Add Getters for 
    // Isentropic Efficiency
    // Polytropic Efficiency

    // Ideal Isentropic Efficiency
    // Ideal Polytropic Efficiency = 1

    // Polytropic Efficiency = Actual Efficiency / Ideal Isentropic Efficiency

     IdealIsenEff(Flow : Flow):number{
        
        if(!this.pressure_ratio){
            return 0;
        }

        return (Math.pow(this.pressure_ratio, (Flow.gamma-1)/Flow.gamma)-1);
    }

    constructor(iseneff:number|null, polyeff : number|null, pressure_ratio:number|null, work:number|null){
        this.polyeff = polyeff;
        this.iseneff = iseneff;
        this.pressure_ratio = pressure_ratio;
        this.work = work; //This is the work done by the compressor per unit mass flow
    }

     convertPolyEffToIsenEff = (polyeff:number, pr:number, gamma:number):number => {
        return (polyeff*(Math.pow(pr, (gamma-1)/gamma))-1);
    }

    compressFlow = (flow:Flow):Flow => {

        const new_flow = Flow.CopyFlow(flow);
        if(this.polyeff && this.pressure_ratio){

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
            new_flow.TotalTemp = Math.pow(this.pressure_ratio, (flow.gamma-1)/(flow.gamma*this.polyeff))*flow.TotalTemp;
            //new_flow.TotalTemp = this.pressure_ratio*(Math.pow(flow.TotalTemp, (flow.gamma-1)/flow.gamma));
            new_flow.TotalPressure = flow.TotalPressure*this.pressure_ratio;

            return new_flow;

        }
        if(this.iseneff !== null && this.pressure_ratio !== null){
            const TFactor = ((Math.pow(this.pressure_ratio, (flow.gamma-1)/flow.gamma)));

            // Isentropic Output Total Temperature
            // Pressure Ratio ^((gamma-1)/ gamma)
            //P2/P1 *TFactor= T2/T1

            const ideal_isen_heat_change = flow.TotalTemp*(TFactor-1)

            // Actual Change in Total Temperature
            const actual_isen_heat_change = ideal_isen_heat_change/this.iseneff;


            new_flow.TotalTemp = flow.TotalTemp+actual_isen_heat_change;

            new_flow.TotalPressure = flow.TotalPressure*this.pressure_ratio;
            //Flow.MachFromVelocity
        }
        //ηi​sentropic=(n1​)×[(P1P2​)nn−1​−1]
        if(this.polyeff && this.work){
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
            const isen_work = this.work/this.polyeff; 
            //THis makes no sense -> First find perfectly isentropic work 

            // Perfect isentropic work

            //wisentropic​=cp​⋅(T2​−T1​)

            const output_total_temp = flow.TotalTemp + isen_work/flow.Cp;

            //solve for P2/P1 using 
            //T1​T2​​=(P1​P2​​)nn−1​

            const output_total_pressure = flow.TotalPressure*Math.pow(output_total_temp/flow.TotalTemp, flow.gamma/(flow.gamma-1));

            // Create new flow
            new_flow.TotalPressure = output_total_pressure;

            new_flow.TotalTemp = output_total_temp;

            return new_flow;

        }
        if(this.iseneff && this.work){

            // Find isentropic work
            const isen_work = this.work/this.iseneff;

            //wisentropic​=cp​⋅(T2​−T1​)

            const output_total_temp_isen = flow.TotalTemp + isen_work/flow.Cp;

            //solve for P2/P1 using 
            //T1​T2​​=(P1​P2​​)nn−1​

            const output_total_pressure = flow.TotalPressure*Math.pow(output_total_temp_isen/flow.TotalTemp, flow.gamma/(flow.gamma-1));

            // Create new flow
            new_flow.TotalPressure = output_total_pressure;

            new_flow.TotalTemp = output_total_temp_isen;

            return new_flow;

        }
        
        flow.Mach = 1;
        
        return new_flow;
    }    
}

export class Turbine {
    polyeff : number|null = null;
    iseneff : number|null = null;
    pressure_ratio : number|null = null;
    work : number|null = null;

    constructor(iseneff:number|null, polyeff : number|null,pressure_ratio:number|null, work:number|null){
        this.polyeff = polyeff;
        this.iseneff = iseneff;
        this.pressure_ratio = pressure_ratio;
        this.work = work;
    }

    expandFlow = (flow:Flow) => {
        const new_flow = Flow.CopyFlow(flow);
        if(this.polyeff && this.pressure_ratio){
            
        }
        if(this.iseneff && this.pressure_ratio){
            
        }
        if(this.polyeff && this.work){
            // The Turbine Will Drive the Compressor So Usually Work Will Be Used 

            //ηt = (1- (𝑟𝑝𝑡 )(𝛾−1)/𝛾* ηtp)/ (1- 1 / (𝑟𝑝𝑡 )(𝛾−1)/𝛾).
            //new_flow.TotalTemp = Math.pow(this.pressure_ratio, (flow.gamma-1)/(flow.gamma*this.polyeff))*flow.TotalTemp;

            // We Want Output Static Presssure difference todrive the compressor,right?

            //or -> isentropic total temperature difference drives the compressor

            
            //new_flow.TotalTemp = Math.pow(this.pressure_ratio, (flow.gamma-1)/(flow.gamma*this.polyeff))*flow.TotalTemp;

            // Find Pressure Ratio Based on Work 
            const ideal_temp_change = this.work/flow.Cp;

            // Ideal Pressure Flow 
            const ideal_pressure_ratio = Math.pow((flow.TotalTemp)/(flow.TotalTemp-ideal_temp_change), flow.gamma/(flow.gamma-1));
            console.log("Ideal Pressure Ratio", ideal_pressure_ratio)

          //  const actual_output_temp = Math.pow(1/ideal_pressure_ratio, (flow.gamma-1)/(flow.gamma*this.polyeff))*flow.TotalTemp;
           // const actual_output_temp = Math.pow(1/ideal_pressure_ratio, this.polyeff*(flow.gamma-1)/flow.gamma)*flow.TotalTemp;
            //Preliminary Attempt

            //const pressure_change_ratio = Math.pow((ideal_isen_temp_change+flow.TotalTemp)/(flow.TotalTemp), flow.gamma/(flow.gamma-1));

           //const actual_output_temp = flow.TotalTemp-flow.TotalTemp * (1-Math.pow(1/ideal_pressure_ratio,(flow.gamma-1)/(flow.gamma*this.polyeff)))/this.polyeff
            const actual_output_temp = flow.TotalTemp
           //const actual_output_temp = (flow.TotalTemp-ideal_temp_change)*Math.pow(ideal_pressure_ratio, this.polyeff*(flow.gamma-1)/flow.gamma)-(ideal_temp_change)
           

            const actual_pressure_flow = Flow.TPFromTP(flow, flow.TotalPressure/ideal_pressure_ratio);

            const actual_temp_flow = Flow.TTFromTT(actual_pressure_flow, actual_output_temp);

            return actual_temp_flow;
            

        }
        if(this.iseneff && this.work){
            // The Isentropic Efficiency of a Turbine Describes The Change in Energy of a flow 
            // Versus the amount of energy needed to drive the turbine (Driven By Pressure Differences)
            
            // Would We Include Total Pressure in the equation ???
            // Or Just Static Pressure - Lets Assume the Mach is Constant ??

            // For Now Ignore The Effects of Mach Number

            const ideal_isen_temp_change = this.work/flow.Cp;
            const actual_isen_temp_change = ideal_isen_temp_change/this.iseneff;
            const t_output_total_temp = flow.TotalTemp - actual_isen_temp_change;

            if(t_output_total_temp < 0){
                throw new Error("Negative Temperature")
            }

            //  Or assume the density is constant?
            // The Work Done Per Unit Mass is the difference in pressure 

            //Find P2/P1 based on (ideal_isen_temp_change+T1)/(T1)
          //  const pressure_change_ratio = Math.pow((ideal_isen_temp_change+flow.TotalTemp)/(flow.TotalTemp), flow.gamma/(flow.gamma-1));
            const pressure_change_ratio =  Math.pow((flow.TotalTemp)/(flow.TotalTemp-ideal_isen_temp_change), flow.gamma/(flow.gamma-1));
          console.log("Pressure Change Ratio", pressure_change_ratio)

            const output_total_pressure = Flow.TPFromTP(flow,flow.TotalPressure/pressure_change_ratio)
            

            const output_total_temp = Flow.TTFromTT(output_total_pressure, t_output_total_temp);

            return output_total_temp;

        }
        return Flow.NewFlow()
    }    
}
