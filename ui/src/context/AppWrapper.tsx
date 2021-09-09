import { FC, useState } from 'react';
import { appContext } from './AppContext';
import { LoggedInState } from './LoggedInState';
import { ChildrenOnlyProps } from '../types/props/ChildrenOnlyProps';
import { ConfigState } from './ConfigState';

const AppWrapper: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const [loggedInState, setLoggedInState] = useState<LoggedInState | undefined>(undefined);
    const [configState, setConfigState] = useState<ConfigState | undefined>(undefined);

    const setState = (newState: { loggedInState?: LoggedInState; configState?: ConfigState }) => {
        if (newState.loggedInState !== undefined) {
            setLoggedInState(newState.loggedInState);
        }
        if (newState.configState !== undefined) {
            setConfigState(newState.configState);
        }
    };

    return (
        <appContext.Provider
            value={{
                loggedInState,
                configState,
                setState,
            }}
        >
            {props.children}
        </appContext.Provider>
    );
};

export default AppWrapper;
