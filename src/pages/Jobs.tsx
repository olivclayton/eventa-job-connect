import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar,
  Users,
  Briefcase,
  Clock,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salary_min: number;
  salary_max: number;
  employment_type: string;
  experience_level: string;
  application_deadline: string;
  max_applicants: number;
  current_applicants: number;
  status: string;
  is_featured: boolean;
  created_at: string;
  user_id: string;
}

const Jobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const categories = [
    'Garçons & Empregados',
    'Barmen & Bartenders', 
    'Chefs & Cozinheiros',
    'Segurança',
    'Recepcionistas',
    'Técnicos Audio/Visual',
    'Serviços de Limpeza',
    'DJs & Animação',
    'Outros'
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as vagas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      setJobs(jobs.filter(job => job.id !== jobId));
      toast({
        title: 'Sucesso',
        description: 'Vaga excluída com sucesso',
      });
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a vaga',
        variant: 'destructive',
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    const matchesType = typeFilter === 'all' || job.employment_type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const formatSalary = (min: number, max: number) => {
    if (min && max) {
      return `€${min} - €${max}`;
    } else if (min) {
      return `A partir de €${min}`;
    } else if (max) {
      return `Até €${max}`;
    }
    return 'A combinar';
  };

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'temporary': return 'Temporário';
      case 'permanent': return 'Permanente';
      case 'contract': return 'Contrato';
      default: return type;
    }
  };

  const getExperienceLevelLabel = (level: string) => {
    switch (level) {
      case 'entry': return 'Iniciante';
      case 'mid': return 'Intermediário';
      case 'senior': return 'Sénior';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando vagas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Vagas de Emprego</h1>
          <p className="text-muted-foreground">
            Encontre oportunidades profissionais no setor de eventos
          </p>
        </div>
        <Button asChild>
          <Link to="/jobs/create">
            <Plus className="h-4 w-4 mr-2" />
            Nova Vaga
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar vagas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="temporary">Temporário</SelectItem>
                <SelectItem value="permanent">Permanente</SelectItem>
                <SelectItem value="contract">Contrato</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchJobs}>
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma vaga encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Não há vagas que correspondam aos seus filtros atuais.
            </p>
            <Button asChild>
              <Link to="/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Vaga
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      {job.is_featured && (
                        <Badge className="badge-warning">Em Destaque</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatSalary(job.salary_min, job.salary_max)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {getEmploymentTypeLabel(job.employment_type)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.current_applicants}/{job.max_applicants || '∞'} candidatos
                      </div>
                      {job.application_deadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Até {new Date(job.application_deadline).toLocaleDateString('pt-PT')}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline">{job.category}</Badge>
                      <Badge variant="outline">{getExperienceLevelLabel(job.experience_level)}</Badge>
                    </div>
                    {job.description && (
                      <p className="text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/jobs/${job.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {user?.id === job.user_id && (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/jobs/edit/${job.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteJob(job.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Publicado em {new Date(job.created_at).toLocaleDateString('pt-PT')}
                  </div>
                  {user?.id !== job.user_id && (
                    <Button asChild>
                      <Link to={`/jobs/${job.id}/apply`}>
                        Candidatar-se
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;