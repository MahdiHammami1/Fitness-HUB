import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/component/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/component/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useLogout } from '@/hooks/use-logout';
import { isAuthenticated } from '@/lib/api';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/coaching', label: 'Coaching' },
  { href: '/events', label: 'Events' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { logout } = useLogout();
  const { isAdmin, user } = useUser();
  const { settings } = useSiteSettings();
  const authenticated = isAuthenticated();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container-tight">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 px-2 sm:px-4">
          {/* Logo */}
          <Link to={authenticated ? "/home" : "/"} className="flex items-center gap-2 flex-shrink-0">
            <span className="font-display text-lg sm:text-2xl md:text-3xl text-foreground tracking-wider">
              {settings.siteName.split(' ')[0]}<span className="text-primary text-xs sm:text-base">{settings.siteName.includes(' ') ? ' ' + settings.siteName.split(' ')[1] : ''}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-xs lg:text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {authenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 hidden sm:flex">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                )}
                
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <span className="hidden sm:inline text-xs sm:text-sm font-medium truncate max-w-[150px]">{user.fullName || user.email}</span>
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-xs sm:text-sm font-semibold">{user.fullName || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer text-xs sm:text-sm">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600 text-xs sm:text-sm">
                        <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            ) : (
              <Link to="/sign-in" className="hidden sm:block">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 h-10 w-10 flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden border-t border-border py-3 px-3 sm:px-4 animate-fade-in bg-card/50 backdrop-blur-sm">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2 sm:py-3 text-sm sm:text-base font-medium uppercase tracking-wider transition-colors",
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            {authenticated ? (
              <>
                {user && (
                  <div className="py-2 sm:py-3 border-y border-border">
                    <p className="text-xs sm:text-sm font-semibold truncate">{user.fullName || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 sm:py-3 text-sm sm:text-base font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 sm:py-3 text-sm sm:text-base font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/sign-in"
                onClick={() => setIsOpen(false)}
                className="block py-2 sm:py-3 text-sm sm:text-base font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
