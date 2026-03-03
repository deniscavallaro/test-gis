<!DOCTYPE html>
<html>
  <head>
    <title>BrainMap versione dimostrativa WEB</title>
    <link rel="stylesheet" href="v4.6.5-dist/ol.css" type="text/css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol3-layerswitcher@1.1.2/src/ol3-layerswitcher.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/ol-geocoder@latest/dist/ol-geocoder.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/ol-popup@2.0.0/src/ol-popup.css">
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList"></script>
    <script src="v4.6.5-dist/ol.js"></script>
    <!-- <script src="https://unpkg.com/openlayers@4.4.2"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ol-geocoder"></script>
    <script src="https://unpkg.com/ol-popup@2.0.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/ol3-layerswitcher@1.1.2/src/ol3-layerswitcher.js"></script>
    <script src="dom-to-image.min.js"></script>
    <link rel="shortcut icon" href="map.ico" type="image/x-icon"/>
  </head>
<style>
.w100 {width: 100%;}
.tacx {text-align: center;}
/*************************************
	Definizioni relative al div popup
**************************************/
div.popupDiv {
	position: absolute;
	left: 0;
	top: 0;
	display: none;
	z-index: 1;
	background-color: #F0F0F0;
	color: red;
	border: 1px solid silver;
}
div.popupDiv div#popupCaption {
	background-color: #2f5376;
	color: white;
	cursor: default;
	height: 2em;
}
div.popupDiv div#popupCaption div {
	padding: 4px 2px 3px 6px;
	float: left;
}
div.popupDiv div#popupCaption a {
	text-decoration: none;
	display: block;
	float: right;
	height: 2em;
	width: 2em;
	background: url(images/cancel.png) no-repeat center left;
	background-position: 5px;
	cursor: pointer;
}
div.popupDiv div#popupData {
	padding: 5px;
}
.map {
	height: 600px;
	width: 100%;
}
</style>
  <body>
  <form style="margin-top: 5px; margin-bottom: 3px; background-color: #FFF0D4;" name="fxcabal" action="wms_ae.php" method="post">
  	<div><table class="w100"><tr><td class="tacx" width="25%"><select name="tipomappa" class="w100">
<?php
if(isset($_REQUEST['tipomappa'])) {
	if($_REQUEST['tipomappa'] == 0)
		echo('<option value="0" selected>OMS</option><option value="1">Water Color</option>');
	else
		echo('<option value="0">OMS</option><option value="1" selected>Water Color</option>');
} else {
	echo('<option value="0" selected>OMS</option><option value="1">Water Color</option>');
}
?>

</select></td><td class="tacx" width="25%">
<?php
if(isset($_REQUEST['layer1'])) {
	if($_REQUEST['layer1'] == 1)
		echo('<input type="checkbox" name="layer1" id="chkview_id0" value="1" checked />Particelle');
	else
		echo('<input type="checkbox" name="layer1" id="chkview_id0" value="1" />Particelle');
} else {
	echo('<input type="checkbox" name="layer1" id="chkview_id0" value="1" />Particelle');
}
?>
</td><td width="25%">
<?php
if(isset($_REQUEST['layer2'])) {
	if($_REQUEST['layer2'] == 1)
		echo('<input type="checkbox" name="layer2" id="chkview_id0" value="1" checked />Edifici');
	else
		echo('<input type="checkbox" name="layer2" id="chkview_id0" value="1" />Edifici');
} else {
	echo('<input type="checkbox" name="layer2" id="chkview_id0" value="1" />Edifici');
}
?>
</td><td class="tacx" width="25%"><a id="btnSave" onclick="rinfresca();" target="_new">Aggiorna</a></td></tr></table></div>
    <div id="map" class="map"></div>
    <script>

var mylat = 0;
var mylon = 0;
var myView = false;
var map = false;

function rinfresca() {
	alert('Rinfresca');
	var extent = ol.extent.createEmpty();
	map.getLayers().forEach(function(layer) {
		if(layer instanceof ol.layer.Group) {
			layer.getLayers().forEach(function(groupLayer) {
				alert(groupLayer.name);
				if(layer instanceof ol.layer.Vector)
                ol.extent.extend(extent, groupLayer.getSource().getExtent());
			});
		} else {
			alert(layer.get('visible'));
			if(layer instanceof ol.layer.Vector)
                ol.extent.extend(extent, groupLayer.getSource().getExtent());
		}
	});
	//map.getView().fit(extent, map.getSize());
}

/*if(document.fxcabal.tipomappa.value == 0) {
	var mytile = new ol.layer.Tile({
		projection: ETRS89proj,
		source: new ol.source.OSM()
	});
} else {
	var mytile = new ol.layer.Tile({source: new ol.source.Stamen({layer: 'watercolor'})});
}*/


var ETRS89Extent = [5.93, 34.76, 18.99, 47.1];

proj4.defs('EPSG:6706', '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs');

var ETRS89proj = new ol.proj.Projection({
		code: 'EPSG:6706',
		extent: ETRS89Extent
});
ol.proj.addProjection(ETRS89proj);

var startResolution = ol.extent.getWidth(ETRS89Extent) / 1024;
var resolutions = new Array(22);
for (var i = 0, ii = resolutions.length; i < ii; ++i) {
		resolutions[i] = startResolution / Math.pow(2, i);
}

var tileGrid = new ol.tilegrid.TileGrid({
		extent: ETRS89Extent,
		resolutions: resolutions,
		tileSize: [1024, 1024]
});

/* if(document.fxcabal.tipomappa.value == 0) {
	var mytile = new ol.layer.Tile({source: new ol.source.OSM()});
} else {
	var mytile = new ol.layer.Tile({source: new ol.source.Stamen({layer: 'watercolor'})});
}

var parcel_source = new ol.source.TileWMS({
		projection: ETRS89proj,
		url: 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
		params: {
				'LAYERS': 'CP.CadastralParcel',
				'TILED': true
		},
		serverType: 'mapserver'
});

layer1 = new ol.layer.Tile({
		title: 'province',
		visible: true,
		source: new ol.source.TileWMS({
				projection: ETRS89proj,
				url: 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
				params: {
						'LAYERS': 'province'
				},
				serverType: 'mapserver',
				tileGrid: tileGrid
		})
});

layer2 = new ol.layer.Tile({
		title: 'fabbricati',
		visible: true,
		source: new ol.source.TileWMS({
				projection: ETRS89proj,
				url: 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
				params: {
						'LAYERS': 'fabbricati'
				},
				serverType: 'mapserver'
		})
});


var mylayers = [0, layer1, layer2];
//var mylayers = [0, layer1];
var layers = [mytile];
ind = 0;
for(i=1;i<=2;i++) {
	if(document.fxcabal['layer' + i].checked) {
		ind++;
		layers[ind] = mylayers[i];
	}
}

myView = new ol.View({
		center: ol.proj.transform(ol.extent.getCenter(ETRS89Extent), ETRS89proj, 'EPSG:3857'),
    zoom: 6
	});

map = new ol.Map({
	target: 'map',
	layers: layers,
	view: myView
}); */

var parcel_source = new ol.source.TileWMS({
		projection: ETRS89proj,
		url: 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
		params: {
				'LAYERS': 'CP.CadastralParcel',
				'TILED': true
		},
		serverType: 'mapserver'
});


var map_getf = new ol.Map({
		layers: [],
		view: new ol.View({
				projection: ETRS89proj
		})
});

var prova = new ol.source.TileWMS({
	url: 'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/AreasofPotentialSignificantFloodRisk_IT_20190322.map',
	params: {
		'LAYERS': 'AreasofPotentialSignificantFloodRisk'
	},
	serverType: 'mapserver'
});

/*var updateLegend = function(resolution) {
  var graphicUrl = 'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/AreasofPotentialSignificantFloodRisk_IT_20190322.map&service=wms&request=GetLegendGraphic&version=1.3.0&LAYER=AreasofPotentialSignificantFloodRisk&FORMAT=image/png&sld_version=1.1.0';
  //var img = document.getElementById('legend');
  //img.src = graphicUrl;
};*/
prova.setAttributions('<img style="max-height: 200px;" src="http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/AreasofPotentialSignificantFloodRisk_IT_20190322.map&service=wms&request=GetLegendGraphic&version=1.3.0&LAYER=AreasofPotentialSignificantFloodRisk&FORMAT=image/png&sld_version=1.1.0"></img>');
				
var map = new ol.Map({
		layers: [
				new ol.layer.Tile({
						title: 'OSM',
						visible: true,
						source: new ol.source.OSM()
				}),
				new ol.layer.Tile({
						title: 'province',
						visible: false,
						source: new ol.source.TileWMS({
								projection: ETRS89proj,
								url: 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
								params: {
										'LAYERS': 'province'
								},
								serverType: 'mapserver',
								tileGrid: tileGrid
						})
				}),
				new ol.layer.Tile({
					title: 'geoportale',
					visible: false,
					source: prova
				}),
				new ol.layer.Tile({
						title: 'particelle',
						visible: false,
						source: new ol.source.TileWMS({
								projection: ETRS89proj,
								url: 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
								params: {
										'LAYERS': 'CP.CadastralParcel'
								},
								serverType: 'mapserver'
						})
				}),
				new ol.layer.Tile({
						title: 'USA',
						visible: false,
						source: new ol.source.TileWMS({
								//projection: ETRS89proj,
								url: 'https://ahocevar.com/geoserver/wms',
								params: {
										'LAYERS': 'usa:states'
								},
								serverType: 'mapserver'
						})
				})
		],
		target: 'map',
		controls: ol.control.defaults().extend([
				//scaleControl(),
				new ol.control.MousePosition(),
				new ol.control.OverviewMap()
		]),
		view: new ol.View({
				//projection: ol.proj.get('EPSG:6706'),
				center: ol.proj.transform(ol.proj.transform([11.8697856, 45.3501323], 'EPSG:4326', ETRS89proj), ETRS89proj, 'EPSG:3857'),
				zoom: 18
		})
});

	var geocoder = new Geocoder('nominatim', {
			provider: 'photon',
			lang: 'it-IT',
			placeholder: 'Inserisci indirizzo ...',
			limit: 5,
			keepOpen: true
	});
	map.addControl(geocoder);

	var oimg = document.createElement("img");
	oimg.setAttribute('src', 'marker.png');
	oimg.setAttribute('width', '32px');
  map.addOverlay(new ol.Overlay({
    position: ol.proj.transform(ol.proj.transform([11.8697856, 45.3501323], 'EPSG:4326', ETRS89proj), ETRS89proj, 'EPSG:3857'),
    element: oimg
  }));

	var layerSwitcher = new ol.control.LayerSwitcher({
			tipLabel: 'Legenda' // Optional label for button
	});
	map.addControl(layerSwitcher);
	var sl = new ol.control.ScaleLine({
		units: 'imperial',
		bar: true,
    steps: 4,
    text: true,
    minWidth: 140
  });
  map.removeControl(sl);
	map.addControl(sl);
	var getf_popup = new ol.Overlay.Popup();
	map.addOverlay(getf_popup);

	
	map.on('dblclick', function (evt) {
    alert(evt.coordinate);

    // convert coordinate to EPSG-4326
    alert(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
	});

	map.on('singleclick', function(evt) {
			map_getf.getView().setCenter(ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', ETRS89proj));
			map_getf.getView().setZoom(map.getView().getZoom());
			var viewResolution = map_getf.getView().getResolution();
			var url = parcel_source.getGetFeatureInfoUrl(
					ol.proj.transform(evt.coordinate, 'EPSG:3857', ETRS89proj), map_getf.getView().getResolution(), ETRS89proj.getCode(), {
							'INFO_FORMAT': 'text/html',
							'QUERY_LAYERS': ['CP.CadastralParcel']
					});
			if (url) {
					var xhttp;
					xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {
								//alert(xhttp.responseText);
									getf_popup.show(evt.coordinate, xhttp.responseText);;
							}
					};
					//bypass cors policy
					xhttp.open("GET", "https://cors-anywhere.herokuapp.com/" + url, true);
					xhttp.send();
			}
	});

// Initial legend
/*var resolution = map.getView().getResolution();
updateLegend(resolution);

// Update the legend when the resolution changes
map.getView().on('change:resolution', function(event) {
  var resolution = event.target.getResolution();
  updateLegend(resolution);
});*/

/*var geolocation = new ol.Geolocation({
	trackingOptions: {
		enableHighAccuracy: true,
		setTracking: true
	},
	projection: myView.getProjection()
});
alert(geolocation.getPosition());


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,errore);
    } else {
        alert("Geolocation non supportata dal browser.");
    }
}*/


function errore(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

function showPosition(position) {
	mylat = position.coords.latitude;
	mylon = position.coords.longitude;
}

    </script>
   <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
  </form>
  </body>
</html>
