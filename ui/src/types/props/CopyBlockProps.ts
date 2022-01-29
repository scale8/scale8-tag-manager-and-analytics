import { ShikiLanguages } from '../../components/atoms/LibraryLoaders/LazyShiki';

export type CopyBlockProps = {
    text: string;
    language: ShikiLanguages;
    flat?: boolean;
};
