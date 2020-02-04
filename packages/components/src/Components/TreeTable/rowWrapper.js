import React from 'react';
import { RowWrapper } from '@patternfly/react-table';
import classnames from 'classnames';

class TreeRowWrapper extends React.Component {
    render() {
        const { className } = this.props;
        const { level, isTreeOpen } = this.props.row;
        return <RowWrapper
            aria-level={level === undefined ? 1 : level + 1}
            className={
                classnames({
                    className,
                    'pf-m-expandable': isTreeOpen === true || isTreeOpen === false,
                    'pf-m-expanded': isTreeOpen === true
                })
            }
            {...this.props}
        />;
    }
}

export default TreeRowWrapper;
