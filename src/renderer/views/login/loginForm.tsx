import {
  ClipboardCheckIcon,
  // ClipboardCopyIcon,
  ExternalLinkIcon,
  LockClosedIcon,
} from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from 'renderer/components/content/shared/animations';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import NotificationElement from 'renderer/components/content/shared/modals & notifcations/notification';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import {
  HandleLoginObjectClass,
  LoginCommand,
  LoginCommandReturnPackage,
  LoginNotificationObject,
  LoginOptions,
} from 'shared/Interfaces.tsx/store';
import { handleSuccess } from './HandleSuccess';
import SteamCloseModal from './closeSteamModal';
import LoginTabs from './components/LoginTabs';
import ConfirmModal from './confirmLoginModal';
import { LoginMethod } from './types/LoginMethod';
const loginResponseObject: LoginNotificationObject = {
  loggedIn: {
    success: true,
    title: '登录成功！',
    text: '应用已成功登录，祝您使用愉快。',
  },
  missingRequiredField: {
    success: false,
    title: '缺少必填项',
    text: '请输入必填内容后再继续。',
  },
  steamGuardError: {
    success: false,
    title: 'Steam 令牌错误！',
    text: '可能需要 Steam 令牌验证，请重试。',
  },
  steamGuardCodeIncorrect: {
    success: false,
    title: 'Steam 令牌代码错误',
    text: '令牌代码不正确，请重试。',
  },
  defaultError: {
    success: false,
    title: '未知错误',
    text: '可能是凭据错误、网络问题、账号正在其他地方游戏或其他原因。',
  },
  playingElsewhere: {
    success: false,
    title: '账号在其他地方运行',
    text: '已登录成功，但该账号当前正在其他地方游戏中。',
  },
  wrongLoginToken: {
    success: false,
    title: '登录令牌错误',
    text: '登录令牌不正确。',
  },
  webtokenNotJSON: {
    success: false,
    title: '不是有效的 JSON 字符串',
    text: '请确认已复制完整字符串，然后重试。',
  },
  webtokenNotLoggedIn: {
    success: false,
    title: '未登录',
    text: '请先在浏览器中登录，然后重试。',
  },
};

export default function LoginForm({ isLock, replaceLock, runDeleteUser }) {
  // Usestate
  isLock;
  replaceLock;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [open, setOpen] = useState(false);
  const [sharedSecret, setSharedSecret] = useState('');
  const [clientjstoken, setClientjstoken] = useState('');
  const [doShow, setDoShow] = useState(false);
  const [wasSuccess, setWasSuccess] = useState(false);
  const [titleToDisplay, setTitleToDisplay] = useState('test');
  const [textToDisplay, setTextToDisplay] = useState('test');
  const [storeRefreshToken, setStoreRefreshToken] = useState(false);
  const [getLoadingButton, setLoadingButton] = useState(false);
  const [secretEnabled, setSecretEnabled] = useState(false);

  const ReducerClass = new ReducerManager(useSelector);
  const currentState: State = ReducerClass.getStorage();
  // Handle login
  const dispatch = useDispatch();

  async function openNotification(keyValue: keyof LoginOptions) {
    setWasSuccess(loginResponseObject?.[keyValue]?.success);
    setTitleToDisplay(loginResponseObject?.[keyValue]?.title);
    setTextToDisplay(loginResponseObject?.[keyValue]?.text);
    setDoShow(true);
  }

  async function openValidationNotification(text: string) {
    setWasSuccess(loginResponseObject.missingRequiredField.success);
    setTitleToDisplay(loginResponseObject.missingRequiredField.title);
    setTextToDisplay(text);
    setDoShow(true);
  }

  class HandleLogin {
    command: keyof LoginOptions;
    relevantFunction: Function;
    handleObject: HandleLoginObjectClass = {
      missingRequiredField: this.handleMissingRequiredField,
      webtokenNotLoggedIn: this.handleWebTokenNotLoggedIn,
      webtokenNotJSON: this.handlewebtokenNotJson,
      wrongLoginToken: this.handleWrongLoginToken,
      steamGuardError: this.handleSteamGuardError,
      defaultError: this.handleUnknownError,
      steamGuardCodeIncorrect: this.handleWrongSteamGuard,
      playingElsewhere: this.handlePlayingElsewhere,
      loggedIn: this.handleSuccesLogin,
    };
    constructor(command: keyof LoginOptions) {
      this.command = command;
      this.relevantFunction = this.handleObject[this.command];
    }

    async handlewebtokenNotJson() {
      openNotification(this.command);
      setLoadingButton(false);
      setClientjstoken('');
    }

    async handleMissingRequiredField() {
      setLoadingButton(false);
    }

    async handleWebTokenNotLoggedIn() {
      openNotification(this.command);
      setLoadingButton(false);
      setClientjstoken('');
    }

    async handleSteamGuardError() {
      openNotification(this.command);
    }
    async handleUnknownError() {
      openNotification(this.command);
      setUsername('');
      setPassword('');
    }

    async handleWrongLoginToken() {
      replaceLock();
      if (isLock) {
        runDeleteUser(isLock);
      } else {
        runDeleteUser(username);
      }
    }

    async handlePlayingElsewhere() {
      setOpen(true);
      openNotification(this.command);
    }

    async handleWrongSteamGuard() {
      openNotification(this.command);
    }

    async handleSuccesLogin() {
      openNotification(this.command);
      window.electron.ipcRenderer.refreshInventory();
    }
  }

  async function handleError() {
    setAuthCode('');
    setLoadingButton(false);
  }
  async function validateWebToken() {
    let clientjstokenToSend = clientjstoken as any;
    // Validate web token
    if (loginMethod == 'WEBTOKEN') {
      // Is json string?
      try {
        clientjstokenToSend = JSON.parse(clientjstoken);
      } catch {
        openNotification('webtokenNotJSON');
        setLoadingButton(false);
        setClientjstoken('');
        return null;
      }

      // Is logged in?
      if (!clientjstokenToSend.logged_in) {
        openNotification('webtokenNotLoggedIn');
        setLoadingButton(false);
        setClientjstoken('');
        return null;
      }
    } else {
      clientjstokenToSend = '';
    }
    return clientjstokenToSend;
  }

  let hasChosenAccountLoginKey = false;
  if (isLock.length == 2 && isLock[1] != undefined) {
    hasChosenAccountLoginKey = true;
  }
  hasChosenAccountLoginKey;
  isLock = isLock[0];
  const [closeSteamOpen, setCloseSteamOpen] = useState(false);
  const [hasAskedCloseSteam, setHasAskedCloseSteam] = useState(false);
  setLoadingButton;

  function validateBeforeSubmit() {
    if (loginMethod === 'QR') {
      return false;
    }

    if (loginMethod === 'WEBTOKEN') {
      if (clientjstoken.trim() === '') {
        openValidationNotification('请输入网页登录信息');
        return false;
      }

      return true;
    }

    const usernameValue = isLock != '' ? isLock : username;
    const requiresPassword = !hasChosenAccountLoginKey;

    if (usernameValue.trim() === '') {
      openValidationNotification('请输入用户名');
      return false;
    }

    if (requiresPassword && password.trim() === '') {
      openValidationNotification('请输入密码');
      return false;
    }

    return true;
  }

  async function submitLogin() {
    if (!validateBeforeSubmit()) {
      return;
    }

    setLoadingButton(true);

    if (!hasAskedCloseSteam && currentState.settingsReducer.steamLoginShow) {
      setHasAskedCloseSteam(true);
      const steamRunning = await window.electron.ipcRenderer.checkSteam();
      console.log('steam running', steamRunning);
      if (steamRunning) {
        setCloseSteamOpen(true);
        return;
      }
    }
    const clientjstokenToSend = await validateWebToken();

    if (loginMethod === 'WEBTOKEN' && clientjstokenToSend === null) {
      return;
    }

    let usernameToSend = username as any;
    let passwordToSend = password as any;
    let storePasswordToSend = storeRefreshToken as any;
    if (isLock != '') {
      usernameToSend = isLock;
      passwordToSend = null;
      storePasswordToSend = true;
    }
    const responseStatus: LoginCommand =
      await window.electron.ipcRenderer.loginUser(
        usernameToSend,
        passwordToSend,
        clientjstokenToSend != '' ? false : storePasswordToSend,
        authCode,
        sharedSecret,
        clientjstokenToSend
      );

    // Notification and react
    const HandleClass = new HandleLogin(responseStatus.responseStatus);
    HandleClass.relevantFunction();
    if (responseStatus.responseStatus == 'loggedIn') {
      handleSuccess(
        responseStatus.returnPackage as LoginCommandReturnPackage,
        dispatch,
        currentState
      );
    } else {
      handleError();
    }
  }
  async function updateUsername(value) {
    setUsername(value);
    if (isLock != '') {
      replaceLock();
    }
  }
  async function updatePassword(value) {
    setPassword(value);
    if (isLock != '') {
      replaceLock();
    }
  }

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('REGULAR');
  const [qrURL, setQrURL] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (loginMethod !== 'QR') {
      submitLogin();
    }
  }

  /* useEffect(() => {
    if (!closeSteamOpen) {
      setCloseSteamOpen(window.electron.ipcRenderer.checkSteam())
    }
  }, [closeSteamOpen]); */
  // setOpen(true)
  setQrURL;
  qrURL;

  useEffect(() => {
    if (loginMethod !== 'QR') {
      return;
    }

    window.electron.ipcRenderer.once('qrLogin:show', (pack) => {
      setQrURL(pack);
    });

    window.electron.ipcRenderer
      .startQRLogin(storeRefreshToken)
      .then((responseStatus) => {
        // Notification and react
        console.log('response status', responseStatus);
        const HandleClass = new HandleLogin(responseStatus.responseStatus);
        HandleClass.relevantFunction();
        if (responseStatus.responseStatus == 'loggedIn') {
          handleSuccess(
            responseStatus.returnPackage as LoginCommandReturnPackage,
            dispatch,
            currentState
          );
        } else {
          handleError();
        }
      });

    return () => {
      window.electron.ipcRenderer.cancelQRLogin();
    };
  }, [loginMethod, storeRefreshToken]);

  return (
    <>
      <SteamCloseModal
        open={closeSteamOpen}
        setOpen={setCloseSteamOpen}
        loginWithouClosingSteam={() => submitLogin()}
        setLoadingButton={setLoadingButton}
      />
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        setLoadingButton={setLoadingButton}
      />
      <div className="flex w-full items-center justify-center px-2 py-8">
        <div className="foil-border noise-texture relative w-full max-w-[420px] rounded-[16px] p-10 shadow-login-card">
          {/* Logo mark + title */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#FFD700] via-[#A855F7] to-[#38BDF8] shadow-foil">
              <span className="text-[22px] font-black text-black select-none">
                C
              </span>
            </div>
            <h2 className="text-[22px] font-bold text-[var(--text-primary)]">
              {loginMethod === 'REGULAR'
                ? '登录 Steam'
                : loginMethod === 'QR'
                ? '扫描二维码'
                : '通过浏览器登录'}
            </h2>
            <p className="mt-1 text-center text-sm text-[var(--text-secondary)]">
              {loginMethod === 'REGULAR'
                ? '管理你的 CS2 库存与储存组件'
                : loginMethod === 'QR'
                ? '使用 Steam 手机应用扫描二维码登录'
                : '通过浏览器 WebToken 登录 Steam 账号'}
            </p>
            <div className="mt-5 w-full">
              <LoginTabs
                selectedTab={loginMethod}
                setSelectedTab={setLoginMethod}
              />
            </div>
          </div>

          <form
            className="flex flex-col gap-[14px]"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            {loginMethod === 'REGULAR' ? (
              <div className="flex flex-col gap-[14px]">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-[6px] block text-[12px] font-medium text-[var(--text-secondary)]"
                  >
                    用户名
                  </label>
                  <input
                    id="username"
                    name="username"
                    onChange={(e) => updateUsername(e.target.value)}
                    spellCheck={false}
                    required
                    value={isLock == '' ? username : isLock}
                    className="foil-input"
                    placeholder="Steam 用户名..."
                  />
                </div>
                {!hasChosenAccountLoginKey ? (
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-[6px] block text-[12px] font-medium text-[var(--text-secondary)]"
                    >
                      密码
                    </label>
                    <input
                      id="password"
                      spellCheck={false}
                      name="password"
                      type="password"
                      onChange={(e) => updatePassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      value={isLock == '' ? password : '~{nA?HJjb]7hB7-'}
                      className="foil-input"
                      placeholder="Steam 密码..."
                    />
                  </div>
                ) : null}
                {!hasChosenAccountLoginKey ? (
                  <div>
                    <label
                      htmlFor="authcode"
                      className="mb-[6px] block text-[12px] font-medium text-[var(--text-secondary)]"
                    >
                      Steam 令牌码{' '}
                      <span className="text-[var(--text-tertiary)]">
                        （可选）
                      </span>
                    </label>
                    <input
                      id="authcode"
                      name="authcode"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      spellCheck={false}
                      className="foil-input"
                      placeholder="令牌码..."
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-level-two)] px-3 py-2.5">
                    <LockClosedIcon className="h-4 w-4 flex-shrink-0 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-tertiary)]">
                      无需输入密码和 Steam 令牌代码
                    </span>
                  </div>
                )}
                {!hasChosenAccountLoginKey && secretEnabled ? (
                  <div>
                    <label
                      htmlFor="secret"
                      className="mb-[6px] block text-[12px] font-medium text-[var(--text-secondary)]"
                    >
                      共享密钥 SharedSecret
                    </label>
                    <input
                      id="secret"
                      name="secret"
                      value={sharedSecret}
                      onChange={(e) => setSharedSecret(e.target.value)}
                      spellCheck={false}
                      className="foil-input"
                      placeholder="SharedSecret（不知道是什么请留空）"
                    />
                  </div>
                ) : null}
              </div>
            ) : loginMethod === 'WEBTOKEN' ? (
              <div>
                <label className="mb-[6px] block text-[12px] font-medium text-[var(--text-secondary)]">
                  浏览器 WebToken 数据
                </label>
                <div className="flex rounded-lg overflow-hidden border border-[var(--border-default)]">
                  <div className="relative flex flex-grow items-stretch">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <ClipboardCheckIcon
                        className="h-5 w-5 text-[var(--text-tertiary)]"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      spellCheck={false}
                      type="text"
                      name="clientjs"
                      id="clientjs"
                      value={clientjstoken}
                      onChange={(e) => setClientjstoken(e.target.value)}
                      className="block w-full border-0 bg-[var(--bg-level-two)] pl-10 pr-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
                      placeholder="粘贴数据"
                    />
                  </div>
                  {/*<button*/}
                  {/*  onClick={() =>*/}
                  {/*    navigator.clipboard.writeText(*/}
                  {/*      `https://steamcommunity.com/chat/clientjstoken`*/}
                  {/*    )*/}
                  {/*  }*/}
                  {/*  type="button"*/}
                  {/*  className="border-l border-[var(--border-default)] bg-[var(--bg-level-three)] px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-level-four)] focus:outline-none transition-colors"*/}
                  {/*>*/}
                  {/*  <ClipboardCopyIcon className="h-4 w-4" aria-hidden="true" />*/}
                  {/*</button>*/}
                  <a
                    href="https://steamcommunity.com/chat/clientjstoken"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center border-l border-[var(--border-default)] bg-[var(--bg-level-three)] px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-level-four)] transition-colors"
                  >
                    <ExternalLinkIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center rounded-md bg-white p-4">
                  <QRCode size={235} value={qrURL} viewBox={`0 0 235 235`} />
                </div>
                <div className="flex pt-2 items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    defaultChecked={storeRefreshToken}
                    className="h-4 w-4 border-[var(--border-default)] rounded bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    onChange={() => setStoreRefreshToken(!storeRefreshToken)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block pl-1 text-sm text-[var(--text-secondary)]"
                  >
                    记住登录
                  </label>
                </div>
              </>
            )}
            {!hasChosenAccountLoginKey ? (
              <div
                className={classNames(
                  loginMethod === 'REGULAR' ? '' : 'hidden',
                  'flex items-center justify-between'
                )}
              >
                <div className="flex items-center">
                  {isLock == '' ? (
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      defaultChecked={storeRefreshToken}
                      className="h-4 w-4 rounded border-[var(--border-default)] bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                      onChange={() => setStoreRefreshToken(!storeRefreshToken)}
                    />
                  ) : !hasChosenAccountLoginKey ? (
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={true}
                      className="pointer-events-none h-4 w-4 rounded border-[var(--border-default)] bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] opacity-50"
                      onChange={() => setStoreRefreshToken(!storeRefreshToken)}
                    />
                  ) : (
                    ''
                  )}

                  {isLock == '' ? (
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-[var(--text-secondary)]"
                    >
                      记住登录
                    </label>
                  ) : !hasChosenAccountLoginKey ? (
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block pointer-events-none text-sm text-[var(--text-tertiary)]"
                    >
                      记住登录
                    </label>
                  ) : (
                    ''
                  )}
                </div>
                {!hasChosenAccountLoginKey ? (
                  <div className="flex items-center">
                    <label
                      htmlFor="sharedSecret"
                      className="mr-2 block text-sm text-[var(--text-secondary)]"
                    >
                      使用秘钥登录
                    </label>
                    <input
                      id="sharedSecret"
                      name="sharedSecret"
                      type="checkbox"
                      className="h-4 w-4 rounded border-[var(--border-default)] bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                      onChange={() => setSecretEnabled(!secretEnabled)}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
            {loginMethod !== 'QR' ? (
              <button
                className="foil-sweep group relative mt-1 flex w-full items-center justify-center gap-[6px] rounded-[8px] border-0 bg-gradient-to-r from-[#FFD700] via-[#A855F7] to-[#38BDF8] px-6 py-[11px] text-[13px] font-semibold text-black shadow-foil transition hover:brightness-[1.08] active:translate-y-px"
                onClick={() => submitLogin()}
                type="button"
              >
                {getLoadingButton ? (
                  <LoadingButton />
                ) : (
                  <LockClosedIcon
                    className="h-4 w-4 text-black/60"
                    aria-hidden="true"
                  />
                )}
                登录
              </button>
            ) : null}
          </form>
        </div>
      </div>
      <NotificationElement
        success={wasSuccess}
        titleToDisplay={titleToDisplay}
        textToDisplay={textToDisplay}
        doShow={doShow}
        setShow={() => {
          setDoShow(false);
        }}
      />
    </>
  );
}
