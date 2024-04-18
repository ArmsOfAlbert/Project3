// Fetch JSON data
fetch('../resource/final_merged_data.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Count the number of charging stations for each state
    const statesCount = {};
    data.forEach(entry => {
      const state = entry.State;
      if (state in statesCount) {
        statesCount[state]++;
      } else {
        statesCount[state] = 1;
      }
    });

    // Convert object to array for sorting
    const statesArray = Object.entries(statesCount);

    // Sort states by the number of charging stations
    statesArray.sort((a, b) => b[1] - a[1]);

    // Select top 10 states
    const top10States = statesArray.slice(0, 10);

    // Create a bar chart
    const margin = { top: 20, right: 30, bottom: 40, left: 65 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#chart').append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom)
                  .append('g')
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Set scales for the chart
    const xScale = d3.scaleBand()
                    .domain(top10States.map(d => d[0]))
                    .range([0, width])
                    .padding(0.1);

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(top10States, d => d[1])])
                    .range([height, 0]);

    // Add x-axis
    svg.append('g')
       .attr('transform', `translate(0, ${height})`)
       .call(d3.axisBottom(xScale))
       .selectAll('text')
       .attr('transform', 'rotate(-45)')
       .attr('text-anchor', 'end')
       .style('font-size', '12px');

    // Add y-axis
    svg.append('g')
       .call(d3.axisLeft(yScale))
       .style('font-size', '12px');

    // Add bars to the chart
    svg.selectAll('rect')
       .data(top10States)
       .enter()
       .append('rect')
       .attr('x', d => xScale(d[0]))
       .attr('y', d => yScale(d[1]))
       .attr('width', xScale.bandwidth())
       .attr('height', d => height - yScale(d[1]))
       .attr('fill', 'steelblue');

    // Add state labels below the bars
    svg.selectAll('text')
       .data(top10States)
       .enter()
       .append('text')
       .text(d => d[0])
       .attr('x', d => xScale(d[0]) + xScale.bandwidth() / 2)
       .attr('y', height + 20)
       .attr('font-size', '12px')
       .attr('text-anchor', 'middle');

    // Add x-axis title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.top + 20)
      .attr('text-anchor', 'middle')
      .text('States');
    // Add y-axis title
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text('Number of Charging Stations');

       
 // Get unique states and cities from the data
const states = [...new Set(data.map(entry => entry.State))];
const citiesByState = {}; // Object to store cities by state
states.sort();

// Populate the state dropdown
const stateDropdown = document.getElementById('state');
states.forEach(state => {
  const option = document.createElement('option');
  option.value = state;
  option.textContent = state;
  stateDropdown.appendChild(option);

  // Find cities for each state
  const citiesForState = [...new Set(data.filter(entry => entry.State === state).map(entry => entry.City))];
  citiesByState[state] = citiesForState;
  citiesForState.sort();
});

// Add event listener to state dropdown
stateDropdown.addEventListener('change', () => {
  const selectedState = stateDropdown.value;
  const cityDropdown = document.getElementById('city');
  cityDropdown.innerHTML = ''; // Clear previous options

  // Populate city dropdown based on selected state
  citiesByState[selectedState].forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityDropdown.appendChild(option);
  });
});


    // Sample data of charging stations (replace with your own data)
    const chargingStations = data.map(station => ({
      latitude: station.Latitude,
      longitude: station.Longitude,
      title: station.Title,
      city: station.City,
      state: station.State,
      address: station.Address,
      number: station.Phone_Number,
      pricing: station.Pricing
      }));

    // Initialize map with default center and zoom level
  const map = L.map('map').setView([40.7128, -74.0060], 10);

 // Create tile layers for OpenStreetMap and OpenTopoMap
const openStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

const openTopoMapLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenTopoMap contributors'
});

// Add OpenStreetMap layer by default
openStreetMapLayer.addTo(map);


   // Create a base layers object
   const baseLayers = {
    "OpenStreetMap": openStreetMapLayer,
    "OpenTopoMap": openTopoMapLayer
  };
  

  // Create a marker cluster group
  const markers = L.markerClusterGroup();

  // Create an array to hold heatmap data
  const heatMapData = [];
  const customIcon = L.icon({
    iconUrl: '../resource/lightblack.png',
    iconSize: [60, 60], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });
    // Add markers for each charging station
  chargingStations.forEach(station => {
      const { latitude, longitude } = station;
      const marker = L.marker([latitude, longitude],{icon:customIcon})
      .bindPopup("<h5>Station Name: " + station.title + "<h5><h5>Address: " + station.address +
      + ", " + station.city + ", " + station.state + "<h5><h5>Phone Number: " + station.number +"<h5>Price: " + station.pricing + "</h5>");
      markers.addLayer(marker);
      heatMapData.push([latitude, longitude]);
    });

    // Create the heatmap layer
const heat = L.heatLayer(heatMapData, { radius: 25 });

// Add the marker cluster group to the map
map.addLayer(markers);

// Add the heatmap layer to the map
heat.addTo(map);


  // Create overlay layers object to switch between markers and heatmap
  const overlayLayers = {
    "Markers": markers,
    "Heatmap": heat
};

// Add layer control to switch between base layers and overlay layers
L.control.layers(baseLayers, overlayLayers, {collapsed: false}).addTo(map);


function updatePieChart(selectedState,selectedCity){
  const filteredData = data.filter(entry => entry.State === selectedState && entry.City === selectedCity);
  console.log('filtered Data', filteredData);
      // Retrieve the latitude and longitude of the first entry (assuming all entries are in the same area)
  const latitude = filteredData[0].Latitude;
  const longitude = filteredData[0].Longitude;

// Move the map to the selected city's coordinates
  map.setView([latitude, longitude], 12); // Adjust the zoom level as needed
// Group data by city and state and calculate total charging levels
  //const cityStateData = {};
  const accessCodeCounts ={};
  filteredData.forEach(entry => {
    const accessCode = entry['Facility Type'];
    //const key = `${entry.City}, ${entry.State}`;
    if (!accessCodeCounts[accessCode]) {
      accessCodeCounts[accessCode] = 1;
    } 
    accessCodeCounts[accessCode]++
    //cityStateData[key].chargingLevels += parseInt(entry['Charging Levels',10]);
  });
  //Calculate Total
  const total = Object.values(accessCodeCounts).reduce((acc, cur) => acc + cur, 0);

  //Merge Categories with less than 3 percent
  Object.entries(accessCodeCounts).forEach(([code, count]) => {
    if ((count / total) < 0.03) {
        accessCodeCounts['OTHER'] = (accessCodeCounts['Other'] || 0) + count;
        delete accessCodeCounts[code];
    }
});  

// Convert data to array format for D3 pie chart
  const pieData = Object.entries(accessCodeCounts).map(([code, count]) => ({ code, count }));

  //const pieData = Object.values(cityStateData);
  d3.select('#pie-chart').selectAll('*').remove();
// Define dimensions for the pie chart
  const Pwidth = 600;
  const Pheight = 400;
  const radius = Math.min(Pwidth, Pheight) / 2;

// Define colors for the pie chart
  const color = d3.scaleOrdinal(d3.schemeCategory10);


  const Psvg = d3.select('#pie-chart')
    .append('svg')
    .attr('width', Pwidth)
    .attr('height', Pheight)
    .append('g')
    .attr('transform', `translate(${Pwidth / 2}, ${Pheight / 2})`);

// Define pie layout
  const pie = d3.pie()
    .value(d => d.count);

// Generate pie chart arcs
  const arc = d3.arc()
    .outerRadius(radius*.7)
    .innerRadius(0);

// Create pie slices
  const arcs = Psvg.selectAll('arc')
    .data(pie(pieData))
    .enter()
    .append('g')
    .attr('class', 'arc');

// Draw pie slices
  arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i));

// Add labels to pie slices
  arcs.append('text')
    .attr('transform', d => {
      const pos = arc.centroid(d);
      const midAngle = Math.atan2(pos[1], pos[0]);
    // Move the labels away from the center of the pie chart
      const x = radius * 0.7 * Math.cos(midAngle);
      const y = radius * 0.7 * Math.sin(midAngle);
      return `translate(${x}, ${y})`;
})            
    .attr('text-anchor', d => {
      const pos =arc.centroid(d);
      return (pos[0] > 0) ? 'start' : 'end';

    })
    .attr('font-size', '16px')
    .style('font-weight', 'bold') 
    .text(d => d.data.code);
    
    console.log(chargingStations);


// Add lines pointing to pie slices
  arcs.append('line')
    .attr('x1', d => arc.centroid(d)[0])
    .attr('y1', d => arc.centroid(d)[1])
    .attr('x2', d => {
      const pos = arc.centroid(d);
      const midAngle = Math.atan2(pos[1], pos[0]);
      const x = radius *.7* Math.cos(midAngle);
      return x;
})
    .attr('y2', d => {
      const pos = arc.centroid(d);
      const midAngle = Math.atan2(pos[1], pos[0]);
      const y = radius *.7* Math.sin(midAngle);
      return y;
})
  .attr('stroke', 'black')
  .attr('stroke-width', 2);




}


const cityDropdown = document.getElementById('city');
stateDropdown.addEventListener('change', () => {
const selectedState = stateDropdown.value;
const selectedCity = cityDropdown.value;
updatePieChart(selectedState, selectedCity);
console.log('Filtered Data:', filteredData);

});

cityDropdown.addEventListener('change', () => {
const selectedState = stateDropdown.value;
const selectedCity = cityDropdown.value;
updatePieChart(selectedState, selectedCity);
});



function updateConnectorTable(selectedState, selectedCity) {
  const filteredData = data.filter(entry => entry.State === selectedState && entry.City === selectedCity);
  const connectorCounts = {};
  filteredData.forEach(entry => {
      const connectorType = entry['Connector Type'];
      connectorCounts[connectorType] = (connectorCounts[connectorType] || 0) + 1;
  });

  // Convert data to an array of objects for DataTables
  const tableData = Object.entries(connectorCounts).map(([connectorType, count]) => ({
      'Connector Type': connectorType,
      'Count': count
  }));

  // Initialize DataTable
  $('#connector-table').DataTable({
      data: tableData,
      destroy: true, // Destroy existing table before re-initializing
      columns: [
          { data: 'Connector Type' },
          { data: 'Count' }
      ]
  });
}

// Call the updateConnectorTable function whenever the state dropdown changes
stateDropdown.addEventListener('change', () => {
  const selectedState = stateDropdown.value;
  const selectedCity = cityDropdown.value;
  updateConnectorTable(selectedState, selectedCity);
});

// Call the updateConnectorTable function whenever the city dropdown changes
cityDropdown.addEventListener('change', () => {
  const selectedState = stateDropdown.value;
  const selectedCity = cityDropdown.value;
  updateConnectorTable(selectedState, selectedCity);
});

    // Define a function to update the message
    function updateMessage(city, state, count) {
      const message = `In ${city}, ${state}, there are ${count} charging stations.`;
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = message;
    }

    // Function to update the message when city or state selection changes
    function updateMessageOnSelectionChange() {
      const selectedCity = document.getElementById('city').value;
      const selectedState = document.getElementById('state').value;
      const filteredData = data.filter(entry => entry.City === selectedCity && entry.State === selectedState);
      const count = filteredData.length;
      updateMessage(selectedCity, selectedState, count);
    }

    // Add event listeners to city and state dropdowns
    document.getElementById('city').addEventListener('change', updateMessageOnSelectionChange);
    document.getElementById('state').addEventListener('change', updateMessageOnSelectionChange);

    // Call the updateMessage function initially to display the message based on the default selection
    updateMessageOnSelectionChange();
  })


 


.catch(error => console.error('Error loading JSON:', error));

// Define a variable with your message
const myMessage = "Hello from JavaScript!";
console.log(chargingStations);

// Select the HTML element where you want to display the message
const messageDiv = document.getElementById('message');

// Set the innerHTML of the selected element to your message
messageDiv.innerHTML = myMessage;
