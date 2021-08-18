<template>
  <div
    class="flex px-3 py-2 items-center rounded mb-1 mr-1 cursor-default"
    :style="{backgroundColor, color}"
  >
    <img
      v-if="teamImage"
      :src="teamImage"
      class="h-5 mr-1"
    />
    <div class="uppercase">
      <span class="opacity-70 pr-1">{{jerseyNumber}}</span>
      <span class="font-black">
        {{nameLast}}
      </span>{{" "}}
      <span class="font-light">
        {{nameFirst}}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "@vue/reactivity";

import cwsLogo from "../assets/teamLogos/cws.svg";
import detLogo from "../assets/teamLogos/det.svg";

const props = defineProps({
  id: [String, Number],
  name: String,
  nameFirst: String,
  nameLast: String,
  team: String,
  teamAbbreviation: String,
  jerseyNumber: String,
});

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
