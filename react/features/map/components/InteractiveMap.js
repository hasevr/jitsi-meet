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
    hide: boolean,
    firstPersonView: boolean
};

class InteractiveMap extends Component<Props> {
    _onUpdatePose: () => void;

    constructor(props: Props) {
        super(props);

        this._onUpdatePose = this._onUpdatePose.bind(this);
        this._isValidPose = this._isValidPose.bind(this);
    }
    _onUpdatePose(newPose: PoseTypes.Pose) {
        const localParticipant: PoseTypes.Participant = Object.assign({}, this.props.localParticipant);

        localParticipant.pose = newPose;
        this.props.dispatch(localPoseUpdated(localParticipant));
    }
    _isValidPose(pose: PoseTypes.Pose) {
        if (pose.position[0] < 0 || pose.position[0] > this.props.terrain.width) {
            return false;
        }
        if (pose.position[1] < 0 || pose.position[1] > this.props.terrain.height) {
            return false;
        }

        return true;
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
                firstPersonView = { this.props.firstPersonView }
                /* eslint-disable-next-line react/jsx-no-bind */
                isValidPose = { this._isValidPose }
                localPose = { this.props.localParticipant.pose }
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
