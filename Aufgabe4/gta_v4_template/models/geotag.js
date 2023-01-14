// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    constructor(name, longitude, latitude, tag, id) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.name = name;
        this.tag = tag;
        this.id = id;
      }
    
}

module.exports = GeoTag;
