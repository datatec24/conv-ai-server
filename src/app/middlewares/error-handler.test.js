const request = require('supertest-as-promised');
const express = require('express');
const errorHandler = require('./error-handler')

let app
beforeEach(() => {
  app = express();
})

it('should send error', () => {
  app.get('/error', (req, res, next) => next({
    message: 'TEST',
    status: 400
  }))
  app.use(errorHandler())

  return request(app)
    .get('/error')
    .expect(400, {
      message: 'TEST'
    })
    .toPromise()
})

it('should set default status code', () => {
  app.get('/error', (req, res, next) => next(new Error('TEST')))
  app.use(errorHandler())

  return request(app)
    .get('/error')
    .expect(500, {
      message: 'TEST'
    })
    .toPromise()
})

it('should set default status code', () => {
  app.get('/error', (req, res, next) => next({ status: 404 }))
  app.use(errorHandler())

  return request(app)
    .get('/error')
    .expect(404, {
      message: 'Not Found'
    })
    .toPromise()
})

describe('error stack', () => {
  describe('with `middlewares:errorHandler:showStack` config to true', () => {
    const config = require('../../services/config')
    let originalValue

    beforeEach(() => {
      originalValue = config.get('middlewares:errorHandler:showStack')
      config.overrides({
        middlewares: {
          errorHandler: {
            showStack: true
          }
        }
      })
    })

    afterEach(() => {
      config.overrides({
        middlewares: {
          errorHandler: {
            showStack: originalValue
          }
        }
      })
    })

    it('should show error stack', () => {
      app.get('/error', (req, res, next) => next(new Error('TEST')))
      app.use(errorHandler())

      return request(app)
        .get('/error')
        .expect(500)
        .toPromise()
        .then(res => {
          expect(res.body.message).toBe('TEST')
          expect(res.body.stack.length).toBeGreaterThan(0)
        })
    })

    it('should allow empty stack', () => {
      app.get('/error', (req, res, next) => next({ message: 'TEST' }))
      app.use(errorHandler())

      return request(app)
        .get('/error')
        .expect(500)
        .toPromise()
        .then(res => {
          expect(res.body.message).toBe('TEST')
          expect(res.body.stack).toEqual([])
        })
    })
  })
})

