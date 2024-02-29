'use client';
import { useEffect, useState } from 'react';
import Flow from '@/utils/Flow';
import FlowInput from '@/components/Flow_Form';
import FlowEnergyCharts from '@/components/FlowEnergyCharts';
import FlowDisplayChart from '@/components/FlowDisplay';

const FilterTraits: string[] = [
  'expr',
  'entropy',
  'constructor',
  'gamma',
  'R',
  'Cp',
  'Cv',
  'Enthalpy',
  'expansionToPressurePE',
  'expansionToKineticPE',
  'expansionToDensityVolume',
];

const PotentialComparisonPage = () => {
  const [flow1, setFlow1] = useState<Flow>(new Flow(0, 0, 0, 1.4, 287));
  const [flow2, setFlow2] = useState<Flow>(new Flow(0, 0, 0, 1.4, 287));
  //What We Want to Do Here is Have Two flows
  const [entropyDifference, setEntropyDifference] = useState<number>(0);
  const [expansionPressure, setExpansionPressure] = useState<number>(0);
  //THis WIll Be Used For Both KE and Expansion work potential
  const [expansionWork1, setExpansionWork1] = useState<number>(0);
  const [kineticEnergy1, setKineticEnergy1] = useState<number>(0);
  const [expansionWork2, setExpansionWork2] = useState<number>(0);
  const [kineticEnergy2, setKineticEnergy2] = useState<number>(0);

  const [chosenTraits, setChosenTraits] = useState<string[]>([]);

  useEffect(() => {
    setExpansionWork1(flow1.expansionToPressurePE(expansionPressure));
    setExpansionWork2(flow2.expansionToPressurePE(expansionPressure));
    setKineticEnergy1(flow1.expansionToKineticPE(expansionPressure));
    setKineticEnergy2(flow2.expansionToKineticPE(expansionPressure));
    setEntropyDifference(Flow.EntropyDifference(flow1, flow2));
  }, [flow1, flow2, expansionPressure]);

  // And Then Display the different potential kinetic energy and expansion pressure energy of the flow

  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full flex flex-wrap">
        Flow 1
        <FlowInput
          flow={flow1}
          setFlow={setFlow1}
          setTraits={(traits: string[]) => setChosenTraits(traits)}
        />
      </div>
      <div className="w-full flex flex-wrap">
        Flow 2
        <FlowInput
          flow={flow2}
          setFlow={setFlow2}
          setTraits={(traits: string[]) => setChosenTraits(traits)}
        />
      </div>

      <div className="w-full flex flex-wrap md:w-1/2">
        <div className="md:w-1/2 p-2">
          <label className="block">Expansion Pressure</label>
          <input
            type="number"
            value={expansionPressure}
            onChange={(e) => setExpansionPressure(parseFloat(e.target.value))}
          />
        </div>
        <div className="md:w-1/2 p-2">
          <label className="block">Entropy Difference</label>
          <h2>{entropyDifference.toPrecision(4)} J/K </h2>
        </div>
      </div>

      <div className="w-full flex flex-wrap md:w-1/2 p-15">
        <div className="md:w-1/2 p-2">
          <label className="block">Expansion Work 1</label>
          <h2> {expansionWork1.toPrecision(4)} Joules </h2>
        </div>
        <div className="md:w-1/2 p-2">
          <label className="block">Expansion Work 2</label>
          <h2> {expansionWork2.toPrecision(4)} Joules </h2>
        </div>

        {/*<div className="md:w-1/2 p-2">
          <label className="block">Kinetic Energy 1</label>
          <h2 className="block">{kineticEnergy1} Joules </h2>
        </div>

        <div className="md:w-1/2 p-2">
          <label className="block">Kinetic Energy 2</label>
          <h2> {kineticEnergy2} Joules </h2>
        </div>
        */}
      </div>

      <div className="w-full p-5"></div>

      <div className="w-full md:w-1/2">
        <FlowEnergyCharts flow={flow1} output_pressure={expansionPressure} />
      </div>

      <div className="w-full md:w-1/2">
        <FlowEnergyCharts flow={flow2} output_pressure={expansionPressure} />
      </div>
      <div className="w-full md:w-1/2">
        <FlowDisplayChart
          flow={flow1}
          filter_traits={[...FilterTraits, ...chosenTraits]}
        />
      </div>
      <div className="w-full md:w-1/2">
        <FlowDisplayChart
          flow={flow2}
          filter_traits={[...FilterTraits, ...chosenTraits]}
        />
      </div>
    </div>
  );
};

export default PotentialComparisonPage;
