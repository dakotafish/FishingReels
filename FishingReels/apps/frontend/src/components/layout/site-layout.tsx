import { Outlet, useLocation, useNavigate } from "react-router"

import { Header } from "./header"
import { Footer } from "./footer"

// Maps the Header/Footer nav keys to routes. Sections that aren't built yet
// (tournaments, expos, about, sign-in) fall back to home for now.
const ROUTES: Record<string, string> = {
  home: "/",
  anglers: "/anglers",
  search: "/anglers",
  tournaments: "/",
  expos: "/",
  about: "/",
  live: "/streams",
  signin: "/",
}

function SiteLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/anglers")
        ? "anglers"
        : pathname.startsWith("/streams")
          ? "live"
          : ""

  const onNav = (key: string) => navigate(ROUTES[key] ?? "/")

  return (
    <div className="flex min-h-screen flex-col">
      <Header active={active} onNav={onNav} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer onNav={onNav} />
    </div>
  )
}

export { SiteLayout }
