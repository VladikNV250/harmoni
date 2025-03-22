import { 
    FC, 
    useMemo, 
} from "react";
import { 
    Pause, 
    Play, 
} from "shared/assets";
import { 
    Description, 
    OutlinedButton 
} from "shared/ui";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    getLibraryShows, 
    selectSavedShows 
} from "features/library";
import { 
    removeShowsFromLibrary, 
    saveShowsToLibrary 
} from "shared/api/user";
import { usePlaybackAdapter } from "entities/playback";
import { IShow } from "shared/api/show";
import { toast } from "react-toastify";
import styles from "./style.module.scss";

interface IShowControlPanel {
    readonly show: IShow | null,
}

export const ShowControlPanel: FC<IShowControlPanel> = ({ show }) => {
    const dispatch = useAppDispatch();
    const libraryShows = useAppSelector(selectSavedShows);
    const { adapter } = usePlaybackAdapter();

    const isShowInLibrary = useMemo(
        () => libraryShows.findIndex(item => item.show.id === show?.id) !== -1,
        [libraryShows, show]
    );

    const handlePlay = async () => {
        try {
            await adapter.play({ context_uri: show?.uri ?? "" });
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const saveShow = async () => {
        try {
            if (isShowInLibrary) {
                await removeShowsFromLibrary([show?.id ?? ""]);
            } else {
                await saveShowsToLibrary([show?.id ?? ""]);
            }
            dispatch(getLibraryShows());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.");
            console.error("FOLLOW", e);
        }
    }

    return (
        <div className={styles["show-control-panel"]}>
            <div className={styles["control-panel-button-container"]}>
                <button 
                    className={styles["control-panel-button"]} 
                    onClick={async () => await handlePlay()}
                    >
                    {adapter.getContextURI() === show?.uri ?
                    <Pause width={60} height={60} /> :
                    <Play width={60} height={60} />}
                </button>
                <OutlinedButton onClick={async () => await saveShow()}>
                    <Description>
                        {isShowInLibrary
                        ? "Unfollow"
                        : "Follow"}
                    </Description>
                </OutlinedButton>
            </div>
        </div>
    )
}