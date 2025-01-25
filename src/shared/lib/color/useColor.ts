import { useEffect, useState } from "react"
import { IColor } from "shared/types";
import analyze from "rgbaster";

export const useColor = (src: string): string => {
    const [color, setColor] = useState<IColor["color"]>("#fff");

    useEffect(() => {
        (async () => {
            try {
                if (src !== "") {
                    const result: IColor[] = await analyze(src, { 
                        scale: 0.2,
                        ignore: ["rgb(255,255,255)", 'rgb(0,0,0)'] 
                    });
                    setColor(result[0].color);
                }
            } catch (e) {
                console.log(src, e);
            }
            
        })()
    }, [src])

    return color;
}