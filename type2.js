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

// Initialize variables to store column values
let column1Values = [];
let column3Values = [];
let column4Values = [];

// Print only specific columns (Column 1, 3, and 4) for rows 8, 9, and 10
const rowsToPrint = [7, 8, 9];

rowsToPrint.forEach((rowIndex) => {
  const row = data[rowIndex - 1];
  if (row) {
    // Store column values in variables
    column1Values.push(row['__EMPTY']);
    column3Values.push(Number(row['__EMPTY_2']).toFixed(0)); // Format to 2 decimal places
    column4Values.push(Number(row['__EMPTY_3']).toFixed(0)); // Format to 2 decimal places
  } else {
    console.log(`Row ${rowIndex} not found.`);
  }
});

// Print the stored values
console.log("Date:", column1Values);
console.log("Export Values:", column4Values);
console.log("Import Values:", column3Values);

