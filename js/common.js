const chartSize = {
  width: 900,
  height: 500,
  margin: { top: 34, right: 42, bottom: 72, left: 88 }
};

function createChartFrame(selector, description) {
  const { width, height, margin } = chartSize;
  const svg = d3.select(selector).append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", description);
  const inner = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  return {
    svg,
    inner,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom
  };
}

function showChartError(selector, error) {
  document.querySelector(selector).textContent =
    "The data could not be loaded. Open this page through VS Code Live Server and reload it.";
  console.error(error);
}
