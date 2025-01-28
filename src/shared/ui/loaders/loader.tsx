import { FC } from "react";
import { Modal } from "../modal/modal";
import "./loader.scss";

interface ILoader {
    loading: boolean,
}

export const Loader: FC<ILoader> = ({ loading }) => {
    return (
        loading &&
        <Modal isOpen={true}>
            <div className="loader-container">
                <div className="loader" />
            </div>
        </Modal>
    ) 
}