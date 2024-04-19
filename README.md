# Project 3
For this project, we chose to create a data visualization dashboard.

## Project Proposal
#### Project Title: 
Electric Vehicle Charging Stations
#### Team Members: 
Alberto Alvarado, Karina Gonzalez, Angelie Wanner
#### Project Description:
Imagine: You just purchased your first EV vehicle, and unlike gas stations that's at every corner street, you need to figure out where all the available charging stations are depending on your location around town!

Interactive map of marked charging stations with address and phone number. Additional visualizations includes following:
* top 10 states with most ev charging stations
    ![top 10 states with most ev charging stations](https://github.com/ArmsOfAlbert/Project3/blob/main/resource/top10.png)
* an info panel of EV car makes and models
    ![EV Cars](https://github.com/ArmsOfAlbert/Project3/blob/main/resource/car_make_model.png)
* drop down selection to search by state and city, narrowing map view to selected location
* filtering on map to show marked locations, heat map, change map view from street to topographical
    ![map with popup](https://github.com/ArmsOfAlbert/Project3/blob/main/resource/mapmarkers.png)

Data collection, cleanup, and updates were made on Jupyter notebook `Project3.ipynb`.

We leveraged MongoDB for our database. Datasets used:
* Alternative_Fueling_Stations_-6669030252532885733.csv
* us_alt_fuel_stations.csv
* final_merged_data.json (this is our final dataset after cleaning and merging the two csv files)

Javascript used to create visualizations for dashboard `Project3.js`. 
JS Libraries used:
* Plotly for charts
* Leaflet for map (markers and heatmap)
* D3 for reading dataset

## Future Possibilities
There are many potential possibilities for enhancements to this dashboard. 
* With the current data and code, additional drop down selection can be added to filter to show specific level types or connector types.
* The dataset can be updated to include a pull from an existing API with updated data.
* The python code can be updated to retrieve input from user (i.e. address) and provide a list of nearby charging stations.

## Additional info:
- Our presentation slides can be viewed in the 'presentation' folder of this github repository. 