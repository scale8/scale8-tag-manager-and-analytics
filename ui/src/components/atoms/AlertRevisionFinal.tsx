import { FC, MouseEventHandler } from 'react';
import { AlertWarning } from './AlertWarning';
import { Box } from '@mui/material';

export const AlertRevisionFinal: FC<{
    onCloneLinkClick?: MouseEventHandler<HTMLSpanElement>;
}> = ({ onCloneLinkClick }) => {
    return (
        <AlertWarning>
            This revision has been marked as final. No further changes are possible{' '}
            {onCloneLinkClick && (
                <>
                    Please{' '}
                    <Box
                        component="span"
                        sx={{
                            color: 'inherit',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                        onClick={onCloneLinkClick}
                    >
                        <b>clone</b>
                    </Box>{' '}
                    the revision to continue working on it.
                </>
            )}
        </AlertWarning>
    );
};
