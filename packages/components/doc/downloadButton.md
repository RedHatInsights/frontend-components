# Download Button
A button component specifically made to be used for any download logic.

## Usage
```JSX
import React from 'react'
import { DownloadButton } from '@redhat-cloud-services/frontend-components';

cosnt extraItems = [<DropdownItem key="extra-1" component="button"></DropdownItem>]

const yourCmp = () => {
    <DownloadButton extraItems={extraItems} isDisabled />
}
```

## Props
```JSX
{
  extraItems?: any[];
  tooltipText?: React.ReactNode;
  onSelect?: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>, format: 'csv' | 'json') => void;
  isDisabled?: boolean;
}
```
