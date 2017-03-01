var promiseLib = require('./promise.js');
var fs = require('fs');
var writeShp = require('shp-write').write;
var shapefile = require('shapefile');
var Promise, writeFile;

exports.setPromiseLib = setPromiseLib;

exports.toGeoJson = function(fileName, options) {
    if (!Promise) { setPromiseLib(); }
    if(!fs.statSync(fileName)) { reject(new Error('Given shapefile does not exist.')); }

    return shapefile.read(fileName);
};

exports.fromGeoJson = function(geojson, fileName, options) {
    if (!Promise) { setPromiseLib(); }

    var esriWKT;
    if (options) {
        esriWKT = options.esriWKT;
    }

    var promise = new Promise(function(resolve, reject) {
        try {
            var geoms = [];
            var properties = [];
            geojson.features.forEach(function(feature) {
                geoms.push(feature.geometry.coordinates);

                for (var key in feature.properties) {
                    if (feature.properties.hasOwnProperty(key) && !feature.properties[key]) {
                        feature.properties[key] = ' ';
                    }
                }

                properties.push(feature.properties);
            });

            var geomType;
            switch(geojson.features[0].geometry.type.toUpperCase()) {
                case 'POINT':
                case 'MULTIPOINT':
                    geomType = 'POINT';
                    break;
                case 'LINESTRING':
                case 'MULTILINESTRING':
                    geomType = 'POLYLINE';
                    break;
                case 'POLYGON':
                case 'MULTIPOLYGON':
                    geomType = 'POLYGON';
                    break;
                default:
                    reject(new Error('Given geometry type is not supported'));
            }

            writeShp(properties, geomType, geoms, function(err, files) {
                if (err) {
                    reject(ex);
                } else {
                    resolve(files);
                }
            });
        } catch(ex) {
            reject(ex);
        }
    });

    return promise.then(function(files) {
        if (fileName) {
            var fileNameWithoutExt = fileName;

            if(fileNameWithoutExt.indexOf('.shp') !== -1) {
                fileNameWithoutExt = fileNameWithoutExt.replace('.shp', '');
            }

            var writeTasks = [
                writeFile(fileNameWithoutExt + '.shp', toBuffer(files.shp.buffer)),
                writeFile(fileNameWithoutExt + '.shx', toBuffer(files.shx.buffer)),
                writeFile(fileNameWithoutExt + '.dbf', toBuffer(files.dbf.buffer))
            ];

            if (esriWKT) {
                writeTasks.push(writeFile(fileNameWithoutExt + '.prj', esriWKT));
            }

            return Promise.all(writeTasks)
                .then(function() {
                    return [
                        fileNameWithoutExt + '.shp',
                        fileNameWithoutExt + '.shx',
                        fileNameWithoutExt + '.dbf'
                    ];
                });
         } else {
              var fileData = [
                  { data: toBuffer(files.shp.buffer), format: 'shp' },
                  { data: toBuffer(files.shx.buffer), format: 'shx'},
                  { data: toBuffer(files.dbf.buffer), format: 'dbf'}
              ];

              if (esriWKT) {
                  fileData.push({ data: esriWKT, format: 'prj'});
              }

              return fileData;
        }
    });
};

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}

function setPromiseLib(lib) {
    Promise = promiseLib.set(lib);
    writeFile = promiseLib.promisify(fs.writeFile);
}
