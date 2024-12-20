
// const OpenAIApi = require("openai");
const HashAddresses = require("../models/place");
const path = require("path");
const axios = require("axios");
const {openaiEmbed} = require("../utils/utils");
const fs = require('fs').promises; // Using the promise-based version of fs
const {MongoClient} = require('mongodb');
// const openai = require('openai');



async function searchForPlace(req) {

    
    const {searchTerm} = req.body
    console.log(req.body)
    // return await HashAddresses.find({$text: {$search: searchTerm}});
    const locations = await HashAddresses.find(
        {$text: {$search: searchTerm}},
        {score: {$meta: "textScore"}} // Project the text search score
    ).sort({score: {$meta: "textScore"}})
        .select("_id full_address name latitude longitude")// Sort by the text search score

    return locations.map(location => location.toObject())
}

async function queryPlaces(body) {
    const {query, lat, lng, radiusInMeters} = body


    const dbURI = process.env.MONGO_DB_ATLAS_DB_URI;

    const client = new MongoClient(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db("test");
    const embeddings = await openaiEmbed(query);

    db.collection("hashaddresses").createIndex({"location.coordinates": "2dsphere"});

    const documents = await db.collection("hashaddresses").aggregate([
        {
            $vectorSearch: {
                queryVector: embeddings,
                path: 'vectors',
                numCandidates: 100,
                limit: 10,
                index: 'vector_index'
            }
        }
    ]).toArray();
    let matchingIds = documents.map((e) => {
        return e._id
    })//
    return (await HashAddresses.aggregate([
        {
            $geoNear: {
                near: {type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)]},
                distanceField: 'distance',
                path: 'location.coordinates', // specify the path to the coordinates field
                spherical: true,
                maxDistance: parseInt(radiusInMeters),
            }
        },
        {$match: {_id: {$in: matchingIds}}}, // Preliminary filtering if needed, but this contradicts the requirement for $geoNear to be the first stage; use cautiously
    ]))
}
async function insertPlaces(googlePlacesJSON) {

    let allPlaces =  await HashAddresses.find({})

    const allPlacesID = allPlaces.map((e) =>{
        return e.place_id
    })

    const googlePlacesJSONNewOne = googlePlacesJSON.filter((e)=>{
        return !allPlacesID.includes(e.place_id)
    })

    const googlePlacesJSONMapped = googlePlacesJSONNewOne
        .slice(0.5)
        .filter((e) => {
            return e.longitude !== null && e.latitude !== null
        })
        .map((e) => {
            return {
                ...e,
                about: mapAboutObject(e.about),
                location: {
                    type: 'Point',
                    coordinates: [e.longitude, e.latitude] // Note: longitude first, then latitude
                },
                text: `Address Name : ${e.name} \n` +
                    `Query: ${e.query} \n` +
                    `City: ${e.city} \n` +
                    `Category: ${e.category} \n` +
                    `Services: ${mapAboutObject(e.about).map((e) => {
                        return e.values.join()
                    }).join()}`
            }
        })

    let placesWithVectors = []

    for (const jsonObject of googlePlacesJSONMapped) {
        // @TODO: REMOVE EMBD FOR NOW.
        const embeddings = await openaiEmbed(jsonObject["text"]);
        placesWithVectors.push({
            ...jsonObject,
            vectors: embeddings
        })
        let hashAddresses = new HashAddresses({
            ...jsonObject,
            vectors: embeddings
        });
        try {
            await hashAddresses.save();
            console.log(`INSERT GOOGLE MAP PLACE======> ${jsonObject["place_id"]}`)
        } catch (e) {
            console.log(`EXCEPTOIN======> ${e}`)
        }
    }
    return placesWithVectors
    // } catch (err) {
    //     console.log(err)
    //     return err
    // }
}

function mapAboutObject(aboutData) {
    if (aboutData === null) {
        return []
    }
    let aboutDataKeys = Object.keys(aboutData)
    let resultArr = []
    for (let index = 0; index < aboutDataKeys.length; index++) {
        resultArr.push({
            "key": aboutDataKeys[index],
            "values": Object.keys(aboutData[aboutDataKeys[index]]).map((e) => {
                return e.replaceAll("-", " ").replaceAll("_", " ")
            })
        })
    }
    return resultArr
}

module.exports = {
    queryPlaces,
    insertPlaces,
    searchForPlace
}
