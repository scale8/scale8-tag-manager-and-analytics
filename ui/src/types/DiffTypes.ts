export type FieldDiff = {
    field: string;
    left: string[];
    right: string[];
    rightIsArray: boolean;
    leftIsArray: boolean;
    isRef: boolean;
    hasChanges?: boolean;
};

export type DiffFields = {
    fields: FieldDiff[];
    hasChanges?: boolean;
};

export type DiffMap = Map<string, DiffFields>;

export type RevisionDiffElement = {
    __typename: 'RevisionDiff';
    id: string;
    model: string;
    left: string | null;
    right: string | null;
    state: string | null;
    props: RevisionDiffProp[];
};

export type RevisionDiffProp = {
    __typename: 'RevisionDiffProp';
    field: string;
    gqlField: string;
    state: string;
    ref: boolean;
    left: RevisionDiffSide;
    right: RevisionDiffSide;
};

export type RevisionDiffSide = {
    __typename: string;
    s?: string;
    i?: number;
    f?: number;
    b?: boolean;
    d?: S8DateTime;
    sa?: string[];
    ia?: number[];
    fa?: number[];
    ba?: boolean[];
    da?: S8DateTime[];
    ea?: boolean | null;
} | null;
