import computeSourcesUrl from '../../utilities/computeSourcesUrl';

describe('computeSourcesUrl', () => {
    let tmpInsights;

    beforeEach(() => {
        tmpInsights = insights;
    });

    afterEach(() => {
        insights = tmpInsights;
    });

    it('on beta', () => {
        insights = {
            ...insights,
            chrome: {
                ...insights.chrome,
                isBeta: () => true
            }
        };

        expect(computeSourcesUrl()).toEqual('/beta/settings/sources');
    });

    it('on non-beta', () => {
        insights = {
            ...insights,
            chrome: {
                ...insights.chrome,
                isBeta: () => false
            }
        };

        expect(computeSourcesUrl()).toEqual('/settings/sources');
    });
});
