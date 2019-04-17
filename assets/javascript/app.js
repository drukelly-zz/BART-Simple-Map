
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
const selectGroups = document.querySelectorAll("select");
selectGroups.forEach(select => {
    select.addEventListener("change", () => {
        console.log(event.target.options[event.target.selectedIndex].getAttribute("data-mapbox-gps"))
    });
})

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