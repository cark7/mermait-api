const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Endpoint para gerar HTML com Mermaid.js
app.post('/mermaid', (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).send({ error: 'O campo "data" é obrigatório.' });
  }

  // Gerar um HTML contendo o gráfico Mermaid
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mermaid Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
      mermaid.initialize({ startOnLoad: true });
    </script>
  </head>
  <body>
    <div class="mermaid">
      ${data}
    </div>
  </body>
  </html>
  `;

  // Envia o HTML gerado como resposta
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlContent);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
