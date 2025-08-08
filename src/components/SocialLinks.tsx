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
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground mr-2">Síguenos:</span>
        {socialMedia.slice(0, 3).map((social) => (
          <Button
            key={social.name}
            variant="ghost"
            size="sm"
            className={`p-2 h-8 w-8 backdrop-blur-sm bg-background/20 border border-accent/20 hover:border-accent/40 ${social.color} transition-all duration-300`}
            onClick={() => window.open(social.url, '_blank')}
          >
            <social.icon size={16} weight="fill" />
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Conecta con nosotros:
      </div>
      <div className="flex items-center gap-3">
        {socialMedia.map((social) => (
          <Button
            key={social.name}
            variant="ghost"
            size="sm"
            className={`p-3 h-10 w-10 backdrop-blur-sm bg-background/30 border border-accent/20 hover:border-accent/60 ${social.color} glow-border hover:shadow-lg transition-all duration-300`}
            onClick={() => window.open(social.url, '_blank')}
            title={`Síguenos en ${social.name}`}
          >
            <social.icon size={20} weight="fill" />
          </Button>
        ))}
      </div>
    </div>
  );
}