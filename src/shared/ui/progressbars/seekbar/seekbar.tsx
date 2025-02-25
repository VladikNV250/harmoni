import { 
    ChangeEvent, 
    CSSProperties, 
    FC, 
    useEffect, 
    useState 
} from "react"
import { useDebounce } from "shared/lib";
import clsx from "clsx";
import styles from "./style.module.scss";


interface ISeekBar {
    /** Additional classes */
    readonly className?: string,
    /** Track duration */
    readonly trackDuration: number,
    /** Played duration of track */
    readonly progress: number,
    /** Spotify player */
    readonly player: Spotify.Player | null
}

export const SeekBar: FC<ISeekBar> = ({ trackDuration, progress, className, player }) => {
    const [value, setValue] = useState(Number(progress));
    const debouncedValue = useDebounce(value, 300);

    useEffect(() => {
        if (player !== null) 
            player?.seek(debouncedValue as number);
    }, [debouncedValue, player])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(Number(value) * 1000); /** transform from seconds into ms */
    }

    const getPercentage = (progressDuration: number, trackDuration: number) => {
        return Math.floor((progressDuration * 100) / trackDuration);
    }

    return (
        <input 
            type="range" 
            className={clsx(styles["seek-bar"], className)} 
            min={0} max={Math.floor(trackDuration / 1000)} 
            value={Math.floor(progress / 1000)}
            onChange={handleChange} 
            style={{"--value": `${getPercentage(progress, trackDuration )}%`} as CSSProperties}
        />
    )
}