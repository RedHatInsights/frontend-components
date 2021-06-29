import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import InventoryTable from '@redhat-cloud-services/frontend-components-inventory/components/table-v2';

const MyCmp = () => {
    return (
        <Router>
            <InventoryTable />
        </Router>
    );
};

ReactDOM.render(<MyCmp />, document.querySelector('.demo-app'));
