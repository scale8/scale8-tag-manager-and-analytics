import { FC } from 'react';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import { SvgIconProps } from '@material-ui/core';

const IngestEndpointIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <TrackChangesIcon {...props} />
        </>
    );
};

export default IngestEndpointIcon;
