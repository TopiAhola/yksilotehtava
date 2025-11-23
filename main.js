'use strict';

import {
  handleAutoLogin,
  getLocation,
  drawMap,
  setNearestRestaurant,
  createRestElements,
  setFavouriteRestaurant,
  setUser,
  setProfileView
} from "./functions.js";

import {setEventHandlers} from './eventhandlers.js';
import {getRestaurants} from './api.js';
import restaurantsPlaceholder from "./placeholder.js";

////////////////////////////////////////////////////
//main

//sets event handlers to html elements
setEventHandlers();

//see if user token is found, get user, update elements with user's data
let user = handleAutoLogin()

//get location
let userLocation = getLocation();

//get restaurants
let restaurants = getRestaurants();


//update elements when promises are resolved
Promise.all([user, userLocation, restaurants])
  .then(([user, userLocation, restaurants]) => {

      //update profile elements
      setProfileView(user);

      //updates nearest restaurant element, null location uses default element
      setNearestRestaurant(userLocation, restaurants);

      setFavouriteRestaurant(user, restaurants);

      //create elements when restaurants are resolved
      createRestElements(restaurants);

      //draw map, null location uses default map view
      drawMap(userLocation, restaurants);

    },
    (error) => {
      console.log(error);
    }
  );

export {restaurants, user};



