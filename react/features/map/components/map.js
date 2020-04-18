// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import React, { Components } from 'react';
import * as PoseTypes from '../../../../modules/pose/types';
import { Provider } from 'react-redux';

import { Avatar } from '../../base/avatar';

const PARTICIPANT_RADIUS = 0.5

declare var APP: Object

type Props = {
    terrain: PoseTypes.Terrain,
    remoteParticipants: PoseTypes.Participants,
    localParticipant: PoseTypes.Participant,
    conference: any
}

/**
 * Map for showing:
 * 1. Terrain of the conference hall
 * 2. Pose of every participants.
 */
export function Map(props: Props) {
    return (
        <svg
            viewBox = { `0 0 ${props.terrain.width} ${props.terrain.height}` }
            xmlns = 'http://www.w3.org/2000/svg'>
            {Object.values(props.remoteParticipants).map(remoteParticipants => Participant({
                participant: remoteParticipants,
                color: 'blue'
            }))}
            {Participant({
                participant: props.localParticipant,
                color: 'red'
            })}
        </svg>
    )
}

type ParticipantProps = {
    participant: PoseTypes.Participant,
    color: 'blue' | 'red'
}
function Participant(props: ParticipantProps) {
    const center = [
        props.participant.pose.position[0],
        props.participant.pose.position[1]
    ]
    const triangleDegree = 30
    const triangleRadian = triangleDegree * Math.PI / 180
    const trianglePoints = [
        [ 2 - Math.cos(triangleRadian), 2 - Math.sin(triangleRadian) ],
        [ 2, 2 - (1 / Math.sin(triangleRadian)) ],
        [ 2 + Math.cos(triangleRadian), 2 - Math.sin(triangleRadian) ]
    ]


    return (
        <g
            key = { props.participant.id }
            transform = { `rotate(${props.participant.pose.orientation},${center[0]},${center[1]})` }>
            <svg
                height = { `${4 * PARTICIPANT_RADIUS}` }
                viewBox = '0 0 4 4'
                width = { `${4 * PARTICIPANT_RADIUS}` }
                x = { `${center[0] - (2 * PARTICIPANT_RADIUS)}` }
                y = { `${center[1] - (2 * PARTICIPANT_RADIUS)}` }>
                <circle
                    cx = '2'
                    cy = '2'
                    fill = { props.color }
                    r = '1' />
                <polygon
                    fill = { props.color }
                    points = { trianglePoints.map(point => `${point[0]},${point[1]}`).join(' ') } />
            </svg>
        </g>
    )
}

type AvatarObjectProps = {
    participant: PoseTypes.Participant
}
function AvatarObject(props: AvatarObjectProps) {
    return (
        <foreignObject
            height = { `${PARTICIPANT_RADIUS * 2}` }
            width = { `${PARTICIPANT_RADIUS * 2}` }
            x = { `${-PARTICIPANT_RADIUS}` }
            y = { `${-PARTICIPANT_RADIUS}` } >
            <Provider store = { APP.store }>
                <Avatar
                    className = 'userAvatar'
                    participantId = { props.participant.id } />
            </Provider>
        </foreignObject>
    )
}
