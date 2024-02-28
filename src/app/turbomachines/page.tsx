'use client';

import React, { useEffect, useRef, useState } from 'react';
import Flow from '@/utils/Flow';
import { Compressor, Turbine } from '@/utils/Turbomachines';
import * as d3 from 'd3';

const Home = () => {
  //flow = inputFlow
  const [flow, setFlow] = useState<Flow>(new Flow(0, 0, 0, 1.4, 287));

  const [machOption, setMachOption] = useState<string>('Mach Number');
  const [machOptionValue, setMachOptionValue] = useState<number>(0);

  const [errorMessageMach, setErrorMessageMach] = useState<string>('');
  const [errorMessageTemperature, setErrorMessageTemperature] =
    useState<string>('');
  const [errorMessagePressure, setErrorMessagePressure] = useState<string>('');

  const [temperatureOption, setTemperatureOption] =
    useState<string>('Total Temperature');

  const [temperatureOptionValue, setTemperatureOptionValue] =
    useState<number>(0);

  const [pressureOption, setPressureOption] =
    useState<string>('Static Pressure');

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

  const chartInput = useRef<HTMLDivElement>(null);
  const chartOutput = useRef<HTMLDivElement>(null);

  useEffect(() => {
    var margin = { top: 30, right: 30, bottom: 70, left: 60 };

    if (chartInput.current) {
      d3.select(chartInput.current).selectAll('*').remove();

      const inputEnergy = [
        flow.TotalTemp * flow.Cv,
        (flow.TotalPressure / flow.Density) * flow.DensityRatio,
        flow.Enthalpy * 1000,
        0.5 * flow.Velocity ** 2,
        flow.Pressure / flow.Density,
        flow.Temp * flow.Cv,
        0.5 * flow.Velocity ** 2 +
          flow.Pressure / flow.Density +
          flow.Temp * flow.Cv,
      ];

      console.log(flow);

      const inputLabels = ['TT', 'TP', 'Energy', 'KE', 'SP', 'ST', 'TE'];

      const inputColor = d3.scaleOrdinal(d3.schemeCategory10);

      const inputSvg = d3
        .select(chartInput.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 400 180');

      console.log(inputEnergy);

      const inputG = inputSvg.append('g').attr('transform', 'translate(50,0)'); // Adjust the translate values here

      var y = d3.scaleLinear().domain([0, inputEnergy[2]]).range([100, 0]);

      const bars = inputG
        .selectAll('rect')
        .data(inputEnergy)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 50)
        .attr('y', (d) => y(d)) // Use 500 - d to draw bars upwards
        .attr('width', 20)
        .attr(
          'height',
          (d) => 100 - y(d)
          //(d) => (d * 500) / 1.1 / (flow.TotalTemp + flow.TotalPressure)
        )
        //@ts-ignore
        .attr('fill', (d, i) => inputColor(i));

      /*const labels = inputG
        .selectAll('text')
        .data(inputLabels)
        .enter()
        .append('text')
        .attr('x', (d, i) => i * 50 + 10) // Center the labels under the bars
        //.attr('y', (d, i) => -inputEnergy[i] + 30) // Position the labels just below the bars
        .attr('y', (d, i) => 120)
        .text((d) => d)
        .attr('font-size', '5px')
        .attr('text-anchor', 'middle');*/
      inputG
        .append('g')
        .call(d3.axisLeft(y).tickFormat((d) => d.valueOf().toPrecision(2)))
        .attr('transform', 'translate(-10,0)')
        .attr('font-size', '10px');

      var x = d3
        .scaleBand()
        .range([35, 385])
        .domain(
          inputLabels.map(function (d, i) {
            return `${d}   :  ${inputEnergy[i] > 100 ? inputEnergy[i].toPrecision(4) : inputEnergy[i].toFixed(3)}`;
          })
        )
        .padding(0.2);

      inputSvg
        .append('g')
        .attr('transform', 'translate(0,' + 100 + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .attr('font-size', '10px');
    }
  }, [flow]);

  useEffect(() => {
    var margin = { top: 30, right: 30, bottom: 70, left: 60 };

    if (chartOutput.current) {
      d3.select(chartOutput.current).selectAll('*').remove();

      //Create a Bar Graph With FOllow Labels
      // Total Temperature Energy -> flow.total_temperature
      // Total Pressure Energy -> flow.total_pressure
      // Total Energy -> flow.total_pressure + flow.total_temperature
      // Kinetic Energy -> 1/2*(flow.Mach * flow.sound_speed)^2
      // Static Pressure Energy -> flow.static_pressure
      // Static Temperature Energy -> flow.static_temperature

      const inputEnergy = [
        outputFlow.TotalTemp * outputFlow.Cv,
        (outputFlow.TotalPressure / outputFlow.Density) *
          outputFlow.DensityRatio,
        outputFlow.Enthalpy * 1000,
        0.5 * outputFlow.Velocity ** 2,
        outputFlow.Pressure / outputFlow.Density,
        outputFlow.Temp * outputFlow.Cv,
        0.5 * outputFlow.Velocity ** 2 +
          outputFlow.Pressure / outputFlow.Density +
          outputFlow.Temp * outputFlow.Cv,
      ];

      const inputLabels = ['TT', 'TP', 'Energy', 'KE', 'SP', 'ST', 'TE'];

      const inputColor = d3.scaleOrdinal(d3.schemeCategory10);

      const inputSvg = d3
        .select(chartOutput.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 400 180');

      console.log(inputEnergy);

      const inputG = inputSvg.append('g').attr('transform', 'translate(50,0)'); // Adjust the translate values here

      var y = d3.scaleLinear().domain([0, inputEnergy[2]]).range([100, 0]);

      const bars = inputG
        .selectAll('rect')
        .data(inputEnergy)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 50)
        .attr('y', (d) => y(d)) // Use 500 - d to draw bars upwards
        .attr('width', 20)
        .attr(
          'height',
          (d) => 100 - y(d)
          //(d) => (d * 500) / 1.1 / (flow.TotalTemp + flow.TotalPressure)
        )
        //@ts-ignore
        .attr('fill', (d, i) => inputColor(i));

      /*const labels = inputG
        .selectAll('text')
        .data(inputLabels)
        .enter()
        .append('text')
        .attr('x', (d, i) => i * 50 + 10) // Center the labels under the bars
        //.attr('y', (d, i) => -inputEnergy[i] + 30) // Position the labels just below the bars
        .attr('y', (d, i) => 120)
        .text((d) => d)
        .attr('font-size', '5px')
        .attr('text-anchor', 'middle');*/
      inputG
        .append('g')
        .call(d3.axisLeft(y).tickFormat((d) => d.valueOf().toPrecision(2)))
        .attr('transform', 'translate(-10,0)')
        .attr('font-size', '10px');

      var x = d3
        .scaleBand()
        .range([35, 385])
        .domain(
          inputLabels.map(function (d, i) {
            return `${d}   :  ${inputEnergy[i] > 100 ? inputEnergy[i].toPrecision(4) : inputEnergy[i].toFixed(3)}`;
          })
        )
        .padding(0.2);

      inputSvg
        .append('g')
        .attr('transform', 'translate(0,' + 100 + ')')
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .attr('font-size', '10px');
    }
  }, [outputFlow]);

  const transformSameValue = (value: number) => {
    //Limit to 3 decimals or NaN
    return isNaN(value) ? 'NaN' : value.toFixed(3);
  };
  // Any Changes in the input flow, turbomachine, efficiency setting, efficiency, or pressure ratio will trigger changes in output flow

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
        const turbine = new Turbine(efficiency, null, pressureRatio, 0);
        setOutputFlow(turbine.expandFlow(flow));
      } else {
        const turbine = new Turbine(null, efficiency, pressureRatio, 0);
        setOutputFlow(turbine.expandFlow(flow));
      }
    }
  }, [flow, turbomachine, efficiencySetting, efficiency, pressureRatio]);

  //Later Add Graphs of Isentropic Efficiency vs. Ideal Isentropic Efficiency

  return (
    <div className="flex flex-col flex-wrap md:flex-row md:justify-between">
      <div className="w-full text-center p-10 text-3xl">
        Turbomachine Analysis
      </div>
      <div className="md:w-1/3 p-2">
        <label className="block">Mach Constraint</label>
        <input
          type="number"
          className="w-full p-2 border rounded mt-1"
          step="0.01"
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
            setPressureOption(e.target.value);
          }}
          value={pressureOption}
        >
          <option>Static Pressure</option>
          <option>Total Pressure</option>
        </select>
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
            <label>Pressure Ratio</label>
            <input
              className="w-3/4"
              type="number"
              value={pressureRatio}
              onChange={(e) => setPressureRatio(Number(e.target.value))}
            />
          </div>
        </form>
      </div>
      <div className="w-full flex">
        <div ref={chartInput} className="w-full"></div>
        <div ref={chartOutput} className="w-full"></div>
      </div>
      <div className="w-full flex flex-wrap">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ...Object.getOwnPropertyNames(outputFlow),
            ...Object.getOwnPropertyNames(Object.getPrototypeOf(outputFlow)),
          ].map((key) => (
            <div
              key={key}
              className="border p-4 flex flex-col items-center justify-center"
            >
              <label className="font-bold">{key}</label>
              <div>
                {
                  //@ts-ignore
                  transformSameValue(outputFlow[key])
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
