var myMap = L.map("map", {
    center: [36.1699, -115.1398],
    zoom: 6
  });

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(m) {
    return m*5000;
  };


function markerColor(depth) {
    if (depth > 90) {
        return 'red'
    } else if (depth > 70) {
        return 'orange'
    } else if (depth > 50) {
        return '#feb72a'
    } else if (depth > 30) {
        return '#f7db10'
    } else if (depth > 10) {
        return '#ddf400'
    } else {
        return '#a3f700'
    }
};
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);
  
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 
  
d3.json(url, function(data) {
    // console.log(data);
    var featureData = data.features;
    // console.log(featureData);

    // Define array to hold created markers
    // var markers = []; 

    for (var i=0; i<featureData.length; i++) {
        var location = featureData[i].geometry.coordinates; 
        // console.log(location)

        if (location) {

            // markers.push(
                L.circle([location[1],location[0]], {
                    stroke: true,
                    weight: 1,
                    fillOpacity: 0.75,
                    color: "black",
                    fillColor: markerColor(location[2]),
                    radius: markerSize(featureData[i].properties.mag)
                }).bindPopup("<h3>" + featureData[i].properties.place +
                "</h3><hr><p>" + new Date(featureData[i].properties.time) + "</p>").addTo(myMap); 
        }

    };

});


    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10,10,30,50,70,90];
        // var colors = ['#a3f700','#ddf400','#f7db10','#feb72a','orange','red']
        var labels = [];
        
        div.innerHTML += "<h4>Earthquake Depth</h4>";
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