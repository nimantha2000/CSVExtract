const fs = require('fs');
const readline = require('readline');

function readTabSeparatedCSV(filename) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    // Split the line by tabs to get columns
    const columns = line.split('\t');

    // Print the value from the first column
    const firstColumnValue = columns[0];
    console.log(firstColumnValue);
  });

  rl.on('close', () => {
    console.log('File read successfully.');
  });
}

// Usage
const filename = 'your_file.csv'; // Replace with your actual file name
readTabSeparatedCSV(filename);
