import { FC } from 'react';
import { selectFolders } from 'features/library';
import { IFolder } from 'entities/folder';
import {
    BottomSheet,
    ContextMenu,
    FilledButton,
    MenuButton,
    OutlinedButton,
    Paragraph
} from 'shared/ui';
import {
    useAppSelector,
    useWindowDimensions
} from 'shared/lib';
import { FolderIcon } from 'shared/assets';
import clsx from 'clsx';
import styles from './style.module.scss';


interface IFolderMenu {
    /** Additional styles. */
    readonly className?: string;
    /** Controls whether the menu is visible. */
    readonly isOpen: boolean;
    /** Callback to toggle the menu's visibilty. */
    readonly setIsOpen: (state: boolean) => void;
    /** Called when the user chooses to create a new folder. */
    readonly onCreateFolder: () => void;
    /** Called when the user selects a folder from the list. */
    readonly onSelectFolder: (folderId: string) => void;
    /** Called when the user chooses to remove from a folder. */
    readonly onRemoveFromFolder: () => void;
    /** Id of folder, where current playlist is */
    readonly folderId?: string | null;
    /** Check is menu is nested in other menu */
    readonly isNested?: boolean;
}

/**
 * @component FolderMenu
 * @description Renders a responsive menu with a list of folders, button to create folder and remove from existing folder.
 * - On desktop (>=768): shows a dropdown context menu.
 * - On mobile: shows a bottom sheet. 
 * 
 * Typically used for adding or removing playlists to folders.
 */
export const FolderMenu: FC<IFolderMenu> = (props) => {
    const {
        className,
        isOpen,
        setIsOpen,
        onCreateFolder,
        onSelectFolder,
        onRemoveFromFolder,
        folderId,
        isNested = false
    } = props;
    const folders = useAppSelector(selectFolders);
    const { width } = useWindowDimensions();

    const renderFolders = (items: IFolder[]) => {
        return items.map(folder =>
            folder.id !== folderId ? (
                <MenuButton
                    key={folder.id}
                    Icon={FolderIcon}
                    text={folder.name ?? ""}
                    onClick={() => onSelectFolder(folder.id)}
                />
            ) : null
        );
    }

    return (
        width >= 768
            ?
            <ContextMenu
                className={className}
                isMenuOpen={isOpen}
                setIsMenuOpen={setIsOpen}
                isNested={isNested}
                additionalElements={
                    <>
                        <FilledButton onClick={onCreateFolder}>
                            <Paragraph>
                                Add to new folder
                            </Paragraph>
                        </FilledButton>,
                        {folderId !== null && (
                            <OutlinedButton onClick={onRemoveFromFolder}>
                                <Paragraph>
                                    Remove from folders
                                </Paragraph>
                            </OutlinedButton>
                        )}
                    </>
                }
            >
                {renderFolders(folders)}
            </ContextMenu>
            :
            <BottomSheet
                className={clsx(
                    styles["folder-menu"],
                    className
                )}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <FilledButton onClick={onCreateFolder}>
                    <Paragraph>
                        Add to new folder
                    </Paragraph>
                </FilledButton>
                {folderId !== null &&
                    <OutlinedButton onClick={onRemoveFromFolder}>
                        <Paragraph>
                            Remove from folders
                        </Paragraph>
                    </OutlinedButton>}
                <div className={styles["folder-menu-list"]}>
                    {renderFolders(folders)}
                </div>
            </BottomSheet>
    );
};