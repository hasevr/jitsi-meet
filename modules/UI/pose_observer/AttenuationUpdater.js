// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import { StateListenerRegistry } from '../../../react/features/base/redux';
import { BaseVolumeCalculator, Linear as LinearVolumeCalculator } from './VolumeCalculator'

const calculator: BaseVolumeCalculator = new LinearVolumeCalculator(1)

function selectorFactory(remoteVideo) {
    return (state, prevSelection) => {
        const store = state['features/base/pose']
        const curSelection = [ store.localParticipant, store.remoteParticipants[remoteVideo.id] ]

        if (prevSelection && curSelection[0] === prevSelection[0] && curSelection[1] === prevSelection[1]) {
            return prevSelection
        }

        return curSelection
    }
}

function listenerFactory(remoteVideo) {
    return selection => {
        const attenuation = calculator.getVolume(selection[0].pose, selection[1].pose)

        remoteVideo.setAudioAttenuation(attenuation)

        console.log(`set attenuation to ${attenuation} to ${remoteVideo.id}`)
    }
}

export function bindAttenuation(remoteVideo) {
    console.log('bindAttenuation')

    // set attenuation
    // TODO init attenuation

    // register to pose
    const disposer = StateListenerRegistry.register(
        selectorFactory(remoteVideo),
        listenerFactory(remoteVideo)
    )

    // return disposer
    return disposer
}
