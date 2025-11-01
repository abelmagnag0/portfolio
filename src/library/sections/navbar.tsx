import { Download, Moon } from '@/library/icons';
import { Button } from '../components/button';

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white">AM</span>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </a>
              <a href="#projetos" className="text-muted-foreground hover:text-foreground transition-colors">
                Projetos
              </a>
              {/* <a href="#artigos" className="text-muted-foreground hover:text-foreground transition-colors">
                Artigos
              </a> */}
              <a href="#contato" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle de tema sem hidratação React */}
            <button
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Alternar tema"
              title="Alternar tema"
              data-theme-toggle
            >
              <Moon className="w-5 h-5" />
            </button>
            <Button className="gap-2" asChild>
              <a
                href={'/cv/Abel%20Magnago%20CV%20PT-BR.pdf'}
                download
              >
                <Download className="w-4 h-4" />
                Baixar CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
