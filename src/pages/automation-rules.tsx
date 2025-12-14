import { useEffect, useState } from "react";
import { Link } from "react-router";
import clientFetch from "../hooks/client-fetch";

type AutomationRule = {
    id: number;
    name: string;
    description: string | null;
    ruleType: string;
    triggerEventType: string | null;
    schedule: unknown;
    conditions: unknown[];
    actions: unknown[];
    isActive: boolean;
    priority: number;
    lastExecutedAt: string | null;
    createdAt: string;
    updatedAt: string | null;
};

export default function AutomationRulesPage() {
    const [rules, setRules] = useState<AutomationRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await clientFetch("/api/automation-rule/get-all");
            const json = await response.json();
            if (response.ok) {
                setRules(json.data || []);
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

    const toggleRule = async (id: number) => {
        try {
            const response = await clientFetch(`/api/automation-rule/${id}/toggle`, {
                method: "POST",
            });
            const json = await response.json();
            if (response.ok) {
                await fetchRules(); // Refresh list
            } else {
                alert(`Erreur : ${json.message || "Erreur inconnue"}`);
            }
        } catch (err) {
            alert("Erreur lors de la modification de la règle");
            console.error("Erreur :", err);
        }
    };

    if (loading) {
        return (
            <div className="p-10">
                <h1 className="text-3xl text-secondary mb-8 mt-20">Règles d'automatisation</h1>
                <p className="text-grey">Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10">
                <h1 className="text-3xl text-secondary mb-8 mt-20">Règles d'automatisation</h1>
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8 mt-20">
                <h1 className="text-3xl text-secondary">Règles d'automatisation</h1>
                <Link to="/admin" className="btn-pill">
                    Retour à l'admin
                </Link>
            </div>

            {rules.length === 0 ? (
                <p className="text-grey">Aucune règle d'automatisation trouvée.</p>
            ) : (
                <div className="space-y-4">
                    {rules.map((rule) => (
                        <div key={rule.id} className={`card text-white ${rule.isActive ? "bg-grey" : "bg-gray-600"}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{rule.name}</h3>
                                    {rule.description && (
                                        <p className="text-sm text-gray-100 mb-2">{rule.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded text-sm ${
                                            rule.isActive ? "bg-green-600 text-white" : "bg-gray-500 text-gray-200"
                                        }`}>
                                        {rule.isActive ? "Actif" : "Inactif"}
                                    </span>
                                    <button onClick={() => toggleRule(rule.id)} className="btn-pill text-sm py-1 px-4">
                                        {rule.isActive ? "Désactiver" : "Activer"}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-100">Type</p>
                                    <p className="font-semibold text-white">
                                        {rule.ruleType === "EVENT_TRIGGERED"
                                            ? "Déclenché par événement"
                                            : "Basé sur le temps"}
                                    </p>
                                </div>
                                {rule.triggerEventType && (
                                    <div>
                                        <p className="text-gray-100">Événement déclencheur</p>
                                        <p className="font-semibold text-white">{rule.triggerEventType}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-gray-100">Priorité</p>
                                    <p className="font-semibold text-white">{rule.priority}</p>
                                </div>
                                {rule.lastExecutedAt && (
                                    <div>
                                        <p className="text-gray-100">Dernière exécution</p>
                                        <p className="font-semibold text-white">
                                            {new Date(rule.lastExecutedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {rule.conditions && rule.conditions.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-100 mb-1">Conditions :</p>
                                    <div className="bg-dark-secondary p-2 rounded text-xs">
                                        <pre className="text-white">{JSON.stringify(rule.conditions, null, 2)}</pre>
                                    </div>
                                </div>
                            )}

                            {rule.actions && rule.actions.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-100 mb-1">Actions :</p>
                                    <div className="bg-dark-secondary p-2 rounded text-xs">
                                        <pre className="text-white">{JSON.stringify(rule.actions, null, 2)}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
