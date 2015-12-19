import { createAction } from 'redux-actions'
import isGeolocationSupported from '../utils/IsGeolocationSupported'

let watcherId = null

export const GEOLOCATION_GET_POSITION = 'GEOLOCATION_GET_POSITION'
export const GEOLOCATION_POSITION_CHANGED = 'GEOLOCATION_POSITION_CHANGED'
export const GEOLOCATION_WATCH_POSITION_STOPPED = 'GEOLOCATION_WATCH_POSITION_STOPPED'

const locateActionCreator = (watch = false, positionOptions) => {
    if (!isGeolocationSupported) {
        return new Error({
            code: 0,
            message: 'Geolocation not supported.',
        })
    }

    const { geolocation } = navigator

    if (watch) {
        watcherId = geolocation.watchPosition(onResponse, onError, positionOptions)
    } else {
        geolocation.getCurrentPosition(resolve, reject, positionOptions)
    }
}
const stopActionCreator = () => {

}

export const locate = createAction(GEOLOCATION_GET_POSITION, locateActionCreator)
export const stop = createAction(GEOLOCATION_WATCH_POSITION_STOPPED, stopActionCreator)

function onResponse(position) {
    const lat = position.coords.latitude,
        lng = position.coords.longitude,
        latlng = new L.LatLng(lat, lng),
        bounds = latlng.toBounds(position.coords.accuracy),
        options = this._locateOptions

    const data = {
        latlng: latlng,
        bounds: bounds,
        timestamp: position.timestamp
    }

    for (const i in position.coords) {
        if (typeof position.coords[i] === 'number') {
            data[i] = position.coords[i]
        }
    }

    this.fire('locationfound', data)
}

function onError(error) {
    const { code, message } = error;


    message = error.message ||
    (c === 1 ? 'permission denied' :
    (c === 2 ? 'position unavailable' : 'timeout'))

    this.fire('locationerror', {
        code,
        message: `Geolocation error: ${message}.`
    })
}
function clearWatch() {
    const { geolocation } = navigator

    if (!geolocation || !geolocation.clearWatch || watcherId === null) {
        return
    }

    geolocation.clearWatch(watcherId)
    watcherId = null
}
