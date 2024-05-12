const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workingHoursSchema = new Schema({
    Monday: String,
    Tuesday: String,
    Wednesday: String,
    Thursday: String,
    Friday: String,
    Saturday: String,
    Sunday: String
}, {_id: false});


const deliveryHoursSchema = new Schema({
    Monday: {type: String, required: false},
    Tuesday: {type: String, required: false},
    Wednesday: {type: String, required: false},
    Thursday: {type: String, required: false},
    Friday: {type: String, required: false},
    Saturday: {type: String, required: false},
    Sunday: {type: String, required: false},
}, {_id: false}); // _id: false because we don't need an _id for each subdocument

const dynamicSchema = new Schema({
    dynamicField: Schema.Types.Mixed
});



const popularTimeEntrySchema = new Schema({
    hour: Number,
    percentage: Number,
    title: String,
    time: String
}, {_id: false}); // _id is not needed for these subdocuments


const liveSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    }
});
// Schema for the day's popular times
const popularDaySchema = new Schema({
    day: Schema.Types.Mixed,
    popular_times: [popularTimeEntrySchema] // Array of popular time entries
});


const postSchema = new Schema({
    body: String,
    timestamp: Number,
    link: String,
    image: String
});


const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
});
// locationSchema.index({ location: '2dsphere' });

const aboutScheme = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    values: [String] // An array of strings
});
const hashAddressesSchema = new Schema({
    query: String,
    name: String,
    site: String,
    subtypes: String,
    category: String,
    type: String,
    phone: String,
    full_address: String,
    borough: String,
    street: String,
    city: String,
    postal_code: String,
    state: String,
    us_state: String,
    country: String,
    country_code: String,
    latitude: Number,
    longitude: Number,
    location: locationSchema,
    time_zone: String,
    plus_code: String,
    area_service: Boolean,
    rating: Number,
    reviews: Number,
    reviews_link: String,
    reviews_tags: String,
    reviews_per_score: String,
    reviews_per_score_1: Number,
    reviews_per_score_2: Number,
    reviews_per_score_3: Number,
    reviews_per_score_4: Number,
    reviews_per_score_5: Number,
    photos_count: Number,
    photo: String,
    street_view: String,
    located_in: String,
    working_hours: {type: workingHoursSchema, required: false},
    working_hours_old_format: String,
    other_hours: [deliveryHoursSchema],
    popular_times: [popularDaySchema],
    business_status: String,
    about: [aboutScheme],
    range: String,
    posts: [postSchema],
    logo: String,
    description: String,
    typical_time_spent: String,
    verified: Boolean,
    owner_id: {type: Schema.Types.Mixed, required: false},
    owner_title: String,
    owner_link: String,
    reservation_links: String,
    booking_appointment_link: String,
    menu_link: String,
    order_links: String,
    location_link: String,
    place_id: {type: String, unique: true},
    google_id: String,
    cid: {type: Schema.Types.Mixed, required: false},
    reviews_id: {type: Schema.Types.Mixed, required: false},
    located_google_id: String,
    email_1: String,
    email_1_full_name: String,
    email_1_title: String,
    email_2: String,
    email_2_full_name: String,
    email_2_title: String,
    email_3: String,
    email_3_full_name: String,
    email_3_title: String,
    phone_1: {type: Schema.Types.Mixed, required: false},
    phone_2: String,
    phone_3: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    medium: String,
    reddit: String,
    skype: String,
    snapchat: String,
    telegram: String,
    whatsapp: String,
    twitter: String,
    vimeo: String,
    youtube: String,
    github: String,
    crunchbase: String,
    website_title: String,
    website_generator: String,
    website_description: String,
    website_keywords: String,
    website_has_fb_pixel: String,
    website_has_google_tag: String,
    text: String,
    vectors:[]
});


hashAddressesSchema.index({
    name: 'text'
});


hashAddressesSchema.index({ 'location.coordinates': '2dsphere' });

hashAddressesSchema.on('index', function(err) {
    console.log(err)
    if (err) {
        console.error('Index creation error:', err);
    }
});

const HashAddresses = mongoose.model('HashAddresses', hashAddressesSchema);

module.exports = HashAddresses;
