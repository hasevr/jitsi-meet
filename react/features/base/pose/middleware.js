// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import {
    setParticipantPose,
    updateParticipantPose,
    getAllParticipantPoses,
    notifyPoseInitFinished,
    remotePoseUpdated,
    localPoseUpdated,
    requestLocalPose
} from './actions';
import {
    SET_PARTICIPANT_POSE,
    UPDATE_PARTICIPANT_POSE,
    LOCAL_POSE_UPDATED,
    POSE_INIT_FINISHED,
    REQUEST_LOCAL_POSE
} from './actionTypes';
import type { Pose, Participant } from './actionTypes';
import { MiddlewareRegistry } from '../redux';

import { CONFERENCE_JOINED, getCurrentConference } from '../conference';
import { PARTICIPANT_JOINED } from '../participants';
import { getCurrentLocalPose } from './functions';

export const SET_LOCAL_POSE_COMMAND = 'set_local_pose';
export const FETCH_ALL_POSES_COMMAND = 'fetch_all_poses';

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

                _onPoseUpdated(attributes, store);
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
    case PARTICIPANT_JOINED: {
        // FIXME: conference may not exist when local participant left room.
        const conference = getCurrentConference(store.getState());

        if (conference) {
            conference.sendCommandOnce(
                POSE_REQUEST_COMMAND,
                { attributes: {} }
            )
        }

        break;
    }
    case REQUEST_LOCAL_POSE: {
        const conference = getCurrentConference(store.getState());
        const local = getCurrentLocalPose(store.getState());

        console.log(local);
        conference.sendCommandOnce(
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

        break;
    }

        // case SET_PARTICIPANT_POSE:
            // Set local participant to a new pose.

        //     break;
        // case UPDATE_PARTICIPANT_POSE:
        //     break;
    }


    return next(action);
});

function _onPoseUpdated(attributes, store) {
    // FIXME: all attribute values are string.
    const local = {
        id: attributes.id,
        pose: {
            position: [ attributes.positionX, attributes.positionY ],
            orientation: attributes.orientation
        }
    };

    store.dispatch(remotePoseUpdated(local));
}
