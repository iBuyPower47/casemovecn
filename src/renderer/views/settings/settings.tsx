import { Listbox, Switch, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ColumnsDropDown from 'renderer/components/content/shared/dropdownRows';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import { DispatchIPC } from 'renderer/functionsClasses/rendererCommands/admin';
import {
  setCurrencyValue,
  // setDevmode,
  setSteamLoginShow,
  setFastMove,
  setSourceValue,
  // setThemeMode,
  // setThemeEffects,
  // setThemeCheckpoint,
  // setThemeParticlesEnabled,
} from 'renderer/store/actions/settings';

const sources = [
  {
    id: 1,
    name: 'Steam Community Market',
    title: 'steam_listing',
    isLocked: false,
    avatar: 'https://steamcommunity.com/favicon.ico',
  },
  {
    id: 2,
    name: 'Buff 163',
    title: 'buff163',
    isLocked: false,
    avatar:
      'https://g.fp.ps.netease.com/market/file/59b156975e6027bce06e8f6ceTyFGdsj',
  },
];
const currencyCode = [
  'AFN',
  'ALL',
  'DZD',
  'AOA',
  'ARS',
  'AMD',
  'AWG',
  'AUD',
  'AZN',
  'BSD',
  'BHD',
  'BBD',
  'BDT',
  'BZD',
  'BMD',
  'BTN',
  'BOB',
  'BAM',
  'BWP',
  'BRL',
  'BND',
  'BGN',
  'BIF',
  'XPF',
  'KHR ',
  'CAD',
  'CVE',
  'KYD',
  'CLP',
  'CLF',
  'CNY',
  'COP',
  'CDF',
  'CRC',
  'HRK',
  'CZK',
  'DKK',
  'DJF',
  'DOP',
  'XCD',
  'EGP',
  'ETB',
  'FJD',
  'GMD',
  'GBP',
  'GEL',
  'GHS',
  'GTQ',
  'GNF',
  'GYD',
  'HTG',
  'HNL',
  'HKD',
  'HUF',
  'ISK',
  'INR',
  'IDR',
  'IRR',
  'IQD',
  'ILS',
  'JMD',
  'JPY',
  'JOD',
  'KZT',
  'KES',
  'KWD',
  'KGS',
  'LAK',
  'LBP',
  'LSL',
  'LRD',
  'LYD',
  'MOP',
  'MKD',
  'MGA',
  'MWK',
  'MYR',
  'MVR',
  'MUR',
  'MXN',
  'MDL',
  'MAD',
  'MZN',
  'MMK',
  'NAD',
  'NPR',
  'ANG',
  'NZD',
  'NIO',
  'NGN',
  'NOK',
  'OMR',
  'PKR',
  'PAB',
  'PGK',
  'PYG ',
  'PHP',
  'PLN',
  'QAR',
  'RON',
  'RUB',
  'RWF',
  'SVC',
  'SAR',
  'RSD',
  'SCR',
  'SLL',
  'SGD',
  'SBD',
  'SOS',
  'ZAR',
  'KRW',
  'VES',
  'LKR',
  'SDG',
  'SRD',
  'SZL',
  'SEK',
  'CHF',
  'TJS',
  'TZS',
  'THB',
  'TOP',
  'TTD',
  'TND',
  'TRY',
  'TMT',
  'UGX',
  'UAH',
  'AED',
  'USD',
  'UYU',
  'UZS',
  'VND',
  'XOF',
  'YER',
  'ZMW',
  'ETH',
  'EUR',
  'LTC',
  'TWD',
  'PEN',
];
export default function settingsPage() {
  const dispatch = useDispatch();
  const settingsData = useSelector((state: any) => state.settingsReducer);
  // const theme = settingsData.theme ?? {
  //   mode: 'dark',
  //   effects: 'off',
  //   particlesEnabled: false,
  // };
  //
  // async function updateThemeMode(isHolo: boolean) {
  //   const mode = isHolo ? 'holo' : 'dark';
  //   const checkpoint =
  //     mode === 'dark'
  //       ? ('shell-only' as const)
  //       : theme.particlesEnabled
  //       ? ('shell-cards-particles' as const)
  //       : ('shell-cards' as const);
  //   dispatch(setThemeMode(mode));
  //   dispatch(setThemeCheckpoint(checkpoint));
  //   window.electron.store.set('theme.mode', mode);
  //   window.electron.store.set('theme.checkpoint', checkpoint);
  // }
  //
  // async function updateThemeEffects(effects: 'off' | 'soft' | 'full') {
  //   dispatch(setThemeEffects(effects));
  //   window.electron.store.set('theme.effects', effects);
  // }
  //
  // async function updateThemeParticles(enabled: boolean) {
  //   const checkpoint = enabled
  //     ? ('shell-cards-particles' as const)
  //     : theme.mode === 'holo'
  //     ? ('shell-cards' as const)
  //     : ('shell-only' as const);
  //   dispatch(setThemeParticlesEnabled(enabled));
  //   dispatch(setThemeCheckpoint(checkpoint));
  //   window.electron.store.set('theme.particlesEnabled', enabled);
  //   window.electron.store.set('theme.checkpoint', checkpoint);
  // }

  // Fastmove
  async function updateShowSteamLogin() {
    const correctValue = !(await window.electron.store.get('steamLogin'));
    setShowSteamLogin(correctValue);
    await window.electron.store.set('steamLogin', correctValue);
    dispatch(setSteamLoginShow(correctValue));
  }
  const [showSteamLogin, setShowSteamLogin] = useState(
    settingsData.steamLoginShow
  );

  // Fastmove
  async function updateFastMove() {
    const correctValue = !(await window.electron.store.get('fastmove'));
    setFastMoveStatus(correctValue);
    await window.electron.store.set('fastmove', correctValue);
    dispatch(setFastMove(correctValue));
  }
  const [fastMoveStatus, setFastMoveStatus] = useState(settingsData.fastMove);

  // // Dark mode
  // async function updateDevMode() {
  //   const correctValue = !(await window.electron.store.get('devmode.value'));
  //   setDevModeStatus(correctValue);
  //   await window.electron.store.set('devmode.value', correctValue);
  //   dispatch(setDevmode(correctValue));
  // }
  // const [devModeStatus, setDevModeStatus] = useState(settingsData.devmode);

  // Pricing - currency
  async function updateCurrency(valueToSet) {
    setCurrency(valueToSet);
    dispatch(setCurrencyValue(valueToSet));
    window.electron.store.set('pricing.currency', valueToSet);
    const IPCClass = new DispatchIPC(dispatch);
    IPCClass.run(IPCClass.buildingObject.currency);
  }
  const [currency, setCurrency] = useState(settingsData.currency);

  // Pricing - source
  async function updateSource(valueToSet) {
    setSource(valueToSet);
    dispatch(setSourceValue(valueToSet));
    window.electron.store.set('pricing.source', valueToSet);
    window.electron.ipcRenderer.refreshInventory();
  }
  const [source, setSource] = useState(settingsData.source);

  return (
    <>
      {/*
        This example requires updating your template:
        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        {/* Page title & actions */}
        <div className="border-b border-[var(--border-default)] px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-[var(--text-primary)] sm:truncate">
              设置
            </h1>
          </div>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto content-scrollbar max-h-[calc(100vh-90px)]">
          <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0">
            <main className="flex-1">
              <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                <div className="pb-16">
                  <div className="px-4 sm:px-6 md:px-0">
                    <div className="py-6">
                      {/* Description list with inline editing */}
                      <div className="divide-y divide-[var(--border-default)]">
                        <div className="">
                          <h3 className="text-lg pt-5 leading-6 font-medium text-[var(--text-primary)]">
                            常规设置
                          </h3>
                          <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
                            切换常规应用设置
                          </p>
                          <dl className="divide-y divide-[var(--border-default)]">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-[var(--text-primary)]">
                                显示关闭弹窗 <br />
                                <span className="text-[var(--text-tertiary)]">
                                  {' '}
                                  登录时若 Steam 已打开，显示关闭提示弹窗。
                                </span>
                              </dt>

                              <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <Switch
                                    checked={showSteamLogin}
                                    onChange={() => updateShowSteamLogin()}
                                    className={classNames(
                                      showSteamLogin
                                        ? 'bg-[var(--accent-primary)]'
                                        : 'bg-[var(--bg-level-three)]',
                                      'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        showSteamLogin
                                          ? 'translate-x-5'
                                          : 'translate-x-0',
                                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transform ring-0 transition ease-in-out duration-200'
                                      )}
                                    >
                                      <span
                                        className={classNames(
                                          showSteamLogin
                                            ? 'opacity-0 ease-out duration-100'
                                            : 'opacity-100 ease-in duration-200',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-[var(--text-tertiary)]"
                                          fill="none"
                                          viewBox="0 0 12 12"
                                        >
                                          <path
                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span
                                        className={classNames(
                                          showSteamLogin
                                            ? 'opacity-100 ease-in duration-200'
                                            : 'opacity-0 ease-out duration-100',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-[var(--accent-primary)]"
                                          fill="currentColor"
                                          viewBox="0 0 12 12"
                                        >
                                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                      </span>
                                    </span>
                                  </Switch>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-[var(--text-primary)]">
                                快速存取 <br />
                                <span className="text-[var(--text-tertiary)]">
                                  {' '}
                                  提高存取速度，但可能更容易失败。
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <Switch
                                    checked={window.electron.store.get(
                                      'fastmove'
                                    )}
                                    onChange={() => updateFastMove()}
                                    className={classNames(
                                      fastMoveStatus
                                        ? 'bg-[var(--accent-primary)]'
                                        : 'bg-[var(--bg-level-three)]',
                                      'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        fastMoveStatus
                                          ? 'translate-x-5'
                                          : 'translate-x-0',
                                        'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transform ring-0 transition ease-in-out duration-200'
                                      )}
                                    >
                                      <span
                                        className={classNames(
                                          fastMoveStatus
                                            ? 'opacity-0 ease-out duration-100'
                                            : 'opacity-100 ease-in duration-200',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-[var(--text-tertiary)]"
                                          fill="none"
                                          viewBox="0 0 12 12"
                                        >
                                          <path
                                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                      <span
                                        className={classNames(
                                          fastMoveStatus
                                            ? 'opacity-100 ease-in duration-200'
                                            : 'opacity-0 ease-out duration-100',
                                          'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                                        )}
                                        aria-hidden="true"
                                      >
                                        <svg
                                          className="h-3 w-3 text-[var(--accent-primary)]"
                                          fill="currentColor"
                                          viewBox="0 0 12 12"
                                        >
                                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                      </span>
                                    </span>
                                  </Switch>
                                </span>
                              </dd>
                            </div>
                            {/*<div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">*/}
                            {/*  <dt className="text-sm font-medium text-[var(--text-primary)]">*/}
                            {/*    开发者模式 <br />*/}
                            {/*    <span className="text-[var(--text-tertiary)]">*/}
                            {/*      {' '}*/}
                            {/*      启用额外的开发者功能*/}
                            {/*    </span>*/}
                            {/*  </dt>*/}
                            {/*  <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">*/}
                            {/*    <span className="flex-grow"></span>*/}
                            {/*    <span className="flex items-center ml-4 flex-shrink-0">*/}
                            {/*      <Switch*/}
                            {/*        checked={devModeStatus}*/}
                            {/*        onChange={() => updateDevMode()}*/}
                            {/*        className={classNames(*/}
                            {/*          devModeStatus*/}
                            {/*            ? 'bg-[var(--accent-primary)]'*/}
                            {/*            : 'bg-[var(--bg-level-three)]',*/}
                            {/*          'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'*/}
                            {/*        )}*/}
                            {/*      >*/}
                            {/*        <span*/}
                            {/*          className={classNames(*/}
                            {/*            devModeStatus*/}
                            {/*              ? 'translate-x-5'*/}
                            {/*              : 'translate-x-0',*/}
                            {/*            'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transform ring-0 transition ease-in-out duration-200'*/}
                            {/*          )}*/}
                            {/*        >*/}
                            {/*          <span*/}
                            {/*            className={classNames(*/}
                            {/*              devModeStatus*/}
                            {/*                ? 'opacity-0 ease-out duration-100'*/}
                            {/*                : 'opacity-100 ease-in duration-200',*/}
                            {/*              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'*/}
                            {/*            )}*/}
                            {/*            aria-hidden="true"*/}
                            {/*          >*/}
                            {/*            <svg*/}
                            {/*              className="h-3 w-3 text-[var(--text-tertiary)]"*/}
                            {/*              fill="none"*/}
                            {/*              viewBox="0 0 12 12"*/}
                            {/*            >*/}
                            {/*              <path*/}
                            {/*                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"*/}
                            {/*                stroke="currentColor"*/}
                            {/*                strokeWidth={2}*/}
                            {/*                strokeLinecap="round"*/}
                            {/*                strokeLinejoin="round"*/}
                            {/*              />*/}
                            {/*            </svg>*/}
                            {/*          </span>*/}
                            {/*          <span*/}
                            {/*            className={classNames(*/}
                            {/*              devModeStatus*/}
                            {/*                ? 'opacity-100 ease-in duration-200'*/}
                            {/*                : 'opacity-0 ease-out duration-100',*/}
                            {/*              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'*/}
                            {/*            )}*/}
                            {/*            aria-hidden="true"*/}
                            {/*          >*/}
                            {/*            <svg*/}
                            {/*              className="h-3 w-3 text-[var(--accent-primary)]"*/}
                            {/*              fill="currentColor"*/}
                            {/*              viewBox="0 0 12 12"*/}
                            {/*            >*/}
                            {/*              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />*/}
                            {/*            </svg>*/}
                            {/*          </span>*/}
                            {/*        </span>*/}
                            {/*      </Switch>*/}
                            {/*    </span>*/}
                            {/*  </dd>*/}
                            {/*</div>*/}
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-[var(--text-primary)]">
                                显示列 <br />
                                <span className="text-[var(--text-tertiary)]">
                                  {' '}
                                  选择要显示的列
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <ColumnsDropDown />
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div className="mt-10 divide-y divide-[var(--border-default)]">
                        <div className="space-y-1">
                          <h3 className="text-lg leading-6 font-medium text-[var(--text-primary)]">
                            定价
                          </h3>
                          <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
                            设置定价相关选项
                          </p>
                          <dl className="divide-y divide-[var(--border-default)]">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-[var(--text-primary)]">
                                价格来源 <br />
                                <span className="text-[var(--text-tertiary)]">
                                  {' '}
                                  选择价格数据来源
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <Listbox
                                    value={source}
                                    onChange={(e) => updateSource(e)}
                                  >
                                    {({ open }) => (
                                      <>
                                        <div className="mt-1 relative">
                                          <Listbox.Button className="relative w-full bg-[var(--bg-level-two)] border border-[var(--border-default)] rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] sm:text-sm">
                                            <span className="flex items-center">
                                              <img
                                                src={source?.avatar}
                                                alt=""
                                                className="flex-shrink-0 h-6 w-6 rounded-full"
                                              />
                                              <span className="ml-3 block truncate">
                                                {source?.name}
                                              </span>
                                            </span>
                                            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                              <SelectorIcon
                                                className="h-5 w-5 text-[var(--text-tertiary)]"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          </Listbox.Button>

                                          <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                          >
                                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-[var(--bg-level-three)] border border-[var(--border-default)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] max-h-56 rounded-lg py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                                              {sources.map((source) => (
                                                <Listbox.Option
                                                  key={source.id}
                                                  className={({ active }) =>
                                                    classNames(
                                                      active
                                                        ? 'bg-[var(--bg-level-four)] text-[var(--text-primary)]'
                                                        : 'text-[var(--text-secondary)]',
                                                      'cursor-default select-none relative py-2 pl-3 pr-9'
                                                    )
                                                  }
                                                  value={source}
                                                >
                                                  {({ selected, active }) => (
                                                    <>
                                                      <div className="flex items-center">
                                                        <img
                                                          src={source.avatar}
                                                          alt=""
                                                          className="flex-shrink-0 h-6 w-6 rounded-full"
                                                        />
                                                        <span
                                                          className={classNames(
                                                            selected
                                                              ? 'font-semibold'
                                                              : 'font-normal',
                                                            'ml-3 block truncate'
                                                          )}
                                                        >
                                                          {source.name}
                                                        </span>
                                                      </div>

                                                      {selected ? (
                                                        <span
                                                          className={classNames(
                                                            active
                                                              ? 'text-[var(--text-primary)]'
                                                              : 'text-[var(--accent-primary)]',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                          )}
                                                        >
                                                          <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                          />
                                                        </span>
                                                      ) : null}
                                                    </>
                                                  )}
                                                </Listbox.Option>
                                              ))}
                                            </Listbox.Options>
                                          </Transition>
                                        </div>
                                      </>
                                    )}
                                  </Listbox>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm font-medium text-[var(--text-primary)]">
                                货币 <br />
                                <span className="text-[var(--text-tertiary)]">
                                  {' '}
                                  价格将转换为此货币显示
                                </span>
                              </dt>
                              <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">
                                <span className="flex-grow"></span>
                                <span className="flex items-center ml-4 flex-shrink-0">
                                  <div>
                                    <select
                                      id="location"
                                      name="location"
                                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-[var(--bg-level-two)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] sm:text-sm rounded-md"
                                      value={currency}
                                      onChange={(e) =>
                                        updateCurrency(e.target.value)
                                      }
                                    >
                                      {currencyCode.sort().map((code) => (
                                        <option key={code}>{code}</option>
                                      ))}
                                    </select>
                                  </div>
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      {/*<div className="mt-10 divide-y divide-[var(--border-default)]">*/}
                      {/*  <div className="space-y-1">*/}
                      {/*    <h3 className="text-lg leading-6 font-medium text-[var(--text-primary)]">*/}
                      {/*      主题*/}
                      {/*    </h3>*/}
                      {/*    <p className="max-w-2xl text-sm text-[var(--text-secondary)]">*/}
                      {/*      自定义应用视觉主题*/}
                      {/*    </p>*/}
                      {/*    <dl className="divide-y divide-[var(--border-default)]">*/}
                      {/*      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">*/}
                      {/*        <dt className="text-sm font-medium text-[var(--text-primary)]">*/}
                      {/*          全息彩膜模式 <br />*/}
                      {/*          <span className="text-[var(--text-tertiary)]">*/}
                      {/*            启用全息彩虹渐变视觉效果*/}
                      {/*          </span>*/}
                      {/*        </dt>*/}
                      {/*        <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">*/}
                      {/*          <span className="flex-grow"></span>*/}
                      {/*          <span className="flex items-center ml-4 flex-shrink-0">*/}
                      {/*            <Switch*/}
                      {/*              checked={theme.mode === 'holo'}*/}
                      {/*              onChange={(checked) =>*/}
                      {/*                updateThemeMode(checked)*/}
                      {/*              }*/}
                      {/*              className={classNames(*/}
                      {/*                theme.mode === 'holo'*/}
                      {/*                  ? 'bg-[var(--accent-primary)]'*/}
                      {/*                  : 'bg-[var(--bg-level-three)]',*/}
                      {/*                'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'*/}
                      {/*              )}*/}
                      {/*            >*/}
                      {/*              <span*/}
                      {/*                className={classNames(*/}
                      {/*                  theme.mode === 'holo'*/}
                      {/*                    ? 'translate-x-5'*/}
                      {/*                    : 'translate-x-0',*/}
                      {/*                  'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transform ring-0 transition ease-in-out duration-200'*/}
                      {/*                )}*/}
                      {/*              />*/}
                      {/*            </Switch>*/}
                      {/*          </span>*/}
                      {/*        </dd>*/}
                      {/*      </div>*/}

                      {/*      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">*/}
                      {/*        <dt className="text-sm font-medium text-[var(--text-primary)]">*/}
                      {/*          特效强度 <br />*/}
                      {/*          <span className="text-[var(--text-tertiary)]">*/}
                      {/*            控制视觉特效的渲染程度*/}
                      {/*          </span>*/}
                      {/*        </dt>*/}
                      {/*        <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">*/}
                      {/*          <span className="flex-grow"></span>*/}
                      {/*          <span className="flex items-center ml-4 flex-shrink-0 gap-2">*/}
                      {/*            {(['off', 'soft', 'full'] as const).map(*/}
                      {/*              (level) => (*/}
                      {/*                <button*/}
                      {/*                  key={level}*/}
                      {/*                  type="button"*/}
                      {/*                  onClick={() =>*/}
                      {/*                    updateThemeEffects(level)*/}
                      {/*                  }*/}
                      {/*                  disabled={theme.mode !== 'holo'}*/}
                      {/*                  className={classNames(*/}
                      {/*                    theme.effects === level*/}
                      {/*                      ? 'bg-gradient-to-r from-[#FFD700] via-[#A855F7] to-[#38BDF8] text-black font-semibold'*/}
                      {/*                      : 'bg-[var(--bg-level-three)] text-[var(--text-secondary)] hover:bg-[var(--bg-level-four)] hover:text-[var(--text-primary)]',*/}
                      {/*                    theme.mode !== 'holo'*/}
                      {/*                      ? 'opacity-40 cursor-not-allowed'*/}
                      {/*                      : '',*/}
                      {/*                    'px-3 py-1.5 text-sm rounded-md transition-colors'*/}
                      {/*                  )}*/}
                      {/*                >*/}
                      {/*                  {level === 'off'*/}
                      {/*                    ? '关闭'*/}
                      {/*                    : level === 'soft'*/}
                      {/*                    ? '柔和'*/}
                      {/*                    : '完整'}*/}
                      {/*                </button>*/}
                      {/*              )*/}
                      {/*            )}*/}
                      {/*          </span>*/}
                      {/*        </dd>*/}
                      {/*      </div>*/}

                      {/*      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">*/}
                      {/*        <dt className="text-sm font-medium text-[var(--text-primary)]">*/}
                      {/*          粒子特效 <br />*/}
                      {/*          <span className="text-[var(--text-tertiary)]">*/}
                      {/*            显示闪粉粒子动画（需全息模式）*/}
                      {/*          </span>*/}
                      {/*        </dt>*/}
                      {/*        <dd className="mt-1 flex text-sm text-[var(--text-primary)] sm:mt-0 sm:col-span-2">*/}
                      {/*          <span className="flex-grow"></span>*/}
                      {/*          <span className="flex items-center ml-4 flex-shrink-0">*/}
                      {/*            <Switch*/}
                      {/*              checked={theme.particlesEnabled}*/}
                      {/*              onChange={(checked) =>*/}
                      {/*                updateThemeParticles(checked)*/}
                      {/*              }*/}
                      {/*              disabled={theme.mode !== 'holo'}*/}
                      {/*              className={classNames(*/}
                      {/*                theme.particlesEnabled &&*/}
                      {/*                  theme.mode === 'holo'*/}
                      {/*                  ? 'bg-[var(--accent-primary)]'*/}
                      {/*                  : 'bg-[var(--bg-level-three)]',*/}
                      {/*                theme.mode !== 'holo'*/}
                      {/*                  ? 'opacity-40 cursor-not-allowed'*/}
                      {/*                  : '',*/}
                      {/*                'relative inline-flex mr-3 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'*/}
                      {/*              )}*/}
                      {/*            >*/}
                      {/*              <span*/}
                      {/*                className={classNames(*/}
                      {/*                  theme.particlesEnabled &&*/}
                      {/*                    theme.mode === 'holo'*/}
                      {/*                    ? 'translate-x-5'*/}
                      {/*                    : 'translate-x-0',*/}
                      {/*                  'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transform ring-0 transition ease-in-out duration-200'*/}
                      {/*                )}*/}
                      {/*              />*/}
                      {/*            </Switch>*/}
                      {/*          </span>*/}
                      {/*        </dd>*/}
                      {/*      </div>*/}
                      {/*    </dl>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
