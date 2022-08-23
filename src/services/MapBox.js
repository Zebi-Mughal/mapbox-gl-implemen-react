import axios from "axios"
const access_token = process.env.REACT_APP_MAPBOX_TOKEN

export const getCoordinates = async (address) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
                address
            )}.json?access_token=${access_token}`
        )

        return { success: true, data: response.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}

export const getRoute = async (start, end) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${access_token}`
        )

        return { success: true, data: response.data }
    } catch (err) {
        return { success: false, message: err.message }
    }
}
