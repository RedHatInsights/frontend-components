import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownToggle, SplitItem, Split, ToolbarItem, ToolbarGroup, ToolbarToggleGroup } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import globalBreakpointMd from '@patternfly/react-tokens/dist/js/global_breakpoint_md';
import Text from './TextFilter';
import { conditionalFilterType, typeMapper } from './conditionalFilterConstants';
import PropTypes from 'prop-types';
import './conditional-filter.scss';
import { Fragment } from 'react';
import classNames from 'classnames';

class ConditionalFilter extends Component {
    constructor(props) {
        if (!props.useMobileLayout) {
            console.warn(`The prop "useMobileLayout" is set to false. You are using an outdated mobile layout of conditional filter.
            Please switch to new layout by adding "useMobileLayout={true}" prop to the PrimaryToolbar or ConditionalFilter directly.
            The new mobile layout will become the default in next minor release.`);
        }

        super(props);
        this.breakpointConstant = parseInt(globalBreakpointMd.value.replace('px', ''));
        this.state = {
            isOpen: false,
            stateValue: undefined,
            isMobile: this.updateFilterViewport(window.innerWidth)
        };
    }

    dropdownToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    }

    onChange = (_e, value) => {
        this.setState({
            stateValue: value
        });
    }

    getWrapper = () => this.props.useMobileLayout && this.state.isMobile
        ? (props) => <ToolbarToggleGroup {...props} breakpoint="md" toggleIcon={<FilterIcon />}></ToolbarToggleGroup>
        : Fragment

    updateFilterViewport = (width) => width <= this.breakpointConstant

    componentDidMount() {
        this.resizeListener = window.addEventListener('resize', (event) => {
            this.setState(prev => ({ ...prev, isMobile: this.updateFilterViewport(event.target.innerWidth) }));
        });
    }

    componentWillUnmount() {
        if (this.resizeListener) {
            window.removeEventListener(this.resizeListener);
        }
    }

    render() {
        const { items, value, onChange, placeholder, hideLabel, isDisabled, ...props } = this.props;
        const { isOpen, stateValue, isMobile } = this.state;
        const currentValue = onChange ? value : stateValue;
        const activeItem = items && items.length && (
            items.find((item, key) => item.value === currentValue || key === currentValue) ||
            items[0]
        );
        const onChangeCallback = onChange || this.onChange;
        const ActiveComponent = activeItem && (typeMapper[activeItem.type] || typeMapper.text);
        const capitalize = (string) => string[0].toUpperCase() + string.substring(1);

        const shouldRenderNewLayout = this.props.useMobileLayout && isMobile;
        const Wrapper = this.getWrapper();
        return (
            <Wrapper>
                {this.props.useMobileLayout && isMobile && (
                    <ToolbarGroup className="ins-c-conditional-filter mobile">
                        {items.map((activeItem, key) => {
                            const ActiveComponent = activeItem && (typeMapper[activeItem.type] || typeMapper.text);
                            return (
                                <ToolbarItem key={key}>
                                    <ActiveComponent
                                        {
                                            ...activeItem.type !== conditionalFilterType.custom &&
                        {
                            placeholder: placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`,
                            id: (activeItem.filterValues && activeItem.filterValues.id) || currentValue
                        }
                                        }
                                        { ...activeItem.filterValues }
                                    />

                                </ToolbarItem>
                            );}
                        )
                        }
                    </ToolbarGroup>

                )}
                {!shouldRenderNewLayout && (
                    <Fragment>

                        {
                            !items || (items && items.length <= 0) ?
                                <div className={classNames('ins-c-conditional-filter', {
                                    desktop: this.props.useMobileLayout
                                })}>
                                    <Text { ...props }
                                        value={ currentValue }
                                        onChange={ (e) => onChangeCallback(e, e.target.value) }
                                        placeholder={ placeholder }
                                        widget-type='InsightsInput'
                                    />
                                </div> :
                                <Split className={classNames('ins-c-conditional-filter', {
                                    desktop: this.props.useMobileLayout
                                })}>
                                    { items.length > 1 &&
                                <SplitItem>
                                    <Dropdown
                                        className="ins-c-conditional-filter__group"
                                        onSelect={ () => this.dropdownToggle(false) }
                                        isOpen={ isOpen }
                                        ouiaId="ConditionalFilter"
                                        toggle={
                                            <DropdownToggle
                                                onToggle={ this.dropdownToggle }
                                                isDisabled={ isDisabled }
                                                className={ hideLabel ? 'ins-c-conditional-filter__no-label' : '' }
                                                ouiaId="ConditionalFilter">
                                                <FilterIcon size="sm" />
                                                { !hideLabel &&
                                                    <span className="ins-c-conditional-filter__value-selector">
                                                        { activeItem && capitalize(activeItem.label) }
                                                    </span>
                                                }
                                            </DropdownToggle>
                                        }
                                        dropdownItems={
                                            items.map((item, key) => <DropdownItem
                                                key={ item.id ? `${item.id}-dropdown` : key }
                                                component="button"
                                                ouiaId={ item.label }
                                                onClick={ e => onChangeCallback(e, item.value || key, item) }
                                                isHovered={ activeItem.label === item.label }
                                            >
                                                { capitalize(item.label) }
                                            </DropdownItem>)
                                        }
                                    />
                                </SplitItem>
                                    }
                                    {
                                        ActiveComponent && <SplitItem isFilled>
                                            <ActiveComponent
                                                {
                                                    ...activeItem.type !== conditionalFilterType.custom &&
                                            {
                                                placeholder: placeholder || activeItem.placeholder || `Filter by ${activeItem.label}`,
                                                id: (activeItem.filterValues && activeItem.filterValues.id) || currentValue
                                            }
                                                }
                                                { ...activeItem.filterValues }
                                            />
                                        </SplitItem>
                                    }
                                </Split>
                        }
                    </Fragment>
                )}
            </Wrapper>
        );
    }
}

const TextInputProps = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};

ConditionalFilter.propTypes = {
    hideLabel: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.node,
        value: PropTypes.string,
        type: PropTypes.oneOf([ 'text', 'checkbox', 'radio', 'custom', 'group' ]),
        filterValues: PropTypes.oneOfType([ PropTypes.shape(TextInputProps), PropTypes.shape({
            ...TextInputProps,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.shape({
                        label: PropTypes.node,
                        value: PropTypes.string
                    })
                ])),
                PropTypes.shape({
                    [PropTypes.string]: PropTypes.any
                })
            ]),
            items: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.node,
                value: PropTypes.string
            }))
        }) ])
    })),
    ...TextInputProps,
    id: PropTypes.string,
    isDisabled: PropTypes.bool,
    useMobileLayout: PropTypes.bool
};

ConditionalFilter.defaultProps = {
    value: '',
    items: [],
    hideLabel: false,
    isDisabled: false,
    id: 'default-input',
    useMobileLayout: false
};
export default ConditionalFilter;
