// Firebase
const config = {
    apiKey: "AIzaSyCfjWyv1_8URFUk7XYtO6ek7y2SyLuEgm0",
    authDomain: "project-1-90b03.firebaseapp.com",
    databaseURL: "https://project-1-90b03.firebaseio.com",
    projectId: "project-1-90b03",
    storageBucket: "project-1-90b03.appspot.com",
    messagingSenderId: "521789950"
};
firebase.initializeApp(config);
const firebaseDB = firebase.database();
// Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJ1a2VsbHkiLCJhIjoiY2p1ZGpsYzd1MDgyNTQ0bXRqbW5rbXk1dCJ9.IOyAszC7bL2GBhSRgCdAVQ';
// BART API Key
const BART_API_KEY = "MW9S-E7SL-26DU-VV8V";
// BART Query Stations API URL
const queryStations = `https://api.bart.gov/api/stn.aspx?cmd=stns&key=${BART_API_KEY}&json=y`;
// Empty `points` Array 
let points = [];
let lineHexColor = "#fc0";
let targetA = document.querySelector("#pointA");
let targetB = document.querySelector("#pointB");
const addTrip = () => {
    const tripName = document.querySelector("#tripName").value.trim();
    const pointAValue = document.querySelector("#pointA").value;
    const pointBValue = document.querySelector("#pointB").value;
    if (tripName == null || pointAValue == null || pointB == null) {
        // TODO Merge Diana's modal
        return false;
    } else {
        firebaseDB.ref().push({
            tripName,
            pointA: pointAValue,
            pointB: pointBValue
        });
        document.querySelector("form").reset();
        updateTable();
    }
}
const updateTable = () => {
    document.querySelector("tbody").innerHTML = "";
    firebaseDB.ref().on("child_added", (childSnapshot) => {
        let target = document.querySelector("tbody");
        let tr = document.createElement("tr");
        tr.setAttribute("id", childSnapshot.key);
        let cellTripName = document.createElement("td");
        cellTripName.classList.add("ph3")
        cellTripName.innerText = childSnapshot.val().tripName;
        let cellPointA = document.createElement("td");
        cellPointA.classList.add("ph3");
        let cellPointAGPS = document.createElement("td");
        cellPointA.innerHTML = childSnapshot.val().pointA;
        let cellPointB = document.createElement("td");
        cellPointB.classList.add("ph3");
        cellPointB.innerHTML = childSnapshot.val().pointB;
        tr.appendChild(cellTripName);
        tr.appendChild(cellPointA);
        tr.appendChild(cellPointB);
        target.appendChild(tr);
    });
}
// Fetching the API for the dropdowns
fetch(queryStations)
    .then(result => result.json())
    .then(response => {
        let stations = response.root.stations.station;
        // Uncomment next line to preview "stations" as a response
        // and get a better idea of JSON data structure
        // console.log(stations)
        targetA = document.querySelector("#pointA");
        targetB = document.querySelector("#pointB");
        stations.forEach(station => {
            // Create option tag template
            // For Mapbox API specifically, lng first, then lat
            let template = `<option data-bart-abbr="${station.abbr}" data-mapbox-lng="${station.gtfs_longitude}" data-mapbox-lat="${station.gtfs_latitude}" value="${station.name}">${station.name}</option>`;
            // Append template entries into the parent/targeted element
            targetA.innerHTML += template;
            targetB.innerHTML += template;
        });
    });
targetA.addEventListener("change", (event) => {
    let lng = event.target.options[event.target.selectedIndex].getAttribute("data-mapbox-lng");
    let lat = event.target.options[event.target.selectedIndex].getAttribute("data-mapbox-lat");
    points[0] = [parseFloat(lng), parseFloat(lat)];
    if (points.length === 2) drawMap(points, lineHexColor);
});
targetB.addEventListener("change", (event) => {
    let lng = event.target.options[event.target.selectedIndex].getAttribute("data-mapbox-lng");
    let lat = event.target.options[event.target.selectedIndex].getAttribute("data-mapbox-lat");
    points[1] = [parseFloat(lng), parseFloat(lat)];
    if (points.length === 2) drawMap(points, lineHexColor);
});
const drawMap = (points, lineHexColor) => {
    var geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "properties": {},
                "coordinates": points
            }
        }]
    };
    // Mapbox
    // A GeoJSON object with a LineString route from the pointA to pointB
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-122.056012, 37.928468],
        zoom: 12
    });
    map.on('load', function () {
        map.addLayer({
            "id": "LineString",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": geojson
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": lineHexColor,
                "line-width": 5
            }
        });
        // Geographic coordinates of the LineString
        let coordinates = geojson.features[0].geometry.coordinates;
        // Pass the first coordinates in the LineString to `lngLatBounds` &
        // wrap each coordinate pair in `extend` to include them in the bounds
        // result. A variation of this technique could be applied to zooming
        // to the bounds of multiple Points or Polygon geomteries - it just
        // requires wrapping all the coordinates with the extend method.
        let bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        map.fitBounds(bounds, {
            padding: 100
        });
    });
}
// Prevent form default behavior
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
});
// Add trip to Firebase DB
document.querySelector("#addTrip").addEventListener("click", addTrip);
// Refresh the page to start over
document.querySelector("#btnRefresh").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("form").reset();
    window.location.reload();
});
updateTable();