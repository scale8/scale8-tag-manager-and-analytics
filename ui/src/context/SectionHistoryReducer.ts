export type SectionLocator = {
    section: symbol;
    page?: string;
};

export type SectionHistory = {
    current?: SectionLocator;
    previous?: SectionLocator;
};

export type SectionHistoryAction = {
    type: 'section' | 'page';
    payload: symbol | string;
};

export const sectionHistoryReducer = (
    state: SectionHistory,
    action: SectionHistoryAction,
): SectionHistory => {
    switch (action.type) {
        case 'page':
            if (state.current !== undefined) {
                return {
                    current: {
                        section: state.current.section,
                        page: action.payload as string,
                    },
                    previous: state.previous,
                };
            }
            return state;
        case 'section':
            if (state.current === undefined) {
                return {
                    current: { section: action.payload as symbol },
                    previous: state.previous,
                };
            }
            if (state.current.section !== action.payload) {
                return {
                    current: { section: action.payload as symbol },
                    previous: state.current,
                };
            }
            return state;
        default:
            throw new Error('Reducer Error');
    }
};
