import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Shield, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Briefcase,
  UserCheck,
  TrendingUp,
  Award
} from "lucide-react";
import eventaJobLogo from "@/assets/eventajob-logo.png";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={eventaJobLogo} alt="EventaJob" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary">EventaJob</span>
            <Badge className="badge-primary">v1.0</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-sm">
              Para Empresas
            </Button>
            <Button variant="ghost" className="text-sm">
              Para Profissionais
            </Button>
            <Button className="btn-primary text-sm">
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative py-20 px-4 bg-gradient-hero overflow-hidden ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Conecte-se com os
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Melhores Profissionais</span>
              de Eventos
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              A plataforma profissional que conecta empresas com talentos qualificados 
              para eventos corporativos, sociais e gastronómicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="btn-primary text-lg px-8 py-4 shadow-brand">
                Contratar Profissionais
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
                Trabalhar Conosco
                <Briefcase className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-scale-in">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Profissionais Ativos</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-success mb-2">1,200+</div>
              <div className="text-muted-foreground">Eventos Realizados</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-muted-foreground">Avaliação Média</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold text-success mb-2">98%</div>
              <div className="text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Porque Escolher o EventaJob?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma solução completa para suas necessidades de pessoal qualificado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-elevated animate-slide-up group hover:shadow-brand">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Profissionais Verificados</h3>
                <p className="text-muted-foreground">
                  Todos os nossos profissionais passam por rigoroso processo de verificação e validação.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated animate-slide-up group hover:shadow-brand" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Disponibilidade em Tempo Real</h3>
                <p className="text-muted-foreground">
                  Veja instantaneamente quais profissionais estão disponíveis para suas datas.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated animate-slide-up group hover:shadow-brand" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/20 transition-colors">
                  <Shield className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pagamento Seguro</h3>
                <p className="text-muted-foreground">
                  Sistema de pagamento integrado com proteção para ambas as partes.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated animate-slide-up group hover:shadow-brand" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sistema de Avaliações</h3>
                <p className="text-muted-foreground">
                  Avaliações transparentes que garantem qualidade em todos os serviços.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated animate-slide-up group hover:shadow-brand" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Crescimento Profissional</h3>
                <p className="text-muted-foreground">
                  Ferramentas para profissionais desenvolverem suas carreiras e aumentarem rendimentos.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated animate-slide-up group hover:shadow-brand" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/20 transition-colors">
                  <Award className="h-6 w-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Suporte 24/7</h3>
                <p className="text-muted-foreground">
                  Equipa de suporte dedicada disponível sempre que precisar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Profissionais Especializados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encontre o profissional ideal para cada tipo de evento
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Garçons & Empregados", count: "120+" },
              { name: "Barmen & Bartenders", count: "85+" },
              { name: "Chefs & Cozinheiros", count: "65+" },
              { name: "Segurança", count: "45+" },
              { name: "Recepcionistas", count: "70+" },
              { name: "Técnicos Audio/Visual", count: "30+" },
              { name: "Serviços de Limpeza", count: "95+" },
              { name: "DJs & Animação", count: "40+" }
            ].map((service, index) => (
              <Card key={service.name} className="card-elevated text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <Badge className="badge-success">{service.count} Disponíveis</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a centenas de empresas que já confiam no EventaJob para seus eventos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary text-lg px-8 py-4 shadow-brand">
                Criar Conta Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
                Agendar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={eventaJobLogo} alt="EventaJob" className="w-6 h-6 brightness-0 invert" />
                <span className="text-lg font-bold">EventaJob</span>
              </div>
              <p className="text-neutral-400 text-sm">
                A plataforma profissional para conectar talentos com oportunidades no setor de eventos.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Para Empresas</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Contratar Profissionais</a></li>
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Casos de Sucesso</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Para Profissionais</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Cadastre-se</a></li>
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Central de Ajuda</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-neutral-100 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-neutral-100 transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
            <p>&copy; 2024 EventaJob. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;