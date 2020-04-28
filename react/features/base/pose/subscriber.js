// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import { StateListenerRegistry } from '../redux';
import { getCurrentConference } from '../conference';
import { UPDATE_POSE_COMMAND } from './middleware';
import { audioUpdater } from '../../../../modules/UI/pose_observer/AudioUpdater';
import { viewUpdater } from '../../../../modules/UI/pose_observer/ViewUpdater';
import { isOnStage } from './functions';
import type { Stage } from './actionTypes';
import { setLocalStageStatus } from './actions';


StateListenerRegistry.register(
    state => state['features/base/pose'].localParticipant,
    _sendUpdatePoseCommand
)

StateListenerRegistry.register(
    state => state['features/base/pose'].remoteParticipants,
    _updateAudioAndView
)

// StateListenerRegistry.register(
//     state => state['features/base/pose'].stage,
//     _setLocalParticipantStageStatus
// )

function _sendUpdatePoseCommand(local, store) {
    const state = store.getState();
    const conference = getCurrentConference(state);

    if (conference) {
        // console.log(local);

        conference.sendCommand(
            UPDATE_POSE_COMMAND,
            {
                attributes: {
                    id: local.id,
                    positionX: local.pose.position[0],
                    positionY: local.pose.position[1],
                    orientation: local.pose.orientation,
                    isOnStage: local.isOnStage
                }
            }
        );

        _updateAudioAndView(local, store);

        // _setLocalParticipantStageStatus()
    }

    return;
}

function _updateAudioAndView(change, store) {
    const { localParticipant, remoteParticipants } = store.getState()['features/base/pose'];

    // audioUpdater.update(localParticipant, remoteParticipants);

    // viewUpdater.update(localParticipant, remoteParticipants);
}

function _setLocalParticipantStageStatus(stage: Stage, store) {
    const { position } = store.getState()['features/base/pose'].localParticipant.pose;
    const currPosition = { x: position[0],
        y: position[1] };
    const result = isOnStage(currPosition, stage);

    console.log(`Update stage: ${result ? 'true' : 'false'}`);

    store.dispatch(setLocalStageStatus(result));
}
