<template>
  <div class="px-4 md:px-0">
    <div class="container mx-auto my-10">
      <h1 class="text-3xl mb-2">White Sox Play Data Simulation</h1>
      <p>Seek through the video to see the players move on the map. Hover over a player to highlight them.</p>
      <p>Demo of play data from the White Sox v. Tigers game on Saturday, June 12, 2021 by <a
          href="https://curtgrimes.com"
          target="_blank"
        >Curt Grimes</a>.</p>
      <p class="mt-3 font-bold text-lg"><a href="https://github.com/curtgrimes/white-sox-demo">Source (GitHub)</a> &middot; <a href="https://github.com/curtgrimes/white-sox-demo/blob/main/thought-process.md">Thought process</a></p>
    </div>
    <div class="container mx-auto flex flex-wrap md:flex-nowrap space-y-5 md:space-y-0 md:space-x-5">
      <div class="w-full md:w-1/2 mx-auto">
        <div class="aspect-w-1 aspect-h-1 relative">
          <div
            v-html="data.measurements.diagram"
            style="background:#eee;position:absolute;top:0;right:0;bottom:0;left:0"
          ></div>
          <div
            v-for="player in currentEvent.players"
            :key="player.id"
            class="absolute w-auto h-auto top-auto right-auto transition-opacity"
            :class="{
              'opacity-40 filter z-0': highlightedPlayerId && highlightedPlayerId !== String(player.id),
              'z-30 scale-110': highlightedPlayerId === String(player.id)
            }"
            :style="{
              left: `${((player.x + 315) / 620) * 100}%`,
              bottom: `${((player.y + 125) / 620) * 100}%`,
            }"
          >
            <PlayerCardMap
              :id="player.id"
              :name="playerWithId(player.id)?.name_full"
              :name-first="playerWithId(player.id)?.name_use || playerWithId(player.id)?.name_first"
              :name-last="playerWithId(player.id)?.name_last"
              :team="playerWithId(player.id)?.team_name"
              :jersey-number="playerWithId(player.id)?.jersey_number"
              :team-abbreviation="playerWithId(player.id)?.team_abbrev"
              @mouseenter="highlightedPlayerId = String(player.id)"
              @mouseleave="highlightedPlayerId = null"
            />
          </div>
          <transition name="fade">
            <Ball
              v-if="currentBallEvent?.Position"
              :style="{
                left: `${((currentBallEvent.Position.X + 300) / 620) * 100}%`,
                bottom: `${((currentBallEvent.Position.Y + 125) / 620) * 100}%`,}
              "
            />
          </transition>
        </div>
      </div>
      <div class="md:w-1/2">
        <div class="aspect-w-16 aspect-h-9 mb-4">
          <video
            src="./public/video.mp4"
            controls
            autoplay
            loop
            muted
            class="w-full"
            ref="videoElement"
            @play="startContinuousSimulation({
              getCurrentTime: ()=> $event.target.currentTime * 1000,
              currentEvent,
              currentBallEvent
            })"
            @pause="stopContinuousSimulation()"
            @seeking="updateSimulationToTimestamp({
              timestamp: $event.target.currentTime * 1000,
              currentEvent,
              currentBallEvent
            })"
          ></video>
        </div>
        <h2 class="mb-2">Explore Players</h2>
        <div class="flex flex-wrap">
          <PlayerCard
            v-for="player in players"
            class="transition-opacity"
            :class="{'opacity-50': highlightedPlayerId && highlightedPlayerId !== player.player_id}"
            :key="player.player_id"
            :id="player.player_id"
            :name="player.name_full"
            :name-first="player.name_use || player.name_first"
            :name-last="player.name_last"
            :team="player.team_name"
            :jersey-number="player.jersey_number"
            :team-abbreviation="player.team_abbrev"
            @mouseenter="highlightedPlayerId = player.player_id"
            @mouseleave="highlightedPlayerId = null"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlayerCard from "./components/PlayerCard.vue";
import PlayerCardMap from "./components/PlayerCardMap.vue";
import Ball from "./components/Ball.vue";
import { onMounted, ref } from "vue";
import data from "./data.json";
import getSimulator from "./simulator";
import { getPlayers } from "./players";

const highlightedPlayerId = ref();
const videoElement = ref(null);
const currentEvent = ref({});
const currentBallEvent = ref({});
const players = ref([]);

onMounted(async () => {
  players.value = await getPlayers({ lineup: data.gameEvent.lineup });
});

const playerWithId = (playerId) =>
  (players.value || []).find(
    (player) => String(player.player_id) === String(playerId)
  );

const {
  startContinuousSimulation,
  updateSimulationToTimestamp,
  stopContinuousSimulation,
} = getSimulator({
  mergedPositionalData: data.mergedPositionalData,
  ballPositionalData: data.ballPositionalData,
  lineup: data.gameEvent.lineup,
  currentEvent,
  currentBallEvent,
});
</script>
