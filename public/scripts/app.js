/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

const weatherApp = {
  selectedLocations: {},
  state: {},
  addDialogContainer: document.getElementById('addDialogContainer'),
  popUpDialogContainer: document.getElementById('popUpDialogContainer'),
  shareDialogContainer: document.getElementById('shareDialogContainer'),
};

/**
 * Toggles the visibility of the add location dialog box.
 */
function toggleAddDialog() {
  document.querySelector("#description").value = '';
  document.querySelector("#hint").value = '';
  document.querySelector("#answer").value = '';
  weatherApp.addDialogContainer.classList.toggle('visible');
  
  
}

function togglePopUpDialog() {
  /* document.querySelector("#description").value = '';
  document.querySelector("#hint").value = '';
  document.querySelector("#answer").value = ''; */
  weatherApp.popUpDialogContainer.classList.toggle('visible');

  
}

function toggleShareDialog() {
  createHuntShare(weatherApp.selectedLocations);
  weatherApp.shareDialogContainer.classList.toggle('visible');
  
  
}


/**
 * Show Next Card if available.
 */
function nextCard(evt) {
  //get current item
  console.log("next clicked");
  //console.log(weatherApp.selectedLocations);
  const parent = evt.srcElement.parentElement;
  const thisIndex = evt.srcElement.parentElement.id;
  const next = parent.nextElementSibling;
  if (next) {
    const nextIndex=next.id;
    console.log(nextIndex);
    weatherApp.state.active=next.id;
    saveState(weatherApp.state);
    updateData();
  }
}

/**
 * Show Previous Card if available.
 */
function previousCard(evt) {
  //get current item
  console.log("previous clicked");
  //console.log(weatherApp.selectedLocations);
  const parent = evt.srcElement.parentElement;
  const thisIndex = evt.srcElement.parentElement.id;
  const previous = parent.previousElementSibling;
  if (previous) {
    const previousIndex=previous.id;
    console.log(previousIndex);
    if (previousIndex != "weather-template") { 
      weatherApp.state.active=previous.id;
      saveState(weatherApp.state);
      updateData();
    }
  }
}



/**
 * Event handler for butDialogAdd, adds the selected location to the list.
 */
function addLocation() {
  // Hide the dialog
  
  // Get the selected city
  //const select = document.getElementById('selectCityToAdd');
  //const selected = select.options[select.selectedIndex];
  //const geo = selected.value;
  const geo = document.getElementById('geo').value;
  const label = document.getElementById('description').value; //TODO deal with this
  const description = document.getElementById('description').value;
  const hint = document.getElementById('hint').value;
  const answer = document.getElementById('answer').value;
  const coords = geo.split(",");
  const latitude = coords[0];
  const longitude = coords[1]; 
  const location = {
    active: false,
    label: label, 
    geo: geo,
    description: description,
    hint: hint,
    answer: answer,
    visited: false,
    latitude: latitude,
    longitude: longitude,
  };
  weatherApp.selectedLocations[geo] = location;
  saveLocationList(weatherApp.selectedLocations);
  // Create a new card & get the weather data from the server
  toggleAddDialog();
  //const card = getForecastCard(location);
  //renderForecast(card, location);
  updateData();  
}

/**
 * Event handler for .remove-city, removes a location from the list.
 *
 * @param {Event} evt
 */
function removeLocation(evt) {
  const parent = evt.srcElement.parentElement;
  parent.remove();
  if (weatherApp.selectedLocations[parent.id]) {
    delete weatherApp.selectedLocations[parent.id];
    saveLocationList(weatherApp.selectedLocations);
  }
}

function showPopUp(title, message){
  document.querySelector(".pop-up-dialog-title").textContent = title;
  document.querySelector(".pop-up-dialog-body").textContent = message;
  togglePopUpDialog();
}

function targetFound(id) {
    const location = weatherApp.selectedLocations[id]
    location.visited=true;
     const coords = id.split(","); ///Let op het gebruik van parent.id is valsspelen TODO vertalen naar GEO
    const target = {
      longitude: parseFloat(coords[1]), 
      latitude: parseFloat(coords[0])
    }
    const message = "You found "+location.description+". It is: "+location.answer;
    showPopUp("Congratulations",message);
    addVisitedMarker([target.latitude, target.longitude], location.description);
    saveLocationList(weatherApp.selectedLocations);
    updateData();
}


function showAnswer(evt) {
  const parent = evt.srcElement.parentElement;
  if (weatherApp.selectedLocations[parent.id]) targetFound(parent.id);
}

function calculateDistance(lon1, lat1, lon2, lat2) {
  var R = 6371000; // Radius of the earth in meters
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = Math.round(R * c) ; // Distance in meters
  return d;
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

/**
** showDistance:
** get current position, calculate distance to target, and update card
**/

function showDistance(evt) {
  // get id of card and get target locationfrom card data
  const parent = evt.srcElement.parentElement;
  const key = parent.id;
  const location = weatherApp.selectedLocations[key];
  const coords = parent.id.split(","); ///Let op het gebruik van parent.id is valsspelen TODO vertalen naar GEO
  const target = {
    longitude: parseFloat(coords[1]), 
    latitude: parseFloat(coords[0])
  }
  // set distance to ??? (searching indicator) TODO try spinner
  parent.querySelector('.current .temperature .value').textContent = '???'

  
/**  
  //get current position, calculate distance to target, and update card
  getPosition()
  .then((position) => {
    //current position
**/
  
    const position = getPosition2();
    var crd = position.coords;       
    console.log(crd);
    //center map
    //centerMapBg([crd.latitude,crd.longitude])
    
    const distance = calculateDistance(crd.longitude,crd.latitude,target.longitude,target.latitude)
    var distanceText = "250+"
    if (distance < 250) distanceText = distance;
  
    var distanceIndicator = 'icon radar-far';   
    if (distance < 250) distanceIndicator = 'icon radar-cold';
    if (distance < 100) distanceIndicator = 'icon radar-warm';
    if (distance < 50) distanceIndicator = 'icon radar-hot';
    if (distance < 25) distanceIndicator = 'icon radar-visited';
    
    parent.querySelector('.current .temperature .value').textContent = distanceText;
    parent.querySelector('.current .visual .icon').className = distanceIndicator; 
        
    if(distance < 20) targetFound(parent.id)

      /** 
    {
        location.visited = true;
    }
    saveLocationList(weatherApp.selectedLocations);
    updateData();
   
  })
  .catch((err) => {
    parent.querySelector('.current .temperature .value').textContent  = err;
  });
  **/
  //console.log(parent);
  
}


/**
 * Renders the forecast data into the card element.
 *
 * @param {Element} card The card element to update.
 * @param {Object} data Weather forecast data to update the element with.
 */
function renderForecast(card, data, state) {

  // Render the forecast data into the card.
  //card.querySelector('.description').textContent = "huh:" + fname; //fname;//data.currently.summary;
  const visited=data.visited;
  //card.querySelector('.date').textCntent = forecastFrom;
  //card.querySelector('.icon')
  //    .className = `.icon.clear-day`; //TODO: change to radar of hint picture
  //Set description
  
  if (card.id == state.active){
    //card.classList.add("active-card");
    //card.classList.remove("inactive-card");
    console.log("active");
    card.className = ("weather-card active-card");
  }
  else{
    card.classList.add("inactive-card");
    card.classList.remove("active-card");
  }
  
  card.querySelector('.current .description')
      .textContent = data.hint; //TODO change to hint/answer
  card.querySelector('.location').textContent = data.description;
  card.querySelector('.future').textContent = data.answer;
  
  //if this is the first card hide previous button
  const firstCard = document.querySelectorAll('.weather-card')[1];
  if (card.id === firstCard.id) 
    card.querySelector('.butCardPrevious').hidden = true;
  //else show prev button
  else card.querySelector('.butCardPrevious').hidden = false;
  
  
  if (visited) { 
     card.querySelector('.future').style.display = "block"
     card.querySelector('.butCardNext').hidden = false;
     
  }
  else {
     card.querySelector('.future').style.display = "none";
     card.querySelector('.butCardNext').hidden = true;
     //card.querySelector('.butCardPrevious').hidden = true;
  
  
  }
    // If the loading spinner is still visible, remove it.
  const spinner = card.querySelector('.card-spinner');
  if (spinner) {
    card.removeChild(spinner);
  }
}


/**
 * Get's the HTML element for the weather forecast, or clones the template
 * and adds it to the DOM if we're adding a new item.
 *
 * @param {Object} location Location object
 * @return {Element} The element for the weather forecast.
 */
function getForecastCard(location) {
  const id = location.geo;
  const card = document.getElementById(id);
  if (card) {
    return card;
  }
  const newCard = document.getElementById('weather-template').cloneNode(true);
  // add the active class if active
  
  newCard.querySelector('.location').textContent = location.label;
  newCard.querySelector('.description').textContent = location.description;
  newCard.setAttribute('id', id);
  
  // Render the next 7 days.
  newCard.querySelector('.butCardPrevious')
    .addEventListener('click', previousCard);
  newCard.querySelector('.butCardNext')
    .addEventListener('click', nextCard);
  newCard.querySelector('.remove-city')
      .addEventListener('click', removeLocation);
  newCard.querySelector('.show-distance')
      .addEventListener('click', showDistance);
  newCard.querySelector('.reveal-answer')
      .addEventListener('click', showAnswer);
  
  
  
  
  
  
  
  
  document.querySelector('main').appendChild(newCard);
  newCard.removeAttribute('hidden');
  return newCard;
}

/**
 * Hides the location cards, locks the Run, and shows the player mode
 * 
 */


function lockRun() {
  const state = weatherApp.state;
  const firstCard = document.querySelectorAll('.weather-card')[1];
  state.active = firstCard.id;
  console.log(firstCard);
  // Set Password
  //set locked state
  state.locked=true;
  saveState(state);
  updateData();
  
}

function unlockRun() {
  const state = weatherApp.state;
  // ask Password
  //set unlocked state
  state.locked=false;
  saveState(state);
  updateData();
  
}


/**
 * Gets the latest weather forecast data and updates each card with the
 * new data.
*/

function updateData() {
  //make creator cords for all the locations
  const state = weatherApp.state;
  
  Object.keys(weatherApp.selectedLocations).forEach((key) => {
    const location = weatherApp.selectedLocations[key];
    const card = getForecastCard(location);
    // CODELAB: Add code to call getForecastFromCache
      renderForecast(card, location, state);
  });
                                                    
  if (state.locked) {
    // Hide inactive Cards
   document.querySelectorAll('.inactive-card').forEach(c => c.hidden = true);
    // Show active Cards
   document.querySelectorAll('.active-card').forEach(c => c.hidden = false);

    
    // hide card modification buttons 
    //remove city,  reveal
    document.querySelectorAll('.remove-city').forEach(c => c.hidden = true);
    document.querySelectorAll('.reveal-answer').forEach(c => c.hidden = true);
        
    // Hide Add button
    document.getElementById('butAdd').hidden = true;

    // Switch Lock button
    document.getElementById('butLock').hidden = true;
    document.getElementById('butUnlock').hidden = false;
  }
  
  else
    //unlocked
   {
    // Show all Cards
    document.querySelectorAll('.weather-card').forEach(c => c.hidden = false);
    document.getElementById('weather-template').hidden = true;
  
    // Show card modification buttons 
    //remove city
    document.querySelectorAll('.remove-city').forEach(c => c.hidden = false);
    document.querySelectorAll('.reveal-answer').forEach(c => c.hidden = false);
    
     
    // Show Add button
    document.getElementById('butAdd').hidden = false;

    // Switch Lock button
    document.getElementById('butLock').hidden = false;
    document.getElementById('butUnlock').hidden = true;
  } 
  
  
}
 

/**
 * Saves the list of locations.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveLocationList(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

/**
 * Loads the list of saved location.
 *
 * @return {Array}
 */
function loadLocationList() {
  let locations = localStorage.getItem('locationList');
  if (locations) {
    try {
      locations = JSON.parse(locations);
    } catch (ex) {
      locations = {};
    }
  }
  if (!locations || Object.keys(locations).length === 0) {
    const key = '40.7720232,-73.9732319';
    locations = {};
    locations[key] = {label: 'New York City', geo: '40.7720232,-73.9732319', hint: 'what a city', visited: false, answer:'joejoe'};
  }
  return locations;
}

/**
 * Saves the list of locations.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveState(state) {
  const data = JSON.stringify(state);
  localStorage.setItem('state', data);
}

/**
 * Loads the list of saved location.
 *
 * @return {Array}
 */
function loadState() {
  let state = localStorage.getItem('state');
  if (state) {
    try {
      state = JSON.parse(state);
    } catch (ex) {
      state = {};
    }
  }
  if (!state || Object.keys(state).length === 0) {
    state = {active: '40.7720232,-73.9732319',
             locked: false,
            };
  }
  return state;
}

/**
* createHuntShare
* creates a shareable link to the current hunt
**/

function createHuntShare(locations){
  let textarea = document.getElementById("share-link");
  var encodedString = btoa(JSON.stringify(locations));
 // var decodedString = atob(encodedString);
  var shareUrl="https:\/\/brook-peach-yarrow.glitch.me\/"
  textarea.value = shareUrl+"\?hunt\="+encodedString;
}

  
function copyHuntShare() {
  let textarea = document.getElementById("share-link");
  textarea.select();
  document.execCommand("copy");
}
  
  
/**
* paramsToPopup takes queryparameters and shows the contents
**/

function paramsToLocations(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
//  console.log(queryString);
//  console.log(urlParams);
//  console.log(urlParams.values().next().done);
//  createHuntShare(weatherApp.selectedLocations);
  if(!urlParams.values().next().done){
    const locations=JSON.parse(atob(urlParams.get('hunt')));
    //TODO check for parameters
    //TODO 2 check valid object
    return locations;
  }
  else return null;
//showPopUp("params",urlParams.get('poepoe'));
  
}

// function makeFirstActive

/**
 * Initialize the app, gets the list of locations from local storage, then
 * renders the initial data.
 */
function init() {
  // Get the location list, and update the UI.
  const locations = paramsToLocations();
  if(locations) {
    weatherApp.selectedLocations = locations;
    
  }
  else  {
    weatherApp.selectedLocations = loadLocationList();
    weatherApp.state = loadState();
  }
  updateData();
  if(locations)lockRun();
  // Set up the event handlers for all of the buttons.
  document.getElementById('butRefresh').addEventListener('click', updateData);
  document.getElementById('butAdd').addEventListener('click', toggleAddDialog);
  document.getElementById('butLock').addEventListener('click', lockRun);
  document.getElementById('butUnlock').addEventListener('click', unlockRun);
  document.getElementById('butShare').addEventListener('click', toggleShareDialog);
  document.getElementById('butDialogCancel')
      .addEventListener('click', toggleAddDialog);
  document.getElementById('butDialogOk')
      .addEventListener('click', togglePopUpDialog);
  document.getElementById('butDialogAdd')
      .addEventListener('click', addLocation);
  document.getElementById('butShareDialogCopy')
      .addEventListener('click', copyHuntShare);
  document.getElementById('butShareDialogOk')
      .addEventListener('click', toggleShareDialog);
  
}

init();
