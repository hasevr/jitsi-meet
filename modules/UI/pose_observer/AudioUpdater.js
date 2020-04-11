// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars */

/**
 * Update audio volume according to distance
 */

import * as PoseType from '../../pose/types'
import { BaseVolumeCalculator } from './VolumeCalculator'
import { VideoLayout } from '../videolayout/VideoLayout'

/**
 *
 */
class AudioUpdater {
    constructor(calculator: BaseVolumeCalculator) {
        this._calculator = calculator
    }

    updateAudio(localParticipant: PoseType.Participant, remoteParticipants: PoseType.Participants) {
        for (const [ key, remoteParticipant ] of Object.entries(remoteParticipants)) {
            const attenuation = this._calculator.getVolume(localParticipant.pose, remoteParticipant.pose)
            const baseVolume = 1
            const volume = baseVolume * attenuation

            this._setVolume(remoteParticipant.id, volume)
        }
    }

    _setVolume(participantId: number, volume: number) {
        const remoteVideo = VideoLayout.getSmallVideo(participantId)

        if (remoteVideo && remoteVideo._audioStreamElement) {
            remoteVideo._audioStreamElement.volume = volume
        }
    }
}

export const audioUpdater = new AudioUpdater(new BaseVolumeCalculator())
global.audioUpdater = audioUpdater
