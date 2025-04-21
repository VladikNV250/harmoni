import { useEffect, useState } from "react"

/**
 * @hook useDebounce
 * @description Delays the update of a value until after a specified delay.
 * Commonly used to optimize performance for inputs, filters, or search queries.
 * 
 * @param {string | number} value The value to debounce.  
 * @param {number} delay Delay in milliseconds before updating the debounced value.
 * @returns {string | number} The debounced value after specified delay.
 */
export const useDebounce = (value: string | number, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {

        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay)

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay])

    return debouncedValue;
}