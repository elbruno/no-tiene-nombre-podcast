import { toast } from "sonner";

const useShare = () => {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Enlace copiado al portapapeles");
    } catch (error) {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const share = async (url: string, title: string, description: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        toast.success("¡Compartido!");
      } catch (error) {
        toast.error("No se pudo compartir");
        copy(url);
      }
    } else {
      toast.error("Compartir no soportado, se copia el enlace");
      copy(url);
    }
  };

  return { copy, share };
};

export default useShare;
