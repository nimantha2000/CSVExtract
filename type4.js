const XLSX = require('xlsx');
const path = require('path');

// Function to read specified rows from an Excel file
function readRowsFromExcel(fileName) {
  const filePath = path.join(fileName);

  // Load the Excel workbook
  const workbook = XLSX.readFile(filePath);

  // Choose the sheet you want to read (second sheet in this case)
  const sheetName = workbook.SheetNames[1];
  const sheet = workbook.Sheets[sheetName];

  // Function to get cell value
  const getCellValue = (cell) => cell ? cell.v : undefined;

  // Rows to read (77, 78, 79, 80, 81, 82)
  const rowsToRead = [77, 78, 79, 80, 81, 82];

  // Names for each row
  const rowNames = ['DayEnergyExport', 'PeakEnergyExport', 'OffPeakEnergyExport', 'DayEnergyImport', 'PeakEnergyImport', 'OffPeakEnergyImport'];

  // Column index to read (third column)
  const columnToRead = 2; // 0-indexed

  // Iterate through specified rows
  for (let i = 0; i < rowsToRead.length; i++) {
    const rowNumber = rowsToRead[i];

    // Check if the row is within the valid range
    if (rowNumber < 1 || rowNumber > XLSX.utils.decode_range(sheet['!ref']).e.r) {
      console.log(`Row ${rowNumber} does not exist in the sheet.`);
      continue;
    }

    // Get the cell value from the specified column
    const cell = sheet[XLSX.utils.encode_cell({ r: rowNumber, c: columnToRead })];
    const cellValue = getCellValue(cell);

    // Get the name for the current row
    const rowName = rowNames[i];

    // Print the name and cell value
    console.log(`${rowName}: ${cellValue}`);
  }
}

// Usage
const fileName = 'ACE8000 850_2.2_37000144_EOB.xlsx'; // Replace with your actual file name
readRowsFromExcel(fileName);
