'use strict';

const restaurantsPlaceholder = [
  {
    location: {type: 'Point', coordinates: [25.018456, 60.228982]},
    _id: '6470d38ecb12107db6fe24c1',
    companyId: 68,
    name: 'Ravintola Ladonlukko',
    address: 'Latokartanonkaari 9 A',
    postalCode: '00790',
    city: 'Helsinki',
    phone:
      '+358 50 4653899 Ravintolan esimies +358 50 435 8072 Kokoustarjoilut /ravintola',
    company: 'Sodexo',
    __v: 0,
  },
  {
    location: {type: 'Point', coordinates: [24.903147, 60.221729]},
    _id: '6470d38ecb12107db6fe24c2',
    companyId: 1580536,
    name: 'Ravintola Stadin AO Ilkantie',
    address: 'Ilkantie 3',
    postalCode: '00400',
    city: 'Helsinki',
    phone: '+358 (0) 50 4710 211',
    company: 'Sodexo',
    __v: 0,
  },
];

// your code here
////////////////////////////////////////////////////
//UI functions


////////////////////////////////////////////////////
//restaurant API
let baseUrl = "https://media2.edu.metropolia.fi/restaurant/";
//user login
let loginUrl = "/api/v1/auth/login";


//updates the menu when promise resolves
async function updateMenu(menuElement, restId) {
  try {
    const dailyMenuUrl = "/api/v1/restaurants/daily/:id/:lang";
    let fetchString = `/api/v1/restaurants/daily/${restId}/en`;
    console.log("fetch:" + baseUrl + fetchString);

    let response = await fetch(baseUrl + fetchString);
    console.log(response);

    if (response.ok) {
      let objectArray = await response.json();
      console.log("Response ok");
      console.log(objectArray);

      let menuHeading = document.createElement('h4');
      menuHeading.innerHTML = 'Daily menu';
      menuElement.appendChild(menuHeading);

      for (let item of objectArray.courses) {
        let listElem = document.createElement('li');
        listElem.innerHTML = '' + item.name
          + '<br>' + item.diets
          + '<br>' + item.price;
        menuElement.appendChild(listElem);
      }

      if (objectArray.courses.length === 0) {
        let errorListElem = document.createElement('li');
        errorListElem.innerHTML = 'Menu not available';
        menuElement.appendChild(errorListElem);
      }


    } else {
      console.log("Response not ok")
      let errorListElem = document.createElement('li');
      errorListElem.innerHTML = 'Menu not available or loading';
      menuElement.appendChild(errorListElem);
    }

  } catch (error) {
    console.log("Error in updateMenu")
    console.log(error);

  }
}


////////////////////////////////////////////////////
//main

//placeholder for restaurants
let restaurants = restaurantsPlaceholder;

//get restaurants
getRestaurants().then(
  (value) => {
    console.log("promise resolved");
    console.log(value)
    createRestElements(value);
  },
  (value) => {
    console.log(value);
  }
);








