export interface IAvailableDevices {
    readonly devices: IDevice[]
}

export interface IDevice {
    /** The device ID. */
    readonly id: string | null,
    /** If this device is the currently active device. */
    readonly is_active: boolean,
    /** If this device is currently in a private session. */
    readonly is_private_session: boolean,
    /** Whether controlling this device is restricted */
    readonly is_restricted: boolean,
    /** A human-readable name for the device. */
    readonly name: string,
    /** Device type */
    readonly type: "computer" | "smartphone" | "speaker",
    /** The current volume in percent. */
    readonly volume_percent: number | null,
    /** If this device can be used to set the volume */
    readonly supports_volume: boolean,
}