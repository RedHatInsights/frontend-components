/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount, render } from 'enzyme';
import ChromeRouter from '../ChromeRouter';
import useRouteMatch from '../useRouteMatch';

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

describe('useRouteMatch', () => {
    it('should use original history match', (done) => {
        const path = '/foo/bar/:id';
        const expectMatch = {
            isExact: true,
            params: {
                id: '1'
            },
            path,
            url: '/foo/bar/1'
        };
        const MatchComponent = () => {
            const match = useRouteMatch(path);
            useEffect(() => {
                expect(match).toEqual(expectMatch);
                done();
            }, []);
            return null;
        };

        mount(
            <RouterWrapper initialEntries={[ '/foo/bar/1' ]}>
                <Route path={path}>
                    <MatchComponent />
                </Route>
            </RouterWrapper>
        );
    });

    it('should match nested Chrome router with extra basename', (done) => {
        const path = '/:id';
        const expectMatch = {
            isExact: true,
            params: {
                id: '1'
            },
            path,
            url: '/1'
        };
        const MatchComponent = () => {
            const match = useRouteMatch(path);
            useEffect(() => {
                expect(match).toEqual(expectMatch);
                done();
            }, []);
            return null;
        };

        mount(
            <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={[ '/foo/bar/1' ]}>
                <Route path={path}>
                    <MatchComponent />
                </Route>
            </RouterWrapper>
        );
    });

    it('should match nested Chrome router with extra basename and no param', (done) => {
        const path = '/:id';
        const expectMatch = {
            isExact: false,
            params: {},
            path: '/',
            url: '/'
        };
        const MatchComponent = () => {
            const match = useRouteMatch();
            useEffect(() => {
                expect(match).toEqual(expectMatch);
                done();
            }, []);
            return null;
        };

        mount(
            <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={[ '/foo/bar/1' ]}>
                <Route path={path}>
                    <MatchComponent />
                </Route>
            </RouterWrapper>
        );
    });
});
