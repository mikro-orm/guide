//https://leaflet-extras.github.io/leaflet-providers/preview/

// --------------------------------------------------------------- //
// --------------- Layer links and attribution ------------------- //
// --------------------------------------------------------------- //

const osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
const cartoDB = '<a href="http://cartodb.com/attributions">CartoDB</a>';
// const stamenToner = <a href="http://maps.stamen.com">StamenToner</a>

const osmUrl = "http://tile.openstreetmap.org/{z}/{x}/{y}.png";
const osmAttrib = `&copy; ${osmLink} Contributors`;

const landUrl =
  "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png";
const cartoAttrib = `&copy; ${osmLink} Contributors & ${cartoDB}`;

const osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib });
const landMap = L.tileLayer(landUrl, { attribution: cartoAttrib });

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

let baseLayers = {
  Klassika: osmMap,
  "Dark mode": landMap,
};

L.control.layers(baseLayers).addTo(map);

// ------------------------------------------------------ //
// ---------------------- Sidebar ----------------------- //
// ------------------------------------------------------ //
// sidebar

const menuItems = document.querySelectorAll(".menu-item");
const sidebar = document.querySelector(".sidebar");
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
  const categoryDropdown = document.getElementById('categoryDropdown');
  const subcategoryDropdown = document.getElementById('subcategoryDropdown');
  const dateOfBirthStartInput = document.getElementById('dobStart');
  const dateOfBirthEndInput = document.getElementById('dobEnd');
  const applyFiltersButton = document.getElementById('applyFiltersButton');
  const clearFiltersButton = document.getElementById('clearFiltersButton');

  const updateFilterButtons = () => {
    const filters = getFilters()
    const isAnyFilterSet = Object.keys(filters).length > 0

    applyFiltersButton.disabled = !isAnyFilterSet
    clearFiltersButton.style.display = isAnyFilterSet ? 'block' : 'none'
  }

  // Fetch categories and populate the dropdown
  fetch('/category')
    .then(response => response.json())
    .then(categories => {
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching categories:', error));

  // Fetch subcategories based on selected category
  function fetchSubcategories(category) {
    subcategoryDropdown.disabled = false;
    subcategoryDropdown.innerHTML = '<option value="">Vali alamkategooria</option>';

    fetch('/category')
      .then(response => response.json())
      .then(categories => {
        const selectedCategory = categories.find(cat => cat.name === category);
        if (selectedCategory) {
          selectedCategory.subCategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategoryDropdown.appendChild(option);
          });
        }
      })
      .catch(error => console.error('Error fetching subcategories:', error));
  }

  // Generate filters object based on user input
  function getFilters() {
    const selectedCategory = categoryDropdown.value;
    const selectedSubcategory = subcategoryDropdown.value;
    const dobStart = dateOfBirthStartInput.value.trim();
    const dobEnd = dateOfBirthEndInput.value.trim();

    const filters = {};

    if (selectedCategory) filters.category = selectedCategory;
    if (selectedSubcategory) filters.subcategory = selectedSubcategory;
    if (dobStart) filters.dateOfBirthStart = dobStart;
    if (dobEnd) filters.dateOfBirthEnd = dobEnd;

    return filters;
  }

  // Event listener for category change
  categoryDropdown.addEventListener('change', event => {
    const selectedCategory = event.target.value;
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      subcategoryDropdown.innerHTML = '<option value="">Vali alamkategooria</option>';
      subcategoryDropdown.disabled = true;
    }

    updateFilterButtons()
  });

  [subcategoryDropdown, dateOfBirthStartInput, dateOfBirthEndInput].forEach(input => {
    input.addEventListener('input', updateFilterButtons);
  })

  // Add event listener to the "Apply Filters" button
  applyFiltersButton.addEventListener('click', () => {
    const filters = getFilters();
    loadMarkers(filters); // Call marker loading with filters
  });

  clearFiltersButton.addEventListener('click', () => {
    categoryDropdown.value = '';
    subcategoryDropdown.value = '';
    subcategoryDropdown.disabled = true
    dateOfBirthStartInput.value = '';
    dateOfBirthEndInput.value = '';

    loadMarkers()
    updateFilterButtons()
  })

  updateFilterButtons()
});

// ------------------------------------------------------- //
// --------------- Load Markers to the map --------------- //
// ------------------------------------------------------- //

// Load markers onto the map
function loadMarkers(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const endpoint = `http://127.0.0.1:3001/person/markers${params ? `?${params}` : ''}`;

  fetch(endpoint)
    .then(response => response.json())
    .then(markerData => {
      // Clear existing markers from the cluster group
      markers.clearLayers();

      markerData.forEach(data => {
        const { xCoordinate, yCoordinate, title, description } = data;

        const marker = L.marker(new L.LatLng(xCoordinate, yCoordinate), {
          icon: createCustomDivIcon(),
          title: title,
        });

        const popupContent = document.createElement('div');
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        popupContent.appendChild(titleElement);
        const bodyElement = document.createElement('div');
        bodyElement.innerHTML = description;
        bodyElement.style.maxHeight = "200px";
        bodyElement.style.overflowY = "auto";
        bodyElement.style.padding = "10px";
        bodyElement.style.border = "1px solid #ccc";
        popupContent.appendChild(bodyElement);

        marker.bindPopup(popupContent);
        marker.on('click', clickZoom);

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    })
    .catch(error => console.error('Error fetching marker data:', error));
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