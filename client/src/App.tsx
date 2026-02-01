import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './components/providers';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { NicheFinder } from './pages/NicheFinder';
import { Results } from './pages/Results';
import { AnalysisDetail } from './pages/AnalysisDetail';
import { Profile } from './pages/Profile';
import { SavedSearches } from './pages/SavedSearches';

// Demo imports
import { DemoProvider } from './demo/DemoContext';
import { DemoDashboard } from './demo/pages/DemoDashboard';
import { DemoNicheFinder } from './demo/pages/DemoNicheFinder';

// Check if demo mode is enabled
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

function DemoApp() {
  return (
    <Providers>
      <DemoProvider>
        <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DemoDashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/niche-finder" element={<DemoNicheFinder />} />
            <Route path="/results" element={<Results />} />
            <Route path="/analysis/:id" element={<AnalysisDetail />} />
            <Route path="/saved" element={<SavedSearches />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Navigate to="/profile" replace />} />
            {/* Demo routes with /demo prefix for backwards compatibility */}
            <Route path="/demo" element={<Navigate to="/" replace />} />
            <Route path="/demo/niche-finder" element={<Navigate to="/niche-finder" replace />} />
            <Route path="/demo/results" element={<Navigate to="/results" replace />} />
            <Route path="/demo/analysis/:id" element={<AnalysisDetail />} />
            <Route path="/demo/saved" element={<Navigate to="/saved" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      </DemoProvider>
    </Providers>
  );
}

function ProductionApp() {
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

function App() {
  if (isDemoMode) {
    return <DemoApp />;
  }
  return <ProductionApp />;
}

export default App;
