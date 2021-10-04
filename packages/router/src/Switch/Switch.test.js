/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import ChromeRouter from '../ChromeRouter';
import ChromeRoute from '../Route';
import Switch from '../Switch';

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

describe('Switch', () => {
    it('should render /b route string path without prefixing', () => {
        const renderSpy = jest.fn();
        const RenderTrigger = ({ history: { location: { pathname } } }) => {
            useEffect(() => {
                renderSpy(pathname);
            }, []);
            return null;
        };

        const MatchComponent = () => (
            <RouterWrapper initialEntries={[ '/b' ]}>
                <Switch>
                    <Route path="/a" component={RenderTrigger} />
                    <Route path="/b" component={RenderTrigger} />
                </Switch>
            </RouterWrapper>
        );

        mount(<MatchComponent />);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenCalledWith('/b');
    });

    it('should render /b route array path without prefixing', () => {
        const renderSpy = jest.fn();
        const RenderTrigger = ({ history: { location: { pathname } } }) => {
            useEffect(() => {
                renderSpy(pathname);
            }, []);
            return null;
        };

        const MatchComponent = () => (
            <RouterWrapper initialEntries={[ '/b' ]}>
                <Switch>
                    <Route path="/a" component={RenderTrigger} />
                    <Route path={[ '/b', '/c' ]} component={RenderTrigger} />
                </Switch>
            </RouterWrapper>
        );

        mount(<MatchComponent />);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenCalledWith('/b');
    });

    it('should render /b route string path with /foo/bar prefix and original Route', () => {
        const renderSpy = jest.fn();
        const RenderTrigger = ({ history: { location: { pathname } } }) => {
            useEffect(() => {
                renderSpy(pathname);
            }, []);
            return null;
        };

        const MatchComponent = () => (
            <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={[ '/foo/bar/b' ]}>
                <Switch>
                    <Route path="/b" component={RenderTrigger} />
                    <Route path="/foo/bar/b" component={RenderTrigger} />
                </Switch>
            </RouterWrapper>
        );

        mount(<MatchComponent />);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenCalledWith('/foo/bar/b');
    });

    it('should render /b route string path with /foo/bar prefix and original new Chrome Route', () => {
        const renderSpy = jest.fn();
        const RenderTrigger = ({ history: { location: { pathname } } }) => {
            useEffect(() => {
                renderSpy(pathname);
            }, []);
            return null;
        };

        const MatchComponent = () => (
            <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={[ '/foo/bar/b' ]}>
                <Switch>
                    <ChromeRoute path="/a" component={RenderTrigger} />
                    <ChromeRoute path="/b" component={RenderTrigger} />
                </Switch>
            </RouterWrapper>
        );

        mount(<MatchComponent />);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenCalledWith('/foo/bar/b');
    });
});
