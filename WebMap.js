 const DEFAULT_CONFIG = {
	  basemaps: { 
        osm: {
          type: "tile",
	  	  label: "OSM",
		  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          options: {
		    attribution: "© OpenStreetMap"
		  }
        }
	  },
	  overlays: {
	    ortofoto_2024_Veneto: {
		  type: "betterWMS",
		  label: "Ortofoto Veneto - 2024",
          region: "veneto",
		  url: "https://idt2-geoserver.regione.veneto.it/geoserver/ows",
		  options: {
		    layers: "rv:ortofoto_agea_2024",
		    format: "image/png",
            transparent: true
		  }
		},
        ortofoto_2020_EmiliaRomagna: {
	      type: "betterWMS",
		  label: "Ortofoto Emilia-Romagna - 2020",
          region: "emilia-romagna",
		  url: "https://servizigis.regione.emilia-romagna.it/wms/agea2020_rgb",
		  options: {
		    layers: "Agea2020_RGB",
		    format: "image/png",
            transparent: true
		  }
		},
        ortofoto_2022_Toscana: {
		  type: "betterWMS",
		  label: "Ortofoto Toscana - 2022",
          region: "toscana",
		  url: "https://servizigis.regione.emilia-romagna.it/wms/uso_del_suolo",
		  options: {
		    layers: "rt_ofc.5k22.32bit",
		    format: "image/png",
            transparent: true
		  }
		},
        ortofotoCGR_200203_Lazio: {
		  type: "betterWMS",
		  label: "Ortofoto Lazio - 2002-2003",
          url: "https://geoportale.regione.lazio.it/geoserver/ows",
		  options: {
		    layers: "geonode:2002_2003_CGR_25833_COG",
		    format: "image/png",
            transparent: true
		  }
        }
      }
	};
	
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
	constructor(containerId, options = {}) {
	
		this.containerId = containerId;
		this.options = options;
		
		this.config = options.config || DEFAULT_CONFIG;
		
		this.map = L.map(containerId, options);
		
		// Container per controlli
		this.controlsContainer = document.getElementById(options.controlsContainer);
		
		// oggetti interni
		this.basemaps = {};
		this.overlays = {};
		this.currentBasemap = null;
		this.currentRegion = "tutte";
		
		// costruzione layer
		this._buildBasemapsFromConfig();
		this._buildOverlaysFromConfig();
		
		// UI
		if (options.controlsContainer) {
			this._buildBasemapsFromConfig(options.controlsContainer);
			
			// separatore visivo
			const container = document.getElementById(options.controlsContainer);
			container.appendChild(document.createElement("hr"));
			
			this._buildOverlaysFromConfig(options.controlsContainer);
		}
		

		this.bindMapClick();
	}
	
	
	
	_createBasemap(def) {
		if (!def || !def.url) return null;
		return new L.tileLayer(def.url, def.options);
	}

/*
	
	_createOverlay(def) {
        if (!def || !def.url) return null;
		
		const layer = L.TileLayer.BetterWMS(def.url, def.options);

        const self = this;
        layer.onFeatureClick = function(feature, latlng) {
            self.showPractice(feature, latlng);
        };
		
		return layer;
    }
*/

	_createOverlay(def) {
		if (!def || !def.type) return null;

		switch (def.type) {

			case "wms":
				return L.tileLayer.wms(def.url, {
					layers: def.layers,
					format: "image/png",
					transparent: true,
					version: "1.1.1",
					...(def.options || {})
				});

			case "betterWMS": {
				const layer = L.tileLayer.betterWMS(def.url, {
					layers: def.layers,
					format: "image/png",
					transparent: true,
					version: "1.1.1",
					...(def.options || {})
				});

				// callback quando clicchi sulla mappa
				layer.onFeatureClick = (feature, latlng) => {
					this.showPractice(feature, latlng);
				};

				return layer;
			}

			default:
				console.warn("Tipo overlay non supportato:", def.type);
				return null;
		}
	}
	
	_buildBasemapsFromConfig() {
		const basemapDefs = this.config.basemaps || DEFAULT_CONFIG.basemaps;

		Object.entries(basemapDefs).forEach(([name, def]) => {
			const layer = this._createBasemap(def);
		
			if (layer) 
				this.basemaps[name] = layer;
		});
	}
	
	_buildOverlaysFromConfig() {
		const overlaysDefs = this.config.overlays || DEFAULT_CONFIG.overlays;

		Object.entries(overlaysDefs).forEach(([name, def]) => {
			const layer = this._createOverlay(def);

			if (layer) 
				this.overlays[name] = layer;
		});
	}
	
	
	
	// radiobutton
	_buildBasemaps(containerId) {
		const container = document.getElementById(containerId);
		
		if (!container) return;
		
		// titolo
		const title = document.createElement("div");
		title.innerHTML = "<strong>Basemap</strong>";
		container.appendChild(title);
		
		Object.entries(this.basemaps).forEach(([name, layer]) => {
			
			const label = document.createElement("label");
			
			const radio = document.createElement("input");
			radio.type = "radio";
			radio.name = "basemap";
			radio.value = name;
			
			radio.addEventListener("change", () => {
				this.setBasemap(name);
			});
			
			label.appendChild(radio);
			
			// label leggibile da config
			const bm = this.config.basemaps[name];
			const labelText = (bm && bm.label) ? bm.label : name;
			label.append(" " + labelText);
			
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
		})
	}
	
	// checkbox
	_buildOverlays(containerId) {
		const container = document.getElementById(containerId);
		
		if (!container) return;
		
		// titolo
		const title = document.createElement("div");
		title.innerHTML = "<strong>Overlay</strong>";
		container.appendChild(title);
		
		Object.entries(this.overlays).forEach(([name, layer]) => {
			
			const def = this.config.overlays[name];
			
			// filtro regione iniziale
			if (def.region && (this.currentRegion !== "tutte") && (def.region !== this.currentRegion))
				return;
			
			
			const label = document.createElement("label");
			
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.value = name;
			
			checkbox.addEventListener("change", (e) => {
				this.toggleLayer(name, e.target.checked);
			});
			
			label.appendChild(checkbox);
			
			// label leggibile da config
			const ol = this.config.overlays[name];
			const labelText = (ol && ol.label) ? ol.label : name;
			label.append(" " + labelText);
			
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
		})
	}

	
	setRegion(region) {
		this.currentRegion = region;
		
		if (this.controlsContainer) {
			this.controlsContainer.innerHTML = "";
			this._buildBasemaps(this.controlsContainer.id);
			this.controlsContainer.appendChild(document.createElement("hr"));
			this._buildOverlays(this.controlsContainer.id);
		}
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
	
	showFeatures() {

		// geocoder
		new L.Control.Geocoder().addTo(this.map);

		// mini-mappa
		const baseMap = L.tileLayer(
			'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
			{ minZoom: 0, maxZoom: 13 }
		);

		new L.Control.MiniMap(baseMap).addTo(this.map);

		// coordinate mouse
		L.control.mousePosition({
			position: "bottomleft",
			separator: " | ",
			numDigits: 6,
			prefix: "Coordinate:"
		}).addTo(this.map);
	}
}
