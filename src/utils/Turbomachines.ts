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

            const output_total_temp = flow.TotalTemp + isen_work/flow.Cp;

            //solve for P2/P1 using 
            //T1​T2​​=(P1​P2​​)nn−1​

            const output_total_pressure = flow.TotalPressure*Math.pow(output_total_temp/flow.TotalTemp, flow.gamma/(flow.gamma-1));

            // Create new flow
            new_flow.TotalPressure = output_total_pressure;

            new_flow.TotalTemp = output_total_temp;

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


        }
        if(this.iseneff && this.work){
            // This Should be Relatively Easy ->
            //  Find how much change change in 

            // Get From Work To Isentropic Pressure Ratio -> 

            // Work Is Related to Isentropic Total Temperature Change 


            // The Work Done by The Turbine is Related to the Isentropic Work

            // The actual temperature change is subject to efficiency
            
            //const ideal_isen_temp_change = flow.TotalTemp * (1 - Math.pow(1/this.pressure_ratio, (flow.gamma-1)/flow.gamma));

            const ideal_isen_temp_change = this.work/flow.Cp;

            const actual_isen_temp_change = ideal_isen_temp_change/this.iseneff;
            
            const output_total_temp = flow.TotalTemp - actual_isen_temp_change;

            //Now Get Pressure Ratio
            //new_flow.TotalPressure = flow.TotalPressure*Math.pow(output_total_temp/flow.TotalTemp, flow.gamma/(flow.gamma-1));
            const change_total_pressure_ratio = Math.pow((flow.TotalTemp-ideal_isen_temp_change)/(flow.TotalTemp), flow.gamma/(flow.gamma-1));


            new_flow.TotalPressure = flow.TotalPressure*change_total_pressure_ratio;


            new_flow.TotalTemp = output_total_temp;


        }
        return Flow.NewFlow()
    }    
}
