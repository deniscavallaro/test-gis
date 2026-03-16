/**
 * WebMap 
 *
 * Classe che incapsula la gestione di una mappa Leaflet.
 */
class WebMap {
	
	/**
	 * Costruttore della classe.
	 *
	 * @param {string} containerId ID del div HTML che conterra' la mappa
	 * @param {Object} options Opzioni di configurazione Leaflet
	 */
	constructor(containerId, options) {
	
		this.containerId = containerId;
		this.options = options;
		
		// inizializzazione della mappa Leaflet
		this.map = L.map(containerId, options);
		
		// lista basemaps disponibili
		this.basemaps = {};
		
		// lista overlays disponibili
		this.overlays = {};
			
		// basemap attualmente attiva
		this.currentBasemap = null;
		
		// inizializzazione basemaps e layers
		this.initBasemaps();
		this.initOverlays();
		
		// gestione click sulla mappa
		this.bindMapClick();
	}
	
	/**
	 * Aggiunge una basemap alla lista dei basemap
	 *
	 * @param name Nome identificativo della basemap
	 * @param url URL del tile server
	 * @param att Stringa di attribuzione
	*/
	addBasemap(name, url, att) {
		
		this.basemaps[name] = L.tileLayer(url, {
			attribution: att
		});
	}
	
/*	
	addOverlay(name, url, nameLayer) {
		
		this.overlays[name] = L.tileLayer.wms(url, {
			layers: nameLayer,
			format: 'image/png',
			transparent: true
		});
		
	}  	*/

	/**
	 * Crea e aggiunge un layer WMS interrogabile tramite BetterWMS.
	 *
	 * @param {string} name nome logico del layer
	 * @param {string} url URL del servizio WMS
	 * @param {string} layerName nome del layer nel server WMS
	 */
    addBetterWMSLayer(name, url, layerName) {
        
		const layer = new L.TileLayer.BetterWMS(url, {
            layers: layerName,
            format: "image/png",
            transparent: true,
            version: "1.1.1"
        });

        /*
			Quando BetterWMS identifica una feature cliccata,
			chiama questo hook che a sua volta invoca showPractice().
		*/
        const self = this;
        layer.onFeatureClick = function(feature, latlng) {
            self.showPractice(feature, latlng);
        };
		
		// Memorizza il layer nella lista degli overlay
        this.overlays[name] = layer;
    }

	/**
	 * Inizializza le basemap disponibili.
	 */
	initBasemaps() {

		this.addBasemap('osm', 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', '© OpenStreetMap');
		this.addBasemap('satellite', 'https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.jpg?key=tq4NkZ5dHYumXCN3aAZX', "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e");
	}
	
	/**
	 * Inizializza i layer overlay.
	 */
	initOverlays() {
		
		this.addBetterWMSLayer('usoDelSuolo_EmiliaRomagna', 'https://servizigis.regione.emilia-romagna.it/wms/uso_del_suolo', '2020_uso_suolo_ed2023');
		this.addBetterWMSLayer('edifici_Veneto', 'https://idt2-geoserver.regione.veneto.it/geoserver/ows', 'rv:edifici_veneto_feb2022');

		this.addBetterWMSLayer('fabbricati_Toscana', 'https://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&', 'rt_cat.idcatfabbr.rt');
		this.addBetterWMSLayer('fogliCatastali_Toscana', 'https://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&', 'rt_cat.idcatbdfog.rt');
		this.addBetterWMSLayer('particelleCatastali_Toscana', 'https://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&', 'rt_cat.idcatpart.rt');
		
		this.addBetterWMSLayer('ctr_Veneto', 'https://idt2-geoserver.regione.veneto.it/geoserver/ows', 'rv:ctrr');
		this.addBetterWMSLayer('ctr_EmiliaRomagna', 'https://servizigis.regione.emilia-romagna.it/wms/dbtr_ctr5', 'DBTR_Ctr5');
		this.addBetterWMSLayer('ctr_Lazio', 'https://geoportale.regione.lazio.it/geoserver/ows', 'geonode:ctr_5k_2020');
		this.addBetterWMSLayer('ctr_Toscana', 'https://www502.regione.toscana.it/ows_ctr/com.rt.wms.RTmap/ows?map=owsctr&', 'rt_ctr.10k');
		this.addBetterWMSLayer('ortofoto_2020_EmiliaRomagna', 'https://servizigis.regione.emilia-romagna.it/wms/agea2020_rgb', 'Agea2020_RGB');
		this.addBetterWMSLayer('ortofoto_2024_Veneto', 'https://idt2-geoserver.regione.veneto.it/geoserver/ows', 'rv:ortofoto_agea_2024');
		this.addBetterWMSLayer('ortofotoCGR_200203_Lazio', 'https://geoportale.regione.lazio.it/geoserver/ows', 'geonode:2002_2003_CGR_25833_COG');
		this.addBetterWMSLayer('ortofoto_2022_Toscana', 'https://www502.regione.toscana.it/ows_ofc/com.rt.wms.RTmap/wms?map=owsofc&', 'rt_ofc.5k22.32bit');
		
	}
	
	/**
	 * Imposta la basemap attiva.
	 * 
	 * @param {string} name Nome della basemap
	 */
	setBasemap(name) {
		
		const bm = this.basemaps[name];
		
		// se la basemap richiesta non esiste nella lista
		if (!bm) return;
		
		// rimuove la basemap attualmente visualizzata
		if (this.currentBasemap) this.map.removeLayer(this.currentBasemap);
		
		// aggiunge la nuova basemap alla mappa
		bm.addTo(this.map);
		
		// aggiorna il riferimento alla basemap attiva
		this.currentBasemap = bm;
	}
	
	/**
	 * Attiva o disattiva un layer overlay.
	 * 
	 * @param {string} name	Nome del layer
	 * @param {boolean} visible Condizione (true/false per mostrare/non mostrare il layer)
     */
	toggleLayer(name, visible) {
	
		const ol = this.overlays[name];
		
		// se il layer non esiste
		if (!ol) return;
		
		// Se si vuole visualizzare il layer (true), allora si aggiunge
		if (visible) this.map.addLayer(ol);
		
		// in caso contrario (false), si rimuove
		else this.map.removeLayer(ol);
	}
	
	/**
	 * Centra la mappa sulla posizione iniziale.
	 *
	 * @param {boolean} useGeolocation Se true, usa la posizione del browser;
	 *                                 se false, usa le coordinate passate
	 * @param {number} [lat] Latitudine iniziale (usata se useGeolocation=false)
	 * @param {number} [lng] Longitudine iniziale (usata se useGeolocation=false)
	 */
	showInitialPosition(useGeolocation, lat=undefined, lng=undefined) {

		// Se vogliamo usare la geolocalizzazione del browser
		if (useGeolocation) {

			// Chiede al browser di individuare la posizione
			this.map.locate({
				setView: false  // Non centrare subito, lo facciamo noi con zoomToGeometry
			});

			// Evento quando la posizione viene trovata (una sola volta)
			this.map.once('locationfound', (e) => {

				var radius = e.accuracy; // precisione stimata della geolocalizzazione

				// Aggiunge un marker sulla posizione trovata
				const marker = L.marker(e.latlng).addTo(this.map)
					.bindPopup("You are within " + radius + " meters from this point") // popup con info
					.openPopup();

				// Aggiunge un cerchio per visualizzare la precisione
				L.circle(e.latlng, radius).addTo(this.map);

				// Centra e zooma la mappa sul marker usando il metodo già esistente
				this.zoomToGeometry(marker);
			});

			// Evento in caso di errore di geolocalizzazione
			this.map.once('locationerror', (e) => {
				alert(e.message); // mostra messaggio di errore
			});

		} else {
			// Se non vogliamo usare la geolocalizzazione,
			// usiamo le coordinate passate come punto iniziale

			const latlng = L.latLng(lat, lng); // crea un oggetto LatLng

			// Centra e zooma la mappa sulle coordinate passate
			this.zoomToGeometry(latlng);
		}
	}
	
	/**
	 * Centra la mappa su un marker o su delle coordinate.
	 *
	 * @param {L.Marker|L.LatLng} obj Oggetto su cui effettuare lo zoom
	 */
	zoomToGeometry(obj) {
		
		let latlng;
		
		// se viene passato un marker
		if (obj instanceof L.Marker) latlng = obj.getLatLng();
		else latlng = obj;
		
		// le coordinate prese vengono usate per centrare
		this.map.setView(latlng);
	}
	
	/**
	 * Gestisce il click sulla mappa.
	 * Al click viene creato un marker nella posizione selezionata 
	 * e viene mostrato un popup con le coordinate.
	 */
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
	
	/**
	 * Mostra le informazioni di una feature WMS in un popup.
	 *
	 * @param {Object} feature - oggetto GeoJSON restituito dal server WMS
	 * @param {L.LatLng} latlng - coordinate del click sulla mappa
	 */
	showPractice(feature, latlng) {
        
        let html = `<b>ID: ${feature.id}</b><br>`;
        for (let key in feature.properties) {
            html += `<b>${key}</b>: ${feature.properties[key]}<br>`;
        }

        L.popup().setLatLng(latlng).setContent(html).addTo(this.map);
    }
}