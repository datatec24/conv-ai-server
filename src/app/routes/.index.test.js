const request = require('supertest-as-promised')
const express = require('express')

let app
const route = require('./index')

beforeEach(() => {
  app = express()
  route(app)
})

it('should render "Hello World!"', () =>
  request(app)
    .get('/')
    .expect(200, 'Hello World!')
    .toPromise()
)
