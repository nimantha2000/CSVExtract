const fs = require('fs');
const readline = require('readline');

function searchByDateTime(filename, targetDateTime) {
  let matchedData = [];

  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    // Split the line by tabs to get columns
    const columns = line.split('\t');

    // Check if the first column contains the target date and time
    const firstColumnValue = columns[0];
    if (firstColumnValue.includes(targetDateTime)) {
      // Extract and classify the value in columns[13]
      const value13 = parseFloat(columns[13]);

      if (!isNaN(value13)) {
        const result = {
          DateTime: firstColumnValue,
          Export: value13 > 0 ? value13.toFixed(3) : '0.000',
          Import: value13 < 0 ? Math.abs(value13).toFixed(3) : '0.000',
        };

        matchedData.push(result);
      } else {
        const result = {
          DateTime: firstColumnValue,
          Error: 'Invalid Value in Column 13',
        };

        matchedData.push(result);
      }
    }
  });

  rl.on('close', () => {
    // Print the matched data in JSON format
    console.log(JSON.stringify(matchedData, null, 2));
  });
}

// Usage
const filename = 'CW018360-LP 01.XLS';
const targetDateTime = '12/21/2023 18:30'; // (-)vlues- 12/21/2023 18:15
searchByDateTime(filename, targetDateTime);
