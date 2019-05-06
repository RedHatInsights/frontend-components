# Tab layout
This component is for aligning tabs horizontally and when clicking on any of them event is fired to notify consumer.
To show coresponding data you can pass whatever you want as children.

## Usage
Best usecase might be with router
```JSX
import react from 'react'
import { Route, withRouter } from 'react-dom-router';
import { TabLayout } from '@red-hat-insights/insights-frontend-components'`
import { SomeCmp } from './SomeCmp';

class YourCmp extends React.Component {
  constructor(props) {
    super(props);
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(event, tab) {
    const { history } = this.props;
    history.push(tab.name);
  }

  render() {
    return (
      <TabLayout items={[{title: 'one', name: 'one'}]} onTabClick={this.onTabChange}>
        <Route exact path="/one" component={SomeCmp}/>
      </TabLayout>
    )
  }
}

export defautl withRouter(YourCmp);
```

## Props
```JS
{
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string
  })),
  children: PropTypes.node,
  classNames: PropTypes.string,
  active: PropTypes.string,
  onTabClick: PropTypes.func(event, tab)
}
```