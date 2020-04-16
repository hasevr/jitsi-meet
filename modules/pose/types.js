// @flow

export type Pose = {
    position: [number, number],
    orientation: number
}

export type Participant = {
    id: number,
    pose: ParticipantPose
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
