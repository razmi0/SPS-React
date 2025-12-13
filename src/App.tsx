//@ts-check
import { BrowserRouter, Route, Routes } from "react-router";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Layout from "./layout.tsx";
import NotFoundPage from "./pages/404.tsx";
import Admin from "./pages/admin.tsx";
import Analytics from "./pages/analytics.tsx";
import AutomationRules from "./pages/automation-rules.tsx";
import Contact from "./pages/contact.tsx";
import Accueil from "./pages/index.tsx";
import Infrastructure from "./pages/infrastructure.tsx";
import Nous from "./pages/nous.tsx";
import Partenariat from "./pages/partenariat.tsx";
import Produits from "./pages/produits.tsx";
import Profile from "./pages/profile.tsx";
import "./styles/app.css";

type AppLink = {
    label: string;
    href: string;
    Page: () => React.JSX.Element;
    available: boolean;
    navbar: boolean;
};

const links: AppLink[] = [
    {
        label: "Accueil",
        href: "/", // chemin du routeur client
        Page: Accueil, // rendu
        available: true,
        navbar: true, // affiché dans la navbar
    },
    {
        label: "Qui sommes-nous",
        href: "nous",
        Page: Nous,
        available: true,
        navbar: true,
    },
    {
        label: "Contact",
        href: "contact",
        Page: Contact,
        available: true,
        navbar: false,
    },
    {
        label: "Infrastructure",
        href: "infrastructure",
        Page: Infrastructure,
        available: true,
        navbar: true,
    },
    {
        label: "Partenariat et sponsoring",
        href: "partenariat",
        Page: Partenariat,
        available: true,
        navbar: true,
    },
    {
        label: "Produits",
        href: "produits",
        Page: Produits,
        available: false,
        navbar: true,
    },
    {
        label: "Profil",
        href: "profil",
        Page: Profile,
        available: true,
        navbar: false,
    },
    {
        label: "Admin",
        href: "admin",
        Page: Admin,
        available: true,
        navbar: false,
    },
    {
        label: "Analytics",
        href: "analytics",
        Page: Analytics,
        available: true,
        navbar: false,
    },
    {
        label: "Automation Rules",
        href: "automation-rules",
        Page: AutomationRules,
        available: true,
        navbar: false,
    },
];

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<Layout links={links} />}>
                    {links.map(({ Page, href, label, available }) =>
                        available ? <Route key={label} path={href} element={<Page />} /> : null
                    )}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
