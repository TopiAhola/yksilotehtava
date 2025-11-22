'use strict';


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


async function login(username, password) {
  const url = '/api/v1/auth/login'

  try {
    let response = await fetch(baseUrl + url, {
      method: "POST",
      contentType: "application/json",
      headers: {},

      body: JSON.stringify({
          "username": username,
          "password": password
        }
      )
    });
    console.log(response);

    let responseJson = await response.json();
    console.log(responseJson);


  } catch (error) {
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
 * returns the menu when promise resolves, else returns object with empty array
 * @param restId
 * @returns {Promise<{courses: *[]}|{courses: *[]}>}
 */
const getDailyMenu = async (restId) => {
  try {
    const dailyMenuUrl = "/api/v1/restaurants/daily/:id/:lang";
    let fetchString = `/api/v1/restaurants/daily/${restId}/en`;
    console.log("fetch:" + baseUrl + fetchString);

    let response = await fetch(baseUrl + fetchString)

    console.log(response);
    if (response.ok) {
      let menu = response.json();
      console.log("Response ok");
      console.log(menu);
      return menu;

    } else {
      console.log("Response not ok")
      return {courses: []};
    }

  } catch (error) {
    console.log("Error in updateMenu")
    console.log(error);
    //return {courses : [] };
  }
};


export {updateUser, getUser, login, getRestaurants};
