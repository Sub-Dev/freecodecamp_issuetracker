'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js'); // se você tiver testes específicos do FCC
const runner = require('./test-runner'); // se estiver usando um runner de testes personalizado

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); // Para fins de testes do FCC

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para página da issue tracker (front-end)
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

// Página inicial
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// Rotas para testes do FCC (se aplicável)
fccTestingRoutes && fccTestingRoutes(app);

// Roteamento da API 
apiRoutes(app);

// Middleware para 404
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Inicia o servidor e os testes, se estiver no modo test
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; // exporta para os testes
