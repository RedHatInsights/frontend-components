/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useStore, useSelector } from 'react-redux';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/esm/Skeleton';

/**
 * Small component that just renders active detail with some specific class.
 * This component detail is accessed from redux if no component found `missing component` is displayed.
 * @param {*} props `componentsMapper` if you want to pass different components list.
 */
const AppInfo = ({ componentsMapper }) => {
    const loaded = useSelector(({ entityDetails: { loaded } }) => loaded);
    const activeApp = useSelector(({ entityDetails: { activeApps, activeApp, loaded } }) => {
        if (loaded) {
            return activeApps?.find?.(item => item?.name === activeApp?.appName) || activeApps?.[0];
        }
    });
    const Cmp = componentsMapper?.[activeApp?.name] || activeApp?.component;
    return (
        <Fragment>
            {
                loaded ? activeApp && (
                    <div className={ `ins-active-app-${activeApp?.name}` }>
                        { Cmp ? <Cmp store={useStore()} /> : 'missing component'}
                    </div>
                ) : <Skeleton size={ SkeletonSize.md } />
            }
        </Fragment>
    );
};

AppInfo.propTypes = {
    componentsMapper: PropTypes.shape({
        [PropTypes.string]: PropTypes.component
    })
};

export default AppInfo;
