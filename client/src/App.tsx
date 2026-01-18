import { Providers } from './components/providers';
import { AppLayout } from './components/layout/AppLayout';
import { NicheFinder } from './pages/NicheFinder';

function App() {
  return (
    <Providers>
      <AppLayout>
        <NicheFinder />
      </AppLayout>
    </Providers>
  );
}

export default App;
