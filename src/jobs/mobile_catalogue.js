const Mobile = require('../models/mobile')
const co = require('co')

co(function* () {
  // yield Mobile.remove({})

  let mobile = yield Mobile.findOne({})

  if (!mobile) {
    console.log('On fabrique le catalogue')
    yield new Mobile({
      id: '1',
      brand: 'Apple',
      model: 'Iphone 7',
      price: 600,
      description: 'Bete de phone',
      link: 'www.google.com'
    }).save()

    yield new Mobile({
      id: '2',
      brand: 'Apple',
      model: 'Iphone 6',
      price: 400,
      description: 'Bete de phone',
      link: 'www.google.com'
    }).save()

    yield new Mobile({
      id: '3',
      brand: 'Samsung',
      model: 'Galaxy s7',
      price: 300,
      description: 'Bete de phone',
      link: 'www.google.com'
    }).save()

    yield new Mobile({
      id: '4',
      brand: 'Samsung',
      model: 'Galaxy s6',
      price: 150,
      description: 'Bete de phone',
      link: 'www.google.com'
    }).save()

    yield new Mobile({
      id: '4',
      brand: 'Yoco',
      model: 'Cheap Mob',
      price: 100,
      description: 'Bete de phone',
      link: 'www.google.com'
    }).save()
  }
})
