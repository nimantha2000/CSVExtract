const xlsx = require('xlsx');
const moment = require('moment');

// Function to read and print specific columns with formatted date
function readAndPrintColumnsWithFormattedDate(fileName, rowIndexes) {
    // Read the Excel file with the 'cellDates' and 'dateNF' options
    const workbook = xlsx.readFile(fileName, { cellDates: true, dateNF: 'M/D/YYYY H:mm' });

    // Assuming there is only one sheet in the Excel file
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to an array of objects
    const data = xlsx.utils.sheet_to_json(sheet);

    // Initialize variables to store column values
    let column1Values = [];
    let column3Values = [];
    let column4Values = [];

    // Print only specific columns (Column 1, 3, and 4) for specified rows
    rowIndexes.forEach((rowIndex) => {
        const row = data[rowIndex - 1];
        if (row) {
            // Format the date using moment library
            const formattedDate = moment(row['__EMPTY']).format('MM/DD/YYYY HH:mm');
            // Store column values in variables
            column1Values.push(formattedDate);
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
}

// Get the file name and row indexes from the command line arguments
const fileName = 'WP010903-TODEnergy.xls';
const rowIndexes = [7, 8, 9]; // specify the rows you want to print

// Check if both file name and row indexes are provided
if (!fileName || rowIndexes.length === 0) {
    console.error('Usage: node script.js <file_name> <row_indexes>');
    process.exit(1);
}

// Call the function with the provided file name and row indexes
readAndPrintColumnsWithFormattedDate(fileName, rowIndexes);
