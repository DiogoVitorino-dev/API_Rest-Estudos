# API_Rest-Estudos
Projeto de uma API Rest com Nodejs e Typescript. <br>
Deploy automatizado com Docker no [Back4App](https://www.back4app.com/) <br>
Está sendo desenvolvido de acordo com o [Curso de API Rest, Node e Typescript](https://www.youtube.com/playlist?list=PL29TaWXah3iaaXDFPgTHiFMBF6wQahurP) criado pelo [<ins>Lucas Souza Dev<ins>](https://www.youtube.com/@LucasSouzaDev)

## [App 🌎](https://apirestestudos-diogovf90.b4a.run/)

## Endpoints
#### Cidades (Privado)

 - GET	--	/cidades 		-	Busca uma lista de cidades, com paginação e filtro por nome.
 - POST	--	/cidades			- Criar uma nova cidade.
 - GET	--	/cidades/:id	- Busca apenas uma cidade pelo seu id.
 - PUT	--	/cidades/:id	- Atualiza uma cidade pelo seu id.
 - DELETE	-- /cidades/:id	- Apaga a cidade pelo seu id.

#### Pessoas (Privado)

 - GET	--	/pessoas 		-	Busca uma lista de pessoas, com paginação e filtro por nome.
 - POST	--	/pessoas			- Criar uma nova pessoa.
 - GET	--	/pessoas/:id	- Busca apenas uma pesssoa pelo seu id.
 - PUT	--	/pessoas/:id	- Atualiza uma pessoa pelo seu id.
 - DELETE	-- /pessoas/:id	- Apaga a pessoa pelo seu id

#### Login (Público)

 - POST	--	/entrar			- Permite um usuário existente no sistema gerar um token para acessar o endpoints privados.
 - POST	--	/cadastrar		-	Permite criar um novo usuário.
   
