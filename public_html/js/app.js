/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var shape;
var feature;

//var testWKT = 'POLYGON((-5.85203657522859544 1.23857024106400582,-5.52784704904405721 2.31920199501246804,-4.25602660016625123 1.77057356608478722,-3.92352452202826285 0.93931837073981628,-4.70490440565253554 0.35743973399833662,-5.25353283458021636 0.44056525353283371,-5.85203657522859544 1.23857024106400582))'; 

var feature = {
    name: 'name',
    shape: null// форма 
};

function init() {
    //$('ui-button-text').enabled = false;
}

function parseWKT() {
    shape = OpenLayers.Geometry.fromWKT($('.coord-area')[0].textContent);
    if (shape.CLASS_NAME === 'OpenLayers.Geometry.Polygon') {
        console.log('OpenLayers.Geometry.Polygon');
    } 
    else if (shape.CLASS_NAME === 'OpenLayers.Geometry.MutliPolgon'){
        console.log('OpenLayers.Geometry.MutliPolgon');
    }
    else {
        return null;
    }
    feature.shape = shape;
    
    $('.log')[0].textContent = 'Площадь: ' + shape.getArea();
}
