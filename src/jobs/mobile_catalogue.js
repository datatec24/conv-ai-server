const Mobile = require('../models/mobile')
const co = require('co')

co(function* () {
  // yield Mobile.remove({})

  yield Mobile.remove({})

  let mobile = yield Mobile.findOne({});

  if (!mobile) {
    console.log('On fabrique le catalogue')
    yield new Mobile({
      model: 'iPhone 7 128GB - Black',
      price: 438500,
      description:"Display: 4.7-inch Retina HD\nCPU: Quad Core A10 Fusion chip with 64-bit Architecture\nMemory: 2GB RAM; 128GB ROM\nOS: Apple iOS 10\nCamera: 12MP; 7MP HD FaceTime\nColour: Black",
      link:'https://www.jumia.com.ng/apple-iphone-7-128gb-black-5615157.html',
      pattern: 'iphon[e]*[s]*[ ]*7*|appl',
      image:'http://figuresambigues.free.fr/PhotosSemantiques/Resources/ligne-horizontale-1.jpeg'
    }).save()

    yield new Mobile({
      id: '2',
      brand: 'Apple',
      model: 'Apple iPhone 6 Plus 16GB - Space Grey',
      price: 225750,
      description:'Operating System: iOS 8\nCamera Specs: 8MP (Primary); 1.2MP (Secondary)\nScreen: 5.5" LED-backlit IPS LCD, capacitive touchscreen\nMemory: 16GB, 1GB RAM',
      link:'https://www.jumia.com.ng/iphone-6-plus-16gb-space-grey-apple-mpg52434.html',
      pattern: 'iphon[e]*[s]*[ ]*6*|appl',
      image:'https://static.jumia.com.ng/p/apple-2010-2782065-1-zoom.jpg'
    }).save()

    yield new Mobile({
      id: '3',
      brand: 'Samsung',
      model: 'Samsung Galaxy C7 DualSim 32GB - Gold',
      price: 190099,
      description:'Android OS, v6.0.1 (Marshmallow)\n5.7 inches Super AMOLED capacitive touchscreen, 16M colors\n32 GB, 4 GB RAM, microSD, up to 256 GB (uses SIM 2 slot)\nQualcomm MSM8953 Snapdragon 625',
      link:'https://www.jumia.com.ng/samsung-galaxy-c7-dualsim-32gb-gold-5614894.html',
      pattern:'samsun',
      image:'https://static.jumia.com.ng/p/samsung-2694-4984165-1-zoom.jpg'
    }).save()

    yield new Mobile({
      id: '4',
      brand: 'Samsung',
      model: 'Galaxy s6',
      price: 150,
      description:'Bete de phone',
      link:'www.google.com',
      pattern:'samsun'
    }).save()

    yield new Mobile({
      id: '4',
      brand: 'Yoco',
      model: 'Cheap Mob',
      price: 100,
      description:'Bete de phone',
      link:'www.google.com',
      pattern:'yoco'
    }).save()
  }
})
