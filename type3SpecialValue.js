Not Working yet


const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

// Function to search for a specific date and time in a CSV file
function searchCSVFile(filePath, targetDate) {
    return new Promise((resolve, reject) => {
        const result = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: '\t' })) // Use tab as the separator based on your CSV file format
            .on('data', (row) => {
                // Assuming the date and time are in the "Timestamp" column and formatted as "MM/DD/YYYY HH:mm"
                const rowDate = moment(row['Timestamp'], 'MM/DD/YYYY HH:mm', true);

                console.log('Row Date:', rowDate.format('MM/DD/YYYY HH:mm')); // Debugging line

                if (rowDate.isValid() && rowDate.isSame(targetDate, 'minute')) {
                    result.push(row);
                }
            })
            .on('end', () => {
                resolve(result);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Usage
const targetDate = moment('12/21/2023 00:00', 'MM/DD/YYYY HH:mm', true);
const filePath = 'CW018360-LP 01.XLS'; // Replace with the actual CSV file path

searchCSVFile(filePath, targetDate)
    .then((result) => {
        console.log('Target Date:', targetDate.format('MM/DD/YYYY HH:mm')); // Debugging line
        if (result.length > 0) {
            console.log('Matching Row Data:');
            result.forEach(row => {
                console.log(row);
            });
        } else {
            console.log('No matching rows found.');
        }
    })
    .catch((error) => {
        console.error('Error searching CSV file:', error.message);
    });
