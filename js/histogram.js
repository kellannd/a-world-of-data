class Histogram {
  constructor(_config, _data, _histogramType) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 40, right: 20, bottom: 50, left: 50 },
    };
    this.data = _data;
    this.histogramType = _histogramType;
    this.initVis();
  }

  initVis() {
    let vis = this;

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

    if(vis.histogramType === "histogramHri") {
      vis.title = vis.svg.append("text")
  .attr("class", "chart-title")
  .attr("x", vis.config.containerWidth / 2)
  .attr("y", vis.config.margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .text("Human Rights Index vs Number of Countries");
    } else if (vis.histogramType === "histogramSr") {
      vis.title = vis.svg.append("text")
  .attr("class", "chart-title")
  .attr("x", vis.config.containerWidth / 2)
  .attr("y", vis.config.margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .text("Suicide Rate per 100,000 people vs Number of Countries");
    }

    vis.updateVis(vis.data, vis.histogramType);
  }

  updateVis(data, histogramType) {
    let vis = this;

    vis.histogramType = histogramType;

    vis.data = data;

    vis.chart.selectAll("*").remove();

    if (vis.histogramType == "histogramHri") {
      vis.bin = d3
        .bin()
        .thresholds(50)
        .value((d) => d.hri);
      vis.bins = vis.bin(vis.data);
    } else {
      vis.bin = d3
        .bin()
        .thresholds(50)
        .value((d) => d.rate);

      vis.bins = vis.bin(vis.data);
    }

    vis.xScale = d3
      .scaleLinear()
      .domain([d3.min(vis.bins, (d) => d.x0), d3.max(vis.bins, (d) => d.x1)])
      .range([0, vis.width]);

    vis.yScale = d3
      .scaleLinear()
      .domain([0, d3.max(vis.bins, (d) => d.length)])
      .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale);

    // X axis group (top)
    vis.xAxisGroup = vis.chart
      .append("g")
      .attr("transform", `translate(0,${vis.height})`)
      .call(vis.xAxis);

    // Y axis group (left)
    vis.yAxisGroup = vis.chart
      .append("g")
      .attr("class", "y-axis")
      .call(vis.yAxis);

    vis.chart
      .append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(vis.bins)
      .join("rect")
      .attr("x", (d) => vis.xScale(d.x0) + 1)
      .attr("width", (d) => vis.xScale(d.x1) - vis.xScale(d.x0) - 1)
      .attr("y", (d) => vis.yScale(d.length))
      .attr("height", (d) => vis.yScale(0) - vis.yScale(d.length));

    if(vis.histogramType === "histogramHri") {
vis.chart.append("text")
    .attr("class", "x label")
    // Position at the bottom center of the chart area
    .attr("x", vis.width / 2)
    .attr("y", vis.height + vis.config.margin.bottom / 2 + 10) // Adjust y as needed for spacing
    .attr("text-anchor", "middle") // Centers the text at the x position
    .text("Human Rights Index"); // The label text
    } else if (vis.histogramType === "histogramSr") {
      vis.chart.append("text")
    .attr("class", "x label")
    // Position at the bottom center of the chart area
    .attr("x", vis.width / 2)
    .attr("y", vis.height + vis.config.margin.bottom / 2 + 10) // Adjust y as needed for spacing
    .attr("text-anchor", "middle") // Centers the text at the x position
    .text("Suicide Rate"); // The label text
    }

    vis.chart.append("text")
    .attr("class", "y label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - vis.config.margin.left)
    .attr("x", 0 - (vis.height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Countries");


  }
}
