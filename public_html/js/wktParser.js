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

define (['jquery', 'openlayers'], 
    function($, OL) {
        return {
            // Обработанные данные
            data: null,

            parseWKT : function (){
                shape = OL.Geometry.fromWKT($('.coord-area')[0].textContent);
                if (shape.CLASS_NAME === 'OpenLayers.Geometry.Polygon') {
                    console.log('OpenLayers.Geometry.Polygon');
                }
                else if (shape.CLASS_NAME === 'OpenLayers.Geometry.MutliPolgon') {
                    console.log('OpenLayers.Geometry.MutliPolgon');
                }
                else {
                    this.data = null;
                }
                this.data = shape;

                $('.log')[0].textContent = 'Площадь: ' + shape.getArea();
            }
    };

});




//var testWKT = 'POLYGON((-5.85203657522859544 1.23857024106400582,-5.52784704904405721 2.31920199501246804,-4.25602660016625123 1.77057356608478722,-3.92352452202826285 0.93931837073981628,-4.70490440565253554 0.35743973399833662,-5.25353283458021636 0.44056525353283371,-5.85203657522859544 1.23857024106400582))'; 

//
//
//function init() {
//    //$('ui-button-text').enabled = false;
//}


