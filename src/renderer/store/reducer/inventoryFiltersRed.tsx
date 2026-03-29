import { InventoryFilters } from '../../interfaces/states';

const initialState: InventoryFilters = {
  inventoryFilter: [],
  storageFilter: [],
  sortValue: 'Default',
  inventoryFiltered: [],
  storageFiltered: [],
  searchInput: '',
  sortBack: false,
  categoryFilter: [],
  rarityFilter: [],
};

const inventoryFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTERED':
      return {
        ...state,
        inventoryFilter: action.payload.inventoryFilter,
        sortValue: action.payload.sortValue,
        inventoryFiltered: action.payload.inventoryFiltered,
      };
    case 'SET_FILTERED_STORAGE':
      return {
        ...state,
        storageFiltered: action.payload.storageFiltered,
        storageFilter: action.payload.storageFilter,
      };
    case 'ALL_BUT_CLEAR':
      if (state.sortValue == action.payload.sortValue) {
        return {
          ...state,
          inventoryFilter: action.payload.inventoryFilter,
          sortValue: action.payload.sortValue,
          inventoryFiltered: action.payload.inventoryFiltered,
          sortBack: !state.sortBack,
        };
      } else {
        return {
          ...state,
          inventoryFilter: action.payload.inventoryFilter,
          sortValue: action.payload.sortValue,
          inventoryFiltered: action.payload.inventoryFiltered,
        };
      }
    case 'INVENTORY_STORAGES_CLEAR_CASKET':
      const AddToFiltered = state.storageFiltered.filter(
        (id) => id.storage_id != action.payload.casketID
      );

      return {
        ...state,
        storageFiltered: AddToFiltered,
      };
    case 'INVENTORY_STORAGES_SET_SORT_STORAGES':
      return {
        ...state,
        storageFiltered: action.payload.storageFiltered,
      };
    case 'CLEAR_ALL':
      return {
        ...initialState,
        inventoryFilter: [],
      };
    case 'MOVE_FROM_CLEAR':
      return {
        ...state,
        categoryFilter: initialState.categoryFilter,
        storageFiltered: initialState.storageFiltered,
        storageFilter: initialState.storageFilter,
      };

    case 'MOVE_FROM_CLEAR_ALL':
      return {
        ...state,
        categoryFilter: initialState.categoryFilter,
        storageFiltered: initialState.storageFiltered,
        storageFilter: initialState.storageFilter,
      };
    case 'MOVE_TO_CLEAR_ALL':
      return {
        ...state,
        categoryFilter: initialState.categoryFilter,
        inventoryFilter: [],
        inventoryFiltered: [],
      };

    case 'INVENTORY_ADD_CATEGORY_FILTER':
      return {
        ...state,
        categoryFilter: state.categoryFilter.includes(action.payload)
          ? state.categoryFilter.filter((item) => item !== action.payload)
          : [...state.categoryFilter, action.payload],
      };
    case 'INVENTORY_ADD_RARITY_FILTER':
      return {
        ...state,
        rarityFilter: state.rarityFilter.includes(action.payload)
          ? state.rarityFilter.filter((item) => item !== action.payload)
          : [...state.rarityFilter, action.payload],
      };
    case 'INVENTORY_FILTERS_SET_SEARCH':
      return {
        ...state,
        searchInput: action.payload.searchField,
      };
    case 'SET_SORT':
      if (state.sortValue == action.payload.sortValue) {
        return {
          ...state,
          sortBack: !state.sortBack,
        };
      } else {
        return {
          ...state,
          sortValue: action.payload.sortValue,
          sortBack: initialState.sortBack,
        };
      }
    case 'SIGN_OUT':
      return {
        ...initialState,
      };
    default:
      return { ...state };
  }
};

export default inventoryFiltersReducer;
