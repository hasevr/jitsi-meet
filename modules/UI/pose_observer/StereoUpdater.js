// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react-native/no-inline-styles, max-len */

import { StateListenerRegistry } from '../../../react/features/base/redux';

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

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

    initParticipant(id) {
        console.log('init participant', id)
        if (this.gainNodes[id] || this.pannerNodes[id]) {
            console.error(`gain node or panner node of participant-${id} already exists`)

            return
        }
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

        this.gainNodes[id] = gain
        this.pannerNodes[id] = panner

        gain.connect(panner)
        panner.connect(this.audioContext.destination)
    }

    setGain(id, gain) {
        this.gainNodes[id].gain.value = gain
    }

    updateSourceNode(id, stream) {
        if (this.sourceNodes[id]) {
            console.info(`source node of participant-${id} already exists, update source`)
            this.sourceNodes[id].disconnect()
        }

        const source = this.audioContext.createMediaStreamSource(stream)

        this.sourceNodes[id] = source

        source.connect(this.gainNodes[id])

        if (isChrome) { // NOTE Chorme would not work if not connect stream to audio tag
            const a = new Audio()

            a.muted = true
            a.srcObject = stream
        }
    }

    removeParticipant(id) {
        console.log('remove source node', id)
        this.sourceNodes[id].disconnect()
        this.gainNodes[id].disconnect()
        this.pannerNodes[id].disconnect()

        delete this.sourceNodes[id]
        delete this.gainNodes[id]
        delete this.pannerNodes[id]
    }

    updatePannerNodePose(id, listenerPose, speakerPose) {
        console.log('update panner node', id)
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

        node.setPosition(...positionRC)
        node.setOrientation(...orientationRC)
    }

    updateNodeEffect(id, effect) {
        switch (effect) {
        case 'normal':
            this.pannerNodes[id].refDistance = 1
            break;
        case 'stage':
            this.pannerNodes[id].refDistance = 1000
            break;
        default:
            console.log(`Unrecognized effect: ${effect}`)
            break;
        }
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
        if (selection[0] === undefined || selection[1] === undefined) {
            return
        }

        nodesManager.updatePannerNodePose(remoteVideo.id, selection[0].pose, selection[1].pose)
    }
}

export function bindStereo(remoteVideo) {
    console.log('bindStereo')

    nodesManager.initParticipant(remoteVideo.id)

    remoteVideo.setAudioVolume = volume => {
        nodesManager.setGain(remoteVideo.id, volume)
    }
    remoteVideo.setAudioStream = track => {
        window.track = track
        window.mediaStream = track.getOriginalStream()
        nodesManager.updateSourceNode(remoteVideo.id, track.getOriginalStream())
    }

    const disposer = StateListenerRegistry.register(
        selectorFactory(remoteVideo),
        listenerFactory(remoteVideo)
    )

    return () => {
        disposer()
        nodesManager.removeParticipant(remoteVideo.id)
    }
}
