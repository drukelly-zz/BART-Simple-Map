mapboxgl.accessToken = 'pk.eyJ1IjoiZHJ1a2VsbHkiLCJhIjoiY2p1ZGpsYzd1MDgyNTQ0bXRqbW5rbXk1dCJ9.IOyAszC7bL2GBhSRgCdAVQ';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', // stylesheet location
  center: [-122.056012, 37.928468], // starting position [lng, lat]
  zoom: 9 // starting zoom
});