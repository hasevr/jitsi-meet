// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react/prop-types */

import { Component } from 'react';
import * as PoseTypes from '../../../../modules/pose/types';

const MOVE_LENGTH = 1
const ROTATE_DEGREE = 1

type Props = {
    localPose: PoseTypes.Pose,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void,
    isValidPose(pose: PoseTypes.Pose): boolean,
    firstPersonView: boolean
}

export class ParticipantController extends Component<Props> {
    constructor(props: Props) {
        super(props)

        this._handleKeyPress = this._handleKeyPress.bind(this)
    }
    _handleKeyPress(event) {
        const pose: PoseTypes.Pose = {
            position: [ ...this.props.localPose.position ],
            orientation: this.props.localPose.orientation
        }

        let offset = [ 0, 0 ]

        switch (event.key) {

        // translate
        case 'ArrowUp':
            offset[1] -= MOVE_LENGTH
            break;
        case 'ArrowLeft':
            offset[0] -= MOVE_LENGTH
            break;
        case 'ArrowDown':
            offset[1] += MOVE_LENGTH
            break;
        case 'ArrowRight':
            offset[0] += MOVE_LENGTH
            break;

            // rotate
        case '[':
            pose.orientation -= ROTATE_DEGREE
            break;
        case ']':
            pose.orientation += ROTATE_DEGREE
            break;

        default:
            break;
        }

        if (this.props.firstPersonView) {
            const radian = pose.orientation * Math.PI / 180

            offset = [
                (offset[0] * Math.cos(radian)) - (offset[1] * Math.sin(radian)),
                (offset[1] * Math.cos(radian)) + (offset[0] * Math.sin(radian))
            ]
        }
        pose.position[0] += offset[0]
        pose.position[1] += offset[1]

        pose.orientation %= 360
        if (pose.orientation < 0) {
            pose.orientation = pose.orientation + 360
        }

        if (!this.props.isValidPose(pose)) {
            return
        }

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
