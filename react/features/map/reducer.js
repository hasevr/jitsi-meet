// @flow

import { ReducerRegistry, set } from '../base/redux';
import { PersistenceRegistry } from '../base/storage';

import {
    SET_MAP_VIEW, UPDATE_AUDIO_LEVEL
} from './actionTypes';

const DEFAULT_STATE = {
    mapViewEnabled: true,
    audioLevelCollection: {}
};

const STORE_NAME = 'features/map';

PersistenceRegistry.register(STORE_NAME, {
    mapViewEnabled: true
});

ReducerRegistry.register(STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case SET_MAP_VIEW: {
        return {
            ...state,
            mapViewEnabled: action.enabled
        };
    }
    case UPDATE_AUDIO_LEVEL: {
        let newAudioLevelCollection = { ...state.audioLevelCollection };

        if (newAudioLevelCollection === undefined) {
            newAudioLevelCollection = {};
        }

        newAudioLevelCollection[action.id] = action.level;
        console.log(`ID[${action.id}] - AudioLv = ${action.level}`);

        return set(state, 'audioLevelCollection', newAudioLevelCollection);
    }
    }

    return state;
});
