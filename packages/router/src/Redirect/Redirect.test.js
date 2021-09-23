/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { MemoryRouter, useLocation, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import ChromeRouter from '../ChromeRouter';
import Redirect from './Redirect';

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

describe('Redirect', () => {
    it('should redirect regularly outside of ChromeRouter to default route', (done) => {
        const RenderTrigger = () => {
            const location = useLocation();
            useEffect(() => {
                expect(location.pathname).toEqual('/bar');
                done();
            }, []);
            return null;
        };

        const MatchComponent = () => (
            <RouterWrapper initialEntries={[ '/foo/bar' ]}>
                <Route path="/foo/bar">
                    <Redirect to="/bar" />
                </Route>
                <Route path="/bar">
                    <RenderTrigger />
                </Route>
            </RouterWrapper>
        );

        mount(<MatchComponent />);

    });

    it('should redirect inside ChromeRouter to route', (done) => {
        const RenderTrigger = () => {
            const location = useLocation();
            useEffect(() => {
                expect(location.pathname).toEqual('/foo/bar/baz');
                done();
            }, []);
            return null;
        };

        const MatchComponent = () => (
            <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={[ '/bla' ]}>
                <Route path="/foo/bar/baz">
                    <RenderTrigger />
                </Route>
                <Route path="/bla">
                    <Redirect to="/baz" />
                </Route>
            </RouterWrapper>
        );

        mount(<MatchComponent />);

    });
});
