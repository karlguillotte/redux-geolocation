import { handleAction } from 'redux-actions'
import * as CONSTANTS from '../constants'

export default handleAction(CONSTANTS.GEOLOCATION_POSITION_CHANGED)
