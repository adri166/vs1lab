// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
let tagStore = new GeoTagStore();
let saved_lat = null;
let saved_lon = null;

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

 router.get('/', (req, res) => {
  res.render('index', { taglist: [] , lat: saved_lat, lon: saved_lon})
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */



 router.post('/tagging', function(req, res){
  let name = req.body.name;
  let long = req.body.longitude;
  let lat = req.body.latitude;
  let tag = req.body.hashtag;

  saved_lat = lat;
  saved_lon = long;

  tagStore.addGeoTag(new GeoTag(name, long, lat, tag));
  list = tagStore.getNearbyGeoTags(long, lat, 20);
  res.render('index', { taglist: list, lat: saved_lat, lon: saved_lon});
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

 router.post('/discovery', (req, res) => {
  let searchterm = req.body.searchterm;
  let long = req.body.longitude;
  let lat = req.body.latitude;

  saved_lat = lat;
  saved_lon = long;

  list = tagStore.searchNearbyGeoTags(long, lat, 20, searchterm);
  res.render('index', { taglist: list, lat: saved_lat, lon: saved_lon});
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

 app.get('/api/geotags', function (req, res) {
  let searchterm = req.body.searchterm;
  let long = req.body.longitude;
  let lat = req.body.latitude;

  if(searchterm != null && long != null && lat != null) {
    list = tagStore.getNearbyGeoTags(long, lat, 20);
  } else if(searchterm != null) {
    //TODO Search ohne nearby oder radius maximal
    list = tagStore.searchNearbyGeoTags(searchterm);
  } else {
    //TODO all Geotags
    list = tagStore.getNearbyGeoTags();
  }
  res.json(list);
})


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */


 app.post('/api/geotags', function (req, res) {
  let tag = req.body.tag;
  // TODO: ... your code here ...
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

 app.get('/api/geotags/:id', function (req, res) {
  let id = req.params.id;
  tag = tagStore.getGeoTagByID(id);
  res.json(tag);
})


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

 app.put('/api/geotags/:id', function (req, res) {
  let id = req.params.id;
  let tag = req.body.tag;
  //TODO
})


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

 app.delete('/api/geotags/:id', function (req, res) {
  let id = req.params.id;
  tag = tagStore.getGeoTagByID(id);
  tagStore.removeGeoTag(id);
  res.json(tag);
})

module.exports = router;
