/* eslint-disable camelcase */
import reducer, { isPending } from './systemIssues';
import { SYSTEM_ISSUE_TYPES } from './action-types';

it('should not set loading state', () => {
    const newState = isPending({
        systemIssues: {
            test: 'unchanged',
            advisor: {
                some: 'value'
            }
        }
    });
    expect(newState).toMatchObject({
        systemIssues: {
            test: 'unchanged',
            advisor: {
                some: 'value'
            }
        }
    });
});

describe('advisor', () => {
    it('should change to loading state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_ADVISOR_RECOMMENDATIONS_PENDING]({
            systemIssues: {
                test: 'unchanged',
                advisor: {
                    some: 'value'
                }
            }
        });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                advisor: {
                    isLoaded: false
                }
            }
        });
    });

    it('should NOT change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_ADVISOR_RECOMMENDATIONS_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                advisor: {
                    some: 'value'
                }
            }
        }, {});
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                advisor: {
                    isLoaded: true,
                    criticalCount: undefined
                }
            }
        });
    });

    it('should change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_ADVISOR_RECOMMENDATIONS_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                advisor: {
                    some: 'value'
                }
            }
        }, { payload: [{
            total_risk: 5
        }] });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                advisor: {
                    isLoaded: true,
                    criticalCount: [{
                        total_risk: 5
                    }]
                }
            }
        });
    });
});

describe('cve', () => {
    it('should change to loading state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_CVES_PENDING]({
            systemIssues: {
                test: 'unchanged',
                advisor: {
                    some: 'value'
                }
            }
        });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                cve: {
                    isLoaded: false
                }
            }
        });
    });

    it('should NOT change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_CVES_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                cve: {
                    some: 'value'
                }
            }
        }, {});
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                cve: {
                    isLoaded: true,
                    critical: {
                        count: 0
                    },
                    moderate: {
                        count: 0
                    },
                    important: {
                        count: 0
                    },
                    low: {
                        count: 0
                    }
                }
            }
        });
    });

    it('should change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_CVES_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                cve: {
                    some: 'value'
                }
            }
        }, {
            payload: {
                critical: {
                    meta: {
                        total_items: 1
                    }
                },
                moderate: {
                    meta: {
                        total_items: 2
                    }
                },
                important: {
                    meta: {
                        total_items: 3
                    }
                },
                low: {
                    meta: {
                        total_items: 4
                    }
                }
            }
        });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                cve: {
                    isLoaded: true,
                    critical: {
                        count: 1
                    },
                    moderate: {
                        count: 2
                    },
                    important: {
                        count: 3
                    },
                    low: {
                        count: 4
                    }
                }
            }
        });
    });
});

describe('compliance', () => {
    it('should change to loading state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_COMPLIANCE_POLICIES_PENDING]({
            systemIssues: {
                test: 'unchanged',
                compliance: {
                    some: 'value'
                }
            }
        });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                compliance: {
                    isLoaded: false
                }
            }
        });
    });

    it('should NOT change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_COMPLIANCE_POLICIES_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                compliance: {
                    some: 'value'
                }
            }
        }, {});
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                compliance: {
                    isLoaded: true,
                    profiles: undefined
                }
            }
        });
    });

    it('should change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_COMPLIANCE_POLICIES_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                compliance: {
                    some: 'value'
                }
            }
        }, {
            payload: {
                data: {
                    system: {
                        profiles: [{
                            id: 'something',
                            name: 'some name'
                        }]
                    }
                }
            }
        });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                compliance: {
                    isLoaded: true,
                    profiles: [{
                        id: 'something',
                        name: 'some name'
                    }]
                }
            }
        });
    });
});

describe('patch', () => {
    it('should change to loading state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_ADVISORIES_PENDING]({
            systemIssues: {
                test: 'unchanged',
                patch: {
                    some: 'value'
                }
            }
        });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                patch: {
                    isLoaded: false
                }
            }
        });
    });

    it('should NOT change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_ADVISORIES_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                patch: {
                    some: 'value'
                }
            }
        }, {});
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                patch: {
                    isLoaded: true,
                    bug: {
                        count: 0
                    },
                    enhancement: {
                        count: 0
                    },
                    security: {
                        count: 0
                    }
                }
            }
        });
    });

    it('should change the state', () => {
        const newState = reducer[SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_ADVISORIES_FULFILLED]({
            systemIssues: {
                test: 'unchanged',
                patch: {
                    some: 'value'
                }
            }
        }, {
            payload: {
                data: {
                    attributes: {
                        rhba_count: 1,
                        rhea_count: 1,
                        rhsa_count: 1
                    }
                }
            }
        });
        expect(newState).toMatchObject({
            systemIssues: {
                test: 'unchanged',
                patch: {
                    isLoaded: true,
                    bug: {
                        count: 1
                    },
                    enhancement: {
                        count: 1
                    },
                    security: {
                        count: 1
                    }
                }
            }
        });
    });
});
