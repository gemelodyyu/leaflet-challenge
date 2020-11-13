var myMap = L.map("map", {
    center: [39.7392, -104.9903],
    zoom: 5
  });

// // Define a markerSize function that will give each city a different radius based on its population
// function markerSize(depth) {
//     return depth / 2;
//   }
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);
  
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 
  
d3.json(url, function(data) {
    // console.log(data);
    var featureData = data.features;
    console.log(featureData);

    // Define array to hold created markers
    // var markers = []; 

    for (var i=0; i<featureData.length; i++) {
        var location = featureData[i].geometry.coordinates; 
        // console.log(location)

        if (location) {

            // markers.push(
                L.circle([location[1],location[0]], {
                    stroke: false,
                    fillOpacity: 0.75,
                    color: "white",
                    fillColor: "red",
                    radius: parseInt(location[2])
                }).bindPopup("<h3>" + featureData[i].properties.place +
                "</h3><hr><p>" + new Date(featureData[i].properties.time) + "</p>").addTo(myMap); 
        }

    }

}); 