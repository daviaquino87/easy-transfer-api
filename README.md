# Easy Transfer 

O Easy Transfer é uma plataforma de pagamentos simplificada. Nela é possível depositar e realizar transferências de dinheiro entre usuários. Temos 2 tipos de usuários, os comuns e lojistas, ambos têm carteira com dinheiro e realizam transferências entre eles.

![Badge](https://img.shields.io/badge/easy_transfer-api-%4613987?style=for-the-badge&logo=ghost)

<hr>

## 🛠️ Pré-requisitos
* Docker e docker-compose instalados

## 🎲 Rodando o Backend

### Criar o arquivo .env e copiar as variáveis do .env.example
```=shell
cp ./.env.example ./.env
```
* Fazer alterações quando necessário

### Rodar aplicação e banco de dados
```=shell
docker-compose up -d 
```

### Rodar migrations
```=shell
docker exec -it easy-transfer-api npx prisma migrate dev
```

### Rodar seed
```=shell
docker exec -it easy-transfer-api npx prisma db seed
```

Abaixo está as credenciais de um lojista para ser usado em desenvolvimento
```=json
{
  email: 'johnDue@store.com.br',
  password: 'storeUser',
}
```

### Verificar logs da aplicação
```=shell
docker logs -f easy-transfer-api --tail 200
```

### Entrar dentro do container da aplicação
```=shell
docker exec -it easy-transfer-api sh
```

## 📖 Documentação da api

[Documentação](http://localhost:3001/docs)

## 👨🏼‍💻 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Postgres](https://www.postgresql.org/)
- [Docker](https://docs.docker.com/)
- [Prisma ORM](https://www.prisma.io/docs)
- [Vitest](https://vitest.dev)

## 🛠️ Observações
* Instalar dependências dentro do container
* Rodar comandos do prisma dentro do container
* A documentação não fica disponível caso a variável de ambiente NODE_ENV esteja como production