// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react/prop-types */

import { Component } from 'react';
import * as PoseTypes from '../../../../modules/pose/types';

type Props = {
    localPose: PoseTypes.Pose,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void
}

export class ParticipantController extends Component<Props> {
    constructor(props: Props) {
        super(props)

        this._handleKeyPress = this._handleKeyPress.bind(this)
    }
    componentDidUpdate() {
        console.log('update', this.props.localPose.position)
    }
    _handleKeyPress(event) {
        console.log(this.props.localPose.position)
        const pose: PoseTypes.Pose = {
            position: [ ...this.props.localPose.position ],
            orientation: this.props.localPose.orientation
        }

        console.log(event.key)
        console.log(pose.position)

        switch (event.key) {

        // translate
        case 'ArrowUp':
            pose.position[1] -= 1
            break;
        case 'ArrowLeft':
            pose.position[0] -= 1
            break;
        case 'ArrowDown':
            pose.position[1] += 1
            break;
        case 'ArrowRight':
            pose.position[0] += 1
            break;

            // rotate
        case '[':
            pose.orientation -= 1
            break;
        case ']':
            pose.orientation += 1
            break;

        default:
            break;
        }

        pose.orientation %= 360
        if (pose.orientation < 0) {
            pose.orientation = pose.orientation + 360
        }

        console.log(pose.position)

        this.props.onLocalParticipantMove(pose)
    }
    componentDidMount() {
        document.addEventListener('keydown', this._handleKeyPress)
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this._handleKeyPress)
    }
    render() {
        return this.props.children
    }
}
