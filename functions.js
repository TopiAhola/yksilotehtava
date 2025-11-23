'use strict';

import {getDailyMenu, getUser, getWeeklyMenu} from "./api.js";
import {
  toggleHighlight,
  closeDialog
} from './eventhandlers.js';

import {restaurants} from './main.js'


async function handleAutoLogin() {
  try {

    //get token from local storage
    const token = localStorage.getItem("token");

    //if token exists, get user data from API
    if (token) {
      console.log('token found by handleAutoLogin')
      const user = await getUser(token);


      if (user) {
        console.log('user found in handleAutoLogin');
        console.log(user);
        return user;

      } else {
        console.log('no user found in handleAutoLogin');
        return null;
      }


    } else {
      console.log('No token');
      return null;
    }

  } catch (e) {
    console.log(e.message);
    return null;
  }
}


/**
 * Sets the user after login or update.
 * @param user
 */
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));

  //update users favourite restaurant restaurants Promise has to be resolved
  restaurants.then(
    (restaurants) => {
      setFavouriteRestaurant(user, restaurants);
    },
    (error) => {
      console.log(error);
    }
  );

  //update profile view element
  setProfileView(user);

  //go to home page
  displayView("home-view");

}

/**
 * Sets view to given view class element. Calls hideViews() to hide other views.
 * @param navigationTarget
 */
function displayView(navigationTarget) {
//hide all views
  hideViews();
//display target view
  document.getElementById(navigationTarget).style.display = 'block';
//save current view to localstorage
  localStorage.setItem('navigationTarget', navigationTarget);
}


/**
 * Hides all view class elements. Used by navigationButtonEvent.
 */
function hideViews() {
  const views = document.querySelectorAll(".view");
  views.forEach(view => {
    view.style.display = 'none'
  });
}


/**
 * Sets profile view content based on user.
 * Null user results in default element.
 * @param user
 */
function setProfileView(user) {
  const profileArea = document.querySelector('#profile-area');
  if (user === null) {
    profileArea.innerHTML = 'Login to see profile information';

  } else {
    console.log('set user info in profile');

    console.log(user);

    const userInfo = document.querySelector('#profile-area');
    userInfo.innerHTML = '<p> Username: ' + user['username'] + '</p>'
      + '<p> Email: ' + user.email + '</p>';


  }
}


function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('navigationTarget');
  setUser(null);

}

/*
* {
* "username":"asdfghj",
* "email":"asdfghj@example.com",
* "favouriteRestaurant":"65f37b9fcf627e00930bbd89",
* "_id":"691dfde03116ae25faca7f38",
* "role":"user",
* "activated":true
* }*/

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
      let dialog = document.querySelector('#restaurant-dialog');
      let dialogInfoArea = document.querySelector('#restaurant-dialog-info-area');
      dialogInfoArea.innerHTML = ``;
      let dialogMenuArea = document.querySelector('#restaurant-dialog-menu-area');
      dialogMenuArea.innerHTML = ``;

      //add close button
      let closeDialogButton = document.createElement('button');
      closeDialogButton.addEventListener('click', () => {
        dialog.close();
      });
      closeDialogButton.innerHTML = 'Close';
      dialogInfoArea.appendChild(closeDialogButton);

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
      dialogInfoArea.appendChild(paragraph);

      //add menu, call updateMenu with menu as target
      let dailyMenu = document.createElement('div');
      dailyMenu.id = 'dailyMenu';
      dialogMenuArea.appendChild(dailyMenu);
      createDailyMenuElement(dailyMenu, restaurant._id);

      //add menu, call updateMenu with menu as target
      let weeklyMenu = document.createElement('div');
      weeklyMenu.id = 'weeklyMenu';
      dialogMenuArea.appendChild(weeklyMenu);
      createWeeklyMenuElement(weeklyMenu, restaurant._id);

      dialog.showModal();
    }

    return handler;
  }


}

/**
 *
 * @param targetElement
 * @param restaurantId
 * @returns {Promise<void>}
 */
async function createDailyMenuElement(targetElement, restaurantId) {
  try {
    console.log('createDailyMenuElement')
    const response = await getDailyMenu(restaurantId)
    console.log(response);

    //clear targetElement
    targetElement.innerHTML = '';

    console.log(response.courses);
    let menuHeading = document.createElement('h4');
    menuHeading.innerHTML = 'Daily menu';
    targetElement.appendChild(menuHeading);

    for (let item of response.courses) {
      let listElem = document.createElement('li');
      listElem.innerHTML = '<p>' + item.name + '</p>'
        + '<p>' + item.diets + '</p>'
        + '<p>' + item.price + '</p>';
      targetElement.appendChild(listElem);
    }

    if (response.courses.length === 0) {
      let errorListElem = document.createElement('li');
      errorListElem.innerHTML = 'Menu not available';
      targetElement.appendChild(errorListElem);
    }


  } catch (error) {
    console.log("Error in createDailyMenuElement")
    console.log(error);

  }
}


async function createWeeklyMenuElement(targetElement, restaurantId) {
  try {
    console.log('createWeeklyMenuElement')
    const response = await getWeeklyMenu(restaurantId)
    console.log(response);

    //clear targetElement
    targetElement.innerHTML = '';

    //week heading
    let menuHeading = document.createElement('h4');
    menuHeading.innerHTML = 'Weekly menu';
    targetElement.appendChild(menuHeading);

    //create list of days
    const dayListElem = document.createElement('ul');
    for (let day of response.days) {
      const dayElem = document.createElement('ul');

      //heading for a day
      let dayHeading = document.createElement('p');
      dayHeading.innerHTML = '' + day.date;
      dayHeading.setAttribute('class', 'menuDayHeading');
      dayElem.appendChild(dayHeading);

      //list of courses for a day
      for (let course of day.courses) {

        //individual course
        let courseElem = document.createElement('li');
        courseElem.innerHTML = '' + course.name
          + '<br>' + course.diets
          + '<br>' + course.price
        ;

        dayElem.appendChild(courseElem);
      }
      dayListElem.appendChild(dayElem);
    }
    targetElement.appendChild(dayListElem);

    if (response.days.length === 0) {
      let errorListElem = document.createElement('li');
      errorListElem.innerHTML = 'Menu not available';
      targetElement.appendChild(errorListElem);
    }


  } catch (error) {
    console.log("Error in createWeeklyMenuElement")
    console.log(error);

  }

}

/**
 * Calculates distence between two coordinate points. Unit of distance is arbitrary.
 * Input is coordinate array [lat,lon]
 * @param coordinates1
 * @param coordinates2
 * @returns {number}
 */
function calculateDistance(coordinates1, coordinates2) {
  return Math.sqrt(Math.pow((coordinates1[0] - coordinates2[0]), 2) + Math.pow((coordinates1[1] - coordinates2[1]), 2));
}

/**
 * Sorting function for sorting restaurants based on distance from user.
 * @param userLocation coordinate array
 * @param restaurant1 restaurant object
 * @param restaurant2 restaurant object
 * @returns {number} comparison number for sort method
 */
function compareDistance(userLocation, restaurant1, restaurant2) {
  //restaurant data has coordinates in different order....
  return (
    calculateDistance(userLocation, [restaurant1.location.coordinates[1], restaurant1.location.coordinates[0]])
    - calculateDistance(userLocation, [restaurant2.location.coordinates[1], restaurant2.location.coordinates[0]])
  )

}


/**
 * Sets contents of nearest restaurant element based on user location. Null location creates default element.
 * @param userLocation Coordinates array
 * @param restaurants Restaurants array
 */
async function setNearestRestaurant(userLocation, restaurants) {
  console.log('setNearestRestaurant:' + userLocation);
  const nearestRestaurantHomeView = document.querySelector('#nearest-restaurant-home');
  const nearestRestaurantListView = document.querySelector('#nearest-restaurant-list');

  if (userLocation === null) {
    nearestRestaurantHomeView.innerHTML = 'No restaurants found near you.';
    nearestRestaurantListView.innerHTML = 'No restaurants found near you.';

  } else {

    //sort restaurants by distance
    const sortedRestaurants = restaurants.map((a) => a).sort((a, b) => compareDistance(userLocation, a, b));
    console.log(sortedRestaurants);

    //get id of closest restaurant
    const nearestRestaurant = sortedRestaurants[0];
    console.log('nearest distance: ' + calculateDistance(userLocation, nearestRestaurant));

    //create info
    /* let paragraph = document.createElement('p');*/

    const info = '' + nearestRestaurant.name + '<br><br>'
      + 'Address: <br>'
      + nearestRestaurant.address + '<br>'
      + nearestRestaurant.postalCode + ' ' + nearestRestaurant.city + '<br><br>'
      + 'Company: ' + nearestRestaurant.company + '<br>'
    ;

    //insert info
    nearestRestaurantHomeView.querySelector('.nearest-info').innerHTML = info;
    nearestRestaurantListView.querySelector('.nearest-info').innerHTML = info;

    //create elements for nearest menus
    const nearestMenuHomeView = nearestRestaurantHomeView.querySelector('.nearest-menu');
    const nearestMenuListView = nearestRestaurantListView.querySelector('.nearest-menu');
    await createDailyMenuElement(nearestMenuHomeView, nearestRestaurant._id);
    await createDailyMenuElement(nearestMenuListView, nearestRestaurant._id);

    //add buttons to show menus


  }

}

/**
 * Sets content to favourite restaurant element based on users data.
 * @param user
 * @param restaurants
 */
async function setFavouriteRestaurant(user, restaurants) {
  try {
    console.log('setFavouriteRestaurant');

    if (user !== null && user) {
      console.log('user is not null in setFavouriteRestaurant')

      if (user && (user.favouriteRestaurant === undefined)) {
        //user doesn't have a favourite restaurant
        console.log('favourite restaurant not found');
        document.querySelector('#favourite-restaurant-info-home').innerHTML = 'Favourite a restaurant and it will show here!';
        document.querySelector('#favourite-restaurant-info-view').innerHTML = 'Favourite a restaurant and it will show here!';
        document.querySelector('#favourite-restaurant-info-profile').innerHTML = 'Favourite a restaurant and it will show here!';

        //clear menus
        document.querySelector('#favourite-restaurant-home .favourite-daily-menu').innerHTML = '';
        document.querySelector('#favourite-restaurant-list .favourite-daily-menu').innerHTML = '';


      } else if (user && (user.favouriteRestaurant !== undefined)) {
        //user has a favourite restaurant
        console.log('user has favourite restaurant');

        //get restaurant
        const favRestaurantId = user.favouriteRestaurant;
        const favRestaurant = restaurants.find((r) => r._id === favRestaurantId);

        //show users favourite restaurant
        console.log(user.username + ' favourite restaurant ' + favRestaurant._id);

        //create info
        const info = '<h3>Your favourite Restaurant</h3>' +
          +favRestaurant.name + '<br><br>'
          + 'Address: <br>'
          + favRestaurant.address + '<br>'
          + favRestaurant.postalCode + ' ' + favRestaurant.city + '<br><br>'
          + 'Company: ' + favRestaurant.company + '<br>';

        //insert info
        document.querySelector('#favourite-restaurant-info-home').innerHTML = info;
        document.querySelector('#favourite-restaurant-info-view').innerHTML = info;
        document.querySelector('#favourite-restaurant-info-profile').innerHTML = info;

        //create elements for nearest menus
        const favouriteMenuHomeView = document.querySelector('#favourite-restaurant-home .favourite-daily-menu');
        const favouriteMenuListView = document.querySelector('#favourite-restaurant-list .favourite-daily-menu');
        await createDailyMenuElement(favouriteMenuHomeView, favRestaurantId);
        await createDailyMenuElement(favouriteMenuListView, favRestaurantId);
      }


    } else {
      //user is null, clear elements
      console.log('user is null in setFavouriteRestaurant');
      document.querySelector('#favourite-restaurant-info-home').innerHTML = 'Login to see your favourite restaurant.';
      document.querySelector('#favourite-restaurant-info-list').innerHTML = 'Login to see your favourite restaurant.';
      document.querySelector('#favourite-restaurant-info-profile').innerHTML = 'Login to see your favourite restaurant.';
    }


  } catch (err) {
    console.log(err);
  }

}


function updateFavouriteRestaurant() {


}


export {
  handleAutoLogin,
  getLocation,
  drawMap,
  createRestElements,
  setNearestRestaurant,
  setFavouriteRestaurant,
  setUser,
  setProfileView,
  displayView,
  hideViews,
  logout
}
