import ExcelJS from 'exceljs';

export async function createExcelFile(data: any[], filepath: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('low-thresold-products');

  worksheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Quantity', key: 'quantity', width: 10 },
  ]

  data.forEach(item => worksheet.addRow(item));
  await workbook.xlsx.writeFile(filepath);
}