<script setup lang="ts">
import axios from "axios";
import { chart } from "./chart";
import { reactive } from "vue";
import { getGeocodeFromNominatim } from "./map";
import { Store, Item } from "./type";

let startDateYear= "";
let endDateYear = "";

const getLaunch = async () => {
  const api = `https://ll.thespacedevs.com/2.2.0/launch/?window_end__gte=${endDateYear}-12-31T01%3A13%3A17Z&window_start__gte=${startDateYear}-12-31T01%3A13%3A17Z`;
  await axios.get(api).then((response) => {
    if (response.data) {
      store.launchData = response.data.results;
      getDataForBarChart();
      getLaunchLocation();
    }
  });
};

const store = reactive<Store>({
  launchData: [],
  getLaunchData: getLaunch,
});

let bool = false;
const onSubmit = () => {
  bool = true;
};

const getDataForBarChart = () => {
  let location = store.launchData.map((item: Item) => {
    return [
      item.pad.location.country_code,
      item.pad.location.total_launch_count,
    ];
  });

  let newData = {
    header: ["Country", "Launches"],
    rows: location,
  };

  chart(newData);
};

const getLaunchLocation = () => {
  let location = store.launchData.map((item: Item) => {
    return [item.pad.location.country_code];
  });
  getGeocodeFromNominatim(location);
};
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <p>End year should be greater than start year</p>
      <input
        type="text"
        v-model="startDateYear"
        placeholder="Enter start year"
      />
      <input type="text" v-model="endDateYear" placeholder="Enter end year" />
      <button type="submit" @click="store.getLaunchData">submit</button>
    </form>

    <table>
      <tr>
        <th>result:</th>
      </tr>

      <tr>
        <th>Name</th>
        <th>Location</th>
        <th>Launch Window Start</th>
        <th>Launch Window End</th>
        <th>Rocket Name</th>
      </tr>

      <tr v-for="item in store.launchData">
        <td>{{ item.name }}</td>
        <td>{{ item.pad.location.name }}</td>
        <td>{{ item.window_start }}</td>
        <td>{{ item.window_end }}</td>
        <td>{{ item.rocket.configuration.name }}</td>
      </tr>
    </table>

    <div id="container"></div>

    <div id="map-container">
      <div id="map" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>
