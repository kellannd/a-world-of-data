Video:

[Website Link](https://a-world-of-data.netlify.app/)

## Data
### Datasets
Both data sets came from Our World in Data.

#### [Human Rights Index](https://ourworldindata.org/grapher/human-rights-index-vdem?v=1&csvType=full&useColumnShortNames=false) - Datasource: V-Dem 2025

This is a dataset of the Human Rights Index, or HRI, from the years 1789 to 2024. The HRI is calculated by the extent that people of a country enjoy basic freedoms, are free from government torture, political killings, slavery, and property rights with an index range of 0 to 1.

#### [Death Rate from Suicide](https://ourworldindata.org/grapher/death-rate-from-suicides-gho?v=1&csvType=full&useColumnShortNames=false) - Datasource: World Health Organization 2024

This is a dataset of the suicide rate per 100,000 peopel by country from the years 2000 to 2021. This specific dataset is based on global sucide patterns and includes extrapolations to account for missing or underreported data.

Because I had a much smaller window of years to work with in my second dataset, the graphs made only range from the years 2000 to 2021 for this project.

## Sketches

## Visualization
The main view that the UI opens to is the scatterplot that compares the rate of suicide by the HRI. At the top, there are three other pages you can look at: histogram, choropleth, and line graph. There is also a drop down to select a year, which effects the scatterplot, histogram, and choropleth. If you change the year, all five of these graphs will update to the data from that year.

<img src="/screenshots/img2.png" width="100" height="100"/>


## Findings
When discussing the findings, it is important to first note that, in many countries, suicide as a cause of death is underreported because of the stigma. Therefore, any analysis needs to be done with that fact in mind.

## Libraries and Structure
The only library I used for this project was D3 v6 and seperated the js into different files depending on what graph I was generating. All graphs were generated through main.js. The UI is deployed at [Link](https://a-world-of-data.netlify.app/).

The colors for the graphs were mostly taken from [Color Brewer](https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3).

## Challenges and Future Work

## Collaboration
