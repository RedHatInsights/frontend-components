/*global module*/
const moment = require('moment');

const pub = {};
const SUMMIT_DEMO_FIXED_STATUS = 'summitDemoFixedStatus';
const SUMMIT_DEMO_LAST_CHECK_DATE = 'summitDemoLastCheckDate';
const SUMMIT_DEMO_LAST_FIXED_DATE = 'summitDemoLastFixedDate';

pub.isFixed = () => {
    let summitDemoFixedStatus = window.localStorage.getItem(SUMMIT_DEMO_FIXED_STATUS);
    return summitDemoFixedStatus === 'true';
};

pub.getLastCheckDate = () => {
    let lastCheckDate = window.localStorage.getItem(SUMMIT_DEMO_LAST_CHECK_DATE);
    if (!lastCheckDate) {
        lastCheckDate = moment().subtract(19, 'minutes');
        window.localStorage.setItem(SUMMIT_DEMO_LAST_CHECK_DATE, lastCheckDate);
    } else {
        lastCheckDate = moment(lastCheckDate);
    }

    if (moment().diff(lastCheckDate, 'minutes') > 60) {
        lastCheckDate = moment().subtract(19, 'minutes');
        window.localStorage.setItem(SUMMIT_DEMO_LAST_CHECK_DATE, lastCheckDate);
    }

    return lastCheckDate;
};

pub.getLastFixedDate = () => {
    let lastFixedDate = window.localStorage.getItem(SUMMIT_DEMO_LAST_FIXED_DATE);
    if (!lastFixedDate) {
        return null;
    }

    return moment(lastFixedDate);
};

pub.reset = () => {
    console.log('Resetting Data');
    window.localStorage.setItem(SUMMIT_DEMO_FIXED_STATUS, 'false');
    window.localStorage.setItem(SUMMIT_DEMO_LAST_CHECK_DATE, moment());
    console.log('status = ', pub.isFixed());
};

pub.applyFixes = () => {
    console.log('Applying Fixes');
    window.localStorage.setItem(SUMMIT_DEMO_FIXED_STATUS, 'true');
    window.localStorage.setItem(SUMMIT_DEMO_LAST_FIXED_DATE, moment());
    console.log('status = ', pub.isFixed());
};

module.exports = pub;
