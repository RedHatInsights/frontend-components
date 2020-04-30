import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Tabs, Tab } from '@patternfly/react-core';
import Markdown from './Markdown';

class RemediatingModal extends React.Component {
    state = {
        isModalOpen: false,
        activeTabKey: 0
    }

    handleModalToggle = () => {
        this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen
        }));
    };

    handleTabClick = (event, tabIndex) => {
        this.setState({
            activeTabKey: tabIndex
        });
    };

    render() {
        const { reason, resolution, definitions } = this.props;
        const { isModalOpen, activeTabKey } = this.state;

        return (
            <React.Fragment>
                <Button variant="link" onClick={this.handleModalToggle}>
                How to remediate this issue?
                </Button>
                <Modal
                    width={'50%'}
                    title="Remediating issue"
                    isOpen={isModalOpen}
                    onClose={this.handleModalToggle}
                    className="ins-c-rule__remediating-modal"
                >
                    <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
                        {
                            reason && <Tab eventKey={0} title="Reason">
                                <div className="ins-c-rule__modal-content">
                                    <Markdown template={reason} definitions={definitions} />
                                </div>
                            </Tab>
                        }
                        {
                            resolution && <Tab eventKey={1} title="How to remediate">
                                <div className="ins-c-rule__modal-content">
                                    <Markdown template={resolution} definitions={definitions} />
                                </div>
                            </Tab>
                        }
                    </Tabs>
                </Modal>
            </React.Fragment>
        );
    }
}

RemediatingModal.propTypes = {
    reason: PropTypes.string,
    resolution: PropTypes.string,
    definitions: PropTypes.object
};

export default RemediatingModal;
