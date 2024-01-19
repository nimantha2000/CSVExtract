const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Function to read the last two rows of a CSV file and extract specific columns
function readAndExtractColumns(filePath) {
    const extractedRows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                console.log('Raw Date:', row['_1']); // Log raw date values

                const extractedRow = {
                    Date: moment(row['_1'], 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                    cumulEnergyExpWhR1: Math.round(row['_3'] / 1000),
                    cumulEnergyExpWhR2: Math.round(row['_4'] / 1000),
                    cumulEnergyExpWhR3: Math.round(row['_5'] / 1000),
                    cumulEnergyLmpWHR1: Math.round(row['_7'] / 1000),
                    cumulEnergyLmpWHR2: Math.round(row['_8'] / 1000),
                    cumulEnergyLmpWHR3: Math.round(row['_9'] / 1000),
                };

                extractedRows.push(extractedRow);

                if (extractedRows.length > 2) {
                    extractedRows.shift(); // Keep only the last two extracted rows
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

// File path to your CSV file
const filePath = '213213227-BH.xls';

// Call the function to read the last two rows and extract specific columns
readAndExtractColumns(filePath)
    .then((extractedRows) => {
        // Output the extracted result
        console.log('Extracted Columns from Last Two Rows:', extractedRows);
    })
    .catch((error) => {
        console.error('Error reading and extracting columns:', error.message);
    });
