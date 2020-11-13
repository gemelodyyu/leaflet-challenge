// Store our API endpoint inside queryUrl
var earthqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var tectonicUrl = ""
// Perform a GET request to the query URL
d3.json(earthqUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": graymap,
    "Outdoors": outdoormap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,

  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [36.1699, -115.1398],
    zoom: 5,
    layers: [satellitemap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


// var myMap = L.map("map", {
//     center: [36.1699, -115.1398],
//     zoom: 6
//   });

// // Define a markerSize function that will give each city a different radius based on its population
// function markerSize(m) {
//     return m*5000;
//   };

// function markerColor(d) {
//     return d > 90 ? 'red' :
//            d > 70  ? 'orange' :
//            d > 50  ? '#feb72a' :
//            d > 30  ? '#f7db10' :
//            d > 10  ? '#ddf400' :
//                       '#a3f700';
// };
// // function markerColor(depth) {
// //     if (depth > 90) {
// //         return 'red'
// //     } else if (depth > 70) {
// //         return 'orange'
// //     } else if (depth > 50) {
// //         return '#feb72a'
// //     } else if (depth > 30) {
// //         return '#f7db10'
// //     } else if (depth > 10) {
// //         return '#ddf400'
// //     } else {
// //         return '#a3f700'
// //     }
// // };
  
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/light-v10",
//     accessToken: API_KEY
// }).addTo(myMap);
  
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 
  
// d3.json(url, function(data) {
//     // console.log(data);
//     var featureData = data.features;
//     // console.log(featureData);

//     // Define array to hold created markers
//     // var markers = []; 

//     for (var i=0; i<featureData.length; i++) {
//         var location = featureData[i].geometry.coordinates; 
//         // console.log(location)

//         if (location) {

//             // markers.push(
//                 L.circle([location[1],location[0]], {
//                     stroke: true,
//                     weight: 1,
//                     fillOpacity: 0.75,
//                     color: "black",
//                     fillColor: markerColor(location[2]),
//                     radius: markerSize(featureData[i].properties.mag)
//                 }).bindPopup("<h3>" + featureData[i].properties.place +
//                 "</h3><hr><p>" + new Date(featureData[i].properties.time) + "</p>").addTo(myMap); 
//         }

//     };

// });


//     // Set up the legend
//     var legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//         var div = L.DomUtil.create("div", "info legend");
//         var grades = [-10,10,30,50,70,90];
//         // var colors = ['#a3f700','#ddf400','#f7db10','#feb72a','orange','red']
//         var labels = [];

//         // loop through density intervals and generate a label with a colored square for each interval
//         for (var i = 0; i < grades.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
//                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }

//         return div;
//     };

//     // Adding legend to the map
//     legend.addTo(myMap);