const fs = require('fs');
const xlsx = require('xlsx');

// Function to read and print specific rows from an Excel file
function readAndPrintSpecificRows(filePath, sheetName, startRow, endRow) {
    const range = { s: { r: startRow - 1, c: 0 }, e: { r: endRow - 1, c: 7 } };
    
    const workbook = xlsx.readFile(filePath);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { range });

    console.log(data);
}

// File path to your Excel file
const filePath = 'WP010903-TODEnergy.xls';
const sheetName = 'WP010903-TODEnergy'; 
const startRow = 8;
const endRow = 14;

// Call the function to read and print specific rows from the Excel file
readAndPrintSpecificRows(filePath, sheetName, startRow, endRow);
