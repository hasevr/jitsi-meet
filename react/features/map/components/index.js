// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import React from 'react';
import { Map } from './map'
import { ParticipantController } from './keyboard'

type Props = {
    terrain: PoseTypes.Terrain,
    remoteParticipants: PoseTypes.Participants,
    localParticipant: PoseTypes.Participant,
    conference: any,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void
}

export default function InteractiveMap(props: Props) {
    const {
        onLocalParticipantMove,
        ...mapProps
    } = props


    return (
        <ParticipantController
            localPose = { props.localParticipant.pose }
            onLocalParticipantMove = { props.onLocalParticipantMove }>
            <Map { ...mapProps } />
        </ParticipantController>
    )
}
