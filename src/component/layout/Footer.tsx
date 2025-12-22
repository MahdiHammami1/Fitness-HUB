import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-tight px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/home" className="inline-block mb-4">
              <span className="font-display text-3xl text-foreground tracking-wider">
                {settings.siteName.split(' ')[0]}<span className="text-primary"> {settings.siteName.split(' ').slice(1).join(' ')}</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transform your body. Elevate your mind. Join the Wouhouch community and unlock your full potential.
            </p>
            <div className="flex gap-4">
              <a
                href={`https://instagram.com/${settings.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="p-2 rounded-full bg-secondary hover:bg-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/coaching" className="text-muted-foreground hover:text-primary transition-colors">
                  Coaching
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Ariana, Tunisia</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:wouhouchteam@gmail.com" className="hover:text-primary transition-colors">
                  wouhouchteam@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5 flex-shrink-0" />
                <a href="https://wa.me/21626630102" className="hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wouhouch Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
