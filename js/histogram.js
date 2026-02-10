class Histogram {
  constructor(_config, _data, _histogramType) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 25, right: 20, bottom: 20, left: 35 },
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


    vis.updateVis(vis.data);
  }

  updateVis(data, histogramType) {
    let vis = this;

    vis.histogramType = histogramType

    if (data) {
      vis.data = data;
    }

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
  }
}
