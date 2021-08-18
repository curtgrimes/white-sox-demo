let simulationInterval;

export default function getSimulator({ mergedPositionalData, ballPositionalData, lineup, currentEvent, currentBallEvent }) {

  // Massage the given data a little to make it easier to step through
  const positions = mergedPositionalData
    .map((positionalData) => ({
      // Filter for just players
      players: positionalData.positions
        .filter((position) => position.typ === 1)
        .map((player) => ({
          ...player,

          // Replace with actual player ID
          id: lineup.find(
            (lineupItem) => lineupItem.pos === player.id
          )?.id,
        })),

      // Convert timestamps to integers because those will be faster
      // to work with than date objects
      timeStamp: new Date(positionalData.timeStamp).getTime(),
    }))
    .sort(
      // Sort by date (don't assume the array is given in date order)
      (a, b) => a.timeStamp - b.timeStamp
    );

  const earliestTimestamp = positions[0].timeStamp;
  const positionsWithRelativeTimeStamps = positions.map((position) => ({
    ...position,
    timeStamp: position.timeStamp - earliestTimestamp,
  }));

  const ballOffsetToMatchPlayersMs = 3100;

  const ballPositionsWithRelativeTimeStamps =
    ballPositionalData.BallPositions.map(({ BallPosition }) => ({
      ...BallPosition,
      timeStamp: BallPosition.Time * 1000 + ballOffsetToMatchPlayersMs,
    }));


  const startContinuousSimulation = ({ getCurrentTime }) => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }

    simulationInterval = setInterval(() => {
      updateSimulationToTimestamp({ timestamp: getCurrentTime() });
    }, 50);
  };

  const updateSimulationToTimestamp = ({ timestamp }) => {
    const startMs = timestamp;
    const endMs = startMs + 500;

    // Get all the events between startMs and endMs
    const thisIntervalEvents = positionsWithRelativeTimeStamps.filter(
      (snapshot) => snapshot.timeStamp > startMs && snapshot.timeStamp < endMs
    );

    const thisIntervalBallEvents = ballPositionsWithRelativeTimeStamps.filter(
      (snapshot) => snapshot.timeStamp > startMs && snapshot.timeStamp < endMs
    );

    // Choose the first event that falls within this range (if multiple) as the
    // chosen event to display data for now. Update currentEvent and currentBallEvent
    // accordingly.

    if (thisIntervalEvents[0]) {
      currentEvent.value = thisIntervalEvents[0];
    }

    if (thisIntervalBallEvents[0]) {
      currentBallEvent.value = thisIntervalBallEvents[0];
    } else {
      // Not all frames have a ball event
      currentBallEvent.value = null;
    }
  };

  const stopContinuousSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
  };

  return {
    startContinuousSimulation,
    updateSimulationToTimestamp,
    stopContinuousSimulation
  };
}
