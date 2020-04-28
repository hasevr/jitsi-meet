// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react-native/no-inline-styles, max-len,
react/jsx-sort-props */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { connect } from '../../base/redux';


type Props = {
    audioLevel: number,
    color: string,
    name: string,
};

class AudioLevelIndicator extends Component<Props> {
    render() {
        // console.log('render audio level indicator');

        return (
            <defs>
                <filter id = { `${this.props.name}-blur` }>
                    <feDropShadow
                        stdDeviation = { 0.4 }
                        in = 'SourceGraphic'
                        dx = { 0 }
                        dy = { 0 }
                        floodColor = { this.props.color }
                        floodOpacity = { this.props.audioLevel }
                        width = '100%'
                        height = '100%' />
                </filter>
            </defs>
        );
    }
}

function _mapStateToProps(state: Object, ownProps: Props) {
    const { name } = ownProps;
    const newAudioLevelCollection = state['features/map'].audioLevelCollection;

    if (newAudioLevelCollection === undefined) {
        return {
            audioLevel: 0
        };
    }

    // console.log(`Update audio level - ID[${name}]: ${newAudioLevelCollection[name]}`);
    return {
        audioLevel: newAudioLevelCollection[name]
    }

}

export default connect(_mapStateToProps)(AudioLevelIndicator);
