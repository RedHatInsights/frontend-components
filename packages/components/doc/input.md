# Input
This component will help when using input with any type you want. You don't have to worry about applied classes, just 
pass prop `type` and this component will decide which classes to apply.

### Usage
Import Input component and it's styles, pass which type you want to use (defaults to `text`) and use as you'd use basic
HTML `input`.
```javascript
import { Input } from '@redhat-insights/insights-frontend-components/components/Input';
import '@redhat-insights/insights-frontend-components/components/Input.css'
import React from 'react';

const MyCmp = () => (
  <div>
    <Input type="text" />
    <Input type="radio" />
    <Input type="check" />
  </div>
)

```

### Props