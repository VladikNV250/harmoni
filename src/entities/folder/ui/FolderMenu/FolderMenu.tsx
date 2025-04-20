import { FC } from 'react';
import styles from './style.module.scss';
import { BottomSheet, ContextMenu, FilledButton, MenuButton, OutlinedButton, Paragraph } from 'shared/ui';
import { FolderIcon } from 'shared/assets';
import { IFolder } from 'entities/folder/model/type';
import { useAppSelector, useWindowDimensions } from 'shared/lib';
import { selectFolders } from 'features/library';
import clsx from 'clsx';


interface IFolderMenu {
    readonly className?: string;
    readonly isOpen: boolean;
    readonly setIsOpen: (state: boolean) => void;
    readonly onCreateFolder: () => void;
    readonly onSelectFolder: (folderId: string) => void;
    readonly onRemoveFromFolder: () => void; 
    /** Id of folder, where current playlist is */
    readonly folderId?: string | null;
    /** Check is menu is nested in other menu */
    readonly isNested?: boolean; 
}

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