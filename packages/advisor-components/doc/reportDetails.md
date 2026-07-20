# Report Details

The component renders the rule evaluation results on a given cluster or system. It takes Markdown templates and polyfills them with report data with the help of [TemplateProcessor](../src/TemplateProcessor/TemplateProcessor.tsx).

## Usage

Import ReportDetails from this package.

```JSX
import React from 'react';
import { Link } from 'react-router-dom';
import { ReportDetails } from '@redhat-cloud-services/frontend-components-advisor-components';

...

const Component = () => (
  <ReportDetails
    report={{
        rule: ruleContent,
        details: systemDetails,
        resolution: resolutionTemplate
    }}
    kbaDetail={{
        publishedTitle: "foo bar article",
        view_uri: "https://foo.bar/docs/123"
    }}
    kbaLoading={false}
  />
);

```

## Properties

The component TS interface is described in [ReportDetails.tsx](../src/ReportDetails//ReportDetails.tsx).

```ts
interface Report {
  rule: RuleContentRhel | RuleContentOcp;
  details: Record<string, string | number>;
  resolution: string;
}

interface ReportDetailsProps {
  report: Report;
  kbaDetail: {
    publishedTitle: string;
    view_uri: string;
  };
  kbaLoading: boolean; // if true, renders skeleton instead of kba link
}
```

* `report`: a JS object that contains:
    * `rule`: a content of the rule.
    * `details`: cluster or system details that are required by the template.
    * `resolution`: resolution steps required to render the "Steps to resolve" section.
* `kbaDetail`: title and URL that points to the corresponding knowledgebase article.
* `kbaLoading`: use this boolean parameter if you want to render a skeleton while fetching the kbaDetail in a separate request (e.g., in RHEL Advisor).