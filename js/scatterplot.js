class Scatterplot {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 600,
      margin: _config.margin || { top: 80, right: 20, bottom: 50, left: 50 },
      tooltipPadding: _config.tooltipPadding || 15
    };
    this.data = _data;
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

    vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight)

      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

      // Initialize linear and ordinal scales (input domain and output range)
      vis.xScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, (d) => d.rate))
        .range([0, vis.width]);


      vis.yScale = d3.scaleLinear()
        .domain([0,1])
        .range([vis.height, 0]);


        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);


        // Draw the axis
        vis.xAxisGroup = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr("transform", `translate(0,${vis.height})`)
          .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
          .attr('class', 'axis y-axis')
          .call(vis.yAxis);

        //vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
        //vis.colorPalette = d3.scaleOrdinal()
    vis.colorPalette = d3.scaleOrdinal().domain(["Africa", "Asia", "North America", "South America", "Europe", "Oceania"]).range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"])

    vis.chart.append("text")
    .attr("class", "x label")
    // Position at the bottom center of the chart area
    .attr("x", vis.width / 2)
    .attr("y", vis.height + vis.config.margin.bottom / 2 + 10) // Adjust y as needed for spacing
    .attr("text-anchor", "middle") // Centers the text at the x position
    .text("Suicide Rate per 100,000"); // The label text

     vis.chart.append("text")
    .attr("class", "y label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - vis.config.margin.left)
    .attr("x", 0 - (vis.height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Human Rights Index");

    vis.title = vis.svg.append("text")
  .attr("class", "chart-title")
  .attr("x", vis.config.containerWidth / 2)
  .attr("y", vis.config.margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .text("Suicide Rate per 100,000 people vs Human Rights Index");

  // legend
vis.legend = vis.svg.append("g")
  .attr("class", "legend")
  .attr(
    "transform",
    `translate(${vis.config.containerWidth - vis.config.margin.right - 100},
               ${vis.config.margin.top + 300})`
  );

  const legendItemHeight = 18;

vis.legendItems = vis.legend.selectAll(".legend-item")
  .data(vis.colorPalette.domain())
  .join("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * legendItemHeight})`);

  vis.legendItems.append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 6)
  .attr("fill", d => vis.colorPalette(d));

  vis.legendItems.append("text")
  .attr("x", 12)
  .attr("y", 4)
  .style("font-size", "16px")
  .text(d => d);

        vis.updateVis()
  }

  updateVis(data) {
    let vis = this;

    if(data){
        vis.data = data
    }

    // Domains
    vis.xScale.domain([0,50]);
    vis.yScale.domain(d3.extent(vis.data, (d) => d.hri));

    vis.circles = vis.chart.selectAll('circle')
          .data(vis.data)
          .join('circle')
         .attr('fill', (d) => vis.colorPalette(d.region) )
          .attr('opacity', .8)
          .attr('stroke-width', 2)
          .attr('cy', (d) => vis.yScale(d.hri) )
          .attr('cx',(d) =>  vis.xScale(d.rate) )
          .attr('r', 10);

    // Axes update
    vis.xAxisGroup.call(vis.xAxis);
    vis.yAxisGroup.call(vis.yAxis);

    vis.circles
          .on('mouseover', (event,d) => {
            console.log("mouse over! ");
            console.log(event);
            console.log(d);

          d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
              <div class="tooltip-title">${d.Entity}</div>

                <p>Human Rights Index: ${d.hri.toFixed(2)}</p>
                <p>Sucide Rate: ${d.rate.toFixed(2)}</p>

            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

  }
}
