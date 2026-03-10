class WebMap {
	
	constructor(containerId, options) {
	
		this.containerId = containerId;
		this.options = options;
		
		this.map = L.map(containerId, options);
		
		// lista basemaps disponibili
		this.basemaps = {};
		
		// lista overlays disponibili
		this.overlays = {};
			
		// basemap attualmente attiva
		this.currentBasemap = null;
		
		this.initBasemaps();
		this.initOverlays();

		this.showInitialPosition();
		this.bindMapClick();

	}
	
	addBasemap(name, url, att) {
		
		this.basemaps[name] = L.tileLayer(url, {
			attribution: att
		});
	}
	
	addOverlay(name, url, nameLayer) {
		
		this.overlays[name] = L.tileLayer.wms(url, {
			layers: nameLayer,
			format: 'image/png',
			transparent: true
		});
		
	}
	
	initBasemaps() {

		this.addBasemap('osm', 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', '© OpenStreetMap');
		this.addBasemap('satellite', 'https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.jpg?key=tq4NkZ5dHYumXCN3aAZX', "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e");
	}
			
	initOverlays() {
		
		this.addOverlay('ortofoto_2024_Veneto', 'https://idt2-geoserver.regione.veneto.it/geoserver/ows', 'rv:ortofoto_agea_full_2024');
		this.addOverlay('ortofoto_202324_EmiliaRomagna', 'https://servizigis.regione.emilia-romagna.it/wms/rer2023_24_rgb', 'rv:RER2023_24_RGB');
		this.addOverlay('ortofotoCGR_200203_Lazio', 'https://geoportale.regione.lazio.it/geoserver/ows', 'geonode:2002_2003_CGR_25833_COG');
		this.addOverlay('ortofoto_2022_Toscana', 'https://www502.regione.toscana.it/ows_ofc/com.rt.wms.RTmap/wms?map=owsofc&', 'rt_ofc.5k22.32bit');
		this.addOverlay('ctr_Veneto', 'https://idt2-geoserver.regione.veneto.it/geoserver/ows', 'rv:ctrr');
		this.addOverlay('ctr_EmiliaRomagna', 'https://servizigis.regione.emilia-romagna.it/wms/dbtr_ctr5', 'DBTR_Ctr5');
		this.addOverlay('ctr_Lazio', 'https://geoportale.regione.lazio.it/geoserver/ows', 'geonode:ctr_5k_2020');
		this.addOverlay('ctr_Toscana', 'https://www502.regione.toscana.it/ows_ctr/com.rt.wms.RTmap/ows?map=owsctr&', 'rt_ctr.10k');
		this.addOverlay('usoDelSuolo_EmiliaRomagna', 'https://servizigis.regione.emilia-romagna.it/wms/uso_del_suolo', '2020_uso_suolo_ed2023');
	}
	
	setBasemap(name) {
		
		const bm = this.basemaps[name];
		
		// se la mappa non esiste affatto nella lista delle basemaps
		if (!bm) return;
		
		// se esiste (non era null), rimuove la basemap
		if (this.currentBasemap) this.map.removeLayer(this.currentBasemap);
		
		// visualizza la basemap
		bm.addTo(this.map);
		
		// la basemap selezionata attualmente diventa quella passata come parametro
		this.currentBasemap = bm;
	}
	
	toggleLayer(name, visible) {
	
		const ol = this.overlays[name];
		
		// se il layer non esiste
		if (!ol) return;
		
		// se e' stato gia' aggiunto e non si vuole visualizzare
		if (this.map.hasLayer(ol) && !visible) this.map.removeLayer(ol);
		
		// se non e' stato aggiunto e si vuole visualizzare
		else if (!(this.map.hasLayer(ol)) && visible) this.map.addLayer(ol);
		
		else return;
		
	}
	
	showInitialPosition() {
		
		this.map.locate({ 
			setView: true,
			maxZoom: 16
		});
		
		this.map.on('locationfound', (e) => {
			var radius = e.accuracy;
			
			L.marker(e.latlng).addTo(this.map)
				.bindPopup("You are within " + radius + " meters from this point").openPopup();

			L.circle(e.latlng, radius).addTo(this.map);
		});
		
		this.map.on('locationerror', (e) => {
			alert(e.message);
		});
	}
	
	zoomToGeometry(marker) {
		
		let latlng;
		
		// se viene passato un marker
		if (marker instanceof L.Marker) latlng = marker.getLatLng();
		else latlng = marker;
		
		// le coordinate prese vengono usate per centrare
		this.map.setView(latlng, 16);
	}
	
	bindMapClick() {

		this.map.on('click', (e) => {

			const latlng = e.latlng;

			// rimuove il vecchio marker
			if (this.marker) {
				this.map.removeLayer(this.marker);
			}

			// crea marker
			this.marker = L.marker(latlng).addTo(this.map);

			// popup
			this.marker
				.bindPopup("You clicked at " + latlng.toString())
				.openPopup();

			// zoom automatico
			this.zoomToGeometry(this.marker);

			// click sul marker -> ricentra
			this.marker.on('click', () => {
				this.zoomToGeometry(this.marker);
			});

		});
	}
	
	showPractice(feature) {
		
	}
}