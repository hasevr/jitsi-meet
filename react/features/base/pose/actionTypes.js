// @flow

export type Pose = {
    position: [number, number],
    orientation: number
}

export type Participant = {
    id: string,
    pose: Pose
}

export type Participants = {
    [key: string]: Participant
}

export type Terrain = {
    width: number,
    height: number
}

export type Conference = {
    id: string,
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


/**
 * This action dispatched when all participant poses in current conference is initialized.
 */
export const POSE_INIT_FINISHED = 'POSE_INIT_FINISHED';


export const LOCAL_POSE_UPDATED = 'LOCAL_POSE_UPDATED';

export const REMOTE_POSE_UPDATED = 'REMOTE_POSE_UPDATED';

export const REMOTE_POSE_DELETED = 'REMOTE_POSE_DELETED';

export const REQUEST_LOCAL_POSE = 'REQUEST_LOCAL_POSE';

export const UPDATE_LOCAL_ID = 'UPDATE_LOCAL_ID';
