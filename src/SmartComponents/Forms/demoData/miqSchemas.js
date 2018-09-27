/**
 * These are schemas from MIQ service catalog.
 * They will be converted to the mozilla json-schema
 */

export const amazonProviderSchema = {
    id: '2',
    description: 'SELECT',
    buttons: 'submit,cancel',
    label: 'SELECT',
    dialog_tabs: [ // eslint-disable-line camelcase
        {
            id: '12',
            label: 'New tab',
            dialog_id: '2', // eslint-disable-line camelcase
            position: 0,
            dialog_groups: [ // eslint-disable-line camelcase
                {
                    id: '12',
                    label: 'New section',
                    dialog_tab_id: '12', // eslint-disable-line camelcase
                    position: 0,
                    dialog_fields: [ // eslint-disable-line camelcase
                        {
                            id: '82',
                            name: 'dropdown_list_1',
                            description: '',
                            data_type: 'string', // eslint-disable-line camelcase
                            display: 'edit',
                            required: false,
                            default_value: 'foo', // eslint-disable-line camelcase
                            values: [ [ null, '<None>' ], [ 'foo', 'bar' ], [ 'bax', 'bax' ], [ 'baz', 'quux' ] ],
                            options: {
                                sort_by: 'description', // eslint-disable-line camelcase
                                sort_order: 'ascending', // eslint-disable-line camelcase
                                force_multi_value: false // eslint-disable-line camelcase
                            },
                            label: 'Dropdown',
                            dialog_group_id: '12', // eslint-disable-line camelcase
                            position: 0,
                            visible: true,
                            type: 'DialogFieldDropDownList',
                            resource_action: { // eslint-disable-line camelcase
                                resource_type: 'DialogField' // eslint-disable-line camelcase
                            }
                        }, {
                            id: '83',
                            name: 'dropdown_list_2',
                            description: '',
                            data_type: 'string', // eslint-disable-line camelcase
                            display: 'edit',
                            required: false,
                            default_value: '["bax"]', // eslint-disable-line camelcase
                            values: [ [ null, '<None>' ], [ 'foo', 'bar' ], [ 'bax', 'bax' ], [ 'baz', 'quux' ] ],
                            options: {
                                sort_by: 'description', // eslint-disable-line camelcase
                                sort_order: 'ascending', // eslint-disable-line camelcase
                                force_multi_value: true // eslint-disable-line camelcase
                            },
                            label: 'Dropdown',
                            dialog_group_id: '12', // eslint-disable-line camelcase
                            position: 1,
                            visible: true,
                            type: 'DialogFieldDropDownList',
                            resource_action: { // eslint-disable-line camelcase
                                resource_type: 'DialogField' // eslint-disable-line camelcase
                            }
                        }, {
                            href: 'http://localhost:3001/api/service_templates/1/service_dialogs/84',
                            id: '84',
                            name: 'dropdown_list_3',
                            description: '',
                            data_type: 'integer', // eslint-disable-line camelcase
                            notes: null,
                            notes_display: null, // eslint-disable-line camelcase
                            display: 'edit',
                            display_method: null, // eslint-disable-line camelcase
                            display_method_options: {}, // eslint-disable-line camelcase
                            required: false,
                            required_method: null, // eslint-disable-line camelcase
                            required_method_options: {}, // eslint-disable-line camelcase
                            default_value: '', // eslint-disable-line camelcase
                            values: [ [ null, '<None>' ], [ '2', 'Two' ], [ 'Four', 'Four' ], [ 'One', '1' ], [ '3', '3' ] ],
                            options: {
                                sort_by: 'description', // eslint-disable-line camelcase
                                sort_order: 'ascending', // eslint-disable-line camelcase
                                force_multi_value: false // eslint-disable-line camelcase
                            },
                            label: 'Int',
                            dialog_group_id: '12', // eslint-disable-line camelcase
                            position: 2,
                            visible: true,
                            type: 'DialogFieldDropDownList',
                            resource_action: { // eslint-disable-line camelcase
                                resource_type: 'DialogField' // eslint-disable-line camelcase
                            }
                        }, {
                            id: '85',
                            name: 'dropdown_list_4',
                            description: '',
                            data_type: 'string', // eslint-disable-line camelcase
                            notes: null,
                            notes_display: null, // eslint-disable-line camelcase
                            display: 'edit',
                            display_method: null, // eslint-disable-line camelcase
                            display_method_options: {}, // eslint-disable-line camelcase
                            required: false,
                            required_method: null, // eslint-disable-line camelcase
                            required_method_options: {}, // eslint-disable-line camelcase
                            options: {
                                sort_by: 'description', // eslint-disable-line camelcase
                                sort_order: 'ascending', // eslint-disable-line camelcase
                                force_multi_value: false // eslint-disable-line camelcase
                            },
                            label: 'Int+1',
                            dialog_group_id: '12', // eslint-disable-line camelcase
                            position: 3,
                            dynamic: true,
                            show_refresh_button: true, // eslint-disable-line camelcase
                            visible: true,
                            type: 'DialogFieldDropDownList',
                            resource_action: { // eslint-disable-line camelcase
                                action: null,
                                resource_type: 'DialogField', // eslint-disable-line camelcase
                                ae_namespace: 'Cloud/Orchestration', // eslint-disable-line camelcase
                                ae_class: 'Lifecycle', // eslint-disable-line camelcase
                                ae_instance: 'Retirement', // eslint-disable-line camelcase
                                ae_message: null, // eslint-disable-line camelcase
                                ae_attributes: {} // eslint-disable-line camelcase
                            },
                            dialog_field_responders: [], // eslint-disable-line camelcase
                            values: [ [ null, '<None>' ] ],
                            $$hashKey: 'object:284'
                        }
                    ],
                    $$hashKey: 'object:279'
                }
            ], $$hashKey: 'object:274'
        }
    ],
    $$hashKey: 'object:267'
};
