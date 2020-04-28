// @flow
/* eslint-disable semi, require-jsdoc */

import { SET_MAP_VIEW, UPDATE_AUDIO_LEVEL } from './actionTypes';

export function setMapView(enabled: boolean) {
    return {
        type: SET_MAP_VIEW,
        enabled
    };
}

export function updateAudioLevel(id: string, level: number) {
    return {
        type: UPDATE_AUDIO_LEVEL,
        id,
        level
    }
}
