const fs = require('fs');
const readline = require('readline');

function searchByDateTime(filename, targetDateTime) {
  let totalExport = 0;
  let totalImport = 0;

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
        if (value13 > 0) {
          totalExport += value13;
          console.log(firstColumnValue, '\tExport:', value13.toFixed(3), '\tImport: 0.000');
        } else if (value13 < 0) {
          totalImport += Math.abs(value13);
          console.log(firstColumnValue, '\tExport: 0.000', '\tImport:', Math.abs(value13).toFixed(3));
        } else {
          console.log(firstColumnValue, '\tExport: 0.000', '\tImport: 0.000');
        }
      } else {
        console.log(firstColumnValue, '\tInvalid Value in Column 13');
      }
    }
  });

}

// Usage
const filename = 'CW018360-LP 01.XLS'; 
const targetDateTime = '12/21/2023 18:30'; // (-)vlues- 12/21/2023 18:15
searchByDateTime(filename, targetDateTime);
