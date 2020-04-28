// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import {
    setParticipantPose,
    updateParticipantPose,
    getAllParticipantPoses,
    notifyPoseInitFinished,
    remotePoseUpdated,
    localPoseUpdated,
    requestLocalPose,
    remotePoseDeleted,
    updateLocalId,
    setLocalStageStatus
} from './actions';
import {
    SET_PARTICIPANT_POSE,
    UPDATE_PARTICIPANT_POSE,
    LOCAL_POSE_UPDATED,
    POSE_INIT_FINISHED,
    REQUEST_LOCAL_POSE
} from './actionTypes';
import type { Pose } from './actionTypes';
import { MiddlewareRegistry } from '../redux';

import { CONFERENCE_JOINED, getCurrentConference } from '../conference';
import { PARTICIPANT_JOINED, getLocalParticipant, PARTICIPANT_LEFT, PARTICIPANT_ID_CHANGED } from '../participants';
import { getCurrentLocalPose } from './functions';
import { isOnStage } from '../../map/components/Stage';

export const UPDATE_POSE_COMMAND = 'update_pose';
export const POSE_REQUEST_COMMAND = 'pose_request';


type JitsiConference = {
    addCommandListener: (string, Function) => void,
    sendCommand: (string, Object) => void
};
type CommandValues = {
    value: any,
    attributes: Map<any>,
    children: Array<Object>
};

/**
 * Middleware that captures SET_PARTICIPANT_POSE and UPDATE_PARTICIPANT_POSE
 * actions.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case CONFERENCE_JOINED: {

        // Initilize participant information when local participant joined a conference.
        // const { conference }: { conference: JitsiConference } = store.getState()['features/base/conference'];
        const conference = getCurrentConference(store);

        console.log(`Conference: ${conference}`);

        // Setup pose-related command.
        conference.addCommandListener(
            UPDATE_POSE_COMMAND,
            values => {
                const attributes = values.attributes;

                _onRemotePoseUpdated(attributes, store);
            }
        );
        conference.addCommandListener(
            POSE_REQUEST_COMMAND,
            () => {
                store.dispatch(requestLocalPose());
            }
        )


        // Get all participant poses.
        // store.dispatch(getAllParticipantPoses());

        // Notify that pose feature is initialized.
        // store.dispatch(notifyPoseInitFinished());

        break;
    }
    case PARTICIPANT_ID_CHANGED: {
        console.log(`Local Participant ID: ${action.newValue}`);
        store.dispatch(updateLocalId(action.newValue));
        break;
    }

    case PARTICIPANT_JOINED: {
        // FIXME: If there is not a conference room, the local participant will not have any unique id.
        // FIXME: conference may not exist when local participant left room.
        const conference = getCurrentConference(store.getState());

        /**
         * @type {import('../participants/reducer').Participant}
         */
        const participant = action.participant;

        if (participant.local) {
            store.dispatch(
                localPoseUpdated(
                    {
                        id: 'local',
                        pose: {
                            position: [ 0, 0 ],
                            orientation: 0
                        },
                        isOnStage: false
                    }
                )
            );
        } else {
            store.dispatch(
                remotePoseUpdated(
                    {
                        id: participant.id,
                        pose: {
                            position: [ 0, 0 ],
                            orientation: 0
                        },
                        isOnStage: false
                    }
                )
            );

            if (conference) {
                conference.sendCommandOnce(
                    POSE_REQUEST_COMMAND,
                    { attributes: {} }
                )
            }
        }


        break;
    }
    case PARTICIPANT_LEFT: {
        const remote = action.participant;

        store.dispatch(remotePoseDeleted(remote.id));
        break;
    }
    case REQUEST_LOCAL_POSE: {
        const conference = getCurrentConference(store.getState());
        const localPose = getCurrentLocalPose(store.getState());
        const localParticipant = getLocalParticipant(store.getState());

        localPose.id = localParticipant.id;

        conference.sendCommandOnce(
            UPDATE_POSE_COMMAND,
            {
                attributes: {
                    id: localPose.id,
                    positionX: localPose.pose.position[0],
                    positionY: localPose.pose.position[1],
                    orientation: localPose.pose.orientation,
                    isOnStage: localPose.isOnStage
                }
            }
        );

        break;
    }

    // case LOCAL_POSE_UPDATED: {
    //     const { stage } = store.getState()['features/base/pose'];
    //     const newLocal = action.participant;
    //     const result = isOnStage({x: newLocal.pose.position[0], y: newLocal.pose.position[1]}, stage);

    //     console.log(`Update stage: ${result? 'true' : 'false'}`);

    //     store.dispatch(setLocalStageStatus(result));
    //     break;
    // }

        // case SET_PARTICIPANT_POSE:
            // Set local participant to a new pose.

        //     break;
        // case UPDATE_PARTICIPANT_POSE:
        //     break;
    }


    return next(action);
});

function _onRemotePoseUpdated(attributes, store) {
    // FIXME: all attribute values are string.
    const remote = {
        id: attributes.id,
        pose: {
            position: [ parseFloat(attributes.positionX), parseFloat(attributes.positionY) ],
            orientation: parseFloat(attributes.orientation)
        },
        isOnStage: attributes.isOnStage === 'true'
    };

    store.dispatch(remotePoseUpdated(remote));
}