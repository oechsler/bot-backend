import axios from "axios";

interface GetStatusForCountryInput {
    country: string;
}

interface Response {
    body: any;
    statusCode: number;
}

interface Travelwarning {
    countryCode: string;
    countryName: string;
    effective: number;
    iso3CountryCode: string;
    lastModified: number;
    partialWarning: boolean;
    situationPartWarning: boolean;
    situationWarning: boolean;
    title: string;
    warning: boolean;
}

export async function main(input: GetStatusForCountryInput): Promise<Response> {
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
        const response = await axios.get(travelwarningRoute);

        const travelwarnings: [Travelwarning] = response.data.response;
        const travelwarningsAsArray = Object.values(travelwarnings);

        const travelwarningForCountry = travelwarningsAsArray
            .filter((travelwarning: Travelwarning) => travelwarning.countryCode === input.country)
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
    } catch (error) {

    }
}