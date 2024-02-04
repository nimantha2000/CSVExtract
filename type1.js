const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Function to read, format, and filter rows from a CSV file
function readData(filePath, targetDate) {
    const formattedRows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                const dateFormats = ['MM/DD/YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm:ss'];
                let formattedRow = null;

                for (const dateFormat of dateFormats) {
                    const parsedDate = moment(row['_1'], dateFormat, true);
                    if (parsedDate.isValid()) {
                        formattedRow = {
                            Date: parsedDate.format('YYYY-MM-DD HH:mm:ss'),
                            DayEnergyExport: Math.round(row['_3'] / 1000),
                            PeakEnergyExport: Math.round(row['_4'] / 1000),
                            offPeakEnergyExport: Math.round(row['_5'] / 1000),
                            DayEnergyImport: Math.round(row['_7'] / 1000),
                            PeakEnergyImport: Math.round(row['_8'] / 1000),
                            offPeakEnergyImport: Math.round(row['_9'] / 1000),
                        };
                        break;
                    }
                }

                if (formattedRow !== null && moment(formattedRow.Date).isSame(targetDate, 'minute')) {
                    formattedRows.push(formattedRow);
                    if (formattedRows.length > 1) {
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
const targetDate = moment('2024-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');

// File path to your CSV file  213213219-BH.xls/213213227-BH 01.xls
const filePath = '213213219-BH.xls';
//Files - 213213219-BH.xls, 213213218-BH.xls
// Call the function to read, format, and filter rows
readData(filePath, targetDate)
    .then((formattedRows) => {
        console.log('Formatted and Filtered Rows:', formattedRows);
    })
    .catch((error) => {
        console.error('Error reading, formatting, and filtering rows:', error.message);
    });
