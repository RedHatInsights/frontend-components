# Bulk Select
This component is to allow users to select different kind of items in table/card view.

## Usage
Import `BulkSelect` and place it in your toolbar. If you pass `items` to this component you'll get dropdown component istead of plain select.

**To show checkbox**
```JSX
import React from 'react';
import { BulkSelect } from '@redhat-cloud-services/frontend-components';

const MyCmp = () => (
    <BulkSelect />
);

export default MyCmp;
```

**To show dropdown with checkbox**
```JSX
import React from 'react';
import { BulkSelect } from '@redhat-cloud-services/frontend-components';

const MyCmp = () => (
    <BulkSelect items={[{
        title: 'Some action',
        onClick: (event, clickedItem, key) => doSomething()
    }]}/>
);

export default MyCmp;
```

**Props**
```JS
items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string, //what is shown in dropdown item
    onClick: PropTypes.func //function called when user clicks on dropdown item
})), //dropdown items
checked: PropTypes.bool, //check/uncheck checkbox
onSelect: PropTypes.func, //callback when user clicks on checkbox
toggleProps: PropTypes.any //specific props for toggle
```
