const fs = require('fs');
const csv = require('csv-parser');

function readCSVFile(filename) {
  const data = {
    Date: null,
    Export: [],
    Import: []
  };

  let currentRow = 0;

  fs.createReadStream(filename)
    .pipe(csv({ separator: '\t' })) // assuming tab-separated data
    .on('data', (row) => {
      currentRow++;

      if (currentRow === 1) {
        // Assuming the value is like "TOU Registers: 1/1/2024 00:00"
        const dateValue = row[Object.keys(row)[0]];
        data.Date = dateValue.split(': ')[1];
      }

      if (currentRow === 2) {
        data.Export.push({
          label: 'Day Energy Export',
          value: row[Object.keys(row)[1]] * 1000
        });
        data.Export.push({
          label: 'Peak Energy Export',
          value: row[Object.keys(row)[2]] * 1000
        });
        data.Export.push({
          label: 'Off Peak Energy Export',
          value: row[Object.keys(row)[3]] * 1000
        });
      }

      if (currentRow === 3) {
        data.Import.push({
          label: 'Day Energy Import',
          value: row[Object.keys(row)[1]] * 1000
        });
        data.Import.push({
          label: 'Peak Energy Import',
          value: row[Object.keys(row)[2]] * 1000
        });
        data.Import.push({
          label: 'Off Peak Energy Import',
          value: row[Object.keys(row)[3]] * 1000
        });
      }
    })
    .on('end', () => {
        // Output the data in JSON format, including the Date
        console.log(JSON.stringify(data, null, 2));
    })
    .on('error', (error) => {
      console.error('Error:', error.message);
    });
}

// Usage
const filename = 'CW018360-HTOU.XLS';
readCSVFile(filename);
