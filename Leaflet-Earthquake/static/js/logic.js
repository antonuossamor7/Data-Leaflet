/////app
console.log("Step 2 working");

var apiKey = "Update API key ";

var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 560,
  maxZoom: 15,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: apiKey
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 550,
  maxZoom: 15,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: apiKey
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 570,
  maxZoom: 12,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: apiKey
});

///// map+zoom

var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 2,
  layers: [graymap, satellitemap, outdoors]
});

// Add graymap
graymap.addTo(map);

/////layers
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

///////*

var baseMaps = {
  Satellite: satellitemap,
  Grayscale: graymap,
  Outdoors: outdoors
};

// 
var overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes
};

//////
L
  .control
  .layers(baseMaps, overlays)
  .addTo(map);

// d3 & functions
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#800000";
    case magnitude > 4:
      return "#d70a53";
    case magnitude > 3:
      return "#177245";
    case magnitude > 2:
      return "#33cc33";
    case magnitude > 1:
      return "#ffff66";
    default:
      return "#1a2421";
    }
  }

  //magnitude 
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // 
  L.geoJson(data, {
     
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
     
    style: styleInfo,
     
     
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
     
  }).addTo(earthquakes);

  ///add to map
  earthquakes.addTo(map);

  var legend = L.control({
    position: "bottomright"
  });
 
  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#1a2421",
      "#ffff66",
      "#33cc33",
      "#177245",
      "#d70a53",
      "#800000"
    ];

  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  
  legend.addTo(map);

  //d3 json 
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
      
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);
      tectonicplates.addTo(map);
    });
});
