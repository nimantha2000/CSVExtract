const xlsx = require('xlsx');
const fs = require('fs');

// Replace 'your_file.xls' with the actual path to your Excel file
const filePath = 'WP010903-TODEnergy.xls';

// Read the Excel file with the 'cellDates' and 'dateNF' options
const workbook = xlsx.readFile(filePath, { cellDates: true, dateNF: 'M/D/YYYY H:mm' });

// Assuming there is only one sheet in the Excel file
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert the sheet to an array of objects
const data = xlsx.utils.sheet_to_json(sheet);

// Print only specific columns (Column 1, 3, and 4) for rows 8, 9, and 10
const rowsToPrint = [8, 9, 10];

rowsToPrint.forEach((rowIndex) => {
  const row = data[rowIndex - 1];
  if (row) {
    console.log(`Row ${rowIndex}:`, {
      Column1: row['__EMPTY'],
      Column3: row['__EMPTY_2'],
      Column4: row['__EMPTY_3'],
    });
  } else {
    console.log(`Row ${rowIndex} not found.`);
  }
});
