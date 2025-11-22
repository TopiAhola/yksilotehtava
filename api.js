'use strict';

/**
 * URL: https://media2.edu.metropolia.fi/restaurant
 * @type {string}
 */
const baseUrl = 'https://media2.edu.metropolia.fi/restaurant';


/**
 * Updates user info. User has to be logged in.
 * @param user user object
 * @param token token from login
 * @returns {Promise<any>}
 */
async function updateUser(user, token) {
  const url = '/api/v1/users';
  const options = {
    method: "PUT",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: user
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
 * Returns user data based on token.
 * @param token
 * @returns {Promise<{message: string, user}|{message: string}>}
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
      return {
        message: 'success',
        user: responseObject.data
      };

    } else if (response.status === 403) {
      return {message: 'badLogin'};

    } else {
      return {message: 'error'};
    }

  } catch (error) {
    console.log(error);
    return {message: 'error'};
  }
}


async function deleteUser(user, token) {
}

/**
 *
 * @param username
 * @param password
 * @returns {Promise<void>}
 */
async function login(username, password) {
  const loginUrl = "/api/v1/auth/login";
  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {},
    body: JSON.stringify({
        "username": username,
        "password": password
      }
    )
  };

  console.log('login: ' + baseUrl + loginUrl);
  console.log(options);
  try {
    let response = await fetch(baseUrl + loginUrl, options);
    console.log(response);

    let responseJson = await response.json();
    console.log(responseJson.message);
    localStorage.setItem('token', responseJson.token);

  } catch (error) {
    console.log(error);
  }
}

/*
* {
  "message": "Login successful",
  "token": "asdasdasdasdas...",
  "data": {
    "username": "asdfghj",
    "email": "asdfghj@example.com",
    "favouriteRestaurant": "65f37b9fcf627e00930bbd89",
    "_id": "691dfde03116ae25faca7f38",
    "role": "user",
    "activated": true
  }
}
* */


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
  getRestaurants,
  getDailyMenu,
  getWeeklyMenu
};
