// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import {
    GET_ALL_PARTICIPANT_POSES,
    UPDATE_PARTICIPANT_POSE,
    SET_PARTICIPANT_POSE,
    POSE_INIT_FINISHED
} from './actionTypes';
import type { Participant } from './actionTypes';
import { SET_LOCAL_POSE_COMMAND } from './middleware';


/**
 * Fetch all participant poses from other participants.
 *
 * @returns {{
 *     type: GET_ALL_PARTICIPANT_POSES
 * }}
 */
export function getAllParticipantPoses() {
    return {
        type: GET_ALL_PARTICIPANT_POSES
    };
}

/**
 * Update a remote participant pose.
 *
 * @param {Participant} participant - A remote participant payload which
 * includes the latest pose.
 * @returns {{
 *      type: UPDATE_PARTICIPANT_POSE
 *      participant: Participant
 * }}
 */
export function updateParticipantPose(participant: Participant) {
    return {
        type: UPDATE_PARTICIPANT_POSE,
        participant
    };
}

// /**
//  *
//  * @param {Participant} participant - target participant
//  * @returns {Function}
//  */
// export function setParticipantPose(participant: Participant) {
//     return (dispatch: Function) => {
//         return setParticipantPoseLib(participant, dispatch);
//     };
// }

export function setParticipantPose(participant: Participant) {
    return {
        type: SET_PARTICIPANT_POSE,
        participant
    };
}

export function notifyPoseInitFinished() {
    return {
        type: POSE_INIT_FINISHED
    };
}
