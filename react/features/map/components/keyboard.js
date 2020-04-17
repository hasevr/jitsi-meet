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
    _handleKeyPress(event) {
        const pose: PoseTypes.Pose = {
            position: [ ...this.props.localPose.position ],
            rotation: this.props.localPose.rotation
        }

        switch (event.key) {

        // translate
        case 'ArrowUp':
            pose.position[1] -= 1
            break;
        case 'ArrowLeft':
            pose.position[0] -= 1
            break;
        case 's':
            pose.position[1] += 1
            break;
        case 'd':
            pose.position[0] += 1
            break;

            // rotate
        case '[':
            pose.rotation -= 1
            break;
        case ']':
            pose.rotation += 1
            break;

        default:
            break;
        }

        pose.rotation %= 360
        if (pose.rotation < 0) {
            pose.rotation = pose.rotation + 360
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
