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

//   initialize layer groups
var layers = {
    earthquakes: new L.LayerGroup(),
    tectonic: new L.LayerGroup()
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [40.7128, -74.0060],
    zoom: 3,
    layers: [satellitemap, layers.earthquakes]
});
layers.tectonic.addTo(myMap);

// Create overlay object to hold our overlay layer
var overlayMaps = {
    "Earthquakes": layers.earthquakes,
    "Tectonic Plates": layers.tectonic
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(m) {
    return m * 30000;
};

function markerColor(d) {
    return d > 90 ? 'red' :
        d > 70 ? 'orange' :
            d > 50 ? '#feb72a' :
                d > 30 ? '#f7db10' :
                    d > 10 ? '#ddf400' :
                        '#a3f700';
};

// call earthquake data
d3.json(earthquakeUrl, function (data) {
    // console.log(data);
    var featureData = data.features;
    // console.log(featureData);

    // Define array to hold created markers
    // var markers = []; 

    for (var i = 0; i < featureData.length; i++) {
        var location = featureData[i].geometry.coordinates;
        // console.log(location)

        if (location) {

            // markers.push(
            L.circle([location[1], location[0]], {
                stroke: true,
                weight: 1,
                fillOpacity: 0.75,
                color: "black",
                fillColor: markerColor(location[2]),
                radius: markerSize(featureData[i].properties.mag)
            }).bindPopup("<h3>" + featureData[i].properties.place +
                "</h3><hr><p>" + new Date(featureData[i].properties.time) + "</p>").addTo(layers.earthquakes);
        }
    };
});

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    // var colors = ['#a3f700','#ddf400','#f7db10','#feb72a','orange','red']
    var labels = [];

    // loop through density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Adding legend to the map
legend.addTo(myMap);


// call tectonic data 
d3.json(tectonicUrl, function (tectData) {
    var tectFeature = tectData.features;
    // console.log(tectFeature);

    locations = []; 

    for (var i = 0; i < tectFeature.length; i++) {
        var coordinates = tectFeature[i].geometry.coordinates;
        // console.log(coordinates)

        locations.push(
            coordinates.map(coordinate => [coordinate[1], coordinate[0]])
        );
        // create tectonic lines the the coordinates
        L.polyline(locations,{ 
            color: "orange" 
        }).addTo(layers.tectonic);
    }
});