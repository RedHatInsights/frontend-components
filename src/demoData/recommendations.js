/*global module*/

const pub = {};

pub.getRecommendations = (accountNumber, systemId) => {
    return [
        {
            id: 1,
            rule_id: 1,
            system_id: systemId,
            account_number: accountNumber,
            showGraph: true,
            rule: {
                category: "Stability",
                description: "Network/System Configuration of Public Cloud (AWS) (Network MTU)",
                severity: 'WARN',
                optimization: 'high',
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'ACCESS_NETWORK_MTU_MISMATCH',
                summary: 'Non-optimal MTU setting chosen causing degraded performance',
                generic: '',
                confidence: 'high',
                likelihood: 'moderate',
                reliability: 'moderate',
                reason: '<p>This system is running on AWS <strong>EC2-VPC m4.xlarge</strong> instances. Red Hat analysed that <strong>93%</strong> of our customers running a similar deployment, have configured a security group with an inbound custom ICMP rule that returns Destination Unreachable instructing the originating host to use the lowest MTU size along the network path.</p>' +
                '<p>The security group “incoming AMQ” is not configured with a ICMP rule to support path MTU discovery (PMTUD).</p>' +
                '<p>Parameter Value is used in 0.05% of the similar deployments.  Parameter Value is in the 3σ interval.</p>' +
                '<p>Predictive accuracy of the model is <strong>very high.</strong></p>',
                resolution: '<p>Reconfigure security group “incoming AMQ” to include rule:</p><p><code style="display:block;white-space:pre-wrap">Protocol type\tProtocol number\tICMP type\t\t\tICMP code\t\t\t\t\t\tSource IP\nICMP\t\t1\t\t3 (Destination Unreachable)\t4 (Fragmentation Needed and Don\'t Fragment was Set)\t0.0.0.0</code></p>' +
                '<p><span class="ansible-icon supported"><md-icon md-svg-src="static/images/l_ansible-blue.svg" class="material-icons" role="img" aria-hidden="true" style="min-height: 24px;">' +
                '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 2032 2027.2" style="enable-background:new 0 0 2032 2027.2;" xml:space="preserve" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">\n' +
                '<style type="text/css">\n' +
                '\t.st0{fill:#5EBBBD;}\n' +
                '</style>\n' +
                '<path class="st0" d="M2030.8,1014.8c0,559.2-453.3,1012.4-1012.4,1012.4C459.2,2027.2,5.9,1574,5.9,1014.8\n' +
                '\tC5.9,455.7,459.2,2.4,1018.3,2.4C1577.5,2.4,2030.8,455.7,2030.8,1014.8 M1035.4,620.9l262,646.6L901.7,955.8L1035.4,620.9\n' +
                '\tL1035.4,620.9z M1500.8,1416.5l-403-969.9c-11.5-28-34.5-42.8-62.4-42.8c-28,0-52.7,14.8-64.2,42.8L528.9,1510.4h151.3l175.1-438.6\n' +
                '\tl522.5,422.1c21,17,36.2,24.7,55.9,24.7c39.5,0,74-29.6,74-72.3C1507.7,1439.4,1505.3,1428.3,1500.8,1416.5L1500.8,1416.5z"></path>\n' +
                '</svg></md-icon></span>' +
                '&nbsp;&nbsp;Download this Ansible playbook:&nbsp;&nbsp; ' +
                '<a href="static/amq-sg-rule-insights-34313-1522195131560.yml" download><i class="fa fa-download" aria-hidden="true"></i> Download</a></p>',
                more_info: '<ul>' +
                '<li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html#sg-rules-path-mtu">Security Group Rules Reference</a></li>' +
                '<li><a href="https://access.redhat.com/solutions/3059091">How to set MTU per Port/Subnet/Network in Neutron</a></li>' +
                '</ul>'
            }
        },
        {
            id: 3,
            rule_id: 3,
            system_id: systemId,
            account_number: accountNumber,
            rule: {
                category: "Security",
                description: "No significant correlation between number of security related customer cases and applying all errata",
                severity: 'INFO',
                optimization: 'low',
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'SECURITY_ERRATA',
                summary: 'Unapplied Errata',
                generic: '',
                confidence: 'low',
                likelihood: 'low',
                reliability: 'low',
                reason: '<p>This system is insecure because some errata has not been applied</p>\n',
                resolution: '<p>Red Hat recommends that you apply all errata</p>'
            }
        },
        {
            id: 4,
            rule_id: 4,
            system_id: systemId,
            account_number: accountNumber,
            rule: {
                category: "Observation",
                description: "Correlation of traditional system monitoring anomalies",
                severity: 'INFO',
                optimization: 'critical',
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'SECURITY_ERRATA',
                summary: 'System Monitoring Anomalies',
                generic: '',
                confidence: 'critical',
                likelihood: 'critical',
                reliability: 'critical',
                reason: '<p>This system has encountered minor anomalies that may require manual intervention</p>\n',
                resolution: '<p>Red Hat recommends that you investigate anomalies</p>'
            }
        }
    ];
};

module.exports = pub;
