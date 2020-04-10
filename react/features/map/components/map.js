// @flow

import { Components } from 'react';
import * as PoseTypes from '../../../../modules/pose/types';

type Props = {
    terrain: PoseTypes.Terrain,
    participants: PoseTypes.Participants,
    onLocalParticipantMove(newPose: PoseTypes.Pose): void
}

/**
 * Map for showing:
 * 1. terrain of the conference hall
 * 2. pose of every participants
 */
export class Map extends Components<Props> {

}
