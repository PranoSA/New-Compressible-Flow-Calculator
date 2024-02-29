'use client';
import { useEffect, useState } from 'react';
import Flow from '@/utils/Flow';

type FlowFormProps = {
  setFlow: (flow: Flow) => void;
  flow: Flow;
  setTraits: (traits: string[]) => void;
};

export default function FlowForm(props: FlowFormProps) {
  const { setFlow, flow, setTraits } = props;

  const [machOption, setMachOption] = useState<string>('Mach Number');
  const [machOptionValue, setMachOptionValue] = useState<number>(0.8);

  const [errorMessageMach, setErrorMessageMach] = useState<string>('');
  const [errorMessageTemperature, setErrorMessageTemperature] =
    useState<string>('');
  const [errorMessagePressure, setErrorMessagePressure] = useState<string>('');

  const [temperatureOption, setTemperatureOption] =
    useState<string>('Total Temperature');

  const [temperatureOptionValue, setTemperatureOptionValue] =
    useState<number>(0);

  const [pressureOption, setPressureOption] =
    useState<string>('Total Pressure');

  const [pressureOptionValue, setPressureOptionValue] = useState<number>(0);

  const flowKeys: string[] = ['Mach', 'TotalTemp', 'TotalPressure'];

  useEffect(() => {
    let new_flow = Flow.CopyFlow(flow);

    setTraits([machOption, temperatureOption, pressureOption]);

    switch (machOption) {
      case 'Mach Number':
        //Make sure more than 0
        if (machOptionValue < 0) {
          setErrorMessageMach('Mach Number must be greater than 0');
          return;
        }
        new_flow = Flow.MachFromMach(new_flow, machOptionValue);
        break;
      case 'Temperature Ratio(t/to)':
        //Make sure more than 0 and less than 1
        if (machOptionValue < 0 || machOptionValue > 1) {
          setErrorMessageMach('Temperature Ratio must be between 0 and 1');
          return;
        }
        new_flow = Flow.MachFromTR(new_flow, machOptionValue);
        break;
      case 'Pressure Ratio (p / po)':
        //Make sure more than 0 and less than 1
        if (machOptionValue < 0 || machOptionValue > 1) {
          setErrorMessageMach('Pressure Ratio must be between 0 and 1');
          return;
        }
        new_flow = Flow.MachFromPR(new_flow, machOptionValue);
        break;
      case 'Density Ratio':
        //Make sure more than 0 and less than 1
        if (machOptionValue < 0 || machOptionValue > 1) {
          setErrorMessageMach('Density Ratio must be between 0 and 1');
          return;
        }
        new_flow = Flow.MachFromDR(new_flow, machOptionValue);
        break;
      case 'Mach Angle':
        //Make sure more than 0 and less than 90
        if (machOptionValue < 0 || machOptionValue > 90) {
          setErrorMessageMach('Mach Angle must be between 0 and 90');
          return;
        }
        new_flow = Flow.MachFromMA(new_flow, machOptionValue);
        break;
      case 'Area Ratio':
        //Make sure more than 0
        if (machOptionValue < 0) {
          setErrorMessageMach('Area Ratio must be greater than 0');
          return;
        }

        new_flow = Flow.MachFromARSubsonic(new_flow, machOptionValue);
        break;
      case 'Supersonic Area Ratio':
        //Make sure more than 0
        if (machOptionValue < 0) {
          setErrorMessageMach('Supersonic Area Ratio must be greater than 0');
          return;
        }
        new_flow = Flow.MachFromARSupersonic(new_flow, machOptionValue);
        break;
    }
    setErrorMessageMach('');

    switch (temperatureOption) {
      case 'Total Temperature':
        // Make sure more than 0
        if (temperatureOptionValue < 0) {
          setErrorMessageTemperature(
            'Total Temperature must be greater than 0'
          );
          return;
        }
        new_flow = Flow.TTFromTT(new_flow, temperatureOptionValue);
        break;
      case 'Static Temperature':
        // Make sure more than 0
        if (temperatureOptionValue < 0) {
          setErrorMessageTemperature(
            'Static Temperature must be greater than 0'
          );
          return;
        }
        new_flow = Flow.TTFromTemperature(new_flow, temperatureOptionValue);
        break;
      case 'Sound Speed':
        // make sure more than 0
        if (temperatureOptionValue < 0) {
          setErrorMessageTemperature('Sound Speed must be greater than 0');
          return;
        }
        new_flow = Flow.TTFromSoundSpeed(new_flow, temperatureOptionValue);
        break;
    }
    setErrorMessageTemperature('');

    switch (pressureOption) {
      case 'Static Pressure':
        // Make sure more than 0
        if (pressureOptionValue < 0) {
          setErrorMessagePressure('Static Pressure must be greater than 0');
          return;
        }
        new_flow = Flow.TPFromPressure(new_flow, pressureOptionValue);
        break;
      case 'Total Pressure':
        //Make sure more than 0
        if (pressureOptionValue < 0) {
          setErrorMessagePressure('Total Pressure must be greater than 0');
          return;
        }
        new_flow = Flow.TPFromTP(new_flow, pressureOptionValue);
        break;
    }
    setErrorMessagePressure('');

    setFlow(new_flow);
  }, [
    machOption,
    machOptionValue,
    temperatureOption,
    temperatureOptionValue,
    pressureOption,
    pressureOptionValue,
  ]);

  return (
    <div className="w-full flex flex-wrap">
      <div className="md:w-1/3 p-2">
        <label className="block">Mach Constraint</label>
        <input
          type="number"
          className="w-full p-2 border rounded mt-1"
          value={machOptionValue}
          onChange={(e) => {
            setMachOptionValue(parseFloat(e.target.value));
          }}
        />
        <select
          className="w-full p-2 border rounded mt-1"
          onChange={(e) => {
            setMachOption(e.target.value);
          }}
          value={machOption}
        >
          <option>Mach Number </option>
          <option>Temperature Ratio(t/to)</option>
          <option>Pressure Ratio (p / po)</option>
          <option>Density Ratio</option>
          <option>Mach Angle</option>
          <option>Area Ratio</option>
          <option>Supersonic Area Ratio</option>
        </select>
        {errorMessageMach != '' && (
          <div className="text-red-500">{errorMessageMach}</div>
        )}
      </div>
      <div className="md:w-1/3 p-2">
        <label className="block">Temperature Constraint</label>
        <input
          type="number"
          className="w-full p-2 border rounded mt-1"
          value={temperatureOptionValue}
          onChange={(e) => {
            setTemperatureOptionValue(parseFloat(e.target.value));
          }}
        />
        <select
          className="w-full p-2 border rounded mt-1"
          onChange={(e) => {
            setTemperatureOption(e.target.value);
          }}
          value={temperatureOption}
        >
          <option>Total Temperature</option>
          <option>Static Temperature</option>
          <option>Sound Speed</option>
        </select>
      </div>
      <div className="md:w-1/3 p-2">
        <label className="block">Pressure Constraint </label>
        <input
          type="number"
          className="w-full p-2 border rounded mt-1"
          value={pressureOptionValue}
          onChange={(e) => {
            setPressureOptionValue(parseFloat(e.target.value));
          }}
        />
        <select
          className="w-full p-2 border rounded mt-1"
          onChange={(e) => {
            console.log(e.target.value);
            setPressureOption(e.target.value);
          }}
          value={pressureOption}
        >
          <option>Static Pressure</option>
          <option>Total Pressure</option>
        </select>
      </div>
    </div>
  );
}
