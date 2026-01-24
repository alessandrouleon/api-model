## RODAR O PROJETO VIA DOCKER

## O banco usado e mongoDB

### Antes de rodar o projeto certifiquese que está no diretório do arquivo do docker-compose.yml
#### Exemplo nome da pasta sem espaço: |-- Kodigos 
####                                        |-- api-model

#### docker compose up -d --build

### QUANDO ACESSAR o MongoDB Compass informar o nome da conexão do banco por exemplo "service-order" , vefificar se o usuario foi criado.
#### Caso o usuario não seja criado executar o passo abaixo, 

### APOS CRIAR O PROJETO RODAR O ARQUIVO "seed" no terminal, 
#### RODA ESSE COMANDO DENTRO DA PASTA DO PROJETO "api-model"
#### npm run seed
##### Essse arquivo cria um usuario
##### As credenciais do usuario SEED: "username": "admin", e "password": "Admin@123"

