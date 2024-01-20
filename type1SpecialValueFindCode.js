const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Function to read the last two rows of a CSV file, format specific columns, and filter by date range
function readFormatAndFilterByDateRange(filePath, startDate) {
    const formattedRows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                const formattedRow = {
                    Date: moment(row['_1'], 'MM/DD/YYYY HH:mm:ss', true).format('YYYY-MM-DD HH:mm:ss'),
                    exportDay: Math.round(row['_2']),
                    exportPeak: Math.round(row['_3'] ),
                };

                if (formattedRow.Date !== undefined &&
                    moment(formattedRow.Date, 'YYYY-MM-DD HH:mm:ss').isSame(startDate, null, '[]')) {
                    formattedRows.push(formattedRow);

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
const startDate = moment('2023-11-22 1:45:00', 'YYYY-MM-DD HH:mm:ss');


// File path to your CSV file
const filePath = '213213219-LP 01.xls';

// Call the function to read the last two rows, format specific columns, and filter by date range
readFormatAndFilterByDateRange(filePath, startDate)
    .then((filteredRows) => {
        // Output the formatted and filtered result
        console.log('Formatted and Filtered Rows:', filteredRows);
    })
    .catch((error) => {
        console.error('Error reading, formatting, and filtering rows:', error.message);
    });
