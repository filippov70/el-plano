/* 
 * The MIT License
 *
 * Copyright 2014 filippov.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var logger = null;
var geom = null;
var table = null;
var geodataTable = null;
var pointNumber = 0;

function log(msg) {
    $('.log').val($('.log').val() + '\n' + msg);
}

function createGeodataRepoprt() {
    prepare();
 
    var geodataReport = window.open('geodata.html', 'Geodata');
    //var report = window.open('coordreport.html', 'Report');
    geodataReport.onload = function () {
        var newtable = geodataTable.html();
        //report.document.getElementById('coord').innerHTML = '<table>' + newtable + '</table>';
        var data = $('#data', geodataReport.document);
        data.html('<table>' + newtable + '</table>');
    };
    geodataReport.focus();
}

function createReport() {
    prepare();
    var report = window.open('coordreport.html', 'Report');
    report.onload = function () {
        var newtable = table.html();
        //report.document.getElementById('coord').innerHTML = '<table>' + newtable + '</table>';
        var data = $('#coord', report.document);
        data.html('<table>' + newtable + '</table>');
        return false;
    };
    report.focus();
}

function prepare() {
    var format = new ol.format.WKT();
    var shape = format.readGeometry($('.coord-area')[0].textContent);
    geom = shape;
    log('Площадь объекта: ' + shape.getArea().toFixed(2));
    table = $('<table></table>');
    geodataTable = $('<table></table>');
    //var geodataReport = window.open('geodata.html', 'Geodata');
    parseGeom();
}

// depricated
function parseWKT() {
    var format = new ol.format.WKT();
    var shape = format.readGeometry($('.coord-area')[0].textContent);
    geom = shape;

    log('Площадь объекта: ' + shape.getArea().toFixed(2));
    table = $('<table></table>');
    geodataTable = $('<table></table>');
    parseGeom();
}

function parseGeom() {
    if (geom.getType() === 'Polygon') {
        log('"Геометрия ol.geom.Polygon"');
        
        pointNumber = 0;
        createTableHeader();
        createGeodataHeader();
        var coords = geom.getCoordinates();
        table.append('<tbody>');
        $.each(coords, function(idx, val) {
            parseLinearRing(idx, val);
        });
        //return table.html();
    }
    else if (geom.getType() === 'MutliPolgon') {
        log('Геометрия ol.geom.MutliPolgon');
    }
    else {
        log('Геометрия не распознана.');
    }
}

// в openlayers у полигона первая точка дублируется в конце! 
function parseLinearRing(index, ring) {
    log('Обрабатывается контур ' + (index + 1));
    var data1 = [];
    var data2 = [];
    var geodata1 = [];
    var geodata2 = [];
    var firstPointName = ++pointNumber;
    var prefix = 'н';

    if (index > 0) {
        data1.push('—');
        data1.push('—');
        data1.push('—');
        data1.push('—');
        data1.push('—');
        
        geodata1.push('—');
        geodata1.push('—');
        geodata1.push('—');
        createTableData(data1, data2);
        createGeodata(geodata1, geodata2);
        geodata1 = [];
        data1 = [];
        firstPointName = --pointNumber;
    }
    for (var i = 0; i < ring.length; i++) { 
        if (i < ring.length-1) {
            data1.push(prefix + pointNumber);
            geodata1.push(prefix + pointNumber);
            ++pointNumber;
        }
        else {
            data1.push(prefix + firstPointName);
            geodata1.push(prefix + firstPointName);
        }
        data1.push(ring[i][0]);
        data1.push(ring[i][1]);
        data1.push(' ');
        data1.push(' ');
        geodata1.push(' ');
        geodata1.push(' ');

        if (i < ring.length-1) {
            data2.push(' ');
            data2.push(' ');
            data2.push(' ');
            geodata2.push('');
            geodata2.push(getDirectionalAngle(
                {
                    x: ring[i + 1][0],
                    y: ring[i + 1][1]
                },
                {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
            data2.push(getDirectionalAngle(
                {
                    x: ring[i + 1][0],
                    y: ring[i + 1][1]
                },
                {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
            geodata2.push(getLenth(
                {
                    x: ring[i + 1][0],
                    y: ring[i + 1][1]
                }, 
                {
                    x: ring[i][0],
                    y: ring[i][1]
                }))    
            data2.push(getLenth(
                {
                    x: ring[i + 1][0],
                    y: ring[i + 1][1]
                }, 
                {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
        }
        createTableData(data1, data2);
        createGeodata(geodata1, geodata2);
        data1 = [];
        data2 = [];
        geodata1 = [];
        geodata2 = [];
    }
}

function getLenth(point, nextPoint) {
    var dx = nextPoint.x - point.x;
    var dy = nextPoint.y - point.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)).toFixed(2);
}

function getDirectionalAngle(point, nextPoint) {
    var dx = nextPoint.x - point.x;
    var dy = nextPoint.y - point.y;
    if (dx === 0) {
        if (ddy < 0) {
            return '270° 0,0\'';
        }
        else {
            return '90° 0,0\'';
        }
    }
    else {
        var alfa = Math.abs(Math.atan(dy/dx) * (180/Math.PI));
        var angle;
        if (dx > 0 && dy > 0) {
            angle = alfa;
            return getDegreeAndMinit(angle);
        }
        else if (dx < 0 && dy > 0) {
            angle = 180 - alfa;
            return getDegreeAndMinit(angle);
        }
        else if (dx < 0 && dy < 0) {
            angle = 180 + alfa;
            return getDegreeAndMinit(angle);
        }
        else if (dx > 0 && dy < 0) {
            angle = 360 - alfa;
            return getDegreeAndMinit(angle);
        }
        else if (dx > 0 && dy === 0) {
            return '0° 0\'';
        }
        else if (dx < 0 && dy === 0) {
            return '180° 0\'';
        }
    }
}

function getDegreeAndMinit (angle) {
    var a = Math.floor(angle);
    var minit = (angle - a) * 60;
    return a + '° ' + minit.toFixed(1) + '\'';
}

function createTableHeader() {
    var header = $('<tr/>');
    header.addClass('coord-table-header');
    header.append($('<td/>').html('№'));
    var x = $('<td/>');
    x.addClass('coord-td');
    header.append(x.html('X, м'));
    var y = $('<td/>');
    y.addClass('coord-td');
    header.append(y.html('Y, м'));
    header.append($('<td/>').html('Дирекционный угол, ° \''));
    header.append($('<td/>').html('Расстояние, м'));
    table.append(header);
}

function createTableData(data1, data2) {
    var row = $('<tr/>');
    row.addClass('coord-table-row');
    row.append($('<td/>').html('<span>' + data1[0] + '</span>'));
    row.append($('<td/>').html('<span>' + data1[1] + '</span>'));
    row.append($('<td/>').html('<span>' + data1[2] + '</spanp>'));
    row.append($('<td/>').html('<span>' + data1[3] + '</span>'));
    row.append($('<td/>').html('<span>' + data1[4] + '</span>'));
    table.append(row);
    if (data2 && data2.length > 0) {
        var row1 = $('<tr/>');
        row1.addClass('coord-table-row');
        row1.append($('<td/>').html('<span>' + data2[0] + '</span>'));
        row1.append($('<td/>').html('<span>' + data2[1] + '</span>'));
        row1.append($('<td/>').html('<span>' + data2[2] + '</span>'));
        row1.append($('<td/>').html('<span>' + data2[3] + '</span>'));
        row1.append($('<td/>').html('<span>' + data2[4] + '</span>'));
        table.append(row1);
    }
}

function createGeodataHeader() {
    var header = $('<tr/>');
    header.append($('<td/>').html('№'));
    header.append($('<td/>').html('Дир. угол'));
    header.append($('<td/>').html('Расст, м'));
    geodataTable.append(header);
}

function createGeodata(geodata1, geodata2) {
    var row = $('<tr/>');
    row.addClass('coord-table-row');
    row.append($('<td/>').html('<span>' + geodata1[0] + '</span>'));
    row.append($('<td/>').html('<span>' + geodata1[1] + '</span>'));
    row.append($('<td/>').html('<span>' + geodata1[2] + '</spanp>'));
    geodataTable.append(row);
    if (geodata2 && geodata2.length > 0) {
        var row1 = $('<tr/>');
        row1.addClass('coord-table-row');
        row1.append($('<td/>').html('<span>' + geodata2[0] + '</span>'));
        row1.append($('<td/>').html('<span>' + geodata2[1] + '</span>'));
        row1.append($('<td/>').html('<span>' + geodata2[2] + '</span>'));
        geodataTable.append(row1);
    }
}