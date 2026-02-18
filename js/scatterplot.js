class Scatterplot {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 600,
      margin: _config.margin || { top: 25, right: 20, bottom: 20, left: 35 },
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
        .range([0, vis.height]);


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

        vis.colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
    vis.colorPalette.domain("Africa", "Asia", "North America", "South America", "Europe", "Oceania")

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
          .attr('r', 4);

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
              <ul>
                <li>HRI: ${d.hri}</li>
                <li>SR: ${d.rate}</li>
              </ul>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

  }
}
