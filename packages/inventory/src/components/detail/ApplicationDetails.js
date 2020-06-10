import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Tab } from '@patternfly/react-core/dist/esm/components/Tabs';
import { detailSelect } from '../../redux/actions';

const ApplicationDetails = ({ onTabSelect, ...props }) => {
    const dispatch = useDispatch();
    const items = useSelector(({ entityDetails: { activeApps } }) => activeApps);
    const activeApp = useSelector(({ entityDetails: { activeApp } }) => activeApp);
    const defaultApp = activeApp?.appName || items?.[0]?.name;
    return (
        <React.Fragment>
            {
                items && items.length > 1 &&
                <Tabs
                    {...props}
                    activeKey={ defaultApp }
                    onSelect={ (event, item) => {
                        const activeItem = items.find(oneApp => oneApp.name === item);
                        onTabSelect(event, item, activeItem);
                        dispatch(detailSelect(activeItem.name));
                    } }
                    isFilled
                    className="ins-c-inventory-detail__app-tabs"
                >
                    { items.map((item, key) => (
                        <Tab key={ key } eventKey={ item.name } title={ item.title }></Tab>
                    )) }
                </Tabs>
            }
        </React.Fragment>
    );
};

ApplicationDetails.propTypes = {
    onTabSelect: PropTypes.func
};

ApplicationDetails.defaultProps = {
    onTabSelect: () => undefined
};

export default ApplicationDetails;
