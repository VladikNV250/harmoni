import { 
    ChangeEvent, 
    FC, 
    useEffect, 
    useState 
} from "react";
import { 
    addCustomPlaylistCoverImage, 
    changePlaylistDetails, 
    IPlaylist 
} from "shared/api/playlist";
import { 
    Description, 
    FilledButton, 
    Input, 
    Modal, 
    TextArea, 
    Title 
} from "shared/ui";
import { 
    PenIcon, 
    PlaceholderImage 
} from "shared/assets";
import { toast } from "react-toastify";
import styles from "./style.module.scss";

interface IEditMenu {
    readonly playlist: IPlaylist | null;
    readonly isOpen: boolean;
    readonly setIsOpen: (isOpen: boolean) => void;
}

export const EditMenu: FC<IEditMenu> = ({ playlist, setIsOpen, isOpen }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [editData, setEditData] = useState({
        name: playlist?.name,
        description: playlist?.description,
        previewImage: playlist?.images?.[0]?.url,
    })
    
    useEffect(() => {
        setEditData(prevState => ({
            name: prevState.name ?? playlist?.name,
            description: prevState.description ??  playlist?.description,
            previewImage: prevState.previewImage ?? playlist?.images?.[0]?.url
        }))
    }, [playlist])

    const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const MAX_SIZE = 256 * 1024; // 256KB

        if (file) {
            if (file.size > MAX_SIZE) { 
                return toast.error("The image size is over 256 KB. Please select another image.")
            }

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                setEditData(prevState => ({
                    ...prevState,
                    previewImage: e.target?.result as string,
                }));
            }
            reader.readAsDataURL(file);
        }
    }
 
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setEditData(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    const submitChanges = async () => {
        try {
            setLoading(true);
            if (!playlist) return toast.error("Oops! Something went wrong. Try again.");
            if (!editData.name) {
                return toast.error("Playlist name is required.");
            }
            
            if (editData.previewImage !== playlist.images?.[0]?.url && editData.previewImage) {
                const base64Image = editData.previewImage.split(',')[1]; // get base64 without "data:image/jpeg;base64,"
                await addCustomPlaylistCoverImage(playlist.id, base64Image);
            }
            
            if (editData.name !== playlist.name || editData.description !== playlist.description) {
                await changePlaylistDetails(playlist.id, {
                    name: editData.name ?? playlist.name,
                    description: editData.description ?? playlist.description ?? "",
                })
            }

            setIsOpen(false);            
            toast.success("Your changes have been successfully saved and will be visible shortly.")
        } catch (e) {
            toast.error("Oops! Something went wrong. Try again.");
            console.error("SAVE", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles["edit-wrapper"]}>
                <div className={styles["edit-menu"]} onClick={(e) => e.stopPropagation()}>
                    <Title className={styles["edit-title"]}>
                        Edit details
                    </Title>
                    <label htmlFor="image-upload" className={styles["edit-image-container"]}>
                        <img 
                            src={editData.previewImage ?? PlaceholderImage} 
                            className={styles["edit-image"]} 
                        />
                        <div className={styles["edit-image__hover"]}>
                            <PenIcon width={40} height={40} />
                        </div>
                    </label>
                    <input 
                        type="file" 
                        id="image-upload" 
                        accept="image/jpeg" 
                        style={{display: "none"}}
                        onChange={uploadImage} 
                    />
                    <Input 
                        name="name"
                        value={editData.name ?? ""}
                        placeholder="Add a name"
                        onChange={handleChange}
                        className={styles["edit-input"]}
                    />
                    <TextArea 
                        name="description"
                        value={editData.description ?? ""}
                        placeholder="Add a description"
                        onChange={handleChange}
                        className={styles["edit-textarea"]}
                    />
                    <FilledButton 
                        className={styles["edit-button"]} 
                        onClick={async () => await submitChanges()}>
                        <Description className="edit-button-text">
                            {loading ? ". . ." : "Save changes"}
                        </Description>
                    </FilledButton>
                </div>
            </div>        
        </Modal>
    )
}