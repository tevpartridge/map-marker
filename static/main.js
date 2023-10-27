mapboxgl.accessToken =
  "your access token here";   // REPLACE THIS

// init map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [-1.535247402614258, 53.04383545407187], //starting coords
  zoom: 5, // starting zoom,
});
let hoveredPointId = null;

map.on("load", () => {
  map.loadImage("images/marker.png", (error, image) => {
    if (error) throw error;
    
    map.addImage("map-marker", image);

    map.addSource("points", {
      type: "geojson",
      data: "data.geojson",
      generateId: true,
    });
    // Add a symbol layer
    map.addLayer({
      id: "points",
      type: "symbol",
      source: "points",
      layout: {
        "icon-image": "map-marker",
        "icon-size": 0.04,
        "icon-offset": [0, -360],
        "icon-optional": true,
        "text-optional": true,
        "text-size": 12,
        // get the title name from the source's "title" property
        "text-field": ["get", "title"],
        "text-allow-overlap": true,
        "icon-allow-overlap": true,
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-anchor": "top",
      },
      paint: {
        "icon-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.8,
        ],
        "text-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0,
        ],
      },
    });

    // detect when a marker is hovered over
    map.on("mousemove", "points", (e) => {
      if (e.features.length > 0) {
        if (hoveredPointId !== null) {
          map.setFeatureState(
            { source: "points", id: hoveredPointId },
            { hover: false }
          );
        }
        hoveredPointId = e.features[0].id;
        map.setFeatureState(
          { source: "points", id: hoveredPointId },
          { hover: true }
        );
      }
    });

    map.on("mouseleave", "points", () => {
      if (hoveredPointId !== null) {
        map.setFeatureState(
          { source: "points", id: hoveredPointId },
          { hover: false }
        );
      }
      hoveredPointId = null;
    });

    // detect when a marker is clicked
    map.on("click", "points", (e) => {
      if (e.features.length > 0) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      }
    });
  });
});
