# ESTamos Juntos
Este é um **projeto de desenvolvimento** realizado na disciplina de Sistemas Paralelos e Distribuídas do período 2021/01, na Escolar Superior de Tecnologia da Universidade do Estado do Amazonas, sob a orientação do professor e pesquisador Ricardo Rios.

### Equipe de Desenvolvedores
- Victor Yan Pereira e Lima
- Yasmin Maria Muniz de Oliveira

### Estrutura Principal do Repositório
- **frontend** (inicializado com o boilerplate [Ignite](https://github.com/infinitered/ignite))
```
├── app
│   ├── components
│   ├── models
│   ├── navigators
│   ├── screens
│   ├── services
│   ├── theme
│   ├── utils
│   ├── app.tsx
├── assets
│   ├── fonts
│   ├── images
├── bin
├── storybook
├── test
└── package.json
```
- **backend**
```
├── extensions
│   ├── chat.py
│   ├── image_server.py
│   ├── jwt.py
│   ├── mail.py
├── models
│   ├── __init__.py
│   ├── database.py
│   ├── group.py
│   ├── user.py
│   ├── user_group.py 
├── routes
│   ├── auth.py
│   ├── chat.py
│   ├── group.py
│   ├── refresh.py
│   ├── user.py
├── schemas
│   ├── group_schema.py
│   ├── user_group_schema.py
│   ├── user_schema.py 
├── Procfile
├── app.py
└── equirements.txt
```

### Instalando e inicializando o Expo App
Inserir os seguintes comandos:
```console
user@notebook:~/ESTamos-Juntos-Projeto-SPD/frontend$ npm install
```
```console
user@notebook:~/ESTamos-Juntos-Projeto-SPD/frontend$ expo start
```
