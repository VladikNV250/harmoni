import { 
    ChangeEvent, 
    CSSProperties, 
    FC, 
    useEffect, 
    useState 
} from "react"
import { useDebounce } from "shared/lib";
import clsx from "clsx";
import { IPlayback, usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface ISeekBar {
    /** Additional classes */
    readonly className?: string,
}

export const SeekBar: FC<ISeekBar> = ({ className }) => {
    const { adapter, apiPlayback, setApiPlayback } = usePlaybackAdapter();
    const position = adapter.getTrackPosition();
    const duration = adapter.getTrackDuration();
    const [value, setValue] = useState(position);
    const debouncedValue = useDebounce(value, 300);

    useEffect(() => {
        if (position !== debouncedValue as number) {
            adapter.seek(debouncedValue as number);
        }

        if (apiPlayback) {
            const newApiPlayback: IPlayback = {
                ...apiPlayback,
                progress_ms: debouncedValue as number
            };
            setApiPlayback?.(newApiPlayback);
        }
    }, [debouncedValue])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!adapter.checkPlayback()) return;

        const { value } = e.target;
        setValue(Number(value) * 1000); /** transform from seconds into ms */
    }

    const getPercentage = (progressDuration: number, trackDuration: number) => {
        return Math.floor((progressDuration * 100) / trackDuration);
    }

    return (
        <input 
            type="range" 
            className={clsx(
                styles["seek-bar"],
                !adapter.checkPlayback() && styles["disabled"],
                className,
            )} 
            min={0} max={Math.floor(duration / 1000)} 
            value={Math.floor(position / 1000)}
            onChange={handleChange} 
            style={{"--value": `${getPercentage(position, duration )}%`} as CSSProperties}
        />
    )
}