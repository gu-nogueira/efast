# Installation

Here is a *comprehensive guide* on how to install and run eFast.

## Hypervisor Requirements

### Docker

## Main Database (PostgreSQL)

```bash
docker run --name database -e POSTGRES_PASSWORD=efast@123 -p 5432:5432 -d postgres
```

### Structure (migrations)

```bash
# NPM
npm run sequelize db:migrate

# Yarn
yarn sequelize db:migrate
```

### Populating initial data (seeds)

```bash
# NPM
npm run sequelize db:seed:all

# Yarn
yarn sequelize db:seed:all
```

## Queue Database (Redis)

```bash
  docker run --name redis -p 6379:6379 -d -t redis:alpine
```

## Project Container

```bash
  docker run --privileged -it --net=host --name efast -d --hostname efast ubuntu:20.04
```

### Dependências

htop, vim, curl, git

```bash
# ubuntu / debian
apt-get update && apt-get upgrade
apt-get install -y vim curl git build-essential
```

node, npm

```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
nvm install --lts
```

> Reference article [here.](https://dylancastillo.co/how-to-use-github-deploy-keys/#:~:text=Create%20a%20Deploy%20Key%20on%20GitHub,-First%2C%20copy%20the&text=Click%20on%20Settings%2C%20select%20Deploy,click%20on%20Add%20deploy%20key.&text=Copy%20the%20key%20in%20the,repository%20using%20the%20deploy%20key.)

### Creating a connection with Github

```bash
# Generating SSH key on the server
ssh-keygen -t ed25519 -C "youremail@example"

# Configuring SSH file for connection
Host github-YOUR-APP
	HostName github.com
  AddKeysToAgent yes
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_ed25519

# Getting SSH key
cat ~/.ssh/id_ed25519.pub

# Once done, just create the deploy key in the github repository
https://github.com/gu-nogueira/efast.git
```

### Cloning and configuring the project

```bash
# Creating directory
mkdir -p /var/www/html
cd /var/www/html

# http
git clone https://github.com/gu-nogueira/efast.git

# ssh
git clone git@github.com:gu-nogueira/efast.git
```

- Backend

```bash
cd ./efast/backend
cp .env.example .env
vim .env

# Installing
npm install
npm run build

# Copy email template files
cp -f -R /var/www/html/efast/backend/src/app/views /var/www/html/efast/backend/dist/app

# Run scripts
cd scripts
node GenerateAddresses.js

# Copy json address files
cp -f -R /var/www/html/efast/backend/src/app/json /var/www/html/efast/backend/dist/app
```

- Frontend

```bash
cd /efast/frontend
cp .env.example .env
vim .env

# Installing
npm install
npm run build
```

### PM2

Installation: `npm install -g pm2`

```bash
# Frontend
npm install -g serve
pm2 serve /var/www/html/efast/frontend/build 3001 --spa --log-date-format 'DD-MM HH:mm:ss'

# API
pm2 start /var/www/html/efast/backend/dist/server.js --log-date-format 'DD-MM HH:mm:ss'

# Queues
pm2 start /var/www/html/efast/backend/dist/queue.js --log-date-format 'DD-MM HH:mm:ss'

# List
pm2 list

# Logs
pm2 monit

# Restart updating env
pm2 restart all --update-env

# Kill
pm2 kill
```

## NGINX

Installation

```bash
apt-get install nginx
ufw allow 80
```

Port forwarding: `vim /etc/nginx/sites-available/default`

```bash
# config
location / {
  proxy_pass http://localhost:3001;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

Restart service: `service nginx restart`
Test configuration: `nginx -t`
