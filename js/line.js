class Line {
  constructor(_config, _data, _graphType) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 25, right: 20, bottom: 50, left: 50 },
      tooltipPadding: _config.tooltipPadding || 15,
    };
    this.data = _data;
    this.graphType = _graphType;
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

    if (vis.graphType == "lineHri") {
      vis.yScale = d3
        .scaleLinear()
        //   .domain(d3.extent(vis.data, (d) => d.hri))
        .domain([0.0, 1.0])
        .range([vis.height, 0]);
    } else if (vis.graphType == "lineSr") {
      vis.yScale = d3
        .scaleLinear()
        //   .domain(d3.extent(vis.data, (d) => d.hri))
        .domain([0, 50])
        .range([vis.height, 0]);
    }

    vis.xAxis = d3.axisBottom(vis.xScale).tickFormat(d3.format("d"));
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

    // vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
    // vis.colorPalette.domain("Africa", "Asia", "North America", "South America", "Europe", "Oceania")
    vis.colorPalette = d3
      .scaleOrdinal()
      .domain([
        "Africa",
        "Asia",
        "North America",
        "South America",
        "Europe",
        "Oceania",
      ])
      .range([
        "#1b9e77",
        "#d95f02",
        "#7570b3",
        "#e7298a",
        "#66a61e",
        "#e6ab02",
      ]);

    vis.legendSvg = d3
      .select("#line-graph-legend")
      .attr("width", vis.config.containerWidth + 100)
      .attr("height", vis.config.margin.top);

    vis.legend = vis.legendSvg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${vis.config.margin.left}, ${vis.config.margin.top / 2})`,
      );

    const legendItemSpacing = 90;

    vis.legendItems = vis.legend
      .selectAll(".legend-item")
      .data(vis.colorPalette.domain())
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(${i * legendItemSpacing}, 0)`);

    vis.legendItems
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 6)
      .attr("fill", (d) => vis.colorPalette(d));

    vis.legendItems
      .append("text")
      .attr("x", 12)
      .attr("y", 4)
      .style("font-size", "16px")
      .text((d) => d);

    let xOffset = 0;
    const padding = 20;
    vis.legendItems.each(function () {
      const item = d3.select(this);
      const textWidth = item.select("text").node().getBBox().width;
      const itemWidth = 12 + textWidth + padding;

      item.attr("transform", `translate(${xOffset}, 0)`);
      xOffset += itemWidth;
    });

    vis.updateVis(vis.data, vis.graphType);
  }

  updateVis(data, graphType) {
    let vis = this;
    if (data) {
      vis.data = data;
    }

    vis.graphType = graphType;

    console.log(vis.graphType);

    if (graphType == "lineHri") {
      vis.line = d3
        .line()
        .x((d) => vis.xScale(d.Year))
        .y((d) => vis.yScale(d.hri));

      vis.chart
        .append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.config.margin.left)
        .attr("x", 0 - vis.height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Human Rights Index");
    } else if (graphType == "lineSr") {
      vis.line = d3
        .line()
        .x((d) => vis.xScale(d.Year))
        .y((d) => vis.yScale(d.rate));

      vis.chart
        .append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.config.margin.left)
        .attr("x", 0 - vis.height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Suicide Rate per 100,000");
    }

    vis.chart
      .append("text")
      .attr("class", "x label")
      .attr("x", vis.width / 2)
      .attr("y", vis.height + vis.config.margin.bottom / 2 + 10) // Adjust y as needed for spacing
      .attr("text-anchor", "middle") // Centers the text at the x position
      .text("Year"); // The label text

    vis.groupedData = d3.groups(vis.data, (d) => d.Entity);

    vis.groupedData.forEach(([_, values]) => {
      values.sort((a, b) => d3.ascending(a.Year, b.Year));
    });

    vis.chart
      .selectAll(".line-path")
      .data(vis.groupedData)
      .join("path")
      .attr("class", "line-path")
      .attr("fill", "none")
      .attr("stroke", (d) => vis.colorPalette(d[1][0].region))
      .attr("stroke-width", 2)
      .attr("d", (d) => vis.line(d[1]));

    const pointData = vis.groupedData.flatMap(([entity, values]) =>
      values.map((d) => ({
        ...d,
        entity,
      })),
    );

    vis.pointsLayer = vis.chart
      .selectAll(".points-layer")
      .data([null])
      .join("g")
      .attr("class", "points-layer");

    console.log(pointData);

    vis.pointsLayer
      .selectAll("circle")
      .data(pointData, (d) => `${d.entity}-${d.Year}`)
      .join("circle")
      .attr("cx", (d) => vis.xScale(d.Year))
      .attr("cy", (d) => {
        return vis.graphType === "lineHri"
          ? vis.yScale(d.hri)
          : vis.yScale(d.rate);
      })
      .attr("r", 5)
      .attr("fill", (d) => vis.colorPalette(d.region))
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        console.log("mouse over! ");
        console.log(event);
        console.log(d);

        d3
          .select("#tooltip")
          .style("display", "block")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
              <div class="tooltip-title">${d.Entity}</div>
              <ul>
                <li>HRI: ${d.hri}</li>
                <li>SR: ${d.rate}</li>
              </ul>
            `);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      });
  }
}
