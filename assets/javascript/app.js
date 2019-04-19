// Initialize Firebase
var config = {
    apiKey: "AIzaSyCfjWyv1_8URFUk7XYtO6ek7y2SyLuEgm0",
    authDomain: "project-1-90b03.firebaseapp.com",
    databaseURL: "https://project-1-90b03.firebaseio.com",
    projectId: "project-1-90b03",
    storageBucket: "project-1-90b03.appspot.com",
    messagingSenderId: "521789950"
};
firebase.initializeApp(config);

// Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJ1a2VsbHkiLCJhIjoiY2p1ZGpsYzd1MDgyNTQ0bXRqbW5rbXk1dCJ9.IOyAszC7bL2GBhSRgCdAVQ';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', // stylesheet location
  center: [-122.056012, 37.928468], // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// Setting up variables with which the BART API will be accessed.
const API_KEY = "MW9S-E7SL-26DU-VV8V";
const CMD = "stns";
const queryURL = `https://api.bart.gov/api/stn.aspx?cmd=${CMD}&key=${API_KEY}&json=y`;

// Fetching the API.
fetch(queryURL)
    .then(result => result.json())
    .then(response => {
        let stations = response.root.stations.station;
        // Uncomment next line to preview "stations" as a response
        // console.log(stations)
        let targetA = document.querySelector("#pointA");
        let targetB = document.querySelector("#pointB");
        stations.forEach(station => {
            // For Mapbox API, lng first, then lat
            let template = `<option data-mapbox-gps="${station.gtfs_longitude},${station.gtfs_latitude}"value="${station.name}">${station.name}</option>`;
            targetA.innerHTML += template;
            targetB.innerHTML += template;
        });
    });

var points = [];

// Targets the select dropdown.
const selectGroups = document.querySelectorAll("select");
selectGroups.forEach(select => {
    select.addEventListener("change", () => {
        points.push([event.target.options[event.target.selectedIndex].getAttribute("data-mapbox-gps")]);
        // Two Points on a Map
        console.log(points);

        if (points.length > 1) {
            drawMap(points);
        }
    });
});

function drawMap(points) {
    console.log(points);
    // Two Points on a Map
    map.on('load', function () {
        // First line
        // Note of the id name
        map.addLayer({
            "id": "route1",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                           points[0],
                           points[1]
                        ]
                    }
                }
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#FFD700",
                "line-width": 8
            }

        });
    });
}


//Function for activating the modal.
function modalTrigger() {
    // Get the modal
    var modal = document.getElementById('formModal');

    // Get the button that opens the modal
    var btn = document.getElementById("modalBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //Prevents the form from being submitted.
    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();

    })
}

