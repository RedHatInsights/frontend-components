**Table of Contents**
- [Sources](#sources)
- [Install](#install)
  - [Using](#using)
- [Modification of the wizard](#modification-of-the-wizard)
- [Format for sourceType schema](#format-for-sourcetype-schema)
  - [Hardcoded component schema](#hardcoded-component-schema)
- [Additional components](#additional-components)
  - [CardSelect](#cardselect)
  - [SourceWizardSummary](#sourcewizardsummary)
  - [Others](#others)

# Sources

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-sources.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-sources)

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
|afterSuccess|function|`null`|This function will be executed after successful creation of a source. In Sources-UI this method is used for updating the list of sources.|
|onClose|function|`null`|This function will be executed after closing the wizard. Eg. set isOpen to false. In case of closing wizard before submitting, form values are passed as the first argument. If source has been successfully created, the source is passed as the second argument.|
|successfulMessage|node|`'Your source has been successfully added.'`|A message shown on the last page of the wizard. Can be customized when accessing from different app (eg. 'Source was added to Cost Management')|
|sourceTypes|array|`null`|SourceTypes array. This prop can be used on pages, which have already loaded the source types, so there is no need to load them in this component.|
|applicationTypes|array|`null`|applicationTypes array. This prop can be used on pages, which have already loaded the application types, so there is no need to load them in this component.|
|initialValues|object|`{}`|Object with initialValues of the form.|
|disableAppSelection|bool|`false`|Flag to disable appSelection.|
|hideSourcesButton|bool|`false`|hide 'Take me to sources' button.|
|returnButtonTitle|node|`'Go back to sources'`|Title of the button shown after success submit. Put your own application name if you neeed.|
|selectedType|string|`undefined`|A name of source type preselected - this will remove the source type selection. (Only for Cloud types.)|
|initialWizardState|object|`undefined`|An initial state passed to the wizard component. See [here](https://data-driven-forms.org/mappers/wizard?mapper=pf4#heading-pf4wizard#initialstate).|
|submitCallback|function|`undefined`|An function that is always called when the submit finishes. `(state) => ...` In case of success, the state is a following object: `{createdSource, sourceTypes, isSubmitted: true}`, in case of any unhandled error: `{values, sourceTypes, isErrored, wizardState, error }` |

If you need to set up and **support only one application** you can provide filtered `applicationTypes` with the only one application, set up `disableAppSelection` to `false` and `initialValues` to:

```jsx
{
    application: {
        application_type_id: 'YOUR_APP_ID'
    }
}
```

# Modification of the wizard

Please, if you need to update the wizard, take a look on a [guide](https://github.com/RedHatInsights/sources-ui/blob/master/doc/update-wizard.md) first.

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

## Hardcoded component schema

In [hardcodedSchema](src/addSourceWizard/hardcodedSchemas.js), there is an object which defines additional UI enhancements of the flow for combinations of sourceTypes and appTypes. The format has following structure: `source-type-name.authenication.auth-type.app-name`. For generic steps use as the app-name `generic`. Each of these objects has following keys:

|key|description|
|---|-----------|
|`additionalFields`|These fields are appended to the authType selection page.|
|name of field (ex. `authentication.password`|This defines additional props for the field (can be used for enhancing of API fields).|
|`additionalSteps`|Defines additional steps.|
|`skipSelection`|If there is only one authType, this flag will cause to skip the selection page.|
|`skipEndpoint`|If it is set to `true`, all `endpoint.*` and `authentications.*` values will be ignored and no endpoint step will be shown to user.|
|`useApplicationAuth`|If it is set to `true`, the `authentication` record will be linked to a `application`, not `endpoint`. Use if you want to avoid using topology for checking source status.|

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

|Prop|Type|Description|
|----|:--:|----------:|
|sourceTypes|array|SourceTypes array with schemas.|
|applicationTypes|array|applicationTypes array with schemas.|
|showApp|bool|Default: `true`, shows the application selection in the summary|
|showAuthType|bool|Default: `true`, shows the authtype selection in the summary|


## Others

This package exports some other components and functions, which are used in [Sources-UI](https://github.com/ManageIQ/sources-ui). They are not intended to be used anywhere else.
