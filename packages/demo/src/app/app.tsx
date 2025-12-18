import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { CriticalBattery } from '@redhat-cloud-services/frontend-components/Battery';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { RuleDetails } from '@redhat-cloud-services/frontend-components-advisor-components/RuleDetails';
import { AdvisorProduct } from '@redhat-cloud-services/frontend-components-advisor-components';

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
      <CriticalBattery label="Foo" severity="critical" />
      <RuleDetails
        isDetailsPage={false}
        product={AdvisorProduct.ocp}
        rule={{
          active: false,
          category: {
            id: 1,
            name: 'Foo',
          },
          description: 'Foo',
          created_at: new Date().toString(),
          deleted_at: new Date().toString(),
          disabled: false,
          generic: 'false',
          hosts_acked_count: 1,
          impact: {
            impact: 1,
            name: 'Foo',
          },
          likelihood: 1,
          impacted_clusters_count: 1,
          impacted_systems_count: 1,
          more_info: 'foo',
          node_id: 'foo',
          playbook_count: 1,
          publish_date: new Date().toString(),
          rating: 1,
          reason: 'foo',
          reboot_required: false,
          reports_shown: true,
          resolution: 'foo',
          resolution_set: [],
          rule_id: 'foo',
          risk_of_change: 1,
          rule_status: 'foo',
          summary: 'foo',
          tags: [],
          total_risk: 1,
          updated_at: new Date().toString(),
        }}
        messages={{
          feedbackThankYou: 'Foo',
          impactDescription: 'Foo',
          impactLevel: 'foo',
          riskOfChange: 1,
          riskOfChangeLabel: 'Foo',
          riskOfChangeText: 'Foo',
          ruleHelpful: true,
          rulesDetailsTotalRiskBody: 'Foo',
          totalRisk: 1,
          knowledgebaseArticle: 'Foo',
          systemReboot: 'Foo',
          likelihoodLevel: 'foo',
          likelihoodDescription: 'Foo',
        }}
      />
    </>
  );
};

export default MyCmp;
