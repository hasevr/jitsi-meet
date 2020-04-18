// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars */

import * as PoseType from '../../pose/types'
import { BaseVolumeCalculator } from './VolumeCalculator'
import VideoLayout from '../videolayout/VideoLayout'

/**
 * Update video position and size according to relative position of participants
 */
class ViewUpdater {
    static MAX_DISTANCE = 100000

    /**
     * Sort dom elements by distance
     * @param {Participant} localParticipant
     * @param {Participants} remoteParticipants
     */
    update(localParticipant: PoseType.Participant, remoteParticipants: PoseType.Participants) {
        const remoteVideoElements = document.querySelectorAll('#filmstripRemoteVideosContainer > [id^=participant_]')

        if (!remoteVideoElements || remoteVideoElements.length === 0) {
            return
        }
        const currentIdOrder = remoteVideoElements.map(element => element.id.substr('participant_'.length))
        const elementMap = {}

        for (const [ index, id ] of Object.entries(currentIdOrder)) {
            elementMap[id] = remoteVideoElements[index]
        }

        const newIdOrder: string[] = [ ...currentIdOrder ]
        const distanceMap: {[key: string]: number} = {}

        for (const participant of remoteParticipants) {
            distanceMap[participant.id] = [ 0, 1 ].reduce(
                (prev, key) => prev + Math.pow(participant.pose.position[key] - localParticipant.pose.position[key], 2),
                0
            )
        }
        newIdOrder.sort(this._compareById(distanceMap))

        const remoteVideosContainer
            = document.getElementById('filmstripRemoteVideosContainer');
        const localVideoContainer
            = document.getElementById('localVideoTileViewContainer');

        newIdOrder.forEach(id => remoteVideosContainer.insertBefore(elementMap[id], localVideoContainer))
    }

    _compareById(map: {[key: string]: number}): (id1: string, id2: string) => boolean {

        return (id1: string, id2: string) => {
            const distance1 = map[id1] ? map[id1] : ViewUpdater.MAX_DISTANCE
            const distance2 = map[id2] ? map[id2] : ViewUpdater.MAX_DISTANCE

            return distance1 < distance2
        }
    }
}

export const viewUpdater = new ViewUpdater()
