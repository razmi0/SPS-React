import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./hooks/auth-context";
import type { NavLink } from "./types";
//

/**
 * Layout contient le Header et le Footer.
 * Outlet est le lieu de rendu des composants enfants qui sont des Page
 *
 * ```tsx
 *
 * <>
 *   <Header links={links} />
 *   <main className="relative w-screen flex flex-col min-h-screen">
 *      <Outlet />
 *   </main>
 *   <Footer />
 * </>
 *
 * ```
 */
export default function Layout({ links }: { links: NavLink[] }) {
    return (
        <>
            <AuthProvider>
                <Header links={links} />
                <main className="relative w-screen flex flex-col min-h-screen overflow-x-hidden grow bg-dark-primary space-y-10">
                    <Outlet />
                </main>
                <Footer />
            </AuthProvider>
        </>
    );
}
