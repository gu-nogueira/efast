# To do

Lista de afazeres

---

## Ideias

- Integração na rota `post` de `/sessions` com o **reCAPTCHA** do Google. [Documentação](https://developers.google.com/recaptcha/docs/verify) para recuperar os dados no **backend**
- Integração na rota `register` com o `reCAPTCHA` do Google. Documentação do frontend [aqui](https://developers.google.com/recaptcha/docs/display). Versão para o React [aqui](https://github.com/dozoisch/react-google-recaptcha).
- Storage de **upload de imagens** com **servidor de armazenamento** (cloudflare talvez)

## Backend

- **IMPORTANTE**: Fazer rota de refresh token JWT
- **Setup**: Montar `README` de instalação
- **Backup**: Iniciar desenvolvimento de **API utilitária** para backup **semanal** do **banco de dados** . [Link do artigo](https://soshace.com/automated-postgresql-backups-with-nodejs-and-bash/) | [Link do github](https://github.com/Bradleykingz/automated-postgres-backups-with-node)
- **Verificação de email**: Fazer verificação de email quando houver `update` de `email` em `user`
- Fazer rota de verificação por email
- **Verificação de email**: Fazer verificação de email no cadastro do usuário, implementar link criptografado com id do usuário para ser verificado
- Montar algoritmo de criptografia do link de verifiação usando o `lib/Crypt`

---

- Revisar possíveis validações com `date-fns`
- Revisar **códigos duplicados** em `controllers` e possível **modularização** de blocos de codigo
- Revisar **retorno de dados** possivelmente **sensíveis** pa ra usuários baseado em seu **nível de permissão**

## Frontend

- [DOING] Estilizar modal de visualização de encomenda;
- Criar rotas:
  - **Forgot**: Esqueci minha senha
  - **Privacy**: Termos de uso e políticas de privacidade
- Fazer **blacklist** de **redux persist**, verificar quais dados podem ser persistidos ou não
- Inserir mensagem para verificação na caixa de spam na verificação de e-mail

# Finalizados

## Ideias

- Layout para o eFast

## Backend

- Montar estrutura da API inicial
- Montar serviço de envio de email
- Subir container do redis para cache e fila de email
- Criar módulo de transactions

### Postgres

- Montar v1 do banco e estrutura de tabelas;

## Frontend

- Criar e estruturar projeto ReactJS;

### Design

- Definição de paletas de cores, tipografias, tamanhos...
- Prototipação inicial
- Esquematização dos principais fluxos para o usuário
- Desenvolvimento do layout e principais telas
