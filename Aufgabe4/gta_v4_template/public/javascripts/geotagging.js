// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

let memoryTaglist = JSON.parse(document.getElementById("mapView").getAttribute("data-tags"));

function initPagination() {

    document.getElementById("paginationNext").disabled = true;
    document.getElementById("paginationPrev").disabled = true;

    document.getElementById("currentPage").innerHTML = "0";
    document.getElementById("listElements").innerHTML = memoryTaglist.length;

    document.getElementById("maxPage").innerHTML = "0";
    fetchAllTags().then(updatePagination);
}

function updateMap_by_LatLon(lat, lon) {
    taglist_json = JSON.parse(decodeURIComponent(document.getElementById("mapView").getAttribute("data-tags")));

    mm = new MapManager('3qE6hTnfkG4AwMPpgnCpyHG7NaHyxOi9');
    mapURL = mm.getMapUrl(lat, lon, taglist_json);

    document.getElementById("mapView") . src = mapURL;
}

function updateMap_by_tags(answer_json) {
    let lat = document.getElementById("latitude") . value;
    let lon =  document.getElementById("longitude") . value;
    mm = new MapManager('3qE6hTnfkG4AwMPpgnCpyHG7NaHyxOi9');
    mapURL = mm.getMapUrl(lat, lon, answer_json.geotags);

    document.getElementById("mapView") . src = mapURL;
    return answer_json;
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
        initPagination();
    }
}

function updateTagList(answer_json) {
    memoryTaglist = answer_json.geotags;
    document.getElementById("currentPage").innerHTML = answer_json.currPage;
    return answer_json;
}

function updatePagination(answer_json) {
    let currentPage = answer_json.currPage;
    let taglist = answer_json.geotags;
    if (taglist !== undefined) {
        let list = document.getElementById("discoveryResults");
        list.innerHTML = "";

        taglist.forEach(function (tag) {
            let li = document.createElement("li");
            li.innerHTML = tag.name + " (" + tag.latitude + "," + tag.longitude + ") " + tag.tag;
            list.appendChild(li);
        });
    }

    let maxPageNumber = answer_json.maxPages;

    if (currentPage < 1) {
        document.getElementById("paginationNext").disabled = true;
        document.getElementById("paginationPrev").disabled = true;
    } else if (currentPage <= maxPageNumber && currentPage === 1) {
        if (maxPageNumber === currentPage) {document.getElementById("paginationNext").disabled = true;}
        else {document.getElementById("paginationNext").disabled = false;}
        document.getElementById("paginationPrev").disabled = true;
    } else if (currentPage < maxPageNumber && currentPage > 1) {
        document.getElementById("paginationNext").disabled = false;
        document.getElementById("paginationPrev").disabled = false;
    } else if (currentPage === maxPageNumber) {
        document.getElementById("paginationNext").disabled = true;
        document.getElementById("paginationPrev").disabled = false;
    }

    document.getElementById("currentPage").innerHTML = currentPage.toString();
    document.getElementById("listElements").innerHTML = answer_json.geotags.length;
    document.getElementById("maxPage").innerHTML = maxPageNumber.toString();
}

/**
 * fetch for All-Tags
 */
 async function fetchAllTags() {
    let geotags = await fetch("http://localhost:3000/api/geotags");
    return await geotags.json();
}


/**
 * fetch for Pagination-Tags
 */
 async function fetchPaginatedTags(currentPage) {
    let geotags = await fetch("http://localhost:3000/api/geotags/page/" + currentPage);
    return await geotags.json();
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
    // cast to array
    return [await response.json()];
}

/**
 * fetch for Discovery
 */
 async function fetchPaginatedTags_by_search(searchTerm, page) {
    let latitude = document.getElementById("searchLatitude") . value;
    let longitude =  document.getElementById("searchLongitude") . value;
    let search_url = "http://localhost:3000/api/geotags/page/"+ page + `?search=${encodeURIComponent(searchTerm)}`+"&latitude=" + latitude + "&longitude=" + longitude;
    let response = await fetch(search_url);
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

    post(geotag);
    fetchPaginatedTags(1).then(updateTagList).then(updatePagination);

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

    fetchPaginatedTags_by_search(searchTerm, 1).then(updateMap_by_tags).then(updateTagList).then(updatePagination).catch(error => alert("Search term does not exist or is not in your proximity"));
});



document.getElementById("paginationNext").addEventListener("click", function (evt) {
    evt.preventDefault();

    let nextPage = parseInt(document.getElementById("currentPage").innerHTML) + 1;
    let searchTerm = document.getElementById("searchterm").value;
    document.getElementById("currentPage").innerHTML = nextPage.toString();

    fetchPaginatedTags_by_search(searchTerm, nextPage).then(updateMap_by_tags).then(updateTagList).then(updatePagination).catch(error => alert("Search term does not exist"));
});

document.getElementById("paginationPrev").addEventListener("click", function (evt) {
    evt.preventDefault();

    let prevPage = parseInt(document.getElementById("currentPage").innerHTML) - 1;
    let searchTerm = document.getElementById("searchterm").value;
    document.getElementById("currentPage").innerHTML = prevPage.toString();

    fetchPaginatedTags_by_search(searchTerm, prevPage).then(updateMap_by_tags).then(updateTagList).then(updatePagination).catch(error => alert("Search term does not exist"));
});



/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation, true);
