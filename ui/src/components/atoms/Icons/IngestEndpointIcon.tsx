import { FC } from 'react';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { SvgIconProps } from '@mui/material';

const IngestEndpointIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TrackChangesIcon {...props} />
        </>
    );
};

export default IngestEndpointIcon;
