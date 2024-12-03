//https://leaflet-extras.github.io/leaflet-providers/preview/

// --------------------------------------------------------------- //
// --------------- Layer links and attribution ------------------- //
// --------------------------------------------------------------- //

const osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

const osmUrl = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
const osmAttrib = `&copy; ${osmLink} Contributors`;


const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });

// ---------------------------------------------------- //
// ------------------- Map config --------------------- //
// ---------------------------------------------------- //
// config map
let config = {
  // See siin määrab ära default mapi
  layers: [osmMap],
  minZoom: 5,
  maxZoom: 18,
};

// magnification with which the map will start
const zoom = 8;
// coordinates
const lat = 58.636856;
const lng = 25.334473;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);
// Scale: imperial (miles) is set to false, only the metric scale is implemented
L.control.scale({ imperial: false, maxWidth: 100 }).addTo(map);

// osm layer
osmMap.addTo(map);


// ------------------------------------------------------ //
// ---------------------- Sidebar ----------------------- //
// ------------------------------------------------------ //
// sidebar

const menuItems = document.querySelectorAll(".menu-item");
const buttonClose = document.querySelector(".close-button");
menuItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const target = e.target;

    if (
      target.classList.contains("active-item") ||
      !document.querySelector(".active-sidebar")
    ) {
      document.body.classList.toggle("active-sidebar");
    }

    // show content
    showContent(target.dataset.item);
    // add active class to menu item
    addRemoveActiveItem(target, "active-item");
  });
});

// close sidebar when click on close button
buttonClose.addEventListener("click", () => {
  closeSidebar();
});

// remove active class from menu item and content
function addRemoveActiveItem(target, className) {
  const element = document.querySelector(`.${className}`);
  target.classList.add(className);
  if (!element) return;
  element.classList.remove(className);
}

// show specific content
function showContent(dataContent) {
  const idItem = document.querySelector(`#${dataContent}`);
  addRemoveActiveItem(idItem, "active-content");
}

// --------------------------------------------------
// close when click esc
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeSidebar();
  }
});

// close sidebar when click outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".sidebar")) {
    closeSidebar();
  }
});

// --------------------------------------------------
// close sidebar

function closeSidebar() {
  document.body.classList.remove("active-sidebar");
  const element = document.querySelector(".active-item");
  const activeContent = document.querySelector(".active-content");
  if (!element) return;
  element.classList.remove("active-item");
  activeContent.classList.remove("active-content");
}

// ------------------------------------------------------------ //
// ------------------ Marker/Cluster config ------------------- //
// ------------------------------------------------------------ //

// L.MarkerClusterGroup extends L.FeatureGroup
// by clustering the markers contained within
let markers = L.markerClusterGroup({
  spiderfyOnMaxZoom: true, // Disable spiderfying behavior
  showCoverageOnHover: false, // Disable cluster spiderfier polygon
});

// Create a custom divIcon with a small circle
function createCustomDivIcon() {
  return L.divIcon({
    className: "custom-div-icon",
    html: '<div class="circle-icon"></div>',
    iconSize: [12, 12],
  });
}

// ---------------------------------------------------- //
// --------------- Back to home button ---------------- //
// ---------------------------------------------------- //
const htmlTemplate =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 18.451L16 6.031 0 18.451v-5.064L16 .967l16 12.42zM28 18v12h-8v-8h-8v8H4V18l12-9z" /></svg>';
// const htmlTemplate = 'img/search_icon.png'

// create custom button
const customControl = L.Control.extend({
  // button position
  options: {
    position: "topleft",
  },

  // method
  onAdd: function (map) {
    console.log(map.getCenter());
    // create button
    const btn = L.DomUtil.create("button");
    btn.title = "tagasi algusesse";
    btn.innerHTML = htmlTemplate;
    btn.className += "leaflet-bar back-to-home hidden";

    return btn;
  },
});

// adding new button to map control
map.addControl(new customControl());

// on drag end
map.on("moveend", getCenterOfMap);

const buttonBackToHome = document.querySelector(".back-to-home");

function getCenterOfMap() {
  buttonBackToHome.classList.remove("hidden");

  buttonBackToHome.addEventListener("click", () => {
    map.flyTo([lat, lng], zoom);
  });

  map.on("moveend", () => {
    const { lat: latCenter, lng: lngCenter } = map.getCenter();

    const latC = latCenter.toFixed(3) * 1;
    const lngC = lngCenter.toFixed(3) * 1;

    const defaultCoordinate = [+lat.toFixed(3), +lng.toFixed(3)];

    const centerCoordinate = [latC, lngC];

    if (compareToArrays(centerCoordinate, defaultCoordinate)) {
      buttonBackToHome.classList.add("hidden");
    }
  });
}

const compareToArrays = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------------------------------------------------- //
// ---------------------- MiniMap --------------------- //
// ---------------------------------------------------- //
// MiniMap
const osm2 = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 13 });
new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

// ------------------------------------------------------ //
// ---------------------- Filtering ----------------------//
// ------------------------------------------------------ //

document.addEventListener('DOMContentLoaded', () => {
  const categoryContainer = document.getElementById('categoryContainer');
  const subcategoryContainer = document.getElementById('subcategoryContainer');
  const dateOfBirthStartInput = document.getElementById('dobStart');
  const dateOfBirthEndInput = document.getElementById('dobEnd');
  const applyFiltersButton = document.getElementById('applyFiltersButton');
  const clearFiltersButton = document.getElementById('clearFiltersButton');

  const updateFilterButtons = () => {
    const filters = getFilters();
    const isAnyFilterSet = Object.keys(filters).length > 0;
    applyFiltersButton.disabled = !isAnyFilterSet;
    clearFiltersButton.style.display = isAnyFilterSet ? 'block' : 'none';
  };

  // Fetch categories and populate checkboxes
  fetch('/category')
    .then(response => response.json())
    .then(categories => {
      categories.forEach(category => {
        const categoryCheckbox = document.createElement('input');
        categoryCheckbox.type = 'checkbox';
        categoryCheckbox.value = category.name;
        categoryCheckbox.id = `category-${category.name}`;
        
        const label = document.createElement('label');
        label.setAttribute('for', categoryCheckbox.id);
        label.textContent = category.name;

        // Append category checkbox and label to container
        const categoryDiv = document.createElement('div');
        categoryDiv.appendChild(categoryCheckbox);
        categoryDiv.appendChild(label);
        categoryContainer.appendChild(categoryDiv);
      });
    })
    .catch(error => console.error('Error fetching categories:', error));

  // Fetch subcategories based on selected categories
  function fetchSubcategories() {
    subcategoryContainer.innerHTML = '';  // Reset subcategory container

    const selectedCategories = Array.from(categoryContainer.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);

    // Fetch categories again to get their subcategories
    fetch('/category')
      .then(response => response.json())
      .then(categories => {
        const subcategories = new Set(); // Use a Set to avoid duplicate subcategories

        // Loop through selected categories and collect their subcategories
        selectedCategories.forEach(selectedCategory => {
          const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);
          if (selectedCategoryData) {
            selectedCategoryData.subCategories.forEach(subcategory => {
              subcategories.add(subcategory); // Add subcategory to Set (no duplicates)
            });
          }
        });

        // Add the subcategories as checkboxes to the container
        subcategories.forEach(subcategory => {
          const subcategoryCheckbox = document.createElement('input');
          subcategoryCheckbox.type = 'checkbox';
          subcategoryCheckbox.value = subcategory;
          subcategoryCheckbox.id = `subcategory-${subcategory}`;

          const label = document.createElement('label');
          label.setAttribute('for', subcategoryCheckbox.id);
          label.textContent = subcategory;

          const subcategoryDiv = document.createElement('div');
          subcategoryDiv.appendChild(subcategoryCheckbox);
          subcategoryDiv.appendChild(label);
          subcategoryContainer.appendChild(subcategoryDiv);
        });
      })
      .catch(error => console.error('Error fetching subcategories:', error));
  }

  // Generate filters object based on user input
  function getFilters() {
    const selectedCategories = Array.from(categoryContainer.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);
    const selectedSubcategories = Array.from(subcategoryContainer.querySelectorAll('input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.value);
    const dobStart = dateOfBirthStartInput.value.trim();
    const dobEnd = dateOfBirthEndInput.value.trim();

    const filters = {};

    if (selectedCategories.length > 0) filters.category = selectedCategories.join(',');
    if (selectedSubcategories.length > 0) filters.subcategory = selectedSubcategories.join(',');
    if (dobStart) filters.dateOfBirthStart = dobStart;
    if (dobEnd) filters.dateOfBirthEnd = dobEnd;

    return filters;
  }

  // Event listener for category change (checkbox change)
  categoryContainer.addEventListener('change', () => {
    fetchSubcategories(); // Re-fetch subcategories when category changes
    updateFilterButtons(); // Update filter buttons when category changes
  });

  // Event listeners for inputs (subcategory checkboxes, date inputs)
  [dateOfBirthStartInput, dateOfBirthEndInput].forEach(input => {
    input.addEventListener('input', updateFilterButtons);
  });

  subcategoryContainer.addEventListener('change', updateFilterButtons);

  // Add event listener to the "Apply Filters" button
  applyFiltersButton.addEventListener('click', () => {
    const filters = getFilters();
    loadMarkers(filters); // Call marker loading with filters
  });

  // Clear filters and reset UI
  clearFiltersButton.addEventListener('click', () => {
    categoryContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    subcategoryContainer.innerHTML = ''; // Clear subcategories
    dateOfBirthStartInput.value = '';
    dateOfBirthEndInput.value = '';
    loadMarkers(); // Reload markers without filters
    updateFilterButtons(); // Update filter buttons visibility
    map.flyTo([lat, lng], zoom)
  });

  updateFilterButtons(); // Initialize filter buttons state
});

// ------------------------------------------------------- //
// --------------- Load Markers to the map --------------- //
// ------------------------------------------------------- //

// Load markers onto the map
function loadMarkers(filters = {}) {
  const loadingOverlay = document.getElementById('loadingOverlay')
  loadingOverlay.style.display = 'flex' //add loading spinner

  const params = new URLSearchParams(filters).toString();
  const endpoint = `http://127.0.0.1:3001/person/markers${params ? `?${params}` : ''}`;

  fetch(endpoint)
    .then(response => response.json())
    .then(markerData => {
      // Clear existing markers from the cluster group
      markers.clearLayers();

      markerData.forEach(data => {
        const {
          xCoordinate,
          yCoordinate,
          title,
          description,
          occupation,
          dateOfBirth,
          dateOfDeath,
          nicknames,
          categories,
          subCategories,
        } = data

        const marker = L.marker(new L.LatLng(xCoordinate, yCoordinate), {
          icon: createCustomDivIcon(),
          title: title,
        });

        // Create popup content
        const popupContent = document.createElement('div');

        // Add title
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        popupContent.appendChild(titleElement);

        // Add occupation
        if (occupation) {
          const occupationElement = document.createElement('p');
          occupationElement.innerHTML = `<strong>Ametid:</strong> ${occupation}`;
          occupationElement.style.margin = '5px 0'
          popupContent.appendChild(occupationElement);
        }

        if (nicknames && nicknames.length > 0) {
          const nicknameElement = document.createElement('p');
          nicknameElement.innerHTML = `<strong>Varjunimed:</strong> ${nicknames.join(', ')}`;
          nicknameElement.style.margin = '5px 0'
          popupContent.appendChild(nicknameElement);
        }

        if (dateOfBirth) {
          const dateOfBirthElement = document.createElement('p');
          dateOfBirthElement.innerHTML = `<strong>Sünnikuupäev:</strong> ${dateOfBirth}`;
          dateOfBirthElement.style.margin = '5px 0'
          popupContent.appendChild(dateOfBirthElement);
        }

        if (dateOfDeath) {
          const dateOfDeathElement = document.createElement('p');
          dateOfDeathElement.innerHTML = `<strong>Surmaaeg:</strong> ${dateOfDeath}`;
          dateOfDeathElement.style.margin = '5px 0'
          popupContent.appendChild(dateOfDeathElement);
        }

        if (categories && categories.length > 0) {
          const categorieElement = document.createElement('p');
          categorieElement.innerHTML = `<strong>Kategooriad:</strong> ${categories.join(', ')}`;
          categorieElement.style.margin = '5px 0'
          popupContent.appendChild(categorieElement);
        }

        if (subCategories && subCategories.length > 0) {
          const subCategoriesElement = document.createElement('p');
          subCategoriesElement.innerHTML = `<strong>Alam Kategooriad:</strong> ${subCategories.join(', ')}`;
          subCategoriesElement.style.margin = '5px 0'
          popupContent.appendChild(subCategoriesElement);
        }

        // Add description
        if (description) {
          const descriptionElement = document.createElement('div');
          descriptionElement.innerHTML = description;
          descriptionElement.style.maxHeight = "200px";
          descriptionElement.style.overflowY = "auto";
          descriptionElement.style.padding = "10px";
          descriptionElement.style.border = "1px solid #ccc";
          popupContent.appendChild(descriptionElement);
        }

        marker.bindPopup(popupContent);
        marker.on('click', clickZoom);

        markers.addLayer(marker);
      });

      map.addLayer(markers);
      loadingOverlay.style.display = 'none'
    })
    .catch(error => {
      console.error('Error fetching marker data:', error)
      loadingOverlay.style.display = 'none'
    });
}

// Load initial markers without filters when the page loads
window.addEventListener('load', () => loadMarkers());

// ---------------------------------------------------- //
// --------------- Search functionality --------------- //
// ---------------------------------------------------- //

// Searchbox
let searchbox = L.control.searchbox({
    position: "topright",
    expand: "left",
}).addTo(map);

// Close and clear searchbox 600ms after pressing "ENTER" in the search box
searchbox.onInput("keyup", function (e) {
  getPersonByName(searchbox.getValue())
  if (e.keyCode === 13 || e.keyCode === 27) {
    setTimeout(() => {
      searchbox.hide()
      searchbox.clear()
    }, 300)
  }
});

// Close and clear searchbox 600ms after clicking the search button
searchbox.onButton("click", function () {
  getPersonByName(searchbox.getValue())
  setTimeout(() => {
    searchbox.hide()
    searchbox.clear()
  }, 300)
});

function getPersonByName(name) {
  if (name !== "") {
    if (map.getZoom() < 11) {
      map.setZoom(11);
    }
    const searchUrl = `http://127.0.0.1:3001/person/search?name=${encodeURIComponent(name)}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
          const persons = data;

          // Clear the existing dropdown options
          searchbox.clearItems();

          persons.forEach(person => {
            searchbox.addItem(person.title)
          });

          // Add click event listener to search result items
          const searchResultItems = searchbox.getValue();

          if (typeof searchResultItems === "string") {
            const selectedValue = searchResultItems;
            const marker = findMarkerByTitle(selectedValue);
            if (marker) {
              const popup = marker.getPopup();
              if (popup) {
                // Check if the marker is part of a cluster
                const cluster = marker.__parent;
                if (cluster) {
                  console.log("Zoom level for search:", map.getZoom());
                  // Zoom to the cluster bounds
                  map.fitBounds(cluster.getBounds());

                  // Open the cluster after zooming
                  setTimeout(() => {
                    cluster.spiderfy();
                  }, 100);

                  // Open the marker's popup after a short delay
                  setTimeout(() => {
                    marker.openPopup();
                  }, 200);
                } else {
                  // Center the map on the marker and open the popup
                  map.setView(marker.getLatLng(), map.getMaxZoom());
                  marker.openPopup();
                }
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
  } else {
    searchbox.clearItems();
  }
}

function findMarkerByTitle(title) {
  const markerData = markers.getLayers();
  for (const marker of markerData) {
    // see töötab, leiab inimese nimed (title) üles
    if (marker.options.title === title) {
      return marker;
    }
  }
  return null;
}

// center the map when popup is clicked
function clickZoom(e) {
  const marker = e.target;

  if (!marker.__parent) {
    // Marker is not part of a cluster
    map.setView(cluster.getLatLng(), map.getMaxZoom() + 3);
  }
}