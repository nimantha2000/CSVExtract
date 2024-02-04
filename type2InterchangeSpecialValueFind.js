const xlsx = require('xlsx');

// Function to read and return specific columns from an Excel file as JSON
function cPeak(fileName, targetDateTime) {
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
        let exportValue, importValue;

        if (kWValue < 0) {
            exportValue = Math.abs(kWValue).toFixed(3);
            importValue = 0.000.toFixed(3);
        } else {
            exportValue = 0.000.toFixed(3);
            importValue = (-kWValue).toFixed(3);
        }

        const result = {
            'Date and Time': xlsx.SSF.format('yyyy-MM-dd hh:mm:ss', targetRow[sipEndDateIndex]),
            'Export Value': exportValue,
            'Import Value': importValue,
        };

        return result;
    } else {
        return { error: 'Row not found with the specified date and time.' };
    }
}

// Get the file name and target date and time from the command line arguments
const fileName = 'WP010903-LP 01.xls';
const targetDateTime = "2023-12-21 18:30:00"; // 18.15 and 18.30

// Check if both file name and target date are provided
if (!fileName || !targetDateTime) {
    console.error('Usage: node script.js <file_name> <target_date_time>');
    process.exit(1);
}

// Call the function with the provided file name and target date
const result = cPeak(fileName, targetDateTime);

// Print the result in JSON format
console.log(JSON.stringify(result, null, 2));
