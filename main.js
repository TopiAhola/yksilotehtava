'use strict';

import {
  handleAutoLogin,
  getLocation,
  drawMap,
  setNearestRestaurant,
  createRestElements,
  setFavouriteRestaurant,
  setUser
} from "./functions.js";

import {setEventHandlers} from './eventhandlers.js';
import {getRestaurants} from './api.js';
import restaurantsPlaceholder from "./placeholder.js";

////////////////////////////////////////////////////
//main

//sets event handlers to html elements
setEventHandlers();

//see if token is found, update the user
const user = handleAutoLogin();
user.then(user => {
  setUser(user);
});

//get location
let userLocation = getLocation();

//get restaurants, use placeholder while waiting for api
let restaurants = restaurantsPlaceholder;
restaurants = getRestaurants();

//create elements when restaurants are resolved
restaurants.then(
  (restaurants) => {
    createRestElements(restaurants);
    setFavouriteRestaurant(user, restaurants);
  }
);

//update elements when location and restaurants are resolved
Promise.all([userLocation, restaurants])
  .then(([ulocation, rest]) => {

    //draw map, null location uses default map view
    drawMap(ulocation, rest);

    //updates nearest restaurant element, null location uses default element
    setNearestRestaurant(ulocation, rest);
  });




