import { useState } from "react";

export const useView = () => {
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

    const switchMode = () => {
        if (viewMode === "list") setViewMode("grid");
        else setViewMode("list");
    }

    return { viewMode, switchMode }
}