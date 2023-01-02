<script setup lang="ts">
import axios from "axios";
import { chart } from "./chart";
import { onMounted } from "vue";
import { getGeocodeFromNominatim } from "./map";

let startDateYear: string;
let endDateYear: string;
let launchData: any[] = [];

const getLaunch = async () => {
  const api = `https://ll.thespacedevs.com/2.2.0/launch/?window_end__gte=${endDateYear}-12-31T01%3A13%3A17Z&window_start__gte=${startDateYear}-12-31T01%3A13%3A17Z`;
  await axios.get(api).then((response) => {
    if (response.data) {
      launchData = response.data.results;
      // console.log(launchData)
      getDataForBarChart();
      getLaunchLocation();
    }
  });
};

// onMounted(()=> {
  
// })
let bool = false;
const onSubmit = () => {
 bool = true;

};

const getDataForBarChart = async () => {
  let location = await launchData.map((item) => {
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

const getLaunchLocation = async () => {
  let location: any = await launchData.map((item) => {
    return [item.pad.location.name];
  });
  getGeocodeFromNominatim(location);
};

</script>

<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input
        type="text"
        v-model="startDateYear"
        placeholder="Enter start year"
      />
      <input type="text" v-model="endDateYear" placeholder="Enter end year" />
      <button type="submit" @click="getLaunch">submit</button>
    </form>

    <!-- <div v-if="bool">   -->
     
        <table>
        
            <tr >
            <th>result:</th>
          </tr>
          
        
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Launch Window Start</th>
            <th>Launch Window End</th>
            <th>Rocket Name</th>
          </tr>

          <tr v-for="item in launchData">
            <td>{{ item.name }}</td>
            <td>{{ item.pad.location.name }}</td>
            <td>{{ item.window_start }}</td>
            <td>{{ item.window_end }}</td>
            <td>{{ item.rocket.configuration.name }}</td>
          </tr>
        </table>
      <!-- </div> -->

      <div id="container"></div>

      <div id="map-container">
        <div id="map" style="width: 80%; height: 100%"></div>
      </div>
    
  </div>
</template>

<style scoped></style>
