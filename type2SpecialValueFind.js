const xlsx = require('xlsx');

// Function to read and return specific columns from an Excel file as JSON
function readAndReturnColumns(fileName, targetDateTime) {
    // Read the Excel file
    const workbook = xlsx.readFile(fileName);

    // Assuming there is only one sheet in the Excel file
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to an array of objects with specified column names
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Find the indices of 'SIP End Date and time' and 'kW' columns
    const sipEndDateIndex = data[0].indexOf('SIP End Date and time');
    const kWIndex = data[0].indexOf('kW');

    // Search for the target date and time in the 'SIP End Date and time' column
    const targetRow = data.find(row => {
        const formattedDate = xlsx.SSF.format('yyyy-MM-dd hh:mm:ss', row[sipEndDateIndex]);
        return formattedDate === targetDateTime;
    });

    // Prepare the result in JSON format
    if (targetRow) {
        const kWValue = parseFloat(targetRow[kWIndex]) / 1000;
        const roundedKWValue = Math.round(kWValue * 1000) / 1000; // Round to 3 decimal places
        const result = {
            'Date and Time': xlsx.SSF.format('yyyy-MM-dd hh:mm:ss', targetRow[sipEndDateIndex]),
            kW: roundedKWValue,
        };

        return result;
    } else {
        return { error: 'Row not found with the specified date and time.' };
    }
}

// Get the file name and target date and time from the command line arguments
const fileName = 'WP010903-LP 01.xls';
const targetDateTime = "2023-12-21 18:30:00";

// Check if both file name and target date are provided
if (!fileName || !targetDateTime) {
    console.error('Usage: node script.js <file_name> <target_date_time>');
    process.exit(1);
}

// Call the function with the provided file name and target date
const result = readAndReturnColumns(fileName, targetDateTime);

// Print the result in JSON format
console.log(JSON.stringify(result, null, 2));
