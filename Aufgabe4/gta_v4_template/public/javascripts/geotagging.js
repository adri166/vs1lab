// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


function updateMap_by_LatLon(lat, lon) {
    taglist_json = JSON.parse(decodeURIComponent(document.getElementById("mapView").getAttribute("data-tags")));

    mm = new MapManager('3qE6hTnfkG4AwMPpgnCpyHG7NaHyxOi9');
    mapURL = mm.getMapUrl(lat, lon, taglist_json);

    document.getElementById("mapView") . src = mapURL;
}

function updateMap_by_tags(taglist) {
    let lat = document.getElementById("latitude") . value;
    let lon =  document.getElementById("longitude") . value;
    mm = new MapManager('3qE6hTnfkG4AwMPpgnCpyHG7NaHyxOi9');
    mapURL = mm.getMapUrl(lat, lon, taglist);

    document.getElementById("mapView") . src = mapURL;
}

function updateLocation() {
    let lat = document.getElementById("latitude") . value;
    let lon =  document.getElementById("longitude") . value;

    if ((lat == "" || lon == "")) {
        console.log(`updated lat[${lat}]  lon[[${lon}]`);
        LocationHelper.findLocation(function (locationHelper) {
            document.getElementById("searchLatitude")
                .setAttribute("value", locationHelper.latitude);
            document.getElementById("latitude")
                .setAttribute("value", locationHelper.latitude);
            document.getElementById("searchLongitude")
                .setAttribute("value", locationHelper.longitude);
            document.getElementById("longitude")
                .setAttribute("value", locationHelper.longitude);
            updateMap_by_LatLon(locationHelper.latitude, locationHelper.longitude);
        });
        //TODO paginationSetup();
    }
}

function updateTagList(geotags) {
    actualTaglist = JSON.parse(geotags);
    paginationSetup();
    return parseInt(document.getElementById("currentPage").innerHTML);
}

/**
 * fetch for Tagging
 */
 async function post(tag) {
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(tag),
    });
    return await response.json();
}

/**
 * fetch for Discovery
 */
 async function getTags(searchTerm) {
    let latitude = document.getElementById("searchLatitude") . value;
    let longitude =  document.getElementById("searchLongitude") . value;

    let response = await fetch("http://localhost:3000/api/geotags?search=" + searchTerm + "&latitude=" + latitude + "&longitude=" + longitude);
    return await response.json();
}


/**
 * EventListener Tagging-Form
 */
 document.getElementById("tag-form").addEventListener("submit", function (evt) {
    evt.preventDefault();

    let geotag = {
        name: document.getElementById("name").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
        hashtag: document.getElementById("hashtag").value
    }

    post(geotag).then(getUpdateMap);
    // TODO post(geotag).then(getUpdateMap).then(updateList).then(getPaginationTags).then(updatePagination);
    
    // empty fields
    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";
    document.getElementById("searchterm").value = "";
}, true);

/**
 * EventListener Discovery-Form
 */
document.getElementById("discoveryFilterForm").addEventListener("submit", function (evt) {
    evt.preventDefault();

    let searchTerm = document.getElementById("searchterm").value;

    // TODO getTagList(searchTerm).then(getUpdateMap).then(updateList).then(getPaginationTags).then(updatePagination)
    getTags(searchTerm).then(updateMap_by_tags).catch(error => alert("Search term does not exist"));
});







/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation, true);
