import {
  Routes,
  Route,
} from "react-router-dom";

import { BattlePage } from 'pages/Battle';
import { HomePage } from 'pages/Home';
import { SkillsPage } from 'pages/Skills';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/battle" element={<BattlePage />} />
      <Route path="/skills" element={<SkillsPage />} />
    </Routes>
  )
}