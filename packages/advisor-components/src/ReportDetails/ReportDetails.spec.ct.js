import React from 'react';
import { mount } from '@cypress/react';
import { ReportDetails } from '..';

it('render report details', () => {
  mount(
    <ReportDetails
      report={{
        rule: {
          rule_id: 'ansible_deprecated_repo|ANSIBLE_DEPRECATED_REPO',
          created_at: '2020-04-27T14:37:24.298648Z',
          updated_at: '2022-05-24T05:45:39.928009Z',
          description: 'New Ansible Engine packages are inaccessible when dedicated Ansible repo is not enabled',
          active: true,
          category: {
            id: 1,
            name: 'Availability',
          },
          impact: {
            name: 'Compatibility Error',
            impact: 2,
          },
          likelihood: 2,
          node_id: '3359651',
          tags: 'ansible sbr_services',
          reboot_required: false,
          publish_date: '2018-04-16T10:03:16Z',
          summary: 'New Ansible Engine packages are inaccessible when dedicated Ansible repo is not enabled.\n',
          generic:
            'Since the release of Ansible Engine 2.4, Red Hat will no longer provide future errata from the Extras repo but from a dedicated Ansible repo instead. New Ansible Engine packages are inaccessible when dedicated Ansible repo is not enabled.\n',
          reason:
            'This host has `{{=pydata.package}}` installed and the dedicated Ansible repo `rhel-7-server-ansible-2-rpms` is not enabled. Since the release of Ansible Engine 2.4, Red Hat will no longer provide future errata from the Extras repo but from a dedicated Ansible repo instead. On this host, the new versions of `ansible` package will not be available.\n',
          more_info:
            '* For more information regarding the dedicated Ansible Engine channel, please refer to [Ansible deprecated in the Extras channel](https://access.redhat.com/articles/3359651). \n* For how to use the dedicated Ansible Engine channel, please refer to [How do I Download and Install Red Hat Ansible Engine?](https://access.redhat.com/articles/3174981).\n',
          resolution_set: [
            {
              system_type: 105,
              resolution:
                'Red Hat recommends that you enable the dedicated Ansible repo and update `ansible` package to the latest version.\n  ~~~\n  # subscription-manager repos --enable rhel-7-server-ansible-2-rpms\n  # yum update ansible\n  ~~~\n',
              resolution_risk: {
                name: 'Update Package',
                risk: 1,
              },
              has_playbook: true,
            },
          ],
          total_risk: 2,
        },
        details: {
          type: 'rule',
          package: 'ansible-2.8.18-1.el7ae',
          error_key: 'ANSIBLE_DEPRECATED_REPO',
        },
        resolution:
          'Red Hat recommends that you enable the dedicated Ansible repo and update `ansible` package to the latest version.\n  ~~~\n  # subscription-manager repos --enable rhel-7-server-ansible-2-rpms\n  # yum update ansible\n  ~~~\n',
      }}
      kbaDetail={{ view_uri: 'https://access.redhat.com/solutions/1186753' }}
      kbaLoading={false}
    />
  );
});
