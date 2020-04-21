// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react-native/no-inline-styles, max-len */

import { StateListenerRegistry } from '../../../react/features/base/redux';

class NodesManager {
    audioContext: AudioContext
    sourceNodes: {
        [key: string]: MediaElementAudioSourceNode
    }
    pannerNodes: {
        [key: string]: PannerNode
    }

    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.sourceNodes = {}
        this.pannerNodes = {}
    }

    addSourceNode(id, element) {
        console.log('add source node', id)
        if (this.sourceNodes[id] || this.pannerNodes[id]) {
            console.error(`source node or panner node of participant-${id} already exists`)

            return
        }

        const source = this.audioContext.createMediaElementSource(element)
        const panner = this.audioContext.createPanner()

        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;

        this.sourceNodes[id] = source
        this.pannerNodes[id] = panner

        const gain = this.audioContext.createGain()

        gain.gain.value = 0
        source.connect(gain)
        gain.connect(this.audioContext.destination)

        // panner.connect(this.audioContext.destination)
    }

    removeSourceNode(id) {
        if (!this.sourceNodes[id] || !this.pannerNodes[id]) {
            console.error(`source node or panner node of participant-${id} does not exist`)

            return
        }

        this.sourceNodes[id].disconnect()
        this.pannerNodes[id].disconnect()

        delete this.sourceNodes[id]
        delete this.pannerNodes[id]
    }

    updatePannerNode(id, listenerPose, speakerPose) {
        if (!this.pannerNodes[id]) {
            console.error(`panner node of participant-${id} does not exist`)

            return
        }

        // NOTE panner use right hand cartesian coordinate
        const positionOffset = [ 0, 1 ].map(index => speakerPose.position[index] - listenerPose.position[index])
        const positionRC = [ positionOffset[0], -positionOffset[1], 0 ]

        const orientationOffset = (speakerPose.orientation - listenerPose.orientation) * Math.PI / 180
        const orientationRC = [ Math.cos(orientationOffset), -Math.sin(orientationOffset), 0 ]

        const node = this.pannerNodes[id]

        console.log(positionRC)

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
        // nodesManager.updatePannerNode(remoteVideo.id, selection[0].pose, selection[1].pose)
        // console.log(`set stereo of ${remoteVideo.id}`)
    }
}

export function bindStereo(remoteVideo) {
    console.log('bindStereo')

    remoteVideo.onAudioStreamElementUpdate.push((oldEle, newEle) => {
        if (oldEle) {
            console.error('old audio stream element is not undefined')

            return
        }
        nodesManager.addSourceNode(remoteVideo.id, newEle)
    })

    const disposer = StateListenerRegistry.register(
        selectorFactory(remoteVideo),
        listenerFactory(remoteVideo)
    )

    return () => {
        disposer()
        nodesManager.removeSourceNode(remoteVideo.id)
    }
}
