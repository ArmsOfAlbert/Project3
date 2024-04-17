
    // Fetch EV data from the server
    fetch('../resource/EV_Make_Model.json')
    .then(response => response.json())

    .then(data => {
        // Create an HTML table
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse'; // Collapse border spacing
        table.style.width = '100%'; // Set table width to 100%

        // Add table headers
        const headers = ['Make', 'Model', 'Connector', 'Level 1', 'Level 2', 'DC','Per Charge', 'Car Price'];
        const headerRow = table.insertRow();
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.border = '1px solid #ddd'; // Add border to header cell
            th.style.padding = '8px'; // Add padding to header cell
            th.style.textAlign = 'left'; // Align text to the left
            th.style.backgroundColor = '#f2f2f2'; // Add background color to header row
            headerRow.appendChild(th);
        });

        // Add table rows with EV data
        data.forEach(ev => {
            const row = table.insertRow();
            Object.entries(ev).forEach(([key, value]) => {
                const cell = row.insertCell();
                cell.textContent = (key === 'Car Price') ? formatCurrency(value) : `${value} `;
                cell.style.border = '1px solid #ddd'; // Add border to data cell
                cell.style.padding = '8px'; // Add padding to data cell
            });
        });

        // Append the table to a container in your HTML
        const container = document.getElementById('ev-table-container');
        container.appendChild(table);
    })
    .catch(error => console.error('Error loading EV data:', error));

    // Function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount.replace('$', '').replace(',', ''));
    }

