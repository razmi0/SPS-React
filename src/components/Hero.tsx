import { type ImgProps } from "../types";

export const Hero = ({ title, img }: { title: string; img: Omit<ImgProps, "width" | "height"> }) => {
    return (
        <div className="relative overflow-hidden min-h-[45vh]">
            <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <h1 className="font-bold text-secondary text-center leading-tight translate-y-5 text-[clamp(2rem,8vw,4rem)]">
                    {title}
                </h1>
            </div>
        </div>
    );
};
