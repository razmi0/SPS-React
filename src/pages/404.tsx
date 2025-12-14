import { Link } from "react-router";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
            <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
            <h2 className="text-3xl text-white mb-6">Page non trouvée</h2>
            <p className="text-grey text-center mb-8 max-w-md">
                La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link to="/" className="btn-pill-secondary py-3 px-8">
                Retour à l'accueil
            </Link>
        </div>
    );
}
