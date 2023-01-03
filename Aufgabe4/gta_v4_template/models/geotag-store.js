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

function createTagID(tag) {
    let tag_str = tag.longitude + "_" + tag.latitude + "_" + tag.name + "_" + tag.tag
    //set variable hash as 0
    var hash = 0;
    // if the length of the string is 0, return 0
    if (tag_str.length == 0) return hash;
    for (let i = 0 ;i<tag_str.length ; i++)
    {
        let ch = tag_str.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
    }
    return hash;
}

class InMemoryGeoTagStore{

    #geoTagsMap;
 
    constructor() {
        // load Examples
        let tmp = GeoTagExamples.tagList;

        // empty array to convert examples
        let tmp_geoTags = [];
        let tmp_geoTagsMap = new Map();
        
        // convert example arr. to GeoTag type and add to tmp_geoTags
        tmp.forEach(function (element) {
            let tmp_tag = new GeoTag(element[0], element[2], element[1], element[3]);
            tmp_geoTags.push(tmp_tag);
            tmp_geoTagsMap.set(createTagID(tmp_tag), tmp_tag);
        });

        // set privte var with tmp var
        this.#geoTagsMap = tmp_geoTagsMap;  
      }

    addGeoTag(tag) {
        id = createTagID(tag);
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
            newTag = new GeoTag(name, long, lat, tag);
            this.#geoTagsMap.set(id, newTag);
            return newTag;
        }
    }

}

module.exports = InMemoryGeoTagStore
