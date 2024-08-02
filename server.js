const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

// Endpoint para executar o script de scraping e atualizar o JSON
app.get('/atualizar', (req, res) => {
  console.log('Solicitação recebida para /atualizar');
  exec('node scrap.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o script: ${error.message}`);
      return res.status(500).send('Erro ao atualizar');
    }
    if (stderr) {
      console.error(`Erro no script: ${stderr}`);
      return res.status(500).send('Erro ao atualizar');
    }

    console.log('Script executado com sucesso');
    try {
      const data = fs.readFileSync('processos.json', 'utf-8');
      res.json(JSON.parse(data));
    } catch (readError) {
      console.error(`Erro ao ler o arquivo JSON: ${readError.message}`);
      return res.status(500).send('Erro ao ler o arquivo JSON');
    }
  });
});

// Servir a página HTML
app.use(express.static('public'));

module.exports = app;
