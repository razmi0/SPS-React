import type { ImgProps } from "../types";
import { cn } from "../utils";

/**
 * Quand la page a un split dans le body, j'utilise Split pour présenter la nouvelle section de la page.
 */

export default function Split({
    children,
    bgImg,
    smImg,
    height = 450,
    direction = "ltr",
    className,
}: {
    children: React.ReactNode;
    bgImg: Omit<ImgProps, "height" | "width">;
    smImg?: Omit<ImgProps, "height" | "width">;
    direction?: "ltr" | "rtl";
    height?: number;
    className?: string;
}) {
    return (
        <section className="relative">
            <img src={bgImg.src} alt={bgImg.alt} className="object-cover w-screen" height={height} />
            <div
                className={cn(
                    "absolute inset-0 flex items-center justify-around gap-10",
                    direction === "ltr" ? "flex-row" : "flex-row-reverse",
                    className
                )}>
                {
                    /* petite image ou pas ?   */ smImg && (
                        <img src={smImg.src} alt={smImg.alt} className="h-[80%] object-cover rounded-lg" />
                    )
                }
                {children}
            </div>
        </section>
    );
}

{
    /* <p className="text-white text-3xl text-balance text-justify max-w-[40%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis magnam beatae deserunt
                    voluptate reprehenderit ea reiciendis laudantium dolorum. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit.
                </p> */
}
