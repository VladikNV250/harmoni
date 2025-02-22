import { useRef, useState } from "react";

export const usePress = (delay: number = 400) => {
    const [isPressed, setIsPressed] = useState(false);
    const timeRef = useRef<number | null>(null);

    const startPress = () => {
        timeRef.current = setTimeout(() => {
            setIsPressed(true);
        }, delay)
    }

    const clearPressTime = () => {
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }
    }

    const endPress = () => {
        clearPressTime();
        setIsPressed(false);
    }

    return { 
        isPressed, 
        startPress, 
        endPress,
        clearPressTime,
    };
}