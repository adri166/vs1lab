// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * Set the location by the given LocationHelper object.
 * Additionally print new coordinates to the console-log.
 * @param LocationHelper locationHelper a LocationHelper object
 */
function updateLocation(locationHelper) {
    console.log(`updated lat[${locationHelper.latitude}]  lon[[${locationHelper.longitude}]`);
    document.getElementById("latitude") . value = locationHelper.latitude;
    document.getElementById("longitude") . value = locationHelper.longitude;

    document.getElementById("searchLatitude") . value = locationHelper.latitude;
    document.getElementById("searchLongitude") . value = locationHelper.longitude;

    taglist_json = JSON.parse(decodeURIComponent(document.getElementById("mapView").getAttribute("data-tags")));

    mm = new MapManager('3qE6hTnfkG4AwMPpgnCpyHG7NaHyxOi9');
    mapURL = mm.getMapUrl(locationHelper.latitude, locationHelper.longitude, taglist_json);

    document.getElementById("mapView") . src = mapURL;

}

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    let lat = document.getElementById("latitude") . value;
    let lon =  document.getElementById("longitude") . value;

    if (!(lat != "" || lon != "")) {
        LocationHelper.findLocation(updateLocation);
    }
    else {updateLocation(new LocationHelper(lat, lon));}
    
});