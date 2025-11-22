'use strict';

import {getUser} from "./api.js";


const handleAutoLogin = async () => {
  try {

    //get token from local storage
    const token = localStorage.getItem("token");

    //if token exists, get user data from API
    if (token) {
      const userByToken = await getUser(token);

      //set user to state
      if (userByToken) {
        setUser(userByToken);
      }

    } else {
      console.log('No token');
    }

  } catch (e) {
    console.log(e.message);
  }
};

/**
 *
 * @returns {null}
 */
async function getLocation() {
  let userLocation = null;
  let locationText = "";
//Try getting location
  try {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = [position.coords.latitude, position.coords.longitude]
        console.log(userLocation + "set by callback")
        locationText = "Location from browser";
        return userLocation;

      },
      () => {
        console.log("getCurrentPosition not available")
        userLocation = [60, 20];
        console.log("Default location used by callback")
        locationText = "Using default location";
        return null;
      }
    );

  } catch (error) {
    console.log("Location error");
    userLocation = [0, 0];
    console.log("Default location 2 used")
    return null;
  }
}

function drawMap(userLocation, restaurants) {
  let mapDiv = document.querySelector('#map');
  let map = L.map('map').setView(userLocation, 6);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  let redIcon = L.icon(
    {
      iconUrl: "marker-icon-2x-red.png",
      shadowUrl: 'leaf-shadow.png',
      iconSize: [25, 41],
      shadowSize: [50, 82],
      iconAnchor: [12, 41],
      shadowAnchor: [0, 0],
      popupAnchor: [0, -41]
    });
  let testMarker = L.marker(userLocation, {icon: redIcon})
    .addTo(map)
    .bindPopup(`<h3>You are here</h3><p>${locationText}</p>`)
    .openPopup();


  for (let r of restaurants) {
    const location = [r.location.coordinates[1], r.location.coordinates[0]];
    let restMarker = L.marker(location).addTo(map).bindPopup(`<h3>${r.name}</h3><p>${r.address}</p>`);
  }
}


export {handleAutoLogin, getLocation, drawMap}
