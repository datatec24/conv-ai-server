const Mobile = require('../models/mobile')
const co = require('co')

co(function* () {
  yield Mobile.remove({})

  let mobile = yield Mobile.findOne({})

  if (!mobile) {
    yield new Mobile({
      id: '1',
      brand: 'Apple',
      brand_image: 'http://logok.org/wp-content/uploads/2014/04/Apple-Logo-black.png',
      model: 'iPhone 7 128GB - Black',
      price: 438500,
      description: 'Display: 4.7-inch Retina HD\nCPU: Quad Core A10 Fusion chip with 64-bit Architecture\nMemory: 2GB RAM; 128GB ROM\nOS: Apple iOS 10\nCamera: 12MP; 7MP HD FaceTime\nColour: Black',
      link: 'https://www.jumia.com.ng/apple-iphone-7-128gb-black-5615352.html',
      pattern: 'iphon[e]*[s]*[ ]*7*|appl',
      image: 'https://www.wired.com/wp-content/uploads/2016/09/iPhone7Plus-JetBlk-34BR_iPhone7-JetBlk-34L_PR-PRINT-1-1024x683.jpg'
    }).save()

    yield new Mobile({
      id: '2',
      brand: 'Apple',
      brand_image: 'http://logok.org/wp-content/uploads/2014/04/Apple-Logo-black.png',
      model: 'Apple iPhone 6 Plus 16GB - Space Grey',
      price: 225750,
      description: 'Operating System: iOS 8\nCamera Specs: 8MP (Primary); 1.2MP (Secondary)\nScreen: 5.5" LED-backlit IPS LCD, capacitive touchscreen\nMemory: 16GB, 1GB RAM',
      link: 'https://www.jumia.com.ng/iphone-6-plus-16gb-space-grey-apple-mpg52434.html',
      pattern: 'iphon[e]*[s]*[ ]*6*|appl',
      image: 'http://drop.ndtv.com/TECH/product_database/images/910201410301AM_635_apple_iphone_6.jpeg'
    }).save()

    yield new Mobile({
      id: '3',
      brand: 'Samsung',
      brand_image: 'http://www.samsung.com/common/img/logo-square-letter.png',
      model: 'Samsung Galaxy C7 DualSim 32GB - Gold',
      price: 190099,
      description: 'Android OS, v6.0.1 (Marshmallow)\n5.7 inches Super AMOLED capacitive touchscreen, 16M colors\n32 GB, 4 GB RAM, microSD, up to 256 GB (uses SIM 2 slot)\nQualcomm MSM8953 Snapdragon 625',
      link: 'https://www.jumia.com.ng/samsung-galaxy-c7-dualsim-32gb-gold-5614894.html',
      pattern: 'samsun|galax|C7',
      image: 'http://cdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j7-2016-3.jpg'
    }).save()

    yield new Mobile({
      id: '4',
      brand: 'Tecno',
      brand_image: 'http://3.bp.blogspot.com/-aiYA-qlIGaQ/VTkK2Rf3TZI/AAAAAAAAAW4/FpqvirTKfIs/w1200-h630-p-nu/Tecno-logo.png',
      model: 'Tecno Phantom 5 - Gold',
      price: 95550,
      description: 'Display Size: 5.5 Inches\nProcessor: 1.3GHz Octa Core\nRAM: 3GB\nInternal Memory: 32GB',
      link: 'https://www.jumia.com.ng/phantom-5-gold-tecno-mpg29745.html',
      pattern: 'Tecno|phant',
      image: 'http://mobitrends.co.ke/wp-content/uploads/2015/09/Tecno-Phantom-5-Specifications-Review-and-Price-in-Kenya.jpg'
    }).save()

    yield new Mobile({
      id: '5',
      brand: 'Infinix',
      brand_image: 'http://www.talkandroidphones.com/wp-content/uploads/2016/07/infinix-logo.jpg',
      model: 'Infinix Hot 4 X557 - Gold',
      price: 41700,
      description: 'Screen: 5.5" HD Display\nMemory: 2GB RAM, 16GB ROM, 32GB micro SD\nCPU: MT6580 Quad Core Cortex; 1.3GHz\nOperating System: XOS (Based on Android Marshmallow)',
      link: 'https://www.jumia.com.ng/infinix-hot-4-x557-gold-5516266.html',
      pattern: 'Infini|Hot 4',
      image: 'http://i1.wp.com/thegadgetsfreak.com/wp-content/uploads/2016/09/infinix-hot-3.jpg?resize=600%2C574'
    }).save()

    yield new Mobile({
      id: '6',
      brand: 'Samsung',
      brand_image: 'http://www.samsung.com/common/img/logo-square-letter.png',
      model: 'Samsung Galaxy Note 5 32GB - Gold Platinum',
      price: 246700,
      description: 'Screen Size: 5.7"\nProcessor: Octa Core 2.1Ghz\nRAM: 4GB\nHDD/Internal Memory: 32GB\nOperating System: Android Lollipop 5.1\nCamera: 16MP',
      link: 'http://www.samsung.com/global/galaxy/galaxy-note5/images/galaxy-note5_gallery_front_silver_s3.png',
      pattern: 'samsu|salaxy|note 5',
      image: 'http://i1.wp.com/thegadgetsfreak.com/wp-content/uploads/2016/09/infinix-hot-3.jpg?resize=600%2C574'
    }).save()

    yield new Mobile({
      id: '7',
      brand: 'Tecno',
      brand_image: 'http://3.bp.blogspot.com/-aiYA-qlIGaQ/VTkK2Rf3TZI/AAAAAAAAAW4/FpqvirTKfIs/w1200-h630-p-nu/Tecno-logo.png',
      model: 'Tecno W5 Lite - Gold',
      price: 37950,
      description: 'Display: 5.5 Inch IPS Touchscreen Display\nMemory: 1GB RAM, 16GB ROM, expandable up to 64GB with microSD\nCPU: Cortex A53 1.3GHz Quad Core Processor\nOperating System: Android Marshmallow 6.0\nCamera: 13MP Back Camera with LED flash, 5MP Front Camera\nBattery: 3000mA',
      link: 'https://www.jumia.com.ng/tecno-w5-lite-gold-5597299.html',
      pattern: 'Tecno|W5',
      image: 'http://www.tdafrica.com/media/catalog/product/cache/1/image/400x405/9df78eab33525d08d6e5fb8d27136e95/w/2/w2_gold_1.jpg'
    }).save()

    yield new Mobile({
      id: '8',
      brand: 'Lenovo',
      brand_image: 'http://fullhdpictures.com/wp-content/uploads/2016/01/Lenovo-Logos.jpg',
      model: 'Lenovo Tab 3 7" QuadCore',
      price: 37495,
      description: 'Screen: 7"\nMemory: 1GB RAM/16GB HDD\nCPU: Mediatek Quad Core, 1.3GHz\nOperating System:\nCamera: 5MP AF Camera, 2MP Front Camera\nBattery: 3450mAh, 10 hours',
      link: 'https://www.jumia.com.ng/lenovo-tab-3-7-quadcore-1.3ghz-3g1gb16gb-hddmicro-sim-android-tablet-black-5612811.html',
      pattern: 'lenovo|W5',
      image: 'http://cdn2.gsmarena.com/vv/bigpic/lenovo-tab3-711.jpg'
    }).save()

    yield new Mobile({
      id: '9',
      brand: 'Alcatel',
      brand_image: 'http://www.techguide.com.au/wp-content/uploads/2016/02/Alcatel16MWC1.jpg',
      model: 'Alcatel Pixi 4 (5") - Silver',
      price: 20650,
      description: 'Display: 5.0 Inch IPS LCD\nProcessor: 1.3 GHz Quad Core\nMemory: 8GB ROM, 2GB RAM\nCamera: 5MP (Rear), 5MP (Front)\nOS: Android 6.0 Marshmallow\nBattery: Removable Li-Ion 2000mAh',
      link: 'https://www.jumia.com.ng/alcatel-pixi-4-5-silver-5599878.html',
      pattern: 'Alcat|Pixi',
      image: 'http://media.ldlc.com/ld/products/00/03/66/32/LD0003663226_2.jpg'
    }).save()

    yield new Mobile({
      id: '10',
      brand: 'Infinix',
      brand_image: 'http://www.talkandroidphones.com/wp-content/uploads/2016/07/infinix-logo.jpg',
      model: 'Infinix Zero 4 X555 - Grey',
      price: 94600,
      description: 'Infinix Zero 4 X555 - Grey',
      link: 'https://www.jumia.com.ng/infinix-zero-4-x555-grey-5595204.html',
      pattern: 'infini|Zero 4',
      image: 'https://i0.wp.com/techlector.com/wp-content/uploads/2015/06/INFINIX-ZERO-2.jpg?resize=400%2C400'
    }).save()
  }
})
