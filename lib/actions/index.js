'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.locate = exports.stop = undefined;

var _reduxActions = require('redux-actions');

var _constants = require('../constants');

var CONSTANTS = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var watcherId = null;

var getPosition = (0, _reduxActions.createAction)(CONSTANTS.GEOLOCATION_GET_POSITION);

var changePosition = (0, _reduxActions.createAction)(CONSTANTS.GEOLOCATION_POSITION_CHANGED);

var stopPayloadCreator = function stopPayloadCreator() {
    clearWatch();
};
var stop = exports.stop = (0, _reduxActions.createAction)(CONSTANTS.GEOLOCATION_WATCH_POSITION_STOPPED, stopPayloadCreator);

var locate = exports.locate = function locate() {
    var watch = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var positionOptions = arguments[1];
    return function (dispatch) {
        var _navigator = navigator;
        var geolocation = _navigator.geolocation;

        var onPositionResponse = function onPositionResponse(position) {
            return dispatch(changePosition(position));
        };
        var onPositionError = function onPositionError(error) {
            return dispatch(changePosition(createError(error)));
        };

        clearWatch();

        if (geolocation) {
            dispatch(getPosition());
            if (watch) {
                watcherId = geolocation.watchPosition(onPositionResponse, onPositionError, positionOptions);
            } else {
                geolocation.getCurrentPosition(onPositionResponse, onPositionError, positionOptions);
            }
        } else {
            var error = new Error({
                code: 0,
                message: 'Geolocation not supported.'
            });

            dispatch(getPosition(error));
        }
    };
};

function createError(error) {
    var code = error.code;
    var message = error.message;

    if (!message) {
        switch (code) {
            case 1:
                message = 'Permission denied';
            case 2:
                message = 'Position unavailable';
            case 3:
                message = 'Timeout';
            default:
                message = 'Error';
        }
    }

    return new Error({
        code: code,
        message: 'Geolocation error: ' + message + '.'
    });
}
function clearWatch() {
    var _navigator2 = navigator;
    var geolocation = _navigator2.geolocation;

    if (!geolocation || !geolocation.clearWatch || watcherId === null) {
        return;
    }

    geolocation.clearWatch(watcherId);
    watcherId = null;
}