import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../src/theme';
import { FC } from 'react';
import { useMockFormProps } from '../../../componentsMocks/useMockFormProps';
import TagForm from '../../../../src/components/organisms/Forms/TagForm';
import { TagValues } from '../../../../src/dialogPages/tagManager/app/tag/TagCreate';
import { TagType } from '../../../../src/gql/generated/globalTypes';

const MockForm: FC = () => {
    const formProps = useMockFormProps<TagValues>({
        name: '',
        type: TagType.HEAD,
        comments: '',
        width: null,
        height: null,
        autoLoad: false,
    });

    return <TagForm existingType={null} {...formProps} />;
};

describe('TagForm', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('form render unchanged', () => {
        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <MockForm />
            </ThemeProvider>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
