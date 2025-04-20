import { TLibraryFilter } from "features/library";
import { TIconComponent } from "shared/types";

export interface ILibraryFilterOptions {
    name: string,
    Icon: TIconComponent,
    filter: TLibraryFilter,
}