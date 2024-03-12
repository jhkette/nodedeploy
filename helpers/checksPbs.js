const { durations, distances } = require("./values");

/**
 * function checkpb
 * check to see if pb have improved
 * @param dataSet []
 * @param cyclingAllTime {}
 * @param runAllTime {}
 * @returns [] an array of alltime pbs with boolean flags to see if they have changed
 */
function checkPbs(dataSet, cyclingAllTime, runAllTime) {
  let updateFlagCycling = false;
  let updateFlagRunning = false;
  let ftpChange = false;

  for (activity of dataSet) {
    if (
      (activity["type"] == "Ride" || activity["type"] == "VirtualRide") &&
      activity["pbs"]
    ) {
      for (duration of durations) {
        if (activity["pbs"][duration] > cyclingAllTime[duration]) {
          if (duration === "720" || "1200") {
            ftpChange = true;
          }
          updateFlagCycling = true;
          cyclingAllTime[duration] = activity["pbs"][duration];
        }
      }
    }
    if (activity["type"] == "Run" && activity["runningpbs"]) {
      for (distance of distances) {
        if (activity["runningpbs"][distance] < runAllTime[distance]) {
          if (distance === "10000") {
            criticalChange = true;
          }
          updateFlagRunning = true;
          runAllTime[duration] = activity["runningpbs"][distance];
        }
      }
    }
  }

  return [
    cyclingAllTime,
    runAllTime,
    updateFlagCycling,
    updateFlagRunning,
    ftpChange,
  ];
}

module.exports = checkPbs;
