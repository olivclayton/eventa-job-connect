import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Calendar } from 'lucide-react';

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
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  application_deadline: z.string().optional(),
  required_professionals: z.array(z.string()).optional(),
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

const professionalCategories = [
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

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);

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
      contact_email: '',
      contact_phone: '',
      application_deadline: '',
      required_professionals: [],
    },
  });

  const onSubmit = async (data: EventFormData) => {
    if (!user) return;

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

      // Validar se a data não é no passado
      const eventDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "A data do evento não pode ser no passado."
        });
        return;
      }

      const eventData = {
        user_id: user.id,
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
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        application_deadline: data.application_deadline || null,
        required_professionals: selectedProfessionals.length > 0 ? selectedProfessionals : null,
        status: 'active'
      };

      const { error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!"
      });

      navigate('/events');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o evento. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-primary">Criar Novo Evento</h1>
            <p className="text-muted-foreground">Preencha os detalhes do seu evento</p>
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email para Contato (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="contato@exemplo.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone para Contato (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="+351 912 345 678" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="application_deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo para Candidaturas (opcional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Required Professionals Section */}
                <div className="md:col-span-2">
                  <FormLabel>Profissionais Necessários (opcional)</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {professionalCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedProfessionals.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProfessionals([...selectedProfessionals, category]);
                            } else {
                              setSelectedProfessionals(selectedProfessionals.filter(p => p !== category));
                            }
                          }}
                        />
                        <label htmlFor={category} className="text-sm capitalize">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
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
                  {loading ? 'Criando...' : 'Criar Evento'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;