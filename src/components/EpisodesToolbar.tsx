import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface EpisodesToolbarProps {
  total?: number;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  viewMode: 'cards' | 'list';
  setViewMode: Dispatch<SetStateAction<'cards' | 'list'>>;
}

export function EpisodesToolbar({
  total = 0,
  search,
  setSearch,
  pageSize,
  setPageSize,
  viewMode,
  setViewMode,
}: EpisodesToolbarProps) {
  return (
    <div className="w-full glass-effect border [border-color:var(--border)] rounded-xl p-3 md:p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left: Search + total */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar episodio…"
            className="pl-8"
          />
        </div>
        <Badge variant="outline" className="hidden md:inline-flex glass-effect border-primary/30 text-primary">
          {total} disponibles
        </Badge>
      </div>

      {/* Right: view + page size */}
      <div className="flex items-center gap-3 justify-end">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as 'cards' | 'list')}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="cards" aria-label="Vista de tarjetas">
            <LayoutGrid className="size-4" />
            <span className="hidden sm:inline">Tarjetas</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Vista de lista">
            <List className="size-4" />
            <span className="hidden sm:inline">Lista</span>
          </ToggleGroupItem>
        </ToggleGroup>

        <Select value={String(pageSize)} onValueChange={(v) => setPageSize(parseInt(v, 10))}>
          <SelectTrigger size="sm" aria-label="Cantidad a mostrar">
            <SelectValue placeholder="Cantidad" />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} episodios
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
