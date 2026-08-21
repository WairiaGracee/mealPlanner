import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import LandingPage from "./pages/LandingPage";
import SampleMealPlansPage from "./pages/Samplemealplanspage";
import MealPlanDetailPage from "./pages/Mealplandetailpage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnBoardingPage";
import GeneratingPage from "./pages/GeneratingPage";
import DashboardPage from "./pages/DashboardPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import GroceryListPage from "./pages/GroceryListPage";
import NutritionPage from "./pages/NutritionPage";
import RecipeQuizPage from "./pages/RecipeQuizPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingReminderModal from "./components/auth/OnboardingReminderModal";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
        <OnboardingReminderModal />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/meal-plans" element={<SampleMealPlansPage />} />
          <Route path="/meal-plans/:slug" element={<MealPlanDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generating/:planId"
            element={
              <ProtectedRoute>
                <GeneratingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <MealPlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes"
            element={
              <ProtectedRoute>
                <RecipesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <RecipeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shopping-list"
            element={
              <ProtectedRoute>
                <GroceryListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <NutritionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/recipe-quiz"
            element={
              <ProtectedRoute>
                <RecipeQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;