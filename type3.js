const fs = require('fs');
const readline = require('readline');

function printRowsColumns(fileName) {
  const filePath = fileName;

  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let currentRow = 0;
  const result = {
    Date: null,
    exportValues: [],
    importValues: [],
    
  };

  rl.once('line', (line) => {
    const match = line.match(/TOU Registers: (\d{1,2}\/\d{1,2}\/\d{4} \d{2}:\d{2})/);

    if (match) {
      const Date = match[1];
      result.Date = Date;
    } else {
      console.log('Timestamp not found in the expected format.');
    }
  });

  // Read the rows and print values from the specified columns
  rl.on('line', (line) => {
    currentRow++;

    if (currentRow === 3 || currentRow === 4) {
      const columns = line.split('\t'); // Assuming tab-separated values

      // Add labels and multiply values by 1000, then add them to the appropriate list in the result object
      const labels = ['Day', 'Peak', 'off Peak'];
      const values = columns.slice(1, 4).map((value, index) => ({ [labels[index]]: (parseFloat(value) * 1000).toFixed(0) }));

      if (currentRow === 3) {
        result.exportValues.push({ values });
      } else if (currentRow === 4) {
        result.importValues.push({ values });
      }
    }
  });

  rl.on('close', () => {
    console.log(JSON.stringify(result, null, 2)); // Convert the result object to JSON string with indentation
  });
}

// Get the file name from command-line arguments
const fileName = 'CW018360-HTOU.XLS';

if (!fileName) {
  console.error('Please provide the file name as a command-line argument.');
  process.exit(1);
}

// Call the function with the provided file name
printRowsColumns(fileName);
