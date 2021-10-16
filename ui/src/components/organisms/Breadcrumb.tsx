import { FC, Fragment } from 'react';
import { Box } from '@mui/material';
import BreadcrumbButton from '../molecules/BreadcrumbButton';
import { BreadcrumbButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import BreadcrumbActions from '../molecules/BreadcrumbActions';
import { ValuesRefreshFunction } from '../../types/GqlTypes';
import { RowAction } from '../molecules/S8Table/S8TableTypes';
import { useLoggedInState } from '../../context/AppContext';
import { useParams } from '../../hooks/useParams';
import Link from '../atoms/Next/Link';

type BreadcrumbProps = {
    buttonsProps: BreadcrumbButtonProps[];
    entityName: string;
    valuesRefresh: ValuesRefreshFunction;
    breadcrumbActions: RowAction<any>[];
    accountExpireIn?: number;
    accountIsTrial?: boolean;
};

const Breadcrumb: FC<BreadcrumbProps> = (props: BreadcrumbProps) => {
    const { id: currentElementId } = useParams();
    const { orgUserState } = useLoggedInState();

    const { buttonsProps, accountExpireIn, accountIsTrial } = props;

    return (
        <Box display="flex" flexDirection="column">
            {orgUserState !== null && accountIsTrial && (
                <Box display="flex" justifyContent="center">
                    <Box
                        color="#ffffff"
                        bgcolor="#00000030"
                        px={2}
                        py={0.25}
                        borderRadius="0px 0px 10px 10px"
                    >
                        You have <b>{accountExpireIn}</b> days left in your free trial. You can
                        upgrade to a paid plan in{' '}
                        <Link
                            href={
                                ''
                                //toOrg(orgUserState.orgId, MainPages.OrgSettingsPage)
                            }
                            style={{ color: '#ffffff' }}
                        >
                            organization settings
                        </Link>
                        .
                    </Box>
                </Box>
            )}
            <Box
                display="flex"
                flexShrink={0}
                className="breadcrumb"
                color="white"
                fontSize="1.5rem"
                flexWrap="nowrap"
                whiteSpace="nowrap"
                overflow="auto"
            >
                <Box flexGrow={1}>
                    {buttonsProps.map((buttonProps, key) => (
                        <Fragment key={key}>
                            <BreadcrumbButton {...buttonProps} />
                            {key + 1 < buttonsProps.length && <>&nbsp;/&nbsp;</>}
                        </Fragment>
                    ))}
                </Box>
                <Box marginTop="-12px" color="white">
                    <BreadcrumbActions
                        row={{ id: currentElementId ?? '' }}
                        rowActions={props.breadcrumbActions}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Breadcrumb;
