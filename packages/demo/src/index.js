import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { treeTable, TreeRowWrapper, sizeCalculator, collapseBuilder } from '../../components/src/Components/TreeTable';
import './index.scss';
import {
    Table,
    TableHeader,
    TableBody,
    textCenter
} from '@patternfly/react-table';

const origRows = [
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

class MyCmp extends Component {
    state = {
        cells: [
            { title: 'Repositories', cellTransforms: [ treeTable((...props) => this.collapseRows(...props)) ] },
            'Branches',
            { title: 'Pull requests' },
            'Workspaces',
            {
                title: 'Last Commit',
                transforms: [ textCenter ],
                cellTransforms: [ textCenter ]
            }
        ],
        rows: origRows
    }

    collapseRows = (...props) => {
        const { rows } = this.state;
        this.setState({
            rows: collapseBuilder()(rows, ...props)
        });
    }

    render() {
        const { cells, rows } = this.state;
        return (
            <Table
                className="pf-m-expandable pf-c-treeview"
                rowWrapper={TreeRowWrapper}
                aria-label="Simple Table"
                cells={cells}
                rows={sizeCalculator(rows)}
            >
                <TableHeader />
                <TableBody />
            </Table>
        );
    }
}

ReactDOM.render(<MyCmp />, document.querySelector('.demo-app'));
