const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Function to read the last two rows of a CSV file, format specific columns, and filter by date range
function readFormatAndFilterByDateRange(filePath, startDate, endDate) {
    const formattedRows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                const formattedRow = {
                    Date: moment(row['_1'], 'MM/DD/YYYY HH:mm:ss', true).format('YYYY-MM-DD HH:mm:ss'),
                    exportDay: Math.round(row['_3'] / 1000),
                    exportPeak: Math.round(row['_4'] / 1000),
                    exportOffPeak: Math.round(row['_5'] / 1000),
                    importDay: Math.round(row['_7'] / 1000),
                    importPeak: Math.round(row['_8'] / 1000),
                    importOfPeak: Math.round(row['_9'] / 1000),
                };

                if (formattedRow.Date !== undefined &&
                    moment(formattedRow.Date, 'YYYY-MM-DD HH:mm:ss').isBetween(startDate, endDate, null, '[]')) {
                    formattedRows.push(formattedRow);

                    if (formattedRows.length > 2) {
                        formattedRows.shift(); // Keep only the last two formatted rows
                    }
                }
            })
            .on('end', () => {
                resolve(formattedRows);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Set your desired date range
const startDate = moment('2023-12-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
const endDate = moment('2024-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');

// File path to your CSV file
const filePath = '213213219-BH.xls';

// Call the function to read the last two rows, format specific columns, and filter by date range
readFormatAndFilterByDateRange(filePath, startDate, endDate)
    .then((filteredRows) => {
        // Output the formatted and filtered result
        console.log('Formatted and Filtered Rows:', filteredRows);
    })
    .catch((error) => {
        console.error('Error reading, formatting, and filtering rows:', error.message);
    });
