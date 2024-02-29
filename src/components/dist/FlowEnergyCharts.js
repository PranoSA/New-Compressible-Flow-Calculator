"use strict";
exports.__esModule = true;
var react_1 = require("react");
var d3 = require("d3");
function FlowDisplay(props) {
    var flow = props.flow;
    //Will It Re-Render On Each Change - Essentiall
    // But It was doing this anyway
    var chartInput = react_1.useRef(null);
    if (chartInput.current) {
        d3.select(chartInput.current).selectAll('*').remove();
        var inputEnergy_1 = [
            flow.TotalTemp * flow.Cv,
            // (flow.TotalPressure / flow.Density) * flow.DensityRatio,
            flow.expansionToPressurePE(props.output_pressure || 0),
            flow.Enthalpy,
            0.5 * Math.pow(flow.Velocity, 2),
            flow.Pressure / flow.Density,
            flow.Temp * flow.Cv,
            0.5 * Math.pow(flow.Velocity, 2) +
                flow.Pressure / flow.Density +
                flow.Temp * flow.Cv,
        ];
        var inputLabels = ['TT', 'Exp. W ', 'Energy', 'KE', 'SP', 'ST', 'TE'];
        var inputColor_1 = d3.scaleOrdinal(d3.schemeCategory10);
        var inputSvg = d3
            .select(chartInput.current)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 400 180');
        console.log(inputEnergy_1);
        var inputG = inputSvg.append('g').attr('transform', 'translate(50,0)'); // Adjust the translate values here
        var y = d3.scaleLinear().domain([0, inputEnergy_1[2]]).range([100, 0]);
        var bars = inputG
            .selectAll('rect')
            .data(inputEnergy_1)
            .enter()
            .append('rect')
            .attr('x', function (d, i) { return i * 50; })
            .attr('y', function (d) { return y(d); }) // Use 500 - d to draw bars upwards
            .attr('width', 20)
            .attr('height', function (d) { return 100 - y(d); }
        //(d) => (d * 500) / 1.1 / (flow.TotalTemp + flow.TotalPressure)
        )
            //@ts-ignore
            .attr('fill', function (d, i) { return inputColor_1(i); });
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
            .call(d3.axisLeft(y).tickFormat(function (d) { return d.valueOf().toPrecision(2); }))
            .attr('transform', 'translate(-10,0)')
            .attr('font-size', '10px');
        var x = d3
            .scaleBand()
            .range([35, 385])
            .domain(inputLabels.map(function (d, i) {
            return d + "   :  " + (inputEnergy_1[i] > 100 ? inputEnergy_1[i].toPrecision(4) : inputEnergy_1[i].toFixed(3));
        }))
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
    return react_1["default"].createElement("div", { ref: chartInput });
}
exports["default"] = FlowDisplay;
