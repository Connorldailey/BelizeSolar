// Full Sites URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarNames()
// Full AllWatts URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarWatts(*)
// Full SiteInfo URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarInfo(%SITE%)

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
                //console.log(ref);
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
	displaySitePhotoSection(siteName);
	displayWattGaugeSection(siteName);
	displaySiteInfoSection(siteName);
}

// Function to display school name and picture
function displaySitePhotoSection(siteName) {
    // Select the container where the site info will be displayed
    const container = document.getElementById('sitePhotoContainer');

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
            max: 1500,
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
            let siteIDs = [];
            // Loop through all sites and store IDs
            for (const [key, value] of Object.entries(data.message)) {
                // Directly match "Kings College" excluding "OLD Kings College"
                if (siteName === "Kings College" && value === "Kings College") {
                    siteIDs.push(key);
                    // console.log("Key:", key, "Value:", value); // Log the key for debugging
                }
                // Match any other site name including cases like "ACES Primary 1", "New Horizons Primary 1A", etc.
                else if (siteName !== "Kings College" && value.includes(siteName)) {
                    siteIDs.push(key); // Add the key to siteIDs if the value includes siteName
                    // console.log("Key:", key, "Value:", value); // Log the key for debugging
                }
            }
            return siteIDs;
        });
}

// Utility function to escape regex characters in siteName
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

// Fetch general site information
function fetchSiteInfo(siteName) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        // Use map instead of forEach to return an array of promises
        let fetchPromises = siteIDs.map(ID => {
            let MAC = shortMAC(ID);
            let command = Url + siteInfo.replace("%SITE%", MAC);
            return fetch(command)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the JSON in the response
                })
                .then(data => {
                    // Return the desired information as an object
                    return {
                        location: data.message.location,
                        contactName: data.message.contactName,
                        contactPhone: data.message.contactPhone,
                        contactEmail: data.message.contactEmail,
                        numPanels: data.message.numPanels,
                        yearInstalled: data.message.yearInstalled
                    };
                });
        });

        // Use Promise.all to wait for all fetch operations to complete
        return Promise.all(fetchPromises).then(results => {
            // Aggregate the results into a single object
            let info = {
                location: results[0].location,
                contactName: results[0].contactName,
                contactPhone: results[0].contactPhone,
                contactEmail: results[0].contactEmail,
                systems: results.map(result => ({ numPanels: result.numPanels, yearInstalled: result.yearInstalled }))
            };
            return info;
        });
    });
}


// Fetch system specific information
function fetchSystemInfo(siteName) {
    fetchSystemIDs(siteName).then(siteIDs => {
        let fetchPromises = siteIDs.map(ID => {
            let MAC = shortMAC(ID);
            let command = Url + siteInfo.replace("%SITE%", MAC);
            return fetch(command)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the JSON in the response
                })
                .then(data => {
                    // Extract numPanels and yearInstalled from the response
                    const numPanels = data.message.numPanels;
                    const yearInstalled = data.message.yearInstalled;
                    // Return an object containing both values for each system
                    return { numPanels, yearInstalled };
                });
        });

        Promise.all(fetchPromises).then(systemsInfo => {
            console.log(systemsInfo); // systemsInfo is an array of objects, each containing numPanels and yearInstalled for a system
        }).catch(error => {
            console.error("Error fetching system info:", error);
        });
    }).catch(error => {
        console.error("Error fetching system IDs:", error);
    });
}

// Get last 6 characters of MAC
function shortMAC(MAC) {
	if (!MAC) {
        throw new Error('shortMAC function received undefined input');
    }
	let short = MAC.substr(-6);
	return short;
}

// Utility function to create an HTML element with text
function createInfoElement(key, value) {
    const element = document.createElement('p');
    element.textContent = `${key}: ${value}`;
    return element;
}

// Function to render site and systems information
function displaySiteInfoSection(siteName) {
    fetchSiteInfo(siteName).then(siteInfo => {
        const siteInfoContainer = document.getElementById('siteInfoContainer');
        siteInfoContainer.innerHTML = ''; // Clear existing content

        // Add general site information directly accessing the object properties
        siteInfoContainer.appendChild(createInfoElement('School Name', siteName));
        siteInfoContainer.appendChild(createInfoElement('Location', siteInfo.location));
        siteInfoContainer.appendChild(createInfoElement('Contact Name', siteInfo.contactName));
        siteInfoContainer.appendChild(createInfoElement('Contact Phone', siteInfo.contactPhone));
        siteInfoContainer.appendChild(createInfoElement('Contact Email', siteInfo.contactEmail));
        siteInfoContainer.appendChild(createInfoElement('Number of Systems',siteInfo.systems.length));
        // ... Add other site info elements

        // Add system-specific information
        siteInfo.systems.forEach((system, index) => {
            siteInfoContainer.appendChild(createInfoElement(`Number of Panels for System ${index + 1}`, system.numPanels));
            siteInfoContainer.appendChild(createInfoElement(`Year Installed for System ${index + 1}`, system.yearInstalled));
        });
    });
}






