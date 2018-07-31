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