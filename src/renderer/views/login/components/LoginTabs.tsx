import { LockClosedIcon, QrcodeIcon, WifiIcon } from '@heroicons/react/solid';
import { LoginMethod } from '../types/LoginMethod';
import { classNames } from '../../../components/content/shared/filters/inventoryFunctions';

interface TabProps {
  name: string;
  icon: any;
  key: LoginMethod;
}

const tabs: TabProps[] = [
  { name: '二维码', icon: QrcodeIcon, key: 'QR' },
  { name: '网页令牌', icon: WifiIcon, key: 'WEBTOKEN' },
  { name: '常规登录', icon: LockClosedIcon, key: 'REGULAR' },
];

type LoginTabsProps = {
  selectedTab: LoginMethod;
  setSelectedTab: (tab: LoginMethod) => void;
};

export default function LoginTabs({
  selectedTab,
  setSelectedTab,
}: LoginTabsProps) {
  const defaultValue: LoginMethod = 'REGULAR';
  return (
    <div className="px-0 pt-6">
      <div className="mx-auto max-w-7xl">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            选择登录方式
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-level-two)] py-2 pl-3 pr-10 text-base text-[var(--text-primary)] shadow-sm ring-0 focus:border-[var(--text-tertiary)] focus:ring-0 sm:text-sm"
            defaultValue={tabs.find((tab) => tab.key === defaultValue)?.name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex place-content-center">
            <ul
              role="list"
              className="inline-flex gap-x-2 rounded-md bg-transparent p-1 text-sm font-semibold leading-6 text-[var(--text-tertiary)]"
            >
              {tabs.map((tab) => (
                <li key={tab.name}>
                  <button
                    onClick={() => setSelectedTab(tab.key)}
                    className={classNames(
                      tab.key === selectedTab
                        ? 'bg-[#2f2f2f] text-[#ece8df]'
                        : 'text-[#8f95a3] hover:bg-[#1c1c1c]',
                      'flex h-full place-content-center items-center rounded-md px-4 py-2'
                    )}
                  >
                    <tab.icon
                      className={classNames(
                        tab.key === selectedTab
                          ? 'text-[#ece8df]'
                          : 'text-[#8f95a3]',
                        'h-5 w-5 pr-1'
                      )}
                    />
                    <span
                      className={
                        tab.key === selectedTab
                          ? 'text-[#ece8df]'
                          : 'text-[#8f95a3]'
                      }
                    >
                      {tab.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
