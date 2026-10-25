const chartSizes = {
  bar: { width: 600, height: 430, margin: { top: 42, right: 20, bottom: 76, left: 112 } },
  line: { width: 760, height: 510, margin: { top: 42, right: 24, bottom: 76, left: 94 } }
};

function createChartFrame(selector, description, kind) {
  const { width, height, margin } = chartSizes[kind];
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
