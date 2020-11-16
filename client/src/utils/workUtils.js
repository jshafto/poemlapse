import { compareDesc } from 'date-fns';

export const sortWorks = (a,b) => {
    return compareDesc(new Date(a.datePublished), new Date(b.datePublished))
}
