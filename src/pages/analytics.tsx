import { useEffect, useState } from "react";
import { Link } from "react-router";
import clientFetch from "../hooks/client-fetch";

type KPIData = {
    users: {
        totalUsers: number;
        verifiedUsers: number;
        verificationRate: number;
        registrations: number;
        logins: number;
    };
    products: {
        totalProducts: number;
        productsCreated: number;
        productsViewed: number;
        averagePrice: number;
    };
    articles: {
        totalArticles: number;
        articlesCreated: number;
        articlesViewed: number;
    };
    contacts: {
        totalContacts: number;
        contactsSubmitted: number;
        byType: Record<string, number>;
    };
    newsletter: {
        subscribedUsers: number;
        subscriptions: number;
        unsubscriptions: number;
        growthRate: number;
    };
};

export default function AnalyticsPage() {
    const [kpis, setKpis] = useState<KPIData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchKPIs();
    }, []);

    const fetchKPIs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await clientFetch("/api/analytics/kpis");
            const json = await response.json();
            if (response.ok) {
                setKpis(json.data);
            } else {
                setError(`Erreur serveur : ${json.message || "Erreur inconnue"}`);
            }
        } catch (err) {
            setError("Erreur réseau. Vérifiez que le serveur backend est démarré.");
            console.error("Erreur réseau :", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10">
                <h1 className="text-3xl text-secondary mb-8 mt-20">Analytics</h1>
                <p className="text-grey">Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10">
                <h1 className="text-3xl text-secondary mb-8 mt-20">Analytics</h1>
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8 mt-20">
                <h1 className="text-3xl text-secondary">Analytics & KPIs</h1>
                <Link to="/admin" className="bg-dark-secondary text-white py-2 px-6 rounded-3xl border">
                    Retour à l'admin
                </Link>
            </div>

            {kpis && (
                <div className="space-y-8">
                    {/* Users KPIs */}
                    <div className="p-6 rounded-xl bg-grey text-white">
                        <h2 className="text-2xl font-bold mb-4">Utilisateurs</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <p className="text-sm text-gray-300">Total</p>
                                <p className="text-2xl font-bold">{kpis.users.totalUsers}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Vérifiés</p>
                                <p className="text-2xl font-bold">{kpis.users.verifiedUsers}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Taux de vérification</p>
                                <p className="text-2xl font-bold">{kpis.users.verificationRate}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Inscriptions</p>
                                <p className="text-2xl font-bold">{kpis.users.registrations}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Connexions</p>
                                <p className="text-2xl font-bold">{kpis.users.logins}</p>
                            </div>
                        </div>
                    </div>

                    {/* Products KPIs */}
                    <div className="p-6 rounded-xl bg-grey text-white">
                        <h2 className="text-2xl font-bold mb-4">Produits</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-300">Total</p>
                                <p className="text-2xl font-bold">{kpis.products.totalProducts}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Créés</p>
                                <p className="text-2xl font-bold">{kpis.products.productsCreated}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Vues</p>
                                <p className="text-2xl font-bold">{kpis.products.productsViewed}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Prix moyen</p>
                                <p className="text-2xl font-bold">{kpis.products.averagePrice} CHF</p>
                            </div>
                        </div>
                    </div>

                    {/* Articles KPIs */}
                    <div className="p-6 rounded-xl bg-grey text-white">
                        <h2 className="text-2xl font-bold mb-4">Articles</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-300">Total</p>
                                <p className="text-2xl font-bold">{kpis.articles.totalArticles}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Créés</p>
                                <p className="text-2xl font-bold">{kpis.articles.articlesCreated}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Vues</p>
                                <p className="text-2xl font-bold">{kpis.articles.articlesViewed}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contacts KPIs */}
                    <div className="p-6 rounded-xl bg-grey text-white">
                        <h2 className="text-2xl font-bold mb-4">Contacts</h2>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-300">Total</p>
                                <p className="text-2xl font-bold">{kpis.contacts.totalContacts}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Soumis</p>
                                <p className="text-2xl font-bold">{kpis.contacts.contactsSubmitted}</p>
                            </div>
                        </div>
                        {Object.keys(kpis.contacts.byType).length > 0 && (
                            <div>
                                <p className="text-sm text-gray-300 mb-2">Par type :</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(kpis.contacts.byType).map(([type, count]) => (
                                        <span key={type} className="bg-dark-secondary px-3 py-1 rounded">
                                            {type}: {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Newsletter KPIs */}
                    <div className="p-6 rounded-xl bg-grey text-white">
                        <h2 className="text-2xl font-bold mb-4">Newsletter</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-gray-300">Abonnés</p>
                                <p className="text-2xl font-bold">{kpis.newsletter.subscribedUsers}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Abonnements</p>
                                <p className="text-2xl font-bold">{kpis.newsletter.subscriptions}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Désabonnements</p>
                                <p className="text-2xl font-bold">{kpis.newsletter.unsubscriptions}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Taux de croissance</p>
                                <p className="text-2xl font-bold">{kpis.newsletter.growthRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
