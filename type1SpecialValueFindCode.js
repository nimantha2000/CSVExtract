const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Function to read the last two rows of a CSV file, format specific columns, and filter by date range
function readFormatAndFilterByDateRange(filePath, Date) {
    const formattedRows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                const rawValue = parseFloat(row['_2']);
                const value = parseFloat((rawValue / 1000000).toFixed(3));
                const importValue = Math.max(0, -value); // Import value (minimum is 0)
                const exportValue = Math.max(0, value); // Export value (minimum is 0)

                const formattedRow = {
                    Date: moment(row['_1'], 'MM/DD/YYYY HH:mm:ss', true).format('YYYY-MM-DD HH:mm:ss'),
                    importValue,
                    exportValue,
                };

                if (formattedRow.Date !== undefined &&
                    moment(formattedRow.Date, 'YYYY-MM-DD HH:mm:ss').isSame(Date, null, '[]')) {
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
const Date = moment('2023-12-21 18:30:00', 'YYYY-MM-DD HH:mm:ss');

// File path to your CSV file
const filePath = '213213219-LP 01.xls';

// Call the function to read the last two rows, format specific columns, and filter by date range
readFormatAndFilterByDateRange(filePath, Date)
    .then((filteredRows) => {
        // Output the formatted and filtered result
        console.log('Filtered Rows:', filteredRows);
    })
    .catch((error) => {
        console.error('Error reading, formatting, and filtering rows:', error.message);
    });
