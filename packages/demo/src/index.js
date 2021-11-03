import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { DownloadButtonWrapper, Section, Column, Table, Panel, PanelItem, Battery, Chart, Dl, Dt, Dd } from '../../pdf-generator/src';

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
                <DownloadButtonWrapper isPreview title={[
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
                    { title: 'Something bold ', style: { color: 'red', fontWeight: 'bold' } },
                    'Nullam mauris massa, ullamcorper vitae magna non, laoreet facilisis orci. Maecenas fringilla neque velit, maximus lobortis ante mattis quis. Vestibulum interdum erat et dui lobortis, nec scelerisque leo ultricies. Maecenas vulputate urna in feugiat ornare. Donec nec bibendum metus'
                ]} pages={[
                    <Fragment key="first-section">
                        <Section title="I am donut chart about pets">
                            <Column>
                                <Table
                                    withHeader
                                    rows={[
                                        [ 'one', 'two' ],
                                        [ 'one', 'two' ],
                                        [ 'one', 'two' ]
                                    ]}
                                />
                            </Column>
                            <Column>
                                <Chart
                                    chartType="donut"
                                    subTitle="Pets"
                                    title="100"
                                    data={[{ x: 'Catss', y: cats }, { x: 'Dogs', y: dogs }, { x: 'Birds', y: birds }]}
                                />
                            </Column>
                        </Section>
                        <Section title="I am pie chart about pets">
                            <Column>
                                <Table
                                    withHeader
                                    rows={[
                                        [ 'one', 'two' ],
                                        [ 'one', 'two' ],
                                        [ 'one', 'two' ]
                                    ]}
                                />
                            </Column>
                            <Column>
                                <Chart
                                    chartType="pie"
                                    subTitle="Pets"
                                    title="100"
                                    data={[{ x: 'Catss', y: cats }, { x: 'Dogs', y: dogs }, { x: 'Birds', y: birds }]}
                                />
                            </Column>
                        </Section>
                        <Section title="I am just a table">
                            <Column>
                                <Table
                                    withHeader
                                    rows={[
                                        [ 'one', 'two' ],
                                        [ 'one', 'two' ],
                                        [ 'one', 'two' ]
                                    ]}
                                />
                            </Column>
                            <Column/>
                        </Section>
                        <Section title="I am description list">
                            <Column>
                                <Dl>
                                    <Dt>Mercury</Dt>
                                    <Dd>Mercury (0.4 AU from the Sun) is the closest planet to the Sun and the smallest planet.</Dd>
                                    <Dt>Venus</Dt>
                                    <Dd>Venus (0.7 AU) is close in size to Earth, (0.815 Earth masses) and like Earth, has a thick silicate mantle around an iron core.</Dd>
                                    <Dt>Earth</Dt>
                                    <Dd>Earth (1 AU) is the largest and densest of the inner planets, the only one known to have current geological activity.</Dd>
                                </Dl>
                            </Column>
                            <Column/>
                        </Section>
                        <Section title="Some title" withColumn={false}>
                            <Panel title="Some title" description="Nullam mauris massa, ullamcorper vitae magna non, laoreet facilisis orci. Maecenas fringilla neque velit, maximus lobortis ante mattis quis. Vestibulum interdum erat et dui lobortis, nec scelerisque leo ultricies. Maecenas vulputate urna in feugiat ornare. Donec nec bibendum metus">
                                <PanelItem title="I am title">
                                    8.3
                                </PanelItem>
                                <PanelItem>
                                    22
                                </PanelItem>
                            </Panel>
                            <Panel title="Some title" description="Nullam mauris massa, ullamcorper vitae magna non, laoreet facilisis orci. Maecenas fringilla neque velit, maximus lobortis ante mattis quis. Vestibulum interdum erat et dui lobortis, nec scelerisque leo ultricies. Maecenas vulputate urna in feugiat ornare. Donec nec bibendum metus">
                                <PanelItem title="This is also a title">
                                    76
                                </PanelItem>
                                <PanelItem>
                                    <Battery variant="high" />
                                </PanelItem>
                            </Panel>
                        </Section>
                    </Fragment>
                ]}/>
            </div>
        );
    }
}
ReactDOM.render(<DemoApp />, document.querySelector('.demo-app'));
