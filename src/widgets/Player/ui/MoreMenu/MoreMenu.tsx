import { FC, MouseEvent } from "react";
import { Link } from "react-router";
import { AddToPlaylist, AddToQueue, Album, ArtistIcon } from "shared/assets";
import { useAppDispatch } from "shared/lib";
import { DragDownMenu, Paragraph } from "shared/ui";
import { addItemToQueue } from "features/queue";
import { getAvailableDevices } from "features/device";
import { usePlaybackAdapter } from "entities/playback";
import { playerSlice } from "widgets/Player/model/playerSlice";
import "./MoreMenu.scss";

interface IMoreMenu {
    readonly menus: { [key: string]: boolean },
    readonly openMenu: (whatOpen: string, openState?: boolean) => void,
}

export const MoreMenu: FC<IMoreMenu> = ({ menus, openMenu }) => {
    const dispatch = useAppDispatch();    
    const { adapter } = usePlaybackAdapter();
    const { toggleFullscreenMode } = playerSlice.actions;
    
    
    const addItemToQueueHandle = async (uri: string) => {
        if (uri === "") return;

        await addItemToQueue(uri);
        await dispatch(getAvailableDevices());
    }

    const handleOpenArtistMenu = (e: MouseEvent) => {
        e.stopPropagation();
        openMenu("artistMenu", true);
    }

    const renderArtists = (artists: {name: string, id: string}[]) => {
        return artists.map(artist => 
            <Link 
                key={artist.id} 
                to={`/artists/${artist.id}`}
                className="menu-link"
                onClick={() => {
                    openMenu("moreMenu", false)
                    dispatch(toggleFullscreenMode())
                }}>
                <ArtistIcon width={40} height={40} />
                {artist.name}
            </Link>
        )
    }

    return (
        <DragDownMenu isOpen={menus.moreMenu} setIsOpen={(state: boolean) => openMenu("moreMenu", state)}>
            <div className="menu-content">
                <div className="dragdown-menu-artists-wrapper" onClick={e => e.stopPropagation()}>
                    <DragDownMenu 
                        className="dragdown-menu-artists" 
                        isOpen={menus.artistMenu} 
                        setIsOpen={(state: boolean) => openMenu("artistMenu", state)}
                    >
                        <div className="menu-artists">
                            {renderArtists(adapter.getArtists())}
                        </div>
                    </DragDownMenu>
                </div>
                <button className="menu-button">
                    <AddToPlaylist width={40} height={40} />
                    <Paragraph>Add to playlist</Paragraph>
                </button>
                <button 
                    className="menu-button" 
                    onClick={async () => await addItemToQueueHandle(adapter.getTrackURI())}
                >
                    <AddToQueue width={40} height={40} />
                    <Paragraph>Add to queue</Paragraph>
                </button>
                <Link 
                    to={adapter.getAlbumLink()} 
                    className="menu-link"
                    onClick={() => dispatch(toggleFullscreenMode())}
                >
                    <Album width={40} height={40} />
                    <Paragraph>Go to album</Paragraph>
                </Link>
                {adapter.getArtists().length > 1 
                ?
                    <button 
                        className="menu-button"
                        onClick={handleOpenArtistMenu}
                    >
                        <ArtistIcon width={40} height={40} />
                        <Paragraph>Go to artist</Paragraph>
                    </button>
                :
                    <Link 
                        to={`/artists/${adapter.getArtists()?.[0]?.id}`}
                        className="menu-link"
                        onClick={() => dispatch(toggleFullscreenMode())}
                    >
                        <ArtistIcon width={40} height={40} />
                        <Paragraph>Go to artist</Paragraph>
                    </Link>
                }
                
            </div>
        </DragDownMenu>
    )
}