<script setup lang="ts">

import axios from "axios";
import { chart } from "./chart";
import { onMounted } from "vue";
import { getMap } from "./map";

let startDate: string;
let endDate: string;
let data: any[] = [];


const getLaunch = async () => {
  const api = `https://ll.thespacedevs.com/2.2.0/launch/?window_end__gte=${endDate}-12-31T01%3A13%3A17Z&window_start__gte=${startDate}-12-31T01%3A13%3A17Z`;
  await axios.get(api).then((response) => {
    if (response.data) {
      data = response.data.results;

      getData();
    }
  });
};

const onSubmit = (event: Event) => {
  if (event) event.preventDefault();
};
const getData = async () => {
  console.log(data)
  let location = data.map((item) => {
    return [
      item.pad.location.country_code,
      item.pad.location.total_launch_count,
    ];
  });
  
  let newData = {
    header: ["Country", "Launches"],
    rows: location,
  };

  return chart(newData);
};

onMounted(() => {
  getLaunch();
  getMap();
});


</script>

<template>
  <div>
    <div>
      <form @submit.prevent="onSubmit">
        <input type="text" v-model="startDate" placeholder="Enter start year" />
        <input type="text" v-model="endDate" placeholder="Enter end year" />
        <button @click="getLaunch">submit</button>
      </form>
    </div>
    <div></div>
    <table>
      <tr>
        <th>result</th>
      </tr>
      <tr>
        <th>Name</th>
        <th>Location</th>
        <th>Launch Window Start</th>
        <th>Launch Window End</th>
        <th>Rocket Name</th>
      </tr>
      <tr v-for="item in data">
        <td>{{ item.name }}</td>
        <td>{{ item.pad.location.name }}</td>
        <td>{{ item.window_start }}</td>
        <td>{{ item.window_end }}</td>
        <td>{{ item.rocket.configuration.name }}</td>
      </tr>
    </table>
  </div>

  <div id="container"></div>
  <div id="map-container">
    <div id="map" style="width: 80%; height: 100%"></div>
  </div>
</template>

<style scoped></style>
