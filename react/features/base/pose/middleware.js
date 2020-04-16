// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import {
    setParticipantPose,
    updateParticipantPose,
    getAllParticipantPoses,
    notifyPoseInitFinished
} from './actions';
import { SET_PARTICIPANT_POSE, UPDATE_PARTICIPANT_POSE } from './actionTypes';
import type { Pose, Participant } from './actionTypes';
import { MiddlewareRegistry } from '../redux';

import { CONFERENCE_JOINED } from '../conference';

export const SET_LOCAL_POSE_COMMAND = 'set_local_pose';
export const FETCH_ALL_POSES_COMMAND = 'fetch_all_poses';


type JitsiConference = {
    addCommandListener: (string, Function) => void,
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
        const { conference }: { conference: JitsiConference } = store.getState()['features/base/conference'];

        // Setup pose-related command.
        conference.addCommandListener(
                SET_LOCAL_POSE_COMMAND,
                ({ attributes }: { attributes: { participant: Participant } }) => {
                    store.dispatch(updateParticipantPose(attributes.participant));
                }
        );
        conference.addCommandListener(
                FETCH_ALL_POSES_COMMAND,
                ({ attributes }) => {
                    store.dispatch(setParticipantPose(attributes.participant));
                }
        );

        // Get all participant poses.
        store.dispatch(getAllParticipantPoses());

        // Notify that pose feature is initialized.
        store.dispatch(notifyPoseInitFinished());

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
