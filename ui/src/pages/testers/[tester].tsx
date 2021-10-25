import { FC } from 'react';
import { useRouter } from 'next/router';
import Navigate from '../../components/atoms/Next/Navigate';
import ActionFormTester from '../../testers/action-form-tester';
import ConditionFormTester from '../../testers/condition-form-tester';
import DiffTester from '../../testers/diff-tester';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getNodeEnv } from '../../utils/ConfigUtils';
import ErrorHighlightTester from '../../testers/error-highlight-tester';
import UsageTester from '../../testers/usage-tester';
import DatetimeTester from '../../testers/datetime-tester';

export const getStaticPaths: GetStaticPaths = async () => {
    if (getNodeEnv() === 'development') {
        return {
            paths: [
                { params: { tester: 'action-form-tester' } },
                { params: { tester: 'condition-form-tester' } },
                { params: { tester: 'diff-tester' } },
                { params: { tester: 'error-highlight-tester' } },
                { params: { tester: 'usage-tester' } },
                { params: { tester: 'datetime-tester' } },
            ],
            fallback: false,
        };
    }

    return { paths: [], fallback: false };
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
    };
};

const Tester: FC = () => {
    const router = useRouter();
    const { tester } = router.query;

    switch (tester) {
        case 'action-form-tester':
            return <ActionFormTester />;
        case 'condition-form-tester':
            return <ConditionFormTester />;
        case 'diff-tester':
            return <DiffTester />;
        case 'error-highlight-tester':
            return <ErrorHighlightTester />;
        case 'usage-tester':
            return <UsageTester />;
        case 'datetime-tester':
            return <DatetimeTester />;
        default:
            return <Navigate to="/404" />;
    }
};

export default Tester;
