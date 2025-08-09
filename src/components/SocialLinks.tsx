import { Button } from "@/components/ui/button";
import { TwitterLogo, InstagramLogo, LinkedinLogo, YoutubeLogo, TiktokLogo } from "@phosphor-icons/react";

interface SocialLinksProps {
  variant?: 'header' | 'footer';
  className?: string;
}

export function SocialLinks({ variant = 'footer', className = '' }: SocialLinksProps) {
  const socialMedia = [
    {
      name: 'Twitter',
      icon: TwitterLogo,
      url: 'https://twitter.com/notientenombre',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram', 
      icon: InstagramLogo,
      url: 'https://instagram.com/notientenombre',
      color: 'hover:text-pink-400'
    },
    {
      name: 'LinkedIn',
      icon: LinkedinLogo, 
      url: 'https://linkedin.com/in/notientenombre',
      color: 'hover:text-blue-500'
    },
    {
      name: 'YouTube',
      icon: YoutubeLogo,
      url: 'https://youtube.com/@notientenombre',
      color: 'hover:text-red-500'
    },
    {
      name: 'TikTok',
      icon: TiktokLogo,
      url: 'https://tiktok.com/@notientenombre', 
      color: 'hover:text-white'
    }
  ];

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="text-sm text-muted-foreground">Síguenos:</span>
        {socialMedia.slice(0, 3).map((social) => (
          <Button
            key={social.name}
            variant="ghost"
            size="sm"
            className={`p-2 h-8 w-8 glass-effect hover:bg-primary/20 ${social.color} transition-all duration-300 hover:scale-110`}
            onClick={() => window.open(social.url, '_blank')}
          >
            <social.icon size={16} weight="fill" />
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground font-display mb-2">
          Conecta con el Podcast
        </h3>
        <p className="text-sm text-muted-foreground">
          Síguenos en redes sociales para contenido exclusivo
        </p>
      </div>
      <div className="flex items-center gap-4">
        {socialMedia.map((social) => (
          <Button
            key={social.name}
            variant="ghost"
            size="sm"
            className={`p-3 h-12 w-12 glass-effect hover:bg-primary/10 border border-border/20 hover:border-primary/40 ${social.color} transition-all duration-300 hover:scale-110 hover:-translate-y-1`}
            onClick={() => window.open(social.url, '_blank')}
            title={`Síguenos en ${social.name}`}
          >
            <social.icon size={24} weight="fill" />
          </Button>
        ))}
      </div>
    </div>
  );
}