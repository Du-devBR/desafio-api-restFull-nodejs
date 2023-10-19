# Desafio Api REST full nodejs |

![GitHub repo size](https://img.shields.io/github/repo-size/Du-devBR/desafio-api-restFull-nodejs)
![GitHub language count](https://img.shields.io/github/languages/count/Du-devBR/desafio-api-restFull-nodejs)
![GitHub forks](https://img.shields.io/github/forks/Du-devBR/desafio-api-restFull-nodejs)

> Desafio academico  para criar uma Api para administrar  refeições no dia a dia, curso de NodeJs do Ignite [Rocketseat](http://app.ropcketseat.com.br).

## Detalhes do aplicativo

- Esta é uma api restfull para gerenciamento de refeições e controle de dieta de um usuario. É possivel o usuario se cadastrar na plataforma, registrar suas refeições, editar, deletar e ver os detalhes de cada refeição. É possivel o usuario visualizar suas métricas, com dados retornando sobre o total de refeições, as que estão dentro e fora da dieta e qual a maxima de refeições dentro da dieta.

## 🚀 Funcionalidades



## Regras de negócio
- [ x ] Deve ser possível criar um usuário
- [ x ] Deve ser possível identificar o usuário entre as requisições
- [ x ] Deve ser possível registrar uma refeição feita, com as seguintes informações:

    *As refeições devem ser relacionadas a um usuário.*

    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [ x ] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [ x ] Deve ser possível apagar uma refeição
- [ x ] Deve ser possível listar todas as refeições de um usuário
- [ x ] Deve ser possível visualizar uma única refeição
- [ x ] Deve ser possível recuperar as métricas de um usuário
    - [ x ] Quantidade total de refeições registradas
    - [ x ] Quantidade total de refeições dentro da dieta
    - [ x ] Quantidade total de refeições fora da dieta
    - [ x ] Melhor sequência de refeições dentro da dieta
- [ x ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou


## 💻 Como usar o projeto

Para rodar o projeto precisará realizar os procedimentos abaixo

1 clone o projeto

```
https://github.com/Du-devBR/desafio-api-restFull-nodejs.git
```

2 Terminal

```
cd .\desafio-api-restFull-nodejs
```

3 Instale as dependências necessárias com o comando

```
npm install
```

4 Rode o servidor da api

```
npm run dev
```

5 Use uma ferramenta de testes de api ou integre a um projeto frontend


## Rotas:

### Usuario
- `POST - /user`
```
JSON
{
	"name": "john",
	"lastname": "doe",
	"email": "johndoe@teste.com"
}
```
### Refeicoes

- `POST - /user/`*idUser*`/meal`
```
JSON
{
	"name": "teste",
	"description": "teste1",
    "createdAt": "2023-11-24T11:00:00.000-03",
	"isDiet": true
}
```

- `GET - /user/`*idUser*`/meal`

- `GET by ID - /user/`*idUser*`/meal/`*idMeal*` `
```
Exemplo de response
{
	"meal": [
		{
			"id": "714d3d69-40f3-436d-9389-9a13b4a25370",
			"name": "Comida fora da dieta",
			"description": "teste1",
			"createdAt": "2023-11-24T11:00:00.000-03",
			"isDiet": 1,
			"userId": "7a7995cd-4278-4fd3-8411-84384269b872"
		}
	]
}
```

- `PUT - /user/`*idUser*`/meal/`*idMeal*` `
```
{
	"name": "teste",
	"description": "teste1",
	"isDiet": true
}
```
- `DELETE - /user/`*idUser*`/meal/`*idMeal*` `

### Metrics

- `GET - /user/`*idUser*`/metrics`
```
Exemplo de response
{
	"metrics": {
		"totalResgitered": 1,
		"withinDiet": 1,
		"offDiet": 0,
		"percentMealsWithinDiet": 100,
		"maxSequence": 1
	}
}
```

## Tests
Teste de integração, validando as rotas da aplicação
```
npm run test
```

## 🌐 Links úteis

[NodeJs](https://nodejs.org/en)
[knexjs](https://knexjs.org/)
[fastify](https://fastify.dev/)
[vitest](https://vitest.dev/)




## Eduardo Ananias da Silva

[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/eduardo-ananias-29a53048/)
[<img src=" https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/Du-devBR)
