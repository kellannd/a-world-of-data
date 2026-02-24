class Choropleth {
  constructor(_config, _data, _choroplethType) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 675,
      containerHeight: _config.containerHeight || 600,
      margin: _config.margin || { top: 50, right: 20, bottom: 20, left: 35 },
      tooltipPadding: _config.tooltipPadding || 15,
      legendBottom: 200,
      legendLeft: 20,
      legendRectHeight: 12,
      legendRectWidth: 100,
    };
    this.data = _data;
    this.choroplethType = _choroplethType;
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

    vis.projection = d3.geoMercator();
    vis.geoPath = d3.geoPath().projection(vis.projection);

    vis.projection.fitSize([vis.width, vis.height], vis.data);

    //vis.projection.scale(vis.projection.scale() * 1.3);

    vis.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "map-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", vis.width)
      .attr("height", vis.height - 150);

    vis.chart.attr("clip-path", "url(#map-clip)");
    vis.colorScale = d3
      .scaleLinear()
      .range(["#ffe4e1", "#8b0000"])
      .interpolate(d3.interpolateHcl);

    vis.linearGradient = vis.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient");

    // Append legend
    vis.legend = vis.chart
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${vis.config.legendLeft},${vis.height - vis.config.legendBottom})`,
      );

    vis.legendRect = vis.legend
      .append("rect")
      .attr("width", vis.config.legendRectWidth)
      .attr("height", vis.config.legendRectHeight);

    if (vis.choroplethType == "choroplethHri") {
      vis.legendTitle = vis.legend
        .append("text")
        .attr("class", "legend-title")
        .attr("dy", ".35em")
        .attr("y", -10)
        .text("Human Rights Index");

      vis.title = vis.svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", vis.config.containerWidth / 2)
        .attr("y", vis.config.margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Human Rights Index");
    } else {
      vis.legendTitle = vis.legend
        .append("text")
        .attr("class", "legend-title")
        .attr("dy", ".35em")
        .attr("y", -10)
        .text("Suicide Rate");

      vis.title = vis.svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", vis.config.containerWidth / 2)
        .attr("y", vis.config.margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Suicide Rate per 100,000 People");
    }

    vis.updateVis(vis.data, vis.choroplethType);
  }

  updateVis(data, choroplethType) {
    let vis = this;

    vis.choroplethType = choroplethType;

    vis.data = data;

    let valueMap;
    if (vis.choroplethType == "choroplethHri") {
      valueMap = new Map(data.features.map((d) => [d.id, +d.hri]));

      vis.colorScale.domain([0, d3.max(Array.from(valueMap.values()))]);

      vis.legendStops = [
        { color: "#ffe4e1", value: 0, offset: 0 },
        { color: "#8b0000", value: 1, offset: 100 },
      ];

      vis.chart
        .selectAll("path")
        .data(vis.data.features)
        .join("path")
        .attr("d", vis.geoPath)
        .attr("fill", (d) => {
          const value = valueMap.get(d.id);
          return value ? vis.colorScale(value) : "#eee";
        })
        .attr("stroke", "#999")
        .attr("stroke-width", 0.5)

        .on("mouseover", (event, d) => {
          d3
            .select("#tooltip")
            .style("display", "block")
            .style("left", event.pageX + vis.config.tooltipPadding + "px")
            .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
              <div class="tooltip-title">${d.properties.name}</div>
                <p>HRI: ${d.hri.toFixed(2)}</p>
            `);
        })
        .on("mouseleave", () => {
          d3.select("#tooltip").style("display", "none");
        });
    } else if (vis.choroplethType == "choroplethSr") {
      valueMap = new Map(data.features.map((d) => [d.id, +d.sr]));
      vis.colorScale.domain([0, d3.max(Array.from(valueMap.values()))]);

      vis.legendStops = [
        {
          color: "#ffe4e1",
          value: d3.min(Array.from(valueMap.values())),
          offset: 0,
        },
        {
          color: "#8b0000",
          value: d3.max(Array.from(valueMap.values())),
          offset: 100,
        },
      ];

      vis.chart
        .selectAll("path")
        .data(vis.data.features)
        .join("path")
        .attr("d", vis.geoPath)
        .attr("fill", (d) => {
          const value = valueMap.get(d.id);
          return value ? vis.colorScale(value) : "#eee";
          console.log(d);
        })
        .attr("stroke", "#999")
        .attr("stroke-width", 0.5)

        .on("mouseover", (event, d) => {
          d3
            .select("#tooltip")
            .style("display", "block")
            .style("left", event.pageX + vis.config.tooltipPadding + "px")
            .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
              <div class="tooltip-title">${d.properties.name}</div>
                <p>SR: ${d.sr.toFixed(2)}</lp>
            `);
        })
        .on("mouseleave", () => {
          d3.select("#tooltip").style("display", "none");
        });
    }

    vis.legend
      .selectAll(".legend-label")
      .data(vis.legendStops)
      .join("text")
      .attr("class", "legend-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("y", 20)
      .attr("x", (d, index) => {
        return index == 0 ? 0 : vis.config.legendRectWidth;
      })
      .text((d) => Math.round(d.value * 10) / 10);

    // Update gradient for legend
    vis.linearGradient
      .selectAll("stop")
      .data(vis.legendStops)
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    vis.legendRect.attr("fill", "url(#legend-gradient)");
  }
}
