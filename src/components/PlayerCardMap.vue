<template>
  <div
    class="flex px-2 py-1 items-center rounded-xl rounded-bl-none cursor-default"
    :style="{backgroundColor, color}"
    @mouseenter="showDetails = true"
    @mouseleave="showDetails = false"
  >
    <img
      v-if="teamImage"
      :src="teamImage"
      class="h-4 mr-1"
    />
    <span class="text-xs font-bold">
      <span
        class="uppercase block"
        v-if="showDetails"
      >
        {{nameLast}}
        <span class="font-light">{{nameFirst}}</span>
      </span>
      <span>{{jerseyNumber}}</span>
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";

import cwsLogo from "../assets/teamLogos/cws.svg";
import detLogo from "../assets/teamLogos/det.svg";

const props = defineProps({
  id: [String, Number],
  nameFirst: String,
  nameLast: String,
  team: String,
  teamAbbreviation: String,
  jerseyNumber: String,
});

const showDetails = ref(false);

const teamImage = computed(() => {
  if (!props.teamAbbreviation) {
    return null;
  }

  switch ((props.teamAbbreviation || "").toLowerCase()) {
    case "cws":
      return cwsLogo;
    case "det":
      return detLogo;
    default:
      return null;
  }
});

const backgroundColor = computed(() => {
  switch ((props.teamAbbreviation || "").toLowerCase()) {
    case "cws":
      return "#000";
    case "det":
      return "#0c2c56";
    default:
      return "#fff";
  }
});

const color = computed(() => {
  switch ((props.teamAbbreviation || "").toLowerCase()) {
    case "cws":
    case "det":
      return "#fff";
      return "#fff";
    default:
      return "#000";
  }
});
</script>
