'use strict';

import {getUser} from "./api.js";
import {toggleHighlight, showDialog} from './eventhandlers.js';


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

  //wait for promise to resolve with a callback function
  let userLocation = await new Promise((resolve, reject) => {
    //Try getting location
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.latitude, position.coords.longitude]
          console.log(loc + "set by callback")
          resolve(loc);
        },
        () => {
          console.log("getCurrentPosition not available")
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 4000,
          maximumAge: 0,
        }
      );

    } catch (error) {
      console.log("Location error");
      reject(null)
    }

  });

  //return location when resolved
  return userLocation;

}

function drawMap(userLocation, restaurants) {
  console.log('drawMap:');
  console.log(userLocation);
  console.log(restaurants);

  //if null location
  const defaultLocation = false;
  if (userLocation === null) {
    console.log('Map default location');
    const defaultLocation = true;
    userLocation = [60.2, 24.8];
  }

  let mapDiv = document.querySelector('#map');
  let map = L.map('map').setView(userLocation, 12);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  //custom icon for user //TODO: icons for restaurants
  let redIcon = L.icon(
    {
      iconUrl: "./assets/marker-icon-2x-red.png",
      //shadowUrl: 'leaf-shadow.png',
      iconSize: [25, 41],
      shadowSize: [50, 82],
      iconAnchor: [12, 41],
      shadowAnchor: [0, 0],
      popupAnchor: [0, -41]
    });

  //show user location only if location is not default
  if (!defaultLocation) {
    let userMarker = L.marker(userLocation, {icon: redIcon})
      .addTo(map)
      .bindPopup(`<h3>You are here</h3>`)
      .openPopup();
  }


  for (let r of restaurants) {
    const location = [r.location.coordinates[1], r.location.coordinates[0]];
    let restMarker = L.marker(location).addTo(map).bindPopup(`<h3>${r.name}</h3><p>${r.address}</p>`);
  }
}

/**
 *
 * @param restaurantsArray
 */
function createRestElements(restaurantsArray) {
  console.log("Create restaurant elements");
  console.log(restaurantsArray);

  //Sort restaurants //TODO: poista tämä?
  if (Array.isArray(restaurantsArray)) {
    console.log("restaurantsArray is array");
  } else {
    console.log("restaurantsArray is not array!");
    let restArray = restaurantsArray.data;
    console.log(restaurantsArray);
  }

  restaurantsArray.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  /*restaurants = restaurantsArray;*/ //mitä tämä tekee?

  for (let r of restaurantsArray) {
    let restaurantElement = document.createElement('tr');
    restaurantElement.setAttribute('class', 'restaurant');
    restaurantElement.setAttribute('listIndex', restaurantsArray.indexOf(r).toString());
    restaurantElement.addEventListener('click', toggleHighlight);
    restaurantElement.addEventListener('click', showDialog);

    let nameCell = document.createElement('td');
    nameCell.innerHTML = r.name;

    let addressCell = document.createElement('td');
    addressCell.innerHTML = r.address;

    restaurantElement.append(nameCell, addressCell);
    document.querySelector('#restaurants-table').append(restaurantElement);
  }
}

/**
 * Sets contents nearest restaurant based on location
 * @param userLocation
 */
function setNearestRestaurant(userLocation) {
  console.log('setNearestRestaurant:' + userLocation);
}


export {
  handleAutoLogin,
  getLocation,
  drawMap,
  createRestElements,
  setNearestRestaurant
}
