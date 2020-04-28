// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, max-len */

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

export function isOnStage(point: {x: number, y: number}, rect: {center: {x: number, y: number}, width: number, height: number}) {
    const x1 = rect.center.x - (rect.width / 2);
    const x2 = rect.center.x + (rect.width / 2);
    const y1 = rect.center.y - (rect.height / 2);
    const y2 = rect.center.y + (rect.height / 2);

    return point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2;
}
