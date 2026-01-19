import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './components/providers';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { NicheFinder } from './pages/NicheFinder';
import { Results } from './pages/Results';
import { AnalysisDetail } from './pages/AnalysisDetail';
import { Profile } from './pages/Profile';
import { SavedSearches } from './pages/SavedSearches';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/niche-finder" element={<NicheFinder />} />
            <Route path="/results" element={<Results />} />
            <Route path="/analysis/:id" element={<AnalysisDetail />} />
            <Route path="/saved" element={<SavedSearches />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Navigate to="/profile" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
