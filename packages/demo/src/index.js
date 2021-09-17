/* eslint-disable rulesdir/disallow-fec-relative-imports */
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {
    DownloadButton,
    Section,
    Column,
    Battery,
    InsightsLabel
} from '@redhat-cloud-services/frontend-components-pdf-generator';

class DemoApp extends Component {
    state = {
        cats: 35,
        dogs: 55,
        birds: 10
    }

    render() {
        const { cats, dogs, birds } = this.state;
        return (
            <div className="pf-m-redhat-font">
                <DownloadButton title={[
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
                    { title: 'Something bold ', fontWeight: 700, style: { color: 'red' } },
                    'Nullam mauris massa, ullamcorper vitae magna non, laoreet facilisis orci. Maecenas fringilla neque velit, maximus lobortis ante mattis quis. Vestibulum interdum erat et dui lobortis, nec scelerisque leo ultricies. Maecenas vulputate urna in feugiat ornare. Donec nec bibendum metus'
                ]}
                asyncFunction={() => Promise.resolve([
                    <Fragment key="first-section">
                        <Section>
                            <Column>
                                <InsightsLabel variant={3} label="important"/>
                            </Column>
                            <Column>
                                <Battery variant={'critical'} label="important"/>
                            </Column>
                        </Section>
                    </Fragment>
                ])}/>

            </div>
        );
    }
}
ReactDOM.render(<DemoApp />, document.querySelector('.demo-app'));
