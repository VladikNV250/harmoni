import clsx from "clsx";
import { ChangeEvent, CSSProperties, FC, useEffect, useState } from "react"
import { useDebounce } from "shared/lib";
import styles from "./style.module.scss";


interface IVolumeBar {
    /** Additional classes */
    readonly className?: string,
    /** Spotify Player from Web Playback SDK */
    readonly player: Spotify.Player | null;
}

export const VolumeBar: FC<IVolumeBar> = ({ className, player }) => {
    const [value, setValue] = useState(100);
    const debouncedValue = useDebounce(value, 150);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(Number(value));
    }

    useEffect(() => {
        (async () => {
            if (player !== null)
                setValue(await player?.getVolume())
        })()
    }, [])

    useEffect(() => {
        if (player !== null) {
            player.setVolume((debouncedValue as number) / 100)
        }
    }, [debouncedValue, player])

    return (
        <input 
            type="range" 
            className={clsx(styles["volume-bar"], className)} 
            min={0} max={100} 
            value={value}
            onChange={handleChange} 
            style={{"--value": `${value}%`} as CSSProperties}
        />
    )
}