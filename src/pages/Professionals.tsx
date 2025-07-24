import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Star, MapPin, Phone, Mail, Instagram, Globe, Trash2, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  category: string;
  specialties?: string[];
  location: string;
  price_range?: string;
  min_price?: number;
  max_price?: number;
  portfolio_images?: string[];
  instagram_url?: string;
  website_url?: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  availability_days?: string[];
  user_id: string;
  created_at: string;
}

const CATEGORIES = [
  'fotografo',
  'videomaker',
  'dj',
  'decorador',
  'buffet',
  'musico',
  'cerimonialista',
  'florista',
  'maquiador',
  'seguranca',
  'outros'
];

const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    fotografo: 'Fotógrafo',
    videomaker: 'Videomaker',
    dj: 'DJ',
    decorador: 'Decorador',
    buffet: 'Buffet',
    musico: 'Músico',
    cerimonialista: 'Cerimonialista',
    florista: 'Florista',
    maquiador: 'Maquiador',
    seguranca: 'Segurança',
    outros: 'Outros'
  };
  return labels[category] || category;
};

export default function Professionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar profissionais',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProfessional = async (professionalId: string) => {
    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', professionalId);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Profissional removido com sucesso',
      });

      fetchProfessionals();
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao remover profissional',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (professional.specialties && professional.specialties.some(s => 
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesCategory = selectedCategory === 'all' || professional.category === selectedCategory;
    
    // Filter by availability date if selected
    const matchesDate = !selectedDate || (professional.availability_days && 
      professional.availability_days.includes(format(selectedDate, 'EEEE').toLowerCase()));
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profissionais</h1>
          <p className="text-muted-foreground">
            Encontre os melhores prestadores de serviços para seus eventos
          </p>
        </div>
        <Link to="/professionals/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Cadastrar Profissional
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome, localização ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {getCategoryLabel(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-56 justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Filtrar por data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
            {selectedDate && (
              <div className="p-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedDate(undefined)}
                  className="w-full"
                >
                  Limpar filtro
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Results */}
      {filteredProfessionals.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum profissional encontrado
          </h3>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros ou cadastre um novo profissional
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={professional.portfolio_images?.[0]} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(professional.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {professional.name}
                        </h3>
                        {professional.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {getCategoryLabel(professional.category)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Actions - only show for own professionals */}
                  {user && professional.user_id === user.id && (
                    <div className="flex gap-1">
                      <Link to={`/professionals/edit/${professional.id}`}>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover este profissional? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProfessional(professional.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating */}
                {professional.total_reviews > 0 && (
                  <div className="flex items-center justify-between">
                    {renderStars(professional.rating)}
                    <span className="text-xs text-muted-foreground">
                      {professional.total_reviews} avaliações
                    </span>
                  </div>
                )}

                {/* Bio */}
                {professional.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {professional.bio}
                  </p>
                )}

                {/* Specialties */}
                {professional.specialties && professional.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {professional.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {professional.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{professional.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Location and Price */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{professional.location}</span>
                  </div>
                  
                  {professional.price_range && (
                    <div className="text-sm font-medium text-foreground">
                      {professional.price_range}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-2">
                    {professional.phone && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-2"
                        onClick={() => window.open(`tel:${professional.phone}`)}
                        title="Ligar"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-2"
                      onClick={() => window.open(`mailto:${professional.email}`)}
                      title="Enviar email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    {professional.instagram_url && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-2"
                        onClick={() => window.open(professional.instagram_url, '_blank')}
                        title="Instagram"
                      >
                        <Instagram className="h-4 w-4" />
                      </Button>
                    )}
                    {professional.website_url && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-2"
                        onClick={() => window.open(professional.website_url, '_blank')}
                        title="Website"
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Button size="sm" variant="outline">
                    Ver Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}