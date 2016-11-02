# Conv.ai server [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![CircleCI](https://circleci.com/gh/conv-ai/conv-ai-server.svg?style=shield&circle-token=ef4f98d41e74016dcfb21fc67ec422fdc21f030f)](https://circleci.com/gh/conv-ai/conv-ai-server) [![codecov](https://codecov.io/gh/conv-ai/conv-ai-server/branch/master/graph/badge.svg?token=bDTORFO2KP)](https://codecov.io/gh/conv-ai/conv-ai-server)

Setup:
```sh
ln -s .env.dev .env
docker-compose build
```

Start the server:
```sh
docker-compose up -d && docker attach convai_app_1
```

Useful URLs:
* Main app [http://localhost:3000](http://localhost:3000)
* Kibana [http://localhost:5601](http://localhost:5601)

Useful commands:
```sh
docker-compose exec app yarn test
docker-compose exec app yarn test -- --watch --coverage
docker-compose exec app yarn run lint
docker-compose exec app yarn run lint -- --fix
```

When you're done:
```sh
docker-compose down
```
