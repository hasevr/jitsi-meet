// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import { StateListenerRegistry } from '../redux';
import { getCurrentConference } from '../conference';
import { FETCH_ALL_POSES_COMMAND, SET_LOCAL_POSE_COMMAND } from './middleware';

StateListenerRegistry.register(
    state => state['features/base/pose'].initState,
    _sendPosesCommand
);

StateListenerRegistry.register(
    state => state['features/base/pose'].localParticipant,
    _sendPosesCommand
);

function _sendPosesCommand(initPoseState, store) {
    const state = store.getState();
    const conference = getCurrentConference(state);

    if (initPoseState === 'fetching') {
        conference.sendCommand(FETCH_ALL_POSES_COMMAND,
            { attributes: {} }
        );
    }

    return;
}

function _sendLocalPoseCommand(local, store) {
    const state = store.getState();
    const conference = getCurrentConference(state);

    if (local !== undefined) {
        conference.sendCommand(SET_LOCAL_POSE_COMMAND,
            { attributes: local }
        );
    }

    return;
}
