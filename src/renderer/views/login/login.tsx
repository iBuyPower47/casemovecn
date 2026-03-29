import { useState } from 'react';
import LoginForm from './loginForm';
import UserGrid from './userManagement';

function LoginPageContent() {
  const [getLock, setLock] = useState(['']);
  const [deleteUser, setdeleteUser] = useState('');

  return (
    <main className="h-screen overflow-hidden bg-[var(--bg-level-one)] text-[var(--text-primary)]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="relative flex min-h-0 items-center justify-center overflow-x-hidden overflow-y-auto bg-[var(--bg-level-one)] px-6 py-12 lg:px-10 lg:py-16">
          {/* Radial glow background */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(0,191,165,0.04) 40%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md">
            <LoginForm
              isLock={getLock}
              replaceLock={() => setLock([''])}
              runDeleteUser={(username) => setdeleteUser(username)}
            />
          </div>
        </section>

        <aside className="hidden border-l border-[var(--border-default)] bg-[var(--bg-level-one)] lg:flex lg:flex-col overflow-hidden">
          <UserGrid
            clickOnProfile={(username) => setLock(username)}
            runDeleteUser={() => setdeleteUser('')}
            deleteUser={deleteUser}
          />
        </aside>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
