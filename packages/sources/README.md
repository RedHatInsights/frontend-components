**Table of Contents**
- [Sources](#sources)
- [Install](#install)
  - [Using](#using)
- [Format for sourceType schema](#format-for-sourcetype-schema)
- [Additional components](#additional-components)
  - [CardSelect](#cardselect)
  - [SourceWizardSummary](#sourcewizardsummary)
  - [Others](#others)

# Sources

This package exports **Add Source Wizard** and **Add Source button**, as other components, which wizard uses.

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
|isOpen|bool|`false`|You need to control yourselves if the wizard is open or not. (Not needed for the button version)|
|afterSuccess|function|`null`|This function will be executed after closing the wizard successful finish step. In Sources-UI this method is used for updating the list of sources.|
|onClose|function|`null`|This function will be executed after closing the wizard. Eg. set isOpen to false.|
|successfulMessage|node|`'Your source has been successfully added.'`|A message shown on the last page of the wizard. Can be customized when accessing from different app (eg. 'Source was added to Cost Management')|
|sourceTypes|array|`null`|SourceTypes array. This prop can be used on pages, which have already loaded the source types, so there is no need to load them in this component.|
|applicationTypes|array|`null`|applicationTypes array. This prop can be used on pages, which have already loaded the application types, so there is no need to load them in this component.|
|initialValues|object|`{}`|Object with initialValues of the form.|
|disableAppSelection|bool|`false`|Flag to disable appSelection.|
|hideSourcesButton|bool|`false`|hide 'Take me to sources' button.|
|returnButtonTitle|node|`'Go back to sources'`|Title of the button shown after success submit. Put your own application name if you neeed.|

If you need to set up and **support only one application** you can provide filtered `applicationTypes` with the only one application, set up `disableAppSelection` to `false` and `initialValues` to:

```jsx
{
    application: {
        application_type_id: 'YOUR_APP_ID'
    }
}
```

# Format for sourceType schema

```rb
schema = {
  :authentication => {
    :name_of_the_authentication_type => {
      :meta => {
        name: 'Token' # Will be shown in the authentication selection step
      },
      :fields => {
        # DDF Fields, will be shown in the authentication selection step
        {
          :component    => "text-field",
          :name         => "authentication.authtype",
          :hideField    => true,
          :initialValue => "username_password",
          :stepKey      => 'openshift-token-additional-field'
        },
      },
    }
  },
  :endpoint => {
    :title => 'Title', # If the endpoint will be on a separate step
    :hidden => true, # If true, the endpoint step will be hidden, use if all components have `:hideField => true`
    :fields => {
      # DDF Fields
      {:component => "checkbox", :name => "endpoint.verify_ssl", :label => "Verify SSL"},
      ...
    }
  }
}
```

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
|mutator|func|`(option, formOptions) => option`, func which mutates options|

\* In the future it could be replaced by data obtained from API

## SourceWizardSummary

Adds a summary of formValues to the form.

**Props**

This components accepts all formGroup props `(label, helperText, isDisabled, isRequired, ...)`


|Prop|Type|Description|
|----|:--:|----------:|
|sourceTypes|array|SourceTypes array with schemas.|
|applicationTypes|array|applicationTypes array with schemas.|
|showApp|bool|Default: `true`, shows the application selection in the summary|
|showAuthType|bool|Default: `true`, shows the authtype selection in the summary|


## Others

This package exports some other components and functions, which are used in [Sources-UI](https://github.com/ManageIQ/sources-ui). They are not intended to be used anywhere else.