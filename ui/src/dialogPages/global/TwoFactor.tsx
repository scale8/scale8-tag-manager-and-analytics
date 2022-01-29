import { useState } from 'react';
import { FC } from 'react';
import { useQuery } from '@apollo/client';
import TwoFactorForm from '../../components/organisms/Forms/TwoFactorForm';
import { LoggedUser } from '../../gql/generated/LoggedUser';
import LoggedUserQuery from '../../gql/queries/LoggedUserQuery';
import { TwoFactorEnable } from './TwoFactorEnable';
import { TwoFactorDisable } from './TwoFactorDisable';
import { DialogPageProps } from '../../types/DialogTypes';
import { QueryLoaderAndError } from '../../abstractions/QueryLoaderAndError';

export type TwoFactorAfterLoadProps = DialogPageProps & {
    twoFactorEnabled: boolean;
};

export type TwoFactorFormProps = TwoFactorAfterLoadProps & {
    toggleTwoFactorAction: () => void;
};

type TwoFactorAction = 'enable' | 'disable' | null;

const TwoFactorAfterLoad: FC<TwoFactorAfterLoadProps> = (props: TwoFactorAfterLoadProps) => {
    const [twoFactorAction, setTwoFactorAction] = useState<TwoFactorAction>(null);

    const toggleTwoFactorAction = () => {
        setTwoFactorAction(props.twoFactorEnabled ? 'disable' : 'enable');
    };

    if (twoFactorAction === 'enable') {
        return <TwoFactorEnable {...props} />;
    }

    if (twoFactorAction === 'disable') {
        return <TwoFactorDisable {...props} />;
    }

    return <TwoFactorForm {...props} toggleTwoFactorAction={toggleTwoFactorAction} />;
};

const TwoFactor: FC<DialogPageProps> = (props: DialogPageProps) => {
    return QueryLoaderAndError<LoggedUser>(
        false,
        useQuery<LoggedUser>(LoggedUserQuery),
        (data: LoggedUser) => {
            return <TwoFactorAfterLoad twoFactorEnabled={data.me.two_factor_auth} {...props} />;
        },
    );
};

export { TwoFactor };
