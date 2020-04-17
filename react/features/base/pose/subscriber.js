// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import { StateListenerRegistry } from '../redux';
import { getCurrentConference } from '../conference';
import { FETCH_ALL_POSES_COMMAND, SET_LOCAL_POSE_COMMAND, UPDATE_POSE_COMMAND } from './middleware';

declare var audioUpdater: Object;
declare var viewUpdater: Object;


StateListenerRegistry.register(
    state => state['features/base/pose'].localParticipant,
    _sendUpdatePoseCommand
)

StateListenerRegistry.register(
    state => state['features/base/pose'].remoteParticipants,
    _updateAudioAndView
)

function _sendUpdatePoseCommand(local, store) {
    const state = store.getState();
    const conference = getCurrentConference(state);

    conference.sendCommand(
        UPDATE_POSE_COMMAND,
        { attributes: { participant: local } }
    );

    _updateAudioAndView(local, store);

    return;
}

function _updateAudioAndView(change, store) {
    const { localParticipant, remoteParticipants } = store.getState()['features/base/pose'];

    audioUpdater.update(localParticipant, remoteParticipants);
    viewUpdater.update(localParticipant, remoteParticipants);
}
