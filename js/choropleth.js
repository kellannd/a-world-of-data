class Choropleth {
  constructor(_config, _data, _choroplethType) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1200,
      containerHeight: _config.containerHeight || 600,
      margin: _config.margin || { top: 25, right: 20, bottom: 20, left: 35 },
    };
    this.data = _data;
    this.choroplethType = _choroplethType
    this.initVis();
  }

  initVis() {
    let vis = this

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`,
      );

    vis.projection = d3.geoMercator();
    vis.geoPath = d3.geoPath().projection(vis.projection);

    vis.colorScale = d3
      .scaleLinear()
      .range(["#cfe2f2", "#0d306b"])
      .interpolate(d3.interpolateHcl);

    vis.updateVis(vis.data, vis.choroplethType)
  }

  updateVis(data, choroplethType) {

    let vis = this;

    vis.choroplethType = choroplethType;

    vis.data = data

    let valueMap
    if(vis.choroplethType == "choroplethHri") {
        valueMap = new Map(
  data.features.map(d => [d.id, +d.hri])
);
    } else if(vis.choroplethType == "choroplethSr") {
        valueMap = new Map(
  data.features.map(d => [d.id, +d.sr])
);

console.log(valueMap)
    }

     vis.colorScale.domain([
    0,
    d3.max(Array.from(valueMap.values()))
  ]);

    vis.chart
  .selectAll("path")
  .data(vis.data.features)
  .join("path")
  .attr("d", vis.geoPath)
  .attr("fill", d => {
    const value = valueMap.get(d.id);
    return value ? vis.colorScale(value) : "#eee";
  })
  .attr("stroke", "#999")
  .attr("stroke-width", 0.5);
}}
