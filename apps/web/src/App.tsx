import { LanguageProvider } from "./i18n/LanguageProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthPage />
      </LanguageProvider>
    </ThemeProvider>
  );
}
