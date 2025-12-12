import React, { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { useAuth } from "../hooks/auth-context";
import clientFetch from "../hooks/client-fetch";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    images: string[];
};

type Article = {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt?: string;
    images: string[];
};

type Contact = {
    id: number;
    contactType: string;
    message: string;
    createdAt: string;
};

type Event = {
    id: number;
    eventType: string;
    entityType: string;
    entityId: number | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
};

type ProfileData = {
    products: Product[];
    articles: Article[];
    contacts: Contact[];
    events: Event[];
};

type ActiveTab = "profile" | "products" | "articles" | "contacts" | "timeline";

export default function Page() {
    const { user, updateUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
    const [formData, setFormData] = useState({
        email: user?.email || "",
        lastName: user?.lastName || "",
        firstName: user?.firstName || "",
        company: user?.company || "",
        newsletterOptin: user?.newsletterOptin || false,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loadingData, setLoadingData] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        type: "product" | "article" | "contact" | "account" | null;
        id: number | null;
        name: string;
    }>({ open: false, type: null, id: null, name: "" });
    const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
    const [deleteAccountError, setDeleteAccountError] = useState("");
    const [deletingAccount, setDeletingAccount] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || "",
                lastName: user.lastName || "",
                firstName: user.firstName || "",
                company: user.company || "",
                newsletterOptin: user.newsletterOptin || false,
            });
            fetchProfileData();
        }
    }, [user]);

    const fetchProfileData = async () => {
        setLoadingData(true);
        try {
            const response = await clientFetch("/api/user/profile-data");
            if (response.ok) {
                const json = await response.json();
                setProfileData(json.data);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoadingData(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-32 p-8 text-center">
                <h1 className="text-2xl font-bold mb-4 text-primary">Chargement du profil...</h1>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage("");

        try {
            const response = await clientFetch("/api/user/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const json = await response.json();

            if (!response.ok) {
                setErrors(json.errors || {});
            } else {
                setSuccessMessage(json.message || "Profil mis à jour avec succès !");
                if (json.data) {
                    updateUser(json.data);
                }
            }
        } catch (error) {
            alert("Erreur de communication avec le serveur");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.type) return;

        // Handle account deletion separately (requires password)
        if (deleteDialog.type === "account") {
            if (!deleteAccountPassword) {
                setDeleteAccountError("Veuillez entrer votre mot de passe");
                return;
            }

            setDeletingAccount(true);
            setDeleteAccountError("");

            try {
                const response = await clientFetch("/api/user/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password: deleteAccountPassword }),
                });

                if (response.ok) {
                    // Logout and redirect to home
                    await logout();
                    window.location.href = "/";
                } else {
                    const json = await response.json();
                    setDeleteAccountError(json.errors?.password || json.message || "Erreur lors de la suppression");
                }
            } catch (error) {
                setDeleteAccountError("Erreur de communication avec le serveur");
            } finally {
                setDeletingAccount(false);
            }
            return;
        }

        // Handle other deletions (product, article, contact)
        if (!deleteDialog.id) return;

        const endpoints = {
            product: `/api/user/delete-product/${deleteDialog.id}`,
            article: `/api/user/delete-article/${deleteDialog.id}`,
            contact: `/api/user/delete-contact/${deleteDialog.id}`,
        };

        try {
            const response = await clientFetch(endpoints[deleteDialog.type], {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchProfileData();
                setDeleteDialog({ open: false, type: null, id: null, name: "" });
            } else {
                const json = await response.json();
                alert(json.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            alert("Erreur de communication avec le serveur");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getEventLabel = (event: Event) => {
        const labels: Record<string, string> = {
            user_registered: "Inscription",
            user_logged_in: "Connexion",
            user_updated: "Profil mis à jour",
            product_created: "Produit créé",
            product_viewed: "Produit consulté",
            article_created: "Article créé",
            article_viewed: "Article consulté",
            contact_submitted: "Contact soumis",
            newsletter_subscribed: "Abonnement newsletter",
        };
        return labels[event.eventType] || event.eventType;
    };

    return (
        <div className="pt-32 p-8 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-primary">Votre profil</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-300">
                    {(["profile", "products", "articles", "contacts", "timeline"] as ActiveTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 px-4 font-semibold transition ${
                                activeTab === tab
                                    ? "border-b-2 border-secondary text-secondary"
                                    : "text-gray-600 hover:text-primary"
                            }`}>
                            {tab === "profile"
                                ? "Profil"
                                : tab === "products"
                                ? "Produits"
                                : tab === "articles"
                                ? "Articles"
                                : tab === "contacts"
                                ? "Contacts"
                                : "Timeline"}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="bg-primary rounded-lg shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                            <div className="bg-white text-primary rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
                                {(user.firstName?.[0] || "?") + (user.lastName?.[0] || "")}
                            </div>

                            <div className="flex flex-col gap-4 w-full max-w-md">
                                <FormField
                                    label="Nom"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                                    error={errors.lastName}
                                />
                                <FormField
                                    label="Prénom"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                                    error={errors.firstName}
                                />
                                <FormField
                                    label="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    error={errors.email}
                                />
                                {user.isVerified && (
                                    <p className="text-xs text-gray-500">
                                        Modifier votre email annulera la vérification de votre compte.
                                    </p>
                                )}
                                <FormField
                                    label="Entreprise"
                                    value={formData.company || ""}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                    error={errors.company}
                                />
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-500">
                                        S'abonner à la newsletter :
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="newsletterOptin"
                                                value="true"
                                                className="cursor-pointer"
                                                checked={formData.newsletterOptin === true}
                                                onChange={() =>
                                                    setFormData((prev) => ({ ...prev, newsletterOptin: true }))
                                                }
                                            />
                                            Oui
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="newsletterOptin"
                                                value="false"
                                                className="cursor-pointer"
                                                checked={formData.newsletterOptin === false}
                                                onChange={() =>
                                                    setFormData((prev) => ({ ...prev, newsletterOptin: false }))
                                                }
                                            />
                                            Non
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="bg-dark-secondary text-white" disabled={loading}>
                                {loading ? "Mise à jour..." : "Mettre à jour"}
                            </Button>

                            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                            {/* Danger Zone */}
                            <div className="w-full max-w-md mt-8 pt-8 border-t border-gray-300">
                                <h3 className="text-lg font-semibold text-red-600 mb-4">Zone de danger</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    La suppression de votre compte est définitive. Toutes vos données seront supprimées.
                                </p>
                                <Button
                                    type="button"
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() =>
                                        setDeleteDialog({
                                            open: true,
                                            type: "account",
                                            id: null,
                                            name: "votre compte",
                                        })
                                    }>
                                    Supprimer mon compte
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">
                            Mes Produits ({profileData?.products.length || 0})
                        </h2>
                        {loadingData ? (
                            <p className="text-grey">Chargement...</p>
                        ) : profileData?.products.length === 0 ? (
                            <p className="text-grey">Aucun produit créé.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {profileData?.products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="p-4 rounded-lg bg-grey text-white border border-gray-600">
                                        <div className="mb-3 pb-3 border-b border-gray-600">
                                            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                            <p className="text-xl font-bold text-secondary">
                                                {(product.price / 100).toFixed(2)} CHF
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-3 mb-3">{product.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                            <span>{product.images.length} image(s)</span>
                                            <span>{formatDate(product.createdAt)}</span>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                setDeleteDialog({
                                                    open: true,
                                                    type: "product",
                                                    id: product.id,
                                                    name: product.name,
                                                })
                                            }>
                                            Supprimer
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Articles Tab */}
                {activeTab === "articles" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">
                            Mes Articles ({profileData?.articles.length || 0})
                        </h2>
                        {loadingData ? (
                            <p className="text-grey">Chargement...</p>
                        ) : profileData?.articles.length === 0 ? (
                            <p className="text-grey">Aucun article créé.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {profileData?.articles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="p-4 rounded-lg bg-grey text-white border border-gray-600">
                                        <div className="mb-3 pb-3 border-b border-gray-600">
                                            <h3 className="font-semibold text-lg">{article.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-3 mb-3">{article.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                            <span>{article.images.length} image(s)</span>
                                            <span>{formatDate(article.createdAt)}</span>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                setDeleteDialog({
                                                    open: true,
                                                    type: "article",
                                                    id: article.id,
                                                    name: article.title,
                                                })
                                            }>
                                            Supprimer
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Contacts Tab */}
                {activeTab === "contacts" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">
                            Mes Contacts ({profileData?.contacts.length || 0})
                        </h2>
                        {loadingData ? (
                            <p className="text-grey">Chargement...</p>
                        ) : profileData?.contacts.length === 0 ? (
                            <p className="text-grey">Aucun contact soumis.</p>
                        ) : (
                            <div className="space-y-4">
                                {profileData?.contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className="p-4 rounded-lg bg-grey text-white border border-gray-600">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="bg-dark-secondary px-3 py-1 rounded text-sm">
                                                {contact.contactType}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(contact.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-3">{contact.message}</p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                setDeleteDialog({
                                                    open: true,
                                                    type: "contact",
                                                    id: contact.id,
                                                    name: `Contact ${contact.contactType}`,
                                                })
                                            }>
                                            Supprimer
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Timeline Tab */}
                {activeTab === "timeline" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-secondary">
                            Timeline des événements ({profileData?.events.length || 0})
                        </h2>
                        {loadingData ? (
                            <p className="text-grey">Chargement...</p>
                        ) : profileData?.events.length === 0 ? (
                            <p className="text-grey">Aucun événement enregistré.</p>
                        ) : (
                            <div className="space-y-4">
                                {profileData?.events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-4 rounded-lg bg-grey text-white border border-gray-600 flex items-start gap-4">
                                        <div className="shrink-0 w-2 h-2 rounded-full bg-secondary mt-2"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold">{getEventLabel(event)}</h3>
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(event.createdAt)}
                                                </span>
                                            </div>
                                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                                                <div className="text-sm text-gray-300">
                                                    {Object.entries(event.metadata).map(([key, value]) => (
                                                        <div key={key}>
                                                            <strong>{key}:</strong> {String(value)}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialog.open}
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeleteDialog({ open: false, type: null, id: null, name: "" });
                            setDeleteAccountPassword("");
                            setDeleteAccountError("");
                        }
                    }}>
                    <DialogContent
                        className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                            deleteDialog.type === "account" ? "border-red-500" : "border-gray-300"
                        }`}>
                        <DialogHeader>
                            <DialogTitle
                                className={`text-xl font-bold ${
                                    deleteDialog.type === "account"
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-900 dark:text-white"
                                }`}>
                                {deleteDialog.type === "account"
                                    ? "⚠️ Supprimer votre compte"
                                    : "Confirmer la suppression"}
                            </DialogTitle>
                            <DialogDescription className="text-gray-700 dark:text-gray-300 mt-2">
                                {deleteDialog.type === "account" ? (
                                    <div className="space-y-3">
                                        <p>
                                            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
                                            <strong className="text-red-600 dark:text-red-400"> irréversible</strong> et
                                            toutes vos données seront définitivement supprimées.
                                        </p>
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                            <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                                                Ce qui sera supprimé :
                                            </p>
                                            <ul className="text-sm text-red-700 dark:text-red-400 list-disc list-inside space-y-1">
                                                <li>Votre profil et toutes vos informations personnelles</li>
                                                <li>Tous vos produits créés</li>
                                                <li>Tous vos articles créés</li>
                                                <li>Tous vos messages de contact</li>
                                                <li>Votre historique d'activité</li>
                                            </ul>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Pour confirmer, veuillez entrer votre mot de passe :
                                        </p>
                                    </div>
                                ) : (
                                    <p>
                                        Êtes-vous sûr de vouloir supprimer <strong>"{deleteDialog.name}"</strong> ?
                                        Cette action est irréversible.
                                    </p>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        {deleteDialog.type === "account" && (
                            <div className="py-4">
                                <label
                                    htmlFor="delete-password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mot de passe
                                </label>
                                <Input
                                    type="password"
                                    value={deleteAccountPassword}
                                    onChange={(e) => {
                                        setDeleteAccountPassword(e.target.value);
                                        setDeleteAccountError("");
                                    }}
                                    placeholder="Entrez votre mot de passe"
                                    htmlFor="delete-password"
                                    name="delete-password"
                                />
                                {deleteAccountError && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-medium">
                                        {deleteAccountError}
                                    </p>
                                )}
                            </div>
                        )}
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                className="border-gray-300 dark:border-gray-600"
                                onClick={() => {
                                    setDeleteDialog({ open: false, type: null, id: null, name: "" });
                                    setDeleteAccountPassword("");
                                    setDeleteAccountError("");
                                }}
                                disabled={deletingAccount}>
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDelete}
                                disabled={
                                    deletingAccount || (deleteDialog.type === "account" && !deleteAccountPassword)
                                }>
                                {deletingAccount
                                    ? "Suppression..."
                                    : deleteDialog.type === "account"
                                    ? "Supprimer mon compte"
                                    : "Supprimer"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

const FormField = ({
    label,
    value,
    onChange,
    error,
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-500">{label} :</label>
        <Input
            type="text"
            value={value}
            onChange={onChange}
            name={label.toLowerCase()}
            htmlFor={label.toLowerCase()}
            placeholder={label}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
);
