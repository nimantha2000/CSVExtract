const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'abcd1234',
  port: 5432, 

});

client.connect();

// Function to insert rows into PostgreSQL database
async function insertRowsIntoDatabase(rows) {
  const insertQueries = rows.map(row => {
    return {
      text: `INSERT INTO table1s("Date", "exportDay", "exportPeak", "exportOffPeak", "importDay", "importPeak", "importOffPeak") VALUES($1, $2, $3, $4, $5, $6, $7)`,
      values: [
        row.Date,
        row.DayEnergyExport,
        row.PeakEnergyExport,
        row.offPeakEnergyExport,
        row.PeakEnaergyImport,
        row.PeakEnaergyImport,
        row.offPeakEnaergyImport,
      ],
    };
  });

  try {
    await client.query('BEGIN');

    for (const query of insertQueries) {
      await client.query(query);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

// Function to read, format, and filter rows from a  CSV file
function readFormatAndFilterByDateRange(filePath, Date) {
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

          if (formattedRow !== null && moment(formattedRow.Date).isSame(Date, 'minute')) {
            formattedRows.push(formattedRow);
            if (formattedRows.length > 1) {
                formattedRows.shift(); // Keep only the last two formatted rows
            }
          }
      })
      .on('end', async () => {
        try {
          await insertRowsIntoDatabase(formattedRows);
          resolve(formattedRows);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Set your desired date range
const Date = moment('2024-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');

// File path to your CSV file
const filePath = '213213219-BH.xls';

// Call the function to read, format, and filter rows, and write to PostgreSQL
readFormatAndFilterByDateRange(filePath, Date)
  .then((filteredRows) => {
    // Output the formatted and filtered result
    console.log('Formatted and Filtered Rows:', filteredRows);
  })
  .catch((error) => {
    console.error('Error reading, formatting, and filtering rows:', error.message);
  })
  .finally(() => {
    client.end(); // Close the PostgreSQL connection when done
  });
