let data, line, countries, scatterplot, histogramHri, histogramSr, worldMap;

d3.csv("data/countries.csv")
  .then((_data) => {
    countries = _data;

    let container = document.getElementById("scrollbox");
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].Code) {
        const div = document.createElement("div");
        div.id = "item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = countries[i].Code;
        checkbox.name = countries[i].Code;
        if (countries[i].Code == "USA") {
          checkbox.checked = true;
        }

        const label = document.createElement("label");
        label.htmlFor = countries[i].Code;
        label.textContent = countries[i].Entity;

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
      }
    }

    document
      .querySelectorAll("#scrollbox input[type=checkbox]")
      .forEach((cb) => {
        cb.addEventListener("change", () => {
          const selected = getSelectedCountries();

          const filteredData = data.filter((d) => selected.includes(d.Code));

          line.updateVis(filteredData);
        });
      });
  })
  .catch((error) => console.error(error));

  Promise.all([
  d3.csv('data/merged_data.csv'),
  d3.json('data/world.json')
]).then(_data => {
    data = _data[0]
    worldMap = _data[1]

    data.forEach((d) => {
      d.Year = +d.Year;
      d.hri = +d.hri;
      d.rate = +d.rate;
    });

    let selected = getSelectedCountries();
    const filteredData = data.filter((d) => selected.includes(d.Code));

    // line graph
    line = new Line({ parentElement: "#line" }, filteredData);

    // scatterplot
    yearDropdown("scatterplot");
    let scatterplotYear = getSelectedYear("scatterplot");
    const scatterplotData = data.filter((d) => scatterplotYear.includes(d.Year));
    scatterplot = new Scatterplot(
      { parentElement: "#scatterplot" },
      scatterplotData,
    );

    // histogram
    yearDropdown("histogram")
    let histogramYear = getSelectedYear("histogram")
    const histogramData = data.filter((d) => histogramYear.includes(d.Year))
    console.log(histogramData)
    histogramHri = new Histogram(
      { parentElement: "#histogramHri" },
      histogramData,
      "histogramHri"
    )

    histogramSr = new Histogram({parentElement: "#histogramSr"}, histogramData, "histogramSr")

    // choropleth

  })
  .catch((error) => console.error(error));

function getSelectedCountries() {
  return Array.from(
    document.querySelectorAll("#scrollbox input[type=checkbox]:checked"),
  ).map((cb) => cb.id);
}

let years = [
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
];

function yearDropdown(graph) {
  let container = document.getElementById("year-dropdown-" + graph);
  for (let i = 0; i < years.length; i++) {
    const option = document.createElement("option");
    option.value = years[i];
    option.textContent = years[i];
    if (years[i] == "2021") {
      option.selected = true;
    }

    container.appendChild(option);
  }

  if(graph == "scatterplot"){
    let element = document.getElementById("year-dropdown-" + graph);
  element.addEventListener("change", () => {
    const getSelectedYear = element.value;

    const filteredData = data.filter((d) => getSelectedYear.includes(d.Year));

    scatterplot.updateVis(filteredData);
  });
  } else if( graph == "histogram") {
    let element = document.getElementById("year-dropdown-" + graph);
  element.addEventListener("change", () => {
    const getSelectedYear = element.value;

    const filteredData = data.filter((d) => getSelectedYear.includes(d.Year));

    histogramHri.updateVis(filteredData, "histogramHri");
    histogramSr.updateVis(filteredData, "histogramSr")
  });
  }
}

function getSelectedYear(graph) {
  return document.getElementById("year-dropdown-" + graph).value;
}
