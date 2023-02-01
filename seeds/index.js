if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
 
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
 
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser    : true,
    useUnifiedTopology : true
});
 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
 
const sample = (array) => array[Math.floor(Math.random() * array.length)];
 
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author      : '63d009ee8ef3017e5f274724',
            location    : `${cities[random1000].city}, ${cities[random1000].state}`,
            title       : `${sample(descriptors)} ${sample(places)}`,
            description :
                'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo, officiis corrupti. Molestiae consequatur veritatis quis. Magnam, corporis! Dolore, labore! Sed ex sapiente nulla consectetur voluptatibus consequuntur dolorem debitis quisquam ducimus.',
            price,
            geometry    : {
                type        : 'Point',
                coordinates : []
            },
            images      : [
                {
                    url      :
                        'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename : 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url      :
                        'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename : 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        });
        const geoData = await geocoder
            .forwardGeocode({
                query : camp.location,
                limit : 1
            })
            .send();
        camp.geometry.coordinates = geoData.body.features[0].geometry.coordinates;
        await camp.save();
    }
    console.log('SEEDING COMPLETE');
};
 
seedDB().then(() => {
    mongoose.connection.close();
});