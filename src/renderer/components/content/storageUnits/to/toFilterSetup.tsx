import {
  characteristics,
  containers,
  FilterManager,
} from 'renderer/functionsClasses/filters/filters';

export function toGetFilterManager() {
  const ClassFilters = new FilterManager();
  // Add characteristics
  Object.values(characteristics).forEach((filter) => {
    if (filter.label != '可存储移动') {
      ClassFilters.addFilter('包含', filter, true);
    }
  });

  // Add characteristics
  Object.values(characteristics).forEach((filter) => {
    if (filter.label != '可存储移动') {
      ClassFilters.addFilter('排除', filter, false);
    }
  });
  // Add Containers
  Object.values(containers).forEach((filter) => {
    ClassFilters.addFilter('箱子', filter, true);
  });
  return ClassFilters;
}
