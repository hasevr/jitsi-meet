// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react-native/no-inline-styles, max-len */

import React, { Components } from 'react';
import * as PoseTypes from '../../../../modules/pose/types';
import { Provider } from 'react-redux';

import { Avatar } from '../../base/avatar';

const PARTICIPANT_RADIUS = 2.5

declare var APP: Object

type Props = {
    terrain: PoseTypes.Terrain,
    remoteParticipants: PoseTypes.Participants,
    localParticipant: PoseTypes.Participant,
    conference: any,
    firstPersonView: boolean
}

/**
 * Map for showing:
 * 1. Terrain of the conference hall
 * 2. Pose of every participants.
 */
export function Map(props: Props) {
    const background = (<rect
        height = { `${props.terrain.height}` }
        style = {{ fill: 'rgba(0,0,0,0.5)' }}
        width = { `${props.terrain.width}` }
        x = '0'
        y = '0' />)
    const remote = Object.values(props.remoteParticipants).map(remoteParticipants => Participant({
        participant: remoteParticipants,
        color: 'blue'
    }))
    const local = Participant({
        participant: props.localParticipant,
        color: 'red'
    })
    const map = [ background, remote, local ]

    const translate = `translate(${(props.terrain.width / 2) - props.localParticipant.pose.position[0]},${(props.terrain.height / 2) - props.localParticipant.pose.position[1]})`
    const rotate = `rotate(${-props.localParticipant.pose.orientation},${props.localParticipant.pose.position[0]},${props.localParticipant.pose.position[1]})`

    return (
        <svg
            height = '100%'
            viewBox = { `0 0 ${props.terrain.width} ${props.terrain.height}` }
            width = '100%'
            xmlns = 'http://www.w3.org/2000/svg'>
            {props.firstPersonView ? <g transform = { `${translate} ${rotate}` } >{map}</g> : map }
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
                <polygon
                    fill = { props.color }
                    points = { trianglePoints.map(point => `${point[0]},${point[1]}`).join(' ') } />
                <circle
                    cx = '2'
                    cy = '2'
                    fill = 'black'
                    r = '1' />
                <AvatarObject
                    participant = { props.participant }
                    radius = { 1 }
                    x = { 1 }
                    y = { 1 } />
            </svg>
        </g>
    )
}

type AvatarObjectProps = {
    participant: PoseTypes.Participant,
    x: number,
    y: number,
    radius: number
}
function AvatarObject(props: AvatarObjectProps) {
    return (
        <foreignObject
            height = { `${props.radius * 2}` }
            width = { `${props.radius * 2}` }
            x = { `${props.x}` }
            y = { `${props.y}` } >
            <Provider store = { APP.store }>
                <Avatar
                    className = 'userAvatar'
                    participantId = { props.participant.id } />
            </Provider>
        </foreignObject>
    )
}
