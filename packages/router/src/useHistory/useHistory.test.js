/* eslint-disable react/prop-types */
import React, { Fragment, useEffect, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import ChromeRouter from '../ChromeRouter';
import useHistory from '../useHistory';

const RouterWrapper = ({
    useChromeRouter = false,
    basename,
    children,
    ...props
}) => {
    const Wrapper = useChromeRouter ? ChromeRouter : Fragment;
    return (
        <MemoryRouter {...props}>
            <Wrapper {...(useChromeRouter ? { basename } : {})}>
                {children}
            </Wrapper>
        </MemoryRouter>
    );
};

const MatchComponent = ({ pushParams, method, expectedHistory, done }) => {
    const history = useHistory();
    const [ initialRender, setInitialRender ] = useState(false);
    useEffect(() => {
        if (!initialRender) {
            history[method](...pushParams);
            setInitialRender(true);
        } else {
            expect(history).toEqual(expectedHistory);
            done();
        }
    }, [ initialRender ]);
    return null;
};

describe('useHistory', () => {
    it('should return original history object with original pathname', (done) => {
        const pathname = '/foo/bar/1';
        const expectedHistory = expect.objectContaining({
            location: {
                pathname,
                hash: '',
                key: expect.any(String),
                search: ''
            }
        });
        const MatchComponent = () => {
            const history = useHistory();
            useEffect(() => {
                expect(history).toEqual(expectedHistory);
                done();
            }, []);
            return null;
        };

        mount(
            <RouterWrapper initialEntries={[ pathname ]}>
                <MatchComponent />
            </RouterWrapper>
        );
    });

    it('should not prefix pathname when calling "push"', (done) => {
        const expectedHistory = expect.objectContaining({
            location: {
                pathname: '/baz/quaxx',
                hash: '',
                key: expect.any(String),
                search: ''
            }
        });

        const wrapper = mount(
            <RouterWrapper>
                <MatchComponent pushParams={[ '/baz/quaxx' ]} method="push" done={done} expectedHistory={expectedHistory} />
            </RouterWrapper>
        );

        act(() => {
            wrapper.update();
        });
    });

    it('should return history location pathname basename prefix', (done) => {
        const pathname = '/foo/bar/1';
        const expectedHistory = expect.objectContaining({
            location: {
                pathname: '/1',
                hash: '',
                key: expect.any(String),
                search: ''
            }
        });
        const MatchComponent = () => {
            const history = useHistory();
            useEffect(() => {
                expect(history).toEqual(expectedHistory);
                done();
            }, []);
            return null;
        };

        mount(
            <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={[ pathname ]}>
                <MatchComponent />
            </RouterWrapper>
        );
    });

    it('should prefix pathname when calling "push" from within ChromeRouter', (done) => {
        const expectedHistory = expect.objectContaining({
            location: {
                pathname: '/1',
                hash: '',
                key: expect.any(String),
                search: ''
            },
            entries: [
                // unchanged history stack
                expect.objectContaining({ pathname: '/' }),
                expect.objectContaining({ pathname: '/foo/bar/1' })
            ]
        });

        const wrapper = mount(
            <RouterWrapper useChromeRouter basename="/foo/bar">
                <MatchComponent method="push" pushParams={[ '/1' ]} expectedHistory={expectedHistory} done={done}/>
            </RouterWrapper>
        );

        act(() => {
            wrapper.update();
        });
    });

    it('should ignore prefix pathname when calling "push" from within ChromeRouter', (done) => {
        const expectedHistory = expect.objectContaining({
            location: {
                pathname: '/1',
                hash: '',
                key: expect.any(String),
                search: ''
            },
            entries: [
                // unchanged history stack
                expect.objectContaining({ pathname: '/' }),
                expect.objectContaining({ pathname: '/1' })
            ]
        });

        const wrapper = mount(
            <RouterWrapper useChromeRouter basename="/foo/bar">
                <MatchComponent method="push" pushParams={[ '/1', undefined, true ]} expectedHistory={expectedHistory} done={done} />
            </RouterWrapper>
        );

        act(() => {
            wrapper.update();
        });
    });

    it('should not prefix pathname when calling "replace"', (done) => {
        const expectedHistory = expect.objectContaining({
            location: {
                pathname: '/baz/quaxx',
                hash: '',
                key: expect.any(String),
                search: ''
            }
        });

        const wrapper = mount(
            <RouterWrapper>
                <MatchComponent method="replace" pushParams={[ '/baz/quaxx' ]} expectedHistory={expectedHistory} done={done} />
            </RouterWrapper>
        );

        act(() => {
            wrapper.update();
        });
    });

    it('should prefix pathname when calling "replace" from within ChromeRouter', (done) => {
        const expectedHistory = expect.objectContaining({
            location: {
                pathname: '/1',
                hash: '',
                key: expect.any(String),
                search: ''
            },
            entries: [
                // unchanged history stack
                expect.objectContaining({ pathname: '/foo/bar/1' })
            ]
        });

        const wrapper = mount(
            <RouterWrapper useChromeRouter basename="/foo/bar">
                <MatchComponent method="replace" pushParams={[ '/1' ]} expectedHistory={expectedHistory} done={done} />
            </RouterWrapper>
        );

        act(() => {
            wrapper.update();
        });
    });

    it('should ignore prefix pathname when calling "replace" from within ChromeRouter', (done) => {
        const expectedHistory = expect.objectContaining({
            location: {
                pathname: '/1',
                hash: '',
                key: expect.any(String),
                search: ''
            },
            entries: [
                // unchanged history stack
                expect.objectContaining({ pathname: '/1' })
            ]
        });

        const wrapper = mount(
            <RouterWrapper useChromeRouter basename="/foo/bar">
                <MatchComponent method="replace" pushParams={[ '/1', undefined, true ]} expectedHistory={expectedHistory} done={done} />
            </RouterWrapper>
        );

        act(() => {
            wrapper.update();
        });
    });
});
