var gtran = require('../src/script.js');
var fs = require('fs');
var logger = require('log4js').getLogger();

var chai = require('chai');
var expect = chai.expect;

describe('Shapefile module', function() {

    var saveName = 'test/result/test_POINT.shp';

    var testData = 'test/data/test_POINT.shp';

    var geojson = {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'geometry': {"type":"POINT","coordinates":[-70.2532459795475,43.6399758607149]},
            'properties': { 'id': 1 }
        }]
    };

    gtran.setPromiseLib(require('promise'));

    it('should save the geojson as a shapefile', function() {
        gtran.fromGeoJson(geojson, saveName, {
            // WGS84
            esriWKT: 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'
        }).then(function(files) {
            expect(files.length).to.be.equal(3);
        })
        .catch(function(err) {
            logger.error(err);
        });
    });

    it('should read the shapefile and return a geojson', function() {
        gtran.toGeoJson(testData).then(function(geojson) {
            expect(geojson.features.length).to.be.equal(1);
            expect(geojson.features[0].properties).to.have.property('id');
            expect(geojson.features[0].properties.id).to.be.equal(1);
        })
        .catch(function(err) {
            logger.error(err);
        });
    });

});
