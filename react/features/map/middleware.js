// @flow
/* eslint-disable semi, require-jsdoc, no-unused-vars, valid-jsdoc, react/no-multi-comp, new-cap */

import { updateAudioLevel } from './actions';
import { UPDATE_AUDIO_LEVEL } from './actionTypes';
import { MiddlewareRegistry } from '../base/redux';
import { CONFERENCE_JOINED, getCurrentConference } from '../base/conference';
import { JitsiConferenceEvents } from '../base/lib-jitsi-meet';
import { LOCAL_POSE_UPDATED, setLocalStageStatus } from '../base/pose';

MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case CONFERENCE_JOINED: {
        const conference = getCurrentConference(store);

        // console.log('Register TRACK_AUDIO_LEVEL_CHANGED event callback.');
        conference.on(JitsiConferenceEvents.TRACK_AUDIO_LEVEL_CHANGED, (id, lvl) => {
            // console.log(`Dispatch an audio updating action - ${id}, ${lvl}`);
            store.dispatch(updateAudioLevel(id, lvl));
        });
    }
    }

    return next(action);
})

// room.on(JitsiConferenceEvents.TRACK_AUDIO_LEVEL_CHANGED, (id, lvl) => {
//     let newLvl = lvl;

//     if (this.isLocalId(id)
//         && this.localAudio && this.localAudio.isMuted()) {
//         newLvl = 0;
//     }

//     if (config.debug) {
//         this.audioLevelsMap[id] = newLvl;
//         if (config.debugAudioLevels) {
//             logger.log(`AudioLevel:${id}/${newLvl}`);
//         }
//     }

//     APP.UI.setAudioLevel(id, newLvl);
// });
