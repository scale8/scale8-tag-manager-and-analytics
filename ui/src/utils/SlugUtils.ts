import { MutableRefObject } from 'react';

export const slugify = (s: string): string => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return s
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w-]+/g, '') // Remove all non-word characters
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};

export const getUniqueSlug = (
    text: string,
    ids: MutableRefObject<{ slug: string; count: number }[]>,
): string => {
    const slug = slugify(text);
    const existingSlugIndex = ids.current.findIndex((_) => _.slug === slug);
    if (existingSlugIndex === -1) {
        ids.current = [...ids.current, { slug, count: 1 }];
        return slug;
    }
    const existingSlug = ids.current[existingSlugIndex];
    ids.current = ids.current.map((_, index) => {
        if (index === existingSlugIndex) {
            return { slug: _.slug, count: _.count + 1 };
        }
        return _;
    });
    return `${slug}-${existingSlug.count}`;
};
