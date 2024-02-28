// Full Sites URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarNames()
// Full AllWatts URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarWatts(*)
// Full SiteInfo URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarInfo(%SITE%)
// Full SolarHistory URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarHistory(SITE,qWattsmin1,DATE*)

const Url="http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999";
const Sites="&Query=SolarNames()";
const AllWatts="&Query=SolarWatts(*)";
const siteDayWatts="&Query=SolarHistory(%SITE%,qWattsmin1,%DATE%*)";
const siteInfo="&Query=SolarInfo(%SITE%)"

const allSitesDayWatts="&Query=SolarHistorySummary(*,qHistoryWattsHour1,%DATE%*)";
const SolarWattsAverageDay="&Query=SolarWattsAverageDay(8B0C4C,%DATE%"
const SolarWattsAllDayAllSites="&Query=SolarWattsAllDayAllSites(%DATE%*)";

// Function to display all page information for any school
function loadSiteInfo(siteName) {
	console.log("Today's Date:",todaysDate())
	// Display Section
	displaySitePhotoSection(siteName);
	displayWattGaugeSection(siteName);
	displaySiteInfoSection(siteName);
	// Testing
	fetchSiteDayWatts(siteName);
}

// Get last 6 characters of MAC
function shortMAC(MAC) {
	if (!MAC) {
        throw new Error('shortMAC function received undefined input');
    }
	let short = MAC.substr(-6);
	return short;
}

// Returns today's date (yyyy-mm-dd)
function todaysDate() {
    return new Date().toISOString().split('T')[0];
}

// Returns all site names (including system number)
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

// Returns a list of all school names (system numbers removed)
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

// Displays the school name and picture section
function displaySitePhotoSection(siteName) {
    // Select the container where the site info will be displayed
    const container = document.getElementById('sitePhotoContainer');

    // Clear previous content
    container.innerHTML = '';

    // Create the div that will hold the school name and image
    const sitePhotoDiv = document.createElement('div');
    sitePhotoDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');

    // Create and append the school name element
    const schoolNameElement = document.createElement('h3');
    schoolNameElement.textContent = siteName;
    schoolNameElement.classList.add('text-center', 'mb-3');
    sitePhotoDiv.appendChild(schoolNameElement);

    // Create and append the image element
    const imageElement = document.createElement('img');
    // Use a stock image for now. Replace the 'src' attribute with your image path or URL
    imageElement.src = 'http://3.15.139.27/BelizeSolar/Images/' + 'schoolExample' + '.jpeg';
    imageElement.alt = 'Site Image';
    imageElement.classList.add('img-fluid', 'rounded', 'mx-auto', 'd-block'); // Make image responsive and center it
    sitePhotoDiv.appendChild(imageElement);

    // Append the site photo div to the container
    container.appendChild(sitePhotoDiv);
}

// Displays the watt gauge section
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

// Returns an array of IDs for all systems at a site
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
            //console.log(siteIDs);
            return siteIDs;
        });
}

// Returns current watts for site (sum of system watts)
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
                        //console.log(`Adding ${value} watts from system ${key}`);
                        watts += value; // Add to watts if key matches
                    }
                });
                //console.log("Total: ", watts);
                return watts; // Return the total watts for further processing
            });
    });
}

// Returns a map containing current watts for each system at a site
function fetchSystemWatts(siteName) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        return fetch(Url + AllWatts)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let systemWatts = new Map();
                data.message.forEach(entry => {
                    const [key, valueStr] = entry;
                    if (siteIDs.includes(key)) {
                        const value = parseInt(valueStr, 10);
                        systemWatts.set(key, value);
                    }
                });
                //console.log(systemWatts);
                return systemWatts;
            });
    });
}

// Returns a map containing the number of panels for each system at a site
function fetchNumPanels(siteName) {
    // First, fetch all system IDs for the given site name
    return fetchSystemIDs(siteName).then(siteIDs => {
        // Map each ID to a promise that fetches the number of panels for that system
        let promises = siteIDs.map(ID => {
            const MAC = shortMAC(ID);
            let command = Url + siteInfo.replace("%SITE%", MAC);
            return fetch(command)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the JSON in the response
                })
                .then(data => {
                    // Create an object that includes both the system ID and the number of panels
                    return {id: ID, numPanels: data.message.numPanels};
                });
        });
        // Use Promise.all to wait for all fetch operations to complete
        return Promise.all(promises).then(results => {
            // Create a Map to hold the system ID and number of panels pairs
            let panelsMap = new Map();
            // Populate the Map with the ID as key and the number of panels as value
            results.forEach(result => {
                panelsMap.set(result.id, result.numPanels);
            });
            //console.log(panelsMap);
            return panelsMap; // Return the Map object
        });
    });
}

// Returns a map containing the year each system was installed at a site
function fetchYearInstalled(siteName) {
	return fetchSystemIDs(siteName).then(siteIDs => {
		let promises = siteIDs.map(ID => {
			const MAC = shortMAC(ID);
			let command = Url + siteInfo.replace("%SITE%", MAC);
			return fetch(command)
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					return {id: ID, yearInstalled: data.message.yearInstalled};
				});
		});
		return Promise.all(promises).then(results => {
			let instYearMap = new Map();
			results.forEach(result => {
			 	instYearMap.set(result.id, result.yearInstalled);
			});
			// console.log(instYearMap);
			return instYearMap;
		})
	})
}

// Returns a map containing the limiter status for each system
function fetchLimiterStatus(siteName) {
	return fetchSystemIDs(siteName).then(siteIDs => {
		let promises = siteIDs.map(ID => {
			const MAC = shortMAC(ID);
			let command = Url + siteInfo.replace("%SITE%", MAC);
			return fetch(command)
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					return {id: ID, limiterStatus: data.message.limiter};
				});
		});
		return Promise.all(promises).then(results => {
			let limiterStatusMap = new Map();
			results.forEach(result => {
			 	limiterStatusMap.set(result.id, result.limiterStatus);
			});
			// console.log(limiterStatusMap);
			return limiterStatusMap;
		})
	})
}

// Returns a map containing the max daily watts for each system
function fetchMaxDailyWatts(siteName) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        // Map each ID to a promise that resolves to an object containing the ID and max watts for that system
        let promises = siteIDs.map(entry => {
            const MAC = shortMAC(entry);
            let command = Url + siteDayWatts.replace("%SITE%", MAC).replace("%DATE%", todaysDate());
            return fetch(command)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse the JSON in the response
                })
                .then(data => {
                    // Find the max watts value for this system and return it along with the ID
                    const maxWatts = Math.max(...data.message.map(entry => parseInt(entry[3], 10)));
                    return { id: entry, maxWatts };
                });
        });

        // Use Promise.all to wait for all promises to resolve
        return Promise.all(promises).then(results => {
            // Create a Map to hold the system ID and max watts pairs
            let maxWattsMap = new Map();
            // Populate the Map with the ID as key and the max watts as value
            results.forEach(result => {
                maxWattsMap.set(result.id, result.maxWatts);
            });

            // console.log(maxWattsMap); 
            return maxWattsMap; // Return the Map object
        });
    });
}

// Returns an object containing general system information (location and contact info)
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
                    };
                });
        });

        // Use Promise.all to wait for all fetch operations to complete
        return Promise.all(fetchPromises).then(results => {
            // Aggregate the results into a single object
            let siteInfo = {
                location: results[0].location,
                contactName: results[0].contactName,
                contactPhone: results[0].contactPhone,
                contactEmail: results[0].contactEmail,
            };
            //console.log(siteInfo)
            return siteInfo;
        });
    });
}

// Display site info section
function displaySiteInfoSection(siteName) {
    const container = document.getElementById('siteInfoContainer');
    container.innerHTML = ''; // Clear existing content
    
    // Create the div that will hold the site info
    const siteInfoDiv = document.createElement('div');
    siteInfoDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');

    // Display general site information
    fetchSiteInfo(siteName).then(siteInfo => {
        siteInfoDiv.appendChild(createInfoElement('School Name', siteName));
        siteInfoDiv.appendChild(createInfoElement('Location', siteInfo.location));
        siteInfoDiv.appendChild(createInfoElement('Contact Name', siteInfo.contactName));
        siteInfoDiv.appendChild(createInfoElement('Contact Phone', siteInfo.contactPhone));
        siteInfoDiv.appendChild(createInfoElement('Contact Email', siteInfo.contactEmail));
    });
	
	// Prepare table for system specific info
	const table = document.createElement('table');
	table.classList.add('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');
	table.appendChild(thead);
	table.appendChild(tbody);
	
	// Table headers
	const headerRow = document.createElement('tr');
	['System ID', 'Number of Panels', 'Current Output', 'Max Output', 'Year Installed', 'Limiter'].forEach(headerText => {
		const header = document.createElement('th')
		header.textContent = headerText;
		headerRow.appendChild(header);
	});
	thead.appendChild(headerRow);
	
	// Display system specific information
	Promise.all([
		fetchNumPanels(siteName),
		fetchSystemWatts(siteName),
		fetchMaxDailyWatts(siteName),
		fetchYearInstalled(siteName),
		fetchLimiterStatus(siteName)
	]).then(([numPanelsMap, systemWattsMap, maxWattsMap, yearInstalledMap, limiterStatusMap]) => {
		numPanelsMap.forEach((numPanels, systemId) => {
			const row = document.createElement('tr');
			const systemCell = document.createElement('td');
			systemCell.textContent = systemId;
			const numPanelsCell = document.createElement('td');
			numPanelsCell.textContent = numPanels;
			const currentOutputCell = document.createElement('td');
			currentOutputCell.textContent = systemWattsMap.get(systemId) || 'N/A';
			const maxOutputCell = document.createElement('td');
			maxOutputCell.textContent = maxWattsMap.get(systemId) || 'N/A';
			const yearInstalledCell = document.createElement('td');
			yearInstalledCell.textContent = yearInstalledMap.get(systemId) || 'N/A';
			const limiterStatusCell = document.createElement('td');
			limiterStatusCell.textContent = limiterStatusMap.get(systemId) || 'N/A';
			// Append rows
			row.appendChild(systemCell);
			row.appendChild(numPanelsCell);
			row.appendChild(currentOutputCell);
			row.appendChild(maxOutputCell);
			row.appendChild(yearInstalledCell);
			row.appendChild(limiterStatusCell);
			tbody.appendChild(row);
		});
		siteInfoDiv.appendChild(table);
	})
	.catch(error => {
		console.error('Error fetching system information:', error);
	});
	// Append the site info div to the container
    container.appendChild(siteInfoDiv);
}

// Helper function to create info elements
function createInfoElement(label, text) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${label}:</strong> ${text}`;
    return p;
}

function fetchSiteDayWatts(siteName) {
	let wattMap = new Map();
	const 
}



