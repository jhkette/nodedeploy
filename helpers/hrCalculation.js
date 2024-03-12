const _ = require("lodash")
const {quickSort} = require("./arraysorting")

/**
 * 
 * this function calculates maxhr - it check if 
 * activities are rides or runs and then removes obvious
 * outliers. This is an issue as hr monitors can occasionaly
 * massively misreport numbers.
 * Thus i've filtered for the activities that were obvsiouly done
 * at a higher intensity and then removed data 3 standard devivations from the 
 * mean (if such data exists.)
 * @param {} performances 
 * @param {} activityType 
 * @returns final maxhr int
 */
function calcMaxHr(performances, activityType) {
    let hrList;
    if (activityType == "ride") {
      hrList = performances.filter(
        (performance) =>
          performance["type"] == "VirtualRide" || performance["type"] == "Ride"
      );
    } else {
      hrList = performances.filter((performance) => performance["type"] == "Run");
    }
    const hrNumbers = hrList.map((activity) => activity["max_heartrate"]);
    if (hrNumbers.length == 0) {
      return 0;
    }
    if (hrNumbers.length == 1) {
      return hrNumbers[0];
    }
  
    if (hrList.length > 10) {
      const sortedHr = quickSort(hrNumbers);
      const quarterLength = Math.ceil(hrNumbers.length / 4);
      const higherIntensity = sortedHr.slice(quarterLength, sortedHr.length - 1);
      const { mean, standardDeviation } = getStandardDeviation(higherIntensity);
      const outlierLimit = mean + 3 * standardDeviation;
  
      const removeHighOutliers = higherIntensity.filter(
        (number) => number < outlierLimit
      );
  
      const finalHr = _.max(removeHighOutliers);
  
      return finalHr;
    }
  
    const { mean, standardDeviation } = getStandardDeviation(hrNumbers);
    const outlierLimit = mean + 3 * standardDeviation;
  
    const removeHighOutliers = hrNumbers.filter(
      (number) => number < outlierLimit
    );
  
    const finalHr = _.max(removeHighOutliers);
  
    return finalHr;
  }
  
  // https://medium.com/analytics-vidhya/removing-outliers-understanding-how-and-what-behind-the-magic-18a78ab480ff
  // https://stackoverflow.com/questions/20811131/javascript-remove-outlier-from-an-array
  function getStandardDeviation(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    const standardDeviation = Math.sqrt(
      array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
    return { mean, standardDeviation };
  }
  // https://www.myprocoach.net/calculators/hr-zones/#:~:text=Work%20out%20your%20heart%20rate%20zones&text=Zone%201%3A%20Easy%20%E2%80%93%2068%25,fat%20and%20carbohydrates%20as%20fuel.
  // Zone	Intensity	Percentage of HRmax
  // Zone 1	Very light	68–73%
  // Zone 2	Light	    60–70%
  // Zone 3	Moderate	70–80%
  // Zone 4	Hard	   80–90%
  // Zone 5	Maximum	   90–100%
  
function getHrZones(hr){
  console.log(hr, [Math.ceil((hr * .68)), Math.ceil((hr* .73))], "TESTING GETHRZONE FUNCTION" )
    const zones = {}
    zones['zone1'] = [Math.ceil((hr * .68)), Math.ceil((hr* .73))]
    zones['zone2'] = [Math.ceil((hr * .73)), Math.ceil((hr* .80))]
    zones['zone3'] = [Math.ceil((hr * .8)), Math.ceil((hr* .87))]
    zones['zone4'] = [Math.ceil((hr * .87)), Math.ceil((hr* .93))]
    zones['zone5'] = [Math.ceil((hr * .93)), hr]
  
    return zones
  
  }


  module.exports = { calcMaxHr, getHrZones };