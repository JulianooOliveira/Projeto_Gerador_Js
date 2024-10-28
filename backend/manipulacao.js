const xlsx = require('xlsx', 'xls');
const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

function medicamentoVB(filePath, fileOption) {
    // Lê o arquivo Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Nome da primeira aba
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    // Extrai apenas as colunas desejadas (CÓDIGO DE BARRAS, DESCRIÇÃO PRODUTO, PMC, DESCONTO)
    let headers = worksheet[0];
    let data = worksheet.slice(1).map(row => ({
        Barra: row[headers.indexOf('CÓDIGO DE BARRAS')],
        Produto: row[headers.indexOf('DESCRIÇÃO PRODUTO')],
        Bruto: row[headers.indexOf('PMC')],
        Percentual: row[headers.indexOf('DESCONTO')] * 100 // Multiplica DESCONTO por 100
    }));

    // Cria um novo workbook e worksheet para o arquivo de saída
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(data, { header: ['Barra', 'Produto', 'Bruto', 'Percentual'] });
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'PROD');

    // Define o caminho de saída
    const outputFile = path.join(path.dirname(filePath), `${fileOption}.xlsx`);

    // Escreve o arquivo Excel processado
    XLSX.writeFile(newWorkbook, outputFile);

    return outputFile;
}

module.exports = { medicamentoVB };