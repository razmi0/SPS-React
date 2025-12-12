import { NavLink } from "react-router";
import { cn } from "../utils";

export default function Logo({ className }: { className?: string }) {
    return (
        <NavLink to="/" aria-label="go to main page" className={cn(className)}>
            <img src={"/images/logo.png"} alt="Swiss Padel Stars logo" className={"h-12 md:h-16"} />
        </NavLink>
    );
}
