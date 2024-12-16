import { FrontendCRD, ServiceCategory, ServiceTile } from './feo-types';

function serviceTilesInterceptor(serviceCategories: ServiceCategory[], frontendCrd: FrontendCRD): ServiceCategory[] {
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
    const newGroups = category.groups.map((group) => {
      const newTiles = group.tiles.filter((tile) => tile.frontendRef !== frontendRef);
      return {
        ...group,
        tiles: [...newTiles, ...(frontendCategories[category.id]?.[group.id] ?? [])],
      };
    });
    return {
      ...category,
      groups: newGroups,
    };
  });

  return result;
}

export default serviceTilesInterceptor;
