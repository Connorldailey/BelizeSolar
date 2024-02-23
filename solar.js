// Full Sites URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarNames()
// Full AllWatts URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarWatts(*)
const Url="http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999";
const Sites="&Query=SolarNames()";
const Watts="&Query=SolarWatts("; 
const AllWatts="&Query=SolarWatts(*)";
const siteDayWatts="&Query=SolarHistory(%SITE%,qWattsmin1,%DATE%*)";
const siteInfo="&Query=SolarInfo(%SITE%)"
const allSitesDayWatts="&Query=SolarHistorySummary(*,qHistoryWattsHour1,%DATE%*)";
const SolarWattsAverageDay="&Query=SolarWattsAverageDay(8B0C4C,%DATE%"
const SolarWattsAllDayAllSites="&Query=SolarWattsAllDayAllSites(%DATE%*)";
// &Query=SolarHistory(8B0AB1,qWattsmin1,2023-02-02*)
// &Query=SolarHistory(SITE,qWattsmin1,DATE*)

// Function to fetch all site names
function fetchSites() {
    return fetch(Url + Sites) // Ensure Url and Sites are correctly defined
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON in the response
        })
        .then(data => {
            let sites = [];
            // Loop through all sites and store names
            for (const [key, value] of Object.entries(data.message)) {
                sites.push(value);
            }
            let processedSites = [];
            // Remove numbers from site names and avoid duplicates
            for (let i = 0; i < sites.length; i++) {
                const ref = sites[i].replace(/\d+\w*$/, '');
                if (!processedSites.includes(ref)) {
                    processedSites.push(ref);
                    // console.log(ref);
                }
            }
            return processedSites; // Return the processed sites array from the promise chain
        });	
}

// Function to console log all the site names for reference
function consoleLogSites() {
	fetchSites().then(sites => {
        for (let i = 0; i < sites.length; i++) {
            console.log(sites[i]);
        }
    })
    .catch(error => {
        console.error('Error listing sites:', error);
    });
}
consoleLogSites()

// Function to populatss the dropdown menu
function populateDropdown() {
    fetchSites().then(sites => {
        const dropdownMenu = document.querySelector('#navbarDropdown + .dropdown-menu');

        // Clear existing dropdown items
        dropdownMenu.innerHTML = '';

        // Iterate over the sites and create a dropdown item for each
        sites.forEach(site => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#'; // You might want to use a real href if applicable
            link.textContent = site;
            link.classList.add('dropdown-item'); // Add Bootstrap's dropdown-item class for styling

            // Optional: Add a click event listener for each site
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor action
                // Here, you can call a function to change the page content based on the site clicked
                console.log(`Site clicked: ${site}`);
            });

            listItem.appendChild(link);
            dropdownMenu.appendChild(listItem);
        });
    }).catch(error => {
        console.error('Error populating dropdown:', error);
    });
}

// Call populateDropdown when the page is ready or when it's appropriate to load the sites
document.addEventListener('DOMContentLoaded', populateDropdown);





















/*
// For reference
fetch(Url + AllWatts)
  .then(response => {
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON in the response
  })
  .then(data => {
    // Initialize watts as a mutable variable
    let watts = 0;
    for (let i = 0; i < data.message.length; i++) {
      const record = data.message[i];
      // Convert record[1] to a number before adding
      watts += parseInt(record[1], 10); // Use parseFloat if the values can be floating point
    }
    const out = `<p>${watts}</p>`;

    // Assuming you have a function getSchoolName() that returns the school name
    // Display the total watts in the div with id="total-watts"
    document.getElementById('total-watts').innerHTML = out;
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('There was a problem with your fetch operation:', error);
    document.getElementById('data-output').innerHTML = 'Error fetching data.';
});
*/






