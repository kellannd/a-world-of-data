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

Landing page:

<img src="/screenshots/img2.png" height="500"/>

Changing year to 2017 updates scatterplot:

<img src="/screenshots/image.png" height="500"/>


## Findings
When discussing the findings, it is important to first note that, in many countries, suicide as a cause of death is underreported because of the stigma. Therefore, any analysis needs to be done with that fact in mind.

When looking at the rate of suicide vs hri, the immediate thought would be that countries with a high hri would have a lower suicide rate than countries with a lower hri. However, most contries are concentrated under 15 regardless of the hri. From the years 2000 to 2009, post Soviet countries such as Lithuania, Belarus, Russia, and Ukraine occupied the spot for highest suicide rate, only being overtaken by Lesothos and Eswatini in 2010, which have for the most part stayed consistantly the highest since. These two stats track for what we know about these countries during this time period. During the 90s and early 2000s, many post-Soviet countries were going through a massive economic and cultural change following the collapse of the USSR. Lesothos and Eswatini are both countries that struggle with severe economic and health crisis, specifically HIV/AIDS. Lesothos had the highest rate of HIV in 2001 and by 2016, it was the second highest only behind Eswatini.

<div style="display: flex">
<img src="/screenshots/img4.png" height="500"/>
<img src="/screenshots/img4.png" height="500"/>
</div>

Something that stood out to me when looking at the choropleth map from 2000 was the rate of suicide in Sri Lanka. It had the third highest rate of suicide, only behind Russia and Lithuania. This could be explained by the Sri Lankan Civil War that went from 1983 to 2009, which had an intense escalation in 2000 partly due to the 2000 parlimentary elections.

<img src="/screenshots/img3.png" height="300"/>

## Libraries and Structure
The only library I used for this project was D3 v6 and seperated the js into different files depending on what graph I was generating. All graphs were generated through main.js. The UI is deployed at [Link](https://a-world-of-data.netlify.app/).

The colors for the graphs were mostly taken from [Color Brewer](https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3).

## Challenges and Future Work

## Collaboration
