import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Point from "ol/geom/Point.js";
import { Icon, Style } from "ol/style.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import "./map.css";

export const getGeocodeFromNominatim = (location: string) => {
  const URI = `https://nominatim.openstreetmap.org/search?q=space&format=json&countrycodes=${location}`;

  const requestGeocode = axios.get(URI).then((result) => {
    if (result) {
      let geocode = result.data;
      getMap(geocode);
    }
  });

  return requestGeocode;
};

const getMap = (geocode: any) => {
  const places = geocode.map(
    (item: { lon: number; lat: number; display_name: string }) => {
      return [
        item.lon,
        item.lat,
        "https://openlayers.org/en/latest/examples/data/icon.png",
        item.display_name,
      ];
    }
  );

 
  const vectorSource = new VectorSource({});

  for (let i = 0; i < places.length; i++) {
   const iconFeature = new Feature({
      geometry: new Point(fromLonLat([places[i][0], places[i][1]])),
      name: places[i][3],
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: places[i][2],
      }),
    });

    iconFeature.setStyle(iconStyle);
    vectorSource.addFeature(iconFeature);
  }

  let map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      new VectorLayer({
        source: vectorSource,
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 3,
    }),
  });

  return map;
};
