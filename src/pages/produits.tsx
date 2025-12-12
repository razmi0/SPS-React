import { Article } from "../components/Article";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import Split from "../components/Split";
import TestimonyCarousel from "../components/Testimony";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import Spacer from "../components/ui/spacer";
import type { ImgProps } from "../types";

type ProduitArticleProps = {
    img: ImgProps | ImgProps[];
    description: string;
    modalDescription: string;
    modalList?: string[];
    btnText: string;
    title: string;
    subTitle?: string;
    deterministic?: boolean;
};

const articles: ProduitArticleProps[] = [
    {
        title: "Table de padel",
        img: { src: "/images/produits/body-1.png", alt: "", width: 500, height: 400 },
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Demander un devis",
        modalDescription:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis non aspernatur repellendus dolore, veritatis incidunt excepturi labore architecto, hic esse reiciendis ducimus reprehenderit numquam autem illo sequi deserunt nemo aut?",
    },
    {
        deterministic: true,
        title: "Balles de padel",
        img: { src: "/images/header/balles.png", alt: "", width: 500, height: 400 },
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Commander",
        subTitle: "30.00 CH",
        modalDescription:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis non aspernatur repellendus dolore, veritatis incidunt excepturi labore architecto, hic esse reiciendis ducimus reprehenderit numquam autem illo sequi deserunt nemo aut?",
        modalList: [
            "Lorem ipsum dolor sit amet consectetur",
            "Lorem ipsum dolor sit amet consectetur ",
            "Lorem ipsum dolor sit amet consectetur ",
        ],
    },
    {
        deterministic: true,
        title: "Raquette de padel",
        subTitle: "60.00 CH",
        img: { src: "/images/header/raquette.png", alt: "", width: 500, height: 400 },
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        btnText: "Commander",
        modalDescription:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis non aspernatur repellendus dolore, veritatis incidunt excepturi labore architecto, hic esse reiciendis ducimus reprehenderit numquam autem illo sequi deserunt nemo aut?",
        modalList: [
            "Lorem ipsum dolor sit amet consectetur",
            "Lorem ipsum dolor sit amet consectetur ",
            "Lorem ipsum dolor sit amet consectetur ",
        ],
    },
];

export default function Page() {
    return (
        <>
            <Hero title="Produits" img={{ src: "/images/produits/hero.png", alt: "banniere" }} />
            <section className="space-y-10 w-full">
                {articles.map(
                    (
                        { btnText, description, img, modalDescription, title, deterministic, subTitle, modalList },
                        index
                    ) => {
                        // présentation de gauche à droite ou de droite à gauche
                        return (
                            <Dialog>
                                <Article
                                    btn={
                                        <DialogTrigger asChild>
                                            <Button>{btnText}</Button>
                                        </DialogTrigger>
                                    }
                                    direction={"rtl"}
                                    key={index}
                                    img={img}
                                    description={description}
                                    title={title}
                                    subTitle={subTitle}>
                                    <DialogContent className="bg-grey text-white overflow-y-scroll">
                                        <DialogDescription key={index} className="text-white text-justify">
                                            <div className="flex items-center justify-between gap-5 h-[250px]">
                                                <img
                                                    src={(img as ImgProps).src}
                                                    alt={(img as ImgProps).alt}
                                                    className="w-5/12"
                                                />
                                                <div className="grow flex flex-col justify-around h-full">
                                                    <div>
                                                        <DialogTitle className="text-secondary font-semibold text-4xl">
                                                            {title}
                                                        </DialogTitle>
                                                        {subTitle && <p className="font-semibold">{subTitle}</p>}
                                                    </div>
                                                    {deterministic && (
                                                        <>
                                                            <div className="flex flex-col w-full max-w-[50%] gap-1">
                                                                <label htmlFor="quantity" className="font-medium">
                                                                    Quantity
                                                                </label>
                                                                <Input
                                                                    type="number"
                                                                    id="quantity"
                                                                    defaultValue="0"
                                                                    min="0"
                                                                    className="bg-black/20 text-white focus:ring-primary border border-white rounded-full w-full max-w-1/2"
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="min-w-full inline-flex items-center">
                                                        <Spacer />
                                                        <Button className="px-12 border">{btnText}</Button>
                                                        <Spacer />
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogTitle className="text-secondary font-semibold text-4xl mt-6 mb-3">
                                                Description
                                            </DialogTitle>
                                            <p className="text-lg mb-2">{description}</p>
                                            <p className="text-lg mb-2">{modalDescription}</p>
                                            {modalList && (
                                                <ul className="list-disc ps-6">
                                                    {modalList.map((content) => {
                                                        return (
                                                            <li>
                                                                <p className="text-lg">{content}</p>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </DialogDescription>
                                    </DialogContent>
                                </Article>
                            </Dialog>
                        );
                    }
                )}
            </section>
            <Split bgImg={{ src: "/images/partenariat/body-split-xl.png", alt: "" }}>
                <div className="flex flex-col items-center text-balance text-center max-w-[40%] gap-10">
                    <h3 className="text-secondary text-6xl font-semibold">Partenariat & Sponsoring</h3>
                    <Button className="border">Contact</Button>
                </div>
                <p className="text-white text-3xl text-balance text-justify max-w-[40%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis magnam beatae deserunt
                    voluptate reprehenderit ea reiciendis laudantium dolorum. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit.
                </p>
            </Split>
            <TestimonyCarousel />
            <CommunFaq />
        </>
    );
}
