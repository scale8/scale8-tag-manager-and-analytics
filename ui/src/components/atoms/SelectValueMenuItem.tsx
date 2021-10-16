import { FC } from 'react';
import { Box } from '@mui/material';
import { SelectValueWithSub } from '../../hooks/form/useFormValidation';

type SelectValueMenuItemProps = {
    selectValue: SelectValueWithSub;
};

const SelectValueMenuItem: FC<SelectValueMenuItemProps> = (props: SelectValueMenuItemProps) => {
    const { selectValue } = props;

    return (
        <>
            {selectValue.icon !== undefined ? (
                <Box display="flex" alignItems="center">
                    <>{selectValue.icon}</>
                    <Box component="span" marginLeft="5px">
                        {selectValue.text}
                    </Box>
                </Box>
            ) : (
                selectValue.text
            )}
        </>
    );
};

export default SelectValueMenuItem;
