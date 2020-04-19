// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import React, { Component } from 'react';
import { Map } from './map'
import { ParticipantController } from './keyboard'
import { connect } from '../../base/redux';
import { localPoseUpdated } from '../../base/pose';
import MapViewButton from './MapViewButton';

type Props = {
    terrain: PoseTypes.Terrain,
    remoteParticipants: PoseTypes.Participants,
    localParticipant: PoseTypes.Participant,
    conference: any,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void,
    updatePose: Function,
    dispatch: Function,
    hide: boolean
};

class InteractiveMap extends Component<Props> {
    _onUpdatePose: () => void;

    constructor(props: Props) {
        super(props);

        this._onUpdatePose = this._onUpdatePose.bind(this);
    }
    _onUpdatePose(newPose: PoseTypes.Pose) {
        const localParticipant: PoseTypes.Participant = Object.assign({}, this.props.localParticipant);

        localParticipant.pose = newPose;
        this.props.dispatch(localPoseUpdated(localParticipant));
        console.log('Local pose dispatched.');
    }

    render() {
        const {
            onLocalParticipantMove,
            updatePose,
            dispatch,
            hide,
            ...mapProps
        } = this.props;

        if (hide) {
            return <div />
        }

        return (
            <ParticipantController
                localPose = { this.props.localParticipant.pose }
                /* eslint-disable-next-line react/jsx-no-bind */
                onLocalParticipantMove = { this._onUpdatePose }>
                <Map { ...mapProps } />
            </ParticipantController>
        );
    }
}

function _mapStateToProps(state) {
    const { localParticipant, remoteParticipants, terrain } = state['features/base/pose'];
    const { mapViewEnabled } = state['features/map']

    return {
        terrain,
        localParticipant,
        remoteParticipants,
        hide: !mapViewEnabled
    };
}

// function _mapDispatchToProps(dispatch, ownProps) {
//     return {
//         updatePose: () => dispatch(localPoseUpdated(ownProps.localParticipant))
//     };
// }

export default connect(_mapStateToProps)(InteractiveMap);
