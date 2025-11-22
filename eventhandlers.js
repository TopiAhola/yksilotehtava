'use strict';


//resets and shows dialog
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

  //showDialog(event); //TODO: poista tämä?
}

function loginButtonEvent(event) {
  event.preventDefault();
  console.log('loginButtonEvent');

}

/////////////////////////////////////////////////
//navbar event handlers

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


}


export {
  showDialog,
  closeDialog,
  toggleHighlight,
  setEventHandlers,
};
