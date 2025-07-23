import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AppSidebar from "./components/AppSidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Professionals from "./pages/Professionals";
import CreateProfessional from "./pages/CreateProfessional";
import EditProfessional from "./pages/EditProfessional";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para proteger rotas que requerem autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Componente para redirecionar usuários autenticados
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// Layout com sidebar para páginas autenticadas
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background">
            <SidebarTrigger className="ml-2" />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota pública - landing page */}
            <Route 
              path="/" 
              element={<Index />}
            />
            
            {/* Rota de autenticação */}
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              } 
            />
            
            {/* Rotas protegidas com layout de dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Rotas de eventos */}
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Events />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/events/create" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreateEvent />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/events/edit/:id" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EditEvent />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/professionals" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Professionals />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/professionals/create" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreateProfessional />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/professionals/edit/:id" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EditProfessional />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Jobs />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/jobs/create" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreateJob />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/jobs/edit/:id" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EditJob />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Avaliações</h1>
                      <p className="text-muted-foreground">Veja avaliações e feedback.</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Notificações</h1>
                      <p className="text-muted-foreground">Gerencie suas notificações.</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Relatórios</h1>
                      <p className="text-muted-foreground">Visualize relatórios e análises.</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Configurações</h1>
                      <p className="text-muted-foreground">Configure sua conta e preferências.</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;