import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, User as UserIcon, Save, X } from 'lucide-react';
import { Layout } from '@/component/layout/Layout';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/ui/card';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { apiPut } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User ID not found',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiPut(`/users/${user.id}`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });

      if (response) {
        await refreshUser();
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  if (!user) {
    return (
      <Layout>
        <div className="container-tight px-3 sm:px-4 py-12 sm:py-16 md:py-20">
          <p className="text-sm sm:text-base">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-tight px-3 sm:px-4 py-12 sm:py-16 md:py-20 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">My Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your account information</p>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6">
            <div>
              <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your personal details</CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Edit Profile
              </Button>
            )}
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-xs sm:text-sm">
                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={cn(errors.fullName && 'border-red-500', 'text-sm')}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-xs sm:text-sm">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={cn(errors.email && 'border-red-500', 'text-sm')}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-xs sm:text-sm">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={cn(errors.phone && 'border-red-500', 'text-sm')}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Role</Label>
                  <div className="px-3 py-2 bg-muted rounded-md text-xs sm:text-sm font-medium">
                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Account Status</Label>
                  <div className="px-3 py-2 bg-muted rounded-md text-xs sm:text-sm font-medium">
                    {user.enabled ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {/* Full Name Display */}
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    Full Name
                  </Label>
                  <p className="mt-2 text-base sm:text-lg font-medium">{formData.fullName || 'Not set'}</p>
                </div>

                {/* Email Display */}
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    Email Address
                  </Label>
                  <p className="mt-2 text-base sm:text-lg font-medium">{formData.email}</p>
                </div>

                {/* Phone Display */}
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    Phone Number
                  </Label>
                  <p className="mt-2 text-base sm:text-lg font-medium">{formData.phone || 'Not set'}</p>
                </div>

                {/* Role Display */}
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground">Role</Label>
                  <p className="mt-2 text-base sm:text-lg font-medium">
                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                  </p>
                </div>

                {/* Account Status Display */}
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground">Account Status</Label>
                  <p className="mt-2 text-base sm:text-lg font-medium">
                    {user.enabled ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
