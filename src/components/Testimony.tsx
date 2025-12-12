import { CalendarIcon, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

type Testimonial = {
    name: string;
    img: string;
    post: {
        rating: number;
        title: string;
        description: string;
        date: string;
    };
};

const testimonials: Testimonial[] = [
    {
        name: "John Doe",

        img: "https://randomuser.me/api/portraits/men/1.jpg",
        post: {
            rating: 5,
            title: "Excellent Service!",
            description: "The team provided outstanding support and delivered beyond expectations. Highly recommend!",
            date: "2024-02-09",
        },
    },
    {
        name: "Jane Smith",

        img: "https://randomuser.me/api/portraits/women/2.jpg",
        post: {
            rating: 4,
            title: "Great Experience",
            description:
                "The product was well-built and met most of my requirements. Will definitely work with them again.",
            date: "2024-01-25",
        },
    },
    {
        name: "Michael Brown",

        img: "https://randomuser.me/api/portraits/men/3.jpg",
        post: {
            rating: 5,
            title: "Outstanding Quality",
            description:
                "Every detail was carefully crafted, and the project was delivered ahead of schedule. Amazing work!",
            date: "2023-12-15",
        },
    },
    {
        name: "Emily White",

        img: "https://randomuser.me/api/portraits/women/4.jpg",
        post: {
            rating: 3,
            title: "Good, but room for improvement",
            description:
                "The service was satisfactory, but a few issues needed to be addressed. Overall, a decent experience.",
            date: "2023-11-30",
        },
    },
    {
        name: "David Lee",

        img: "https://randomuser.me/api/portraits/men/5.jpg",
        post: {
            rating: 5,
            title: "Highly Professional",
            description:
                "The team was extremely professional and responsive. The final result exceeded my expectations.",
            date: "2023-10-20",
        },
    },
    {
        name: "Sophia Martinez",

        img: "https://randomuser.me/api/portraits/women/6.jpg",
        post: {
            rating: 4,
            title: "Very Satisfied",
            description:
                "The process was smooth, and the final product was impressive. A few minor tweaks, but overall excellent!",
            date: "2023-09-18",
        },
    },
];

function TestimonyCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <Card className="h-[220px] max-w-[360px] w-fit flex flex-col bg-grey text-white overflow-auto">
            <CardContent className="flex flex-col items-start p-4 h-full justify-between gap-2">
                <div className="inline-flex w-full">
                    {Array.from({ length: testimonial.post.rating }).map(() => {
                        return <Star fill="#d6ad3a" className="text-secondary" />;
                    })}
                </div>
                <div className="flex flex-col">
                    <p className="text-lg text-muted-foreground font-semibold text-pretty">{testimonial.post.title}</p>

                    <p className="text-sm text-left grow font-medium text-pretty">
                        {testimonial.post.description}
                    </p>
                </div>
                <div className="flex items-center w-full gap-5">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.img} alt={testimonial.name} />
                        <AvatarFallback>
                            {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-md font-semibold">{testimonial.name}</h3>
                        <div className="flex items-center text-stone-200">
                            <CalendarIcon className="w-4 h-4 mr-1 " />
                            {new Date(testimonial.post.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TestimonyCarousel() {
    return (
        <div className="w-full max-w-5xl mx-auto py-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-secondary">Ce que nos clients pensent de nous :</h2>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full">
                <CarouselContent>
                    {testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial.name} className="md:basis-1/2 lg:basis-1/3">
                            <TestimonyCard testimonial={testimonial} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
