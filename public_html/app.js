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
    
 function log(msg) {
    $('.log')[0].textValue += msg;
    
 }

function parseWKT (){
    var format = new ol.format.WKT();
    var shape = format.readGeometry($('.coord-area')[0].textContent);
    if (shape.getType() === 'Polygon') {
        log('ol.geom.Polygon');
    }
    else if (shape.getType() === 'MutliPolgon') {
        log('ol.geom.MutliPolgon');
    }
    else {
        this.data = null;
    }

    geom = shape;

    log('Площадь объекта: ' + shape.getArea());
    
    
    
    var newLink = $(this).find('a');
    newLink.attr('target', '_blank');
    var report = window.open(newLink.attr('href'));

    report.document.body.innerHTML = getCoordReport(shape);
    $('.coord-report').toggleClass('hide');
};

function getCoordReport (geom) {
    // css

    // html
    var table = $('<table/>');
    var row = $('<tr/>');
    row.addClass('coord-report-data-row');
    row.append($('<td/>').html('<p>some data</p>'));
    row.append($('<td/>').html('<p>some data</p>'));
    table.append(row);
   return table.html();
};
