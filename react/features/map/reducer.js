// @flow

import { ReducerRegistry } from '../base/redux';
import { PersistenceRegistry } from '../base/storage';

import {
    SET_MAP_VIEW
} from './actionTypes';

const DEFAULT_STATE = {
    mapViewEnabled: true
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
    }

    return state;
});
