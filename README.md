# Efast

Projeto pessoal & utilizado para TCC - Fatec Botucatu - 2022

---

# Úteis

- Informações sobre níveis de acesso de usuários e planos de assinatura em [definições](DEFINITIONS.md)
- Pendências de desenvolvimento em [afazeres](TODO.md)

---

# Instalação

## Requisitos do Hipervisor

### Docker

###

## Banco principal (PostgreSQL)

```bash
docker run --name database -e POSTGRES_PASSWORD=efast@123 -p 5432:5432
```

### Estrutura (migrations)

```bash
# NPM
npm run sequelize db:migrate

# Yarn
yarn sequelize db:migrate
```

### Populando dados iniciais (seeds)

```bash
# NPM
npm run sequelize db:seed:all

# Yarn
yarn sequelize db:seed:all
```

## Banco de filas (Redis)

```bash
  docker run --name redis -p 6379:6379 -d -t redis:alpine
```

## Container do projeto

```bash
  docker run -it
```

## Clonando o projeto

```bash
  git clone git@github.com:gu-nogueira/efast.git
```
