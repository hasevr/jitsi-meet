// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars */

import * as PoseType from '../../pose/types'
import { BaseVolumeCalculator } from './VolumeCalculator'
import VideoLayout from '../videolayout/VideoLayout'

/**
 * Update audio volume according to distance
 */
class AudioUpdater {
    constructor(calculator: BaseVolumeCalculator) {
        this._calculator = calculator
    }

    update(localParticipant: PoseType.Participant, remoteParticipants: PoseType.Participants) {
        for (const [ key, remoteParticipant ] of Object.entries(remoteParticipants)) {
            const attenuation = this._calculator.getVolume(localParticipant.pose, remoteParticipant.pose)

            this._setVolume(remoteParticipant.id, attenuation)
        }
    }

    _setVolume(participantId: number, attenuation: number) {
        const remoteVideo = VideoLayout.getSmallVideo(participantId)

        if (!remoteVideo) {
            console.warn(`No remote video of participant ${participantId}`)

            return
        }

        remoteVideo.setAudioAttenuation(attenuation)
    }
}

export const audioUpdater = new AudioUpdater(new BaseVolumeCalculator())

window.audioUpdater = audioUpdater // TEST
