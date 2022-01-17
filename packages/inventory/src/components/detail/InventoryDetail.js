import React, { useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { loadEntity, deleteEntity } from '../../redux/actions';
import './InventoryDetail.scss';
import SystemNotFound from './SystemNotFound';
import TopBar from './TopBar';
import FactsInfo from './FactsInfo';
import { reloadWrapper } from '../../shared';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import ApplicationDetails from './ApplicationDetails';
import './InventoryDetail.scss';

/**
 * Composit component which tangles together Topbar, facts, tags, app details and if system is found or not.
 * This component is connected to redux and reads `loaded` and `entity`.
 * @param {*} props additional features from parent component.
 */
const InventoryDetail = ({ actions, showTags, hideInvLink, onTabSelect, onBackToListClick, showDelete, appList, showInventoryDrawer, children }) => {
  const { inventoryId } = useParams();
  const dispatch = useDispatch();
  const loaded = useSelector(({ entityDetails: { loaded } }) => loaded);
  const entity = useSelector(({ entityDetails: { entity } }) => entity);
  useEffect(() => {
    const currId = inventoryId || location.pathname.replace(/\/$/, '').split('/').pop();
    if (!entity || entity.id !== inventoryId || !loaded) {
      dispatch(loadEntity(currId, { hasItems: true }, { showTags }));
    }
  }, []);
  return (
    <div className="ins-entity-detail">
      {loaded && !entity ? (
        <SystemNotFound onBackToListClick={onBackToListClick} inventoryId={location.pathname.split('/')[location.pathname.split('/').length - 1]} />
      ) : (
        <Fragment>
          <TopBar
            entity={entity}
            loaded={loaded}
            onBackToListClick={onBackToListClick}
            actions={actions}
            deleteEntity={(systems, displayName, callback) => {
              const action = deleteEntity(systems, displayName);
              dispatch(reloadWrapper(action, callback));
            }}
            addNotification={(payload) => dispatch(addNotification(payload))}
            hideInvLink={hideInvLink}
            showInventoryDrawer={showInventoryDrawer}
            showDelete={showDelete}
            showTags={showTags}
          />
          <FactsInfo loaded={loaded} entity={entity} />
          {children}
        </Fragment>
      )}
      <ApplicationDetails onTabSelect={onTabSelect} appList={appList} />
    </div>
  );
};

InventoryDetail.propTypes = {
  hideInvLink: PropTypes.bool,
  hideBack: PropTypes.bool,
  showTags: PropTypes.bool,
  showDelete: PropTypes.bool,
  showInventoryDrawer: PropTypes.bool,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      onClick: PropTypes.func,
      key: PropTypes.string,
    })
  ),
  appList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      name: PropTypes.string,
      pageId: PropTypes.string,
    })
  ),
  onTabSelect: PropTypes.func,
  onBackToListClick: PropTypes.func,
  children: PropTypes.node,
};
InventoryDetail.defaultProps = {
  actions: [],
  hideInvLink: false,
  showTags: false,
  onBackToListClick: () => undefined,
};

export default InventoryDetail;
