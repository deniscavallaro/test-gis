L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
  onAdd: function (map) {
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on("click", this.getFeatureInfo, this);
  },

  onRemove: function (map) {
    map.off("click", this.getFeatureInfo, this);
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
  },

  getFeatureInfo: function (evt) {
    const url = this.getFeatureInfoUrl(evt.latlng);
    if (!url) return;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (this.onFeatureClick) {
          this.onFeatureClick(data, evt.latlng);
        }
      })
      .catch((err) => console.error("GetFeatureInfo error:", err));
  },

  getFeatureInfoUrl: function (latlng) {
    const point = this._map.latLngToContainerPoint(latlng, this._map.getZoom());
    const size = this._map.getSize();

    const params = {
      request: "GetFeatureInfo",
      service: "WMS",
      srs: "EPSG:4326",
      styles: this.wmsParams.styles,
      transparent: this.wmsParams.transparent,
      version: this.wmsParams.version || "1.1.1",
      format: this.wmsParams.format,
      bbox: this._map.getBounds().toBBoxString(),
      height: size.y,
      width: size.x,
      layers: this.wmsParams.layers,
      query_layers: this.wmsParams.layers,
      info_format: "application/json"
    };

    params[params.version === "1.3.0" ? "i" : "x"] = Math.round(point.x);
    params[params.version === "1.3.0" ? "j" : "y"] = Math.round(point.y);

    return this._url + L.Util.getParamString(params, this._url, true);
  }
});

L.tileLayer.betterWMS = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);
};
