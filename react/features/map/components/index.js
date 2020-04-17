// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import React from 'react';
import { Map } from './map'
import { ParticipantController } from './keyboard'
import { connect } from '../../base/redux';
import { localPoseUpdated } from '../../base/pose';

type Props = {
    terrain: PoseTypes.Terrain,
    remoteParticipants: PoseTypes.Participants,
    localParticipant: PoseTypes.Participant,
    conference: any,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void,
    updatePose: Function
}

function InteractiveMap(props: Props) {
    const {
        onLocalParticipantMove,
        ...mapProps
    } = props

    return (
        <ParticipantController
            localPose = { props.localParticipant.pose }
            /* eslint-disable-next-line react/jsx-no-bind */
            onLocalParticipantMove = { this.props.updatePose.bind(this) }>
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

function _mapDispatchToProps(dispatch, ownProps) {
    return {
        updatePose: () => dispatch(localPoseUpdated(ownProps.localParticipant))
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(InteractiveMap);
