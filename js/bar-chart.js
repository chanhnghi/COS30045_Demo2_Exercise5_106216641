function drawBarChart(data) {
  const { inner, innerWidth, innerHeight } = createChartFrame(
    "#bar-chart",
    "Vertical bar chart comparing mean annual energy use of 55-inch LCD, LED and OLED televisions"
  );
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screenTech))
    .range([0, innerWidth])
    .padding(0.28);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.meanEnergyConsumption) * 1.18])
    .nice()
    .range([innerHeight, 0]);

  inner.append("g").attr("class", "grid")
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerWidth).tickFormat(""));
  inner.append("g").attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0));
  inner.append("g").attr("class", "axis").call(d3.axisLeft(yScale).ticks(6));
  inner.append("text").attr("class", "axis-label")
    .attr("x", innerWidth / 2).attr("y", innerHeight + 58)
    .attr("text-anchor", "middle").text("Screen technology");
  inner.append("text").attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2).attr("y", -58)
    .attr("text-anchor", "middle").text("Mean annual energy use (kWh)");

  inner.selectAll("rect.bar")
    .data(data, d => d.screenTech)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.screenTech))
    .attr("y", d => yScale(d.meanEnergyConsumption))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.meanEnergyConsumption))
    .attr("fill", "#389482");
  inner.selectAll("text.bar-label")
    .data(data)
    .join("text")
    .attr("class", "bar-label")
    .attr("x", d => xScale(d.screenTech) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.meanEnergyConsumption) - 9)
    .text(d => d.meanEnergyConsumption.toFixed(1));
}

d3.csv("data/tv-55-inch-screen-type.csv", d => ({
  screenTech: d.screenTech.trim(),
  meanEnergyConsumption: +d.meanEnergyConsumption,
  models: +d.models
})).then(data => {
  data.sort((a, b) => b.meanEnergyConsumption - a.meanEnergyConsumption);
  console.log("Exercise 5.1: mean energy by type for 55-inch TVs", data);
  drawBarChart(data);
}).catch(error => showChartError("#bar-status", error));
