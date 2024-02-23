// Full Sites URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarNames()
// Full AllWatts URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarWatts(*)
const Url="http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999";
const Sites="&Query=SolarNames()";
const AllWatts="&Query=SolarWatts(*)";
const siteDayWatts="&Query=SolarHistory(%SITE%,qWattsmin1,%DATE%*)";
const siteInfo="&Query=SolarInfo(%SITE%)"
const allSitesDayWatts="&Query=SolarHistorySummary(*,qHistoryWattsHour1,%DATE%*)";
const SolarWattsAverageDay="&Query=SolarWattsAverageDay(8B0C4C,%DATE%"
const SolarWattsAllDayAllSites="&Query=SolarWattsAllDayAllSites(%DATE%*)";
// &Query=SolarHistory(8B0AB1,qWattsmin1,2023-02-02*)
// &Query=SolarHistory(SITE,qWattsmin1,DATE*)

// Function to fetch and return all site names (including system number)
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
            return sites; // Return the sites array from the promise chain
        });	
}

// Function to return a list of all school names (system/site numbers removed)
function processSites() {
    return fetchSites().then(sites => {
        let processedSites = [];
        for (let i = 0; i < sites.length; i++) {
            const ref = sites[i].replace(/\d+\w*$/, '');
            if (!processedSites.includes(ref)) {
                processedSites.push(ref);
                console.log(ref);
            }
        }
        return processedSites;
    });
}

// Function to populates the dropdown menu
function populateDropdown() {
    processSites().then(processedSites => {
        const dropdownMenu = document.querySelector('#navbarDropdown + .dropdown-menu');
        // Clear existing dropdown items
        dropdownMenu.innerHTML = '';
        // Iterate over the sites and create a dropdown item for each
        processedSites.forEach(site => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#'; // Use real href if applicable
            link.textContent = site;
            link.classList.add('dropdown-item'); // Add Bootstrap's dropdown-item class for styling
            // Optional: Add a click event listener for each site
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor action
                // Here, you can call a function to change the page content based on the site clicked
                console.log(`Site clicked: ${site}`);
                loadSiteInfo(site);
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

// Function to display all page information for any school
function loadSiteInfo(siteName) {
	console.log("Here:", siteName);
	displaySiteInfoSection(siteName);
	displayWattGaugeSection(siteName);
	// Just practicing with date
	const date =  todaysDate();
	console.log(date);
}

// Function to display school name and picture
function displaySiteInfoSection(siteName) {
    // Select the container where the site info will be displayed
    const container = document.getElementById('siteInfoContainer');

    // Clear previous content
    container.innerHTML = '';

    // Create the div that will hold the school name and image
    const siteInfoDiv = document.createElement('div');
    siteInfoDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');

    // Create and append the school name element
    const schoolNameElement = document.createElement('h3');
    schoolNameElement.textContent = siteName;
    schoolNameElement.classList.add('text-center', 'mb-3');
    siteInfoDiv.appendChild(schoolNameElement);

    // Create and append the image element
    const imageElement = document.createElement('img');
    // Use a stock image for now. Replace the 'src' attribute with your image path or URL
    imageElement.src = 'http://3.15.139.27/BelizeSolar/Images/schoolExample.jpeg';
    imageElement.alt = 'Site Image';
    imageElement.classList.add('img-fluid', 'rounded', 'mx-auto', 'd-block'); // Make image responsive and center it
    siteInfoDiv.appendChild(imageElement);

    // Append the site info div to the container
    container.appendChild(siteInfoDiv);
}

// Function to display current watts gauge
function displayWattGaugeSection(siteName) {
    const container = document.getElementById('wattGaugeContainer');
    container.innerHTML = ''; // Clear any existing content

    // Create the div that will hold the watt gauge
    const wattGuageDiv = document.createElement('div');
    wattGuageDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');
    wattGuageDiv.style.position = 'relative'; // Relative positioning for JustGage
    wattGuageDiv.style.height = '300px'; // Set a fixed height for the gauge

    // Create and append the gauge element with an id that JustGage will use
    const gaugeElement = document.createElement('div');
    gaugeElement.id = 'gauge';
    gaugeElement.style.width = '100%'; // Gauge width relative to its container
    gaugeElement.style.height = '100%'; // Gauge height relative to its container
    wattGuageDiv.appendChild(gaugeElement);
    container.appendChild(wattGuageDiv);

    // Fetch the total watts and then create the JustGage instance
    let gauge; // Hold the gauge instance for redrawing if needed
    fetchTotalWatts(siteName).then(totalWatts => {
        gauge = new JustGage({
            id: "gauge",
            value: " " + totalWatts,
            min: 0,
            max: 1000,
            title: "Current Watts",
            titleFontSize: 12,
    		titleFontColor: "black",
    		titleFontFamily: "Arial",
            pointer: true,
        	gaugeWidthScale: 0.6,
        	counter: true,
        	relativeGaugeSize: true
        });
    }).catch(error => {
        console.error('Error displaying watt gauge:', error);
    });

    // Redraw gauge on window resize for responsiveness
    window.addEventListener('resize', function() {
        if (gauge) {
            gauge.refresh(gauge.config.value); // Redraw the gauge with the current value
        }
    });
}

// Function to fetch IDs of all systems at a site
function fetchSystemIDs(siteName) {
	return fetch(Url + Sites)
		.then(response => {
			if (!response.ok){
				throw new Error('Network response was not ok');
			}
			return response.json(); // Parse the JSON in the response
		})
		.then(data => {
			siteIDs = [];
			// Loop through all sites and store names
            for (const [key, value] of Object.entries(data.message)) {
                if (value.includes(siteName)) { // Check if the site name is included in the value
                    siteIDs.push(key); // Add the key to siteIDs if the value includes siteName
                    console.log(key); // Log the key for debugging
                }
            }
            return siteIDs;
		});
}

// Fetch total watts for site (sum of system watts)
function fetchTotalWatts(siteName) {
    // First, fetch the system IDs for the site
    return fetchSystemIDs(siteName).then(siteIDs => {
        // Once we have the site IDs, fetch all watts
        return fetch(Url + AllWatts)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON in the response
            })
            .then(data => {
                let watts = 0;
                data.message.forEach(entry => {
                    const [key, valueStr] = entry; // Destructure the entry array to get key and value
                    if (siteIDs.includes(key)) { // Only include if the key is in the siteIDs
                        const value = parseInt(valueStr, 10); // Convert value string to number
                        console.log(`Adding ${value} watts from system ${key}`);
                        watts += value; // Add to watts if key matches
                    }
                });
                console.log("Total: ", watts);
                return watts; // Return the total watts for further processing
            });
    });
}

// Todays date in for yyyy-mm-dd
function todaysDate() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var date = yyyy +'-'+ mm +'-'+ dd;
	return date;
}


