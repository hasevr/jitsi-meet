// @flow
/* eslint-disable semi, require-jsdoc */

import { SET_MAP_VIEW } from './actionTypes';

export function setMapView(enabled: boolean) {
    return {
        type: SET_MAP_VIEW,
        enabled
    };
}
