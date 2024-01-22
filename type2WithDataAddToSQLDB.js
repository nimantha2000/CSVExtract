const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const { Pool } = require('pg');

// Configure your PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'abcd1234',
    port: 5432, 
});

// Function to insert extracted rows into PostgreSQL
async function insertRowsIntoPostgres(extractedRows) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        for (const row of extractedRows) {
            await client.query(`
                INSERT INTO table1("Date", "exportDay", "exportPeak", "exportOffPeak", "importDay", "importPeak", "importOffPeak") 
                VALUES($1, $2, $3, $4, $5, $6, $7)
            `, [row.Date, row.exportDay, row.exportPeak, row.exportOffPeak, row.importDay, row.importPeak, row.importOffPeak]);
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}


// Function to read the last two rows of a CSV file and extract specific columns
function readAndExtractColumns(filePath) {
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
    .then(async (extractedRows) => {
        // Output the extracted result
        console.log('Extracted Columns from Last Two Rows:', extractedRows);

        // Call the function to insert rows into PostgreSQL
        await insertRowsIntoPostgres(extractedRows);

        console.log('Rows inserted into PostgreSQL successfully.');
    })
    .catch((error) => {
        console.error('Error reading and extracting columns:', error.message);
    })
    .finally(() => {
        // Close the PostgreSQL connection pool when done
        pool.end();
    });
