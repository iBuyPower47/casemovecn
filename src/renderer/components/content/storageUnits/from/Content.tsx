import FromMainComponent from './fromHolder';
import { Card } from '../../../ui/primitives/Card';

function StorageUnits() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Page title & actions */}
      <Card
        level="two"
        className="shrink-0 border-b border-[var(--border-default)] rounded-none"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium text-[var(--text-primary)] leading-6 sm:truncate">
            从存储组件取出
          </h1>
        </div>
      </Card>
      <FromMainComponent />
    </div>
  );
}

export default function StorageUnitsComponent() {
  return <StorageUnits />;
}
