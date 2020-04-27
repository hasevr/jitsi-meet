// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap, react-native/no-inline-styles, max-len */

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
    getVolume(listenerPose: PoseTypes.Pose, speakerPose: PoseTypes.Pose) { // eslint-disable-line no-unused-vars
        const volume = 1;

        return volume;
    }
}

export class Linear extends BaseVolumeCalculator {
    constructor(multiplier: number) {
        super();

        this.multiplier = multiplier;
    }

    getVolume(listenerPose: PoseTypes.Pose, speakerPose: PoseTypes.Pose) {
        const vec = listenerPose.position.map((val, id) => val - speakerPose.position[id]);
        const distance = Math.max(Math.sqrt(vec.reduce((prev, val) => prev + Math.pow(val, 2), 0)), 1);

        const volume = 1 / distance * this.multiplier;

        return volume;
    }
}
