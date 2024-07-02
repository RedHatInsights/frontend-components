# RedHat Cloud Services frontend components - translations

This package is for setting [react-intl](https://www.npmjs.com/package/react-intl) with default messages translated accross entire platform. For futher understanding how to pass messages and such follow up `react-intl` documentation.


## Usage

If you want to translate your app import `IntlProvider` and wrap your piece of app that you want to translate, this will usually be entire application.

```JSX
import React, { Component } from 'react';
import { Routes } from './Routes';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';

class App extends Component {
    // Rest of your app

    render() {
        return (
            <IntlProvider>
                <NotificationsPortal />
                <Routes childProps={this.props} />
            </IntlProvider>
        );
    }
}
```

### Passing messages
By default we provide the most basic strings to be used across multiple apps, however you should always pass your own translated messages to `IntlProvider` so you can use them as you want.

```JSX
import React, { Component } from 'react';
import { Routes } from './Routes';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';

class App extends Component {
    // Rest of your app

    render() {
        return (
            <IntlProvider messages={translatedMessages}>
                <NotificationsPortal />
                <Routes childProps={this.props} />
            </IntlProvider>
        );
    }
}
```

These messages should be object with ids of messages, you can either pass plain object without any differnt languge (if you somehow know which language to use), but you should pass object with multiple languages you support

```JSON
{
    "en": {
        "appp.greetings": "Hello {name}"
    },
    "cs": {
        "app.greetings": "Vítejte {name}"
    }
}
```

### Custom locale

Default locale is calculated either from locale prop or stored locale in localeStorage or browser's locale and if none of these is applicable en is used. So if you want to rewrite calculaed locale pass locale prop to `IntlProvider`

```JSX
import React, { Component } from 'react';
import { Routes } from './Routes';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';

class App extends Component {
    // Rest of your app

    render() {
        return (
            <IntlProvider locale="cs">
                <NotificationsPortal />
                <Routes childProps={this.props} />
            </IntlProvider>
        );
    }
}
```

### Custom localeData

If you want to define your custom languages you can use `updateLocaleData` to pass your own localeData.

```JSX
import React, { Component } from 'react';
import { Routes } from './Routes';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { IntlProvider, updateLocaleData } from '@redhat-cloud-services/frontend-components-translations';
import localeDe from 'react-intl/locale-data/de';

class App extends Component {
    // Rest of your app

    render() {
        updateLocaleData([...localeDe])
        return (
            <IntlProvider>
                <NotificationsPortal />
                <Routes childProps={this.props} />
            </IntlProvider>
        );
    }
}
```

## Export strings from your app
You can use [babel-plugin-react-intl](https://www.npmjs.com/package/babel-plugin-react-intl) to export all of your formatted messages from your app to generate JSON files that will be used by translators.

To join your messages to one JSON that can be uploaded to translate service and combine all languages together you can use `mergeMessages.js` from `@redhat-cloud-services/frontend-components-utilities`. For description of how to pass custom config run `mergeMessages.js --help`

```bash
node node_modules/@redhat-cloud-services/frontend-components-utilities/mergeMessages/mergeMessages.js
```

## Use messages in your app
You have two options when dealing with finding correct ID for `FormattedMessage` component from `react-intl`, either merge default messages and your defined messages together. Or use correct file in correct place.

1) Merging messages together
```JS
import { React } from 'react';
import { FormattedMessage } from 'react-intl';
import { defaultMessages } from '@redhat-cloud-services/frontend-components-translations';

export default () => {
    const messages = {
        ...defaultMessages,
        ...defineMessages({
            someMessage: {
                id: 'myApp.someMessage',
                description: 'Test message',
                defaultMessage: 'Some message used by our App'
            }
        })
    }
    return (
        <div>
            {/* Our custom message */}
            <FormattedMessage {messages.someMessage} />
            {/* Predefined Cancel */}
            <FormattedMessage {messages.cancel} />
        </div>
    )
}

```

## Providing access to intl for a non-components

A file contaning app constants, that is very much not a component can still leverage
translations by using the `intlHelper` function in the following way.

```JS
import { createIntl, createIntlCache } from 'react-intl';
import { intlHelper } from '@redhat-cloud-services/frontend-components-translations';
import messages from './Messages';
const cache = createIntlCache();
const intl = createIntl({
    onError: console.log,
    locale: navigator.language
}, cache);
const intlSettings = {locale: navigator.language}

const IMPACT_LABEL = {
    1: intlHelper(intl.formatMessage(messages.low), intlSettings),
    2: intlHelper(intl.formatMessage(messages.moderate),  intlSettings)),
    3: intlHelper(intl.formatMessage(messages.important),  intlSettings)),
    4: intlHelper(intl.formatMessage(messages.critical),  intlSettings))
    };
```
