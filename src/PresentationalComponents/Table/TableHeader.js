import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SortDirection } from './Table';
import { AngleDownIcon, AngleUpIcon } from '@patternfly/react-icons';

class TableHeader extends Component {
  static sortedByDirection(key, direction, sortBy) {
    return key === sortBy.index && direction === sortBy.direction;
  }

  constructor(props) {
    super(props);
    this.createCheckbox = this.createCheckbox.bind(this);
    this.createHeader = this.createHeader.bind(this);
    this.onDirectionClick = this.onDirectionClick.bind(this);
    this.onHeadClick = this.onHeadClick.bind(this);
  }

  onHeadClick(event, key) {
    const direction = this.props.sortBy &&
      this.props.sortBy.direction === SortDirection.up ?
      SortDirection.down :
      SortDirection.up;
    this.props.onSort && this.props.onSort(event, key, direction);
  }

  onDirectionClick(event, key, direction) {
    event.stopPropagation();
    if (key === this.props.sortBy.index) {
      direction = direction === SortDirection.up ? SortDirection.down : SortDirection.up;
    }
    this.props.onSort && this.props.onSort(event, key, direction);
  }

  createIcon(key, direction, Icon) {
    const { sortBy } = this.props;
    if(TableHeader.sortedByDirection(key, direction, sortBy) || sortBy.index !== key) {
      return <Icon onClick={event => this.onDirectionClick(event, key, direction)} />;
    }
  }

  createHeader(col, key) {
    const {
      sortBy
    } = this.props;
    const classes = classnames(
      key === sortBy.index && 'ins-sort-by',
      TableHeader.sortedByDirection(key, SortDirection.up, sortBy) ? 'ins-sort-asc' : 'ins-sort-desc',
    )
    return (
      <th key={key} className={classes} onClick={event => this.onHeadClick(event, key)}>
        {col}
        <span className="ins-sort-icons">
          {this.createIcon(key, SortDirection.up, AngleUpIcon)}
          {this.createIcon(key, SortDirection.down, AngleDownIcon)}
        </span>
      </th>
    )
  }

  createCheckbox() {
    const { onSelectAll } = this.props;
    return (
      <th className='ins-empty-col' onClick={event => {
        onSelectAll(event, event.target.checked)
      }}>
        <input
              type="checkbox"
              className="pf-c-check"/>
      </th>
    )
  }

  render() {
    const {
      className,
      onSort,
      sortBy,
      cols,
      hasIcon,
      hasCheckbox,
      onSelectAll,
      ...props
    } = this.props;

    return (
      <thead {...props} className={classnames(className)}>
        <tr>
          {hasCheckbox && this.createCheckbox()}
          {hasIcon && <th className='ins-empty-col'/>}
          {cols && cols.map(this.createHeader)}
        </tr>
      </thead>
    );
  }
}

TableHeader.propTypes = {
  hasCheckbox: PropTypes.bool,
  hasIcon: PropTypes.bool,
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(['up', 'down'])
  }),
  className: PropTypes.string,
  cols: PropTypes.arrayOf(PropTypes.node),
  onSelectAll: PropTypes.func,
  onSort: PropTypes.func
}

export default TableHeader;