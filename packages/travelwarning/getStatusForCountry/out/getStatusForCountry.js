"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
async function main(input) {
    if (!input.country) {
        return {
            body: {
                error: 'country is required'
            },
            statusCode: 400
        };
    }
    const baseUrl = 'https://www.auswaertiges-amt.de/opendata';
    const travelwarningRoute = `${baseUrl}/travelwarning`;
    try {
        const response = await axios_1.default.get(travelwarningRoute);
        const travelwarnings = response.data.response;
        const travelwarningsAsArray = Object.values(travelwarnings);
        const travelwarningForCountry = travelwarningsAsArray
            .filter((travelwarning) => travelwarning.countryCode === input.country)
            .find(() => true);
        if (!travelwarningForCountry) {
            return {
                body: {
                    error: 'country does not have any travelwarnings'
                },
                statusCode: 404
            };
        }
        return {
            body: {
                warning: travelwarningForCountry.warning,
                partialWarning: travelwarningForCountry.partialWarning,
                situationWarning: travelwarningForCountry.situationWarning,
                situationPartWarning: travelwarningForCountry.situationPartWarning,
            },
            statusCode: 200
        };
    }
    catch (error) {
    }
}
exports.main = main;
