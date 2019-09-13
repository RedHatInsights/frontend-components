# Sources

This package exports **Add Source Wizard** and **Add Source button**.

# Install

```bash
npm install @redhat-cloud-services/frontend-components-sources
```

Please import styles in your scss files, where are you using AddSource Wizard or CardSelect

```css
@import '~@redhat-cloud-services/frontend-components-sources/index.css';
```
 
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


|Prop|Type|Default|Description|
|----|:--:|:-----:|----------:|
|isOpen|bool|false|You need to control yourselves if the wizard is open or not. (Not needed for the button version)|
|afterSuccess|function|null|This function will be executed after closing the wizard successful finish step. In Sources-UI this method is used for updating the list of sources.|
|onClose|function|null|This function will be executed after closing the wizard. Eg. set isOpen to false.|
|successfulMessage|node|'Your source has been successfully added.'|A message shown on the last page of the wizard. Can be customized when accessing from different app (eg. 'Source was added to Cost Management')|
|sourceTypes|array|null|SourceTypes options. This prop can be used on pages, which have already loaded the source types, so there is no need to load them in this component.|
|applicationTypes|array|null|SourceTypes options. This prop can be used on pages, which have already loaded the application types, so there is no need to load them in this component.|


# Additional components

This package also uses and exports other components:

## CardSelect

Use in schema as `component: 'card-select'` after you add it to your component mapper of your data driven form renderer. If you want to use this component outside React final form, please provide custom `meta` and `input` props. (See React Final Form)

**Props**

This components accepts all formGroup props `(label, helperText, isDisabled, isRequired, ...)`


|Prop|Type|Description|
|----|:--:|----------:|
|options|array|Array of options with keys `value`, `label`, `isDisabled`|
|DefaultIcon|element, node, func|Default icon (default is `ServerIcon`)|
|iconMapper*|func|You can use your own mapper `(value, DefaultIcon) => ...` |
|multi/isMulti|bool|Allows to select more items|

\* In the future it could be replaced by data obtained from API