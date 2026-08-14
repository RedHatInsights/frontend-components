# Treeview Table
This is table variant with rows aligned in tree like structure, mening each row can have one parent and there ca be multiple levels.

### Usage

We are heavily rely on [Table](https://www.patternfly.org/v4/documentation/react/components/table) implemenetaion in PF. And support custom styling with specific decator in order to lay the DOM correctly.

In order to properly collapse and expand the tree you should use
* `treeTable` - decorator that is added to specific col that controls the collapsing. This decorator takes one argument, function that is called upon user clicks.
* `TreeRowWrapper` - row wrapper passed to table to properly style each row.
* `sizeCalculator` - helper function to calculate size, level and ite count for each row. You should pass all of your rows to this helper function.
* `collapseBuilder` - helper function to help you calculate collapse rows. This is a function builder, first argument is treeParent (if you want to change over which ID is collapse calculated) and creates function. Second function takes rows and everything that is sent when user clicks on arrow.

```JSX
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { treeTable, TreeRowWrapper, sizeCalculator, collapseBuilder } from '../../components/src/Components/TreeTable';
import './index.scss';
import {
    Table,
    TableHeader,
    TableBody,
    textCenter
} from '@patternfly/react-table';

const rows = [
    {
        cells: [ 'one', 'two', 'three', 'four', 'five' ],
        isTreeOpen: true
    },
    {
        cells: [
            {
                title: <div>one - 2</div>,
                props: { title: 'hover title', colSpan: 3 }
            },
            'four - 2',
            'five - 2'
        ],
        isTreeOpen: false,
        treeParent: 0
    },
    {
        cells: [
            'one - 3',
            'two - 3',
            'three - 3',
            'four - 3',
            {
                title: 'five - 3 (not centered)',
                props: { textCenter: false }
            }
        ],
        treeParent: 1
    },
    {
        cells: [ 'one', 'two', 'three', 'four', 'five' ]
    }
];

export const myCmp = () => {
    const [ rows, setRows ] = useState(rows);
    const cells = [
            { title: 'Repositories', cellTransforms: [ treeTable((...props) => {
                setRows(collapseBuilder()(rows, ...props));
            }) ] },
            'Branches',
            { title: 'Pull requests' },
            'Workspaces',
            {
                title: 'Last Commit',
                transforms: [ textCenter ],
                cellTransforms: [ textCenter ]
            }
        ]
    return <Table
        className="pf-m-expandable pf-v6-c-treeview"
        rowWrapper={TreeRowWrapper}
        aria-label="Simple Table"
        cells={columns}
        rows={sizeCalculator(rows)}
    >
        <TableHeader />
        <TableBody />
    </Table>
}

```
