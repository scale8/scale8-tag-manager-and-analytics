import { FC, useState } from 'react';
import { DialogPageProps } from '../../types/DialogTypes';
import { DocumentNode } from 'graphql';
import { ExecuteMutationCallback } from './DialogDirectMutation';
import { InDialogMutation } from './InDialogMutation';
import DeleteCommentDialogContent from '../../components/organisms/DeleteCommentDialogContent';

export type DialogDeleteCommentProps = DialogPageProps & {
    mutation: DocumentNode;
    executeMutationCallback: ExecuteMutationCallback;
    text: string;
};

const DialogDeleteComment: FC<DialogDeleteCommentProps> = (props: DialogDeleteCommentProps) => {
    const [deleting, setDeleting] = useState(false);
    const [comments, setComments] = useState('');

    const { id, mutation, executeMutationCallback, text } = props;

    const handleCancel = () => {
        props.handleDialogClose(true);
    };

    const handleConfirm = () => {
        setDeleting(true);
    };

    if (deleting) {
        return (
            <InDialogMutation
                comments={comments}
                executeMutationCallback={executeMutationCallback}
                mutation={mutation}
                id={id}
                onMutationComplete={() => {
                    setDeleting(false);
                    props.pageRefresh();
                    props.handleDialogClose(false);
                }}
            />
        );
    }

    return (
        <DeleteCommentDialogContent
            comments={comments}
            setComments={setComments}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            text={text}
        />
    );
};

export { DialogDeleteComment };
