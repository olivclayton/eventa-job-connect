import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = [
  { value: 'fotografo', label: 'Fotógrafo' },
  { value: 'videomaker', label: 'Videomaker' },
  { value: 'dj', label: 'DJ' },
  { value: 'decorador', label: 'Decorador' },
  { value: 'buffet', label: 'Buffet' },
  { value: 'musico', label: 'Músico' },
  { value: 'cerimonialista', label: 'Cerimonialista' },
  { value: 'florista', label: 'Florista' },
  { value: 'maquiador', label: 'Maquiador' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'outros', label: 'Outros' }
];

const WEEKDAYS = [
  { value: 'domingo', label: 'Domingo' },
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' }
];

export default function CreateProfessional() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [portfolioImage, setPortfolioImage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    category: '',
    specialties: [] as string[],
    location: '',
    price_range: '',
    min_price: '',
    max_price: '',
    portfolio_images: [] as string[],
    instagram_url: '',
    website_url: '',
    availability_days: [] as string[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addPortfolioImage = () => {
    if (portfolioImage.trim() && !formData.portfolio_images.includes(portfolioImage.trim())) {
      setFormData(prev => ({
        ...prev,
        portfolio_images: [...prev.portfolio_images, portfolioImage.trim()]
      }));
      setPortfolioImage('');
    }
  };

  const removePortfolioImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter(img => img !== image)
    }));
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability_days: checked
        ? [...prev.availability_days, day]
        : prev.availability_days.filter(d => d !== day)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para cadastrar um profissional',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.category || !formData.location) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const professionalData = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        bio: formData.bio || null,
        category: formData.category,
        specialties: formData.specialties.length > 0 ? formData.specialties : null,
        location: formData.location,
        price_range: formData.price_range || null,
        min_price: formData.min_price ? parseFloat(formData.min_price) : null,
        max_price: formData.max_price ? parseFloat(formData.max_price) : null,
        portfolio_images: formData.portfolio_images.length > 0 ? formData.portfolio_images : null,
        instagram_url: formData.instagram_url || null,
        website_url: formData.website_url || null,
        availability_days: formData.availability_days.length > 0 ? formData.availability_days : null
      };

      const { error } = await supabase
        .from('professionals')
        .insert([professionalData]);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Profissional cadastrado com sucesso!',
      });

      navigate('/professionals');
    } catch (error) {
      console.error('Error creating professional:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao cadastrar profissional. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/professionals')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cadastrar Profissional</h1>
          <p className="text-muted-foreground">
            Preencha as informações para criar seu perfil profissional
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="São Paulo, SP"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Conte um pouco sobre você e seu trabalho..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Categoria e Especialidades */}
        <Card>
          <CardHeader>
            <CardTitle>Categoria e Especialidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua categoria principal" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Digite uma especialidade"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {specialty}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSpecialty(specialty)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preços */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Preço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price_range">Faixa de Preço</Label>
              <Input
                id="price_range"
                value={formData.price_range}
                onChange={(e) => handleInputChange('price_range', e.target.value)}
                placeholder="Ex: R$ 500 - R$ 1.500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_price">Preço Mínimo</Label>
                <Input
                  id="min_price"
                  type="number"
                  step="0.01"
                  value={formData.min_price}
                  onChange={(e) => handleInputChange('min_price', e.target.value)}
                  placeholder="500.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_price">Preço Máximo</Label>
                <Input
                  id="max_price"
                  type="number"
                  step="0.01"
                  value={formData.max_price}
                  onChange={(e) => handleInputChange('max_price', e.target.value)}
                  placeholder="1500.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle>Portfólio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Imagens do Portfólio</Label>
              <div className="flex gap-2">
                <Input
                  value={portfolioImage}
                  onChange={(e) => setPortfolioImage(e.target.value)}
                  placeholder="URL da imagem"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioImage())}
                />
                <Button type="button" onClick={addPortfolioImage} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.portfolio_images.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.portfolio_images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <img src={image} alt={`Portfolio ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                      <span className="flex-1 text-sm truncate">{image}</span>
                      <X
                        className="h-4 w-4 cursor-pointer text-destructive"
                        onClick={() => removePortfolioImage(image)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais e Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/seuperfil"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://seusite.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disponibilidade */}
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Dias da Semana Disponíveis</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {WEEKDAYS.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.value}
                      checked={formData.availability_days.includes(day.value)}
                      onCheckedChange={(checked) => handleAvailabilityChange(day.value, checked as boolean)}
                    />
                    <Label htmlFor={day.value} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/professionals')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Profissional'}
          </Button>
        </div>
      </form>
    </div>
  );
}