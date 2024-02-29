'use client';

import React, { useEffect, useRef, useState } from 'react';
import Flow from '@/utils/Flow';
import { Compressor, Turbine } from '@/utils/Turbomachines';
import * as d3 from 'd3';
import FlowDisplayChart from '@/components/FlowDisplay';
import FlowDisplay from '@/components/FlowEnergyCharts';
import FlowEnergyCharts from '@/components/FlowEnergyCharts';
import FlowForm from '@/components/Flow_Form';

const Home = () => {
  //flow = inputFlow
  const [flow, setFlow] = useState<Flow>(new Flow(0, 0, 0, 1.4, 287));

  const [pressureOptionValue, setPressureOptionValue] = useState<number>(0);
  const [turbomachine, setTurbomachine] = useState<'Compressor' | 'Turbine'>(
    'Compressor'
  );

  const [efficiencySetting, setEfficiencySetting] = useState<
    'Isentropic' | 'Polytropic'
  >('Polytropic');

  const [efficiency, setEfficiency] = useState<number>(1.0);

  const [pressureRatio, setPressureRatio] = useState<number>(1.0);

  const [outputFlow, setOutputFlow] = useState<Flow>(
    new Flow(0, 0, 0, 1.4, 287)
  );

  const transformSameValue = (value: number) => {
    //Limit to 3 decimals or NaN
    return isNaN(value) ? 'NaN' : value.toFixed(3);
  };

  useEffect(() => {
    if (turbomachine === 'Compressor') {
      if (efficiencySetting === 'Isentropic') {
        const comp = new Compressor(efficiency, null, pressureRatio, 0);
        setOutputFlow(comp.compressFlow(flow));
      } else {
        const comp = new Compressor(null, efficiency, pressureRatio, 0);
        setOutputFlow(comp.compressFlow(flow));
      }
    } else {
      if (efficiencySetting === 'Isentropic') {
        const turbine = new Turbine(efficiency, null, 0, pressureRatio);
        setOutputFlow(turbine.expandFlow(flow));
      } else {
        const turbine = new Turbine(null, efficiency, 0, pressureRatio);
        setOutputFlow(turbine.expandFlow(flow));
      }
    }
  }, [flow, turbomachine, efficiencySetting, efficiency, pressureRatio]);

  //Later Add Graphs of Isentropic Efficiency vs. Ideal Isentropic Efficiency

  return (
    <div className="flex flex-wrap md:flex-row md:justify-between">
      <div className="w-full text-center p-10 text-3xl">
        Turbomachine Analysis
      </div>
      <div className="w-full flex flex-wrap">
        <FlowForm flow={flow} setFlow={setFlow} setTraits={() => {}} />
      </div>
      <div className="w-full text-center p-10 ">
        <form className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2 flex flex-col items-center p-4">
            <label>Turbomachine</label>
            <select
              className="w-3/4"
              value={turbomachine}
              onChange={(e) =>
                setTurbomachine(e.target.value as 'Compressor' | 'Turbine')
              }
            >
              <option value="Compressor">Compressor</option>
              <option value="Turbine">Turbine</option>
            </select>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center p-4">
            <label>Efficiency Setting</label>
            <select
              className="w-3/4"
              value={efficiencySetting}
              onChange={(e) =>
                setEfficiencySetting(
                  e.target.value as 'Isentropic' | 'Polytropic'
                )
              }
            >
              <option value="Isentropic">Isentropic</option>
              <option value="Polytropic">Polytropic</option>
            </select>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center p-4">
            <label>Efficiency</label>
            <input
              className="w-3/4"
              type="number"
              step="0.01"
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value))}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center p-4">
            <label>
              {turbomachine === 'Compressor'
                ? 'Pressure Ratio'
                : 'Work (Joules)'}
            </label>
            <input
              className="w-3/4"
              type="number"
              value={pressureRatio}
              onChange={(e) => setPressureRatio(Number(e.target.value))}
            />
          </div>
        </form>
        <div className="w-full md:w-1/2 flex items-center">
          Work :{' '}
          {Math.abs(
            flow.Cp * (flow.TotalTemp - outputFlow.TotalTemp)
          ).toPrecision(4)}
        </div>
        <div className="w-full md:w-1/2 flex items-center"></div>
      </div>

      <div className="w-full md:w-1/2">
        <FlowEnergyCharts flow={flow} output_pressure={flow.Pressure} />
      </div>
      <div className="w-full md:w-1/2">
        <FlowEnergyCharts flow={outputFlow} output_pressure={flow.Pressure} />
      </div>

      <div className="w-full flex flex-wrap">
        <FlowDisplayChart flow={outputFlow} filter_traits={[]} />
      </div>
    </div>
  );
};

export default Home;
