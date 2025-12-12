import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import { Button } from "../components/ui/button";
import { type ImgProps } from "../types";

const articles: { img: ImgProps | ImgProps[]; text: string; btnText: string }[] = [
    {
        img: { src: "/images/index/body-1.png", alt: "", width: 500, height: 400 },
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Ghost",
    },
    {
        img: { src: "/images/index/body-2.png", alt: "", width: 500, height: 400 },
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Contact",
    },
    {
        img: [
            { src: "/images/index/body-grid-1.png", alt: "", width: 220, height: 220 }, //
            { src: "/images/index/body-grid-2.png", alt: "", width: 220, height: 220 }, //
        ],
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Commander un devis",
    },
];
export default function Page() {
    return (
        <>
            <Hero title="Swiss Padel Stars" img={{ src: "/images/index/hero.png", alt: "banniere de la page" }} />
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
            <CommunFaq />
        </>
    );
}
