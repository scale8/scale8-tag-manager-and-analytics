import { FC, ReactNode } from 'react';

const BlankLinkRenderer: FC<{
    href: string;
    children: ReactNode;
}> = (props: { href: string; children: ReactNode }) => {
    const absoluteCheckRegex = /^https?:\/\//i;
    if (absoluteCheckRegex.test(props.href)) {
        return (
            <a href={props.href} target="_blank" rel="noreferrer">
                {props.children}
            </a>
        );
    }
    return <a href={props.href}>{props.children}</a>;
};

export const standardMarkdownOptions = {
    overrides: {
        a: {
            component: BlankLinkRenderer,
        },
    },
};
