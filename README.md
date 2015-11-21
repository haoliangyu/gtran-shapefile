# gtran-shapefile
convert geojson to shapefile and backwards

## Installation

```javascript
npm install gtran-shapefile
```

## Functions

* **setPromiseLib(object)**

    Specify the promise library. If not, the library will use the native Promise.

* **fromGeoJson(geojson, fileName)**

    Save the geojson into the given file name.

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
shp.fromGeoJson(geojson, 'point.shp')
.then(function(fileNames) {
    console.log('files have been saved at:' + fileNames);
});

```
