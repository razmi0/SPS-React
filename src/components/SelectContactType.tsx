import { useEffect, useState } from "react";
import { Select as RadixSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import clientFetch from "../hooks/client-fetch";

type ContactType = {
    id: number;
    type: string;
};

// On ajoute value et onChange en props
interface SelectContactTypeProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SelectContactType({ value, onChange }: SelectContactTypeProps) {
    const [contactTypes, setContactTypes] = useState<ContactType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactTypes = async () => {
            try {
                const res = await clientFetch("/api/contact/types");
                const json = await res.json();

                if (res.ok) {
                    setContactTypes(json.data || []);
                } else {
                    console.error("Erreur lors de la récupération des types :", json.message);
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContactTypes();
    }, []);

    if (loading) {
        return (
            <div className="w-[225px] rounded-full bg-grey text-white border-none p-2 text-center">Chargement...</div>
        );
    }

    return (
        <RadixSelect value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[225px] rounded-full bg-grey text-white border-none">
                <SelectValue placeholder="Veuillez sélectionner" />
            </SelectTrigger>
            <SelectContent className="bg-grey text-white">
                {contactTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)} className="hover:bg-stone-400 rounded-lg">
                        {type.type}
                    </SelectItem>
                ))}
            </SelectContent>
        </RadixSelect>
    );
}
