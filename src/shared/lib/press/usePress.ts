import { useRef, useState } from "react";

/**
 * @hook usePress
 * @description Custom hook which give tools to create the effect of a long press on an element.
 * 
 * @param {number} delay How long user must press on element to set state on true. Measured in milliseconds.
 * @returns {{
 *  isPressed: boolean,
 *  startPress: () => void,
 *  endPress: () => void,
 *  clearPressTime: () => void,
 * }}
 * An object containing:
 * - isPressed - Whether is currently pressed element.
 * - startPress - Callback to start press. Usually used in onMouseDown, onTouchStart event listeners
 * - endPress - Callback to end press. Usually used in onMouseLeave event listener.
 * - clearPressTime - Calbback to reset press time. Usually used in onMouseUp, onTouchEnd event listeners.
 */
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