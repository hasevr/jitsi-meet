// @flow

import type { Dispatch } from 'redux';

import {
    createToolbarEvent,
    sendAnalytics
} from '../../analytics';
import { translate } from '../../base/i18n';
import { IconMap } from '../../base/icons';
import { connect } from '../../base/redux';
import {
    AbstractButton,
    type AbstractButtonProps
} from '../../base/toolbox';

import { setMapView } from '../actions';
import logger from '../logger';

/**
 * The type of the React {@code Component} props of {@link TileViewButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether or not tile view layout has been enabled as the user preference.
     */
    _mapViewEnabled: boolean,

    /**
     * Used to dispatch actions from the buttons.
     */
    dispatch: Dispatch<any>
};

/**
 * Component that renders a toolbar button for toggling the tile layout view.
 *
 * @extends AbstractButton
 */
class MapViewButton<P: Props> extends AbstractButton<P, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.tileView';
    icon = IconMap;
    label = 'toolbar.enterTileView';
    toggledLabel = 'toolbar.exitTileView';
    tooltip = 'toolbar.toggleMap';

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { _mapViewEnabled, dispatch } = this.props;

        sendAnalytics(createToolbarEvent(
            'mapview.button',
            {
                'is_enabled': _mapViewEnabled
            }));
        const value = !_mapViewEnabled;

        logger.debug(`Map view ${value ? 'enable' : 'disable'}`);
        dispatch(setMapView(value));
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._mapViewEnabled;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code MapViewButton} component.
 *
 * @param {Object} state - The Redux state.
 * @returns {{
 *     _mapViewEnabled: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        _mapViewEnabled: state['features/map'].mapViewEnabled
    };
}

export default translate(connect(_mapStateToProps)(MapViewButton));
