import { TIconComponent } from "./iconTypes";

export interface INavLinkType {
    /** Title of page */
    readonly title: string,
    /** Link to page */
    readonly href: string,
    /** Icon of page */
    readonly Icon: TIconComponent,
    /** Icon, when the page is currently being visited */
    readonly ActiveIcon: TIconComponent,
}