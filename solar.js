// Full Sites URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarNames()
// Full AllWatts URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarWatts(*)
// Full SiteInfo URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarInfo(%SITE%)
// Full SolarHistory URL: http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999&Query=SolarHistory(SITE,qWattsmin1,DATE*)

const Url="http://belize.expertlearningsystem.org/Knowledge/?SessionID=1234567890:9999";
const Sites="&Query=SolarNames()";
const AllWatts="&Query=SolarWatts(*)";
const siteDayWatts="&Query=SolarHistory(%SITE%,qWattsmin1,%DATE%*)";
const siteInfo="&Query=SolarInfo(%SITE%)";

// Function to display all page information for a selected school
const loadSiteInfo = (siteName) => {
    console.log(`Loading site info for: ${siteName}`);
    // Hide all content sections to ensure a clean slate
    hideAllContentSections();
    // Clear any previously loaded school content
    clearSchoolContent();
    // Load new school content
    loadSiteContent(siteName);
};

// Clears content from all school-specific sections
const clearSchoolContent = () => {
    // List of all container IDs to clear
    ['sitePhotoContainer', 'wattGaugeContainer', 'siteInfoContainer', 'wattsTimeChartContainer', 'graphSection']
        .forEach(id => document.getElementById(id).innerHTML = ''); // Clear content
};

// Loads content for the selected school
const loadSiteContent = (siteName) => {
    // Populate respective containers with new content based on the selected site
    displaySitePhotoSection(siteName);
    displayWattGaugeSection(siteName);
    displaySiteInfoSection(siteName);
    displayDailyWattsGraph(siteName);
    displayWattHourSummarySection(siteName);
    
    // Make the site content container visible after loading new content
    document.getElementById('siteContentContainer').style.display = 'block';
};

// Hides all content sections
const hideAllContentSections = () => {
    // Iterate through all elements with class 'content-section' and hide them
    document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
};

// Function to show a content section and perform any initializations
const showContentSectionById = (sectionId) => {
    // Hide all sections before showing the targeted one to ensure only one section is visible at a time
    hideAllContentSections();
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block'; // Show the section if found
		
        // Collapse the accordion if navigating back to the home page
        if (sectionId === 'homeContent') {
            // This assumes you are using Bootstrap's collapse feature
            // Replace '#collapseSchools' with the actual ID of your accordion collapse element
            const accordionElement = document.getElementById('collapseSchools');
            const bsCollapse = new bootstrap.Collapse(accordionElement, {
                toggle: false // This ensures the accordion is hidden, not toggled
            });
            bsCollapse.hide(); // Explicitly hide the accordion
        }

        // Perform specific initializations based on the sectionId
        switch (sectionId) {
            case 'solarOverviewContent':
                // Fetch and display the live watts bar graph
                displayLiveWattsBarGraph();
                // Initialize the date picker for the solar overview section
                initializeDatePicker();
                break;
            // Add more cases for other sections if necessary
        }
    } else {
        console.error(`No section found with ID: ${sectionId}. Check if the ID is correct.`);
    }
};

// Function to update the active status of navigation links
const updateActiveNavLink = (activeLink) => {
    // Remove 'active' class and underline from all nav links
    document.querySelectorAll('nav .nav-link, nav .dropdown-item').forEach(navLink => {
        navLink.classList.remove('active');
        navLink.style.borderBottom = 'none';  // Clear any underlines
    });

    // Manage the dropdown separately
    const dropdownParent = document.querySelector('.dropdown-toggle');
    if (activeLink.closest('.dropdown-menu')) {
        dropdownParent.classList.add('active');
        dropdownParent.style.borderBottom = '3px solid white';  // Underline the dropdown
    } else {
        dropdownParent.classList.remove('active');
        dropdownParent.style.borderBottom = 'none';  // No underline for dropdown if not active
    }

    // Set the active class and underline for the current active link
    activeLink.classList.add('active');
    activeLink.style.borderBottom = '3px solid white';
};

// Attach event listeners to navigation links
document.querySelectorAll('nav .nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('data-target');
        if (targetId) {
            event.preventDefault(); // Prevent default link behavior
            showContentSectionById(targetId); // Show the targeted content section
            updateActiveNavLink(link); // Update the active link status
        }
    });
});

// Initialize the active nav link on page load
updateActiveNavLink(document.querySelector('nav .nav-link[data-target="homeContent"]')); // Assuming Home is the default active

// Attach event listeners to card buttons
document.querySelectorAll('.card .btn').forEach(button => {
    button.addEventListener('click', (event) => {
        // Retrieve the 'data-target' attribute to identify the target section
        const targetId = button.getAttribute('data-target');
        if (targetId) {
            event.preventDefault(); // Prevent default link behavior
            showContentSectionById(targetId); // Show the targeted content section
        }
    });
});

// Initialize the website content once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    populateDropdown(); // Populate the schools dropdown menu
    populateAccordion(); // Populate the schools accordian
    showContentSectionById('homeContent'); // Show the home content by default
});

document.addEventListener("DOMContentLoaded", function () {
    // Select the navbar toggler button
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarSupportedContent');

    // Function to explicitly collapse the navbar
    function collapseNavbar() {
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click(); // Trigger the navbar toggler button click to collapse
        }
    }

    // Add click event listener to all nav links to collapse the navbar, excluding those that toggle dropdowns
    document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)').forEach(function (element) {
        element.addEventListener('click', function () {
            // Check if the window's width is less than or equal to 768px.
            if (window.innerWidth <= 768) {
                collapseNavbar(); // Collapse the navbar
            }
        });
    });

    // Specifically target dropdown items
    document.querySelectorAll('.navbar-nav .dropdown-menu a').forEach(function (dropdownItem) {
        dropdownItem.addEventListener('click', function () {
            // Collapse the navbar when a dropdown item is clicked
            if (window.innerWidth <= 768) {
                collapseNavbar(); // This should now properly collapse the navbar
            }
        });
    });
});

// Initialize the date picker and attach the event listener to it
const initializeDatePicker = () => {
    const datePicker = document.getElementById('wattHoursDate');
    if (datePicker) {
        datePicker.valueAsDate = new Date(); // Set to today's date as default

        // Attach the change event listener to the date picker
        datePicker.addEventListener('change', () => {
            const selectedDate = datePicker.value;
            updateWattHoursChart(selectedDate);
        });

        // Call updateWattHoursChart for the first time to initialize the chart with the current date
        updateWattHoursChart(datePicker.value);
    } else {
        console.error('Date picker element with id "wattHoursDate" not found.');
    }
};

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
    return fetch(Url + Sites) 
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
            link.href = '#'; 
            link.textContent = site;
            link.classList.add('dropdown-item'); 
            // Add a click event listener for each site
            link.addEventListener('click', function(event) {
                event.preventDefault(); 
                // Change page content based on the site clicked
                console.log(`Site clicked: ${site}`);
                loadSiteInfo(site); // Display content for site
                updateActiveNavLink(link); // Update active link
            });
            listItem.appendChild(link);
            dropdownMenu.appendChild(listItem);
        });
    }).catch(error => {
        console.error('Error populating dropdown:', error);
    });
}

// Function to populate the accordion with school links
function populateAccordion() {
    processSites().then(processedSites => {
        const accordionBody = document.querySelector('#collapseSchools .accordion-body ul.list-group');
        // Clear existing items in the accordion body
        accordionBody.innerHTML = '';
        // Iterate over the sites and create a list item for each
        processedSites.forEach(site => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            const link = document.createElement('a');
            link.href = '#'; 
            link.textContent = site;
            link.classList.add('dropdown-item'); 
            // Add a click event listener for each school link
            link.addEventListener('click', function(event) {
                event.preventDefault(); 
                // Change the page content based on the site clicked
                loadSiteInfo(site); 
            });
            listItem.appendChild(link);
            accordionBody.appendChild(listItem);
        });
    }).catch(error => {
        console.error('Error populating accordion:', error);
    });
}

// Call populateDropdown when the page is ready or when it's appropriate to load the sites
document.addEventListener('DOMContentLoaded', populateDropdown);
document.addEventListener('DOMContentLoaded', populateAccordion);

// Displays the school name and picture section
function displaySitePhotoSection(siteName) {
    
    // Select the container where the site photo will be displayed
    const container = document.getElementById('sitePhotoContainer');
    // Clear previous content
    container.innerHTML = '';
    
    // Create the div that will hold the school name and image
    const sitePhotoDiv = document.createElement('div');
    sitePhotoDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');
    sitePhotoDiv.style.display = 'flex';
    sitePhotoDiv.style.flexDirection = 'column';
    sitePhotoDiv.style.justifyContent = 'center'; // Center content vertically
    sitePhotoDiv.style.height = '100%'; // Make sure the div uses the full height
    
    // Create and append the school name element
    const schoolNameElement = document.createElement('h3');
    schoolNameElement.textContent = siteName;
    schoolNameElement.classList.add('text-center', 'mb-3');
    sitePhotoDiv.appendChild(schoolNameElement);
    
    // Create and append the image element
    const imageElement = document.createElement('img');
    let site = siteName.replace(/\s+/g, ""); // Remove spaces from site name
    // Set the link to the site image
    imageElement.src = 'http://3.15.139.27/BelizeSolar/Images/' + site + '.jpeg';
    imageElement.alt = 'Site Image';
    imageElement.classList.add('img-fluid', 'rounded', 'mx-auto', 'd-block');
    imageElement.style.maxHeight = '100%'; // Limit the height to the container
    imageElement.style.objectFit = 'contain'; // Ensure aspect ratio is maintained
    sitePhotoDiv.appendChild(imageElement);

    // Handle image loading errors by setting a default image
    imageElement.onerror = function() {
        this.onerror = null; // Prevent potential future errors in case the default image also fails
        this.src = 'http://3.15.139.27/BelizeSolar/Images/schoolExample.jpeg'; // Use a default image if the original fails to load
        this.style.display = 'block'; // Ensure the image is displayed even if the default is used
    };

    // Append the site photo div to the container
    container.appendChild(sitePhotoDiv);
}

// Displays the watt gauge section
function displayWattGaugeSection(siteName) {

	// Select the container where the watt gauge will be displayed
    const container = document.getElementById('wattGaugeContainer');
    container.innerHTML = ''; // Clear any existing content

    // Create the div that will hold the watt gauge
    const wattGaugeDiv = document.createElement('div');
    wattGaugeDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');
    wattGaugeDiv.style.position = 'relative';
    wattGaugeDiv.style.height = '100%';

    // Create and append the gauge element with an id that JustGage will use
    const gaugeElement = document.createElement('div');
    gaugeElement.id = 'gauge';
    gaugeElement.style.width = '100%'; 
    gaugeElement.style.height = '100%';
    wattGaugeDiv.appendChild(gaugeElement);
    container.appendChild(wattGaugeDiv);

    // Fetch the total watts and then create the JustGage instance
    let gauge; // Hold the gauge instance for redrawing if needed
    fetchTotalWatts(siteName).then(totalWatts => {
        gauge = new JustGage({
            id: "gauge",
            value: totalWatts,
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
                }
                // Match any other site name 
                else if (siteName !== "Kings College" && value.includes(siteName)) {
                    siteIDs.push(key);
                }
            }
            return siteIDs;
        });
}

// Returns a map containing the most recent watts for each system at a site
function fetchSystemWatts(siteName) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        let promises = siteIDs.map(ID => {
            const MAC = shortMAC(ID);
            const command = Url + siteDayWatts.replace("%SITE%", MAC).replace("%DATE%", todaysDate());
            return fetch(command)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.message.length > 0) {
                        const lastEntry = data.message[data.message.length - 1];
                        const [systemId, , , watts] = lastEntry;
                        return {systemId: systemId, watts: parseInt(watts)};
                    }
                    return {systemId: ID, watts: 0}; // Default to 0 if no data
                });
        });

        return Promise.all(promises).then(results => {
            let systemWatts = new Map();
            results.forEach(result => {
                systemWatts.set(result.systemId, result.watts);
            });
            return systemWatts;
        });
    });
}

// Function to fetch and sum the latest watts data for each system at a given site
function fetchTotalWatts(siteName) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        // Create a promise for each system ID to fetch the latest watts data
        let promises = siteIDs.map(ID => {
            const urlForWatts = Url + siteDayWatts.replace("%SITE%", shortMAC(ID)).replace("%DATE%", todaysDate());
            // Fetch the latest data for each system ID
            return fetch(urlForWatts)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok for ID ' + ID);
                    }
                    return response.json();
                })
                .then(data => {
                    // Extract the last entry which should be the most recent wattage reading
                    if (data.message.length > 0) {
                        const lastEntry = data.message[data.message.length - 1] || [null, null, null, "0"];
                        const [systemId, , , watts] = lastEntry;
                        return parseInt(watts, 10);
                    }
                    return 0;  // Default to 0 watts if no data is available
                });
        });
        // Use Promise.all to wait for all fetch operations to complete
        return Promise.all(promises).then(wattsArray => {
            // Sum up all the watts data from each promise
            const totalWatts = wattsArray.reduce((acc, watts) => acc + watts, 0);
            return totalWatts;  // Return the total watts
        });
    });
}

// Returns a map containing the number of panels for each system at a site
function fetchNumPanels(siteName) {
    // Fetch all system IDs for the given site name
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
                    // Find and return the max watts value for this system 
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
            return maxWattsMap; // Return the Map object
        });
    });
}

// Returns an object containing general system information (location and contact info)
function fetchSiteInfo(siteName) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        let fetchPromises = siteIDs.map(ID => {
            let command = Url + siteInfo.replace("%SITE%", shortMAC(ID));
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
            return siteInfo;
        });
    });
}

// Display site info section
function displaySiteInfoSection(siteName) {
    
    // Select the container where the site info section will be displayed
    const container = document.getElementById('siteInfoContainer');
    container.innerHTML = ''; // Clear existing content
    
    // Create the div that will hold the site info
    const siteInfoDiv = document.createElement('div');
    siteInfoDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');
    siteInfoDiv.style.display = 'flex';
    siteInfoDiv.style.flexDirection = 'column';
    siteInfoDiv.style.height = '100%'; // Use 100% of the container height

    // Display general site information
    fetchSiteInfo(siteName).then(siteInfo => {
        siteInfoDiv.appendChild(createInfoElement('School Name', siteName));
        siteInfoDiv.appendChild(createInfoElement('Location', siteInfo.location));
        siteInfoDiv.appendChild(createInfoElement('Contact Name', siteInfo.contactName));
        siteInfoDiv.appendChild(createInfoElement('Contact Phone', siteInfo.contactPhone));
        siteInfoDiv.appendChild(createInfoElement('Contact Email', siteInfo.contactEmail));
    });

    // Create a container for the table that will hold system specific information
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('table-responsive');
    siteInfoDiv.appendChild(tableContainer);

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
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);

    // Fetch and display system specific information
    Promise.all([
        fetchNumPanels(siteName),
        fetchSystemWatts(siteName),
        fetchMaxDailyWatts(siteName),
        fetchYearInstalled(siteName),
        fetchLimiterStatus(siteName)
    ]).then(([numPanelsMap, systemWattsMap, maxWattsMap, yearInstalledMap, limiterStatusMap]) => {
        numPanelsMap.forEach((numPanels, systemId) => {
            const row = document.createElement('tr');
            row.appendChild(createCell(systemId));
            row.appendChild(createCell(numPanels));
            row.appendChild(createCell(systemWattsMap.get(systemId)));
            row.appendChild(createCell(maxWattsMap.get(systemId)));
            row.appendChild(createCell(yearInstalledMap.get(systemId)));
            row.appendChild(createCell(limiterStatusMap.get(systemId)));
            tbody.appendChild(row);
        });
        // Now that data is loaded, append the table to the table container
        tableContainer.appendChild(table);
    })
    .catch(error => {
        console.error('Error fetching system information:', error);
    });

    // Append the site info div to the container
    container.appendChild(siteInfoDiv);
}

function createCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text || 'N/A'; // Default to 'N/A' if text is falsy
    return cell;
}

// Helper function to create info elements
function createInfoElement(label, text) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${label}:</strong> ${text}`;
    return p;
}

// Returns a map containing system ids, timeList, and wattList
function fetchSiteDayWatts(siteName) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        let promises = siteIDs.map(id => {
            let command = Url + siteDayWatts.replace("%SITE%", shortMAC(id)).replace("%DATE%", todaysDate());
            return fetch(command)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load data for system ${id}: Network response was not ok`);
                    }
                    return response.json();
                })
                .then(data => {
                    let timeList = data.message.map(entry => {
                        const dateTime = new Date(entry[2]);
                        return `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;
                    });
                    let wattList = data.message.map(entry => parseInt(entry[3], 10));
                    return { id, timeList, wattList };
                });
        });

        return Promise.all(promises).then(results => {
            let dailyWattMap = new Map(results.map(result => [result.id, { timeList: result.timeList, wattList: result.wattList }]));
            return dailyWattMap;
        });
    });
}

// Displays the daily watts line graph 
function displayDailyWattsGraph(siteName) {

	const root = document.getElementById('wattsTimeChartContainer');
    root.innerHTML = ''; // Clear existing content

    // Create a container to store all data
    const dailyWattsChartDiv = document.createElement('div');
    dailyWattsChartDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3', 'mb-3', 'd-flex', 'flex-column');
    dailyWattsChartDiv.style.height = '100%'; // Ensure it fills the parent container

    // Create another div for the chart, adapting it for dynamic height
    const chartBoxContainer = document.createElement('div');
    chartBoxContainer.id = 'dailyWattsChartContainer';
    chartBoxContainer.classList.add('border', 'rounded', 'bg-white', 'p-3', 'flex-grow-1', 'd-flex', 'justify-content-center', 'align-items-center');
    // Allows it to grow and fill available space, adjusting to dynamic height

    // Create and insert a loading spinner
    const loadingDiv = createLoadingSpinner();
    chartBoxContainer.appendChild(loadingDiv);

    // Append the chartBoxContainer to the dailyWattsChartDiv
    dailyWattsChartDiv.appendChild(chartBoxContainer);

    // Append the entire dailyWattsChartDiv to the root
    root.appendChild(dailyWattsChartDiv);
    
    fetchSiteDayWatts(siteName).then(dailyWattMap => {
    	// Remove the loading spinner
        chartBoxContainer.removeChild(loadingDiv);
        
        // Preparing the canvas and datasets
        const canvas = document.createElement('canvas');
        chartBoxContainer.appendChild(canvas); // Append the canvas to the chartBoxContainer
        const ctx = canvas.getContext('2d');
        
        const labels = []; // Will hold all unique times across all systems
        const datasets = []; // Will hold the data for each system

        // Prepare labels and datasets
        dailyWattMap.forEach((data, id) => {
            // Ensure all time labels are included
            data.timeList.forEach(time => {
                if (!labels.includes(time)) {
                    labels.push(time);
                }
            });

            // Sort labels to ensure correct order on the x-axis
            labels.sort();

            // Map the wattList to the sorted labels for correct positioning
            const dataPoints = labels.map(label => {
                const index = data.timeList.indexOf(label);
                return index !== -1 ? data.wattList[index] : null; // Use null for missing data points
            });

            // Create a dataset for this system
            datasets.push({
                label: `System ${id}`, // Customize label as needed
                data: dataPoints,
                fill: false,
                borderColor: getRandomColor(), // Assign a unique color to each line
                tension: 0.1
            });
        });

        // Destroy any existing chart instance before creating a new one
        if (window.wattsTimeChart instanceof Chart) {
            window.wattsTimeChart.destroy();
        }

        // Create the line chart
        window.wattsTimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
            	responsive: true,
            	maintainAspectRatio: true, // Set to true to respect the aspect ratio
            	aspectRatio: 2, // Define the aspect ratio of the chart
    			plugins: {
					title: {
						display: true,
						text: 'Watt Summary for ' + todaysDate(),
					}
				},
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Watts'
                        }
                    }
                }
            }
        });

    }).catch(error => {
        console.error('Error creating line graph:', error);
        // Update the UI to show an error message instead of the spinner
        chartBoxContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
    });
}

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Returns an array containing the last 7 days (including today)
function getLastSevenDays() {
	let dates = [];
	for (let i = 0; i < 7; i++) {
		let date = new Date();
		date.setDate(date.getDate()-i);
		let formattedDate = date.toISOString().split('T')[0];
		dates.push(formattedDate);
	}
	return dates;
}

// Returns a map containing watt hours for the last 7 days 
function fetchWattHoursForWeek(siteName) {
    let days = getLastSevenDays();
    let dayTotalsPromises = days.map(day => fetchSiteDailyWattHours(siteName, day)
        .catch(() => 0) 
    );
    return Promise.all(dayTotalsPromises).then(dayTotals => {
        // Construct a map of day to total watt-hours
        let weekHistory = new Map(days.map((day, index) => [day, dayTotals[index]]));
        return weekHistory;
    });
}

// Returns the watt hours for a system on the given date
function fetchSystemDailyWattHours(shortMAC, date) {
    const command = `${Url + siteDayWatts.replace("%SITE%", shortMAC).replace("%DATE%", date)}`;
    return fetch(command)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Error handling for non-2xx responses
            }
            return response.json();
        })
        .then(data => {
            let totalEnergy = 0; // Initialize total energy accumulator in watt-hours

            // Ensure there is more than one data point to calculate differences
            if (data.message.length > 1) {
                // Loop through each entry except the last (no subsequent entry to compare with)
                for (let i = 0; i < data.message.length - 1; i++) {
                    const [ , , currentTimeStr, currentWatts] = data.message[i];
                    const [ , , nextTimeStr, ] = data.message[i + 1];

                    // Parse timestamps and convert to Date objects for time difference calculation
                    const currentTime = new Date(currentTimeStr);
                    const nextTime = new Date(nextTimeStr);

                    // Calculate time difference in hours between consecutive readings
                    const timeDiffHours = (nextTime - currentTime) / (1000 * 3600); // Milliseconds to hours

                    // Assume linear power usage between readings and calculate energy
                    const watts = parseInt(currentWatts, 10);
                    const energyForInterval = watts * timeDiffHours; // Energy = Power * Time
                    totalEnergy += energyForInterval; // Accumulate energy over the day
                }
            } else {
                console.warn('Insufficient data for energy calculation: returning zero.');
            }
            // Output rounded to two decimal places
            return parseFloat(totalEnergy.toFixed(2));
        })
        .catch(error => {
            console.error('Error fetching daily watt hours:', error);
            throw error; // Rethrow after logging to handle it further up the call chain
        });
}

// Returns the total watt-hours for a site on a given day
function fetchSiteDailyWattHours(siteName, date) {
    return fetchSystemIDs(siteName).then(siteIDs => {
        // Map each system ID to a promise that resolves to its daily watt-hours
        let promises = siteIDs.map(ID => {
            return fetchSystemDailyWattHours(shortMAC(ID), date); // Fetch daily watt hours for each system
        });
        // Wait for all promises to resolve, then calculate the total watt hours for the site
        return Promise.all(promises).then(entries => {
            // Sum up all watt hours, initialized to 0
            let siteWattHours = entries.reduce((acc, entry) => acc + parseFloat(entry), 0);
            // Round the result to two decimal places
            siteWattHours = parseFloat(siteWattHours.toFixed(2));
            // Return the total watt hours calculated for the site
            return siteWattHours; 
        });
    }).catch(error => {
        console.error(`Error calculating total watt hours for site ${siteName} on ${date}:`, error);
        throw error; // Rethrow error to handle it further up the call chain if needed
    });
}

// Helper function to format date as "Day, Month Date"
function formatDateWithDay(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    
    return `${dayName}, ${monthName} ${dayOfMonth}`;
}

function displayWattHourWeekSummaryGraph(siteName) {
	
    const graphContainer = document.getElementById('chartContainer');
    graphContainer.innerHTML = '';  // Clear any previously displayed content

    // Create a loading spinner and display it while fetching data
    const loadingDiv = createLoadingSpinner();
    graphContainer.appendChild(loadingDiv);

    // Fetch weekly watt hours data
    fetchWattHoursForWeek(siteName)
        .then(weeklyWattMap => {
            graphContainer.removeChild(loadingDiv);  // Remove the loading spinner once data is fetched

            // Prepare the data for the chart
            const labels = Array.from(weeklyWattMap.keys()).reverse().map(formatDateWithDay);
            const dataPoints = Array.from(weeklyWattMap.values()).reverse();

            // Create a canvas for the chart and add it to the DOM
            const canvas = document.createElement('canvas');
            graphContainer.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            // Initialize the Chart.js bar chart
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Watt Hours',
                        data: dataPoints,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Watt Hour Summary for Last Week'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Day'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Watt Hours'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error displaying watt hour week summary graph:', error);
            graphContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
        });
}

// Helper function to create a loading spinner
function createLoadingSpinner() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-spinner';
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-secondary';
    spinner.setAttribute('role', 'status');
    loadingDiv.appendChild(spinner);
    return loadingDiv;
}

// Sets up graph container with buttons and displays the weekly watt hour chart by default
function displayWattHourSummarySection(siteName) {
    const root = document.getElementById('graphSection');
    root.innerHTML = ''; // Clear existing content

    // Create a container to store all data
    const wattHourChartDiv = document.createElement('div');
    wattHourChartDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3', 'mb-3', 'd-flex', 'flex-column');
    wattHourChartDiv.style.height = '100%'; // Ensure it fills the parent container

    // Create another div for the chart, adapting it for dynamic height
    const chartBoxContainer = document.createElement('div');
    chartBoxContainer.id = 'chartContainer';
    chartBoxContainer.classList.add('border', 'rounded', 'bg-white', 'p-3', 'flex-grow-1', 'd-flex', 'justify-content-center', 'align-items-center');
    // Allows it to grow and fill available space, adjusting to dynamic height

    // Append the chartBoxContainer to the wattHourChartDiv
    wattHourChartDiv.appendChild(chartBoxContainer);

    // Append the entire wattHourChartDiv to the root
    root.appendChild(wattHourChartDiv);

    // Display the weekly watt hour chart by default
    displayWattHourWeekSummaryGraph(siteName);
}

/*
	--------------------------------------------------------------------------------------
	The code below is for the solar overview section. 
	Pick back up here.
	--------------------------------------------------------------------------------------
*/

// Returns a map containing live watts for each site
function getLiveWattsBySchool() {
    let liveWatts = new Map(); // Create a map to hold the live watts by site
    // Process sites and map each to its current live watts
    return processSites().then(processedSites => {
        let promises = processedSites.map(site => {
            return fetchTotalWatts(site)
                .then(watts => {
                    liveWatts.set(site, watts); // Set the site's live watts in the map
                })
                .catch(error => {
                    console.error(`Failed to fetch watts for ${site}:`, error);
                    liveWatts.set(site, 0); // Set to 0 if there's an error fetching data
                });
        });
        return Promise.all(promises).then(() => {
            return liveWatts;
        });
    });
}

// Global flag to keep track of which sites to display
let showAllSites = false;

const displayLiveWattsBarGraph = () => {
    const graphContainer = document.getElementById('liveWattsChartContainer');

    if (!graphContainer) {
        console.error('Live Watts chart container not found.');
        return;
    }

    // Clear the container
    graphContainer.innerHTML = '';

    // Button for toggling the view
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show All Sites';
    toggleButton.classList.add('btn', 'btn-secondary');
    toggleButton.onclick = () => {
        showAllSites = !showAllSites;
        displayLiveWattsBarGraph(); // Redraw the graph with the updated filter
    };

    // Chart setup container with loading spinner
    const chartDiv = document.createElement('div');
    chartDiv.classList.add('p-3', 'border', 'rounded', 'bg-light', 'mt-3');
    chartDiv.style.cssText = `
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f8f9fa;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-top: 20px;
        margin: auto;
    `;

    const loadingDiv = createLoadingSpinner();
    
    // Append the toggle button and loading spinner to the graph container
    graphContainer.appendChild(toggleButton);
    chartDiv.appendChild(loadingDiv); // Add loading spinner inside chartDiv
    graphContainer.appendChild(chartDiv); // Add chartDiv to the graphContainer
    graphContainer.style.display = 'block'; // Make sure the container is visible

    // Fetch data and display chart
    getLiveWattsBySchool().then(liveWatts => {
        // Remove the loading spinner
        chartDiv.removeChild(loadingDiv);

        // Filter sites based on the flag
        const filteredLiveWatts = showAllSites ? liveWatts : new Map([...liveWatts].filter(([key, value]) => value > 0));
        toggleButton.textContent = showAllSites ? 'Show Active Sites Only' : 'Show All Sites';

        // Create a canvas element for the chart
        const canvas = document.createElement('canvas');
        chartDiv.appendChild(canvas); // Append the canvas to the chartDiv
        const ctx = canvas.getContext('2d');

        const labels = Array.from(filteredLiveWatts.keys());
        const dataPoints = labels.map(label => filteredLiveWatts.get(label) || 0);

		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					label: 'Live Watts',
					data: dataPoints,
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					borderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Watts'
						}
					},
					x: {
						title: {
							display: true,
							text: 'School'
						}
					}
				},
				responsive: true,
				maintainAspectRatio: true,
				aspectRatio: 2,
				plugins: {
					title: {
						display: true,
						text: 'Live Watts Summary'
					},
					legend: {
						display: true,
						position: 'top'
					}
				}
			}
		});
    }).catch(error => {
        console.error('Error displaying live watts bar graph:', error);
        // Handle loading error
        graphContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
	});
};

// Returns a map containing system IDs packaged by school 
function getIDsBySchool() {
	let IDMap = new Map();
	return processSites().then(processedSites => {
		let promises = processedSites.map(site => {
			return fetchSystemIDs(site).then(ID => {
				IDMap.set(site, ID);
			});
		});
		return Promise.all(promises).then(() => {
			//console.log(IDMap);
			return IDMap;
		});
	});
}

function getTotalWattHoursForDate(date) {
    return processSites().then(schools => {
        let promises = schools.map(school => {
            return fetchSiteDailyWattHours(school, date)
                .then(wattHours => {
                    return wattHours;
                })
                .catch(error => {
                    return 0; // If there's an error, return 0 for that school
                });
        });

        return Promise.all(promises).then(results => {
            let wattHoursBySchool = new Map(schools.map((school, index) => [school, results[index]]));
            //console.log('Watt hours by school:', wattHoursBySchool);
            return wattHoursBySchool;
        });
    });
}

// Fetch data and update the chart
function updateWattHoursChart(date) {
    displayLoadingSpinner('wattHoursChartContainer'); // Show loading spinner
    return getTotalWattHoursForDate(date).then(wattHoursBySchool => {
        displayWattHoursBarChart(wattHoursBySchool);
    }).catch(error => {
        console.error('Error updating watt hours chart:', error);
    });
}

// Global variable specific to the watt hours chart
let showAllSitesWattHours = false;

// Function to display the loading spinner in a container
function displayLoadingSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = ''; // Clear the container
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-spinner';
        const spinner = document.createElement('div');
        spinner.className = 'spinner-border text-secondary';
        spinner.setAttribute('role', 'status');
        const spinnerText = document.createElement('span');
        spinnerText.className = 'visually-hidden';
        spinnerText.innerText = 'Loading...';
        spinner.appendChild(spinnerText);
        loadingDiv.appendChild(spinner);
        container.appendChild(loadingDiv);
        container.style.display = 'block';
    }
}

// Function to display the watt hour bar chart for all sites in a container
function displayWattHoursBarChart(data) {
    let outerContainer = document.getElementById('wattHoursChartOuterContainer');
    let chartContainer = document.getElementById('wattHoursChartContainer');

    if (!outerContainer || !chartContainer) {
        console.error('Watt hours chart container elements not found.');
        return;
    }
	
    // Clear the container for the new chart (removes loading spinner)
    chartContainer.innerHTML = '';

    let filteredData = showAllSitesWattHours ? data : new Map([...data].filter(([_, value]) => value > 0));

    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    if (window.wattHoursBarChartInstance) {
        window.wattHoursBarChartInstance.destroy();
    }

    window.wattHoursBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from(filteredData.keys()),
            datasets: [{
                label: 'Total Watt Hours',
                data: Array.from(filteredData.values()),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: getChartOptions('Total Watt Hours for Selected Date')
    });

    let toggleButton = document.getElementById('toggleWattHoursButton');
    toggleButton.textContent = showAllSitesWattHours ? "Show Active Sites Only" : "Show All Sites";
    toggleButton.onclick = function() {
        showAllSitesWattHours = !showAllSitesWattHours;
        updateWattHoursChart(document.getElementById('wattHoursDate').value); // Update the chart data and redraw the chart
    };

    outerContainer.style.display = 'block';
}

function getChartOptions(title) {
    return {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Watt Hours'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'School'
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 45
                }
            }
        },
        elements: {
            bar: {
                barThickness: 'flex'
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title
            }
        }
    };
}

// Returns current live watts for the entire country
function fetchLiveWattsForCountry() {
	let liveWatts = 0;
	return getLiveWattsBySchool().then(data => {
		data.forEach(watts => {
			liveWatts += watts; // Sum up the live watts from each school
		});
		// console.log(liveWatts);
		return liveWatts;
	}).catch(error => {
		console.error('Failed to fetch live watts:', error);
		throw error;
	});
}

// Returns watt hours for the entire country today
function fetchTotalWattHoursForToday() {
    const today = new Date();
    // Format date as 'YYYY-MM-DD' expected by getTotalWattHoursForDate
    const dateString = today.toISOString().split('T')[0];
    
    let totalWattHours = 0;
    return getTotalWattHoursForDate(dateString).then(wattHoursBySchool => {
        wattHoursBySchool.forEach(wattHours => {
        	totalWattHours += wattHours;
        })
        //console.log('Total watt hours for all sites:', totalWattHours);
        return totalWattHours;
    }).catch(error => {
        console.error('Failed to calculate total watt hours for today:', error);
        throw error;
    });
}


