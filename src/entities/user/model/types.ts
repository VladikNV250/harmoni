import { IImage, RejectedDataType } from "shared/types";

export interface IUserState {
    user: IUser | null,
    loading: boolean,
    error: RejectedDataType | null;
}

export interface IUser {
    /** The country of the user */
    readonly country?: string,
    /** The name displayed on the user's profile */
    readonly display_name: string | null,
    /** The user's email address */
    readonly email?: string,
    /** The user's explicit content settings */
    readonly explicit_content?: {
        /** Indicates that explicit content should not be played */
        readonly filter_enabled: boolean,
        /** Indicates that the explicit content setting is locked and can't be changed by the user */
        readonly filter_locked: boolean 
    },
    /** Known external URLs for this user */
    readonly external_urls: {
        readonly spotify: string
    }
    /** Information about the followers of the user */
    readonly followers: {
        readonly href: null,
        /** The total number of followers */
        readonly total: number,
    },
    /** A link to the Web API endpoint for this user */
    readonly href: string,
    /** The Spotify user ID for the user */
    readonly id: string,
    /** The user's profile image */
    readonly images: IImage[],
    /** The user's Spotify subscription level */
    readonly product?: "premium" | "free" | "open",
    /** The object type: "user" */
    readonly type: "user",
    /** The Spotify URI for the user */
    readonly uri: string, 
}