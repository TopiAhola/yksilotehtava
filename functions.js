'use strict';

import {getUser} from "./api.js";
import {
  toggleHighlight,
  closeDialog
} from './eventhandlers.js';


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
 * Creates table row elements from array of restaurants
 * @param restaurantsArray
 */
function createRestElements(restaurantsArray) {
  console.log("Create restaurant elements");
  console.log(restaurantsArray);

  if (Array.isArray(restaurantsArray)) {
    console.log("restaurantsArray is array");

    //Sort restaurants
    restaurantsArray.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    //add elements to document
    for (let r of restaurantsArray) {
      let restaurantElement = document.createElement('tr');
      restaurantElement.setAttribute('class', 'restaurant');
      restaurantElement.setAttribute('listIndex', restaurantsArray.indexOf(r).toString());
      restaurantElement.setAttribute("_id", r._id);
      restaurantElement.addEventListener('click', toggleHighlight);
      restaurantElement.addEventListener('click', createRestaurantDialogEventHandler(r));

      let nameCell = document.createElement('td');
      nameCell.innerHTML = r.name;

      let addressCell = document.createElement('td');
      addressCell.innerHTML = r.address;

      restaurantElement.append(nameCell, addressCell);
      document.querySelector('#restaurants-table-body').append(restaurantElement);
    }


  } else {
    console.log("restaurantsArray is not array!");
  }

  /**
   * Creates an event handler specific to this restaurant
   * @param restaurant
   */
  function createRestaurantDialogEventHandler(restaurant) {
    const handler = (event) => {
      //get and reset dialog
      let dialog = document.querySelector('#restaurant-modal-table-area');
      dialog.innerHTML = ``;

      //add close button
      let closeDialogButton = document.createElement('button');
      closeDialogButton.addEventListener('click', () => {
        dialog.close();
      });
      closeDialogButton.innerHTML = 'Close';
      closeDialogButton.style.fontSize = '1.5em';
      dialog.appendChild(closeDialogButton);

      //add info
      let paragraph = document.createElement('p');

      paragraph.innerHTML = '' + restaurant.name + '<br><br>'
        + 'Address: <br>'
        + restaurant.address + '<br>'
        + restaurant.postalCode + ' ' + restaurant.city + '<br><br>'
        + 'Phone: <br>'
        + restaurant.phone + '<br><br>'
        + 'Company: ' + restaurant.company + '<br>'
      ;
      dialog.appendChild(paragraph);

      //add menu, call updateMenu with menu as target
      let menu = document.createElement('div');
      menu.id = 'menu';
      dialog.appendChild(menu);

      //updateMenu(menu, restaurant._id);


      //get position of row, put dialog there
      let targetRect = event.target.parentElement.getBoundingClientRect();
      let targetPosition = targetRect.bottom;

      //position of end of list
      let listRect = event.target.parentElement.parentElement.getBoundingClientRect();
      let listBottom = listRect.bottom;

      //relative offset to move dialog upward
      let offset = -(listBottom - targetPosition + 1); //+i to cover margin gap in table
      console.log("dialog offset:" + offset);
      dialog.style.top = offset + 'px';
      dialog.style.minWidth = targetRect.width + 'px';
      dialog.show();

    }

    return handler;
  }


}

/**
 * Sets contents nearest restaurant based on location
 * @param userLocation
 */
function setNearestRestaurant(userLocation) {
  console.log('setNearestRestaurant:' + userLocation);
}

/**
 * Sets content to favouriterestaurant element based on users data.
 * @param user
 * @param restaurants
 */
function setFavouriteRestaurant(user, restaurants){
  console.log('setFavouriteRestaurant');
  console.log(user, restaurants);
  const favRestaurantId = Number(user.favouriteRestaurant);
  const favRestaurant = restaurants.find( (r)=> (r === favRestaurantId);

  if (user === null) {
    console.log('user not logged in');

  } else if ( favRestaurant === undefined) {
    console.log('favourite restaurant not found');

  } else if (user && favRestaurant) {
    console.log(user.username +' favourite restaurant '+favRestaurant._id);

  }

}


export {
  handleAutoLogin,
  getLocation,
  drawMap,
  createRestElements,
  setNearestRestaurant,
  setFavouriteRestaurant
}
