import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ArchiveIcon,
  DocumentDownloadIcon,
  MenuAlt1Icon,
  XIcon,
} from '@heroicons/react/outline';
import {
  ChartBarIcon,
  DownloadIcon,
  InboxInIcon,
  RefreshIcon,
  SearchIcon,
  SelectorIcon,
  UploadIcon,
} from '@heroicons/react/solid';
import {
  Fragment,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './styles/tailwind.css';
import InventoryContent from './components/content/Inventory/inventory';
import { itemCategories } from './components/content/shared/categories';
import {
  classNames,
  sortDataFunction,
} from './components/content/shared/filters/inventoryFunctions';
import Logo from './components/content/shared/iconsLogo/logo 2';
import TradeResultModal from './components/content/shared/modals & notifcations/modalTradeResult';
import itemRarities from './components/content/shared/rarities';
import TitleBarWindows from './components/content/shared/titleBarWindows';
import StorageUnitsComponent from './components/content/storageUnits/from/Content';
import ToContent from './components/content/storageUnits/to/toHolder';
import { toMoveContext } from './context/toMoveContext';
import { filterItemRows } from './functionsClasses/filters/custom';
import { ReducerManager } from './functionsClasses/reducerManager';
import {
  DispatchIPC,
  DispatchStore,
} from './functionsClasses/rendererCommands/admin';
import { State } from './interfaces/states';
import {
  inventoryAddCategoryFilter,
  inventoryAddRarityFilter,
  inventorySetFilter,
} from './store/actions/filtersInventoryActions';
import { setTradeFoundMatch } from './store/actions/modalTrade';
import { pricing_addPrice } from './store/actions/pricingActions';
import { signOut } from './store/actions/userStatsActions';
import { handleUserEvent } from './store/handleMessage';
import LoginPage from './views/login/login';
import OverviewPage from './views/overview/overview';
import SettingsPage from './views/settings/settings';

const GlitterLayer = lazy(() => import('./components/ui/GlitterLayer'));

function resolveThemeRoutePolicy(pathname: string): 'standard' | 'enhanced' {
  const standardRoutes = ['/inventory', '/transferfrom', '/transferto'];
  return standardRoutes.some((r) => pathname.startsWith(r))
    ? 'standard'
    : 'enhanced';
}

DocumentDownloadIcon;

//{ name: 'Reports', href: '/reports', icon: DocumentDownloadIcon, current: false }
const navigation = [
  { name: '总览', href: '/stats', icon: ChartBarIcon, current: false },
  {
    name: '取出 | 从存储组件',
    href: '/transferfrom',
    icon: DownloadIcon,
    current: false,
  },
  {
    name: '存入 | 到存储组件',
    href: '/transferto',
    icon: UploadIcon,
    current: false,
  },
  { name: '库存', href: '/inventory', icon: ArchiveIcon, current: false },
];

function AppContent() {
  SearchIcon;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSideMenuOption, setSideMenuOption] = useState(
    location.pathname
  );

  const [getToMoveContext, setToMoveContext] = useState({
    fromStorage: {},
  });
  const toMoveValue = useMemo(
    () => ({ getToMoveContext, setToMoveContext }),
    [getToMoveContext, setToMoveContext]
  );

  // Redux user details

  const ReducerClass = new ReducerManager(useSelector);
  const currentState: State = ReducerClass.getStorage();
  const userDetails = currentState.authReducer;
  const modalData = currentState.modalMoveReducer;
  const settingsData = currentState.settingsReducer;
  const tradeUpData = currentState.modalTradeReducer;
  const inventory = currentState.inventoryReducer;
  const filterDetails = currentState.inventoryFiltersReducer;
  const latestStateRef = useRef(currentState);
  const latestSettingsRef = useRef(settingsData);
  const latestModalRef = useRef(modalData);

  function updateAutomation(itemHref) {
    setSideMenuOption(itemHref);
    setSidebarOpen(false);
  }

  // Log out of session
  const dispatch = useDispatch();
  const StoreClass = new DispatchStore(dispatch);
  const IPCClass = new DispatchIPC(dispatch);

  async function handleFilterData(combinedInventory) {
    const latestState = latestStateRef.current;
    if (
      latestState.inventoryFiltersReducer.inventoryFilter.length > 0 ||
      latestState.inventoryFiltersReducer.sortValue != 'Default'
    ) {
      let filteredInv = await filterItemRows(
        combinedInventory,
        latestState.inventoryFiltersReducer.inventoryFilter
      );
      filteredInv = await sortDataFunction(
        latestState.inventoryFiltersReducer.sortValue,
        filteredInv,
        latestState.pricingReducer.prices,
        latestState.settingsReducer?.source?.title
      );

      dispatch(
        inventorySetFilter(
          latestState.inventoryFiltersReducer.inventoryFilter,
          latestState.inventoryFiltersReducer.sortValue,
          filteredInv
        )
      );
    }
  }

  // First time setup
  async function setFirstTimeSettings() {
    if (settingsData.currencyPrice[settingsData.currency] == undefined) {
      IPCClass.run(IPCClass.buildingObject.currency);
    }
    if (settingsData.os == '') {
      StoreClass.run(StoreClass.buildingObject.os);
      StoreClass.run(StoreClass.buildingObject.columns);
      StoreClass.run(StoreClass.buildingObject.devmode);
      StoreClass.run(StoreClass.buildingObject.fastmove);
      StoreClass.run(StoreClass.buildingObject.source);
      StoreClass.run(StoreClass.buildingObject.locale);
      StoreClass.run(StoreClass.buildingObject.steamLoginShow);
      StoreClass.run(StoreClass.buildingObject.themeMode);
      StoreClass.run(StoreClass.buildingObject.themeEffects);
      StoreClass.run(StoreClass.buildingObject.themeCheckpoint);
      StoreClass.run(StoreClass.buildingObject.themeParticlesEnabled);
    }
  }

  // Forward user event to Store
  async function handleSubMessage(messageValue) {
    const latestSettings = latestSettingsRef.current;
    const latestModal = latestModalRef.current;

    if (latestSettings.fastMove && latestModal.query.length > 0) {
      console.log('Command blocked', modalData.moveOpen, settingsData.fastMove);
      return;
    }
    if (messageValue.command == undefined) {
      const actionToTake = (await handleUserEvent(
        messageValue,
        latestSettings
      )) as any;
      if (!actionToTake) {
        return;
      }
      dispatch(actionToTake);
      if (messageValue[0] == 1) {
        await handleFilterData(actionToTake.payload.combinedInventory);
      }
    }
  }

  async function logOut() {
    window.electron.ipcRenderer.logUserOut();
    dispatch(signOut());
  }

  async function retryConnection() {
    window.electron.ipcRenderer.retryConnection();
  }

  // Should update status
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [shouldCheckUpdate, setShouldCheckUpdate] = useState(true);

  const [getVersion, setVersion] = useState('');
  async function getUpdate() {
    const doUpdate = await window.electron.ipcRenderer.needUpdate();
    console.log(doUpdate);
    setVersion('v' + doUpdate.currentVersion);
    setShouldUpdate(doUpdate.requireUpdate);
  }

  // Pricing
  const [firstRun, setFirstRun] = useState(false);

  // Trade up
  async function handleTradeUp() {
    inventory.inventory.forEach((element) => {
      if (!tradeUpData.inventoryFirst.includes(element.item_id)) {
        dispatch(setTradeFoundMatch(element));
      }
    });
  }

  const theme = settingsData.theme ?? {
    mode: 'dark',
    effects: 'off',
    checkpoint: 'shell-only',
    particlesEnabled: false,
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.dataset.theme = theme.mode;
    root.dataset.effects = theme.effects;
  }, [theme.mode, theme.effects]);

  useEffect(() => {
    setSideMenuOption(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    latestStateRef.current = currentState;
    latestSettingsRef.current = settingsData;
    latestModalRef.current = modalData;
  }, [currentState, modalData, settingsData]);

  useEffect(() => {
    setFirstTimeSettings();

    const handleUserEvents = (messageValue) => {
      handleSubMessage(messageValue);
    };

    window.electron.ipcRenderer.removeAllListeners('userEvents');
    window.electron.ipcRenderer.on('userEvents', handleUserEvents);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('userEvents');
    };
  }, []);

  useEffect(() => {
    if (!shouldCheckUpdate) {
      return;
    }

    setShouldCheckUpdate(false);
    getUpdate();
  }, [shouldCheckUpdate]);

  useEffect(() => {
    if (firstRun) {
      return;
    }

    setFirstRun(true);
    window.electron.ipcRenderer.on('pricing', (message) => {
      console.log(message);
      dispatch(pricing_addPrice(message[0]));
    });

    window.electron.ipcRenderer.on('updater', (message) => {
      console.log(message);
    });
  }, [dispatch, firstRun]);

  useEffect(() => {
    if (tradeUpData.inventoryFirst.length === 0) {
      return;
    }

    handleTradeUp();
  }, [dispatch, inventory.inventory, tradeUpData.inventoryFirst]);

  return (
    <>
      <TradeResultModal />
      {settingsData.os != 'win32' ? '' : <TitleBarWindows />}
      <div
        className={classNames(
          settingsData.os == 'win32' ? 'pt-7' : '',
          'relative h-screen min-h-0 overflow-hidden bg-[var(--bg-level-one)] text-[var(--text-primary)]'
        )}
      >
        {theme.mode === 'holo' && theme.effects !== 'off' && (
          <div className="absolute inset-0 animated-holographic-gradient pointer-events-none" />
        )}
        {theme.mode === 'holo' &&
          theme.effects !== 'off' &&
          theme.particlesEnabled &&
          theme.checkpoint === 'shell-cards-particles' &&
          resolveThemeRoutePolicy(location.pathname) !== 'standard' && (
            <Suspense fallback={null}>
              <GlitterLayer />
            </Suspense>
          )}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex bg-black/80 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/80" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex w-full max-w-xs flex-1 flex-col border-r border-[var(--border-default)] bg-[var(--bg-level-one)] pt-5 pb-4 text-[var(--text-primary)]">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">关闭侧边栏</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div
                  className={classNames(
                    settingsData.os == 'win32' ? 'pt-7' : '',
                    'flex-shrink-0 flex items-center px-4'
                  )}
                >
                  <Logo />
                  <span className="">{shouldUpdate}</span>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            currentSideMenuOption.includes(item.href)
                              ? 'border-l-2 border-[var(--accent-primary)] bg-[var(--bg-level-two)] text-[var(--text-primary)] pl-[6px]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-level-two)] hover:text-[var(--text-primary)] border-l-2 border-transparent pl-[6px]',
                            userDetails.isLoggedIn ? '' : 'pointer-events-none',
                            'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md transition-colors duration-150'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                          onClick={() => updateAutomation(item.href)}
                        >
                          <item.icon
                            className={classNames(
                              currentSideMenuOption.includes(item.href)
                                ? 'text-[var(--accent-primary)]'
                                : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]',
                              'mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-150'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8">
                      <h3
                        className="px-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                        id="mobile-teams-headline"
                      >
                        物品分类
                      </h3>
                      <div
                        className="mt-1 space-y-1"
                        role="group"
                        aria-labelledby="mobile-teams-headline"
                      >
                        {itemCategories.map((team) => (
                          <a
                            key={team.name}
                            href={team.href}
                            className="group flex items-center px-3 py-2 text-base leading-5 font-medium text-[var(--text-secondary)] rounded-md hover:text-[var(--text-primary)] hover:bg-[var(--bg-level-two)] transition-colors duration-150"
                          >
                            <span
                              className={classNames(
                                team.bgColorClass,
                                'w-2.5 h-2.5 mr-4 rounded-full'
                              )}
                              aria-hidden="true"
                            />
                            <span className="truncate">{team.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[260px] lg:flex-col lg:border-r lg:border-[var(--border-default)] lg:bg-[var(--bg-level-one)] lg:py-5 lg:px-3">
          <div
            className={classNames(
              settingsData.os == 'win32' ? 'pt-7' : '',
              'flex items-center gap-[10px] flex-shrink-0 px-3 pb-5'
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFD700] via-[#A855F7] to-[#38BDF8] shadow-foil">
              <span className="text-[14px] font-extrabold text-black select-none">
                C
              </span>
            </div>
            <span className="text-[15px] font-bold tracking-[0.02em]">
              CaseMoveCn
            </span>
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
            {/* User account dropdown */}
            <Menu
              as="div"
              className={classNames(
                userDetails.isLoggedIn ? '' : 'pointer-events-none',
                'px-3 relative inline-block text-left'
              )}
            >
              <div>
                <Menu.Button className="group w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-level-two)] px-3.5 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-level-three)] hover:border-[var(--border-hover)] transition-colors duration-150 focus:outline-none focus:ring-offset-0">
                  <span className="flex w-full justify-between items-center">
                    <span className="flex min-w-0 items-center justify-between space-x-3">
                      {userDetails.userProfilePicture == null ? (
                        <svg
                          className="w-10 h-10 rounded-full flex-shrink-0 text-[var(--text-tertiary)]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <img
                          className="w-10 h-10 bg-[var(--bg-level-three)] rounded-full flex-shrink-0"
                          src={userDetails.userProfilePicture}
                          alt=""
                        />
                      )}

                      <span className="flex-1 flex flex-col min-w-0">
                        <span className="text-[var(--text-primary)] text-sm font-medium truncate">
                          {userDetails.displayName}
                        </span>
                        <span className="text-xs font-medium text-[var(--text-tertiary)]">
                          <span
                            className={classNames(
                              userDetails.CSGOConnection
                                ? 'text-[var(--success)]'
                                : 'text-[var(--error)]',
                              'text-xs font-medium'
                            )}
                          >
                            <div className="flex justify-between">
                              <div>
                                {userDetails.CSGOConnection
                                  ? '已登录'
                                  : '未登录'}
                              </div>
                            </div>
                            <div className="text-[var(--text-tertiary)]">
                              {userDetails.walletBalance?.balance == 0 ||
                              userDetails.walletBalance == null
                                ? ''
                                : new Intl.NumberFormat(settingsData.locale, {
                                    style: 'currency',
                                    currency:
                                      userDetails.walletBalance?.currency ||
                                      settingsData.currency,
                                  }).format(
                                    userDetails.walletBalance?.balance || 0
                                  )}
                            </div>
                          </span>
                        </span>
                      </span>
                    </span>
                    <SelectorIcon
                      className="flex-shrink-0 h-5 w-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                      aria-hidden="true"
                    />
                  </span>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] bg-[var(--bg-level-three)] border border-[var(--border-default)] divide-y divide-[var(--border-default)] focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={classNames(
                            active
                              ? 'bg-[var(--bg-level-four)] text-[var(--text-primary)]'
                              : 'text-[var(--text-secondary)]',
                            'block px-4 py-2 text-sm transition-colors duration-100'
                          )}
                        >
                          设置
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to=""
                          onClick={() => logOut()}
                          className={classNames(
                            active
                              ? 'bg-[var(--bg-level-four)] text-[var(--text-primary)]'
                              : 'text-[var(--text-secondary)]',
                            'block px-4 py-2 text-sm transition-colors duration-100'
                          )}
                        >
                          退出登录
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className={shouldUpdate ? 'px-3 mt-5' : 'px-3 mt-5 '}>
              {!userDetails.CSGOConnection && userDetails.isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => retryConnection()}
                  className="inline-flex items-center px-4 py-2 text-left text-sm w-full font-medium rounded-md bg-[var(--bg-level-two)] hover:bg-[var(--bg-level-three)] border border-[var(--border-default)] focus:outline-none h-9 text-[var(--text-secondary)]"
                >
                  <RefreshIcon
                    className="mr-3 h-4 w-4 text-[var(--success)]"
                    style={{ marginLeft: -25 }}
                    aria-hidden="true"
                  />
                  <span className="mr-3 text-[var(--success)]">重新连接</span>
                </button>
              ) : shouldUpdate ? (
                <button
                  type="button"
                  disabled={true}
                  className="inline-flex items-center my-4 px-4 py-2 text-left text-sm w-full font-medium rounded-md bg-[var(--bg-level-two)] border border-[var(--border-default)] focus:outline-none h-9 text-[var(--text-secondary)]"
                >
                  <InboxInIcon
                    className="mr-3 h-4 w-4 text-[var(--text-secondary)]"
                    style={{ marginLeft: -22 }}
                    aria-hidden="true"
                  />
                  <span className="mr-3 ">
                    有新版本可用 <br />
                    请重启或下载更新
                  </span>
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <a
                    href="https://qm.qq.com/cgi-bin/qm/qr?k=10ly-zqW9ABP9IKwI2Esc8OzSMiaG5YB&jump_from=webapi&authKey=oSbIQGXl4NK3n9rSdzgtAHvsAyQXD06QNri3dsSYRYEQhMiiAPK1BAsK7WD2iunm"
                    target="_blank"
                  >
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 border border-[var(--border-default)] bg-[var(--bg-level-two)] text-left text-sm w-full font-medium rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] focus:outline-none h-9"
                    >
                      <div
                        className="mr-3 h-4 w-4 text-[var(--text-secondary)]"
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 127.14 96.36"
                          className="pt-0.5"
                        >
                          <g data-name="\u56FE\u5C42 2">
                            <g data-name="Discord Logos">
                              <path
                                d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"
                                data-name="Discord Logo - Large - White"
                                style={{
                                  fill: '#fff',
                                }}
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                      <span className="mr-3">加入 QQ 群</span>
                    </button>
                  </a>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="mt-5">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      currentSideMenuOption.includes(item.href)
                        ? 'foil-active-bar bg-[var(--bg-level-three)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] hover:text-[var(--text-primary)]',
                      userDetails.isLoggedIn ? '' : 'pointer-events-none',
                      'group flex items-center gap-[10px] px-3 py-[9px] text-[13.5px] font-medium rounded-[7px] transition-colors duration-150'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => updateAutomation(item.href)}
                  >
                    <item.icon
                      className={classNames(
                        currentSideMenuOption.includes(item.href)
                          ? 'opacity-100'
                          : 'opacity-70 group-hover:opacity-100',
                        'flex-shrink-0 h-[18px] w-[18px] transition-opacity duration-150'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
              {!currentSideMenuOption.includes('/tradeup') ? (
                <div className="mt-6">
                  {/* Secondary navigation */}
                  <h3
                    className="px-3 py-[6px] text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.10em]"
                    id="desktop-teams-headline"
                  >
                    物品分类
                  </h3>
                  <div
                    className="mt-1 space-y-1"
                    role="group"
                    aria-labelledby="desktop-teams-headline"
                  >
                    {itemCategories.map((team) => (
                      <div
                        key={team.name}
                        className={classNames(
                          filterDetails.categoryFilter?.includes(
                            team.bgColorClass
                          )
                            ? 'bg-[var(--bg-level-two)]'
                            : '',
                          'w-full'
                        )}
                      >
                        <button
                          key={team.name}
                          onClick={() =>
                            dispatch(
                              inventoryAddCategoryFilter(team.bgColorClass)
                            )
                          }
                          className={classNames(
                            userDetails.isLoggedIn == false
                              ? 'pointer-events-none'
                              : '',
                            'group flex items-center px-3 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-md hover:text-[var(--text-primary)] transition-colors duration-150'
                          )}
                        >
                          <span
                            className={classNames(
                              team.bgColorClass,
                              'w-2.5 h-2.5 mr-4 rounded-full'
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{team.name}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  {/* Secondary navigation */}
                  <h3
                    className="px-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider"
                    id="desktop-teams-headline"
                  >
                    稀有度
                  </h3>
                  <div
                    className="mt-1 space-y-1"
                    role="group"
                    aria-labelledby="desktop-teams-headline"
                  >
                    {itemRarities.map((rarity) => (
                      <div
                        key={rarity.value}
                        className={classNames(
                          filterDetails.rarityFilter?.includes(
                            rarity.bgColorClass
                          )
                            ? 'bg-[var(--bg-level-two)]'
                            : '',
                          'w-full'
                        )}
                      >
                        <button
                          key={rarity.value}
                          onClick={() =>
                            dispatch(
                              inventoryAddRarityFilter(rarity.bgColorClass)
                            )
                          }
                          className={classNames(
                            userDetails.isLoggedIn == false
                              ? 'pointer-events-none'
                              : '',
                            'group flex items-center px-3 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-md hover:text-[var(--text-primary)] transition-colors duration-150'
                          )}
                        >
                          <span
                            className={classNames(
                              rarity.bgColorClass,
                              'w-2.5 h-2.5 mr-4 rounded-full'
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate">{rarity.value}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs pl-4 text-[var(--text-tertiary)]">
              {getVersion}
            </span>
            <a
              className="flex items-center text-xs gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
              href="https://github.com/iBuyPower47/casemovecn"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 127.14 96.36"
                className=" h-4 w-4  pt-0.5"
              >
                <g data-name="\u56FE\u5C42 2">
                  <g data-name="Discord Logos">
                    <path
                      d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"
                      data-name="Discord Logo - Large - White"
                      style={{
                        fill: 'var(--text-primary)',
                      }}
                    />
                  </g>
                </g>
              </svg>
              帮助与支持
            </a>
          </div>
        </div>
        {/* Main column */}
        <div className="flex min-h-0 flex-col lg:pl-[260px]">
          {/* Search header */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-[var(--border-default)] bg-[var(--bg-level-one)] lg:hidden">
            <button
              type="button"
              className="px-4 border-r border-[var(--border-default)] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent-primary)] lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">打开侧边栏</span>
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex-1 items-center justify-end flex">
                <div className="px-3">
                  {!userDetails.CSGOConnection && userDetails.isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => retryConnection()}
                      className="inline-flex items-center px-4 py-2 text-left text-sm w-full font-medium rounded-md bg-[var(--bg-level-two)] hover:bg-[var(--bg-level-three)] border border-[var(--border-default)] focus:outline-none h-9 text-[var(--text-secondary)]"
                    >
                      <RefreshIcon
                        className="mr-3 h-4 w-4 text-[var(--success)]"
                        style={{ marginLeft: -25 }}
                        aria-hidden="true"
                      />
                      <span className="mr-3 text-[var(--success)]">
                        重新连接
                      </span>
                    </button>
                  ) : ("")}
                </div>
              </div>
              <div className="flex items-center">
                {/* Profile dropdown */}
                <Menu
                  as="div"
                  className={classNames(
                    userDetails.isLoggedIn ? '' : 'pointer-events-none',
                    'ml-3 relative'
                  )}
                >
                  <div>
                    <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]">
                      <span className="sr-only">打开用户菜单</span>
                      {userDetails.userProfilePicture == null ? (
                        <svg
                          className="w-10 h-10 rounded-full flex-shrink-0 text-[var(--text-tertiary)]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <img
                          className={classNames(
                            userDetails.CSGOConnection
                              ? 'border-2 border-solid border-[var(--success)]'
                              : 'border-4 border-solid border-[var(--error)]',
                            'w-10 h-10 bg-[var(--bg-level-three)] rounded-full flex-shrink-0'
                          )}
                          src={userDetails.userProfilePicture}
                          alt=""
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] bg-[var(--bg-level-three)] border border-[var(--border-default)] divide-y divide-[var(--border-default)] focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to=""
                              onClick={() => logOut()}
                              className={classNames(
                                active
                                  ? 'bg-[var(--bg-level-four)] text-[var(--text-primary)]'
                                  : 'text-[var(--text-secondary)]',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              退出登录
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-transparent">
            <toMoveContext.Provider value={toMoveValue}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Navigate
                      replace
                      to={userDetails.isLoggedIn ? '/stats' : '/signin'}
                    />
                  }
                />
                <Route
                  path="/signin"
                  element={
                    userDetails.isLoggedIn ? (
                      <Navigate replace to="/stats" />
                    ) : (
                      <LoginPage />
                    )
                  }
                />
                <Route
                  path="/transferfrom"
                  element={
                    userDetails.isLoggedIn ? (
                      <StorageUnitsComponent />
                    ) : (
                      <Navigate replace to="/signin" />
                    )
                  }
                />
                <Route
                  path="/transferto"
                  element={
                    userDetails.isLoggedIn ? (
                      <ToContent />
                    ) : (
                      <Navigate replace to="/signin" />
                    )
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    userDetails.isLoggedIn ? (
                      <InventoryContent />
                    ) : (
                      <Navigate replace to="/signin" />
                    )
                  }
                />
                <Route
                  path="/settings"
                  element={
                    userDetails.isLoggedIn ? (
                      <SettingsPage />
                    ) : (
                      <Navigate replace to="/signin" />
                    )
                  }
                />
                <Route
                  path="/stats"
                  element={
                    userDetails.isLoggedIn ? (
                      <OverviewPage />
                    ) : (
                      <Navigate replace to="/signin" />
                    )
                  }
                />
                <Route
                  path="*"
                  element={
                    <Navigate
                      replace
                      to={userDetails.isLoggedIn ? '/stats' : '/signin'}
                    />
                  }
                />
              </Routes>
            </toMoveContext.Provider>
          </main>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
