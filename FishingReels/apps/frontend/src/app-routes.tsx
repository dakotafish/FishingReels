import { Route, Routes } from "react-router"

import { SiteLayout } from "@/components/layout/site-layout"
import { HomePage } from "@/pages/home"
import { AnglersPage } from "@/pages/anglers"
import { AnglerProfilePage } from "@/pages/angler-profile"

// Route tree, kept separate from the BrowserRouter in App so tests can mount it
// inside a MemoryRouter.
function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/anglers" element={<AnglersPage />} />
        <Route path="/anglers/:slug" element={<AnglerProfilePage />} />
      </Route>
    </Routes>
  )
}

export { AppRoutes }
