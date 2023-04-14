function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [37.0902, -95.7129],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {

    // Pull the "stations" property from response.data.
    let features = response.features;
  
    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];
  
    // Loop through the features array.
    for (let index = 0; index < features.length; index++) {
      let feature = features[index];
      let coordinates = feature.geometry.coordinates;
      let magnitude = feature.properties.mag;
  
      //Choose a color based on the depth of the earthquake.
      let color = "";
      if (coordinates[2] > 90) {
        color = "red";
      } else if (coordinates[2] > 70 && coordinates[2] < 90) {
        color = "darkorange";
      } else if (coordinates[2] > 50 && coordinates[2] < 70) {
        color = "orange";
      } else if (coordinates[2] > 30 && coordinates[2] < 50) {
        color = "yellow";
      } else if (coordinates[2] > 10 && coordinates[2] < 30) {
        color = "lightgreen";
      } else {
        color = "green";
      }
      // For each earthquake, create a marker, and bind a popup with the earthquake's information.
      let earthquakeMarker = L.circle([coordinates[1], coordinates[0]], {
        fillOpacity: 1,
        color: "black",
        weight: 1,
        fillColor: color,
        // Adjust the radius.
        radius: parseFloat(magnitude) * 10000
      }).bindPopup("<h3>Earthquake Information</h3><hr><p><strong>Magnitude:</strong> " + magnitude + "</p>");
  
      // Add the marker to the earthquakeMarkers array.
      earthquakeMarkers.push(earthquakeMarker);
    }
  
    // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquakeMarkers));
  }
  
  // Perform an API call to the 7 day all earthquakes site to get the information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
  