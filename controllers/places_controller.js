const {queryPlaces,insertPlaces,searchForPlace} = require("../services/places_service");
const path = require("path");
const {promises: fs} = require("fs");

exports.searchForPlace = async (req, res) => {
    try {
        const result = await searchForPlace(req)

        res.status(200).send({
            status: 200, success: true, data: result
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
};


exports.queryPlaces = async (req, res) => {
    try {
        const result = await queryPlaces(req.body)

        res.status(200).send({
            status: 200, success: true, data: result
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
};

exports.insertPlaces = async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'addresses.json');
        const data = await fs.readFile(filePath, 'utf8');
        const places = JSON.parse(data);
        const result = await insertPlaces(places)
        res.status(200).send({
            status: 200, success: true, data: {
                count: result.length,
                result,
            }
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
};

