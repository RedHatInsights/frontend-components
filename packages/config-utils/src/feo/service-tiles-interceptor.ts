import { FrontendCRD, ServiceTile, ServicesTilesResponseEntry } from './feo-types';

function serviceTilesInterceptor(serviceCategories: ServicesTilesResponseEntry[], frontendCrd: FrontendCRD): ServicesTilesResponseEntry[] {
  const frontendRef = frontendCrd.objects[0].metadata.name;
  let result = [...serviceCategories];

  const frontendCategories =
    frontendCrd.objects[0].spec.serviceTiles?.reduce<{
      [section: string]: { [group: string]: ServiceTile[] };
    }>((acc, tile) => {
      const section = tile.section;
      const group = tile.group;
      if (!acc[section]) {
        acc[section] = {};
      }

      if (!acc[section][group]) {
        acc[section][group] = [];
      }

      acc[section][group].push({ ...tile });
      return acc;
    }, {}) ?? {};

  result = result.map((category) => {
    const newGroups = category.links.map((group) => {
      const newTiles = group.links.filter((tile) => tile.frontendRef !== frontendRef);
      return {
        ...group,
        links: [...newTiles, ...(frontendCategories[category.id]?.[group.id] ?? [])],
      };
    });
    return {
      ...category,
      links: newGroups,
    };
  });

  return result;
}

export default serviceTilesInterceptor;
