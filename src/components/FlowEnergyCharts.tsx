import Flow from '@/utils/Flow';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type FlowDisplayProps = {
  flow: Flow;
  output_pressure?: number;
};

export default function FlowDisplay(props: FlowDisplayProps) {
  const { flow } = props;

  //Will It Re-Render On Each Change - Essentiall
  // But It was doing this anyway

  const chartInput = useRef(null);

  if (chartInput.current) {
    d3.select(chartInput.current).selectAll('*').remove();

    const inputEnergy = [
      flow.TotalTemp * flow.Cv,
      // (flow.TotalPressure / flow.Density) * flow.DensityRatio,
      flow.expansionToPressurePE(props.output_pressure || 0),
      flow.Enthalpy,
      0.5 * flow.Velocity ** 2,
      flow.Pressure / flow.Density,
      flow.Temp * flow.Cv,
      0.5 * flow.Velocity ** 2 +
        flow.Pressure / flow.Density +
        flow.Temp * flow.Cv,
    ];

    const inputLabels = ['TT', 'Exp. W ', 'Energy', 'KE', 'SP', 'ST', 'TE'];

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

  return <div ref={chartInput}></div>;
}
