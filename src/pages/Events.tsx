import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Edit, 
  Trash2,
  Euro,
  Phone,
  Mail,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string | null;
  max_participants: number | null;
  current_participants: number;
  price: number;
  image_url: string | null;
  status: string;
  created_at: string;
  user_id: string;
  required_professionals?: any;
  contact_email?: string | null;
  contact_phone?: string | null;
  application_deadline?: string | null;
}

const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfessionals, setUserProfessionals] = useState<any[]>([]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os eventos."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfessionals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setUserProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    }
  };

  const applyToEvent = async (eventId: string, professionalId: string, applicationData: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_applications')
        .insert({
          event_id: eventId,
          professional_id: professionalId,
          applicant_id: user.id,
          message: applicationData.message,
          application_type: applicationData.type,
          contact_preference: applicationData.contact,
          price_proposal: applicationData.price ? parseFloat(applicationData.price) : null,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Candidatura enviada com sucesso!"
      });
    } catch (error: any) {
      console.error('Erro ao enviar candidatura:', error);
      if (error.code === '23505') {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você já se candidatou a este evento com este profissional."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível enviar a candidatura."
        });
      }
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento deletado com sucesso."
      });

      fetchEvents();
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível deletar o evento."
      });
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUserProfessionals();
  }, [user]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Meus Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus eventos aqui
          </p>
        </div>
        <Button onClick={() => navigate('/events/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Evento
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="card-elevated">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento criado'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Tente buscar com outros termos.' 
                : 'Comece criando seu primeiro evento.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/events/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="card-elevated hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/events/edit/${event.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o evento "{event.title}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteEvent(event.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString('pt-PT')}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {event.start_time} - {event.end_time}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                {event.max_participants && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {event.current_participants} / {event.max_participants} participantes
                  </div>
                )}

                {event.price > 0 && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Euro className="h-4 w-4" />
                    {event.price.toFixed(2)}€
                  </div>
                )}

                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </p>
                )}

                {event.category && (
                  <Badge variant="outline" className="w-fit">
                    {event.category}
                  </Badge>
                )}

                {/* Professional Application Section - Show only if user has professionals and event is not theirs */}
                {userProfessionals.length > 0 && event.user_id !== user?.id && (
                  <div className="pt-3 border-t">
                    <ApplyToEventDialog
                      event={event}
                      userProfessionals={userProfessionals}
                      onApply={applyToEvent}
                    />
                  </div>
                )}

                {/* Contact info for event owner's events */}
                {event.user_id === user?.id && (event.contact_phone || event.contact_email) && (
                  <div className="pt-3 border-t space-y-2">
                    <p className="text-sm font-medium">Informações de Contato:</p>
                    <div className="flex gap-2">
                      {event.contact_phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${event.contact_phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Telefone
                        </Button>
                      )}
                      {event.contact_email && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`mailto:${event.contact_email}`)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Component for professional application dialog
const ApplyToEventDialog = ({ event, userProfessionals, onApply }: {
  event: Event;
  userProfessionals: any[];
  onApply: (eventId: string, professionalId: string, data: any) => void;
}) => {
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [message, setMessage] = useState('');
  const [applicationType, setApplicationType] = useState('phone');
  const [contactPreference, setContactPreference] = useState('');
  const [priceProposal, setPriceProposal] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!selectedProfessional) return;

    onApply(event.id, selectedProfessional, {
      message,
      type: applicationType,
      contact: contactPreference,
      price: priceProposal,
    });

    // Reset form
    setSelectedProfessional('');
    setMessage('');
    setApplicationType('phone');
    setContactPreference('');
    setPriceProposal('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Candidatar-se
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Candidatar-se ao Evento</DialogTitle>
          <DialogDescription>
            Envie sua candidatura para "{event.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Selecionar Profissional:</label>
            <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um perfil profissional" />
              </SelectTrigger>
              <SelectContent>
                {userProfessionals.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.name} - {prof.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Tipo de Candidatura:</label>
            <Select value={applicationType} onValueChange={setApplicationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Telefone
                  </div>
                </SelectItem>
                <SelectItem value="chat">
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat/WhatsApp
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Mensagem (opcional):</label>
            <Textarea
              placeholder="Descreva sua experiência e por que é ideal para este evento..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Proposta de Preço (€) (opcional):</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 500.00"
              value={priceProposal}
              onChange={(e) => setPriceProposal(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedProfessional}
          >
            Enviar Candidatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Events;