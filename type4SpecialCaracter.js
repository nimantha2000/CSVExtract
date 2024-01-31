const XLSX = require('xlsx');
const path = require('path');

function searchByTime(fileName, targetTime) {
  const filePath = path.join(fileName);

  // Load the Excel workbook
  const workbook = XLSX.readFile(filePath);

  // Choose the sheet you want to read (modify the index as needed)
  const sheetIndex = 2; // 0-indexed, so 2 corresponds to the 3rd sheet
  const sheetName = workbook.SheetNames[sheetIndex];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

  // Custom function to parse time values
  const parseTime = (timeString) => {
    if (!timeString) {
      return { hours: undefined, minutes: undefined };
    }

    const match = timeString.match(/(\d+):(\d+) (AM|PM)/i);
    if (!match) {
      return { hours: undefined, minutes: undefined };
    }

    const [, hour, minute, period] = match;
    const hours = parseInt(hour, 10) + (period.toLowerCase() === 'pm' ? 12 : 0);
    const minutes = parseInt(minute, 10);

    return { hours, minutes };
  };

  // Parse the target time
  const targetTimeParsed = parseTime(targetTime);

  // Check if the target time is valid
  if (targetTimeParsed.hours === undefined || targetTimeParsed.minutes === undefined) {
    console.log('Invalid target time format.');
    return;
  }

  // Flag to check if the target time is found
  let targetTimeFound = false;

  // Iterate through the data to find the target time
  jsonData.forEach((row, index) => {
    const timeCell = row[0];

    // Skip undefined values
    if (timeCell === undefined) {
      return;
    }

    // Parse the time cell
    const parsedTime = parseTime(timeCell);

    // Check if the parsed time matches the target time
    if (
      parsedTime.hours === targetTimeParsed.hours &&
      parsedTime.minutes === targetTimeParsed.minutes
    ) {
      // Apply transformations to 'Export' and 'Import' values
      const exportValue = (row[1] / 1000000).toFixed(3);
      const importValue = (-row[2] / 1000000).toFixed(3);

      // Prepare the output in JSON format with the modified values
      const outputJson = {
        Time: row[0],
        Export: exportValue,
        Import: importValue,
      };

      console.log(JSON.stringify(outputJson, null, 2));
      targetTimeFound = true;
    }
  });

  // Print a message if the target time is not found
  if (!targetTimeFound) {
    console.log(`Target time not found in the first column.`);
  }
}

// Usage
const fileName = 'ACE8000 850_2.2_37000144_LP1.xlsx'; // Replace with your actual file name
const targetTime = '6:30 PM'; // Replace with your desired time
searchByTime(fileName, targetTime);
