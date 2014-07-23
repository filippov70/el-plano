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
var pointNumber = 0;

function log(msg) {
    $('.log').val($('.log').val() + '\n' + msg);
}

function parseWKT() {
    var format = new ol.format.WKT();
    var shape = format.readGeometry($('.coord-area')[0].textContent);
    geom = shape;

    log('Площадь объекта: ' + shape.getArea().toFixed(2));
    
    
    parseGeom();
//    var newLink = $(this).find('a');
//    newLink.attr('target', '_blank');
    var report = window.open('coordreport.html'); 
    report.onload = function () {
        var newtable = table.html();
        report.document.getElementById('coord').innerHTML = '<table>' + newtable + '</table>';  
    };
    report.focus();
    //$('.coord-report').toggleClass('hide');
}

function parseGeom() {
    if (geom.getType() === 'Polygon') {
        log('"Геометрия ol.geom.Polygon"');
        table = $('<table></table>');
        pointNumber = 0;
        createTableHeader();
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
    var firstPointName = ++pointNumber;
    var prefix = 'н';

    if (index > 0) {
        data1.push('—');
        data1.push('—');
        data1.push('—');
        data1.push('—');
        data1.push('—');
        createTableData(data1, data2);
        data1 = [];
        firstPointName = --pointNumber;
    }
    for (var i = 0; i < ring.length; i++) { 
        if (i < ring.length-1) {
            data1.push(prefix + pointNumber);
            ++pointNumber;
        }
        else {
            data1.push(prefix + firstPointName);
        }
        data1.push(ring[i][0]);
        data1.push(ring[i][1]);
        data1.push(' ');
        data1.push(' ');

        if (i < ring.length-1) {
            data2.push(' ');
            data2.push(' ');
            data2.push(' ');
            data2.push(getAngle(
                {
                    x: ring[i + 1][0],
                    y: ring[i + 1][1]
                },
                {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
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
        data1 = [];
        data2 = [];

    }
}

function getLenth(point, nextPoint) {
    var dx = nextPoint.x - point.x;
    var dy = nextPoint.y - point.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)).toFixed(2);
}

function getAngle(point, nextPoint) {
    return 'getAngle';
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