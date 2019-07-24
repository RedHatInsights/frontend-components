# Sources

This package exports **Add Source Wizard** and **Add Source button**.
 
## Using

As a primary button

```jsx
import { AddSourceButton } from '@redhat-cloud-services/frontend-components-sources';


<AddSourceButton />
```

As a Wizard

```jsx
import { AddSourceWizard } from '@redhat-cloud-services/frontend-components-sources';


<AddSourceWizard isOpen={this.state.isOpen} onClose={ () => this.setIsOpen(false)}/>
```

**Props**


| Prop        | Type           | Default  | Description |
| ------------- |:-------------:| :-----:| ------: |
| isOpen     | bool | false | You need to control yourselves if the wizard is open or not. (Not needed for the button version) |
| afterSuccess     | function | null | This function will be executed after closing the wizard successful finish step. In Sources-UI this method is used for updating the list of sources. |
| onClose     | function | null | This function will be executed after closing the wizard. Eg. set isOpen to false. |
| successfulMessage     | node | 'Your source has been successfully added.' | A message shown on the last page of the wizard. Can be customized when accessing from different app (eg. 'Source was added to Cost Management') |
| sourceTypes     | array | null | SourceTypes options. This prop can be used on pages, which have already loaded the source types, so there is no need to load them in this component. |
