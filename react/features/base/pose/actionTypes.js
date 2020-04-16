// @flow

export type Pose = {
    position: [number, number],
    orientation: number
}

export type Participant = {
    id: number,
    pose: Pose
}

export type Participants = {
    [key: number]: Participant
}

export type Terrain = {
    width: number,
    height: number
}

export type Conference = {
    id: number,
    participants: Participants,
    terrain: Terrain
}

/**
 * This action dispatched when local user is trying to fetch all participant
 * poses.
 * @type {string}
 *
 * {
 *     type: GET_ALL_PARTICIPANT_POSES
 * }
 */
export const GET_ALL_PARTICIPANT_POSES = 'GET_ALL_PARTICIPANT_POSES';

/**
 * This action dispatched when a remote participant pose is changed.
 * @type {string}
 *
 * {
 *     type: UPDATE_PARTICIPANT_POSE,
 *     participant: Participant
 * }
 */
export const UPDATE_PARTICIPANT_POSE = 'UPDATE_PARTICIPANT_POSE';

/**
 * This action dispatched when a new local participant pose is being set.
 * @type {string}
 *
 * {
 *     type: SET_PARTICIPANT_POSE,
 *     participant: Participant
 * }
 */
export const SET_PARTICIPANT_POSE = 'SET_PARTICIPANT_POSE';

export const POSE_INIT_FINISHED = 'POSE_INIT_FINISHED';
