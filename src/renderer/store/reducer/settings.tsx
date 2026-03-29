import { Settings } from 'renderer/interfaces/states';

const initialState: Settings = {
  fastMove: true,
  currency: 'CNY',
  locale: 'EN-GB',
  os: '',
  steamLoginShow: true,
  devmode: false,
  columns: [
    'Price',
    'Stickers/patches',
    'Storage',
    'Tradehold',
    'Moveable',
    'Inventory link',
  ],
  currencyPrice: {},
  source: {
    title: 'steam_listing',
    name: 'Steam Community Market',
    avatar: 'https://steamcommunity.com/favicon.ico',
  },
  overview: {
    by: 'price',
    chartleft: 'overall',
    chartRight: 'itemDistribution',
  },
  theme: {
    mode: 'dark',
    effects: 'off',
    checkpoint: 'shell-only',
    particlesEnabled: false,
  },
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SETTINGS_SET_FASTMOVE':
      return {
        ...state,
        fastMove: action.payload,
      };
    case 'SETTINGS_SET_COLUMNS':
      return {
        ...state,
        columns: action.payload,
      };
    case 'SETTINGS_SET_CURRENCY':
      if (action.payload == true) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        currency: action.payload,
      };

    case 'SETTINGS_SET_STEAMLOGINSHOW':
      return {
        ...state,
        steamLoginShow: action.payload,
      };
    case 'SETTINGS_SET_SOURCE':
      return {
        ...state,
        source: action.payload,
      };
    case 'SETTINGS_SET_LOCALE':
      return {
        ...state,
        locale: action.payload,
      };
    case 'SETTINGS_SET_OS':
      return {
        ...state,
        os: action.payload,
      };
    case 'SETTINGS_SET_DEVMODE':
      return {
        ...state,
        devmode: action.payload,
      };
    case 'SETTINGS_SET_OVERVIEW':
      return {
        ...state,
        overview: action.payload,
      };
    case 'SETTINGS_ADD_CURRENCYPRICE':
      return {
        ...state,
        currency: action.payload.currency,
        currencyPrice: {
          ...state.currencyPrice,
          [action.payload.currency]: action.payload.rate,
        },
      };

    case 'SETTINGS_SET_THEME_MODE':
      return {
        ...state,
        theme: { ...state.theme, mode: action.payload },
      };
    case 'SETTINGS_SET_THEME_EFFECTS':
      return {
        ...state,
        theme: { ...state.theme, effects: action.payload },
      };
    case 'SETTINGS_SET_THEME_CHECKPOINT':
      return {
        ...state,
        theme: { ...state.theme, checkpoint: action.payload },
      };
    case 'SETTINGS_SET_THEME_PARTICLES':
      return {
        ...state,
        theme: { ...state.theme, particlesEnabled: action.payload },
      };

    default:
      return { ...state };
  }
};

export default settingsReducer;
