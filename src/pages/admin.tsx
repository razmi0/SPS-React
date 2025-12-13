import { useState } from "react";
import clientFetch from "../hooks/client-fetch";

type UserType = {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    company: string | null;
    newsletterOptin: boolean;
    isVerified: boolean;
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string | null;
    roles: string[];
};

type ContactType = {
    id: number;
    user: UserType;
    contactType: string;
    message: string;
    createdAt: string;
};

type ProductType = {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    images: string[];
};

type ArticleType = {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    images: string[];
};

export default function AdminPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [contacts, setContacts] = useState<ContactType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [showSection, setShowSection] = useState<"users" | "contacts" | "products" | "articles" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<{
        users: boolean;
        contacts: boolean;
        products: boolean;
        articles: boolean;
    }>({
        users: false,
        contacts: false,
        products: false,
        articles: false,
    });

    const fetchUsers = async () => {
        setLoading((prev) => ({ ...prev, users: true }));
        setError(null);
        try {
            const response = await clientFetch("/api/user/get-all");
            const json = await response.json();
            if (response.ok) {
                setUsers(json.data || []);
                setShowSection("users");
            } else {
                setError(`Erreur serveur utilisateurs : ${json.message || "Erreur inconnue"}`);
                console.error("Erreur serveur utilisateurs :", json);
            }
        } catch (err) {
            setError("Erreur réseau utilisateurs. Vérifiez que le serveur backend est démarré.");
            console.error("Erreur réseau utilisateurs :", err);
        } finally {
            setLoading((prev) => ({ ...prev, users: false }));
        }
    };

    const fetchContacts = async () => {
        setLoading((prev) => ({ ...prev, contacts: true }));
        setError(null);
        try {
            const response = await clientFetch("/api/contact/get-all");
            const json = await response.json();
            if (response.ok) {
                setContacts(json.data || []);
                setShowSection("contacts");
            } else {
                setError(`Erreur serveur contacts : ${json.message || "Erreur inconnue"}`);
                console.error("Erreur serveur contacts :", json);
            }
        } catch (err) {
            setError("Erreur réseau contacts. Vérifiez que le serveur backend est démarré.");
            console.error("Erreur réseau contacts :", err);
        } finally {
            setLoading((prev) => ({ ...prev, contacts: false }));
        }
    };

    const fetchProducts = async () => {
        setLoading((prev) => ({ ...prev, products: true }));
        setError(null);
        try {
            const response = await clientFetch("/api/product/get-all");
            const json = await response.json();
            if (response.ok) {
                setProducts(json.data || []);
                setShowSection("products");
            } else {
                setError(`Erreur serveur produits : ${json.message || "Erreur inconnue"}`);
                console.error("Erreur serveur produits :", json);
            }
        } catch (err) {
            setError("Erreur réseau produits. Vérifiez que le serveur backend est démarré.");
            console.error("Erreur réseau produits :", err);
        } finally {
            setLoading((prev) => ({ ...prev, products: false }));
        }
    };

    const fetchArticles = async () => {
        setLoading((prev) => ({ ...prev, articles: true }));
        setError(null);
        try {
            const response = await clientFetch("/api/article/get-all");
            const json = await response.json();
            if (response.ok) {
                setArticles(json.data || []);
                setShowSection("articles");
            } else {
                setError(`Erreur serveur articles : ${json.message || "Erreur inconnue"}`);
                console.error("Erreur serveur articles :", json);
            }
        } catch (err) {
            setError("Erreur réseau articles. Vérifiez que le serveur backend est démarré.");
            console.error("Erreur réseau articles :", err);
        } finally {
            setLoading((prev) => ({ ...prev, articles: false }));
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Non renseigné";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Non renseigné" : date.toLocaleDateString();
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl text-secondary mb-8 mt-20">Administration</h1>

            {/* NAVIGATION VERS ANALYTICS ET AUTOMATION RULES */}
            <div className="flex gap-6 mb-10 flex-wrap">
                <a href="/analytics" className="bg-secondary text-white py-2 px-6 rounded-3xl border">
                    Analytics & KPIs
                </a>
                <a href="/automation-rules" className="bg-secondary text-white py-2 px-6 rounded-3xl border">
                    Règles d'automatisation
                </a>
            </div>

            {/* BOUTONS */}
            <div className="flex gap-6 mb-10 flex-wrap">
                <button
                    onClick={fetchUsers}
                    disabled={loading.users}
                    className="bg-dark-secondary text-white py-2 px-6 rounded-3xl border disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading.users ? "Chargement..." : "Voir les utilisateurs"}
                </button>
                <button
                    onClick={fetchContacts}
                    disabled={loading.contacts}
                    className="bg-dark-secondary text-white py-2 px-6 rounded-3xl border disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading.contacts ? "Chargement..." : "Voir les contacts"}
                </button>
                <button
                    onClick={fetchProducts}
                    disabled={loading.products}
                    className="bg-dark-secondary text-white py-2 px-6 rounded-3xl border disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading.products ? "Chargement..." : "Voir les produits"}
                </button>
                <button
                    onClick={fetchArticles}
                    disabled={loading.articles}
                    className="bg-dark-secondary text-white py-2 px-6 rounded-3xl border disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading.articles ? "Chargement..." : "Voir les articles"}
                </button>
            </div>

            {/* MESSAGE D'ERREUR */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            )}

            {/* AFFICHAGE UTILISATEURS */}
            {showSection === "users" && (
                <div className="mb-10">
                    <h2 className="text-2xl text-secondary font-bold mb-4">Utilisateurs ({users.length})</h2>
                    {users.length === 0 ? (
                        <p className="text-grey">Aucun utilisateur trouvé.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-grey text-white">
                                        <th className="p-3 text-left border border-gray-600">Nom</th>
                                        <th className="p-3 text-left border border-gray-600">Email</th>
                                        <th className="p-3 text-left border border-gray-600">Entreprise</th>
                                        <th className="p-3 text-center border border-gray-600">Newsletter</th>
                                        <th className="p-3 text-center border border-gray-600">Vérifié</th>
                                        <th className="p-3 text-center border border-gray-600">Anonyme</th>
                                        <th className="p-3 text-left border border-gray-600">Rôles</th>
                                        <th className="p-3 text-left border border-gray-600">Créé le</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="bg-grey/50 text-white hover:bg-grey/70 transition">
                                            <td className="p-3 border border-gray-600">
                                                {user.lastName} {user.firstName}
                                            </td>
                                            <td className="p-3 border border-gray-600">{user.email}</td>
                                            <td className="p-3 border border-gray-600">{user.company || "—"}</td>
                                            <td className="p-3 text-center border border-gray-600">
                                                {user.newsletterOptin ? (
                                                    <span className="text-green-400">✓</span>
                                                ) : (
                                                    <span className="text-gray-400">✗</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center border border-gray-600">
                                                {user.isVerified ? (
                                                    <span className="text-green-400">✓</span>
                                                ) : (
                                                    <span className="text-gray-400">✗</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center border border-gray-600">
                                                {user.isAnonymous ? (
                                                    <span className="text-yellow-400">✓</span>
                                                ) : (
                                                    <span className="text-gray-400">✗</span>
                                                )}
                                            </td>
                                            <td className="p-3 border border-gray-600">
                                                {user.roles?.length ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map((role, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-dark-secondary px-2 py-1 rounded text-xs">
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                            <td className="p-3 border border-gray-600 text-sm">
                                                {formatDate(user.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* AFFICHAGE CONTACTS */}
            {showSection === "contacts" && (
                <div className="mb-10">
                    <h2 className="text-2xl text-secondary font-bold mb-4">Contacts ({contacts.length})</h2>
                    {contacts.length === 0 ? (
                        <p className="text-grey">Aucun contact trouvé.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {contacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="p-4 rounded-lg bg-grey text-white border border-gray-600 hover:bg-grey/80 transition">
                                    <div className="mb-3 pb-3 border-b border-gray-600">
                                        <p className="font-semibold text-lg">
                                            {contact.user?.lastName} {contact.user?.firstName}
                                        </p>
                                        <p className="text-sm text-gray-300">{contact.user?.email}</p>
                                        {contact.user?.company && (
                                            <p className="text-sm text-gray-400">{contact.user.company}</p>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-xs text-gray-400 uppercase">Type :</span>
                                        <span className="ml-2 bg-dark-secondary px-2 py-1 rounded text-xs">
                                            {contact.contactType || "Non renseigné"}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-400 uppercase mb-1">Message :</p>
                                        <p className="text-sm line-clamp-3">{contact.message}</p>
                                    </div>
                                    <p className="text-xs text-gray-400">{formatDate(contact.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* AFFICHAGE PRODUITS */}
            {showSection === "products" && (
                <div className="mb-10">
                    <h2 className="text-2xl text-secondary font-bold mb-4">Produits ({products.length})</h2>
                    {products.length === 0 ? (
                        <p className="text-grey">Aucun produit trouvé.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-4 rounded-lg bg-grey text-white border border-gray-600 hover:bg-grey/80 transition">
                                    <div className="mb-3 pb-3 border-b border-gray-600">
                                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                        <p className="text-xl font-bold text-secondary">
                                            {(product.price / 100).toFixed(2)} CHF
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-300 line-clamp-3 mb-2">{product.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>{product.images.length} image(s)</span>
                                        <span>{formatDate(product.createdAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* AFFICHAGE ARTICLES */}
            {showSection === "articles" && (
                <div className="mb-10">
                    <h2 className="text-2xl text-secondary font-bold mb-4">Articles ({articles.length})</h2>
                    {articles.length === 0 ? (
                        <p className="text-grey">Aucun article trouvé.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="p-4 rounded-lg bg-grey text-white border border-gray-600 hover:bg-grey/80 transition">
                                    <div className="mb-3 pb-3 border-b border-gray-600">
                                        <h3 className="font-semibold text-lg">{article.title}</h3>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-300 line-clamp-3">{article.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>{article.images.length} image(s)</span>
                                        <span>{formatDate(article.createdAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
