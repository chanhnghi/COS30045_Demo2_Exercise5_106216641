function drawLineChart(data) {
  const { inner, innerWidth, innerHeight } = createChartFrame(
    "#line-chart",
    "Line chart and scatter points showing Australian average spot electricity prices from 1998 to 2024",
    "line"
  );
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice) * 1.1])
    .nice()
    .range([innerHeight, 0]);

  inner.append("g").attr("class", "grid")
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-innerWidth).tickFormat(""));
  inner.append("g").attr("class", "axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(9).tickFormat(d3.format("d")));
  inner.append("g").attr("class", "axis").call(d3.axisLeft(yScale).ticks(6));
  inner.append("text").attr("class", "axis-label")
    .attr("x", innerWidth / 2).attr("y", innerHeight + 58)
    .attr("text-anchor", "middle").text("Year");
  inner.append("text").attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2).attr("y", -66)
    .attr("text-anchor", "middle").text("Average price (AUD/MWh)");

  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));
  inner.append("path")
    .datum(data)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "#1b746a")
    .attr("stroke-width", 3);
  inner.selectAll("circle.line-point")
    .data(data)
    .join("circle")
    .attr("class", "line-point")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.averagePrice))
    .attr("r", 5)
    .append("title")
    .text(d => `${d.year}: $${d.averagePrice.toFixed(1)} per MWh`);
}

d3.csv("data/ARE_Spot_Prices.csv", d => ({
  year: +d.Year,
  averagePrice: +d["Average Price (notTas-Snowy)"]
})).then(data => {
  const valid = data.filter(d => Number.isFinite(d.year) && Number.isFinite(d.averagePrice));
  valid.sort((a, b) => a.year - b.year);
  console.log("Exercise 5.2: annual spot prices", valid);
  drawLineChart(valid);
}).catch(error => showChartError("#line-status", error));
