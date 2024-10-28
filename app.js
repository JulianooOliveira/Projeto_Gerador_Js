const express = require('express');
const multer = require('multer');
const path = require('path');
const { medicamentoVB, perfumariaVB, generateTxtAlpha7File, generateCsvBigFile, generateTxtTrierFile } = require('./backend/manipulacao'); // Suas funções

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Serve arquivos estáticos como HTML, CSS, JS
app.use(express.urlencoded({ extended: true }));

// Rota para processar o arquivo enviado
app.post('/generate', upload.single('file'), (req, res) => {
    const { model, start_date, end_date } = req.body;
    const filePath = req.file.path;

    try {
        let outputFilePath;

        // Escolhe a função de manipulação baseada no modelo
        if (model === 'PR MED VB' || model === 'SC MED VB') {
            outputFilePath = medicamentoVB(filePath, model);
        } else if (model === 'PR PERF VB' || model === 'SC PERF VB' || model === 'E-DELIVERY') {
            outputFilePath = perfumariaVB(filePath, model);
        } else if (model === 'Alpha7') {
            outputFilePath = generateTxtAlpha7File(filePath, model);
        } else if (model === 'BIG') {
            outputFilePath = generateCsvBigFile(filePath, model, start_date, end_date);
        } else if (model === 'Trier') {
            outputFilePath = generateTxtTrierFile(filePath, model, start_date, end_date);
        } else if (model === 'Todos') {
            // Gera todos os arquivos
            generateTxtTrierFile(filePath, model, start_date, end_date);
            generateTxtAlpha7File(filePath, model);
            generateCsvBigFile(filePath, model, start_date, end_date);
            outputFilePath = "Todos os arquivos gerados";
        }

        // Responde com o caminho do arquivo gerado
        res.json({ message: 'Arquivo gerado com sucesso!', path: outputFilePath });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
