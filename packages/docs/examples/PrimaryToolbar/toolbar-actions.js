import { Button } from '@patternfly/react-core';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { useState } from 'react';

const ToolbarActions = () => {
  const [filterValue, setFilterValue] = useState('');

  return (
    <div>
      <PrimaryToolbar
        actionsConfig={{
          actions: [
            {
              label: 'ActionOne',
              value: 'action-one',
              props: {
                variant: 'plain',
              },
            },
            {
              label: 'ActionTwo',
              value: 'action-two',
            },
          ],
        }}
        dedicatedAction={<Button onClick={() => alert('Dedicated action callback')}>Always visible action</Button>}
        filterConfig={{ placeholder: 'Filter by string', onChange: ({ target: { value } }) => setFilterValue(value), value: filterValue }}
      />
      <pre className="pf-u-ml-md">{JSON.stringify({ filterValue }, null, 2)}</pre>
    </div>
  );
};

export default ToolbarActions;
