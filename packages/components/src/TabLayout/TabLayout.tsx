import React from 'react';
import classnames from 'classnames';
import './tab-layout.scss';

export type TabLayoutItem = { name?: string; title?: React.ReactNode };

export interface TabLayoutProps {
  items?: TabLayoutItem[];
  classNames?: string;
  /**
   * Active tab item
   */
  active?: string;
  onTabClick?: (event: React.MouseEvent<HTMLDivElement>, oneItem: TabLayoutItem) => void;
}

/**
 * @deprecated
 *
 * Please use PF tabs component instead
 *
 */
const TabLayout: React.FunctionComponent<TabLayoutProps> = ({ children, items = [], classNames, active, onTabClick = () => undefined, ...props }) => (
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

export default TabLayout;
