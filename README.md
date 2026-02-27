[Video](https://drive.google.com/file/d/149-S9WkJF2YpLOodQZCD6fAEWQ9-y_Bk/view?usp=sharing)

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
I planned originally on trying to have some kind of dashboard, but the graphs were all so small and hard to read that it felt like all the information got lost. The choropleth graphs could not get much smaller without being difficult to navigate, and the scatterplot and line graphs took up too much space to make smaller. I settled on having tabs for each of the graphs and having two of the same graph, one for each attribute, when applicable, and making the year drop down change the graphs across all pages.

Sketches (ended up being scrapped):
<img src="/screenshots/sketch.png" height="500"/>

## Visualization
The main view that the UI opens to is the scatterplot that compares the rate of suicide by the HRI. At the top, there are three other pages you can look at: histogram, choropleth, and line graph. There is also a drop down to select a year, which effects the scatterplot, histogram, and choropleth. If you change the year, all five of these graphs will update to the data from that year. Note that the year dropdown does not effect the line graphs as they are already shown over time.

Landing page:

<img src="/screenshots/img2.png" height="450"/>

Changing year to 2017 updates scatterplot:

<img src="/screenshots/image.png" height="450"/>

You can hover over any of the points to get information about the specific country:

<img src="/screenshots/img7.png" height="450"/>

If you switch to the histogram page, you see histograms for the Human Rights Index and suicide rate by number of countries:

<img src="/screenshots/img8.png" height="450"/>

If you switch to the choropleth page, you see heat maps for the human rights index and suicide rate:

<img src="/screenshots/img10.png" height="450"/>

You can hover over any of the countries to get information:

<div style="display: flex">
<img src="/screenshots/img11.png" height="450"/>
<img src="/screenshots/img12.png" height="450"/>
</div>

On the line graph page, you can see line graphs for both the human rights index and suicide rate from 2000 to 2021. You can select which contries you want to see from the scrollbox and each continent is assigned a color:

<img src="/screenshots/img13.png" height="450"/>

You can also hover over each point to get information:

<img src="/screenshots/img14.png" height="450"/>

## Findings
When discussing the findings, it is important to first note that, in many countries, suicide as a cause of death is underreported because of the stigma. Therefore, any analysis needs to be done with that fact in mind.

When looking at the rate of suicide vs hri, the immediate thought would be that countries with a high hri would have a lower suicide rate than countries with a lower hri. However, most contries are concentrated under 15 regardless of the hri. From the years 2000 to 2009, post Soviet countries such as Lithuania, Belarus, Russia, and Ukraine occupied the spot for highest suicide rate, only being overtaken by Lesothos and Eswatini in 2010, which have for the most part stayed consistantly the highest since. These two stats track for what we know about these countries during this time period. During the 90s and early 2000s, many post-Soviet countries were going through massive economic and cultural changes following the collapse of the USSR. Lesothos and Eswatini are both countries that struggle with severe economic and health crisis, specifically HIV/AIDS. Lesothos had the highest rate of HIV in 2001 and by 2016, it was the second highest only behind Eswatini.

<div style="display: flex">
<img src="/screenshots/img4.png" height="450"/>
<img src="/screenshots/img5.png" height="450"/>
</div>

Something that stood out to me when looking at the choropleth map from 2000 was the rate of suicide in Sri Lanka. It had the third highest rate of suicide, only behind Russia and Lithuania. This could be explained by the Sri Lankan Civil War that went from 1983 to 2009, which had an intense escalation in 2000 partly due to the 2000 parlimentary elections.

<img src="/screenshots/img9.png" height="300"/>

The suicide rate in the US is on a steady incline. It was about 10 in 2000 and has gone up to 14, putting it above most European countries (in green) and on par with Japan (in orange), which has culture of suicide due to overwork.

<img src="/screenshots/img6.png" height="300"/>

## Libraries and Structure
The only library I used for this project was D3 v6 and seperated the js into different files depending on what graph I was generating. All graphs were generated through main.js. The UI is deployed at [Link](https://a-world-of-data.netlify.app/). You can access the code on [Github](https://github.com/kellannd/a-world-of-data), and as there are no extra libraries, you should be able to serve the [index.html](/index.html) page using an extension like VS Code's Live Server.

The colors for the graphs were mostly taken from [Color Brewer](https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3).

## Challenges and Future Work
The biggest thing that I wanted to include, but ran out of time to, was "country isolation" or brushing where you could, for instance, select some points on the scatterplot with a brush and those specific points would be highlighted on other graphs. I think this would have been a good way to connect across different graphs. I also wish that I would have somehow found a way to have a good dashboard instead of the scatterplot being the main page. In the future, I will take some more time in the design and sketching phase to find a good way to have as much information as possible on the main page.

## Collaboration
