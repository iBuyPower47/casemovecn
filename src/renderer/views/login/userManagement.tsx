import { CheckIcon, TrashIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function UserGrid({
  clickOnProfile,
  deleteUser,
  runDeleteUser,
}) {
  const [getUsers, setUsers] = useState([] as any);

  // The brain
  async function updateFunction() {
    let finalList = [] as any;
    let seenValues = [] as any;

    // Get the account details
    let doUpdate = await window.electron.ipcRenderer.getAccountDetails();
    if (doUpdate == undefined) {
      doUpdate = {};
    }

    // Get the order of the account details
    let valueToUse = [] as any;
    await window.electron.store.get('accountKeyList').then((returnValue) => {
      valueToUse = returnValue;
    });

    // Conditional logic
    if (valueToUse != undefined) {
      valueToUse.forEach((element) => {
        if (seenValues.includes(element) == false) {
          seenValues.push(element);
        }
      });
      for (const [key, value] of Object.entries(doUpdate)) {
        let userObject = value as any;
        userObject['username'] = key;
        if (!seenValues.includes(userObject['username'])) {
          finalList.push(userObject);
        }
      }
      seenValues.reverse();
      seenValues.forEach((element) => {
        if (doUpdate[element] != undefined) {
          let userObject = doUpdate[element] as any;
          userObject['username'] = element;
          finalList.splice(0, 0, userObject);
        }
      });
    } else {
      for (const [key, value] of Object.entries(doUpdate)) {
        let userObject = value as any;
        userObject['username'] = key;
        finalList.push(userObject);
      }
    }
    // Apply the account details
    setUsers(finalList);
  }

  useEffect(() => {
    updateFunction();
  }, []);

  // Remove account
  async function removeUsername(username) {
    window.electron.ipcRenderer.deleteAccountDetails(username);
    updateFunction();
  }

  useEffect(() => {
    if (!deleteUser) {
      return;
    }

    updateFunction();
    runDeleteUser();
  }, [deleteUser, runDeleteUser]);

  // Drag n drop features
  async function handleOnDragEnd(result) {
    // Check if actually moved
    if (!result.destination) return;
    const items = Array.from(getUsers);

    // Store change locally and in the settings
    window.electron.ipcRenderer.setAccountPosition(
      result.draggableId,
      result.destination.index
    );
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUsers(items);

    // Storex for next session
    const orderToStore = [] as any;
    items.forEach((element) => {
      let e = element as any;
      orderToStore.push(e.username);
    });
    await window.electron.store.set('accountKeyList', orderToStore);
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="h-full grid grid-cols-1 gap-5 overflow-y-auto p-6 pb-12">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {getUsers.length == 0 ? (
                  <li
                    className={classNames(
                      'relative flex items-center space-x-3 rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-level-three)] px-6 py-5 text-[var(--text-primary)]'
                    )}
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="w-10 h-10 rounded-full flex-shrink-0 text-[var(--text-tertiary)]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        暂无账户
                      </p>
                      <p className="truncate text-sm text-[var(--text-tertiary)]">
                        登录以添加用户
                      </p>
                    </div>
                  </li>
                ) : (
                  getUsers.map((person, index) => (
                    <Draggable
                      key={person.username}
                      draggableId={person.username}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={classNames(
                            index == 0 ? '' : 'mt-5',
                            'relative flex items-center space-x-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-level-three)] px-6 py-5 text-[var(--text-primary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-level-four)]'
                          )}
                        >
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--bg-level-four)] flex items-center justify-center overflow-hidden">
                            {person.imageURL ? (
                              <img
                                className="h-full w-full rounded-full object-cover"
                                src={person.imageURL}
                                alt=""
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    'none';
                                  (
                                    e.target as HTMLImageElement
                                  ).parentElement!.setAttribute(
                                    'data-fallback',
                                    'true'
                                  );
                                }}
                              />
                            ) : null}
                            <span
                              className="text-xs font-medium text-[var(--text-secondary)] select-none"
                              style={{
                                display: person.imageURL ? 'none' : 'block',
                              }}
                            >
                              {(person.displayName || person.username || '?')
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="truncate text-sm font-medium text-[var(--text-primary)]"
                              title={person.displayName}
                            >
                              {person.displayName}
                            </p>
                            <p
                              className="truncate text-sm text-[var(--text-tertiary)]"
                              title={person.username}
                            >
                              {person.username}
                            </p>
                          </div>
                          <div className="ml-auto flex shrink-0 items-center">
                            <button
                              type="button"
                              onClick={() =>
                                clickOnProfile([
                                  person.username,
                                  person.refreshToken,
                                ])
                              }
                              className="inline-flex items-center rounded-full p-1.5 text-[var(--text-secondary)] transition duration-200 ease-in-out hover:bg-[var(--bg-level-four)] hover:text-[var(--warning)]"
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeUsername(person.username)}
                              className={classNames(
                                'inline-flex items-center rounded-full p-1.5 text-[var(--text-secondary)] transition duration-200 ease-in-out hover:bg-[var(--bg-level-four)] hover:text-[var(--error)]'
                              )}
                            >
                              <TrashIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
