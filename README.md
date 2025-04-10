# Users management API

*Sistema de gerenciamento de usuários com autenticação JWT*  

## 🔧 Tecnologias  

- Node.js
- TypeScript
- Express  
- Prisma  
- PostgreSQL  
- Jest
- Zod
- Bcrypt
- Pino

## Variáveis de ambiente

Antes de iniciar a aplicação, configure as variáveis de ambiente. Para facilitar o processo, um exemplo de arquivo .env está disponível no arquivo .env.example, basta copiá-lo e renomeá-lo para .env.

## ⚙️ Como rodar o projeto  

```bash
# Clone o repositório

git clone https://github.com/alves-dev/users-management-api.git 

# Rode o docker-compose

docker-compose up -d
```

## 🧪 Testes

Para executar os testes unitários:

```bash
# Executa todos os testes
pnpm test

# Executa os testes em modo watch
pnpm test:watch
```

## 📚 Documentação da API

A documentação da API está disponível em formato Swagger e pode ser acessada após iniciar o servidor, através da rota:

```md
/api-docs
```

## Arquitetura da Aplicação

- Routes: Camada de roteamento, responsável por definir as rotas da aplicação

- Controllers: Responsável por lidar com as requisições HTTP e invocar os serviços apropriados

- DTOs: Objetos de transferência de dados, utilizados para validar dados e definir contratos entre controller e service

- Services: Contém as regras de negócio da aplicação, responsável por atender às requisições feitas pelos controllers

- Repositories: Camada de persistência dos dados, responsável por interagir com o banco de dados

- Middlewares: Camada de middlewares, responsável por interceptar as requisições HTTP e realizar algumas ações antes de passar para o próximo middleware ou para o controller

- Helpers: Camada de utilitários, responsável por fornecer funções e tipos úteis para o projeto

- Config: Camada de configuração, responsável por carregar as configurações do projeto 

### Considerações

Essa é uma aplicação simples, feita apenas para fins de desenvolvimento e exemplo, não pronta para a produção.
