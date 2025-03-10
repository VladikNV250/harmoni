import { IImage } from "shared/types";

export interface ICategory {
    /** A link to the Web API endpoint */
    readonly href: string,
    /** The category icon, in various sizes. */
    readonly icons: IImage[],
    /** The Spotify category ID of the category. */
    readonly id: string,
    /** The name of the category. */
    readonly name: string,
}

export interface ISeveralBrowseCategories {
    readonly categories: {
        /** A link to the Web API endpoint */
        readonly href: string;
        /** The maximum number of items in the response  */
        readonly limit: number;
        /** URL to the next page of items. */
        readonly next: string | null;
        /** The offset of the items returned */
        readonly offset: number;
        /** URL to the previous page of items. */
        readonly previous: string | null;
        /** The total number of items available to return. */
        readonly total: number;
        /** The list of categories */
        readonly items: ICategory[]
    }
}