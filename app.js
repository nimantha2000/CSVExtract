const fs = require('fs');
const xlsx = require('xlsx');

const filePath = 'WP010903-TODEnergy.xls'; // Replace with the path to your Excel file

const rowsToExtract = [8, 9, 19, 11, 12, 13];
const columnsToExtract = [2, 4, 5]; // 2nd and 3rd columns
const extractedRows = [];

const workbook = xlsx.readFile(filePath, {
    header: 1,
    raw: false,
    dateNF: 'mm/dd/yyyy HH:MM:SS'});

const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet

const worksheet = workbook.Sheets[sheetName];
const range = xlsx.utils.sheet_to_json(worksheet['!ref']);

const isDateColumn = (columnName) => {
  return columnName.toLowerCase().includes('date');
};

rowsToExtract.forEach((rowIndex) => {
  const row = [];
  columnsToExtract.forEach((colIndex) => {
    const cellAddress = xlsx.utils.encode_cell({ r: rowIndex - 1, c: colIndex - 1 });
    const cell = worksheet[cellAddress];
    const columnName = xlsx.utils.encode_col(colIndex);

    // Check if the column is a date column
    if (isDateColumn(columnName) && cell && cell.t === 'n' && xlsx.SSF.is_date(cell.z)) {
      const dateValue = xlsx.SSF.format('mm/dd/yyyy HH:MM:SS', cell.v);
      row.push(dateValue);
    } else {
      // Multiply by 1000 and round to the nearest integer for the 2nd and 3rd columns
      const adjustedValue = colIndex === 4 || colIndex === 5 ? Math.round(cell.v) : cell.v;
      row.push(adjustedValue);
    }
  });
  extractedRows.push(row);
});

console.log('Extracted Rows:', extractedRows);
