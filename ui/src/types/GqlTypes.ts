import { MutationFunctionOptions, MutationResult } from '@apollo/client/react/types/types';
import { FetchResult } from '@apollo/client/link/core/types';

export type MutationValues = [
    (options?: MutationFunctionOptions) => Promise<FetchResult>,
    MutationResult,
];

export type ValuesRefreshFunction = (mustResetCache: boolean) => void;
