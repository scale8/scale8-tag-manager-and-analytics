import { FC, Fragment, UIEvent, useLayoutEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import BreadcrumbButton from '../molecules/BreadcrumbButton';
import { BreadcrumbButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import BreadcrumbActions from '../molecules/BreadcrumbActions';
import { ValuesRefreshFunction } from '../../types/GqlTypes';
import { RowAction } from '../molecules/S8Table/S8TableTypes';
import { useLoggedInState } from '../../context/AppContext';
import { useParams } from '../../hooks/useParams';
import Link from '../atoms/Next/Link';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { toOrg } from '../../utils/NavigationPaths';
import { getSectionDetails, ProductSectionKey } from '../../containers/SectionsDetails';
import { OrgUserState } from '../../context/OrgUserReducer';

type BreadcrumbProps = {
    buttonsProps: BreadcrumbButtonProps[];
    entityName: string;
    valuesRefresh: ValuesRefreshFunction;
    breadcrumbActions: RowAction<any>[];
    accountExpireIn?: number;
    accountExpired?: boolean;
    accountIsTrial?: boolean;
};

const Breadcrumb: FC<BreadcrumbProps> = (props: BreadcrumbProps) => {
    const params = useParams();
    const { orgUserState, templateInteractions } = useLoggedInState();
    const { section } = templateInteractions;
    const sectionDetails = getSectionDetails(section);

    const [scroller, setScroller] = useState<'left' | 'right' | 'none'>('none');

    const scrollerSetter = (div: HTMLDivElement) => {
        const hasScroll = div.scrollWidth > div.clientWidth;
        if (hasScroll) {
            if (div.scrollWidth + div.scrollLeft < div.clientWidth + 5) {
                setScroller('right');
            } else if (div.scrollLeft > -2) {
                setScroller('left');
            } else {
                setScroller('none');
            }
        } else {
            setScroller('none');
        }
    };

    const breadcrumbScroll = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const updateSize = () => {
            if (breadcrumbScroll.current !== null) {
                scrollerSetter(breadcrumbScroll.current);
            } else {
                setScroller('none');
            }
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [breadcrumbScroll.current]);

    const { buttonsProps, accountExpireIn, accountExpired, accountIsTrial } = props;

    if (params === null) return <></>;

    const { id: currentElementId } = params;

    const buildSettingsLink = (orgUserState: OrgUserState) => {
        if (sectionDetails.productSectionKey === ProductSectionKey.tagManager) {
            return toOrg({ id: orgUserState.orgId, plan: 'tag' }, 'settings');
        }

        if (sectionDetails.productSectionKey === ProductSectionKey.dataManager) {
            return toOrg({ id: orgUserState.orgId, plan: 'data' }, 'settings');
        }
        return toOrg({ id: orgUserState.orgId }, 'settings');
    };

    return (
        <>
            {orgUserState !== null && accountIsTrial && (
                <Box display="flex" justifyContent="center">
                    <Box
                        color="#ffffff"
                        bgcolor="#00000060"
                        px={2}
                        py={0.25}
                        borderRadius="0px 0px 10px 10px"
                    >
                        You have <b>{accountExpireIn}</b> day{accountExpireIn === 1 ? '' : 's'} left
                        in your free trial. You can upgrade to a paid plan in{' '}
                        <Link
                            href={buildSettingsLink(orgUserState)}
                            sx={{ color: '#ffffff', textDecorationColor: '#ffffff' }}
                        >
                            organization settings
                        </Link>
                        .
                    </Box>
                </Box>
            )}
            {orgUserState !== null && accountExpired && (
                <Box display="flex" justifyContent="center">
                    <Box
                        color="#53272e"
                        bgcolor="#faeff1"
                        px={2}
                        py={0.25}
                        borderRadius="0px 0px 10px 10px"
                    >
                        Your free trial is expired. You must upgrade to a paid plan in{' '}
                        <Link
                            href={buildSettingsLink(orgUserState)}
                            sx={{ color: '#53272e', textDecorationColor: '#53272e' }}
                        >
                            organization settings
                        </Link>
                        .
                    </Box>
                </Box>
            )}
            <Box display="flex" overflow="hidden">
                <Box
                    sx={{
                        boxSizing: 'border-box',
                        height: '64px',
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {scroller === 'left' && (
                        <Box
                            zIndex={2}
                            position="absolute"
                            height="100%"
                            top={0}
                            left={0}
                            padding="30px 30px 0 15px"
                            onClick={() => {
                                if (breadcrumbScroll.current !== null) {
                                    breadcrumbScroll.current.scrollLeft =
                                        breadcrumbScroll.current.clientWidth -
                                        breadcrumbScroll.current.scrollWidth;
                                }
                            }}
                            sx={{
                                cursor: 'pointer',
                                backgroundImage:
                                    'linear-gradient(to left, transparent, white 40%, white)',
                            }}
                        >
                            <ArrowBackIosIcon />
                        </Box>
                    )}
                    <Box
                        zIndex={1}
                        ref={breadcrumbScroll}
                        onScroll={(e: UIEvent<HTMLDivElement>) => {
                            scrollerSetter(e.target as HTMLDivElement);
                        }}
                        position="absolute"
                        width="100%"
                        sx={{
                            '& .breadcrumb': {
                                padding: (theme) => theme.spacing(3.5, 2, 0, 2),
                            },
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'row-reverse',
                        }}
                        flex={1}
                    >
                        <Box
                            display="flex"
                            flex={1}
                            className="breadcrumb"
                            sx={{ color: (theme) => theme.palette.primary.main }}
                            fontSize="1.5rem"
                            flexWrap="nowrap"
                            whiteSpace="nowrap"
                        >
                            <Box flexGrow={1}>
                                {buttonsProps.map((buttonProps, key) => (
                                    <Fragment key={key}>
                                        <BreadcrumbButton {...buttonProps} />
                                        {key + 1 < buttonsProps.length && <>&nbsp;/&nbsp;</>}
                                    </Fragment>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                    {scroller === 'right' && (
                        <Box
                            zIndex={2}
                            position="absolute"
                            height="100%"
                            top={0}
                            right={0}
                            padding="30px 15px 0 30px"
                            sx={{
                                cursor: 'pointer',
                                backgroundImage:
                                    'linear-gradient(to right, transparent, white 40%, white)',
                            }}
                            onClick={() => {
                                if (breadcrumbScroll.current !== null) {
                                    breadcrumbScroll.current.scrollLeft = 0;
                                }
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </Box>
                    )}
                </Box>
                {props.breadcrumbActions.length > 0 && (
                    <Box
                        marginTop="20px"
                        display="flex"
                        flex={1}
                        sx={{
                            marginLeft: (theme) => theme.spacing(1),
                            marginRight: (theme) => theme.spacing(1),
                            color: (theme) => theme.palette.primary.main,
                        }}
                        fontSize="1.5rem"
                        flexWrap="nowrap"
                        whiteSpace="nowrap"
                    >
                        <BreadcrumbActions
                            row={{ id: currentElementId ?? '' }}
                            rowActions={props.breadcrumbActions}
                        />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Breadcrumb;
