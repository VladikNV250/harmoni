import clsx from "clsx";
import { 
    ChangeEvent, 
    CSSProperties, 
    FC, 
    useEffect, 
    useState 
} from "react"
import { useDebounce } from "shared/lib";
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface IVolumeBar {
    /** Additional classes */
    readonly className?: string,
}

export const VolumeBar: FC<IVolumeBar> = ({ className }) => {
    const { adapter, apiPlayback, sdkPlayback } = usePlaybackAdapter();
    const [value, setValue] = useState(100);
    const debouncedValue = useDebounce(value, 150);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(Number(value));
    }

    useEffect(() => {
        (async () => {
            if (apiPlayback && (sdkPlayback === null || sdkPlayback.track_window.current_track === null)) {
                setValue(await adapter.getVolume());
            }
        })()
    }, [])

    useEffect(() => {
        adapter.setVolume(debouncedValue as number);
    }, [debouncedValue])

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