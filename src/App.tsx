import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./hooks/useToast";
import { ThemeProvider } from "./hooks/useTheme";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout/AppLayout";

import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { CandidatesPage } from "./pages/Candidates/CandidatesPage";
import { CandidateComparePage } from "./pages/Candidates/CandidateComparePage";
import { CandidateDetailsPage } from "./pages/CandidateDetails/CandidateDetailsPage";
import { JobsPage } from "./pages/Jobs/JobsPage";
import { JobEditPage } from "./pages/Jobs/JobEditPage";
import { JobCreatePage } from "./pages/JobCreate/JobCreatePage";
import { JobDetailsPage } from "./pages/JobDetails/JobDetailsPage";
import { CreditsPage } from "./pages/Credits/CreditsPage";
import { BuyCreditsPage } from "./pages/Credits/BuyCreditsPage";
import { HistoryPage } from "./pages/History/HistoryPage";
import { NotificationsPage } from "./pages/Notifications/NotificationsPage";
import { HelpPage } from "./pages/Help/HelpPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />

                  <Route path="/curriculos" element={<CandidatesPage />} />
                  <Route path="/curriculos/comparar" element={<CandidateComparePage />} />
                  <Route path="/curriculos/:id" element={<CandidateDetailsPage />} />

                  <Route path="/vagas" element={<JobsPage />} />
                  <Route path="/vagas/nova" element={<JobCreatePage />} />
                  <Route path="/vagas/:id" element={<JobDetailsPage />} />
                  <Route path="/vagas/:id/editar" element={<JobEditPage />} />

                  <Route path="/creditos" element={<CreditsPage />} />
                  <Route path="/creditos/comprar" element={<BuyCreditsPage />} />

                  <Route path="/historico" element={<HistoryPage />} />
                  <Route path="/notificacoes" element={<NotificationsPage />} />
                  <Route path="/ajuda" element={<HelpPage />} />
                  <Route path="/configuracoes" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
