import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Filter } from './Filter';
import { TableToolbar } from '../../PresentationalComponents/TableToolbar';

const EntityTableToolbar = ({ total, page, onRefresh, perPage, filters, hasItems, pathPrefix, apiBase, ...props }) => (
    <TableToolbar results={ total }>
        <Filter { ...props }
            hasItems={ hasItems }
            filters={ filters }
            pathPrefix={ pathPrefix }
            apiBase={ apiBase }
            totalItems={ total }
        />
    </TableToolbar>
);

EntityTableToolbar.propTypes = {
    total: PropTypes.number,
    filters: PropTypes.array,
    hasItems: PropTypes.bool,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string
};

function mapStateToProps({ entities: { total }}, { totalItems, ...props }) {
    return {
        ...props,
        total: totalItems || total
    };
}

export default connect(mapStateToProps)(EntityTableToolbar);
