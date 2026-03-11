/**
 * BetterWMS
 *
 * Estensione di L.TileLayer.WMS che aggiunge il supporto alla richiesta
 * WMS GetFeatureInfo quando l'utente clicca sulla mappa.
 *	
 * La classe BetterWMS si occupa esclusivamente di:
 * - Intercettare il click sulla mappa
 * - costruire la richiesta GetFeatureInfo
 * - interrogare il WMS
 * - restituire le feature trovate
 */
L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

	/**
	 * Metodo chiamato automaticamente da Leaflet quando il layer
	 * viene aggiunto alla mappa.
     *
	 * @param {L.Map} map Istanza della mappa Leaflet
     */
    onAdd: function(map) {
		
		// Chiama il comportamento standard del layer WMS
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
		
		// Intercetta l'evento 'click' sulla mappa per avviare la richiesta GetFeatureInfo
        map.on('click', this.getFeatureInfo, this);
    },
	
	/**
	 * Metodo chiamato automaticamente quando il layer viene rimosso dalla mappa.
     *
	 * @param {L.Map} map
     */
    onRemove: function(map) {
		
		// Rimuove il layer WMS
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
		
		// Rimuove il l'ascoltatore su 'click'
        map.off('click', this.getFeatureInfo, this);
    },
	
	/**
	 * Gestisce il click sulla mappa ed effettua la richiesta GetFeatureInfo.
     *
	 * @param {Object} evt Evento click generato da Leaflet
     */
    getFeatureInfo: function(evt) {
		
		// Costruisce l'URL della richiesta WMS GetFeatureInfo
        const url = this.getFeatureInfoUrl(evt.latlng);
		
		// Effettua la richiesta HTTP al server WMS
        fetch(url)
            .then(r => r.json())
            .then(data => {
				
				// Se il server non restituisce feature, non fa nulla
                if (!data.features || data.features.length === 0) return;

                /*
					Se dall'esterno e' stata definita una funzione 'onFeatureClick',
					allora viene utilizzata per gestire la visualizzazione dei dati
                */
				if (this.onFeatureClick) data.features.forEach(f => this.onFeatureClick(f, evt.latlng));
                else {
                    /*
						Se non e' stato definito alcun hook esterno,
						viene mostrato un popup semplice con gli attributi
                    */
					let html = "";
                    data.features.forEach(f => {
						
                        html += `<b>${f.id}</b><br>`;
                        
						for (let key in f.properties) 
                            html += `<b>${key}</b>: ${f.properties[key]}<br>`;
                        html += "<hr>";
                    });

                    L.popup()
                        .setLatLng(evt.latlng)
                        .setContent(html)
                        .openOn(this._map);
                }
            });
    },

	/**
	 * Costruisce l'URL della richiesta GetFeatureInfo secondo lo standard WMS.
     *
	 * @param {L.LatLng} latlng Coordinate del click dell'utente
	 * @returns {string} URL completo della richiesta GetFeatureInfo
     */
    getFeatureInfoUrl: function(latlng) {
		
		// Converte le coordinate geografiche in coordinate pixel
        const point = this._map.latLngToContainerPoint(latlng, this._map.getZoom());
        
		// Converte le coordinate geografiche in coordinate pixel
		const size = this._map.getSize();

        const params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: this.wmsParams.styles,
            transparent: this.wmsParams.transparent,
            version: this.wmsParams.version,
            format: this.wmsParams.format,
            bbox: this._map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: this.wmsParams.layers,
            query_layers: this.wmsParams.layers,
            info_format: 'application/json',
            x: Math.round(point.x),
            y: Math.round(point.y)
        };

        return this._url + L.Util.getParamString(params);
    }
});