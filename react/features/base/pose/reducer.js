// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import {
    UPDATE_PARTICIPANT_POSE,
    SET_PARTICIPANT_POSE,
    GET_ALL_PARTICIPANT_POSES,
    LOCAL_POSE_UPDATED,
    REMOTE_POSE_UPDATED,
    REMOTE_POSE_DELETED
} from './actionTypes';
import { ReducerRegistry, set } from '../redux';
import type { Participant, Participants } from './actionTypes';

type PoseStates = 'NotReady' | 'Fetching' | 'Finished';

const DEFAULT_STATE = {
    /**
     * @public
     * @type {PoseStates}
     */
    initState: 'NotReady',

    /**
     * The participants which joined into current conference room.
     *
     * @public
     * @type {Participants}
     */
    remoteParticipants: {},

    /**
     * @public
     * @type {Participant}
     */
    localParticipant: {
        id: '',
        pose: {
            position: [ 0, 0 ],
            orientation: 0
        }
    },
    terrain: {
        width: 100,
        height: 100
    }
};

const STORE_NAME = 'features/base/pose';


ReducerRegistry.register(STORE_NAME, (state: Object = DEFAULT_STATE, action) => {
    switch (action.type) {

    // case GET_ALL_PARTICIPANT_POSES:
    //     return {
    //         ...state,
    //         initState: 'Fetching'
    //     };
    // case UPDATE_PARTICIPANT_POSE:
    //     newState.participants[targetParticipant.id] = targetParticipant;

    //     return {
    //         ...state,
    //         participants: newState.participants
    //     };
    // case SET_PARTICIPANT_POSE:
    //     newState.localParticipant = targetParticipant;

    //     return {
    //         ...state,
    //         participants: newState.participants,
    //         localParticipant: targetParticipant
    //     };
    case LOCAL_POSE_UPDATED: {
        const targetParticipant: Participant = action.participant;
        const newState = Object.assign({}, state);

        newState.localParticipant = targetParticipant;

        return {
            ...state,
            localParticipant: newState.localParticipant
        };
    }
    case REMOTE_POSE_UPDATED: {
        const targetParticipant: Participant = action.participant;
        const newState = Object.assign({}, state);

        if (targetParticipant.id === newState.localParticipant.id) {
            break;
        }

        const newRemoteParticipants = Object.assign(
            {},
            newState.remoteParticipants,
            { [targetParticipant.id]: targetParticipant }
        );

        return {
            ...state,
            remoteParticipants: newRemoteParticipants
        };
    }
    case REMOTE_POSE_DELETED: {
        const targetId = action.remoteId;

        if (targetId === state.localParticipant.id) {
            break;
        }

        const newRemoteParticipants = { ...state.remoteParticipants };

        delete newRemoteParticipants[targetId];

        return set(state, 'remoteParticipants', newRemoteParticipants);
    }
    }

    return state;
});
