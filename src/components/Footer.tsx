import { Clapperboard, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex items-center space-x-3">
            <Clapperboard className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-text">MeluStreaming</span>
          </div>
          <p className="text-textSecondary text-center">© 2025 MeluStreaming. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-textSecondary hover:text-primary transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-textSecondary hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-textSecondary hover:text-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
