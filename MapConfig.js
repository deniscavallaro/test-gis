  static MAP_CONFIG = {
    basemaps: { 
      osm: {
        type: "tile",
		label: "OSM",
		url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        options: {
		  attribution: "© OpenStreetMap"
		}
      },
      satellite: {
		type: "tile",
		label: "Satellite",
        url: "https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.jpg?keytq4NkZ5dHYumXCN3aAZX",
        options: {
		  attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"
		}
      }
    }, 

    overlays: {
      edifici_Veneto: {
	   	type: "betterWMS",
	  	label: "Edifici Veneto",
		region: "veneto",
		url: "https://idt2-geoserver.regione.veneto.it/geoserver/ows",
		options: {
		  layers: "rv:edifici_veneto_feb2022",
		  format: "image/png",
          transparent: true
		}
      },
      ctr_Veneto: {
	    type: "betterWMS",
		label: "CTR Veneto",
        region: "veneto",
		url: "https://idt2-geoserver.regione.veneto.it/geoserver/ows",
		options: {
		  layers: "rv:ctrr",
		  format: "image/png",
          transparent: true
		}
      },
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
	  usoDelSuolo_EmiliaRomagna: {
		type: "betterWMS",
		label: "Uso del suolo Emilia-Romagna",
        region: "emilia-romagna",
		url: "https://servizigis.regione.emilia-romagna.it/wms/uso_del_suolo",
		options: {
	      layers: "2020_uso_suolo_ed2023",
		  format: "image/png",
          transparent: true
		}
      },
      ctr_EmiliaRomagna: {
	    type: "betterWMS",
		label: "CTR Emilia-Romagna",
        region: "emilia-romagna",
		url: "https://servizigis.regione.emilia-romagna.it/wms/dbtr_ctr5",
		options: {
		  layers: "DBTR_Ctr5",
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
      fabbricati_Toscana: {
		type: "betterWMS",
		label: "Fabbricati Toscana",
        region: "toscana",
		url: "https://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&",
		options: {
		  layers: "rt_cat.idcatfabbr.rt",
		  format: "image/png",
          transparent: true
		}
      }, 
      fogliCatastali_Toscana: {
        type: "betterWMS",
		label: "Fogli catastali Toscana",
		region: "toscana",
		url: "https://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&",
		options: {
		  layers: "rt_cat.idcatbdfog.rt",
		  format: "image/png",
            transparent: true
		}
      },
      particelleCatastali_Toscana: {
        type: "betterWMS",
		label: "Particelle catastali Toscana",
		region: "toscana",
		url: "https://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&",
		options: {
		  layers: "rt_cat.idcatpart.rt",
		  format: "image/png",
          transparent: true
		}
      },
      ctr_Toscana: {
		type: "betterWMS",
		label: "CTR Toscana",
        region: "toscana",
		url: "https://www502.regione.toscana.it/ows_ctr/com.rt.wms.RTmap/ows?map=owsctr&",
		options: {
		  layers: "rt_ctr.10k",
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
      ctr_Lazio: {
		type: "betterWMS",
		label: "CTR Lazio",
        region: "lazio",
		url: "https://geoportale.regione.lazio.it/geoserver/ows",
		options: {
		  layers: "geonode:ctr_5k_2020",
		  format: "image/png",
          transparent: true
		}
      },
      ortofotoCGR_200203_Lazio: {
		type: "betterWMS",
		label: "Ortofoto Lazio - 2002-2003",
		region: "lazio",
        url: "https://geoportale.regione.lazio.it/geoserver/ows",
		options: {
		  layers: "geonode:2002_2003_CGR_25833_COG",
		  format: "image/png",
          transparent: true
		}
      }
    }
  };