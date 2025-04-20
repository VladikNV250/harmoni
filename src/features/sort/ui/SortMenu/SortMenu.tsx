import { 
    SetStateAction 
} from "react";
import { 
    BottomSheet,
    ContextMenu,
    Description,
    Paragraph, 
    Subtitle 
} from "shared/ui";
import { 
    ArrowDown, 
    ArrowUp, 
    CheckedIcon 
} from "shared/assets";
import { 
    TSortOrder,
    TTrackSortBy, 
} from "features/sort/model/type";
import clsx from "clsx";
import styles from "./style.module.scss";
import { useWindowDimensions } from "shared/lib";


interface ISortMenu<T = TTrackSortBy> {
    sort: {
        isOpen: boolean,
        by: T,
        order: TSortOrder
    },
    setSort: (value: SetStateAction<{
        isOpen: boolean;
        by: T;
        order: TSortOrder;
    }>) => void
    sortTypes: readonly T[]
}

export const SortMenu = <T,>({ sort, setSort, sortTypes }: ISortMenu<T>) => {
    const { isOpen, by, order } = sort;
    const { width } = useWindowDimensions();
    
    const setSortIsOpen = (state: boolean) => setSort(prevState => ({...prevState, isOpen: state}));
    const setSortBy = (state: T) => setSort(prevState => ({...prevState, by: state}));
    const setSortOrder = (state: TSortOrder) => setSort(prevState => ({...prevState, order: state}));

    const renderSortTypes = (items: typeof sortTypes) => {
        return items.map((type, index) => 
            <button 
                key={index}
                className={clsx(
                    width >= 768 ? styles["context-menu-button"] : styles["menu-button"]
                )}
                onClick={() => setSortBy(type)}    
            >
                <Description>{(type ?? "") as string}</Description>
                <CheckedIcon 
                    width={40} 
                    height={40} 
                    className={clsx(by === type && styles["icon"])} 
                />
            </button>
        )
    }

    return (
        width >= 768
        ?
        <ContextMenu
            className={styles["context-menu"]}
            isMenuOpen={isOpen}
            setIsMenuOpen={setSortIsOpen}
        >
            <Paragraph className={styles["context-menu-title"]}>
                Sort by
            </Paragraph>
            {renderSortTypes(sortTypes)}
            <Paragraph className={styles["context-menu-title"]}>
                Sort order
            </Paragraph>
            <button 
                className={styles["context-menu-button"]}
                onClick={() => setSortOrder("Ascending")}    
            >
                <Description>Ascending</Description>
                <ArrowUp 
                    width={40} 
                    height={40} 
                    className={clsx(
                        order === "Ascending" && styles["icon"]
                    )} 
                />
            </button>
            <button 
                className={styles["context-menu-button"]}
                onClick={() => setSortOrder("Descending")}    
            >
                <Description>Descending</Description>
                <ArrowDown 
                    width={40} 
                    height={40} 
                    className={clsx(
                        order === "Descending" && styles["icon"]
                    )} 
                />
            </button>
        </ContextMenu>
        :
        <BottomSheet
            isOpen={isOpen}
            setIsOpen={setSortIsOpen}
        >
            <header className={styles["menu-header"]}>
                <Subtitle className={styles["menu-title"]}>
                    Sort by
                </Subtitle>
            </header>
            {renderSortTypes(sortTypes)}
            <header className={styles["menu-header"]}>
                <Subtitle className={styles["menu-title"]}>
                    Sort order
                </Subtitle>
            </header>
            <button 
                className={styles["menu-button"]}
                onClick={() => setSortOrder("Ascending")}    
            >
                <Paragraph>Ascending</Paragraph>
                <ArrowUp 
                    width={40} 
                    height={40} 
                    className={clsx(
                        order === "Ascending" && styles["icon"]
                    )} 
                />
            </button>
            <button 
                className={styles["menu-button"]}
                onClick={() => setSortOrder("Descending")}    
            >
                <Paragraph>Descending</Paragraph>
                <ArrowDown 
                    width={40} 
                    height={40} 
                    className={clsx(
                        order === "Descending" && styles["icon"]
                    )} 
                />
            </button>
        </BottomSheet>
    )
}