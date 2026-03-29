import TitleBarClose from './iconsLogo/close';
import TitleBarMaximize from './iconsLogo/maximize';
import TitleBarMinimize from './iconsLogo/minimize';

export default function TitleBarWindows() {
  async function sendAction(whichOption) {
    window.electron.ipcRenderer.handleWindowsActions(whichOption);
  }
  return (
    <>
      {/* Page title & actions */}
      <div className="border-b border-[var(--border-default)] bg-[var(--bg-level-two)] lg:fixed flex justify-end text-[var(--text-primary)] titleBarCustom absolute w-full z-10">
        <div className="text-[var(--text-primary)]">
          <button
            type="button"
            className="inline-flex items-center h-7 w-12 px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-[var(--text-primary)] hover:bg-[var(--bg-level-three)] titleButtons"
            onClick={() => sendAction('min')}
          >
            <TitleBarMinimize />
          </button>
        </div>
        <div className="text-[var(--text-primary)]">
          <button
            type="button"
            className="inline-flex items-center h-7 w-12 px-2.5 py-1.5 border border-transparent text-xs font-medium shadow-sm text-[var(--text-primary)] hover:bg-[var(--bg-level-three)] titleButtons"
            onClick={() => sendAction('max')}
          >
            <TitleBarMaximize />
          </button>
        </div>
        <div className="text-[var(--text-primary)]">
          <button
            type="button"
            className="inline-flex items-center h-7 w-12 px-2.5 py-1.5 pb-1 border border-transparent text-xs font-medium shadow-sm text-[var(--text-primary)] hover:bg-[var(--error)] hover:text-[var(--text-primary)] titleButtons"
            onClick={() => sendAction('close')}
          >
            <TitleBarClose />
          </button>
        </div>
      </div>
    </>
  );
}
