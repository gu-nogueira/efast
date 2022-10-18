const fs = require('fs');
const path = require('path');
const http = require('http');

// Directories
const cityFolder = path.resolve(
  __dirname,
  '..',
  'src',
  'app',
  'json',
  'cities'
);

// Files
const statesJson = {
  path: path.resolve(__dirname, '..', 'src', 'app', 'json', 'states.json'),
  url: 'http://servicodados.ibge.gov.br/api/v1/localidades/estados',
};

const directories = [cityFolder];
const files = [statesJson];

const generateAddresses = new Promise(function (resolve, reject) {
  for (const folder of directories) {
    checkDirectory(folder);
  }

  for (const file of files) {
    checkFile(file, resolve);
  }
});

generateAddresses.then(function () {
  generateCities();
});

function checkDirectory(path) {
  if (!fs.existsSync(path)) {
    try {
      fs.mkdirSync(path, { recursive: true });
      console.log(`Info: Diretório montado em ${path}`);
    } catch (err) {
      console.error(
        `Erro: Não foi possível montar o diretório ${path}: ${err}`
      );
    }
  } else {
    console.log(`Info: Diretório já existente: ${path}`);
  }
}

function checkFile({ path, url }, resolve) {
  if (!fs.existsSync(path)) {
    try {
      http
        .get(url, function (res) {
          let body = '';

          res.on('data', function (chunk) {
            body += chunk;
          });

          res.on('end', function () {
            const parsedData = parseStates(JSON.parse(body));
            const result = JSON.stringify(parsedData);
            fs.writeFileSync(path, result);
            console.log(`Info: Arquivo montado em ${path}`);
            resolve();
          });
        })
        .on('error', function (err) {
          console.log('Erro: Retorno da API', err);
        });
    } catch (err) {
      console.error(
        `Erro: Não foi possível montar o arquivo ${path}: ${err.message}`
      );
    }
  } else {
    console.log(`Info: Arquivo já existente: ${path}`);
    resolve();
  }
}

function generateCities() {
  if (!fs.existsSync(statesJson.path)) {
    return console.error(`Erro: Arquivo não existe: ${statesJson.path}`);
  }
  try {
    const data = fs.readFileSync(statesJson.path, 'utf8');
    const states = JSON.parse(data);
    for (const state of states) {
      const stateFile = path.resolve(cityFolder, `${state.sigla}.json`);
      if (fs.existsSync(stateFile)) {
        console.log(`Info: Arquivo já existente: ${state.sigla}.json`);
        continue;
      }
      http
        .get(
          `http://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.sigla}/municipios`,
          function (res) {
            let body = '';

            res.on('data', function (chunk) {
              body += chunk;
            });

            res.on('end', function () {
              const parsedData = parseCities(JSON.parse(body));
              const result = JSON.stringify(parsedData);
              fs.writeFileSync(stateFile, result);
              console.log(`Info: Arquivo montado em ${stateFile}`);
            });
          }
        )
        .on('error', function (err) {
          console.log('Erro: Retorno da API', err);
        });
    }
  } catch (err) {
    console.error(
      `Erro: Não foi possível ler o arquivo ${statesJson.path}: ${err.message}`
    );
  }
}

function parseStates(states) {
  const parsedStates = states.map((state) => ({
    sigla: state.sigla,
    nome: state.nome,
  }));
  return parsedStates;
}

function parseCities(cities) {
  const parsedCities = cities.map((city) => city.nome);
  return parsedCities;
}
