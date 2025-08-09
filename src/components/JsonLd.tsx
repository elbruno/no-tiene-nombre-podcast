import { useEffect } from 'react';

type JsonLdProps = {
  data: Record<string, any>;
};

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-ntn', 'episode-itemlist');
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
  return null;
}
