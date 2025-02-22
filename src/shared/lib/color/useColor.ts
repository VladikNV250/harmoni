import { useEffect, useState } from "react"
import { IColor } from "shared/types";
import analyze from "rgbaster";


export const useColor = (src: string, mix: boolean = true, theme: "dark" | "light" | "none" = "none"): string => {
    const [color, setColor] = useState<IColor["color"]>("#fff");

    useEffect(() => {
        (async () => {
            try {
                if (src !== "") {
                    const result: IColor[] = await analyze(src, { 
                        scale: 0.01,
                        ignore: ["rgb(255,255,255)", 'rgb(0,0,0)'] 
                    });
                    
                    /** Additional mixing colors if needed */
                    if (mix) { 
                        let sumR = 0; // sum of red color
                        let sumG = 0; // sum of green color
                        let sumB = 0; // sum of blue color
                        let totalCount = 0; // total count of all colors

                        result.forEach(({color, count}) => {
                            const colorArr = color
                                .replace(/rgba?\(/, "")
                                .replace(")", "")
                                .split(",");
                        

                            const red = colorArr[0];
                            const green = colorArr[1];
                            const blue = colorArr[2];

                            sumR = Math.floor(sumR + (parseInt(red) * count)); 
                            sumG = Math.floor(sumG + (parseInt(green) * count)); 
                            sumB = Math.floor(sumB + (parseInt(blue) * count));
                            totalCount += count;
                        })
                        
                        const colorR = Math.floor(sumR / totalCount);
                        const colorG = Math.floor(sumG / totalCount);
                        const colorB = Math.floor(sumB / totalCount);
                        
                        /** Add the theme in our mixed color */
                        switch (theme) {
                            case "dark":
                                setColor(`rgb(${(colorR + 17) / 2},${(colorG + 17) / 2},${(colorB + 17) / 2})`);
                                break;
                            case "light":
                                setColor(`rgb(${(colorR + 240) / 2},${(colorG + 240) / 2},${(colorB + 240) / 2})`);
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
                console.log(src, e);
            }
            
        })()
    }, [src, mix, theme])

    return color;
}