import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import Split from "../components/Split";
import { Button } from "../components/ui/button";
import type { ImgProps } from "../types";

const articles: { img: ImgProps | ImgProps[]; text: string; btnText?: string }[] = [
    {
        img: { src: "/images/infrastructure/body-1.png", alt: "", width: 500, height: 400 },
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Contact",
    },
    {
        img: { src: "/images/infrastructure/body-2.png", alt: "", width: 500, height: 400 },
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    },
];

export default function Page() {
    return (
        <>
            <Hero title="Infrastructure" img={{ src: "/images/infrastructure/hero.png", alt: "banniere" }} />
            <section className="space-y-10 w-full">
                {articles.map((article, index) => {
                    // présentation de gauche à droite ou de droite à gauche
                    const dir = index % 2 === 0 ? "rtl" : "ltr";
                    return (
                        <Article
                            direction={dir}
                            key={index}
                            img={article.img}
                            description={article.text}
                            btn={<Button>{article.btnText}</Button>}
                        />
                    );
                })}
            </section>
            <Split bgImg={{ src: "/images/infrastructure/body-split-xl.png", alt: "" }}>
                <div className="flex flex-col items-center text-balance text-center max-w-[40%] gap-10">
                    <h3 className="text-secondary text-6xl font-semibold">Infrastructure</h3>
                    <Button className="border">Contact</Button>
                </div>
                <p className="text-white text-3xl text-balance text-justify max-w-[40%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis magnam beatae deserunt
                    voluptate reprehenderit ea reiciendis laudantium dolorum. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit.
                </p>
            </Split>
            <CommunFaq />
        </>
    );
}
