# gtran-shapefile

[![Build Status](https://travis-ci.org/haoliangyu/gtran-shapefile.svg?branch=master)](https://travis-ci.org/haoliangyu/gtran-shapefile)

convert geojson to shapefile and backwards

## Installation

```javascript
npm install gtran-shapefile
```

## Functions

* **setPromiseLib(object)**

    Specify the promise library. If not, the library will use the native Promise.

* **fromGeoJson(geojson, fileName, options)**

    Save the geojson into the given file name.

    Options:

    * **esriWKT**: ESRI WTK string that specifies the shapefile's spatial reference and generates .prj file. It could be found at [SpatialReference.org](http://spatialreference.org/).


* **toGeoJson(fileName)**

    Read the given file and convert it into geojson.

## Use Example

```javascript
var shp = require('gtran-shapefile');

// if specific promise library is needed
shp.setPromiseLib(require('bluebird'));

// Read shapefile
shp.toGeoJson('source.shp')
.then(function(object) {
    var geojson = object;
});

// Save geojson into shapefile
shp.fromGeoJson(geojson, 'point.shp', {
  // ESRI WKT string of WGS84
  esriWKT: 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'
})
.then(function(fileNames) {
    console.log('files have been saved at:' + fileNames);
});

```
