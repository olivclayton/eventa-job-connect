import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  employment_type: z.string().min(1, 'Tipo de emprego é obrigatório'),
  experience_level: z.string().min(1, 'Nível de experiência é obrigatório'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  application_deadline: z.string().optional(),
  max_applicants: z.number().optional(),
  contact_email: z.string().email('Email inválido').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  is_featured: z.boolean().default(false),
});

type JobFormData = z.infer<typeof jobSchema>;

const EditJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      employment_type: 'temporary',
      experience_level: 'entry',
      is_featured: false,
    },
  });

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.user_id !== user?.id) {
        toast({
          title: 'Erro',
          description: 'Você não tem permissão para editar esta vaga',
          variant: 'destructive',
        });
        navigate('/jobs');
        return;
      }

      // Converter arrays para strings
      const requirements = data.requirements ? data.requirements.join('\n') : '';
      const benefits = data.benefits ? data.benefits.join('\n') : '';

      form.reset({
        title: data.title,
        description: data.description || '',
        category: data.category,
        location: data.location,
        salary_min: data.salary_min || undefined,
        salary_max: data.salary_max || undefined,
        employment_type: data.employment_type,
        experience_level: data.experience_level,
        requirements,
        benefits,
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        application_deadline: data.application_deadline || '',
        max_applicants: data.max_applicants || undefined,
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        is_featured: data.is_featured || false,
      });
    } catch (error) {
      console.error('Erro ao buscar vaga:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a vaga',
        variant: 'destructive',
      });
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: JobFormData) => {
    if (!user || !id) {
      toast({
        title: 'Erro',
        description: 'Dados insuficientes para atualizar a vaga',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Converter strings de requirements e benefits em arrays
      const requirements = data.requirements 
        ? data.requirements.split('\n').filter(req => req.trim() !== '')
        : null;
      
      const benefits = data.benefits 
        ? data.benefits.split('\n').filter(benefit => benefit.trim() !== '')
        : null;

      const jobData = {
        title: data.title,
        description: data.description || null,
        category: data.category,
        location: data.location,
        employment_type: data.employment_type,
        experience_level: data.experience_level,
        requirements,
        benefits,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        max_applicants: data.max_applicants || null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        application_deadline: data.application_deadline || null,
        is_featured: data.is_featured,
      };

      const { error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Vaga atualizada com sucesso',
      });

      navigate('/jobs');
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a vaga',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Editar Vaga</h1>
          <p className="text-muted-foreground">
            Atualize as informações da vaga
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Informações Básicas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Vaga *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Garçon para Evento Corporativo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva os detalhes da vaga..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Lisboa, Porto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Emprego *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="temporary">Temporário</SelectItem>
                            <SelectItem value="permanent">Permanente</SelectItem>
                            <SelectItem value="contract">Contrato</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível de Experiência *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entry">Iniciante</SelectItem>
                            <SelectItem value="mid">Intermediário</SelectItem>
                            <SelectItem value="senior">Sénior</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salary_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salário Mínimo (€)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salário Máximo (€)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requisitos (um por linha)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex:&#10;Experiência prévia em eventos&#10;Disponibilidade aos fins de semana&#10;Conhecimento de inglês"
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
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefícios (um por linha)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex:&#10;Alimentação incluída&#10;Transporte fornecido&#10;Formação profissional"
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>Prazo para Candidaturas</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_applicants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máximo de Candidatos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Deixe vazio para ilimitado"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                      <FormLabel>Email de Contacto</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@empresa.com" {...field} />
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
                      <FormLabel>Telefone de Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="+351 XXX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Vaga em Destaque
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Destacar esta vaga na listagem
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/jobs')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Atualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Atualizar Vaga
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditJob;