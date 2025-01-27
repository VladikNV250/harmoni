export type TIconComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    readonly title?: string;
    readonly titleId?: string;
    readonly desc?: string;
    readonly descId?: string;
}>