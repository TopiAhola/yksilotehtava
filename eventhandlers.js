'use strict';


//resets and shows dialog
import {getUser, login, registerUser, updateUser} from "./api.js";
import {hideViews, logout, setUser} from './functions.js';
import {user} from "./main.js";

function showDialog(event) {
  console.log('showDialog');

  //get and reset dialog
  let dialog = document.querySelector('dialog');
  dialog.innerHTML = ``;

  //add close button
  let closeDialogButton = document.createElement('button');
  closeDialogButton.addEventListener('click', closeDialog);
  closeDialogButton.innerHTML = 'Close';
  closeDialogButton.style.fontSize = '1.5em';
  dialog.appendChild(closeDialogButton);

  //add info
  let paragraph = document.createElement('p');
  let index = Number(event.target.parentElement.getAttribute('listIndex'));
  paragraph.innerHTML = '' + restaurants[index].name + '<br><br>'
    + 'Address: <br>'
    + restaurants[index].address + '<br>'
    + restaurants[index].postalCode + ' ' + restaurants[index].city + '<br><br>'
    + 'Phone: <br>'
    + restaurants[index].phone + '<br><br>'
    + 'Company: ' + restaurants[index].company + '<br>'
  ;
  dialog.appendChild(paragraph);

  //add menu, call updateMenu with menu as target
  let menu = document.createElement('div');
  menu.id = 'menu';
  dialog.appendChild(menu);
  updateMenu(menu, restaurants[index]._id);


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


/**
 * Closes the dialog targeted by the event
 * @param event
 */
function closeDialog(event) {
  console.log("closeDialog")
  event.target.close()

  //document.querySelector('dialog').close();
}


//remove highlights and add one for target
function toggleHighlight(event) {
  for (let elem of document.getElementsByClassName('highlight')) {
    elem.classList.remove('highlight');
  }
  //event.target.classList.add('highlight'); //highlights the cell
  console.log(event.target + "highlighted");
  event.target.parentElement.classList.add('highlight'); //highlits the row

}

function loginButtonEvent(event) {
  event.preventDefault();
  console.log('loginButtonEvent');

}

/////////////////////////////////////////////////
//navbar event handlers


/**
 * Shows view defined in buttons navigationTarget attribute.
 * Hides other view-class elements.
 * @param event
 */
function navigationButtonEvent(event) {
  event.preventDefault();
  const navigationTarget = event.target.getAttribute("navigationTarget");
  console.log('navigationButtonEvent: ' + navigationTarget);
  //hide all views
  hideViews();
  //display target view
  document.getElementById(navigationTarget).style.display = 'block';
  //save current view to localstorage
  localStorage.setItem('navigationTarget', navigationTarget);
}


////////////////////////////////////////////////////////
//login & register from events


async function loginFormEvent(event) {
  event.preventDefault();
  console.log('loginFormEvent');
  const username = event.target.username.value.valueOf();
  const password = event.target.password.value.valueOf();

  await login(username, password);
}

async function registerFormEvent(event) {
  event.preventDefault();
  console.log('registerFormEvent');
  const username = event.target.username.value;
  const password1 = event.target.password1.value.valueOf();
  const password2 = event.target.password2.value;
  const email = event.target.email.value;

  if (password1 === password2) {
    await registerUser(username, password1, email);
  } else {
    alert("Passwords don't match.");
  }
}

/**
 * Calls logout() to remove token and user data, set user to null, update elements to default.
 * @returns {Promise<void>}
 */
async function logoutButtonEvent() {
  console.log('logoutButtonEvent');
  await logout();
  alert("Logged out.");
}

async function favouriteRestaurantButtonEvent(event) {
  try {
    event.preventDefault();
    console.log('favouriteRestaurantButtonEvent');
    const restaurant_id = event.target.getAttribute("restaurant_id");

    //import user from main
    const token = localStorage.getItem('token');
    if (user !== null && token) {
      console.log('update favourite: ' + user.username + ' ' + restaurant_id);
      const success = await updateUser({favouriteRestaurant: restaurant_id}, token);

      if (success.message === 'success') {
        //get updated user data, update elements
        getUser(token).then(user => {
          setUser(user)
        });

      } else if (success.message === 'badLogin') {
        alert("Log in to favourite restaurants");
      } else if (success.message === 'error') {
        alert("Error");
      }


    } else {
      console.log('cannot set favourite: user is not logged in');
    }


  } catch (error) {
    console.log(error);
  }
}

function toggleNearestDailyMenu(event) {
  event.preventDefault();
  try {
    //select nearestRestaurant menu
    const menu = document.querySelector('#nearest-restaurant-list .nearest-menu');

    //toggle visibility
    if (menu.getAttribute("display") === "none") {
      menu.setAttribute('display', 'block');
    } else {
      menu.setAttribute('display', 'none');
    }


  } catch (error) {
    console.log(error);
  }
}


/**
 * Sets event handlers for static elements
 */
function setEventHandlers() {
  console.log('setEventHandlers');

  //navbar
  document.querySelector('#homeNavigationButton').addEventListener('click', navigationButtonEvent);
  document.querySelector('#listNavigationButton').addEventListener('click', navigationButtonEvent);
  document.querySelector('#profileNavigationButton').addEventListener('click', navigationButtonEvent);
  document.querySelector('#loginNavigationButton').addEventListener('click', navigationButtonEvent);


  //login form
  document.querySelector('#login-form').addEventListener('submit', loginFormEvent);

  //register form
  document.querySelector('#register-form').addEventListener('submit', registerFormEvent);

  //logout button
  document.querySelectorAll('.logout-button')
    .forEach((
      button) => button.addEventListener('click', logoutButtonEvent)
    );

}


export {
  showDialog,
  closeDialog,
  toggleHighlight,
  setEventHandlers,
  favouriteRestaurantButtonEvent,
  toggleNearestDailyMenu
};
