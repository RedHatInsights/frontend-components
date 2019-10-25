import { dateStringByType } from './helper';

describe('dateStringByType component', () => {
    const date = new Date('Dec 31 2019 00:00:00 UTC');
    const tenSecondsAgo = new Date('Dec 30 2019 23:59:50 UTC');
    const tenMinutesAgo = new Date('Dec 30 2019 23:50:00 UTC');
    const dayAgo = new Date('Dec 30 2019 00:00:00 UTC');
    const twoDaysAgo = new Date('Dec 29 2019 00:00:00 UTC');
    const weekAgo = new Date('Dec 24 2019 00:00:00 UTC');
    const monthAgo = new Date('Dec 1 2019 00:00:00 UTC');
    const monthAgo2 = new Date('Nov 30 2019 00:00:00 UTC');
    const twoMonthsAgo = new Date('Nov 2 2019 00:00:00 UTC');
    const twoMonthsAgo2 = new Date('Oct 31 2019 00:00:00 UTC');
    const sixMonthsAgo = new Date('Jun 30 2019 00:00:00 UTC');
    global.Date.now = () => date;

    afterAll(() => {
        global.Date.now = () => Date.now.bind(global.Date);
    });

    it('Invalid datetime matches', () => {
        expect(dateStringByType('invalid')(date)).toEqual('Invalid Date');
    });

    it('Exact datetime matches', () => {
        expect(dateStringByType('exact')(date)).toEqual('31 Dec 2019 00:00:00 UTC');
    });

    it('OnlyDate date matches', () => {
        expect(dateStringByType('onlyDate')(date)).toEqual('31 Dec 2019');
    });

    it('Relative datetime matches Just now', () => {
        expect(dateStringByType('relative')(tenSecondsAgo)).toEqual('Just now');
    });

    it('Relative datetime matches 10 minutes ago', () => {
        expect(dateStringByType('relative')(tenMinutesAgo)).toEqual('10 minutes ago');
    });

    it('Relative datetime matches 1 day ago', () => {
        expect(dateStringByType('relative')(dayAgo)).toEqual('1 day ago');
    });

    it('Relative datetime matches 2 day ago', () => {
        expect(dateStringByType('relative')(twoDaysAgo)).toEqual('2 days ago');
    });

    it('Relative datetime matches week ago', () => {
        expect(dateStringByType('relative')(weekAgo)).toEqual('7 days ago');
    });

    it('Relative datetime matches month ago', () => {
        expect(dateStringByType('relative')(monthAgo)).toEqual('1 months ago');
    });

    it('Relative datetime matches 2 months ago', () => {
        expect(dateStringByType('relative')(monthAgo2)).toEqual('1 months ago');
    });

    it('Relative datetime matches 2 months ago', () => {
        expect(dateStringByType('relative')(twoMonthsAgo)).toEqual('2 months ago');
    });

    it('Relative datetime matches 2 months ago', () => {
        expect(dateStringByType('relative')(twoMonthsAgo2)).toEqual('2 months ago');
    });

    it('Relative datetime matches 6 months ago', () => {
        expect(dateStringByType('relative')(sixMonthsAgo)).toEqual('6 months ago');
    });
});
