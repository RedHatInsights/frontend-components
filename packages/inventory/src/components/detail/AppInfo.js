/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useStore, useSelector } from 'react-redux';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

/**
 * Small component that just renders active detail with some specific class.
 * This component detail is accessed from redux if no component found `missing component` is displayed.
 * @param {*} props `componentsMapper` if you want to pass different components list.
 */
const AppInfo = ({ componentMapper, appList }) => {
  const store = useStore();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const loaded = useSelector(({ entityDetails: { loaded } }) => loaded);
  const entity = useSelector(({ entityDetails: { entity } }) => entity);
  const activeApp = useSelector(({ entityDetails: { activeApps, activeApp, loaded } }) => {
    if (loaded) {
      return (appList || activeApps)?.find?.((item) => item?.name === (searchParams.get('appName') || activeApp?.appName)) || activeApps?.[0];
    }
  });
  const Cmp = componentMapper || activeApp?.component;
  return (
    <Fragment>
      {loaded ? (
        activeApp && (
          <div className={`ins-active-app-${activeApp?.name}`}>
            {Cmp ? <Cmp store={store} inventoryId={entity?.id} appName={activeApp?.name} /> : 'missing component'}
          </div>
        )
      ) : (
        <Skeleton size={SkeletonSize.md} />
      )}
    </Fragment>
  );
};

AppInfo.propTypes = {
  componentMapper: PropTypes.element,
  appList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      name: PropTypes.string,
      pageId: PropTypes.string,
    })
  ),
};

export default AppInfo;
