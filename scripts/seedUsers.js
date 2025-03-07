const userModel = require('../models/users');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    await userModel.deleteMany();
    await userModel.insertMany([
        { username: 'tobechi_onwenu', email: 'tobechi.onwenu@my.metrostate.edu' },
        { username: 'sumangal_sinharoy', email: 'sumangal.sinharoy@my.metrostate.edu'},
        { username: 'anh_le', email: 'anh.le.2@my.metrostate.edu'},
        { username: 'khanh_le', email: 'khanh.le@my.metrostate.edu'},
    ]);
    console.log("Data seeded successfully");
    mongoose.connection.close();
};

seedData();

