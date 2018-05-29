import React, { Component } from 'react';
import { RouteComponentProps as RouteProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from '../../Utilities/asyncComponent';
import './sample-page.scss';
import Tabs from '../../PresentationalComponents/Tabs/tabs.js';
import TabPane from '../../PresentationalComponents/Tabs/tab-pane.js';

const SampleComponent = asyncComponent(() => import('../../PresentationalComponents/SampleComponent/sample-component'));

const PageHeader = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header'));
const PageHeaderTitle = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header-title'));

const Alert = asyncComponent(() => import('../../PresentationalComponents/Alert/alert'));

const Card = asyncComponent(() => import('../../PresentationalComponents/Card/card'));
const CardHeader = asyncComponent(() => import('../../PresentationalComponents/Card/card-header'));
const CardContent = asyncComponent(() => import('../../PresentationalComponents/Card/card-content'));
const CardFooter = asyncComponent(() => import('../../PresentationalComponents/Card/card-footer'));

const Button = asyncComponent(() => import('../../PresentationalComponents/Button/button'));
const PF3Button = asyncComponent(() => import('../../PresentationalComponents/Button/pf-button'));

const Section = asyncComponent(() => import('../../PresentationalComponents/Section/section'));

type Props = {};
type State = {};

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component<RouteProps<any> & Props, State> {

    render() {
        return (
            <React.Fragment>
                <Alert type='info'> This is a template for you to build your Insights app</Alert>
                <PageHeader>
                    <PageHeaderTitle>Sample Insights App</PageHeaderTitle>
                </PageHeader>
                <Section type='content'>
                    <h1> Sample Component </h1>
                        <SampleComponent> Sample Component </SampleComponent>
                    <h1> Cards </h1>
                    <Card>
                        <CardHeader> Card Header </CardHeader>
                        <CardContent> Card Content </CardContent>
                        <CardFooter> Card Footer </CardFooter>
                    </Card>
                    <h1> Buttons </h1>
                    <Section type='button-group'>
                        <Button> PF-Next Primary Button </Button>
                        <Button type='primary'> PF-Next Primary Button </Button>
                        <Button type='secondary'> PF-Next Secondary Button </Button>
                        <Button type='tertiary'> PF-Next Tertiary Button </Button>
                        <Button type='danger'> PF-Next Danger Button </Button>
                    </Section>
                    <Section type='button-group'>
                        <PF3Button> PF-3 Default </PF3Button>
                        <PF3Button bsStyle='primary'> PF-3 Primary </PF3Button>
                        <PF3Button bsStyle='success'> PF-3 Success </PF3Button>
                        <PF3Button bsStyle='info'> PF-3 Info </PF3Button>
                        <PF3Button bsStyle='warning'> PF-3 Warning </PF3Button>
                        <PF3Button bsStyle='danger'> PF-3 Danger </PF3Button>
                        <PF3Button bsStyle='link'> PF-3 Link </PF3Button>
                    </Section>
                    <Section>
                        <Tabs selected={0}>
                            <TabPane label='Tab 1'>
                                <br/>
                                <h2>Tab 1 Content</h2>
                                <br/>
                                <p>Lorem ipsum dolor sit amet, enim purto id mel. Purto omnes definiebas et mei, recusabo salutatus ad mei. An nec tamquam quaeque rationibus, legere probatus in mel. Etiam aeterno scriptorem ex sea, pri ad odio soluta maiorum. Pro ad invidunt reprimique, movet luptatum sit cu, in reque vocibus assueverit sit. Eum te quando dolore, sea zril dicunt torquatos ei.</p>
                                <br/>
                                <p>Eu tempor aliquam recusabo vis, sint singulis nec cu. Case nonumes efficiantur duo ei. Rebum rationibus complectitur pri ne, no mazim officiis usu, saepe feugait perpetua ex eam. Sed ne timeam albucius, errem graece dicunt sea in.</p>
                            </TabPane>
                            <TabPane label='Tab 2'>
                                <br/>
                                <h3>Tab 2 Content</h3>
                                <br/>
                                <p>Sit etiam nostrud posidonium at, mucius eleifend ius te. Ius et populo laboramus, pri cu discere oportere consequat. Sed an vidisse feugiat, eu sed elit choro iudicabit. Vix ad unum aliquando. Ut qui odio novum necessitatibus, nam an sint assum. Id probo molestiae eum, ei cum virtute impedit imperdiet. Eu vim aliquam veritus, justo explicari vix no.</p>
                                <br/>
                                <p>Eu dignissim scribentur nam, usu possim consulatu forensibus in. Similique posidonium ex mel. Homero labore molestiae te quo, an duo nostro sanctus fabellas. Duo novum omnes splendide ex, has no albucius efficiantur, nam ei possit ocurreret.</p>
                            </TabPane>
                            <TabPane disabled='true' label='Tab 3'>
                                <br/>
                                <h3>Tab 3 Content</h3>
                                <br/>
                                <p>Mei vidit theophrastus at. Pro melius inermis explicari an, ea laudem corpora vis, aperiri persequeris mel ut. No corpora invenire nam. Ei duo suas torquatos. Paulo omnes usu ut, cu usu esse laoreet consulatu. Te ipsum paulo perfecto vix.</p>
                                <br/>
                                <p>Alia philosophia ex vel, doming vocent interesset an quo, nostrud persecuti honestatis est te. Vim laudem complectitur cu, ex movet tollit timeam vel. Ad has enim accusata, no cum probo graeci. Perpetua elaboraret vel at, virtute diceret cotidieque his eu. Habeo soleat vidisse nec ex, choro inciderint ea quo.</p>
                            </TabPane>
                        </Tabs>
                    </Section>
                </Section>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
