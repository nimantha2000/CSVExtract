const xlsx = require('xlsx');
const moment = require('moment');

// Function to read and format specific columns with a formatted date
function readAndFormatColumnsWithFormattedDate(fileName, rowIndexes) {
    // Read the Excel file with the 'cellDates' and 'dateNF' options
    const workbook = xlsx.readFile(fileName, { cellDates: true, dateNF: 'M/D/YYYY H:mm' });

    // Assuming there is only one sheet in the Excel file
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to an array of objects
    const data = xlsx.utils.sheet_to_json(sheet);

    // Extract date and time from the specified column (8th row, 2nd column)
    const dateTime = moment(data[rowIndexes[0] - 1]['__EMPTY_1'], 'M/D/YYYY H:mm').format('YYYY-MM-DD HH:mm:ss');

    // Initialize dictionary to store combined values with labels
    const combinedData = {
        DateTime: dateTime,
        Values: [
            {
                data: [
                    {
                        label: 'DayEnergyExport',
                        value: Number(data[rowIndexes[0] - 1]['__EMPTY_3']).toFixed(0),
                    },
                    {
                        label: 'PeakEnergyExport',
                        value: Number(data[rowIndexes[1] - 1]['__EMPTY_3']).toFixed(0),
                    },
                    {
                        label: 'OffPeakEnergyExport',
                        value: Number(data[rowIndexes[2] - 1]['__EMPTY_3']).toFixed(0),
                    },
                ],
            },
            {
                data: [
                    {
                        label: 'DayEnergyImport',
                        value: Number(data[rowIndexes[0] - 1]['__EMPTY_2']).toFixed(0),
                    },
                    {
                        label: 'PeakEnergyImport',
                        value: Number(data[rowIndexes[1] - 1]['__EMPTY_2']).toFixed(0),
                    },
                    {
                        label: 'OffPeakEnergy Import',
                        value: Number(data[rowIndexes[2] - 1]['__EMPTY_2']).toFixed(0),
                    },
                ],
            },
        ],
    };

    // Output the combined data in JSON format
    console.log(JSON.stringify(combinedData, null, 2));
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
readAndFormatColumnsWithFormattedDate(fileName, rowIndexes);
