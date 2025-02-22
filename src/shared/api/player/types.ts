export interface IPlayTrack {
    readonly context_uri: string | null,
    readonly offset?: {
        readonly uri?: string | null,
        readonly position?: number | null, 
    }
    readonly position_ms?: number | null,
    readonly device_id?: string | null,
}