import {
  setColumns,
  setCurrencyRate,
  setCurrencyValue,
  setSourceValue,
  setFastMove,
  setDevmode,
  setLocale,
  setOS,
  setSteamLoginShow,
  setThemeMode,
  setThemeEffects,
  setThemeCheckpoint,
  setThemeParticlesEnabled,
} from 'renderer/store/actions/settings';
import {
  DispatchIPCBuildingObject,
  DispatchIPCHandleBuildingOptionsClass,
  DispatchStoreBuildingObject,
  DispatchStoreHandleBuildingOptionsClass,
} from 'shared/Interfaces.tsx/login';

export class IPCCommunication {
  ipc = window.electron.ipcRenderer;
  store = window.electron.store;

  async get(command: Function) {
    return await command().then((returnValue) => {
      return returnValue;
    });
  }
  async storeGet(settingToGet: string) {
    return await this.store.get(settingToGet).then((returnValue) => {
      return returnValue;
    });
  }
}

// Dispatch Store
export class DispatchStore extends IPCCommunication {
  dispatch: Function;
  buildingObject: DispatchStoreHandleBuildingOptionsClass = {
    source: {
      name: 'pricing.source',
      action: setSourceValue,
    },
    fastmove: {
      name: 'fastmove',
      action: setFastMove,
    },
    locale: {
      name: 'locale',
      action: setLocale,
    },
    os: {
      name: 'os',
      action: setOS,
    },
    columns: {
      name: 'columns',
      action: setColumns,
    },
    devmode: {
      name: 'devmode.value',
      action: setDevmode,
    },
    currency: {
      name: 'currency',
      action: setCurrencyValue,
    },
    steamLoginShow: {
      name: 'steamLogin',
      action: setSteamLoginShow,
    },
    themeMode: {
      name: 'theme.mode',
      action: setThemeMode,
    },
    themeEffects: {
      name: 'theme.effects',
      action: setThemeEffects,
    },
    themeCheckpoint: {
      name: 'theme.checkpoint',
      action: setThemeCheckpoint,
    },
    themeParticlesEnabled: {
      name: 'theme.particlesEnabled',
      action: setThemeParticlesEnabled,
    },
  };
  constructor(dispatch: Function) {
    super();
    this.dispatch = dispatch;
  }

  async run(buildingObject: DispatchStoreBuildingObject) {
    this.storeGet(buildingObject.name).then((returnValue) => {
      if (returnValue != undefined) {
        this.dispatch(buildingObject.action(returnValue));
      }
    });
  }
}

// Dispatch IPC
export class DispatchIPC extends IPCCommunication {
  dispatch: Function;
  buildingObject: DispatchIPCHandleBuildingOptionsClass = {
    currency: {
      endpoint: this.ipc.getCurrencyRate,
      action: setCurrencyRate,
    },
  };

  constructor(dispatch: Function) {
    super();
    this.dispatch = dispatch;
  }

  async run(buildingObject: DispatchIPCBuildingObject) {
    this.get(buildingObject.endpoint).then((returnValue) => {
      if (returnValue != undefined) {
        this.dispatch(buildingObject.action(returnValue));
      }
    });
  }
}
