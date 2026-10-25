function drawDonutChart(data) {
  const width = 600;
  const height = 360;
  const radius = 145;
  const total = d3.sum(data, d => d.count);
  const svg = d3.select("#donut-chart").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Donut chart of small, medium and large television model counts");
  const chart = svg.append("g").attr("transform", "translate(184,180)");
  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.sizeGroup))
    .range(["#65b7a1", "#e8aa61", "#5477b2"]);
  const pie = d3.pie().sort(null).value(d => d.count);
  const arc = d3.arc().innerRadius(radius * 0.59).outerRadius(radius).padAngle(0.018).cornerRadius(5);
  const slices = chart.selectAll("g.slice")
    .data(pie(data))
    .join("g")
    .attr("class", "slice");
  slices.append("path")
    .attr("d", arc)
    .attr("fill", d => colorScale(d.data.sizeGroup))
    .append("title")
    .text(d => `${d.data.sizeGroup}: ${d.data.count.toLocaleString()} TVs`);
  slices.append("text")
    .attr("class", "donut-label")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .text(d => `${Math.round(d.data.count / total * 100)}%`);
  chart.append("text").attr("text-anchor", "middle").attr("dy", "-.1em")
    .attr("font-size", 34).attr("font-weight", "800").attr("fill", "#184138")
    .text(total.toLocaleString());
  chart.append("text").attr("text-anchor", "middle").attr("dy", "1.5em")
    .attr("font-size", 20).attr("fill", "#5e756c").text("TV models");

  const legend = svg.append("g").attr("transform", "translate(348,118)");
  const items = legend.selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${i * 48})`);
  items.append("rect").attr("width", 20).attr("height", 20).attr("rx", 4)
    .attr("fill", d => colorScale(d.sizeGroup));
  items.append("text").attr("x", 30).attr("y", 16)
    .attr("font-size", 20).attr("fill", "#315b50")
    .text(d => `${d.sizeGroup} · ${d.count.toLocaleString()}`);
}

d3.csv("data/tv-screen-size-groups.csv", d => ({
  sizeGroup: d.sizeGroup.trim(),
  count: +d.count
})).then(data => {
  console.log("Exercise 5.3: TV screen-size groups", data);
  drawDonutChart(data);
}).catch(error => showChartError("#donut-status", error));
