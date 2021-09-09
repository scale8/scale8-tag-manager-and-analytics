import { FC } from 'react';
import { DashboardParagraphs } from '../../../components/molecules/DashboardParagraphs';
import { OrgDashboardProps } from '../../../types/props/OrgDashboardProps';

const OrgUsersSection: FC<OrgDashboardProps> = (props: OrgDashboardProps) => {
    const { data } = props;

    const users = data.getOrg.users.length;

    return (
        <DashboardParagraphs
            paragraphs={[
                () => (
                    <>
                        This organization has <b>{users}</b> {users === 1 ? 'user' : 'users'}.
                    </>
                ),
            ]}
        />
    );
};

export default OrgUsersSection;
