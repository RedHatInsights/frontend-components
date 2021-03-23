export const remediationsResponse = {
    'ssg:rhel7|pci-dss|xccdf_org.ssgproject.content_rule_docker_storage_configured': false,
    'ssg:rhel7|pci-dss|xccdf_org.ssgproject.content_rule_service_docker_enabled': false
};

export const system = {
    id: 'aa9c4497-5707-4233-9e9b-1fded5423ef3',
    name: '3.example.com',
    supported: true,
    testResultProfiles: [{
        id: '99a661a8-8cb2-4adf-bf01-62f186493c04',
        refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
        name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
        policy: {
            id: 'ddf5aefb-ecc8-491a-a2ba-81bf17076361'
        },
        rules: [
            {
                title: 'Use direct-lvm with the Device Mapper Storage Driver',
                severity: 'low',
                rationale: 'foorationale',
                refId: 'xccdf_org.ssgproject.content_rule_docker_storage_configured',
                description: 'foodescription',
                compliant: true,
                identifier: JSON.stringify({
                    label: 'CCE-80441-9',
                    system: 'https://nvd.nist.gov/cce/index.cfm'
                }),
                references: JSON.stringify([])
            },
            {
                title: 'Enable the Docker service',
                severity: 'medium',
                rationale: 'foorationale',
                refId: 'xccdf_org.ssgproject.content_rule_service_docker_enabled',
                description: 'foodescription',
                compliant: true,
                identifier: JSON.stringify({
                    label: 'CCE-80440-1',
                    system: 'https://nvd.nist.gov/cce/index.cfm'
                }),
                references: JSON.stringify([])
            },
            {
                title: 'Disable At Service (atd)',
                severity: 'medium',
                rationale: 'The atd service could be used by an unsophisticated insider to carry out activities ',
                refId: 'xccdf_org.ssgproject.content_rule_service_atd_disabled',
                description: 'The at and batch commands can be used to schedule tasks that are meant to be executed',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            }
        ]

    }],
    __typename: 'System'
};

export const profileRules = [
    {
        system: 'aa9c4497-5707-4233-9e9b-1fded5423ef3',
        profile: {
            id: '99a661a8-8cb2-4adf-bf01-62f186493c04',
            refId: 'xccdf_org.ssgproject.content_profile_pci-dss',
            name: 'PCI-DSS v3 Control Baseline for Red Hat Enterprise Linux 7',
            policy: {
                id: 'ddf5aefb-ecc8-491a-a2ba-81bf17076361'
            }
        },
        rulesFailed: 31,
        rulesPassed: 19,
        // Severities summary
        // 5 high
        // 45 medium
        // 2 low
        /* eslint-disable max-len */
        rules: [
            {
                title: 'Use direct-lvm with the Device Mapper Storage Driver',
                severity: 'low',
                rationale: 'foorationale',
                refId: 'xccdf_org.ssgproject.content_rule_docker_storage_configured',
                description: 'foodescription',
                compliant: true,
                identifier: JSON.stringify({
                    label: 'CCE-80441-9',
                    system: 'https://nvd.nist.gov/cce/index.cfm'
                }),
                references: JSON.stringify([])
            },
            {
                title: 'Enable the Docker service',
                severity: 'medium',
                rationale: 'foorationale',
                refId: 'xccdf_org.ssgproject.content_rule_service_docker_enabled',
                description: 'foodescription',
                compliant: true,
                identifier: JSON.stringify({
                    label: 'CCE-80440-1',
                    system: 'https://nvd.nist.gov/cce/index.cfm'
                }),
                references: JSON.stringify([])
            },
            {
                title: 'Disable At Service (atd)',
                severity: 'medium',
                rationale: 'The atd service could be used by an unsophisticated insider to carry out activities outside of a normal login session, which could complicate accountability. Furthermore, the need to schedule tasks with at or batch is not common.',
                refId: 'xccdf_org.ssgproject.content_rule_service_atd_disabled',
                description: 'The at and batch commands can be used to schedule tasks that are meant to be executed only once. This allows delayed execution in a manner similar to cron, except that it is not recurring. The daemon atd keeps track of tasks scheduled via at and batch, and executes them at the specified time. The atd service can be disabled with the following command: $ sudo systemctl disable atd.service',
                compliant: true,
                remediationAvailable: true,
                identifier: null
            },
            {
                title: 'Disable Network Router Discovery Daemon (rdisc)',
                severity: 'medium',
                rationale: 'General-purpose systems typically have their network and routing information configured statically by a system administrator. Workstations or some special-purpose systems often use DHCP (instead of IRDP) to retrieve dynamic network configuration information.',
                refId: 'xccdf_org.ssgproject.content_rule_service_rdisc_disabled',
                description: 'The rdisc service implements the client side of the ICMP Internet Router Discovery Protocol (IRDP), which allows discovery of routers on the local subnet. If a router is discovered then the local routing table is updated with a corresponding default route. By default this daemon is disabled. The rdisc service can be disabled with the following command: $ sudo systemctl disable rdisc.service',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Disable Odd Job Daemon (oddjobd)',
                severity: 'medium',
                rationale: 'The oddjobd service may provide necessary functionality in some environments, and can be disabled if it is not needed. Execution of tasks by privileged programs, on behalf of unprivileged ones, has traditionally been a source of privilege escalation security issues.',
                refId: 'xccdf_org.ssgproject.content_rule_service_oddjobd_disabled',
                description: 'The oddjobd service exists to provide an interface and access control mechanism through which specified privileged tasks can run tasks for unprivileged client applications. Communication with oddjobd through the system message bus. The oddjobd service can be disabled with the following command: $ sudo systemctl disable oddjobd.service',
                compliant: true,
                remediationAvailable: true,
                identifier: null
            },
            {
                title: 'Disable Apache Qpid (qpidd)',
                severity: 'medium',
                rationale: 'The qpidd service is automatically installed when the "base" package selection is selected during installation. The qpidd service listens for network connections, which increases the attack surface of the system. If the system is not intended to receive AMQP traffic, then the qpidd service is not needed and should be disabled or removed.',
                refId: 'xccdf_org.ssgproject.content_rule_service_qpidd_disabled',
                description: 'The qpidd service provides high speed, secure, guaranteed delivery services.  It is an implementation of the Advanced Message Queuing Protocol.  By default the qpidd service will bind to port 5672 and listen for connection attempts. The qpidd service can be disabled with the following command: $ sudo systemctl disable qpidd.service',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Disable Automatic Bug Reporting Tool (abrtd)',
                severity: 'medium',
                rationale: 'Mishandling crash data could expose sensitive information about vulnerabilities in software executing on the system, as well as sensitive information from within a process\'s address space or registers.',
                refId: 'xccdf_org.ssgproject.content_rule_service_abrtd_disabled',
                description: 'The Automatic Bug Reporting Tool (abrtd) daemon collects and reports crash data when an application crash is detected. Using a variety of plugins, abrtd can email crash reports to system administrators, log crash reports to files, or forward crash reports to a centralized issue tracking system such as RHTSupport. The abrtd service can be disabled with the following command: $ sudo systemctl disable abrtd.service',
                compliant: true,
                remediationAvailable: true,
                identifier: null
            },
            {
                title: 'Disable ntpdate Service (ntpdate)',
                severity: 'medium',
                rationale: 'The ntpdate service may only be suitable for systems which are rebooted frequently enough that clock drift does not cause problems between reboots. In any event, the functionality of the ntpdate service is now available in the ntpd program and should be considered deprecated.',
                refId: 'xccdf_org.ssgproject.content_rule_service_ntpdate_disabled',
                description: 'The ntpdate service sets the local hardware clock by polling NTP servers when the system boots. It synchronizes to the NTP servers listed in /etc/ntp/step-tickers or /etc/ntp.conf and then sets the local hardware clock to the newly synchronized system time. The ntpdate service can be disabled with the following command: $ sudo systemctl disable ntpdate.service',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure auditd Collects Information on Kernel Module Loading and Unloading',
                severity: 'medium',
                rationale: 'The addition/removal of kernel modules can be used to alter the behavior of the kernel and potentially introduce malicious code into kernel space. It is important to have an audit trail of modules that have been introduced into the kernel.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_kernel_module_loading',
                description: 'To capture kernel module loading and unloading events, use following lines, setting ARCH to either b32 for 32-bit system, or having two lines for both b32 and b64 in case your system is 64-bit: -w /usr/sbin/insmod -p x -k modules -w /usr/sbin/rmmod -p x -k modules -w /usr/sbin/modprobe -p x -k modules -a always,exit -F arch=ARCH -S init_module,finit_module,create_module,delete_module -F key=modules The place to add the lines depends on a way auditd daemon is configured. If it is configured to use the augenrules program (the default), add the lines to a file with suffix .rules in the directory /etc/audit/rules.d. If the auditd daemon is configured to use the auditctl utility, add the lines to file /etc/audit/audit.rules.',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Attempts to Alter Time Through stime',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_stime',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d for both 32 bit and 64 bit systems: -a always,exit -F arch=b32 -S stime -F key=audit_time_rules Since the 64 bit version of the "stime" system call is not defined in the audit lookup table, the corresponding "-F arch=b64" form of this rule is not expected to be defined on 64 bit systems (the aforementioned "-F arch=b32" stime rule form itself is sufficient for both 32 bit and 64 bit systems). If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file for both 32 bit and 64 bit systems: -a always,exit -F arch=b32 -S stime -F key=audit_time_rules Since the 64 bit version of the "stime" system call is not defined in the audit lookup table, the corresponding "-F arch=b64" form of this rule is not expected to be defined on 64 bit systems (the aforementioned "-F arch=b32" stime rule form itself is sufficient for both 32 bit and 64 bit systems). The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined system calls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record attempts to alter time through settimeofday',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_settimeofday',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S settimeofday -F key=audit_time_rules If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S settimeofday -F key=audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S settimeofday -F key=audit_time_rules If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S settimeofday -F key=audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Attempts to Alter the localtime File',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_watch_localtime',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/localtime -p wa -k audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/localtime -p wa -k audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport and should always be used.',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Attempts to Alter Time Through clock_settime',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_clock_settime',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S clock_settime -F a0=0x0 -F key=time-change If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S clock_settime -F a0=0x0 -F key=time-change The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record attempts to alter time through adjtimex',
                severity: 'medium',
                rationale: 'Arbitrary changes to the system time can be used to obfuscate nefarious activities in log files, as well as to confuse network services that are highly dependent upon an accurate system time (such as sshd). All changes to the system time should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_time_adjtimex',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S adjtimex -F key=audit_time_rules If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S adjtimex -F key=audit_time_rules If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S adjtimex -F key=audit_time_rules If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S adjtimex -F key=audit_time_rules The -k option allows for the specification of a key in string form that can be used for better reporting capability through ausearch and aureport. Multiple system calls can be defined on the same line to save space if desired, but is not required. See an example of multiple combined syscalls: -a always,exit -F arch=b64 -S adjtimex,settimeofday -F key=audit_time_rules',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fchown',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fchown',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchown -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - setxattr',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_setxattr',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S setxattr -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - chown',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_chown',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S chown -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fchownat',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fchownat',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchownat -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - lchown',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_lchown',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S lchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S lchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S lchown -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S lchown -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - chmod',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_chmod',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S chmod -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S chmod -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S chmod -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S chmod -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - removexattr',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_removexattr',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S removexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S removexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S removexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S removexattr -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fchmod',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fchmod',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fchmod -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchmod -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fchmod -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchmod -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - lsetxattr',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_lsetxattr',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S lsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S lsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S lsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S lsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fremovexattr',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fremovexattr',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - lremovexattr',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_lremovexattr',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S lremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S lremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S lremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S lremovexattr -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fsetxattr',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fsetxattr',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fsetxattr -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Discretionary Access Controls - fchmodat',
                severity: 'medium',
                rationale: 'The changing of file permissions could indicate that a user is attempting to gain access to information that would otherwise be disallowed. Auditing DAC modifications can facilitate the identification of patterns of abuse among both authorized and unauthorized users.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_dac_modification_fchmodat',
                description: 'At a minimum, the audit system should collect file permission changes for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S fchmodat -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchmodat -F auid>=1000 -F auid!=unset -F key=perm_mod If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S fchmodat -F auid>=1000 -F auid!=unset -F key=perm_mod If the system is 64 bit then also add the following line: -a always,exit -F arch=b64 -S fchmodat -F auid>=1000 -F auid!=unset -F key=perm_mod',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure auditd Collects File Deletion Events by User',
                severity: 'medium',
                rationale: 'Auditing file deletions will create an audit trail for files that are removed from the system. The audit trail could aid in system troubleshooting, as well as, detecting malicious processes that attempt to delete log files to conceal their presence.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_file_deletion_events',
                description: 'At a minimum the audit system should collect file deletion events for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d, setting ARCH to either b32 or b64 as appropriate for your system: -a always,exit -F arch=ARCH -S rmdir,unlink,unlinkat,rename,renameat -F auid>=1000 -F auid!=unset -F key=delete If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file, setting ARCH to either b32 or b64 as appropriate for your system: -a always,exit -F arch=ARCH -S rmdir,unlink,unlinkat,rename -S renameat -F auid>=1000 -F auid!=unset -F key=delete',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure auditd Collects System Administrator Actions',
                severity: 'medium',
                rationale: 'The actions taken by system administrators should be audited to keep a record of what was executed on the system, as well as, for accountability purposes.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_sysadmin_actions',
                description: 'At a minimum, the audit system should collect administrator actions for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/sudoers -p wa -k actions -w /etc/sudoers.d/ -p wa -k actions If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/sudoers -p wa -k actions -w /etc/sudoers.d/ -p wa -k actions',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure auditd Collects Information on the Use of Privileged Commands',
                severity: 'medium',
                rationale: 'Misuse of privileged functions, either intentionally or unintentionally by authorized users, or by unauthorized external entities that have compromised system accounts, is a serious and ongoing concern and can have significant adverse impacts on organizations. Auditing the use of privileged functions is one way to detect such misuse and identify the risk from insider and advanced persistent threast. Privileged programs are subject to escalation-of-privilege attacks, which attempt to subvert their normal role of providing some necessary but limited capability. As such, motivation exists to monitor these programs for unusual activity.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_privileged_commands',
                description: 'At a minimum, the audit system should collect the execution of privileged commands for all users and root. To find the relevant setuid / setgid programs, run the following command for each local partition PART: $ sudo find PART -xdev -type f -perm -4000 -o -type f -perm -2000 2>/dev/null If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add a line of the following form to a file with suffix .rules in the directory /etc/audit/rules.d for each setuid / setgid program on the system, replacing the SETUID_PROG_PATH part with the full path of that setuid / setgid program in the list: -a always,exit -F path=SETUID_PROG_PATH -F perm=x -F auid>=1000 -F auid!=unset -F key=privileged If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add a line of the following form to /etc/audit/audit.rules for each setuid / setgid program on the system, replacing the SETUID_PROG_PATH part with the full path of that setuid / setgid program in the list: -a always,exit -F path=SETUID_PROG_PATH -F perm=x -F auid>=1000 -F auid!=unset -F key=privileged',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure auditd Collects Unauthorized Access Attempts to Files (unsuccessful)',
                severity: 'medium',
                rationale: 'Unsuccessful attempts to access files could be an indicator of malicious activity on a system. Auditing these events could serve as evidence of potential system compromise.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_unsuccessful_file_modification',
                description: 'At a minimum the audit system should collect unauthorized file accesses for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following lines to a file with suffix .rules in the directory /etc/audit/rules.d: -a always,exit -F arch=b32 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EACCES -F auid>=1000 -F auid!=unset -F key=access -a always,exit -F arch=b32 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EPERM -F auid>=1000 -F auid!=unset -F key=access If the system is 64 bit then also add the following lines: -a always,exit -F arch=b64 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EACCES -F auid>=1000 -F auid!=unset -F key=access -a always,exit -F arch=b64 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EPERM -F auid>=1000 -F auid!=unset -F key=access If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following lines to /etc/audit/audit.rules file: -a always,exit -F arch=b32 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EACCES -F auid>=1000 -F auid!=unset -F key=access -a always,exit -F arch=b32 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EPERM -F auid>=1000 -F auid!=unset -F key=access If the system is 64 bit then also add the following lines: -a always,exit -F arch=b64 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EACCES -F auid>=1000 -F auid!=unset -F key=access -a always,exit -F arch=b64 -S creat,open,openat,open_by_handle_at,truncate,ftruncate -F exit=-EPERM -F auid>=1000 -F auid!=unset -F key=access',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Network Environment',
                severity: 'medium',
                rationale: 'The network environment should not be modified by anything other than administrator action. Any change to network parameters should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_networkconfig_modification',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following lines to a file with suffix .rules in the directory /etc/audit/rules.d, setting ARCH to either b32 or b64 as appropriate for your system: -a always,exit -F arch=ARCH -S sethostname,setdomainname -F key=audit_rules_networkconfig_modification -w /etc/issue -p wa -k audit_rules_networkconfig_modification -w /etc/issue.net -p wa -k audit_rules_networkconfig_modification -w /etc/hosts -p wa -k audit_rules_networkconfig_modification -w /etc/sysconfig/network -p wa -k audit_rules_networkconfig_modification If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following lines to /etc/audit/audit.rules file, setting ARCH to either b32 or b64 as appropriate for your system: -a always,exit -F arch=ARCH -S sethostname,setdomainname -F key=audit_rules_networkconfig_modification -w /etc/issue -p wa -k audit_rules_networkconfig_modification -w /etc/issue.net -p wa -k audit_rules_networkconfig_modification -w /etc/hosts -p wa -k audit_rules_networkconfig_modification -w /etc/sysconfig/network -p wa -k audit_rules_networkconfig_modification',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify User/Group Information',
                severity: 'medium',
                rationale: 'In addition to auditing new user and group accounts, these watches will alert the system administrator(s) to any modifications. Any unexpected users, groups, or modifications should be investigated for legitimacy.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_usergroup_modification',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following lines to a file with suffix .rules in the directory /etc/audit/rules.d, in order to capture events that modify account changes: -w /etc/group -p wa -k audit_rules_usergroup_modification -w /etc/passwd -p wa -k audit_rules_usergroup_modification -w /etc/gshadow -p wa -k audit_rules_usergroup_modification -w /etc/shadow -p wa -k audit_rules_usergroup_modification -w /etc/security/opasswd -p wa -k audit_rules_usergroup_modification If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following lines to /etc/audit/audit.rules file, in order to capture events that modify account changes: -w /etc/group -p wa -k audit_rules_usergroup_modification -w /etc/passwd -p wa -k audit_rules_usergroup_modification -w /etc/gshadow -p wa -k audit_rules_usergroup_modification -w /etc/shadow -p wa -k audit_rules_usergroup_modification -w /etc/security/opasswd -p wa -k audit_rules_usergroup_modification',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure auditd Collects Information on Exporting to Media (successful)',
                severity: 'medium',
                rationale: 'The unauthorized exportation of data to external media could result in an information leak where classified information, Privacy Act information, and intellectual property could be lost. An audit trail should be created each time a filesystem is mounted to help identify and guard against information loss.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_media_export',
                description: 'At a minimum, the audit system should collect media exportation events for all users and root. If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d, setting ARCH to either b32 or b64 as appropriate for your system: -a always,exit -F arch=ARCH -S mount -F auid>=1000 -F auid!=unset -F key=export If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file, setting ARCH to either b32 or b64 as appropriate for your system: -a always,exit -F arch=ARCH -S mount -F auid>=1000 -F auid!=unset -F key=export',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Record Events that Modify the System\'s Mandatory Access Controls',
                severity: 'medium',
                rationale: 'The system\'s mandatory access policy (SELinux) should not be arbitrarily changed by anything other than administrator action. All changes to MAC policy should be audited.',
                refId: 'xccdf_org.ssgproject.content_rule_audit_rules_mac_modification',
                description: 'If the auditd daemon is configured to use the augenrules program to read audit rules during daemon startup (the default), add the following line to a file with suffix .rules in the directory /etc/audit/rules.d: -w /etc/selinux/ -p wa -k MAC-policy If the auditd daemon is configured to use the auditctl utility to read audit rules during daemon startup, add the following line to /etc/audit/audit.rules file: -w /etc/selinux/ -p wa -k MAC-policy',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Enable rsyslog Service',
                severity: 'medium',
                rationale: 'The rsyslog service must be running in order to provide logging services, which are essential to system administration.',
                refId: 'xccdf_org.ssgproject.content_rule_service_rsyslog_enabled',
                description: 'The rsyslog service provides syslog-style logging by default on Red Hat Enterprise Linux 7. The rsyslog service can be enabled with the following command: $ sudo systemctl enable rsyslog.service',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure rsyslog is Installed',
                severity: 'medium',
                rationale: 'The rsyslog package provides the rsyslog daemon, which provides system logging services.',
                refId: 'xccdf_org.ssgproject.content_rule_package_rsyslog_installed',
                description: 'Rsyslog is installed by default. The rsyslog package can be installed with the following command:  $ sudo yum install rsyslog',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure /var/log Located On Separate Partition',
                severity: 'medium',
                rationale: 'Placing /var/log in its own partition enables better separation between log files and other files in /var/.',
                refId: 'xccdf_org.ssgproject.content_rule_partition_for_var_log',
                description: 'System logs are stored in the /var/log directory. Ensure that it has its own partition or logical volume at installation time, or migrate it using LVM.',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Prevent Login to Accounts With Empty Password',
                severity: 'high',
                rationale: 'If an account has an empty password, anyone could log in and run commands with the privileges of that account. Accounts with empty passwords should never be used in operational environments.',
                refId: 'xccdf_org.ssgproject.content_rule_no_empty_passwords',
                description: 'If an account is configured for password authentication but does not have an assigned password, it may be possible to log into the account without authentication. Remove any instances of the nullok option in /etc/pam.d/system-auth to prevent logins with empty passwords.',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure that Root\'s Path Does Not Include World or Group-Writable Directories',
                severity: 'medium',
                rationale: 'Such entries increase the risk that root could execute code provided by unprivileged users, and potentially malicious code.',
                refId: 'xccdf_org.ssgproject.content_rule_accounts_root_path_dirs_no_write',
                description: 'For each element in root\'s path, run: # ls -ld DIR and ensure that write permissions are disabled for group and other.',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure /var/log/audit Located On Separate Partition',
                severity: 'low',
                rationale: 'Placing /var/log/audit in its own partition enables better separation between audit files and other files, and helps ensure that auditing cannot be halted due to the partition running out of space.',
                refId: 'xccdf_org.ssgproject.content_rule_partition_for_var_log_audit',
                description: 'Audit logs are stored in the /var/log/audit directory.  Ensure that it has its own partition or logical volume at installation time, or migrate it later using LVM. Make absolutely certain that it is large enough to store all audit logs that will be created by the auditing daemon.',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Verify and Correct File Permissions with RPM',
                severity: 'high',
                rationale: 'Permissions on system binaries and configuration files that are too generous could allow an unauthorized user to gain privileges that they should not have. The permissions set by the vendor should be maintained. Any deviations from this baseline should be investigated.',
                refId: 'xccdf_org.ssgproject.content_rule_rpm_verify_permissions',
                description: 'The RPM package management system can check file access permissions of installed software packages, including many that are important to system security. Verify that the file permissions of system files and commands match vendor values. Check the file permissions with the following command: $ sudo rpm -Va | awk \'{ if (substr($0,2,1)=="M") print $NF }\' Output indicates files that do not match vendor defaults. After locating a file with incorrect permissions, run the following command to determine which package owns it: $ rpm -qf FILENAME Next, run the following command to reset its permissions to the correct values: $ sudo rpm --setperms PACKAGENAME',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Verify File Hashes with RPM',
                severity: 'high',
                rationale: 'The hashes of important files like system executables should match the information given by the RPM database. Executables with erroneous hashes could be a sign of nefarious activity on the system.',
                refId: 'xccdf_org.ssgproject.content_rule_rpm_verify_hashes',
                description: 'Without cryptographic integrity protections, system executables and files can be altered by unauthorized users without detection. The RPM package management system can check the hashes of installed software packages, including many that are important to system security. To verify that the cryptographic hash of system files and commands match vendor values, run the following command to list which files on the system have hashes that differ from what is expected by the RPM database: $ rpm -Va | grep \'^..5\' A "c" in the second column indicates that a file is a configuration file, which may appropriately be expected to change.  If the file was not expected to change, investigate the cause of the change using audit logs or other means. The package can then be reinstalled to restore the file. Run the following command to determine which package owns the file: $ rpm -qf FILENAME The package can be reinstalled from a yum repository using the command: $ sudo yum reinstall PACKAGENAME Alternatively, the package can be reinstalled from trusted media using the command: $ sudo rpm -Uvh PACKAGENAME',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure Red Hat GPG Key Installed',
                severity: 'high',
                rationale: 'Changes to software components can have significant effects on the overall security of the operating system. This requirement ensures the software has not been tampered with and that it has been provided by a trusted vendor. The Red Hat GPG key is necessary to cryptographically verify packages are from Red Hat.',
                refId: 'xccdf_org.ssgproject.content_rule_ensure_redhat_gpgkey_installed',
                description: 'To ensure the system can cryptographically verify base software packages come from Red Hat (and to connect to the Red Hat Network to receive them), the Red Hat GPG key must properly be installed. To install the Red Hat GPG key, run: $ sudo subscription-manager register If the system is not connected to the Internet or an RHN Satellite, then install the Red Hat GPG key from trusted media such as the Red Hat installation CD-ROM or DVD. Assuming the disc is mounted in /media/cdrom, use the following command as the root user to import it into the keyring: $ sudo rpm --import /media/cdrom/RPM-GPG-KEY',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure gpgcheck Enabled In Main yum Configuration',
                severity: 'high',
                rationale: 'Changes to any software components can have significant effects on the overall security of the operating system. This requirement ensures the software has not been tampered with and that it has been provided by a trusted vendor. Accordingly, patches, service packs, device drivers, or operating system components must be signed with a certificate recognized and approved by the organization. Verifying the authenticity of the software prior to installation validates the integrity of the patch or upgrade received from a vendor. This ensures the software has not been tampered with and that it has been provided by a trusted vendor. Self-signed certificates are disallowed by this requirement. Certificates used to verify the software must be from an approved Certificate Authority (CA).',
                refId: 'xccdf_org.ssgproject.content_rule_ensure_gpgcheck_globally_activated',
                description: 'The gpgcheck option controls whether RPM packages\' signatures are always checked prior to installation. To configure yum to check package signatures before installing them, ensure the following line appears in /etc/yum.conf in the [main] section: gpgcheck=1',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure All SGID Executables Are Authorized',
                severity: 'medium',
                rationale: 'Executable files with the SGID permission run with the privileges of the owner of the file. SGID files of uncertain provenance could allow for unprivileged users to elevate privileges. The presence of these files should be strictly controlled on the system.',
                refId: 'xccdf_org.ssgproject.content_rule_file_permissions_unauthorized_sgid',
                description: 'The SGID (set group id) bit should be set only on files that were installed via authorized means. A straightforward means of identifying unauthorized SGID files is determine if any were not installed as part of an RPM package, which is cryptographically verified. Investigate the origin of any unpackaged SGID files.',
                compliant: false,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure No World-Writable Files Exist',
                severity: 'medium',
                rationale: 'Data in world-writable files can be modified by any user on the system. In almost all circumstances, files can be configured using a combination of user and group permissions to support whatever legitimate access is needed without the risk caused by world-writable files.',
                refId: 'xccdf_org.ssgproject.content_rule_file_permissions_unauthorized_world_writable',
                description: 'It is generally a good idea to remove global (other) write access to a file when it is discovered. However, check with documentation for specific applications before making changes. Also, monitor for recurring world-writable files, as these may be symptoms of a misconfigured application or user account. Finally, this applies to real files and not virtual files that are a part of pseudo file systems such as sysfs or procfs.',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Verify that All World-Writable Directories Have Sticky Bits Set',
                severity: 'medium',
                rationale: 'Failing to set the sticky bit on public directories allows unauthorized users to delete files in the directory structure. The only authorized public directories are those temporary directories supplied with the system, or those designed to be temporary file repositories. The setting is normally reserved for directories used by the system, by users for temporary file storage (such as /tmp), and for directories requiring global read/write access.',
                refId: 'xccdf_org.ssgproject.content_rule_dir_perms_world_writable_sticky_bits',
                description: 'When the so-called \'sticky bit\' is set on a directory, only the owner of a given file may remove that file from the directory. Without the sticky bit, any user with write access to a directory may remove any file in the directory. Setting the sticky bit prevents users from removing each other\'s files. In cases where there is no reason for a directory to be world-writable, a better solution is to remove that permission rather than to set the sticky bit. However, if a directory is used by a particular application, consult that application\'s documentation instead of blindly changing modes. To set the sticky bit on a world-writable directory DIR, run the following command: $ sudo chmod +t DIR',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Ensure All SUID Executables Are Authorized',
                severity: 'medium',
                rationale: 'Executable files with the SUID permission run with the privileges of the owner of the file. SUID files of uncertain provenance could allow for unprivileged users to elevate privileges. The presence of these files should be strictly controlled on the system.',
                refId: 'xccdf_org.ssgproject.content_rule_file_permissions_unauthorized_suid',
                description: 'The SUID (set user id) bit should be set only on files that were installed via authorized means. A straightforward means of identifying unauthorized SGID files is determine if any were not installed as part of an RPM package, which is cryptographically verified. Investigate the origin of any unpackaged SUID files.',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Add nosuid Option to /dev/shm',
                severity: 'medium',
                rationale: 'The presence of SUID and SGID executables should be tightly controlled. Users should not be able to execute SUID or SGID binaries from temporary storage partitions.',
                refId: 'xccdf_org.ssgproject.content_rule_mount_option_dev_shm_nosuid',
                description: 'The nosuid mount option can be used to prevent execution of setuid programs in /dev/shm.  The SUID and SGID permissions should not be required in these world-writable directories. Add the nosuid option to the fourth column of /etc/fstab for the line which controls mounting of /dev/shm.',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Disable the Automounter',
                severity: 'medium',
                rationale: 'Disabling the automounter permits the administrator to statically control filesystem mounting through /etc/fstab. Additionally, automatically mounting filesystems permits easy introduction of unknown devices, thereby facilitating malicious activity.',
                refId: 'xccdf_org.ssgproject.content_rule_service_autofs_disabled',
                description: 'The autofs daemon mounts and unmounts filesystems, such as user home directories shared via NFS, on demand. In addition, autofs can be used to handle removable media, and the default configuration provides the cdrom device as /misc/cd. However, this method of providing access to removable media is not common, so autofs can almost always be disabled if NFS is not in use. Even if NFS is required, it may be possible to configure filesystem mounts statically by editing /etc/fstab rather than relying on the automounter. The autofs service can be disabled with the following command: $ sudo systemctl disable autofs.service',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            },
            {
                title: 'Add nodev Option to /dev/shm',
                severity: 'medium',
                rationale: 'The only legitimate location for device files is the /dev directory located on the root partition. The only exception to this is chroot jails.',
                refId: 'xccdf_org.ssgproject.content_rule_mount_option_dev_shm_nodev',
                description: 'The nodev mount option can be used to prevent creation of device files in /dev/shm. Legitimate character and block devices should not exist within temporary directories like /dev/shm. Add the nodev option to the fourth column of /etc/fstab for the line which controls mounting of /dev/shm.',
                compliant: true,
                remediationAvailable: false,
                identifier: null
            }
        ]
        /* eslint-enable max-len */
    }
];
