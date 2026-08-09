import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SampleMealPlansPage from "./pages/Samplemealplanspage";
import MealPlanDetailPage from "./pages/Mealplandetailpage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnBoardingPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/meal-plans" element={<SampleMealPlansPage />} />
        <Route path="/meal-plans/:slug" element={<MealPlanDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/*
          Next: /blog for the nutrition blog listing, cross-linked from
          the sample meal plans page.
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
