// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars */

/**
 * Update audio volume according to distance
 */

import * as PoseType from '../../pose/types'
import { BaseVolumeCalculator } from './VolumeCalculator'
import VideoLayout from '../videolayout/VideoLayout'

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

            this._setVolume(remoteParticipant.id, attenuation)
        }
    }

    _setVolume(participantId: number, attenuation: number) {
        const remoteVideo = VideoLayout.getSmallVideo(participantId)

        remoteVideo.setAudioAttenuation(attenuation)
    }
}

export const audioUpdater = new AudioUpdater(new BaseVolumeCalculator())

window.audioUpdater = audioUpdater  // TEST
