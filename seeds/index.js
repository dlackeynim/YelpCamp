
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Campground.deleteMany({});
    for( let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10
        const camp = new Campground({
            //YOUR USER ID
            author: '63d009ee8ef3017e5f274724',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, vel laboriosam. Animi praesentium voluptas odio incidunt eaque est quaerat sed reprehenderit, rem ex tenetur repudiandae officia eius totam ab magni.',
            price,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/drak25qkc/image/upload/v1675104112/YelpCamp/jrqxzbxvivglpsu2vjwp.jpg',
                  filename: 'YelpCamp/jrqxzbxvivglpsu2vjwp',
                },
                {
                  url: 'https://res.cloudinary.com/drak25qkc/image/upload/v1675104112/YelpCamp/ytoll7qcrpdwnni7xgje.jpg',
                  filename: 'YelpCamp/ytoll7qcrpdwnni7xgje',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})