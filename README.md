# FastFeet

Desafio 09 Rocketseat

---

# Úteis

- Informações sobre níveis de acesso de usuários e planos de assinatura em [definições](DEFINITIONS.md)
- Pendências de desenvolvimento em [afazeres](TODO.md)

---

# Instalação

## Banco principal (PostgreSQL)

### Criando container

```bash
docker run postgres
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

```

## Clonando o projeto

```bash

```
