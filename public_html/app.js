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
    pointNumber = 0;
    
    parseGeom();
//    var newLink = $(this).find('a');
//    newLink.attr('target', '_blank');
    var report = window.open('coordreport.html');
    var newtable = table.html();
    //report.document.head.innerHTML = '<link href=\"coord-report.css\" rel=\"stylesheet\" type=\"text/css\"/>';
    report.document.body.innerHTML = '<table>' + newtable + '</table>';
    //$('.coord-report').toggleClass('hide');
}

function parseGeom() {
    if (geom.getType() === 'Polygon') {
        log('"Геометрия ol.geom.Polygon"');
        table = $('<table></table>');
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
    var firstPoint;
    ring.pop();
    // Первый (наружный) контур
    if (index === 0) {
        for (var i = 0; i < ring.length; i++) {
            if (i === ring.length - 1) {

                data1.push(firstPoint);
                data1.push(ring[i][0]);
                data1.push(ring[i][1]);
                data1.push(' ');
                data1.push(' ');

                data2.push(' ');
                data2.push(' ');
                data2.push(' ');
                data2.push('aaaaa');
                data2.push(getLenth(
                        {
                            x: ring[0][0],
                            y: ring[0][1]
                        }, {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
            }
            else if (i < ring.length) {
                ++pointNumber;
                if (i == 0) {
                    firstPoint = pointNumber;
                }

                data1.push(pointNumber);
                data1.push(ring[i][0]);
                data1.push(ring[i][1]);
                data1.push(' ');
                data1.push(' ');

                data2.push(' ');
                data2.push(' ');
                data2.push(' ');
                data2.push('aaaaa');
                data2.push(getLenth(
                        {
                            x: ring[i + 1][0],
                            y: ring[i + 1][1]
                        }, {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
            }
            createTableData(data1, data2);
            data1 = [];
            data2 = [];
        }
    }
    // Поседующие (дырки)
    else {
        data1.push('--');
        data1.push('--');
        data1.push('--');
        data1.push('--');
        data1.push('--');
        createTableData(data1);
        data1 = [];
        for (var i = 0; i < ring.length; i++) {

            if (i === ring.length - 1) {
                data1.push(firstPoint);
                data1.push(ring[i][0]);
                data1.push(ring[i][1]);
                data1.push(' ');
                data1.push(' ');

                data2.push(' ');
                data2.push(' ');
                data2.push(' ');
                data2.push('aaaaa');
                data2.push(getLenth(
                        {
                            x: ring[0][0],
                            y: ring[0][1]
                        }, {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
            }
            else {
                ++pointNumber;
                if (i === 0) {
                    firstPoint = pointNumber;
                }
                data1.push(pointNumber);
                data1.push(ring[i][0]);
                data1.push(ring[i][1]);
                data1.push(' ');
                data1.push(' ');

                data2.push(' ');
                data2.push(' ');
                data2.push(' ');
                data2.push('aaaaa');
                data2.push(getLenth(
                        {
                            x: ring[i + 1][0],
                            y: ring[i + 1][1]
                        }, {
                    x: ring[i][0],
                    y: ring[i][1]
                }));
            }
            createTableData(data1, data2);
            data1 = [];
            data2 = [];
        }
    }
}

function getLenth(point, nextPoint) {
    dx = nextPoint.x - point.x;
    dy = nextPoint.y - point.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)).toFixed(2);
}

function getAngle(point, nextPoint) {
    return 'getAngle';
}

function createTableHeader() {
    var header = $('<tr/>');
    header.addClass('coord-table-header');
    header.append($('<td/>').html('№'));
    header.append($('<td/>').html('X'));
    header.append($('<td/>').html('Y'));
    header.append($('<td/>').html('Дирекционный угол'));
    header.append($('<td/>').html('Расстояние'));
    table.append(header);
}

function createTableData(data1, data2) {
    var row = $('<tr/>');
    row.addClass('coord-table-row');
    row.append($('<td/>').html('<p>' + data1[0] + '</p>'));
    row.append($('<td/>').html('<p>' + data1[1] + '</p>'));
    row.append($('<td/>').html('<p>' + data1[2] + '</p>'));
    row.append($('<td/>').html('<p>' + data1[3] + '</p>'));
    row.append($('<td/>').html('<p>' + data1[4] + '</p>'));
    table.append(row);
    if (data2) {
        var row1 = $('<tr/>');
        row1.addClass('coord-table-row');
        row1.append($('<td/>').html('<p>' + data2[0] + '</p>'));
        row1.append($('<td/>').html('<p>' + data2[1] + '</p>'));
        row1.append($('<td/>').html('<p>' + data2[2] + '</p>'));
        row1.append($('<td/>').html('<p>' + data2[3] + '</p>'));
        row1.append($('<td/>').html('<p>' + data2[4] + '</p>'));
        table.append(row1);
    }
}