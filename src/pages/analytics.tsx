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
                <Link to="/admin" className="btn-pill">
                    Retour à l'admin
                </Link>
            </div>

            {kpis && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {/* Users KPIs */}
                    <div className="card-lg">
                        <h2 className="text-xl font-bold mb-3">Utilisateurs</h2>
                        <div className="data-grid">
                            <div className="data-pair">
                                <span className="data-pair-label">Total:</span>
                                <span className="data-pair-value">{kpis.users.totalUsers}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Vérifiés:</span>
                                <span className="data-pair-value">{kpis.users.verifiedUsers}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Taux de vérification:</span>
                                <span className="data-pair-value">{kpis.users.verificationRate}%</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Inscriptions:</span>
                                <span className="data-pair-value">{kpis.users.registrations}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Connexions:</span>
                                <span className="data-pair-value">{kpis.users.logins}</span>
                            </div>
                        </div>
                    </div>

                    {/* Products KPIs */}
                    <div className="card-lg">
                        <h2 className="text-2xl font-bold mb-4">Produits</h2>
                        <div className="data-grid">
                            <div className="data-pair">
                                <span className="data-pair-label">Total:</span>
                                <span className="data-pair-value">{kpis.products.totalProducts}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Créés:</span>
                                <span className="data-pair-value">{kpis.products.productsCreated}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Vues:</span>
                                <span className="data-pair-value">{kpis.products.productsViewed}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Prix moyen:</span>
                                <span className="data-pair-value">{kpis.products.averagePrice} CHF</span>
                            </div>
                        </div>
                    </div>

                    {/* Articles KPIs */}
                    <div className="card-lg">
                        <h2 className="text-2xl font-bold mb-4">Articles</h2>
                        <div className="data-grid">
                            <div className="data-pair">
                                <span className="data-pair-label">Total:</span>
                                <span className="data-pair-value">{kpis.articles.totalArticles}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Créés:</span>
                                <span className="data-pair-value">{kpis.articles.articlesCreated}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Vues:</span>
                                <span className="data-pair-value">{kpis.articles.articlesViewed}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contacts KPIs */}
                    <div className="card-lg">
                        <h2 className="text-2xl font-bold mb-4">Contacts</h2>
                        <div className="data-grid mb-4">
                            <div className="data-pair">
                                <span className="data-pair-label">Total:</span>
                                <span className="data-pair-value">{kpis.contacts.totalContacts}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Soumis:</span>
                                <span className="data-pair-value">{kpis.contacts.contactsSubmitted}</span>
                            </div>
                        </div>
                        {Object.keys(kpis.contacts.byType).length > 0 && (
                            <div>
                                <p className="text-xs text-gray-200 mb-2">Par type :</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(kpis.contacts.byType).map(([type, count]) => (
                                        <span
                                            key={type}
                                            className="bg-dark-secondary px-3 py-1 rounded text-xs text-white">
                                            {type}: {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Newsletter KPIs */}
                    <div className="card-lg">
                        <h2 className="text-2xl font-bold mb-4">Newsletter</h2>
                        <div className="data-grid">
                            <div className="data-pair">
                                <span className="data-pair-label">Abonnés:</span>
                                <span className="data-pair-value">{kpis.newsletter.subscribedUsers}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Abonnements:</span>
                                <span className="data-pair-value">{kpis.newsletter.subscriptions}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Désabonnements:</span>
                                <span className="data-pair-value">{kpis.newsletter.unsubscriptions}</span>
                            </div>
                            <div className="data-pair">
                                <span className="data-pair-label">Taux de croissance:</span>
                                <span className="data-pair-value">{kpis.newsletter.growthRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
