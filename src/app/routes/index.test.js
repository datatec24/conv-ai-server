const request = require('supertest-as-promised')
const app = require('../index')

jest.mock('../../services/logger')

it('should render "Hello World!"', () =>
  request(app)
    .get('/')
    .expect(200, 'Hello World!')
    .toPromise()
)

it('should ok', () => {

})
