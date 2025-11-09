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

//resets and shows dialog
function showDialog(event) {
    console.log(showDialog);

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


//closes the dialog
function closeDialog() {
    console.log("closeDialog")
    document.querySelector('dialog').close();
}


//remove highlights and add one for target
function toggleHighlight(event) {
    for (let elem of document.getElementsByClassName('highlight')) {
        elem.classList.remove('highlight');
    }
    //event.target.classList.add('highlight'); //highlights the cell
    console.log(event.target + "highlighted");
    event.target.parentElement.classList.add('highlight'); //highlits the row

    showDialog(event);
}

////////////////////////////////////////////////////
//restaurant API
let baseUrl = "https://media2.edu.metropolia.fi/restaurant/";
//user login
let loginUrl = "/api/v1/auth/login";

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


//updates the menu when promise resolves
async function updateMenu(menuElement, restId){
     try {
        const dailyMenuUrl = "/api/v1/restaurants/daily/:id/:lang";
        let fetchString = `/api/v1/restaurants/daily/${restId}/en`;
        console.log("fetch:"+baseUrl+fetchString);

        let response = await fetch(baseUrl+fetchString);
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
                listElem.innerHTML = ''+item.name
                    +'<br>'+item.diets
                    +'<br>'+item.price;
                menuElement.appendChild(listElem);
            }

            if(objectArray.courses.length === 0){
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
    (value) =>{
        console.log("promise resolved");
        console.log(value)
        createRestElements(value);
        },
    (value)=>{ console.log(value); }
) ;

function createRestElements(promiseValue){
    console.log("Create restaurant elements");
    console.log(promiseValue);

    //Sort restaurants
    if(Array.isArray(promiseValue)){
        console.log("promiseValue is array");
    } else {
        console.log("promiseValue is not array!");
        let restArray = promiseValue.data;
    }
    console.log(promiseValue);

    promiseValue.sort((a, b) => { return a.name.localeCompare(b.name); } );
    restaurants = promiseValue;

    for (let r of promiseValue) {
        let restaurantElement = document.createElement('tr');
        restaurantElement.setAttribute('class', 'restaurant');
        restaurantElement.setAttribute('listIndex', promiseValue.indexOf(r).toString());
        restaurantElement.addEventListener('click', toggleHighlight);

        let nameCell = document.createElement('td');
        nameCell.innerHTML = r.name;

        let addressCell = document.createElement('td');
        addressCell.innerHTML = r.address;

        restaurantElement.append(nameCell, addressCell);
        document.querySelector('table').append(restaurantElement);
    }
}






