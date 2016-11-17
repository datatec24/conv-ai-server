const Mobile = require('../models/mobile')
const co = require('co')

co(function* () {

  yield Mobile.remove({})

  let mobile = yield Mobile.findOne({});

  if (!mobile) {
    console.log('On fabrique le catalogue')
    yield new Mobile({
      id: '1',
      brand: 'Apple',
      brand_image: 'http://figuresambigues.free.fr/PhotosSemantiques/Resources/ligne-horizontale-1.jpeg',
      model: 'iPhone 7 128GB - Black',
      price: 438500,
      description:"Display: 4.7-inch Retina HD\nCPU: Quad Core A10 Fusion chip with 64-bit Architecture\nMemory: 2GB RAM; 128GB ROM\nOS: Apple iOS 10\nCamera: 12MP; 7MP HD FaceTime\nColour: Black",
      link:'https://www.jumia.com.ng/apple-iphone-7-128gb-black-5615157.html',
      pattern: 'iphon[e]*[s]*[ ]*7*|appl',
      image:'https://www.wired.com/wp-content/uploads/2016/09/iPhone7Plus-JetBlk-34BR_iPhone7-JetBlk-34L_PR-PRINT-1-1024x683.jpg'
    }).save()

    yield new Mobile({
      id: '2',
      brand: 'Apple',
      brand_image: 'http://figuresambigues.free.fr/PhotosSemantiques/Resources/ligne-horizontale-1.jpeg',
      model: 'Apple iPhone 6 Plus 16GB - Space Grey',
      price: 225750,
      description:'Operating System: iOS 8\nCamera Specs: 8MP (Primary); 1.2MP (Secondary)\nScreen: 5.5" LED-backlit IPS LCD, capacitive touchscreen\nMemory: 16GB, 1GB RAM',
      link:'https://www.jumia.com.ng/iphone-6-plus-16gb-space-grey-apple-mpg52434.html',
      pattern: 'iphon[e]*[s]*[ ]*6*|appl',
      image:'http://drop.ndtv.com/TECH/product_database/images/910201410301AM_635_apple_iphone_6.jpeg'
    }).save()

    yield new Mobile({
      id: '3',
      brand: 'Samsung',
      brand_image: 'http://www.samsung.com/common/img/logo-square-letter.png',
      model: 'Samsung Galaxy C7 DualSim 32GB - Gold',
      price: 190099,
      description:'Android OS, v6.0.1 (Marshmallow)\n5.7 inches Super AMOLED capacitive touchscreen, 16M colors\n32 GB, 4 GB RAM, microSD, up to 256 GB (uses SIM 2 slot)\nQualcomm MSM8953 Snapdragon 625',
      link:'https://www.jumia.com.ng/samsung-galaxy-c7-dualsim-32gb-gold-5614894.html',
      pattern:'samsun|galax|C7',
      image:'http://cdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j7-2016-3.jpg'
    }).save()

    yield new Mobile({
      id: '4',
      brand: 'Tecno',
      brand_image: 'https://www.tecno-mobile.com/Public/Img/logo/brand.png',
      model: 'Tecno Phantom 5 - Gold',
      price: 95550,
      description:'Display Size: 5.5 Inches\nProcessor: 1.3GHz Octa Core\nRAM: 3GB\nInternal Memory: 32GB',
      link:'https://www.jumia.com.ng/phantom-5-gold-tecno-mpg29745.html',
      pattern:'Tecno|phant',
      image:'http://mobitrends.co.ke/wp-content/uploads/2015/09/Tecno-Phantom-5-Specifications-Review-and-Price-in-Kenya.jpg'
    }).save()

    yield new Mobile({
      id: '5',
      brand: 'Infinix',
      brand_image: 'http://d2idx9epdcbzys.cloudfront.net/media//Infinix-logo.png',
      model: 'Infinix Hot 4 X557 - Gold',
      price: 41700,
      description:'Screen: 5.5" HD Display\nMemory: 2GB RAM, 16GB ROM, 32GB micro SD\nCPU: MT6580 Quad Core Cortex; 1.3GHz\nOperating System: XOS (Based on Android Marshmallow)',
      link:'https://www.jumia.com.ng/infinix-hot-4-x557-gold-5516266.html',
      pattern:'Infini|Hot 4',
      image:'https://static.daraz.pk/p/infinix-0300-6012836-3-zoom.jpg'
    }).save()

    yield new Mobile({
      id: '6',
      brand: 'Infinix',
      brand_image: 'http://d2idx9epdcbzys.cloudfront.net/media//Infinix-logo.png',
      model: 'Infinix Hot 4 X557 - Gold',
      price: 41700,
      description:'Screen: 5.5" HD Display\nMemory: 2GB RAM, 16GB ROM, 32GB micro SD\nCPU: MT6580 Quad Core Cortex; 1.3GHz\nOperating System: XOS (Based on Android Marshmallow)',
      link:'https://www.jumia.com.ng/infinix-hot-4-x557-gold-5516266.html',
      pattern:'Infini|Hot 4',
      image:'https://static.daraz.pk/p/infinix-0300-6012836-3-zoom.jpg'
    }).save()

  }
})
