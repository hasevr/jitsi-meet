// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react-native/no-inline-styles, max-len,
react/jsx-sort-props */

import React, { Component } from 'react';
import { connect } from '../../base/redux';
import { setStage } from '../../base/pose';

type Props = {
    height: number,
    width: number,
    center: {
        x: number,
        y: number
    },
    _color: string,
    dispatch: Function,
};

class Stage extends Component<Props> {
    constructor(props: Props) {
        super(props);

        const stage = {
            center: this.props.center,
            width: this.props.width,
            height: this.props.height
        };

        this.props.dispatch(setStage(stage));

        // this.props._color = 'FF5733';
    }

    // UNSAFE_componentWillMount() {
    //     const stage = {
    //         center: this.props.center,
    //         width: this.props.width,
    //         height: this.props.height
    //     };

    //     this.props.dispatch(setStage(stage));
    // }

    render() {
        const height = this.props.height;
        const width = this.props.width;

        return (
            <svg>
                <rect
                    id = 'stage'
                    height = { height }
                    width = { width }
                    fill = { this.props._color }
                    x = { this.props.center.x - (width / 2) }
                    y = { this.props.center.y - (height / 2) } />

            </svg>
        )
    }
}

export function isOnStage(point: {x: number, y: number}, rect: {center: {x: number, y: number}, width: number, height: number}) {
    const x1 = rect.center.x - (rect.width / 2);
    const x2 = rect.center.x + (rect.width / 2);
    const y1 = rect.center.y - (rect.height / 2);
    const y2 = rect.center.y + (rect.height / 2);

    return point.x >= x1 && point.x <= x2 && point.y >= y1 && point.y <= y2;
}

function _mapStateToProps(state, ownProps: Props) {
    const { localParticipant } = state['features/base/pose'];

    console.log(`Show current on stage: ${localParticipant.isOnStage}`);

    return {
        _color: localParticipant.isOnStage ? '#FFC300' : '#FF5733'
    };
}

export default connect(_mapStateToProps)(Stage);
