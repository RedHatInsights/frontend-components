const moment = require('moment');
const storedData = require('./storedData');
const reports = require('./reports');
const recommendations = require('./recommendations');

const pub = {};

pub.getAsyncSystems = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(pub.getSystems());
    }, 1000)
});

pub.getSystems = () => {
    let lastCheckInTime = storedData.getLastCheckDate();

    let systems = {
        resources: [
            {
                toString: "ec2-18-219-139-54",
                isCheckingIn: true,
                system_id: "d18df352-7ac6-5754-a211-593f23f02ad3",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-219-139-54.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:40.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 105,
                role: 'host',
                product_code: 'rhel',
                product: 'rhel',
                product_name: "Rhel",
                system_status: "error",
                infra_status: "warning",
                reliability: "moderate",
                optimization: "low",
                report_count: 11,
                reports: reports.getReports(),
                recommendations: recommendations.getRecommendations(),
                acks: [],
                parent_id: null,
                stale_ack: false,
                type: 'machine',
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 45, 45, 45, 45, 45, 45],
                    [62, 63, 62, 63, 63, 65, 64, 64, 55, 55, 56, 56, 56, 57]),
                show_recommendation_graphs: true,
                type_tags: [
                    'Prod',
                    'DMZ'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Load Balancer',
                        icon: 'pficon-network status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]
            },
            {
                toString: "ec2-18-188-32-239",
                isCheckingIn: false,
                system_id: "c7ee0976-c397-5157-859b-325c2447dfe0",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-188-32-239.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:40.000Z",
                updated_at: "2018-03-15T04:01:02.000Z",
                unregistered_at: null,
                system_type_id: 325,
                role: "cluster",
                product_code: "ocp",
                product_name: "OpenShift",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]

            },
            {
                toString: "ec2-52-15-147-106",
                isCheckingIn: true,
                system_id: "f98c596f-6cd2-54f5-ba74-c4a64cd8679e",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-52-15-147-106.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:41.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 1002,
                role: "cluster",
                product_code: "database",
                product_name: "SQL Server",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Database',
                        icon: 'fa fa-database status-icon'
                    }
                ]
            },
            {
                toString: "ec2-18-221-171-43",
                isCheckingIn: true,
                system_id: "a1058c72-ab5b-50eb-a7b7-5142578e798d",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-221-171-43.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:41.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 1003,
                role: "host",
                product_code: "app",
                product_name: "Hadoop",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Database',
                        icon: 'fa fa-database status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]

            },
            {
                toString: "ec2-18-216-3-250",
                isCheckingIn: true,
                system_id: "5c223ce0-c591-58ef-abbc-91ff4ccdd7a5",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-216-3-250.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:42.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 49,
                role: "compute",
                product_code: "osp",
                product_name: "OpenStack",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Network',
                        icon: 'pficon-network status-icon'
                    }
                ]

            },
            {
                toString: "ec2-18-222-2-214",
                isCheckingIn: true,
                system_id: "edbc5584-5f2e-5551-89e8-3882dcda0e0a",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-222-2-214.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:43.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 1003,
                role: "host",
                product_code: "app",
                product_name: "JBoss",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]

            },
            {
                toString: "ec2-18-219-252-141",
                isCheckingIn: true,
                system_id: "5240b5e3-ac29-5c3b-b2e9-035f2b1bd6b5",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-219-252-141.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:43.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 99,
                role: "hypervisor",
                product_code: "rhev",
                product_name: "RHEV",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    }
                ]

            },
            {
                toString: "ec2-18-219-122-159",
                isCheckingIn: false,
                system_id: "6668ffea-b94a-53df-a9bd-59a1cf37aac3",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-219-122-159.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:43.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 325,
                role: "cluster",
                product_code: "ocp",
                product_name: "OpenShift",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]
            },
            {
                toString: "ec2-18-217-111-110",
                isCheckingIn: true,
                system_id: "2d328752-830a-54a1-b352-5e6f3ed46602",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-217-111-110.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:44.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 325,
                role: "cluster",
                product_code: "ocp",
                product_name: "OpenShift",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]
            },
            {
                toString: "ec2-18-188-54-229",
                isCheckingIn: true,
                system_id: "88a88789-7f9f-521b-9050-64b00a42c045",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-188-54-229.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:44.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 325,
                role: "cluster",
                product_code: "ocp",
                product_name: "OpenShift",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]
            },
            {
                toString: "ec2-18-222-99-137",
                isCheckingIn: false,
                system_id: "703d7ac1-452c-53a2-b248-cb0453a5a6d5",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-222-99-137.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:44.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 325,
                role: "cluster",
                product_code: "ocp",
                product_name: "OpenShift",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]
            },
            {
                toString: "ec2-18-219-111-214",
                isCheckingIn: true,
                system_id: "48e481e8-c1b7-54e1-abf8-40fc0a714f08",
                display_name: null,
                remote_branch: null,
                remote_leaf: null,
                account_number: "6",
                hostname: "ec2-18-219-111-214.us-east-2.compute.amazonaws.com",
                last_check_in: lastCheckInTime,
                created_at: "2016-09-30T19:19:45.000Z",
                updated_at: "2018-03-15T04:01:01.000Z",
                unregistered_at: null,
                system_type_id: 325,
                role: "cluster",
                product_code: "ocp",
                product_name: "OpenShift",
                system_status: "ok",
                infra_status: "ok",
                reliability: "high",
                optimization: "high",
                report_count: 11,
                policies: {
                    total: 0,
                    resources: [],
                    policies_pass: 0,
                    policies_fail: 0,
                    policies_error: 0
                },
                metadata: {},
                reports: {},
                groups: [],
                peer_rankings: generatePeerRankings(
                    [53, 54, 54, 54, 53, 54, 54, 55, 53, 54, 54, 54, 53, 54],
                    [62, 63, 62, 63, 63, 65, 64, 64, 62, 63, 62, 63, 63, 65]),
                type_tags: [
                    'Prod'
                ],
                system_tags: [
                    {
                        name: 'Linux',
                        icon: 'fa fa-linux status-icon'
                    },
                    {
                        name: 'Server',
                        icon: 'pficon-cluster status-icon'
                    }
                ]
            }
        ],
        total: 272
    };


    if (storedData.isFixed()) {
        let fixedSystem = systems.resources[0];
        fixedSystem.last_check_in = storedData.getLastFixedDate();
        fixedSystem.recommendations = [];
        fixedSystem.reliability = 'high';
        fixedSystem.optimization = 'high';
        fixedSystem.show_recommendation_graphs = false;

        let all_sys_rankings = fixedSystem.peer_rankings.all_systems.y;
        all_sys_rankings[all_sys_rankings.length-1] = 54;
        let industry_rankings = fixedSystem.peer_rankings.industry.y;
        industry_rankings[industry_rankings.length-1] = 65;
    }

    return systems;
};

function generatePeerRankings (allSystemsY, industryY) {
    let timeArray =     [];

    for (let i = -13; i <= 0; i++) {
        let d = moment().add(i, 'd').format('YYYY-MM-DD');
        timeArray.push(d);
    }

    return {
        all_systems: {
            x: timeArray,
            y: allSystemsY
        },
        industry: {
            x: timeArray,
            y: industryY
        }
    }
}


module.exports = pub;
