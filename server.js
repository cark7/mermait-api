const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Endpoint para gerar HTML com Mermaid.js
app.post('/mermaid', (req, res) => {
  const { data, project, description } = req.body;

  if (!data) {
    return res.status(400).send({ error: 'O campo "data" é obrigatório.' });
  }

  if (!project) {
    return res.status(400).send('Projeto é obrigatório.');
  }

  const dataAtual = new Date().toISOString().replace(/[:.]/g, '-'); // Gera o ID com a data  
  const pastaProjeto = path.join(__dirname, 'projects', project);

   // Cria a pasta se não existir
   if (!fs.existsSync(pastaProjeto)) {
    fs.mkdirSync(pastaProjeto, { recursive: true });
  }

  const caminhoArquivo = path.join(pastaProjeto, `${dataAtual}.html`);

  // Gerar um HTML contendo o gráfico Mermaid
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
      mermaid.initialize({ startOnLoad: true });
    </script>
  </head>
  <body>
    <div>
      <p>
        ${description}
      </p>
    </div>
    <div class="mermaid">
      ${data}
    </div>
  </body>
  </html>
  `;

  // Salvar conteudo no site
  fs.writeFileSync(caminhoArquivo, htmlContent);
  console.log('Arquivo HTML criado com sucesso!');

  // Envia o HTML gerado como resposta
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlContent);
});


// Rota para listar todos os projetos
app.get('/projects', (req, res) => {
  const diretorioProjetos = path.join(__dirname, 'projects');

  if (!fs.existsSync(diretorioProjetos)) {
      return res.status(200).send('Nenhum projeto encontrado.');
  }

  const projetos = fs.readdirSync(diretorioProjetos).filter(pasta => {
      return fs.statSync(path.join(diretorioProjetos, pasta)).isDirectory();
  });

  res.status(200).json(projetos);
});

// Rota para listar todos os arquivos de um projeto específico
app.get('/projects/:project', (req, res) => {
  const { project } = req.params;
  const pastaProjeto = path.join(__dirname, 'projects', project);

  if (!fs.existsSync(pastaProjeto)) {
      return res.status(404).send('Projeto não encontrado.');
  }

  const arquivos = fs.readdirSync(pastaProjeto).filter(arquivo => {
      return arquivo.endsWith('.html');
  });

  res.status(200).json(arquivos);
});


// Servir o arquivo HTML
app.get('/result', (req, res) => {
  const { nomeProjeto, id } = req.query;
  const caminhoArquivo = path.join(__dirname, 'projects', nomeProjeto, `${id}.html`);

  if (fs.existsSync(caminhoArquivo)) {
    res.sendFile(caminhoArquivo);
  } else {
      res.status(404).send('Arquivo não encontrado.');
  }
});

app.get('/projeto/:nomeProjeto/:id', (req, res) => {
  const { nomeProjeto, id } = req.params
  const caminhoArquivo = path.join(__dirname, 'projects', nomeProjeto, `${id}.html`);

  if (fs.existsSync(caminhoArquivo)) {
    res.sendFile(caminhoArquivo);
  } else {
      res.status(404).send('Arquivo não encontrado.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
