'use client';

import React, { useEffect, useState } from 'react';
import Flow from '@/utils/Flow';

const IsentropicFlowPage = () => {
  const [flow, setFlow] = useState<Flow>(new Flow(0.8, 100, 1000, 1.4, 287));

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

  const transformSameValue = (value: number) => {
    //Limit to 3 decimals or NaN
    return isNaN(value) ? 'NaN' : value.toFixed(3);
  };

  useEffect(() => {
    let new_flow = Flow.CopyFlow(flow);

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

  /*
    useEffect(() => {
      const new_flow = flow;
      switch (machOption) {
        case 'Mach Number':
          setFlow((flow) => Flow.MachFromMach(flow, machOptionValue));
          break;
        case 'Temperature Ratio':
          setFlow((flow) => Flow.MachFromTR(flow, machOptionValue));
          break;
        case 'Pressure Ratio (p / po)':
          setFlow((flow) => Flow.MachFromPR(flow, machOptionValue));
          break;
        case 'Density Ratio':
          setFlow((flow) => Flow.MachFromDR(flow, machOptionValue));
          break;
        case 'Mach Angle':
          setFlow((flow) => Flow.MachFromMA(flow, machOptionValue));
          break;
        case 'Area Ratio':
          setFlow((flow) => Flow.MachFromARSubsonic(flow, machOptionValue));
          break;
        case 'Supersonic Area Ratio':
          setFlow((flow) => Flow.MachFromARSupersonic(flow, machOptionValue));
          break;
      }
    }, [machOption, machOptionValue]);
  
    useEffect(() => {
      switch (temperatureOption) {
        case 'Total Temperature':
          setFlow((flow) => Flow.TTFromTT(flow, temperatureOptionValue));
          break;
        case 'Static Temperature':
          setFlow((flow) => Flow.TTFromTemperature(flow, temperatureOptionValue));
          break;
        case 'Sound Speed':
          setFlow((flow) => Flow.TTFromSoundSpeed(flow, temperatureOptionValue));
          break;
      }
    }, [temperatureOption, temperatureOptionValue]);
  
    useEffect(() => {
      console.log('pressureOptionValue', pressureOptionValue);
      console.log('pressureOption', pressureOption);
      let newFlow;
      switch (pressureOption) {
        case 'Static Pressure':
          setFlow((flow) => Flow.TPFromPressure(flow, pressureOptionValue));
          newFlow = Flow.TPFromPressure(flow, pressureOptionValue);
          console.log('newFlow', newFlow);
          console.log('flow static', flow);
          break;
        case 'Total Pressure':
          newFlow = Flow.TPFromTP(flow, pressureOptionValue);
          console.log('newFlow', newFlow);
          setFlow((flow) => Flow.TPFromTP(flow, pressureOptionValue));
          console.log('flow total', flow);
          break;
      }
    }, [pressureOption, pressureOptionValue]);
*/

  return (
    <div className="flex flex-col flex-wrap md:flex-row md:justify-between">
      <div className="w-full text-center p-10 text-3xl">
        Isentropic Flow Propertiess
      </div>
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

      <div className="w-full flex flex-wrap">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ...Object.getOwnPropertyNames(flow),
            ...Object.getOwnPropertyNames(Object.getPrototypeOf(flow)),
          ].map((key) => (
            <div
              key={key}
              className="border p-4 flex flex-col items-center justify-center"
            >
              <label className="font-bold">{key}</label>
              <div>
                {
                  //@ts-ignore
                  transformSameValue(flow[key])
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IsentropicFlowPage;
