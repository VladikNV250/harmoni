export interface ICopyright {
    /** The copyright text for this content */
    readonly name: string,
    /** The type of copyright: C = the copyright, P = the sound recording (performance) copyright. */
    readonly type: "C" | "P",
}