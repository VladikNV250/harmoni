import { 
    useEffect, 
    useState 
} from "react";
import { IColor } from "shared/types";
import analyze from "rgbaster";

/**
 * @hook useColor
 * @description Gets the primary color of an image. If mixing is enabled, it averages the dominant color 
 * with other prominent colors from the image and optionally blends the result with a dark or light theme.
 * @param {string} src The source URL of the image. 
 * @param {boolean} [mix=true] Whether to mix the main color with additional colors from the image. 
 * @param {"dark" | "light" | "none"} [theme="none"] Optional theme overlay; 'dark' or 'light' to blend the color with theme tones, 'none' for no blending.
 * @returns {string} The computed primary color of the image, formatted as an RGB string.
 */
export const useColor = (
    src: string,
    mix: boolean = true,
    theme: "dark" | "light" | "none" = "none"
): string => {
    const [color, setColor] = useState<IColor["color"]>("#fff");

    useEffect(() => {
        (async () => {
            try {
                if (src !== "") {
                    const result: IColor[] = await analyze(src, {
                        scale: 0.1,
                        ignore: ["rgb(255,255,255)", "rgb(0,0,0)"],
                    });

                    /** Additional mixing colors if needed */
                    if (mix) {
                        let sumR = 0; // sum of red color
                        let sumG = 0; // sum of green color
                        let sumB = 0; // sum of blue color
                        let totalCount = 0; // total count of all colors

                        result.forEach(({ color, count }) => {
                            /** Convert string format rgb(0,0,0) into array color format [0,0,0] */
                            const colorArr = color
                                .replace(/rgba?\(/, "")
                                .replace(")", "")
                                .split(",");

                            const red = colorArr[0];
                            const green = colorArr[1];
                            const blue = colorArr[2];

                            sumR = Math.floor(sumR + parseInt(red) * count);
                            sumG = Math.floor(sumG + parseInt(green) * count);
                            sumB = Math.floor(sumB + parseInt(blue) * count);
                            totalCount += count;
                        });

                        /** Calculate average RGB color from all detected ones. */
                        const colorR = Math.floor(sumR / totalCount);
                        const colorG = Math.floor(sumG / totalCount);
                        const colorB = Math.floor(sumB / totalCount);

                        /** Blend the average color with the theme color, if provided */
                        switch (theme) {
                            /** RGB(17, 17, 17) */
                            case "dark":
                                setColor(
                                    `rgb(${(colorR + 17) / 2},${
                                        (colorG + 17) / 2
                                    },${(colorB + 17) / 2})`
                                );
                                break;
                            /** RGB(240, 240, 240) */
                            case "light":
                                setColor(
                                    `rgb(${(colorR + 240) / 2},${
                                        (colorG + 240) / 2
                                    },${(colorB + 240) / 2})`
                                );
                                break;
                            default:
                                setColor(`rgb(${colorR},${colorG},${colorB})`);
                                break;
                        }
                    } else {
                        setColor(result[0].color);
                    }
                }
            } catch (e) {
                console.error("MIXING-COLOR-ERROR", src, e);
            }
        })();
    }, [src, mix, theme]);

    return color;
};
