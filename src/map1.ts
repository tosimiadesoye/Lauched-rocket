import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Point from "ol/geom/Point.js";
import { Icon, Style } from "ol/style.js";
import "./map.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import axios from "axios";
// https://nominatim.openstreetmap.org/search?q=london&format=json

const places = <const>[
  [
    -80.60775679677019,
    28.414391283836974,
    "https://openlayers.org/en/latest/examples/data/icon.png",
    "Cape Canaveral, FL, USA",
  ],

  [
    63.305811426424135,
    45.96523389038701,
    "https://openlayers.org/en/latest/examples/data/icon.png",
    "Baikonur Cosmodrome, Republic of Kazakhstan",
  ],
];

let normanim: [];
let api_normanim;
export const requestToNormanin = async (value: string) => {
  // value is the launch location
 
  
  let request;
  for (let i = 0; i <= value.length; i++) {
    
     api_normanim = `https://nominatim.openstreetmap.org/search?q=${value[i]}&format=json&limit=1`;
    request = axios.get(api_normanim).then((result) => {
      if (result) {
        normanim = result.data;
        // console.log(normanim);
        // normanim has the long, lat and location
        getMap(normanim);
      }
    });
  }
  return await request;
};
;
export const getMap = (place: string) => {
    // console.log(place)

    place.map((item)=>{
        // console.log(item)
    })

  let iconFeature;
  const vectorSource = new VectorSource({});

  for (let i = 0; i < places.length; i++) {
    iconFeature = new Feature({
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
