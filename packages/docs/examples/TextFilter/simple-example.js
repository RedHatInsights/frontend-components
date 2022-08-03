import React, { useState } from 'react';
import { TextFilter } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Title } from '@patternfly/react-core';

const RadioFilterExample = () => {
  const [selected, setSelected] = useState();
  return (
    <div>
      <Title headingLevel="h3" size="lg">
        Value
      </Title>
      <code>{JSON.stringify(selected || null, null, 2)}</code>
      {/* This is a part of a composite component, use  "ins-c-conditional-filter" className if used as a standalone*/}
      <div className="ins-c-conditional-filter">
        <TextFilter value={selected} onChange={(_event, newSelection) => setSelected(newSelection)} placeholder="Text filter demo" />
      </div>
    </div>
  );
};

export default RadioFilterExample;
