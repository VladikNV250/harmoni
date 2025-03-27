import { 
    SetStateAction 
} from "react";
import { 
    DragDownMenu, 
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
    
    const setSortIsOpen = (state: boolean) => setSort(prevState => ({...prevState, isOpen: state}));
    const setSortBy = (state: T) => setSort(prevState => ({...prevState, by: state}));
    const setSortOrder = (state: TSortOrder) => setSort(prevState => ({...prevState, order: state}));

    const renderSortTypes = (items: typeof sortTypes) => {
        return items.map(type => 
            <button 
                className={styles["menu-button"]}
                onClick={() => setSortBy(type)}    
            >
                <Paragraph>{(type ?? "") as string}</Paragraph>
                {by === type && 
                <CheckedIcon 
                    width={40} 
                    height={40} 
                    className={styles["icon"]} 
                />}
            </button>
        )
    }

    return (
        <DragDownMenu isOpen={isOpen} setIsOpen={setSortIsOpen}>
            <div className={styles["menu-content"]}>
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
            </div>
        </DragDownMenu>
    )
}