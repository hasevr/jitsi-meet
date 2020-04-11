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
    participants: PoseTypes.Participants,
    conference: any,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void
}

/**
 * Map for showing:
 * 1. Terrain of the conference hall
 * 2. Pose of every participants.
 */
export function Map(props: Props) {
    return (
        <div className = 'App'>
            <svg
                viewBox = { `0 0 ${props.terrain.width} ${props.terrain.height}` }
                xmlns = 'http://www.w3.org/2000/svg'>
                {Object.values(props.participants).map(participant => Participant({
                    participant
                }))}
            </svg>
        </div>
    )
}

type ParticipantProps = {
    participant: PoseTypes.Participant
}
function Participant(props: ParticipantProps) {
    return (
        <svg
            cx = { `${props.participant.pose.position[0]}` }
            cy = { `${props.participant.pose.position[1]}` }>
            <circle
                cx = '0'
                cy = '0'
                r = { `${PARTICIPANT_RADIUS}` } />
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
        </svg>
    )
}
