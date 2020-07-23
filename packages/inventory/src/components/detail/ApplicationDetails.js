import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab } from '@patternfly/react-core/dist/esm/components/Tabs';
import { detailSelect } from '../../redux/actions';

/**
 * Component that renders tabs for each application detail and handles clicking on each item.
 * @param {*} props onTabSelect can be used to notify parent component that detail has been selected.
 */
const ApplicationDetails = ({ onTabSelect, appList, ...props }) => {
    const dispatch = useDispatch();
    const items = useSelector(({ entityDetails: { activeApps } }) => activeApps);
    const activeApp = useSelector(({ entityDetails: { activeApp } }) => activeApp);
    const defaultApp = activeApp?.appName ||
        appList?.find(({ pageId, name }) => items?.[0]?.name === (pageId || name))?.name ||
        items?.[0]?.name;
    const applications = appList || items;

    return (
        <React.Fragment>
            {
                applications?.length > 1 &&
                <Tabs
                    {...props}
                    activeKey={ defaultApp }
                    onSelect={ (event, item) => {
                        const activeItem = applications.find(oneApp => oneApp.name === item);
                        onTabSelect(event, item, activeItem);
                        dispatch(detailSelect(activeItem.name));
                    } }
                    isFilled
                    className="ins-c-inventory-detail__app-tabs"
                >
                    { applications.map((item, key) => (
                        <Tab key={ key } eventKey={ item.name } title={ item.title }></Tab>
                    )) }
                </Tabs>
            }
        </React.Fragment>
    );
};

ApplicationDetails.propTypes = {
    appList: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        name: PropTypes.string.isRequired,
        pageId: PropTypes.string
    })),
    onTabSelect: PropTypes.func
};

ApplicationDetails.defaultProps = {
    onTabSelect: () => undefined
};

export default ApplicationDetails;
