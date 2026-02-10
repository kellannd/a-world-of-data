class Line {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 25, right: 20, bottom: 20, left: 35 },
    };
    this.data = _data;
    this.initVis();
  }

  initVis() {
    let vis = this;
    // console.log(vis.data);

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

    vis.xScale = d3
      .scaleLinear()
      .domain(d3.extent(vis.data, (d) => d.Year))
      .range([0, vis.width]);

    vis.yScale = d3
      .scaleLinear()
      //   .domain(d3.extent(vis.data, (d) => d.hri))
      .domain([0, 1])
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

    vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
    vis.colorPalette.domain("Africa", "Asia", "North America", "South America", "Europe", "Oceania")

    vis.updateVis(vis.data)
  }

  updateVis(data){
    let vis = this
    if(data){
        vis.data = data
    }

    vis.line = d3
      .line()
      .x((d) => vis.xScale(d.Year))
      .y((d) => vis.yScale(d.hri));

    vis.groupedData = d3.groups(vis.data, (d) => d.Entity );

    vis.groupedData.forEach(([_, values]) => {
      values.sort((a, b) => d3.ascending(a.Year, b.Year));
    });

    // console.log(vis.groupedData);

    vis.chart
      .selectAll(".line-path")
      .data(vis.groupedData)
      .join("path")
      .attr("class", "line-path")
      .attr("fill", "none")
      .attr("stroke", (d) => vis.colorPalette(d[1][0].region))
      .attr("stroke-width", 2)
      .attr("d", (d) => vis.line(d[1]));
  }
}
