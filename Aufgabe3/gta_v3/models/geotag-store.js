// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

const GeoTag = require('./geotag');
const GeoTagExamples = require('./geotag-examples');

class InMemoryGeoTagStore{

    #geoTags;
 
    constructor() {
        // load Examples
        let tmp = GeoTagExamples.tagList;

        // empty array to convert examples
        let tmp_geoTags = [];
        
        // convert example arr. to GeoTag type and add to tmp_geoTags
        tmp.forEach(function (element) {
            let tmp_tag = new GeoTag(element[0], element[1], element[2], element[3]);
            tmp_geoTags.push(tmp_tag)
        });

        // set privte var with tmp var
        this.#geoTags = tmp_geoTags;
      }

    addGeoTag(tag) {
        this.#geoTags.push(tag);
    }

    removeGeoTag(tag) {
        this.#geoTags.forEach(function (value, i) {
            if(value.name == tag.name){
                this.#geoTags.splice(i, 1);
            }
        });
    }

    getNearbyGeoTags(longitude, latitude, radius) {
        let result = [];

        this.#geoTags.forEach(function (tag) {
            let dx = 71.5 * (tag.longitude - longitude);
            let dy = 111.3 * (tag.latitude - latitude);
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
                result.push(tag);
            }
        })

        return result;
    }

    searchNearbyGeoTags(longitude, latitude, radius, name) {
        let result = [];
        result = this.getNearbyGeoTags(longitude, latitude, radius);

        result = result.filter(function (key) {
                if (key.name.includes(name) || key.tag.includes(name)) {
                    return key;
                }
            });

        
    }

}

module.exports = InMemoryGeoTagStore
