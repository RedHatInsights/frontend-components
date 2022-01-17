import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './tab-layout.scss';

const TabLayout = ({ children, items, classNames, active, onTabClick, ...props }) => (
  <section {...props} className={classnames(classNames, 'ins-tab-layout')} widget-type="InsightsTabs">
    <div className="ins-tabs">
      {items.map((oneItem) => (
        <div
          key={oneItem.name}
          className={classnames({ active: oneItem.name === active })}
          onClick={(event) => onTabClick(event, oneItem)}
          widget-type="InsightsTabsItem"
          widget-id={oneItem.name}
        >
          {oneItem.title}
        </div>
      ))}
    </div>
    <div className="ins-tab-content">{children}</div>
  </section>
);

TabLayout.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.node,
    })
  ),
  children: PropTypes.node,
  classNames: PropTypes.string,
  active: PropTypes.string,
  onTabClick: PropTypes.func,
};

TabLayout.defaultProps = {
  items: [],
  onTabClick: () => undefined,
};

export default TabLayout;
