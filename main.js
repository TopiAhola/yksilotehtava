import {handleAutoLogin} from "./functions.js";

//tarkista onko tokenia
handleAutoLogin();

//tarkista sijainti

//lataa lempiravintola lista
//lataa kartta ja aseta sijainti
//lataa lähin ravintola jos sijainti on






let userLocation = [62, 25];
let locationText = "";
//Try getting location
try {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = [position.coords.latitude, position.coords.longitude]
            console.log(userLocation + "set by callback")
            locationText = "Location from browser";
            drawMap()
        },
        () => {
            console.log("getCurrentPosition not available")
            userLocation = [60, 20];
            console.log("Default location used by callback")
            locationText = "Using default location";
            drawMap()
        }
    );
} catch (error) {
    console.log("Location error");
    userLocation = [0, 0];
    console.log("Default location 2 used")
}

function drawMap() {
    let mapDiv = document.querySelector('#map');
    let map = L.map('map').setView(userLocation, 6);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let redIcon = L.icon(
        {iconUrl: "marker-icon-2x-red.png",
            shadowUrl: 'leaf-shadow.png',
            iconSize:     [25, 41],
            shadowSize:   [50, 82],
            iconAnchor:   [12, 41],
            shadowAnchor: [0, 0],
            popupAnchor:  [0, -41]
        });
    let testMarker = L.marker(userLocation,{icon : redIcon})
        .addTo(map)
        .bindPopup(`<h3>You are here</h3><p>${locationText}</p>`)
        .openPopup();


    for (let r of restaurants) {
        const location = [r.location.coordinates[1], r.location.coordinates[0]];
        let restMarker = L.marker(location).addTo(map).bindPopup(`<h3>${r.name}</h3><p>${r.address}</p>`);
    }
}

