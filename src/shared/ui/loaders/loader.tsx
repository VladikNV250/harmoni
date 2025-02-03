import { FC } from "react";
import "./loader.scss";
import clsx from "clsx";

interface ILoader {
    readonly loading: boolean,
}

export const Loader: FC<ILoader> = ({ loading }) => {
    return (
        loading &&
        <div className={clsx("loader-modal", "open")}>
            <div className="loader-container">
                <div className="loader" />
            </div>
        </div>
    ) 
}