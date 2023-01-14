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

    #geoTagsMap;
    #idCounter;
 
    constructor() {
        // set new ID counter
        let tmp_idCounter = 0;

        // load Examples
        let tmp = GeoTagExamples.tagList;

        // empty array to convert examples
        let tmp_geoTags = [];
        let tmp_geoTagsMap = new Map();
        
        // convert example arr. to GeoTag type and add to tmp_geoTags
        tmp.forEach(function (element) {
            let tmp_tag = new GeoTag(element[0], element[2], element[1], element[3], tmp_idCounter);
            tmp_geoTags.push(tmp_tag);
            tmp_geoTagsMap.set(tmp_idCounter, tmp_tag);
            tmp_idCounter += 1;
        });
        
        this.#idCounter = tmp_idCounter;
        // set privte var with tmp var
        this.#geoTagsMap = tmp_geoTagsMap;  
      }

    addGeoTag(name, long, lat, hashtag) {
        id = this.#idCounter;
        this.#idCounter += 1;
        let tag = new GeoTag(name, long, lat, hashtag, id)
        this.#geoTagsMap.set(id, tag);
        return id;
    }

    removeGeoTag(id) {
        this.#geoTagsMap.delete(id);
    }

    getNearbyGeoTags(longitude, latitude, radius) {
        let result = [];

        this.#geoTagsMap.forEach((tag)=>{
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
                if (key.name.toLowerCase().includes(name.toLowerCase()) || key.tag.toLowerCase().includes(name.toLowerCase())) {
                    return key;
                }
            });

        return result;
    }

    getGeoTagByID(id) {
        if (this.#geoTagsMap.get(id)) {
            return this.#geoTagsMap.get(id)
        }
    }

    getGeotags() {
        return Array.from(this.#geoTagsMap.values());
    }

    searchGeoTags(name) {
        let result = this.getGeotags();
        result = result.filter(function (key) {
            if (key.name.toLowerCase().includes(name.toLowerCase()) || key.tag.toLowerCase().includes(name.toLowerCase())) {
                return key;
            }
        });

    return result;
    }

    updateGeoTagByID(id, name, long, lat, tag) {
        if (this.#geoTagsMap.get(id)) {
            updatedTag = this.#geoTagsMap.get(id);
            updatedTag.name = name;
            updatedTag.longitude = long;
            updatedTag.latitude = lat;
            updatedTag.tag = tag;
            this.#geoTagsMap.set(id, updatedTag);
            return newTag;
        }
    }

}

module.exports = InMemoryGeoTagStore
