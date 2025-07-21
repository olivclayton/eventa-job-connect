import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  start_time: z.string().min(1, 'Hora de início é obrigatória'),
  end_time: z.string().min(1, 'Hora de fim é obrigatória'),
  location: z.string().min(1, 'Local é obrigatório'),
  category: z.string().optional(),
  max_participants: z.string().optional(),
  price: z.string().optional(),
  image_url: z.string().optional(),
  status: z.enum(['active', 'cancelled', 'completed']),
});

type EventFormData = z.infer<typeof eventSchema>;

const categories = [
  'Casamento',
  'Evento Corporativo',
  'Festa de Aniversário',
  'Conferência',
  'Workshop',
  'Networking',
  'Formatura',
  'Batizado',
  'Comunhão',
  'Outro'
];

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
      category: '',
      max_participants: '',
      price: '',
      image_url: '',
      status: 'active',
    },
  });

  const fetchEvent = async () => {
    if (!id || !user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Evento não encontrado ou você não tem permissão para editá-lo."
          });
          navigate('/events');
          return;
        }
        throw error;
      }

      if (data) {
        form.reset({
          title: data.title,
          description: data.description || '',
          date: data.date,
          start_time: data.start_time,
          end_time: data.end_time,
          location: data.location,
          category: data.category || '',
          max_participants: data.max_participants ? data.max_participants.toString() : '',
          price: data.price ? data.price.toString() : '',
          image_url: data.image_url || '',
          status: data.status as 'active' | 'cancelled' | 'completed',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o evento."
      });
      navigate('/events');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    if (!user || !id) return;

    setLoading(true);
    try {
      // Validar se a hora de fim é depois da hora de início
      if (data.start_time >= data.end_time) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "A hora de fim deve ser posterior à hora de início."
        });
        return;
      }

      const eventData = {
        title: data.title,
        description: data.description || null,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        location: data.location,
        category: data.category || null,
        max_participants: data.max_participants ? parseInt(data.max_participants) : null,
        price: data.price ? parseFloat(data.price) : 0.00,
        image_url: data.image_url || null,
        status: data.status,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso!"
      });

      navigate('/events');
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o evento. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id, user]);

  if (initialLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando evento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/events')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Eventos
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Editar Evento</h1>
            <p className="text-muted-foreground">Atualize os detalhes do seu evento</p>
          </div>
        </div>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Informações do Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Título do Evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Casamento Silva & Costa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva os detalhes do evento..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Evento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Início</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Fim</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Local do Evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Quinta do Lago, Lisboa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máximo de Participantes (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="Ex: 150" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (€) (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          step="0.01"
                          placeholder="Ex: 25.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>URL da Imagem (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://exemplo.com/imagem.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/events')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Atualizando...' : 'Atualizar Evento'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEvent;