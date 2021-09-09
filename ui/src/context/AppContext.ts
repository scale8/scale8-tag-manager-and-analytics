import { Context, createContext, useContext } from 'react';
import { loggedInInitialState, LoggedInState } from './LoggedInState';
import { configInitialState, ConfigState } from './ConfigState';

export type SharedState = {
    loggedInState?: LoggedInState;
    configState?: ConfigState;
    setState: (newState: { loggedInState?: LoggedInState; configState?: ConfigState }) => void;
};

export const appContext: Context<SharedState> = createContext<SharedState>({
    loggedInState: undefined,
    configState: undefined,
    setState: (): void => {
        // Idle
    },
});

export const useAppContext = (): SharedState => {
    return useContext<SharedState>(appContext);
};

export const useLoggedInState = (): LoggedInState => {
    const state = useContext<SharedState>(appContext).loggedInState;
    if (state === undefined) return loggedInInitialState;
    return state;
};

export const useConfigState = (): ConfigState => {
    const state = useContext<SharedState>(appContext).configState;
    if (state === undefined) return configInitialState;
    return state;
};
