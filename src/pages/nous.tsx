import { useEffect, useState } from "react";
import CommunFaq from "../components/CommunFaq";
import { Hero } from "../components/Hero";
import Split from "../components/Split";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import clientFetch from "../hooks/client-fetch";

interface ArticleData {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    images: string[];
}

const splitImgs = {
    sm: { src: "/images/nous/body-split-sm.png", alt: "" },
    bg: { src: "/images/nous/body-split-xl.png", alt: "" },
};

export default function Page() {
    const [articles, setArticles] = useState<ArticleData[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await clientFetch("/api/article/get-all");
                const json = await response.json();
                if (response.ok) {
                    setArticles(json.data || []);
                } else {
                    console.error("Erreur API :", json.message);
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <>
            <Hero title="Qui sommes-nous" img={{ src: "/images/nous/hero.png", alt: "banniere" }} />

            <section className="space-y-10 w-full">
                {/* Tu peux garder tes anciens articles "fixes" ici si tu veux */}
            </section>

            <Split smImg={splitImgs.sm} bgImg={splitImgs.bg} direction="ltr">
                <p className="text-white text-3xl text-balance text-justify max-w-[40%]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore perspiciatis magnam beatae deserunt
                    voluptate reprehenderit ea reiciendis laudantium dolorum. Lorem ipsum, dolor sit amet consectetur
                    adipisicing elit.
                </p>
            </Split>

            <section className="flex flex-col items-center justify-center gap-10">
                <h3 className="text-3xl text-secondary font-semibold">Événements Blog</h3>

                <Carousel opts={{ align: "start", loop: true, startIndex: 1 }} className="max-w-5xl">
                    <CarouselContent>
                        {[1, 2].map((loop) =>
                            articles.map((article) => (
                                <CarouselItem
                                    key={`${loop}-${article.id}`}
                                    className="basis-1/3 flex flex-col items-center justify-center gap-5">
                                    <img src={`/${article.images[0]}`} alt={article.title} width={325} />
                                    <Dialog>
                                        <DialogTrigger className="text-white text-3xl hover:underline">
                                            {article.title}
                                        </DialogTrigger>
                                        <DialogContent className="bg-grey text-white overflow-y-scroll">
                                            <div className="flex flex-col items-center justify-center gap-5">
                                                <img
                                                    src={`/${article.images[0]}`}
                                                    alt={article.title}
                                                    className="w-8/12"
                                                />
                                                <DialogTitle className="text-secondary text-2xl">
                                                    {article.title}
                                                </DialogTitle>
                                                <DialogDescription className="text-white text-justify">
                                                    {article.description}
                                                </DialogDescription>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CarouselItem>
                            ))
                        )}
                    </CarouselContent>
                    <CarouselPrevious className="translate-x-full -translate-y-full" />
                    <CarouselNext className="-translate-x-full -translate-y-full" />
                </Carousel>
            </section>

            <CommunFaq />
        </>
    );
}
