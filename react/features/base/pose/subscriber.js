// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import { StateListenerRegistry } from '../redux';
import { getCurrentConference } from '../conference';
import { FETCH_ALL_POSES_COMMAND, SET_LOCAL_POSE_COMMAND, UPDATE_POSE_COMMAND } from './middleware';
import { audioUpdater } from '../../../../modules/UI/pose_observer/AudioUpdater';
import { viewUpdater } from '../../../../modules/UI/pose_observer/ViewUpdater';


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

    if (conference) {
        console.log(local);

        conference.sendCommand(
            UPDATE_POSE_COMMAND,
            {
                attributes: {
                    id: local.id,
                    positionX: local.pose.position[0],
                    positionY: local.pose.position[1],
                    orientation: local.pose.orientation
                }
            }
        );

        _updateAudioAndView(local, store);
    }

    return;
}

function _updateAudioAndView(change, store) {
    const { localParticipant, remoteParticipants } = store.getState()['features/base/pose'];

    // audioUpdater.update(localParticipant, remoteParticipants);

    // viewUpdater.update(localParticipant, remoteParticipants);
}
