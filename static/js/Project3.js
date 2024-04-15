// Fetch JSON data
fetch('../resource/final_merged_data.json')
  .then(response => response.json())
  .then(data => {
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
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
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






  })
  .catch(error => console.error('Error loading JSON:', error));

  // Define a variable with your message
const myMessage = "Hello from JavaScript!";

// Select the HTML element where you want to display the message
const messageDiv = document.getElementById('message');

// Set the innerHTML of the selected element to your message
messageDiv.innerHTML = myMessage;

