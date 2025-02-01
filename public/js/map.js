maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: geometry.coordinates, // starting position [lng, lat]
  zoom: 14 // starting zoom
});

// Set optionsf
console.log(geometry.coordinates);
console.log("hi");

const marker = new maptilersdk.Marker({
    color: "#000000",
    draggable: true
  }).setLngLat(geometry.coordinates)
  .addTo(map);

