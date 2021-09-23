/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import ChromeRouter from '../ChromeRouter';
import useLocation from '../useLocation';

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

describe('useLocation', () => {
    it('should return original location values', (done) => {
        const pathname = '/foo/bar/1';
        const expectedLocation = expect.objectContaining({
            pathname
        });
        const MatchComponent = () => {
            const location = useLocation();
            useEffect(() => {
                expect(location).toEqual(expectedLocation);
                done();
            }, []);
            return null;
        };

        mount(
            <RouterWrapper initialEntries={[ pathname ]}>
                <Route>
                    <MatchComponent />
                </Route>
            </RouterWrapper>
        );
    });

    it('should return location pathname witouth basename', (done) => {
        const pathname = '/foo/bar/1';
        const expectedLocation = expect.objectContaining({
            pathname: '/1'
        });
        const MatchComponent = () => {
            const location = useLocation();
            useEffect(() => {
                expect(location).toEqual(expectedLocation);
                done();
            }, []);
            return null;
        };

        mount(
            <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={[ pathname ]}>
                <Route>
                    <MatchComponent />
                </Route>
            </RouterWrapper>
        );
    });
});
