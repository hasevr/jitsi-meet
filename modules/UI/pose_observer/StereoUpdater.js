// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react-native/no-inline-styles, max-len */

import { StateListenerRegistry } from '../../../react/features/base/redux';

const yRotationToVector = degrees => {
    const radians = degrees * (Math.PI / 180);

    const x = Math.sin(radians);
    const z = Math.cos(radians);

    return [ x, 0, z ];
};

class NodesManager {
    audioContext: AudioContext
    sourceNodes: {
        [key: string]: MediaElementAudioSourceNode
    }
    gainNodes: {
        [key: string]: GainNode
    }
    pannerNodes: {
        [key: string]: PannerNode
    }

    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.sourceNodes = {}
        this.gainNodes = {}
        this.pannerNodes = {}
    }

    setGain(id, gain) {
        this.gainNodes[id].gain.value = gain
    }

    addSourceNode(id, stream) {
        console.log('add source node', id)
        if (this.sourceNodes[id]) {
            console.error(`source node of participant-${id} already exists`)

            return
        }

        const source = this.audioContext.createMediaStreamSource(stream)
        const gain = this.audioContext.createGain()
        const panner = this.audioContext.createPanner()

        gain.gain.value = 1

        panner.panningModel = 'HRTF'
        panner.distanceModel = 'inverse'
        panner.refDistance = 1
        panner.maxDistance = 100
        panner.rolloffFactor = 1
        panner.coneInnerAngle = 360
        panner.coneOuterAngle = 0
        panner.coneOuterGain = 0

        panner.orientationX.value = 0
        panner.orientationY.value = 0
        panner.orientationZ.value = 1
        panner.positionX.value = 0
        panner.positionY.value = 0
        panner.positionZ.value = 0

        this.sourceNodes[id] = source
        this.gainNodes[id] = gain
        this.pannerNodes[id] = panner

        source.connect(gain)
        gain.connect(panner)
        panner.connect(this.audioContext.destination)
    }

    removeSourceNode(id) {
        this.sourceNodes[id].disconnect()
        this.gainNodes[id].disconnect()
        this.pannerNodes[id].disconnect()

        delete this.sourceNodes[id]
        delete this.gainNodes[id]
        delete this.pannerNodes[id]
    }

    updatePannerNode(id, listenerPose, speakerPose) {
        const panner = this.pannerNodes[id]

        if (!panner) {
            console.error(`panner node of participant-${id} does not exist`)

            return
        }

        // NOTE panner use right hand cartesian coordinate
        const positionOffset = [ 0, 1 ].map(index => speakerPose.position[index] - listenerPose.position[index])

        positionOffset[1] = -positionOffset[1]
        const rotation = -listenerPose.orientation * Math.PI / 180
        const positionRC = [ (positionOffset[0] * Math.cos(rotation)) - (positionOffset[1] * Math.sin(rotation)), 0, (positionOffset[0] * Math.sin(rotation)) - (positionOffset[1] * Math.cos(rotation)) ]

        const orientationRC = yRotationToVector(speakerPose.orientation - listenerPose.orientation)

        const node = this.pannerNodes[id]

        console.log(positionRC, orientationRC)

        node.setPosition(...positionRC)
        node.setOrientation(...orientationRC)
    }
}

const nodesManager = new NodesManager()

window.nodesManager = nodesManager

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
        nodesManager.updatePannerNode(remoteVideo.id, selection[0].pose, selection[1].pose)
        console.log(`set stereo of ${remoteVideo.id}`)
    }
}

export function bindStereo(remoteVideo) {
    console.log('bindStereo')

    remoteVideo.setAudioVolume = volume => {
        nodesManager.setGain(remoteVideo.id, volume)
    }
    remoteVideo.setAudioStream = track => {
        window.track = track
        window.mediaStream = track.getOriginalStream()
        nodesManager.addSourceNode(remoteVideo.id, track.getOriginalStream())
    }

    const disposer = StateListenerRegistry.register(
        selectorFactory(remoteVideo),
        listenerFactory(remoteVideo)
    )

    return () => {
        disposer()
        nodesManager.removeSourceNode(remoteVideo.id)
    }
}
