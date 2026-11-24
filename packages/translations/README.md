# RedHat Cloud Services frontend components - translations

This package is for setting [react-intl](https://www.npmjs.com/package/react-intl) with default messages translated accross the entire platform. For futher understanding how to pass messages and such follow up `react-intl` documentation.


## Runtime catalogs

English lives in one place: each message's `defaultMessage` in source. There is no English catalog, and English locales (`en`, `en-US`, `en-GB`, …) load nothing.

Translations are delivered by Phrase as `locales/<locale>.json` (for example `fr.json`, `zh-CN.json`). `IntlProvider` imports the selected locale's file on demand with a single template `import()` in `src/loadMessages.js`; there is no list of supported locales, so a newly delivered file works without a code change. Package assets copy the files into both CJS and ESM builds, and compiler settings preserve native `import()` in both formats so bundlers split one chunk per file.

The loader canonicalizes the locale (`zh-cn` → `zh-CN`, malformed tags are ignored) and tries the exact tag before its base language (`fr-CA` → `fr`). English defaults remain visible while loading, if a delivery is absent, or if loading fails. Obsolete requests cannot overwrite a newly selected language. Caller-provided messages override loaded catalogs immediately and after loading.

The legacy synchronous `translatedMessages/translatedMessages` deep export is removed. Use `IntlProvider` for lazy bundled catalogs, or continue passing your own flat or locale-keyed messages through its `messages` prop.

## How library UI is translated

Library components follow the nearest react-intl provider's locale and load their own catalog. No app wiring is needed. The app's provider messages override library strings; its formats, time zone and error handling remain in control. Chrome's `data-console-language` attribute on `<html>` carries the requested locale and triggers an early preload when the library module starts. This is separate from `<html lang>`, which describes Chrome's rendered text and stays English when its catalog is unavailable.

### Limitations

- Non-hook helpers and filter factories (for example rule-components `totalRisk(intl)`) return English until their caller re-renders after the catalog arrives.
- On a slow network, the first render can briefly show English.
- Failed or undelivered catalogs are not retried until reload.
- App tests rendering library components under a non-English provider trigger an async load, which can produce `act()` warnings once catalogs ship.
- Never reuse a message ID when its meaning or placeholders change: an app can resolve a translations version newer than its components.

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
    "fr": {
        "app.greetings": "Bonjour {name}"
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
            <IntlProvider locale="fr">
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
