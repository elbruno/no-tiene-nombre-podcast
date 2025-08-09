import { Button } from "@/components/ui/button";
import { TwitterLogo, InstagramLogo, LinkedinLogo, YoutubeLogo, TiktokLogo } from "@phosphor-icons/react";
import socialLinks from "@/lib/social-links.json";

interface SocialLinksProps {
  variant?: 'header' | 'footer';
  className?: string;
}

export function SocialLinks({ variant = 'footer', className = '' }: SocialLinksProps) {
  const socialMedia = [
    {
      name: 'Twitter',
      icon: TwitterLogo,
      url: socialLinks.twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      icon: InstagramLogo,
      url: socialLinks.instagram,
      color: 'hover:text-pink-400'
    },
    {
      name: 'LinkedIn',
      icon: LinkedinLogo,
      url: socialLinks.linkedin,
      color: 'hover:text-blue-500'
    },
    {
      name: 'YouTube',
      icon: YoutubeLogo,
      url: socialLinks.youtube,
      color: 'hover:text-red-500'
    },
    {
      name: 'TikTok',
      icon: TiktokLogo,
      url: socialLinks.tiktok,
      color: 'hover:text-white'
    }
  ];

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="text-sm text-muted-foreground">Sígueme:</span>
        {socialMedia
          .filter(social => ['Twitter', 'LinkedIn', 'YouTube'].includes(social.name) && social.url)
          .map((social) => (
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
          Conecta con Bruno
        </h3>
        <p className="text-sm text-muted-foreground">
          Sígueme en redes sociales para más contenido sobre IA
        </p>
      </div>
      <div className="flex items-center gap-4">
        {socialMedia
          .filter(social => ['Twitter', 'LinkedIn', 'YouTube', 'Instagram', 'TikTok'].includes(social.name) && social.url)
          .map((social) => (
            <Button
              key={social.name}
              variant="ghost"
              size="sm"
              className={`p-3 h-12 w-12 glass-effect hover:bg-primary/10 border [border-color:var(--border)] hover:[border-color:var(--primary)] ${social.color} transition-all duration-300 hover:scale-110 hover:-translate-y-1`}
              onClick={() => window.open(social.url, '_blank')}
              title={`Sígueme en ${social.name}`}
            >
              <social.icon size={24} weight="fill" />
            </Button>
          ))}
      </div>
    </div>
  );
}