// @flow

/**
 * Different algorithms for calculating volume out of relative pose
 */

import * as PoseTypes from '../../pose/types';

/**
 * Base class for calculator
 */
export class BaseVolumeCalculator {

    /**
     * Calculate volume from pose
     * @param {PoseTypes.Pose} pose
     */
    getVolume(pose: PoseTypes.Pose) { // eslint-disable-line no-unused-vars
        const volume = 1;

        return volume;
    }
}
