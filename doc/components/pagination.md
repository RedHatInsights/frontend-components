# Pagination
Currently this repository works as a proxy to expose [pf3@paginationRow](https://rawgit.com/patternfly/patternfly-react/gh-pages/index.html?knob-View%20Type%3A=list&knob-Page=1&knob-Number%20of%20Pages=5&knob-Page%20Size%20Drop%20Up=true&knob-Item%20Count%3A=75&knob-Items%20Start%3A=1&knob-Items%20End=15&selectedKind=patternfly-react%2FWidgets%2FPagination&selectedStory=Pagination%20row&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs)

### Usage
Just import this component wherever you want to use it and pass `numberOfItems` as props. 
```javascript
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';

export default () => (
  <Pagination numberOfItems={100} />
)
```

This will redner pagination row with 100 items, first page and 10 items per page. If you want to change page pass umber as `page`props -> `<Pagination numberOfItems={100} page={3}/>`

### Using debounce
When user wants to change page by typing you should use some logic to submit page number after cerain amount of time. For this you can use [debounce](https://davidwalsh.name/javascript-debounce-function). If you don't want to code your own function we recommend using lodash [debounce](https://lodash.com/docs/4.17.11#debounce) and storing page returned from set page in state.

```JSX
import React, { Component } from 'react';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import debounce from 'lodash/debounce';

class SomeCmp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: undefined
        };

        // This is the most important piece you should be interested in
        this.changePage = debounce((pagination) => this.props.onRefreshData(pagination), 800);
    }

    onSetPage = (page, debounce) => {
        const { onRefreshData } = this.props;
        // This logic decides if you should store page in state or query your API directly
        if (debounce) {
            this.changePage(pagination);
            this.setState({
                page
            });
        } else {
            onRefreshData(pagination);
            this.setState({
                page: undefined
            });
        }
    }

    render() {
        const { total, page, perPage, loaded } = this.props;
        const { page: statePage } = this.state;
        return (
            <Pagination
                numberOfItems={ total }
                page={ statePage || page }
                onSetPage={ this.onSetPage }
            />
        );
    }
}
```

### PF-next pagination
If you do not like the look and feel of PF3 pagination you can use new pagination by passing `useNext` prop. 

### Props
This component is using paginationRow props and adds these on top of them
```Javascript
{
  direction: PropTypes.oneOf('up', 'down'), // default down
  viewType: PropTypes.string, // default 'table'
  itemsPerPage: PropTypes.number, // default to first per page options
  perPageOptions: PropTypes.arrayOf(PropTypes.number), // default to [10, 15, 20, 25, 50]
  numberOfItems: PropTypes.number.isRequired,
  onSetPage: PropTypes.func // function callback when page change, argument will be new number of page
  onPerPageSelect: PropTypes.func // function which is invoked on dropdown select for number of items per page
}
