const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Function to read the last two rows of a CSV file and extract specific columns
function readAndExtractColumns(filePath,Date) {
    const extractedRows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                const extractedRow = {
                    Date: moment(row['_1'], 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                    exportDay: Math.round(row['_3'] / 1000),
                    exportPeak: Math.round(row['_4'] / 1000),
                    exportOffPeak: Math.round(row['_5'] / 1000),
                    importDay: Math.round(row['_7'] / 1000),
                    importPeak: Math.round(row['_8'] / 1000),
                    importOffPeak: Math.round(row['_9'] / 1000),
                };

                if (extractedRow.Date !== undefined &&
                    moment(extractedRow.Date, 'YYYY-MM-DD HH:mm:ss').isSame(Date, null, '[]')) {
                        extractedRows.push(extractedRow);

                    if (extractedRows.length > 1) {
                        extractedRows.shift(); // Keep only the last two formatted rows
                    }
                }
            })
            .on('end', () => {
                resolve(extractedRows);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


const Date = moment('2024-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');

// File path to your CSV file
const filePath = '213213227-BH.xls';

// Call the function to read the last two rows and extract specific columns
readAndExtractColumns(filePath,Date)
    .then((extractedRows) => {
        // Output the extracted result
        console.log('Extracted Columns from Last Two Rows:', extractedRows);
    })
    .catch((error) => {
        console.error('Error reading and extracting columns:', error.message);
    });
