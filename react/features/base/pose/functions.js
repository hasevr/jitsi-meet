// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import { getCurrentConference } from '../conference';
import type { Pose, Participant } from './actionTypes';
import { toState } from '../redux';

/**
 * Set pose of local participant.
 *
 * @param {Participant} participant - Target participant.
 * @param {Function} dispatch - A pure function of next to be dispatched.
 */
export function setParticipantPoseLib(participant: Participant, dispatch: Function) {
    // TODO
    const conference = getCurrentConference();

    dispatch();
}


export function getCurrentLocalPose(stateful: any) {
    const local = toState(stateful)['features/base/pose'].localParticipant;

    return local;
}
