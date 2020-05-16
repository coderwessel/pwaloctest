/*
public/scripts/map.js

*/


'use strict';
//console.log("map will be inits");
	 	// We’ll add a tile layer to add to our map, in this case it’s a OSM tile layer.
	 	// Creating a tile layer usually involves setting the URL template for the tile images
	 	var osmUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
	 	    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	 	    osm = L.tileLayer(osmUrl, {
	 	        maxZoom: 18,
	 	        attribution: osmAttrib
	 	    });
        
     var osmBg = L.tileLayer(osmUrl, {
	 	        maxZoom: 18,
	 	        attribution: osmAttrib
	 	    });
        

    var visitedIcon = L.icon({
      iconUrl: '/images/icon-visited.svg',
      iconSize: [30, 30],
      iconAnchor: [0, 30],
      popupAnchor: [15, -30],
    });

	 	
   // add position tracker
   function success(pos) {
        var crd = pos.coords;
        centerMapBg([crd.latitude,crd.longitude]);}
    function error(err) {console.log(err);}
    var options = {enableHighAccuracy: false,
                  timeout: 5000,
                  maximumAge: 0}
    const id = navigator.geolocation.watchPosition(success, error, options);

    // getposition2 get map center
    
    function getPosition2() {
      const crd = mapBg.getCenter();
      console.log (crd);
      const res = { coords: {
                      latitude: crd.lat, 
                       longitude: crd.lng,}
            }
      console.log (res);
      return res;
      
    }


    //
    // initialize the map on the "map" div with a given center and zoom
    
    var getPosition = function () {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          reject,
          {         timeout: 1000,
         enableHighAccuracy: true,
         maximumAge: 1000
     });
        // navigator.geolocation.getCurrentPosition(success, error, options);
      });
    }
  
	 	var map = L.map('map').setView([19.04469, 72.9258], 12).addLayer(osm);
    var mapBg = L.map('map-bg').setView([19.04469, 72.9258], 16).addLayer(osmBg);
    var youMarker=L.marker([19.04469, 72.9258],{
             draggable: false,
	 	         title: "You are here",
	 	         alt: "You are here",
	 	         riseOnHover: false
	 	    }).addTo(mapBg)
	 	        .bindPopup("You are here").openPopup();

    /**
    * center map
    * centerMapBg([crd.latitude,crd.longitude])
    **/
    function centerMapBg(latLen){
      mapBg.setView(latLen);
      youMarker.setLatLng(latLen);
    }

    function addVisitedMarker(latLeng, popup){
      var newMarker=L.marker(latLeng,{
             draggable: false,
	 	         title: popup,
	 	         alt: popup,
	 	         riseOnHover: false,
             icon: visitedIcon
	 	    }).addTo(mapBg)
	 	        .bindPopup(popup).openPopup();
    }
    
    var markers = L.layerGroup();
    map.addLayer(markers)
    getPosition()
      .then((position) => {
        var crd = position.coords;
        map.setView([crd.latitude,crd.longitude])
      })
      .catch((err) => {
        console.log(err);
      });


    // Script for adding marker on map click
	 	function onMapClick(e) {
       markers.clearLayers();
	 	   var marker = L.marker(e.latlng, {
	 	        draggable: false,
	 	        title: "Resource location",
	 	        alt: "Resource Location",
	 	        riseOnHover: true
	 	    }).addTo(map)
	 	        .bindPopup(e.latlng.toString()).openPopup();
        markers.addLayer(marker);
	 	    document.getElementById('geo').value = e.latlng.lat + "," + e.latlng.lng;
      // Update marker on changing it's position
	 	    marker.on("dragend", function (ev) {

	 	        var chagedPos = ev.target.getLatLng();
	 	        this.bindPopup(chagedPos.toString()).openPopup();

	 	    });
      
	 	}

    

	 	map.on('click', onMapClick);