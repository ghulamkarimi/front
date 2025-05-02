import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

const cards = [
    {
        title: "Fahrzeuge An- & Verkaufen",
        imageUrl: "/deal.webp",
        url: "/fahrzeugkaufen",
        description: "Erleben Sie eine stressfreie Möglichkeit, Ihr Fahrzeug zu verkaufen oder zu kaufen. Unsere Plattform verbindet Käufer und Verkäufer einfach und effizient."
    },
    {
        title: "Fahrzeuge mieten",
        imageUrl: "/rent.webp",
        url: "/fahrzeugvermietung",
        description: "Nutzen Sie unsere flexible Autovermietung, um das perfekte Fahrzeug für Ihre Bedürfnisse zu finden. Ideal für Reisen, Events oder alltägliche Fahrten."
    },
    {
        title: "Aufbreitung",
        imageUrl: "/werkzeug.jpeg",
        url: "/werkstatt-service",
        description: "Verleihen Sie Ihrem Fahrzeug neuen Glanz mit unserem professionellen Aufbereitungsservice. Wir kümmern uns um die Reinigung, Pflege und Aufbereitung Ihres Fahrzeugs."
    },
]


const HeroCards = () => {
    return (
        <div className="px-6 pt-32 flex flex-wrap justify-center gap-10">
            {cards.map((card, index) => (
                <Card key={index} className="bg-white w-96">
                    <CardHeader>
                        <img src={card.imageUrl} alt="deal" />
                    </CardHeader>
                    <CardContent>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription className="font-ANTON">
                            {card.description}
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Link
                            href={card.url}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md">
                            Mehr erfahren
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>

    );
}

export default HeroCards;