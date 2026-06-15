import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ArchitecturePage } from '@/pages/ArchitecturePage'
import { ComparatorPage } from '@/pages/ComparatorPage'
import { QuizPage } from '@/pages/QuizPage'
import { DocsPage } from '@/pages/DocsPage'
import { EvolutionPage } from '@/pages/EvolutionPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"                    element={<HomePage />}         />
          <Route path="/architecture/:id"    element={<ArchitecturePage />} />
          <Route path="/comparar"            element={<ComparatorPage />}   />
          <Route path="/quiz"                element={<QuizPage />}         />
          <Route path="/evolucao"            element={<EvolutionPage />}    />
          <Route path="/docs"                element={<DocsPage />}         />
          <Route path="*"                    element={<NotFoundPage />}     />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
