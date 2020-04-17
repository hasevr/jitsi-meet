// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import React from 'react';
import { Map } from './map'
import { ParticipantController } from './keyboard'
import { connect } from '../../base/redux';

type Props = {
    terrain: PoseTypes.Terrain,
    remoteParticipants: PoseTypes.Participants,
    localParticipant: PoseTypes.Participant,
    conference: any,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void
}

function InteractiveMap(props: Props) {
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

function _mapStateToProps(state) {
    const { localParticipant, remoteParticipants, terrain } = state['features/base/pose'];

    return {
        terrain,
        localParticipant,
        remoteParticipants
    };
}

export default connect(_mapStateToProps)(InteractiveMap);
