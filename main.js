'use strict';

import {handleAutoLogin, getLocation, drawMap} from "./functions.js";
import {getRestaurants} from './api.js';


//tarkista onko tokenia
handleAutoLogin();

//tarkista sijainti
let userLocation = getLocation();
console.log(userLocation);

//hae ravintolat
let restaurants = getRestaurants();

//odota sijaintia ja ravintoloita, sitten piirrä kartta
Promise.all([userLocation, restaurants])
  .then(([ul, r]) => {
    drawMap(ul, r)
  });

//lataa lähin ravintola jos sijainti on
