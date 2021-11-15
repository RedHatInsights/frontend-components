import configureStore from 'redux-mock-store';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import { notificationsMiddleware } from '..';
import { ADD_NOTIFICATION } from '../redux/actions/action-types';

describe('Notifications middleware', () => {
    let initialProps;
    let middlewares;
    let mockStore;

    const defaultReject = {
        title: 'Error title',
        detail: 'Longer detailed description of error message',
        body: {
            title: 'Custom error title path',
            description: 'Custom error descriptio path'
        }
    };

    const requestMock = (shouldFail, rejectBody = defaultReject) => ({
        type: 'FOO',
        payload: new Promise((resolve, reject) =>
            setTimeout(() =>
                shouldFail ? reject(rejectBody) : resolve({ sucess: true }), 500
            ))
    });

    beforeEach(() => {
        initialProps = {};
        middlewares = [ promiseMiddleware(), notificationsMiddleware({ errorNamespaceKey: [ 'errors' ] }) ];
        mockStore = configureStore(middlewares);
        initialProps = {
            store: mockStore({})
        };
    });

    it('should dispatch danger with text from object array payload', () => {
        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }), {
                type: ADD_NOTIFICATION,
                payload: {
                    description: 'Longer detailed description of error message',
                    dismissable: true,
                    title: 'Error',
                    variant: 'danger'
                }
            },
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];
        return initialProps.store.dispatch(requestMock(true, { errors: [{
            title: 'Error',
            detail: 'Longer detailed description of error message'
        }]
        })).catch(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch danger with text from array payload', () => {
        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }), {
                type: ADD_NOTIFICATION,
                payload: {
                    description: 'Longer detailed description of error message',
                    dismissable: true,
                    title: 'Error',
                    variant: 'danger'
                }
            },
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];
        return initialProps.store.dispatch(requestMock(true, [{
            title: 'Error',
            detail: 'Longer detailed description of error message'
        }]
        )).catch(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch danger with text from string payload', () => {
        mockStore = configureStore([ promiseMiddleware(), notificationsMiddleware({ errorNamespaceKey: [ 'errors' ], useStatusText: true }) ]);
        const store = mockStore({});
        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }), {
                type: ADD_NOTIFICATION,
                payload: {
                    description: 'string',
                    dismissable: true,
                    title: 'Error',
                    variant: 'danger'
                }
            },
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];
        return store.dispatch(requestMock(true, 'string')).catch(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should not dispatch any default notification on promise success', () => {
        const expectedActions = [{
            type: 'FOO_PENDING'
        }, {
            type: 'FOO_FULFILLED',
            payload: { sucess: true }
        }];
        return initialProps.store.dispatch(requestMock(false)).then(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch pending and success notifications', () => {
        const expectedActions = [
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: expect.objectContaining({
                    variant: 'info',
                    title: 'pending'
                })
            }),
            expect.objectContaining({
                type: 'FOO_PENDING'
            }),
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: expect.objectContaining({
                    variant: 'success',
                    title: 'success',
                    description: 'description'
                })
            }),
            expect.objectContaining({
                type: 'FOO_FULFILLED',
                payload: { sucess: true }
            }) ];

        const action = {
            ...requestMock(false),
            meta: {
                notifications: {
                    pending: {
                        variant: 'info',
                        title: 'pending'
                    },
                    fulfilled: {
                        variant: 'success',
                        title: 'success',
                        description: 'description'
                    }
                }
            }
        };
        return initialProps.store.dispatch(action).then(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch pending and success notifications with custom configuration', () => {
        middlewares = [ promiseMiddleware(), notificationsMiddleware({
            autoDismiss: false
        }) ];
        mockStore = configureStore(middlewares);
        const store = mockStore({});

        const expectedActions = [
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: expect.objectContaining({
                    variant: 'info',
                    title: 'pending',
                    dismissable: true
                })
            }),
            expect.objectContaining({
                type: 'FOO_PENDING'
            }),
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: expect.objectContaining({
                    variant: 'success',
                    title: 'success',
                    description: 'description',
                    dismissable: true
                })
            }),
            expect.objectContaining({
                type: 'FOO_FULFILLED',
                payload: { sucess: true }
            }) ];

        const action = {
            ...requestMock(false),
            meta: {
                notifications: {
                    pending: {
                        variant: 'info',
                        title: 'pending'
                    },
                    fulfilled: {
                        variant: 'success',
                        title: 'success',
                        description: 'description'
                    }
                }
            }
        };
        return store.dispatch(action).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch error notification using a function', () => {
        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }),
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: expect.objectContaining({
                    variant: 'danger',
                    title: 'error',
                    description: 'description'
                })
            }),
            expect.objectContaining({
                type: 'FOO_REJECTED',
                payload: { title: 'error' }
            })
        ];

        const action = {
            ...requestMock(true, { title: 'error' }),
            meta: {
                notifications: {
                    rejected: (payload) => ({
                        variant: 'danger',
                        title: payload.title,
                        description: 'description'
                    })
                }
            }
        };
        return initialProps.store.dispatch(action).catch(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch error notification automatically', () => {
        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }), {
                type: ADD_NOTIFICATION,
                payload: {
                    description: 'Longer detailed description of error message',
                    dismissable: true,
                    title: 'Error title',
                    variant: 'danger'
                }
            },
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];
        return initialProps.store.dispatch(requestMock(true)).catch(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should not dispatch error notification automatically', () => {
        middlewares = [ promiseMiddleware(), notificationsMiddleware({
            dispatchDefaultFailure: false
        }) ];
        mockStore = configureStore(middlewares);
        const store = mockStore({});
        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }),
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];
        return store.dispatch(requestMock(true)).catch(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch error notification automatically with custom error message structure', () => {
        middlewares = [ promiseMiddleware(), notificationsMiddleware({
            errorTitleKey: 'body.title',
            errorDescriptionKey: 'body.description'
        }) ];
        mockStore = configureStore(middlewares);
        const store = mockStore({});
        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }), {
                type: ADD_NOTIFICATION,
                payload: {
                    description: 'Custom error descriptio path',
                    dismissable: true,
                    title: 'Custom error title path',
                    variant: 'danger'
                }
            },
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];
        return store.dispatch(requestMock(true)).catch(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch notifications with custom suffixes', () => {
        const customSuffixes = [ 'FETCHING', 'SUCCESS', 'FAILED' ];
        middlewares = [ promiseMiddleware({
            promiseTypeSuffixes: customSuffixes
        }), notificationsMiddleware({
            pendingSuffix: 'FETCHING',
            fulfilledSuffix: 'SUCCESS',
            rejectedSuffix: 'FAILED'
        }) ];
        mockStore = configureStore(middlewares);
        const store = mockStore({});

        const action = {
            ...requestMock(false),
            meta: {
                notifications: {
                    pending: {
                        variant: 'info',
                        title: 'pending'
                    },
                    fulfilled: {
                        variant: 'success',
                        title: 'success',
                        description: 'description'
                    }
                }
            }
        };

        const expectedActions = [
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: expect.objectContaining({
                    title: 'pending',
                    variant: 'info'
                })
            }),
            expect.objectContaining({
                type: 'FOO_FETCHING'
            }),
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: expect.objectContaining({
                    title: 'success',
                    description: 'description',
                    variant: 'success'
                })
            }),
            expect.objectContaining({
                type: 'FOO_SUCCESS'
            })
        ];

        return store.dispatch(action).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch custom error notification automatically', () => {
        const action = {
            ...requestMock(true),
            meta: {
                notifications: {
                    rejected: {
                        variant: 'warning',
                        title: 'custom error notification',
                        dismissable: false
                    }
                }
            }
        };

        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }), {
                type: ADD_NOTIFICATION,
                payload: {
                    title: 'custom error notification',
                    variant: 'warning',
                    dismissDelay: 5000,
                    dismissable: false
                }
            },
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];

        return initialProps.store.dispatch(action).catch(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch custom error notification with sentry ID', () => {
        const action = {
            ...requestMock(true, { sentryId: 'some-sentry-UUID' }),
            meta: {
                notifications: {
                    rejected: {
                        variant: 'warning',
                        title: 'Title',
                        dismissable: false
                    }
                }
            }
        };

        const expectedActions = [
            expect.objectContaining({
                type: 'FOO_PENDING'
            }), {
                type: ADD_NOTIFICATION,
                payload: {
                    title: 'Title',
                    variant: 'warning',
                    dismissDelay: 5000,
                    dismissable: false,
                    sentryId: 'some-sentry-UUID'
                }
            },
            expect.objectContaining({
                type: 'FOO_REJECTED'
            })
        ];

        return initialProps.store.dispatch(action).catch(() => {
            expect(initialProps.store.getActions()).toEqual(expectedActions);
        });
    });

    it('should select second message key from configuration', () => {
        middlewares = [ promiseMiddleware(), notificationsMiddleware({
            errorTitleKey: [ 'body.title', 'fooKey' ],
            errorDescriptionKey: [ 'body.description', 'barKey' ]
        }) ];
        mockStore = configureStore(middlewares);
        const store = mockStore({});
        const expectedActions = expect.arrayContaining([
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: {
                    variant: 'danger',
                    dismissable: true,
                    title: 'Second title option',
                    description: 'Second description option'
                }
            }),
            expect.any(Object)
        ]);

        return store.dispatch(requestMock(true, {
            fooKey: 'Second title option',
            barKey: 'Second description option'
        })).catch(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should send sentryId if encountered', () => {
        middlewares = [ promiseMiddleware(), notificationsMiddleware({
            errorTitleKey: [ 'title' ],
            errorDescriptionKey: [ 'description' ]
        }) ];
        mockStore = configureStore(middlewares);
        const store = mockStore({});
        const expectedActions = expect.arrayContaining([
            expect.objectContaining({
                type: ADD_NOTIFICATION,
                payload: {
                    variant: 'danger',
                    dismissable: true,
                    title: 'Title',
                    description: 'Description',
                    sentryId: 'some-sentry-UUID'
                }
            }),
            expect.any(Object)
        ]);

        return store.dispatch(requestMock(true, {
            title: 'Title',
            description: 'Description',
            sentryId: 'some-sentry-UUID'
        })).catch(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
