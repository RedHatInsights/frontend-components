/* eslint-disable camelcase */
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import { generateFilter, mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { constructTags, hosts, mapData, mapTags } from '../../api';

export async function getEntities({
    controller,
    items,
    filters,
    perPage,
    page,
    orderBy,
    orderDirection,
    fields = { system_profile: [ 'operating_system' ] },
    tags, // ?
    filter, // ?
    showTags
}) {
    let data;

    if (items) {
        data = await hosts.apiHostGetHostById(items, undefined, undefined, undefined, undefined, undefined, { cancelToken: controller && controller.token });

        if (fields && Object.keys(fields).length) {
            const result = await hosts.apiHostGetHostSystemProfileById(
                items,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    cancelToken: controller && controller.token,
                    query: generateFilter(fields, 'fields')
                }
            );

            data = {
                ...data,
                results: mergeArraysByKey([
                    data?.results,
                    result?.results || []
                ], 'id')
            };

        }
    } else {
        data = await hosts.apiHostGetHostList(
            undefined,
            undefined,
            filters.hostnameOrId,
            undefined,
            undefined,
            perPage,
            page,
            orderBy,
            orderDirection,
            filters.staleFilter,
            [
                ...constructTags(filters.tagFilters || []),
                ...tags || []
            ],
            filters.registeredWithFilter,
            undefined,
            undefined,
            {
                cancelToken: controller && controller.token,
                query: {
                    ...(filter && Object.keys(filter).length && generateFilter(filter)),
                    ...(fields && Object.keys(fields).length && generateFilter(fields, 'fields'))
                }
            }
        );
    }

    data = showTags ? await mapTags(data, { orderBy, orderDirection }) : data;

    data = {
        ...data,
        filters,
        results: data.results.map(result => mapData({
            ...result,
            display_name: result.display_name || result.fqdn || result.id
        }))
    };

    return data;
}
