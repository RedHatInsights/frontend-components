import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import CriticalBattery from '@redhat-cloud-services/frontend-components/Battery/CriticalBattery';

const MyCmp = () => {
  return (
    <>
      <PrimaryToolbar
        actionsConfig={{
          actions: [
            <Button
              key="Foo"
              data-hcc-index="true"
              data-hcc-title={'bar'}
              data-hcc-alt="create source;add cloud provider"
              variant="primary"
              id="addSourceButton"
            >
              FOO
            </Button>,
          ],
        }}
      />
      <CriticalBattery label="Foo" severity={1} />
    </>
  );
};

export default MyCmp;
