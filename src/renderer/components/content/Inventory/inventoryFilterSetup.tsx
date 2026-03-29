import {
  characteristics,
  containers,
  FilterManager,
} from 'renderer/functionsClasses/filters/filters';

export function InventoryGetFilterManager() {
  const ClassFilters = new FilterManager();
  // Add characteristics
  Object.values(characteristics).forEach((filter) => {
    ClassFilters.addFilter('包含', filter, true);
  });
  Object.values(characteristics).forEach((filter) => {
    ClassFilters.addFilter('排除', filter, false);
  });

  // Add Containers
  Object.values(containers).forEach((filter) => {
    ClassFilters.addFilter('箱子', filter, true);
  });

  return ClassFilters;
}
