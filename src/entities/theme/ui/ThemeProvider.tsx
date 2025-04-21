import { 
    FC, 
    useMemo, 
    useState 
} from "react";
import { 
    LOCAL_STORAGE_THEME_KEY, 
    Theme, 
    ThemeContext 
} from "../config/themeContext";

const defaultTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) || Theme.DARK;

interface IThemeProvider {
    readonly children: JSX.Element;
}

/**
 * @component PlaybackProvider
 * @description Provider provides current theme throughout the app.
 */
export const ThemeProvider: FC<IThemeProvider> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    
    const defaultValue = useMemo(
        () => ({
            theme,
            setTheme
        }), 
        [theme]
    )

    return (
        <ThemeContext.Provider value={defaultValue}>
            {children}
        </ThemeContext.Provider>
    )
}