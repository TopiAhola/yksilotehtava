'use strict';

import restaurantsPlaceholder from "./placeholder.js";
import {handleAutoLogin, setUser} from "./functions.js";

/**
 * URL: https://media2.edu.metropolia.fi/restaurant
 * @type {string}
 */
const baseUrl = 'https://media2.edu.metropolia.fi/restaurant';


/**
 * Returns user data based on token or an error message.
 * @param token
 * @returns {Promise<*|null>}
 */
async function getUser(token) {
  const url = '/api/v1/users/token';
  console.log('getUser: ' + baseUrl + url);
  try {
    let response = await fetch(baseUrl + url, {
      method: "GET",
      contentType: "application/json",
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    console.log(response);

    if (response.status === 200) {
      let responseObject = await response.json();
      console.log(responseObject);

      return responseObject.data;

    } else if (response.status === 403) {
      console.log(response.status + ' in getUser');
      return null;

    } else {
      return null;
    }

  } catch (error) {
    console.log(error);
    return null;
  }
}


/**
 * Updates user info. User has to be logged in.
 * @param userData object containing new attributes
 * @param token token from login
 * @returns {Promise<any>}
 */
async function updateUser(userData, token) {
  const url = '/api/v1/users';
  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  }
  console.log('updateUser: ' + baseUrl + url)
  console.log(options);

  try {
    let response = await fetch(baseUrl + url, options);
    console.log(response);

    if (response.status === 200) {
      let responseObject = await response.json();
      console.log(responseObject);

      return {
        message: 'success',
        user: responseObject.data
      };

    } else if (response.status === 401) {
      return {message: 'badLogin'};

    } else {
      return {message: 'error'};
    }


  } catch (error) {
    console.log(error);
    return {message: 'error'};
  }
}


/**
 * Deletes user from api
 * @param user
 * @param token
 * @returns {Promise<void>}
 */
async function deleteUser(user, token) {
}


/**
 * Logs user in. Shows alert if login fails
 * @param username
 * @param password
 * @returns {Promise<void>}
 */
async function login(username, password) {
  try {
    const loginUrl = "/api/v1/auth/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "username": username,
          "password": password
        }
      )
    };
    console.log('login: ' + baseUrl + loginUrl);
    console.log(options);

    let response = await fetch(baseUrl + loginUrl, options);
    console.log(response);

    if (response.ok) {
      let responseJson = await response.json();
      console.log(responseJson.message);

      //set token to storage
      localStorage.setItem('token', responseJson["token"]);

      //update user
      setUser(responseJson["data"]);

    } else if (response.status === 401) {
      console.log(response.status + 'error in login');
      alert('Wrong username or password');

    } else {
      console.log(response.status);
      alert('Error in login.');
    }

  } catch (error) {
    console.log(error);
  }
}


/**
 * Register a user
 * @param username
 * @param password
 * @param email
 * @returns {Promise<void>}
 */
async function registerUser(username, password, email) {
  try {
    const registerUrl = "/api/v1/users";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          "username": username,
          "password": password,
          "email": email
        }
      )
    };
    console.log('register: ' + baseUrl + registerUrl);
    console.log(options);

    let response = await fetch(baseUrl + registerUrl, options);
    console.log(response);

    if (response.ok) {
      let responseJson = await response.json();
      console.log(responseJson);
      setUser(responseJson.data);

    } else {
      console.log(response.status + 'error in register');
      alert(response.message);
    }

  } catch (error) {
    console.log('unknown error in register');
    console.log(error);
  }
}

/////////////////////////////////////////////////////////
//restaurants

//gets restaurants and returns an array?
async function getRestaurants() {
  try {
    const restaurantsUrl = "/api/v1/restaurants";
    console.log("fetch:" + baseUrl + restaurantsUrl)
    let response = await fetch(baseUrl + restaurantsUrl);
    console.log(response);

    if (response.ok) {
      let responseObject = await response.json();
      console.log("Response ok")
      console.log(responseObject);

      return responseObject;

    } else {
      console.log("Response not ok")
      return restaurantsPlaceholder;
    }


  } catch (error) {
    console.log(error);
    return restaurantsPlaceholder;
  }
}


//TODO: tämä....
/**
 * Returns the daily menu by restaurant _id when promise resolves.
 * Returns an empty array on error.
 * @param restId

 */
async function getDailyMenu(restId) {
  //dailyMenuUrl = "/api/v1/restaurants/daily/:id/:lang";
  const dailyMenuUrl = `/api/v1/restaurants/daily/${restId}/en`;
  console.log("fetch:" + baseUrl + dailyMenuUrl);

  try {
    let response = await fetch(baseUrl + dailyMenuUrl);
    console.log(response);

    if (response.ok) {
      let menu = await response.json();
      console.log("getDailyMenu Response ok");
      console.log(menu);
      return menu;

    } else {
      console.log("getDailyMenu Response not ok")
      return {courses: []};
    }

  } catch (error) {
    console.log("Error in getDailyMenu")
    console.log(error);
    return {courses: []};
  }
}

/**
 * Returns the weekly menu by restaurant _id when promise resolves.
 * Returns an empty array on error.
 * @param restId
 * @returns {Promise<{days: *[]}|any>}
 */
async function getWeeklyMenu(restId) {
  //weeklyMenuUrl = "/api/v1/restaurants/weekly/:id/:lang";
  const weeklyMenuUrl = `/api/v1/restaurants/weekly/${restId}/en`;
  console.log("fetch:" + baseUrl + weeklyMenuUrl);

  try {
    const response = await fetch(baseUrl + weeklyMenuUrl);
    console.log(response);

    if (response.ok) {
      const daysObject = await response.json();
      console.log("getWeeklyMenu Response ok");
      console.log(daysObject);
      return daysObject;

    } else {
      console.log("getWeeklyMenu Response not ok")
      return {days: []};
    }

  } catch (error) {
    console.log("Error in getWeeklyMenu")
    console.log(error);
    return {days: []};
  }
}


export {
  updateUser,
  getUser,
  login,
  registerUser,
  getRestaurants,
  getDailyMenu,
  getWeeklyMenu

};
