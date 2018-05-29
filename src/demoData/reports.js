/*global module*/

const pub = {};

pub.getReports = (accountNumber, systemId) => {
    return [
        {
            details: {
                vulnerable_version: {
                    PACKAGE_NAMES: [
                        'dnsmasq'
                    ],
                    VULNERABLE_PACKAGES: [
                        'dnsmasq-2.66-21.el7'
                    ]
                },
                libvirtd_enabled: false,
                error_key: 'CVE_2017_14491_WARN',
                release: 7,
                dnsmasq_running: false,
                libvirtd_running: false,
                dnsmasq_enabled: false,
                type: 'rule'
            },
            id: 1095799531,
            rule_id: 'CVE_2017_14491_dnsmasq|CVE_2017_14491_WARN',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>A buffer overflow vulnerability was found in <code>Dnsmasq</code>, a popular lightweight DNS and DHCP server. This can lead to remote code execution. Dnsmasq is used either standalone or directly by applications including <code>libvirt</code>.</p>\n',
                description_html: '<p>Dnsmasq vulnerable to remote code execution via crafted DNS requests (CVE-2017-14491)</p>\n',
                generic_html: '<p>A vulnerability was discovered in Dnsmasq which allows an attacker to overflow a heap buffer and crash or take control of Dnsmasq. This is accomplished through DNS requests to Dnsmasq querying a domain controlled by the attacker. </p>\n<p>Dnsmasq is a popular lightweight DNS and DHCP server, often used in home networks and cloud environments as a caching DNS\nstub resolver and to manage DHCP leases. It is used either standalone or directly by applications including libvirt, and\nin a number of layered products. libvirt is a management tool for managing Linux containers and virtual machines.</p>\n<p>This vulnerability can lead to remote code execution and could be triggered by a malicious user on the network.</p>\n<p>Red Hat recommends that you update Dnsmasq packages to include the <a href="http://access.redhat.com/security/cve/CVE-2017-14491">CVE-2017-14491</a> security release.</p>\n',
                more_info_html: '<ul>\n<li>For more information about this specific flaw, see its <a href="https://access.redhat.com/security/vulnerabilities/3199382">knowledge base article</a>.</li>\n<li>To learn how to upgrade packages, see &quot;<a href="https://access.redhat.com/solutions/9934">What is yum and how do I use it?</a>.&quot;</li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat Products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'ERROR',
                resolution_risk: 1,
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'CVE_2017_14491_dnsmasq|CVE_2017_14491_WARN',
                error_key: 'CVE_2017_14491_WARN',
                plugin: 'CVE_2017_14491_dnsmasq',
                description: 'Dnsmasq vulnerable to remote code execution via crafted DNS requests (CVE-2017-14491)',
                summary: 'A buffer overflow vulnerability was found in `Dnsmasq`, a popular lightweight DNS and DHCP server. This can lead to remote code execution. Dnsmasq is used either standalone or directly by applications including `libvirt`.\n',
                generic: 'A vulnerability was discovered in Dnsmasq which allows an attacker to overflow a heap buffer and crash or take control of Dnsmasq. This is accomplished through DNS requests to Dnsmasq querying a domain controlled by the attacker. \n\nDnsmasq is a popular lightweight DNS and DHCP server, often used in home networks and cloud environments as a caching DNS\nstub resolver and to manage DHCP leases. It is used either standalone or directly by applications including libvirt, and\nin a number of layered products. libvirt is a management tool for managing Linux containers and virtual machines.\n\nThis vulnerability can lead to remote code execution and could be triggered by a malicious user on the network.\n\nRed Hat recommends that you update Dnsmasq packages to include the [CVE-2017-14491](http://access.redhat.com/security/cve/CVE-2017-14491) security release.',
                reason: '<p>This system is vulnerable because:</p>\n<ul>\n<li>It is running a vulnerable package <strong>dnsmasq-2.66-21.el7</strong>.</li>\n\n\n\n\n</ul>\n',
                type: null,
                more_info: '* For more information about this specific flaw, see its [knowledge base article](https://access.redhat.com/security/vulnerabilities/3199382).\n* To learn how to upgrade packages, see "[What is yum and how do I use it?](https://access.redhat.com/solutions/9934)."\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat Products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: '3199382',
                category: 'Security',
                retired: false,
                reboot_required: false,
                publish_date: '2017-10-02T13:00:00.000Z',
                rec_impact: 4,
                rec_likelihood: 2,
                resolution: '<p>Red Hat recommends that you update the <code>dnsmasq</code> package:</p>\n<pre><code># yum update dnsmasq\n</code></pre>',
                severityNum: 3
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 351125,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        },
        {
            details: {
                PACKAGE_NAMES: [
                    'nss',
                    'nss-util'
                ],
                PACKAGES: [
                    'nss-3.21.0-17.el7',
                    'nss-util-3.21.0-2.2.el7_2'
                ],
                type: 'rule',
                error_key: 'CVE_2017_5461_NSS_2'
            },
            id: 959410895,
            rule_id: 'CVE_2017_5461_nss|CVE_2017_5461_NSS_2',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>An out-of-bounds write flaw was found in the way NSS performs certain Base64-decoding operations. It has been assigned <a href="https://access.redhat.com/security/cve/CVE-2017-5461">CVE-2017-5461</a>. A remote attacker in a position to supply the crafted data, such as a certificate, can execute arbitrary code on the system.</p>\n',
                description_html: '<p>Remote code execution vulnerability in NSS via crafted base64 data (CVE-2017-5461)</p>\n',
                generic_html: '<p>An out-of-bounds write flaw was found in the way NSS performs certain Base64-decoding operations. An attacker can use this flaw to create a specially crafted certificate which, when parsed by NSS, can cause it to crash or execute arbitrary code, using the permissions of the user running an application compiled against the NSS library.</p>\n<p>Any application which uses NSS library to parse base64 encoded data could possibly be affected by the flaw. For example:</p>\n<ul>\n<li>Servers compiled against NSS which parse untrusted certificates or any other base64 encoded data from its users.</li>\n<li>Utilities like curl, etc. which use NSS to parse user-provided base64-encoded certificates.</li>\n<li>Applications like Firefox which use NSS to parse client-certificates before passing them to the web server.</li>\n</ul>\n<p>An attacker must be in a position to supply the crafted data.</p>\n<p>Red Hat recommends that you update NSS.</p>\n',
                more_info_html: '<ul>\n<li>For more information about the flaw, see <a href="https://access.redhat.com/security/cve/CVE-2017-5461">CVE-2017-5461</a>.</li>\n<li>To learn how to upgrade packages, see <a href="https://access.redhat.com/solutions/9934">What is yum and how do I use it?</a>.</li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'ERROR',
                resolution_risk: 4,
                ansible: true,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'CVE_2017_5461_nss|CVE_2017_5461_NSS_2',
                error_key: 'CVE_2017_5461_NSS_2',
                plugin: 'CVE_2017_5461_nss',
                description: 'Remote code execution vulnerability in NSS via crafted base64 data (CVE-2017-5461)',
                summary: 'An out-of-bounds write flaw was found in the way NSS performs certain Base64-decoding operations. It has been assigned [CVE-2017-5461](https://access.redhat.com/security/cve/CVE-2017-5461). A remote attacker in a position to supply the crafted data, such as a certificate, can execute arbitrary code on the system.\n',
                generic: 'An out-of-bounds write flaw was found in the way NSS performs certain Base64-decoding operations. An attacker can use this flaw to create a specially crafted certificate which, when parsed by NSS, can cause it to crash or execute arbitrary code, using the permissions of the user running an application compiled against the NSS library.\n\nAny application which uses NSS library to parse base64 encoded data could possibly be affected by the flaw. For example:\n\n* Servers compiled against NSS which parse untrusted certificates or any other base64 encoded data from its users.\n* Utilities like curl, etc. which use NSS to parse user-provided base64-encoded certificates.\n* Applications like Firefox which use NSS to parse client-certificates before passing them to the web server.\n\nAn attacker must be in a position to supply the crafted data.\n\nRed Hat recommends that you update NSS.\n',
                reason: '<p>An out-of-bounds write flaw was found in the way NSS performs certain Base64-decoding operations.</p>\n<p>The host is affected because of the installed packages:</p>\n<ul><li><b>nss-3.21.0-17.el7</b></li><li><b>nss-util-3.21.0-2.2.el7_2</b></li></ul>\n\n\n<p>Red Hat recommends that you update NSS.</p>\n',
                type: null,
                more_info: '* For more information about the flaw, see [CVE-2017-5461](https://access.redhat.com/security/cve/CVE-2017-5461).\n* To learn how to upgrade packages, see [What is yum and how do I use it?](https://access.redhat.com/solutions/9934).\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: null,
                category: 'Security',
                retired: false,
                reboot_required: true,
                publish_date: '2017-12-05T10:08:37.000Z',
                rec_impact: 4,
                rec_likelihood: 2,
                resolution: '<p>Red Hat recommends updating the packages nss and nss-util and rebooting the system.</p>\n<pre><code># yum update nss nss-util\n# reboot\n</code></pre><p><strong>or</strong></p>\n<p>Alternatively, this issue can be addressed without reboot by updating the packages nss and nss-util and restarting long-running processes that use nss and nss-util.</p>\n<p>List installed software packages that depend on nss or nss-util and consider which ones are long-running processes.</p>\n<pre><code># rpm -q --whatrequires nss nss-util\n</code></pre>',
                severityNum: 3
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 351121,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        },
        {
            details: {
                PACKAGE_NAMES: [
                    'sudo'
                ],
                PACKAGES: [
                    'sudo-1.8.6p7-20.el7'
                ],
                type: 'rule',
                error_key: 'CVE_2017_1000368_SUDO_2'
            },
            id: 1085296499,
            rule_id: 'CVE_2017_1000368_sudo|CVE_2017_1000368_SUDO_2',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>A local privilege escalation flaw was found in <code>sudo</code>. A local user having sudo access on the system,\ncould use this flaw to execute arbitrary commands as root. This issue was reported as\n<a href="https://access.redhat.com/security/cve/CVE-2017-1000368">CVE-2017-1000368</a></p>\n',
                description_html: '<p>sudo vulnerable to local privilege escalation via process TTY name parsing (CVE-2017-1000368) impact: Local Privilege Escalation</p>\n',
                generic_html: '<p>A local privilege escalation flaw was found in <code>sudo</code>. All versions of sudo package shipped with RHEL 5, 6 and 7 are vulnerable\nto a local privilege escalation vulnerability. A flaw was found in the way <code>get_process_ttyname()</code> function obtained\ninformation about the controlling terminal of the sudo process from the status file in the proc filesystem.\nThis allows a local user who has any level of sudo access on the system to execute arbitrary commands as root or\nin certain conditions escalate his privileges to root.</p>\n<p>Red Hat recommends that you update update the <code>sudo</code> package.</p>\n',
                more_info_html: '<ul>\n<li>For more information about the remote code execution flaw, see <a href="https://access.redhat.com/security/cve/CVE-2017-1000368">CVE-2017-1000368</a>.</li>\n<li>For more information about the related remote code execution flaw <a href="https://access.redhat.com/security/cve/CVE-2017-1000367">CVE-2017-1000367</a> see <a href="https://access.redhat.com/security/vulnerabilities/3059071">knowledge base article</a>.</li>\n<li>To learn how to upgrade packages, see &quot;<a href="https://access.redhat.com/solutions/9934">What is yum and how do I use it?</a>&quot;</li>\n<li>To better understand <a href="https://www.sudo.ws/">sudo</a>, see <a href="https://www.sudo.ws/intro.html">Sudo in a Nutshell</a></li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat Products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'WARN',
                resolution_risk: 1,
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'CVE_2017_1000368_sudo|CVE_2017_1000368_SUDO_2',
                error_key: 'CVE_2017_1000368_SUDO_2',
                plugin: 'CVE_2017_1000368_sudo',
                description: 'sudo vulnerable to local privilege escalation via process TTY name parsing (CVE-2017-1000368) impact: Local Privilege Escalation',
                summary: 'A local privilege escalation flaw was found in `sudo`. A local user having sudo access on the system,\ncould use this flaw to execute arbitrary commands as root. This issue was reported as\n[CVE-2017-1000368](https://access.redhat.com/security/cve/CVE-2017-1000368)\n',
                generic: 'A local privilege escalation flaw was found in `sudo`. All versions of sudo package shipped with RHEL 5, 6 and 7 are vulnerable\nto a local privilege escalation vulnerability. A flaw was found in the way `get_process_ttyname()` function obtained\ninformation about the controlling terminal of the sudo process from the status file in the proc filesystem.\nThis allows a local user who has any level of sudo access on the system to execute arbitrary commands as root or\nin certain conditions escalate his privileges to root.\n\nRed Hat recommends that you update update the `sudo` package.\n',
                reason: '<p>This machine is vulnerable because it has vulnerable <code>sudo</code> package <strong>sudo-1.8.6p7-20.el7</strong> installed.</p>\n',
                type: null,
                more_info: '* For more information about the remote code execution flaw, see [CVE-2017-1000368](https://access.redhat.com/security/cve/CVE-2017-1000368).\n* For more information about the related remote code execution flaw [CVE-2017-1000367](https://access.redhat.com/security/cve/CVE-2017-1000367) see [knowledge base article](https://access.redhat.com/security/vulnerabilities/3059071).\n* To learn how to upgrade packages, see "[What is yum and how do I use it?](https://access.redhat.com/solutions/9934)"\n* To better understand [sudo](https://www.sudo.ws/), see [Sudo in a Nutshell](https://www.sudo.ws/intro.html)\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat Products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: '3059071',
                category: 'Security',
                retired: false,
                reboot_required: false,
                publish_date: '2017-08-28T19:00:00.000Z',
                rec_impact: 2,
                rec_likelihood: 2,
                resolution: '<p>Red Hat recommends that you update the <code>sudo</code> package.</p>\n<pre><code># yum update sudo\n</code></pre>',
                severityNum: 2
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 339329,
                    maintenance_plan: {
                        maintenance_id: 33844,
                        name: 'Test 321',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'rhn-support-robwilli',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 351122,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        },
        {
            details: {
                msg: '[    0.000000] kexec: crashkernel=auto resulted in zero bytes of reserved memory.',
                error_key: 'CRASHKERNEL_RESERVATION_FAILED',
                rhel_ver: 7,
                type: 'rule',
                auto_with_low_ram: true
            },
            id: 789481455,
            rule_id: 'crashkernel_reservation_failed|CRASHKERNEL_RESERVATION_FAILED',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>The crashkernel configuration has failed to produce a working kdump environment. Configuration changes must be made to enable vmcore capture.</p>\n',
                description_html: '<p>Kdump crashkernel reservation failed due to improper configuration of crashkernel parameter</p>\n',
                generic_html: '<p>Kdump is unable to reserve memory for the kdump kernel. The kdump service has not started and a vmcore will not be captured if the host crashes, which will make it difficult for our support technicians to determine why the machine crashed.</p>\n',
                more_info_html: '',
                severity: 'WARN',
                resolution_risk: 3,
                ansible: false,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'crashkernel_reservation_failed|CRASHKERNEL_RESERVATION_FAILED',
                error_key: 'CRASHKERNEL_RESERVATION_FAILED',
                plugin: 'crashkernel_reservation_failed',
                description: 'Kdump crashkernel reservation failed due to improper configuration of crashkernel parameter',
                summary: 'The crashkernel configuration has failed to produce a working kdump environment. Configuration changes must be made to enable vmcore capture.\n',
                generic: 'Kdump is unable to reserve memory for the kdump kernel. The kdump service has not started and a vmcore will not be captured if the host crashes, which will make it difficult for our support technicians to determine why the machine crashed.',
                reason: '<p>This host is unable to reserve memory for the kdump kernel:</p>\n<pre><code>[    0.000000] kexec: crashkernel=auto resulted in zero bytes of reserved memory.\n</code></pre><p>This means the kdump service has not started and a vmcore will not be captured if the host crashes, which will make it difficult for our support technicians to determine why the machine crashed.</p>\n',
                type: null,
                more_info: null,
                active: true,
                node_id: '59432',
                category: 'Stability',
                retired: false,
                reboot_required: false,
                publish_date: '2016-10-31T04:08:33.000Z',
                rec_impact: 1,
                rec_likelihood: 3,
                resolution: '<p>Red Hat recommends that you change the <strong>crashkernel</strong> setting in the <em>grub.conf</em> file to fix this issue.</p>\n<p>This host failed to reserved memory with <strong>auto</strong> crashkernel parameter due to low physical memory. The memory must be reserved by explicitly requesting the reservation size, for example: crashkernel=128M.</p>\n<p>For details of <code>crashkernel</code> setting, please refer to the Knowledge article <a href="https://access.redhat.com/solutions/916043">How should the crashkernel parameter be configured for using kdump on RHEL7? </a> to pickup the setting specifically for your host.</p>\n',
                severityNum: 2
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 338246,
                    maintenance_plan: {
                        maintenance_id: 33844,
                        name: 'Test 321',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'rhn-support-robwilli',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 351119,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        },
        {
            details: {
                type: 'rule',
                rtkrn: false,
                kinfo: '3.10.0-514.el7.x86_64',
                error_key: 'LEAPSEC_HRTIMER_EXPIRE_EARLY_CHRONY_WARN'
            },
            id: 860132225,
            rule_id: 'leapsec_hrtimer_expire|LEAPSEC_HRTIMER_EXPIRE_EARLY_CHRONY_WARN',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>High CPU utilization and system crashes occur when leap second events occur due to a bug in the kernel.</p>\n',
                description_html: '<p>System hang, high CPU usage, or application crash during a leap second event with chonyd</p>\n',
                generic_html: '<p>High CPU utilization and system crashes occur when leap second events occur due to a bug in the kernel.</p>\n',
                more_info_html: '',
                severity: 'WARN',
                resolution_risk: 3,
                ansible: true,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'leapsec_hrtimer_expire|LEAPSEC_HRTIMER_EXPIRE_EARLY_CHRONY_WARN',
                error_key: 'LEAPSEC_HRTIMER_EXPIRE_EARLY_CHRONY_WARN',
                plugin: 'leapsec_hrtimer_expire',
                description: 'System hang, high CPU usage, or application crash during a leap second event with chonyd',
                summary: 'High CPU utilization and system crashes occur when leap second events occur due to a bug in the kernel.\n',
                generic: 'High CPU utilization and system crashes occur when leap second events occur due to a bug in the kernel.\n',
                reason: '<p>This system is running <code>kernel</code> with version <code>3.10.0-514.el7.x86_64</code> and <code>chronyd</code> service, which may suffer from system hang, high CPU usage, or application crash issues when a leap second event occurs.</p>\n',
                type: null,
                more_info: null,
                active: true,
                node_id: '154713',
                category: 'Stability',
                retired: false,
                reboot_required: true,
                publish_date: '2018-03-08T13:24:44.000Z',
                rec_impact: 3,
                rec_likelihood: 1,
                resolution: '<p>Red Hat recommends that you update the <code>kernel</code> before December 31st, 2016.</p>\n<p>Update the <code>kernel</code> based on your RHEL versions:</p>\n<ul>\n<li>For RHEL7.3: upgrade to kernel-3.10.0-514.2.2.el7 or later<pre><code># yum upgrade kernel\n</code></pre></li>\n<li>Restart the system to use the new kernel.<pre><code># reboot\n</code></pre></li>\n</ul>\n',
                severityNum: 2
            },
            maintenance_actions: []
        },
        {
            details: {
                kernel_left_fully_exploitable: true,
                vulnerable_kernel_version_release: '3.10.0-514.el7',
                kernel_kpatch_applied: false,
                kernel_vulnerable: true,
                glibc_left_fully_exploitable: true,
                vulnerable_glibc: {
                    PACKAGE_NAMES: [
                        'glibc'
                    ],
                    PACKAGES: [
                        'glibc-2.17-157.el7'
                    ]
                },
                kernel_stap_applied: false,
                error_key: 'CVE_2017_1000364_KERNEL_CVE_2017_1000366_GLIBC_EXPLOITABLE',
                vulnerable_kernel_name: 'kernel',
                nothing_left_fully_exploitable: false,
                type: 'rule',
                glibc_vulnerable: true
            },
            id: 860132235,
            rule_id: 'CVE_2017_1000366_glibc|CVE_2017_1000364_KERNEL_CVE_2017_1000366_GLIBC_EXPLOITABLE',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>A flaw was found in the way memory is being allocated on the stack for user space binaries. It has been assigned <a href="https://access.redhat.com/security/cve/CVE-2017-1000364">CVE-2017-1000364</a> and <a href="https://access.redhat.com/security/cve/CVE-2017-1000366">CVE-2017-1000366</a>. An unprivileged local user can use this flaw to execute arbitrary code as root and increase their privileges on the system.</p>\n',
                description_html: '<p>Kernel and glibc vulnerable to local privilege escalation via stack and heap memory clash (CVE-2017-1000364 and CVE-2017-1000366)</p>\n',
                generic_html: '<p>A flaw was found in the way memory is being allocated on the stack for user space binaries. It has been assigned CVE-2017-1000364 and CVE-2017-1000366. An unprivileged local user can use this flaw to execute arbitrary code as root and increase their privileges on the system.</p>\n<p>If heap and stack memory regions are adjacent to each other, an attacker can use this flaw to jump over the heap/stack gap, cause controlled memory corruption on process stack or heap, and thus increase their privileges on the system. </p>\n<p>An attacker must have access to a local account on the system.</p>\n<p>Red Hat recommends that you update the kernel and glibc.</p>\n',
                more_info_html: '<ul>\n<li>For more information about the flaw, see <a href="https://access.redhat.com/security/vulnerabilities/stackguard">the vulnerability article</a> and <a href="https://access.redhat.com/security/cve/CVE-2017-1000364">CVE-2017-1000364</a> and <a href="https://access.redhat.com/security/cve/CVE-2017-1000366">CVE-2017-1000366</a>.</li>\n<li>To learn how to upgrade packages, see <a href="https://access.redhat.com/solutions/9934">What is yum and how do I use it?</a>.</li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'WARN',
                resolution_risk: 3,
                ansible: true,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'CVE_2017_1000366_glibc|CVE_2017_1000364_KERNEL_CVE_2017_1000366_GLIBC_EXPLOITABLE',
                error_key: 'CVE_2017_1000364_KERNEL_CVE_2017_1000366_GLIBC_EXPLOITABLE',
                plugin: 'CVE_2017_1000366_glibc',
                description: 'Kernel and glibc vulnerable to local privilege escalation via stack and heap memory clash (CVE-2017-1000364 and CVE-2017-1000366)',
                summary: 'A flaw was found in the way memory is being allocated on the stack for user space binaries. It has been assigned [CVE-2017-1000364](https://access.redhat.com/security/cve/CVE-2017-1000364) and [CVE-2017-1000366](https://access.redhat.com/security/cve/CVE-2017-1000366). An unprivileged local user can use this flaw to execute arbitrary code as root and increase their privileges on the system.\n',
                generic: 'A flaw was found in the way memory is being allocated on the stack for user space binaries. It has been assigned CVE-2017-1000364 and CVE-2017-1000366. An unprivileged local user can use this flaw to execute arbitrary code as root and increase their privileges on the system.\n\nIf heap and stack memory regions are adjacent to each other, an attacker can use this flaw to jump over the heap/stack gap, cause controlled memory corruption on process stack or heap, and thus increase their privileges on the system. \n\nAn attacker must have access to a local account on the system.\n\nRed Hat recommends that you update the kernel and glibc.\n',
                reason: '<p>A flaw was found in kernel and glibc in the way memory is being allocated on the stack for user space binaries.</p>\n<p>The host is affected because it is running <strong>kernel-3.10.0-514.el7</strong> and using <strong>glibc-2.17-157.el7</strong>.</p>\n',
                type: null,
                more_info: '* For more information about the flaw, see [the vulnerability article](https://access.redhat.com/security/vulnerabilities/stackguard) and [CVE-2017-1000364](https://access.redhat.com/security/cve/CVE-2017-1000364) and [CVE-2017-1000366](https://access.redhat.com/security/cve/CVE-2017-1000366).\n* To learn how to upgrade packages, see [What is yum and how do I use it?](https://access.redhat.com/solutions/9934).\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: null,
                category: 'Security',
                retired: false,
                reboot_required: true,
                publish_date: '2017-06-19T15:00:00.000Z',
                rec_impact: 2,
                rec_likelihood: 2,
                resolution: '<p>Red Hat recommends updating the <code>kernel</code> and <code>glibc</code> packages and rebooting the system.</p>\n<pre><code># yum update kernel glibc\n# reboot\n</code></pre>',
                severityNum: 2
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 368527,
                    maintenance_plan: {
                        maintenance_id: 12675,
                        name: 'Privilege escalation',
                        description: '',
                        start: null,
                        end: null,
                        created_by: 'rhn-support-wnix',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 339055,
                    maintenance_plan: {
                        maintenance_id: 33844,
                        name: 'Test 321',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'rhn-support-robwilli',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 351120,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        },
        {
            details: {
                bluetooth_service_running: false,
                bluetooth_service_enabled: false,
                package_name: 'kernel',
                modprobe_info: true,
                type: 'rule',
                error_key: 'KERNEL_CVE_2017_1000251_POSSIBLE_DOS',
                release: 7,
                bluetooth_kernel_modules_loaded: [],
                vulnerable_kernel: '3.10.0-514.el7',
                bluetooth_modules_not_blacklisted: [
                    'bnep',
                    'bluetooth',
                    'btusb'
                ],
                rce: false,
                arch: 'x86_64'
            },
            id: 1090560943,
            rule_id: 'CVE_2017_1000251_kernel_blueborne|KERNEL_CVE_2017_1000251_POSSIBLE_DOS',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>A vulnerability in the Linux kernel allowing denial of service, or potentially remote code execution, through Bluetooth stack has been discovered.\nThe issue was reported as <a href="https://access.redhat.com/security/cve/CVE-2017-1000251">CVE-2017-1000251</a>.</p>\n',
                description_html: '<p>Kernel vulnerable to denial of service via Bluetooth stack (CVE-2017-1000251/Blueborne)</p>\n',
                generic_html: '<p>A denial of service, or potentially remote code execution, flaw was found in the implementation of the Bluetooth stack in the Linux kernel.</p>\n<p>A client can send arbitrary L2CAP configuration parameters, which are stored in a stack buffer object. An attacker can cause a buffer overflow when the pending configuration packets received from a client are being processed.</p>\n<p>An unauthenticated user who is able to connect to a system via the Bluetooth protocol, can use this flaw to create a crash, or potentially execute arbitrary code with root privileges on the system.</p>\n<p>Red Hat recommends that you update kernel package and reboot the system or disable Bluetooth.</p>\n',
                more_info_html: '<ul>\n<li>For more information about the kernel flaw in the Bluetooth stack see <a href="https://access.redhat.com/security/vulnerabilities/blueborne">knowledge base article</a>.</li>\n<li>For more information about the difference between denial of service and remote code execution impact see <a href="https://access.redhat.com/blogs/product-security/posts/blueborne">Kernel Stack Protector and BlueBorne</a>.</li>\n<li>To learn how to upgrade packages, see &quot;<a href="https://access.redhat.com/solutions/9934">What is yum and how do I use it?</a>.&quot;</li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat Products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'WARN',
                resolution_risk: 3,
                ansible: true,
                ansible_fix: true,
                ansible_mitigation: false,
                rule_id: 'CVE_2017_1000251_kernel_blueborne|KERNEL_CVE_2017_1000251_POSSIBLE_DOS',
                error_key: 'KERNEL_CVE_2017_1000251_POSSIBLE_DOS',
                plugin: 'CVE_2017_1000251_kernel_blueborne',
                description: 'Kernel vulnerable to denial of service via Bluetooth stack (CVE-2017-1000251/Blueborne)',
                summary: 'A vulnerability in the Linux kernel allowing denial of service, or potentially remote code execution, through Bluetooth stack has been discovered.\nThe issue was reported as [CVE-2017-1000251](https://access.redhat.com/security/cve/CVE-2017-1000251).\n',
                generic: 'A denial of service, or potentially remote code execution, flaw was found in the implementation of the Bluetooth stack in the Linux kernel.\n\nA client can send arbitrary L2CAP configuration parameters, which are stored in a stack buffer object. An attacker can cause a buffer overflow when the pending configuration packets received from a client are being processed.\n\nAn unauthenticated user who is able to connect to a system via the Bluetooth protocol, can use this flaw to create a crash, or potentially execute arbitrary code with root privileges on the system.\n\nRed Hat recommends that you update kernel package and reboot the system or disable Bluetooth.\n',
                reason: '<p>This system is vulnerable to denial of service because:</p>\n<ul>\n<li>It is running a vulnerable kernel <strong>3.10.0-514.el7</strong>.</li>\n<li>It is <strong>x86_64</strong> architecture.</li>\n<li>The stack protector <strong>is</strong> enabled in the kernel.</li>\n\n\n\n<li>The following Bluetooth kernel modules are not blacklisted: <strong>bnep, bluetooth, btusb</strong></li>\n</ul>\n\n<p>The Bluetooth kernel modules are not loaded, but they can be loaded on demand.</p>\n<p>Due to the nature of the <strong>stack protection</strong> feature, code execution cannot be fully ruled out, though we believe it is <strong>unlikely</strong>.</p>\n',
                type: null,
                more_info: '* For more information about the kernel flaw in the Bluetooth stack see [knowledge base article](https://access.redhat.com/security/vulnerabilities/blueborne).\n* For more information about the difference between denial of service and remote code execution impact see [Kernel Stack Protector and BlueBorne](https://access.redhat.com/blogs/product-security/posts/blueborne).\n* To learn how to upgrade packages, see "[What is yum and how do I use it?](https://access.redhat.com/solutions/9934)."\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat Products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: '3177271',
                category: 'Security',
                retired: false,
                reboot_required: true,
                publish_date: '2017-09-12T13:00:00.000Z',
                rec_impact: 3,
                rec_likelihood: 1,
                resolution: '<p>Red Hat recommends that you update the <strong>kernel</strong> package and reboot your system:</p>\n<pre><code># yum update kernel\n# reboot\n</code></pre><p><strong>Alternatively</strong>, you can completely disable Bluetooth:</p>\n<p>The kernel modules can be prevented from being loaded by using the system-wide modprobe rules. \nThe following configuration will prevent these modules from loading at all times:</p>\n<pre><code>​# echo &quot;install bnep /bin/true&quot; &gt;&gt; /etc/modprobe.d/disable-bluetooth.conf\n​# echo &quot;install bluetooth /bin/true&quot; &gt;&gt; /etc/modprobe.d/disable-bluetooth.conf\n​# echo &quot;install btusb /bin/true&quot; &gt;&gt; /etc/modprobe.d/disable-bluetooth.conf\n</code></pre><p>Additionally, once the kernel modules are disabled, the Bluetooth service must be disabled at startup:</p>\n<pre><code># systemctl disable bluetooth.service\n# systemctl mask bluetooth.service\n# systemctl stop bluetooth.service\n</code></pre><p>After the above steps are done, you have to unload the kernel modules:</p>\n<pre><code># rmmod bnep\n# rmmod bluetooth\n# rmmod btusb\n</code></pre><p>It may be difficult to unload all the modules as they may have other dependencies.\nIf you are unable to unload the kernel modules, restart your system:</p>\n<pre><code># reboot\n</code></pre>',
                severityNum: 2
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 336265,
                    maintenance_plan: {
                        maintenance_id: 33760,
                        name: 'Fixing bluetooth issue',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'rhn-support-ahecox',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 338537,
                    maintenance_plan: {
                        maintenance_id: 33844,
                        name: 'Test 321',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'rhn-support-robwilli',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 351123,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        },
        {
            details: {
                kernel_version: '3.10.0-514.el7',
                error_key: 'KERNEL_CVE_2017_1000253_VULNERABLE',
                mitigation: 'none',
                type: 'rule',
                package: 'kernel'
            },
            id: 1093422365,
            rule_id: 'CVE_2017_1000253_loadelf|KERNEL_CVE_2017_1000253_VULNERABLE',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>A flaw was found in the Linux kernel&#39;s implementation of ELF loading for binaries with large data segments. This can lead to memory corruption and privilege escalation when a malicious binary is mapped.</p>\n',
                description_html: '<p>Kernel is vulnerable to memory corruption or local privilege escalation (CVE-2017-1000253)</p>\n',
                generic_html: '<p>A flaw was found in the Linux kernel&#39;s implementation of ELF loading for specially crafted elf binaries. The loader can allow part of their data segment to map over their stack resulting in corruption of the stack, with possible privilege escalation.</p>\n<p>Red Hat recommends that you update your kernel and reboot the system.</p>\n',
                more_info_html: '<ul>\n<li>For more information about this specific flaw, see its <a href="https://access.redhat.com/security/vulnerabilities/3189592">knowledge base article</a>.</li>\n<li>To learn more about setting sysctl options, see <a href="https://access.redhat.com/solutions/2587">How to set sysctl variables on Red Hat Enterprise Linux</a> or the <code>sysctl</code> and <code>sysctl.conf</code> man pages.</li>\n<li>To learn how to upgrade packages, see &quot;<a href="https://access.redhat.com/solutions/9934">What is yum and how do I use it?</a>.&quot;</li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat Products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'WARN',
                resolution_risk: 3,
                ansible: true,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'CVE_2017_1000253_loadelf|KERNEL_CVE_2017_1000253_VULNERABLE',
                error_key: 'KERNEL_CVE_2017_1000253_VULNERABLE',
                plugin: 'CVE_2017_1000253_loadelf',
                description: 'Kernel is vulnerable to memory corruption or local privilege escalation (CVE-2017-1000253)',
                summary: 'A flaw was found in the Linux kernel\'s implementation of ELF loading for binaries with large data segments. This can lead to memory corruption and privilege escalation when a malicious binary is mapped.\n',
                generic: 'A flaw was found in the Linux kernel\'s implementation of ELF loading for specially crafted elf binaries. The loader can allow part of their data segment to map over their stack resulting in corruption of the stack, with possible privilege escalation.\n\nRed Hat recommends that you update your kernel and reboot the system.\n',
                reason: '<p>This system is vulnerable because:</p>\n<ul>\n<li><p>It is running a vulnerable kernel - <strong>3.10.0-514.el7</strong></p>\n</li>\n<li><p>No mitigation is applied</p>\n</li>\n</ul>\n',
                type: null,
                more_info: '* For more information about this specific flaw, see its [knowledge base article](https://access.redhat.com/security/vulnerabilities/3189592).\n* To learn more about setting sysctl options, see [How to set sysctl variables on Red Hat Enterprise Linux](https://access.redhat.com/solutions/2587) or the `sysctl` and `sysctl.conf` man pages.\n* To learn how to upgrade packages, see "[What is yum and how do I use it?](https://access.redhat.com/solutions/9934)."\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat Products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: '3189592',
                category: 'Security',
                retired: false,
                reboot_required: true,
                publish_date: '2017-09-26T15:00:00.000Z',
                rec_impact: 2,
                rec_likelihood: 2,
                resolution: '<p>Red Hat recommends that you update the <code>kernel</code> package and reboot the system.</p>\n<pre><code># yum update kernel\n# reboot\n</code></pre><p><strong>Alternatively,</strong> you can mitigate the issue by switching mmap layout to the legacy model:</p>\n<ul>\n<li>Edit <code>/etc/sysctl.conf</code>, and set the parameter:</li>\n</ul>\n<pre><code>vm.legacy_va_layout = 1\n</code></pre><ul>\n<li>Apply the setting to the running system:</li>\n</ul>\n<pre><code># /sbin/sysctl -p\n</code></pre><ul>\n<li>Verify that <code>vm.legacy_va_layout</code> is now enabled:</li>\n</ul>\n<pre><code># /sbin/sysctl vm.legacy_va_layout\nvm.legacy_va_layout = 1\n</code></pre><p><strong>Please note:</strong> Applications that have demands for large linear address space, such as databases, may not function properly. Be sure to test this mitigation before deploying it into a production environment.</p>\n',
                severityNum: 2
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 368523,
                    maintenance_plan: {
                        maintenance_id: 12675,
                        name: 'Privilege escalation',
                        description: '',
                        start: null,
                        end: null,
                        created_by: 'rhn-support-wnix',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 338796,
                    maintenance_plan: {
                        maintenance_id: 33844,
                        name: 'Test 321',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'rhn-support-robwilli',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 351124,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        },
        {
            details: {
                debugfs_available: null,
                dmesg_available: true,
                package_name: 'kernel',
                release_major: '7',
                dmesg_wrapped: false,
                problems: {
                    v2_vulnerable: true,
                    v3_vulnerable: true,
                    firmware_supports_features: false,
                    v1_vulnerable: true,
                    pti_cmdline_disabled: false,
                    ibpb_cmdline_disabled: false,
                    ibrs_cmdline_disabled: false,
                    kernel_supports_features: false
                },
                error_key: 'KERNEL_CVE_2017_5753_4_CPU_ERROR_2',
                mfr: 'Intel',
                running_kernel: '3.10.0-514.el7.x86_64',
                type: 'rule'
            },
            id: 1145610698,
            rule_id: 'CVE_2017_5753_4_cpu_kernel|KERNEL_CVE_2017_5753_4_CPU_ERROR_2',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>A vulnerability was discovered in modern microprocessors supported by the kernel, whereby an unprivileged attacker can use this flaw to bypass restrictions to gain read access to privileged memory.\nThe issue was reported as <a href="https://access.redhat.com/security/cve/CVE-2017-5753">CVE-2017-5753 / CVE-2017-5715 / Spectre</a> and <a href="https://access.redhat.com/security/cve/CVE-2017-5754">CVE-2017-5754 / Meltdown</a>.</p>\n',
                description_html: '<p>Kernel vulnerable to side-channel attacks in modern microprocessors (CVE-2017-5753/Spectre, CVE-2017-5754/Meltdown)</p>\n',
                generic_html: '<p>An industry-wide issue was found in the manner many modern microprocessors have implemented speculative execution of instructions. There are three primary variants of the issue which differ in the way the speculative execution can be exploited.</p>\n<p>All three rely upon the fact that modern high performance microprocessors implement both speculative execution, and utilize VIPT (Virtually Indexed, Physically Tagged) level 1 data caches that may become allocated with data in the kernel virtual address space during such speculation.</p>\n<p>An unprivileged attacker could use these to read privileged memory by conducting targeted cache side-channel attacks, including memory locations that cross the syscall boundary or the guest/host boundary, or potentially arbitrary host memory addresses.</p>\n<p>Mitigations for these vulnerabilities additionally require firmware/microcode updates from hardware vendors.</p>\n',
                more_info_html: '<ul>\n<li>For more information about the flaws, see <a href="https://access.redhat.com/security/vulnerabilities/speculativeexecution">Kernel Side-Channel Attacks</a>, <a href="https://access.redhat.com/security/cve/CVE-2017-5754">CVE-2017-5754</a>, <a href="https://access.redhat.com/security/cve/CVE-2017-5753">CVE-2017-5753</a>, and <a href="https://access.redhat.com/security/cve/CVE-2017-5715">CVE-2017-5715</a>.</li>\n<li>For possible performance impact of kernel updates, see <a href="https://access.redhat.com/articles/3307751">Speculative Execution Exploit Performance Impacts</a>.</li>\n<li>For information related to VMs, see <a href="https://access.redhat.com/articles/3331571">How do I enable Markdown/Spectre mitigations in my virtualised machines?</a></li>\n<li>Extensive details can be found at the <a href="https://googleprojectzero.blogspot.ca/2018/01/reading-privileged-memory-with-side.html">Project Zero blog</a> and <a href="https://meltdownattack.com/">Meltdown and Spectre Attack webpage</a>.</li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'WARN',
                resolution_risk: 3,
                ansible: false,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'CVE_2017_5753_4_cpu_kernel|KERNEL_CVE_2017_5753_4_CPU_ERROR_2',
                error_key: 'KERNEL_CVE_2017_5753_4_CPU_ERROR_2',
                plugin: 'CVE_2017_5753_4_cpu_kernel',
                description: 'Kernel vulnerable to side-channel attacks in modern microprocessors (CVE-2017-5753/Spectre, CVE-2017-5754/Meltdown)',
                summary: 'A vulnerability was discovered in modern microprocessors supported by the kernel, whereby an unprivileged attacker can use this flaw to bypass restrictions to gain read access to privileged memory.\nThe issue was reported as [CVE-2017-5753 / CVE-2017-5715 / Spectre](https://access.redhat.com/security/cve/CVE-2017-5753) and [CVE-2017-5754 / Meltdown](https://access.redhat.com/security/cve/CVE-2017-5754).\n',
                generic: 'An industry-wide issue was found in the manner many modern microprocessors have implemented speculative execution of instructions. There are three primary variants of the issue which differ in the way the speculative execution can be exploited.\n\nAll three rely upon the fact that modern high performance microprocessors implement both speculative execution, and utilize VIPT (Virtually Indexed, Physically Tagged) level 1 data caches that may become allocated with data in the kernel virtual address space during such speculation.\n\nAn unprivileged attacker could use these to read privileged memory by conducting targeted cache side-channel attacks, including memory locations that cross the syscall boundary or the guest/host boundary, or potentially arbitrary host memory addresses.\n\nMitigations for these vulnerabilities additionally require firmware/microcode updates from hardware vendors.\n',
                reason: '<p>This system is vulnerable to the following variant(s):</p>\n<ul>\n<li>Variant 1 (Spectre/CVE-2017-5753)</li>\n<li>Variant 2 (Spectre/CVE-2017-5715)</li>\n<li>Variant 3 (Meltdown/CVE-2017-5754)</li>\n</ul>\n<p>Factors contributing to these vulnerabilities are:</p>\n<ul>\n<li>This system&#39;s kernel needs updating</li>\n<li>This system needs a firmware update</li>\n</ul>\n<p>Some diagnostic information was unavailable to Insights.</p>\n<ul>\n<li><code>debugfs</code> information was not available. Feature settings were inferred from <code>dmesg</code> and known vendor defaults.</li>\n</ul>\n',
                type: null,
                more_info: '* For more information about the flaws, see [Kernel Side-Channel Attacks](https://access.redhat.com/security/vulnerabilities/speculativeexecution), [CVE-2017-5754](https://access.redhat.com/security/cve/CVE-2017-5754), [CVE-2017-5753](https://access.redhat.com/security/cve/CVE-2017-5753), and [CVE-2017-5715](https://access.redhat.com/security/cve/CVE-2017-5715).\n* For possible performance impact of kernel updates, see [Speculative Execution Exploit Performance Impacts](https://access.redhat.com/articles/3307751).\n* For information related to VMs, see [How do I enable Markdown/Spectre mitigations in my virtualised machines?](https://access.redhat.com/articles/3331571)\n* Extensive details can be found at the [Project Zero blog](https://googleprojectzero.blogspot.ca/2018/01/reading-privileged-memory-with-side.html) and [Meltdown and Spectre Attack webpage](https://meltdownattack.com/).\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: '3244101',
                category: 'Security',
                retired: false,
                reboot_required: true,
                publish_date: '2018-01-22T12:00:00.000Z',
                rec_impact: 3,
                rec_likelihood: 2,
                resolution: '<p><strong>To improve detection reliability:</strong></p>\n<ul>\n<li><p>Kernel debug information was not available. Mount <code>debugfs</code> as follows:  </p>\n<pre><code># mount -t debugfs nodev /sys/kernel/debug\n</code></pre></li>\n</ul>\n<p><strong>To mitigate the vulnerability:</strong></p>\n<ul>\n<li>This system is running a vulnerable kernel. Update the kernel package and reboot:<pre><code># yum update kernel\n# reboot\n</code></pre></li>\n<li>This system needs a firmware update. Contact your system hardware vendor for more information.</li>\n</ul>\n',
                severityNum: 2
            },
            maintenance_actions: []
        },
        {
            details: {
                sshd_config_macs_plus: null,
                fixable_by_updating: true,
                ciphers_recomm: [
                    'aes128-ctr',
                    'aes192-ctr',
                    'aes256-ctr',
                    'aes128-gcm@openssh.com',
                    'aes256-gcm@openssh.com',
                    'chacha20-poly1305@openssh.com',
                    'aes128-cbc',
                    'aes192-cbc',
                    'aes256-cbc'
                ],
                sshd_active_ciphers_vulnerable: [
                    'arcfour256',
                    'arcfour128',
                    '3des-cbc',
                    'blowfish-cbc',
                    'cast128-cbc',
                    'arcfour',
                    'rijndael-cbc@lysator.liu.se'
                ],
                reported_version: 'openssh-server-6.6.1p1-31.el7',
                sshd_config_ciphers_plus: null,
                macs_recomm: [
                    'hmac-sha1-etm@openssh.com',
                    'umac-64-etm@openssh.com',
                    'umac-128-etm@openssh.com',
                    'hmac-sha2-256-etm@openssh.com',
                    'hmac-sha2-512-etm@openssh.com',
                    'hmac-sha1',
                    'umac-64@openssh.com',
                    'umac-128@openssh.com',
                    'hmac-sha2-256',
                    'hmac-sha2-512'
                ],
                sshd_active_macs_vulnerable: [
                    'hmac-md5-etm@openssh.com',
                    'hmac-ripemd160-etm@openssh.com',
                    'hmac-sha1-96-etm@openssh.com',
                    'hmac-md5-96-etm@openssh.com',
                    'hmac-md5',
                    'hmac-ripemd160',
                    'hmac-ripemd160@openssh.com',
                    'hmac-sha1-96',
                    'hmac-md5-96'
                ],
                ciphers_default: [
                    'aes128-ctr',
                    'aes192-ctr',
                    'aes256-ctr',
                    'arcfour256',
                    'arcfour128',
                    'aes128-gcm@openssh.com',
                    'aes256-gcm@openssh.com',
                    'chacha20-poly1305@openssh.com',
                    'aes128-cbc',
                    '3des-cbc',
                    'blowfish-cbc',
                    'cast128-cbc',
                    'aes192-cbc',
                    'aes256-cbc',
                    'arcfour',
                    'rijndael-cbc@lysator.liu.se'
                ],
                error_key: 'OPENSSH_HARDENING_HMAC_CIPHER_2',
                type: 'rule',
                macs_default: [
                    'hmac-md5-etm@openssh.com',
                    'hmac-sha1-etm@openssh.com',
                    'umac-64-etm@openssh.com',
                    'umac-128-etm@openssh.com',
                    'hmac-sha2-256-etm@openssh.com',
                    'hmac-sha2-512-etm@openssh.com',
                    'hmac-ripemd160-etm@openssh.com',
                    'hmac-sha1-96-etm@openssh.com',
                    'hmac-md5-96-etm@openssh.com',
                    'hmac-md5',
                    'hmac-sha1',
                    'umac-64@openssh.com',
                    'umac-128@openssh.com',
                    'hmac-sha2-256',
                    'hmac-sha2-512',
                    'hmac-ripemd160',
                    'hmac-ripemd160@openssh.com',
                    'hmac-sha1-96',
                    'hmac-md5-96'
                ]
            },
            id: 1153866944,
            rule_id: 'hardening_ssh_hmac_cipher|OPENSSH_HARDENING_HMAC_CIPHER_2',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>Recommended security practices for configuring OpenSSH server are not being followed. Some of the earlier OpenSSH HMAC algorithms and ciphers have been found to be vulnerable to attacks.</p>\n',
                description_html: '<p>Decreased security in OpenSSH settings (Ciphers and MACs)</p>\n',
                generic_html: '<p>HMAC algorithms and ciphers, which have been identified as insecure, are configured for use by <code>sshd</code>. </p>\n<p>Red Hat recommends that these ciphers are disabled.</p>\n',
                more_info_html: '<ul>\n<li><a href="https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.4_release_notes/chap-red_hat_enterprise_linux-7.4_release_notes-deprecated_functionality">Deprecated functionality in RHEL 7.4</a></li>\n<li><a href="https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/6.9_technical_notes/chap-red_hat_enterprise_linux-6.9_technical_notes-deprecated_functionality">Deprecated functionality in RHEL 6.9</a></li>\n<li><a href="https://access.redhat.com/blogs/766093/posts/3050871">Enhancing the security of the OS with cryptography changes in Red Hat Enterprise Linux 7.4</a></li>\n<li><a href="https://access.redhat.com/blogs/766093/posts/2787271">Deprecation of Insecure Algorithms and Protocols in RHEL 6.9</a></li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat Products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'INFO',
                resolution_risk: 1,
                ansible: false,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'hardening_ssh_hmac_cipher|OPENSSH_HARDENING_HMAC_CIPHER_2',
                error_key: 'OPENSSH_HARDENING_HMAC_CIPHER_2',
                plugin: 'hardening_ssh_hmac_cipher',
                description: 'Decreased security in OpenSSH settings (Ciphers and MACs)',
                summary: 'Recommended security practices for configuring OpenSSH server are not being followed. Some of the earlier OpenSSH HMAC algorithms and ciphers have been found to be vulnerable to attacks.\n',
                generic: 'HMAC algorithms and ciphers, which have been identified as insecure, are configured for use by `sshd`. \n\nRed Hat recommends that these ciphers are disabled.\n',
                reason: '<p>Insecure SSH settings were detected on the host and it could be more susceptible to attack.</p>\n<p>In your version of SSH (<strong>openssh-server-6.6.1p1-31.el7</strong>), the following insecure ciphers are activated by default: <strong>arcfour256, arcfour128, 3des-cbc, blowfish-cbc, cast128-cbc, arcfour, rijndael-cbc@lysator.liu.se</strong></p>\n<p>The whole list of ciphers activated by default is: <strong>aes128-ctr, aes192-ctr, aes256-ctr, arcfour256, arcfour128, aes128-gcm@openssh.com, aes256-gcm@openssh.com, chacha20-poly1305@openssh.com, aes128-cbc, 3des-cbc, blowfish-cbc, cast128-cbc, aes192-cbc, aes256-cbc, arcfour, rijndael-cbc@lysator.liu.se</strong></p>\n<p>You do not have any explicit settings for ciphers, so defaults are used.</p>\n<p>In your version of SSH (<strong>openssh-server-6.6.1p1-31.el7</strong>), the following insecure HMAC algorithms are activated by default: <strong>hmac-md5-etm@openssh.com, hmac-ripemd160-etm@openssh.com, hmac-sha1-96-etm@openssh.com, hmac-md5-96-etm@openssh.com, hmac-md5, hmac-ripemd160, hmac-ripemd160@openssh.com, hmac-sha1-96, hmac-md5-96</strong></p>\n<p>The whole list of HMAC algorithms activated by default is: <strong>hmac-md5-etm@openssh.com, hmac-sha1-etm@openssh.com, umac-64-etm@openssh.com, umac-128-etm@openssh.com, hmac-sha2-256-etm@openssh.com, hmac-sha2-512-etm@openssh.com, hmac-ripemd160-etm@openssh.com, hmac-sha1-96-etm@openssh.com, hmac-md5-96-etm@openssh.com, hmac-md5, hmac-sha1, umac-64@openssh.com, umac-128@openssh.com, hmac-sha2-256, hmac-sha2-512, hmac-ripemd160, hmac-ripemd160@openssh.com, hmac-sha1-96, hmac-md5-96</strong></p>\n<p>You do not have any explicit settings for MACs, so defaults are used.</p>\n',
                type: null,
                more_info: '* [Deprecated functionality in RHEL 7.4](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.4_release_notes/chap-red_hat_enterprise_linux-7.4_release_notes-deprecated_functionality)\n* [Deprecated functionality in RHEL 6.9](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/6.9_technical_notes/chap-red_hat_enterprise_linux-6.9_technical_notes-deprecated_functionality)\n* [Enhancing the security of the OS with cryptography changes in Red Hat Enterprise Linux 7.4](https://access.redhat.com/blogs/766093/posts/3050871)\n* [Deprecation of Insecure Algorithms and Protocols in RHEL 6.9](https://access.redhat.com/blogs/766093/posts/2787271)\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat Products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: '3351161',
                category: 'Security',
                retired: false,
                reboot_required: false,
                publish_date: '2017-05-16T04:08:34.000Z',
                rec_impact: 1,
                rec_likelihood: 1,
                resolution: '<p>Red Hat recommends that you update <code>openssh-server</code>.</p>\n<pre><code># yum update openssh-server\n</code></pre><p><strong>or</strong></p>\n<p>Alternatively, you can apply the following mitigation:</p>\n<p>Modify <code>/etc/ssh/sshd_config</code>.</p>\n<p>Add the following line to only activate recommended ciphers:</p>\n<pre><code>Ciphers aes128-ctr,aes192-ctr,aes256-ctr,aes128-gcm@openssh.com,aes256-gcm@openssh.com,chacha20-poly1305@openssh.com,aes128-cbc,aes192-cbc,aes256-cbc\n</code></pre><p>Add the following line to only activate recommended HMAC algorithms:</p>\n<pre><code>MACs hmac-sha1-etm@openssh.com,umac-64-etm@openssh.com,umac-128-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,hmac-sha1,umac-64@openssh.com,umac-128@openssh.com,hmac-sha2-256,hmac-sha2-512\n</code></pre><p>Then restart SSHd dervice:</p>\n<pre><code># service sshd restart\n</code></pre><p>Red Hat recommends that you review the new settings and test the performed changes before applying them to production systems.</p>\n',
                severityNum: 1
            },
            maintenance_actions: []
        },
        {
            details: {
                error_key: 'HARDENING_LOGGING_3_LOG_PERMS',
                type: 'rule',
                detected_problem_log_perms: [
                    {
                        log_perms_dirfilename: '/var/log/cron',
                        log_perms_sensitive: true,
                        log_perms_ls_line: '-rw-r--r--.  1 root   root      933 May 30 12:31 cron'
                    }
                ]
            },
            id: 789481445,
            rule_id: 'hardening_logging_log_perms|HARDENING_LOGGING_3_LOG_PERMS',
            system_id: systemId,
            account_number: accountNumber,
            uuid: '14822510-2c41-11e8-b71f-d58122a2d60d',
            date: '2018-03-20T13:17:48.000Z',
            rule: {
                summary_html: '<p>Issues related to system logging and auditing were detected on your system. Important services are disabled or log file permissions are not secure.</p>\n',
                description_html: '<p>Decreased security in system logging permissions</p>\n',
                generic_html: '<p>Issues related to system logging and auditing were detected on your system.</p>\n<p>Red Hat recommends that the logging service <code>rsyslog</code> and the auditing service <code>auditd</code> are enabled and that log files in <code>/var/log</code> have secure permissions.</p>\n',
                more_info_html: '<ul>\n<li><a href="https://access.redhat.com/solutions/1491573">Why is <code>/var/log/cron</code> world readable in RHEL7?</a></li>\n<li><a href="https://access.redhat.com/solutions/39827">How to configure permissions of log files created by rsyslog</a></li>\n<li><a href="https://access.redhat.com/solutions/66805">Permissions defined in /etc/rsyslog.conf are not getting applied on /var/log/boot.log</a></li>\n<li><a href="https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/s2-services-chkconfig.html">Using the chkconfig Utility</a> to configure services on RHEL 6</li>\n<li><a href="https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/System_Administrators_Guide/sect-Managing_Services_with_systemd-Services.html">Managing System Services</a> to configure services on RHEL 7</li>\n<li>The Customer Portal page for the <a href="https://access.redhat.com/security/">Red Hat Security Team</a> contains more information about policies, procedures, and alerts for Red Hat products.</li>\n<li>The Security Team also maintains a frequently updated blog at <a href="https://securityblog.redhat.com">securityblog.redhat.com</a>.</li>\n</ul>\n',
                severity: 'INFO',
                resolution_risk: 4,
                ansible: true,
                ansible_fix: false,
                ansible_mitigation: false,
                rule_id: 'hardening_logging_log_perms|HARDENING_LOGGING_3_LOG_PERMS',
                error_key: 'HARDENING_LOGGING_3_LOG_PERMS',
                plugin: 'hardening_logging_log_perms',
                description: 'Decreased security in system logging permissions',
                summary: 'Issues related to system logging and auditing were detected on your system. Important services are disabled or log file permissions are not secure.\n',
                generic: 'Issues related to system logging and auditing were detected on your system.\n\nRed Hat recommends that the logging service `rsyslog` and the auditing service `auditd` are enabled and that log files in `/var/log` have secure permissions.\n',
                reason: '<p>Log files have permission issues.</p>\n<p>The following files or directories in <code>/var/log</code> have file permissions that differ from the default RHEL configuration and are possibly non-secure. Red Hat recommends that the file permissions be adjusted to more secure settings.</p>\n<table border="1" align="left">\n  <tr>\n    <th style="text-align:center;">File or directory name</th>\n    <th style="text-align:center;">Detected problem</th>\n    <th style="text-align:center;">Output from <code>ls -l</code></th>\n  </tr>\n\n<tr>\n\n<td><code>/var/log/cron</code></td><td>Users other than <code>root</code> can read or write.</td><td><code>-rw-r--r--.  1 root   root      933 May 30 12:31 cron</code></td>\n\n</td>\n\n</table>\n',
                type: null,
                more_info: '* [Why is `/var/log/cron` world readable in RHEL7?](https://access.redhat.com/solutions/1491573)\n* [How to configure permissions of log files created by rsyslog](https://access.redhat.com/solutions/39827)\n* [Permissions defined in /etc/rsyslog.conf are not getting applied on /var/log/boot.log](https://access.redhat.com/solutions/66805)\n* [Using the chkconfig Utility](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/s2-services-chkconfig.html) to configure services on RHEL 6\n* [Managing System Services](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/System_Administrators_Guide/sect-Managing_Services_with_systemd-Services.html) to configure services on RHEL 7\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n',
                active: true,
                node_id: null,
                category: 'Security',
                retired: false,
                reboot_required: false,
                publish_date: '2017-05-16T04:08:34.000Z',
                rec_impact: 1,
                rec_likelihood: 1,
                resolution: '<p>Red Hat recommends that you perform the following adjustments:</p>\n<p>Fixing permission issues depends on whether there is a designated safe group on your system that has Read access to the log files. This situation might exist if you want to allow certain administrators to see the log files without becoming <code>root</code>. To prevent log tampering, no other user than <code>root</code> should have permissions to Write to the log files. (The <code>btmp</code> and <code>wtmp</code> files are owned by the <code>utmp</code> group but other users should still be unable to write to them.)</p>\n<p><strong>Fix for a default RHEL configuration</strong></p>\n<p>(No designated group for reading log files)</p>\n<pre><code>chown root:root /var/log/cron\nchmod u=rw,g-x,o-rwx /var/log/cron\n</code></pre><p><strong>Fix for a configuration with a designated safe group for reading log files</strong></p>\n<p>In the following lines, substitute the name of your designated safe group for the string <code>safegroup</code>:</p>\n<pre><code>chown root:safegroup /var/log/cron\nchmod u=rw,g-x,o-rwx /var/log/cron\n</code></pre><p><strong>Additional information about permissions</strong></p>\n<ul>\n\n<li>/var/log/cron</li>\n\n\n\n\n\n\n\n\n\n\n\n\n\n<ul>\n<li>Permissions are preserved between reboots.</li>\n<li>Permissions are preserved after logrotate.</li>\n<li>Permissions can be changed using chmod, chown.</li>\n<li>If the file doesn&#39;t exist, rsyslog creates the file and sets permissions based on settings in <code>/etc/rsyslog.conf</code>.</li>\n</ul>\n\n\n\n\n<p></ul></p>\n',
                severityNum: 1
            },
            maintenance_actions: [
                {
                    done: false,
                    id: 339642,
                    maintenance_plan: {
                        maintenance_id: 33844,
                        name: 'Test 321',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'rhn-support-robwilli',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                },
                {
                    done: false,
                    id: 351118,
                    maintenance_plan: {
                        maintenance_id: 34287,
                        name: 'amaya',
                        description: null,
                        start: null,
                        end: null,
                        created_by: 'amaya.gil',
                        silenced: false,
                        hidden: false,
                        suggestion: null,
                        remote_branch: null,
                        allow_reboot: true
                    }
                }
            ]
        }
    ];
};

module.exports = pub;
