const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const app = express();

const Vehicle = new Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    mpg: {
        type: String,
        required: true
    },
    ranking: {
        type: Number,
        required: true
    }

});

const Preferences = new Schema({
    budget: {
        type: String,
    },
    commuteTime: {
        type: String,
    },
    carsickRating: {
        type: String,
    },
    attractionSelection: {
        type: [String],
    },
    diningSelection: {
        type: [String],
    },
    housingSelection: {
        type: [String],
    }
});

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    vehicles: {
        type: [Vehicle],
        default: []
    },

    preferences: {
        type: Preferences,
        default: {}
    },
    filled_preferences: {
        type: Boolean,
        default: false
    },
    google_id: {
        type: String,
        required: true
    },
    google_expiry: {
        type: Number,
        required: true
    },
    profile_picture: {
        type: String,
    }
});

module.exports = mongoose.model('User', User);