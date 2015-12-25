import { createAction } from 'redux-actions'
import * as CONSTANTS from '../constants'

let watcherId = null

const getPosition = createAction(CONSTANTS.GEOLOCATION_GET_POSITION)

const changePosition = createAction(CONSTANTS.GEOLOCATION_POSITION_CHANGED)

const stopPayloadCreator = () => {clearWatch()}
export const stop = createAction(CONSTANTS.GEOLOCATION_WATCH_POSITION_STOPPED, stopPayloadCreator)

export const locate = (watch = false, positionOptions) => dispatch => {
    const { geolocation } = navigator
    const onPositionResponse = position => dispatch(changePosition(position))
    const onPositionError = error => dispatch(changePosition(createError(error)))

    clearWatch()

    if (geolocation) {
        dispatch(getPosition())
        if (watch) {
            watcherId = geolocation.watchPosition(onPositionResponse, onPositionError, positionOptions)
        } else {
            geolocation.getCurrentPosition(onPositionResponse, onPositionError, positionOptions)
        }
    } else {
        const error = new Error({
            code: 0,
            message: 'Geolocation not supported.',
        })

        dispatch(getPosition(error))
    }
}

function createError(error) {
    const { code } = error
    let { message } = error

    if (!message) {
        switch (code) {
            case 1:
                message = 'Permission denied'
            case 2:
                message = 'Position unavailable'
            case 3:
                message = 'Timeout'
            default:
                message = 'Error'
        }
    }

    return new Error({
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
