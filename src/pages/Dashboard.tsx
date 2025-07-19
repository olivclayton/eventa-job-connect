import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Star,
  Plus,
  Bell,
  ArrowRight,
  UserCheck,
  Clock,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 12,
    activeProfessionals: 45,
    completedJobs: 38,
    avgRating: 4.8
  });

  const recentEvents = [
    {
      id: 1,
      title: 'Casamento Silva & Costa',
      date: '2024-07-25',
      location: 'Quinta do Lago, Lisboa',
      status: 'Confirmado',
      professionals: 8
    },
    {
      id: 2,
      title: 'Evento Corporativo Tech Summit',
      date: '2024-07-28',
      location: 'Centro de Congressos, Porto',
      status: 'Pendente',
      professionals: 12
    },
    {
      id: 3,
      title: 'Festa de Aniversário Premium',
      date: '2024-08-02',
      location: 'Hotel Pestana, Funchal',
      status: 'Em Andamento',
      professionals: 6
    }
  ];

  const topProfessionals = [
    {
      id: 1,
      name: 'Ana Santos',
      specialty: 'Garçonete',
      rating: 4.9,
      completedJobs: 45,
      avatar: null
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      specialty: 'Barman',
      rating: 4.8,
      completedJobs: 38,
      avatar: null
    },
    {
      id: 3,
      name: 'Mariana Costa',
      specialty: 'Chef',
      rating: 4.9,
      completedJobs: 52,
      avatar: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.email?.split('@')[0]}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profissionais Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeProfessionals}</div>
            <p className="text-xs text-muted-foreground">
              +8 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trabalhos Concluídos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              95% taxa de conclusão
            </p>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.avgRating}★</div>
            <p className="text-xs text-muted-foreground">
              Excelente qualidade
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Eventos Recentes
              <Button variant="ghost" size="sm">
                Ver Todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString('pt-PT')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {event.professionals} profissionais
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Professionals */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Top Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProfessionals.map((professional, index) => (
                <div key={professional.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={professional.avatar || ''} />
                      <AvatarFallback className="text-xs">
                        {getInitials(professional.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {professional.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {professional.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {professional.rating}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {professional.completedJobs} trabalhos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Calendar className="h-6 w-6" />
              Criar Novo Evento
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              Buscar Profissionais
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <TrendingUp className="h-6 w-6" />
              Ver Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;