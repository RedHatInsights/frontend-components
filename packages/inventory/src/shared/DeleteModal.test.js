/* eslint-disable camelcase */
import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DeleteModal from './DeleteModal';

describe('EntityTable', () => {
    describe('DOM', () => {
        it('should render correctly', () => {
            const wrapper = shallow(<DeleteModal />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with one system', () => {
            const wrapper = shallow(<DeleteModal currentSytems={{ display_name: 'something' }} isModalOpen />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with one system', () => {
            const wrapper = shallow(<DeleteModal currentSytems={{ display_name: 'something' }} isModalOpen />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with multiple systems - count 1', () => {
            const wrapper = shallow(<DeleteModal currentSytems={[
                { display_name: 'something' }
            ]} isModalOpen />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with multiple systems - count 2', () => {
            const wrapper = shallow(<DeleteModal currentSytems={[
                { display_name: 'something' },
                { display_name: 'another' }
            ]} isModalOpen />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should NOT call close on X click', () => {
            const onClose = jest.fn();
            const wrapper = mount(<DeleteModal currentSytems={[
                { display_name: 'something' },
                { display_name: 'another' }
            ]} isModalOpen />);
            wrapper.find('.ins-c-inventory__table--remove button').first().simulate('click');
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should call close on X click', () => {
            const onClose = jest.fn();
            const wrapper = mount(<DeleteModal currentSytems={[
                { display_name: 'something' },
                { display_name: 'another' }
            ]} isModalOpen handleModalToggle={onClose} />);
            wrapper.find('.ins-c-inventory__table--remove button').first().simulate('click');
            expect(onClose).toHaveBeenCalled();
        });

        it('should call close on cancel click', () => {
            const onClose = jest.fn();
            const wrapper = mount(<DeleteModal currentSytems={[
                { display_name: 'something' },
                { display_name: 'another' }
            ]} isModalOpen handleModalToggle={onClose} />);
            wrapper.find('.pf-c-modal-box__body button').last().simulate('click');
            expect(onClose).toHaveBeenCalled();
        });

        it('should call onConfirm', () => {
            const onConfirm = jest.fn();
            const wrapper = mount(<DeleteModal currentSytems={[
                { display_name: 'something' },
                { display_name: 'another' }
            ]} isModalOpen onConfirm={onConfirm} />);
            wrapper.find('.pf-c-modal-box__body button.pf-m-danger').first().simulate('click');
            expect(onConfirm).toHaveBeenCalled();
        });

        it('should NOT call onConfirm', () => {
            const onConfirm = jest.fn();
            const wrapper = mount(<DeleteModal currentSytems={[
                { display_name: 'something' },
                { display_name: 'another' }
            ]} isModalOpen />);
            wrapper.find('.pf-c-modal-box__body button.pf-m-danger').first().simulate('click');
            expect(onConfirm).not.toHaveBeenCalled();
        });
    });
});
