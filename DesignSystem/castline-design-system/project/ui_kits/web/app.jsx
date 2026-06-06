// Castline UI Kit — app shell & router
const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [screen, setScreen] = useStateApp("home");
  const [anglerId, setAnglerId] = useStateApp(window.ANGLERS[0].id);

  // re-render Lucide icons after every commit
  useEffectApp(() => { if (window.lucide) window.lucide.createIcons(); });

  const nav = (key) => {
    if (key === "tournaments") key = "live";
    if (["expos", "about", "signin"].includes(key)) key = "home";
    setScreen(key);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  const openAngler = (id) => {
    setAnglerId(id);
    setScreen("profile");
    window.scrollTo({ top: 0 });
  };

  // active nav highlight
  const active = screen === "profile" ? "anglers" : (screen === "live" ? "tournaments" : screen);

  return (
    <div className="app">
      <Header active={active} onNav={nav} />
      {screen === "home" && <HomeScreen onNav={nav} onOpenAngler={openAngler} />}
      {screen === "anglers" && <AnglersScreen onOpenAngler={openAngler} />}
      {screen === "profile" && <ProfileScreen anglerId={anglerId} onOpenAngler={openAngler} onNav={nav} />}
      {screen === "live" && <LiveScreen onOpenAngler={openAngler} />}
      <Footer onNav={nav} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
