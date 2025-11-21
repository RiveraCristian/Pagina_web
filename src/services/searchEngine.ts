/**
 * Motor de búsqueda local con procesamiento de lenguaje natural
 * Utiliza algoritmos de similitud textual y análisis semántico básico
 */

export interface SearchResult {
  content: any;
  score: number;
  relevance: number;
  matches: string[];
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  fuzzy?: boolean;
  categories?: string[];
}

class SearchEngine {
  private index: Map<string, any> = new Map();
  private contentArray: any[] = [];
  private stopWords = new Set([
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le',
    'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'sus',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'
  ]);

  /**
   * Indexar contenido para búsqueda rápida
   */
  indexContent(content: any[]) {
    this.contentArray = content;
    this.index.clear();

    content.forEach((item, index) => {
      // Crear texto indexable combinando todos los campos relevantes
      const searchableText = this.extractSearchableText(item);
      
      // Tokenizar y normalizar
      const tokens = this.tokenize(searchableText);
      
      // Indexar por tokens
      tokens.forEach(token => {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token)!.add(index);
      });
    });

    console.log(`🔍 Indexed ${content.length} items with ${this.index.size} unique tokens`);
  }

  /**
   * Búsqueda principal con scoring inteligente
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const {
      limit = 10,
      threshold = 0.2,
      fuzzy = true,
      categories = []
    } = options;

    if (!query.trim()) return [];

    // Normalizar consulta
    const normalizedQuery = this.normalizeText(query);
    const queryTokens = this.tokenize(normalizedQuery);
    
    // Encontrar candidatos
    const candidates = this.findCandidates(queryTokens, fuzzy);
    
    // Calcular scores
    const scoredResults: SearchResult[] = [];
    
    candidates.forEach(index => {
      const item = this.contentArray[index];
      
      // Filtrar por categorías si se especifican
      if (categories.length > 0 && item.categoria && !categories.includes(item.categoria)) {
        return;
      }

      const score = this.calculateScore(item, queryTokens, normalizedQuery);
      
      if (score >= threshold) {
        scoredResults.push({
          content: item,
          score,
          relevance: score,
          matches: this.findMatches(item, queryTokens)
        });
      }
    });

    // Ordenar por score descendente
    scoredResults.sort((a, b) => b.score - a.score);

    return scoredResults.slice(0, limit);
  }

  /**
   * Búsqueda por similitud semántica básica
   */
  semanticSearch(query: string, options: SearchOptions = {}): SearchResult[] {
    const results = this.search(query, options);
    
    // Aplicar scoring semántico adicional
    results.forEach(result => {
      result.score = this.enhanceSemanticScore(result.content, query, result.score);
    });

    // Reordenar con nuevo scoring
    results.sort((a, b) => b.score - a.score);
    
    return results;
  }

  /**
   * Extraer texto indexable de un item
   */
  private extractSearchableText(item: any): string {
    const fields = ['nombre', 'titulo', 'title', 'name', 'descripcion', 'description', 
                   'contenido', 'content', 'tecnologias', 'technologies', 'categoria', 
                   'category', 'tags', 'palabrasClave', 'keywords'];
    
    let text = '';
    
    fields.forEach(field => {
      if (item[field]) {
        if (Array.isArray(item[field])) {
          text += ' ' + item[field].join(' ');
        } else {
          text += ' ' + item[field];
        }
      }
    });

    // También extraer de objetos anidados comunes
    if (item.data) {
      text += ' ' + this.extractSearchableText(item.data);
    }

    return text;
  }

  /**
   * Tokenizar y limpiar texto
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\sñáéíóúü]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2 && !this.stopWords.has(token))
      .map(token => this.normalizeText(token));
  }

  /**
   * Normalizar texto (acentos, etc.)
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
  }

  /**
   * Encontrar candidatos usando índice invertido
   */
  private findCandidates(queryTokens: string[], fuzzy: boolean): Set<number> {
    const candidates = new Set<number>();

    queryTokens.forEach(token => {
      // Búsqueda exacta
      if (this.index.has(token)) {
        this.index.get(token)!.forEach((index: number) => candidates.add(index));
      }

      // Búsqueda difusa si está habilitada
      if (fuzzy) {
        this.index.forEach((indices, indexedToken) => {
          if (this.calculateLevenshteinDistance(token, indexedToken) <= 2) {
            indices.forEach((index: number) => candidates.add(index));
          }
        });
      }
    });

    return candidates;
  }

  /**
   * Calcular score de relevancia para un item
   */
  private calculateScore(item: any, queryTokens: string[], fullQuery: string): number {
    const searchableText = this.extractSearchableText(item).toLowerCase();
    let score = 0;

    // Puntuación por coincidencia exacta de consulta completa
    if (searchableText.includes(fullQuery.toLowerCase())) {
      score += 1.0;
    }

    // Puntuación por tokens individuales
    queryTokens.forEach(token => {
      if (searchableText.includes(token)) {
        score += 0.5;
      }
    });

    // Bonificación por campos importantes
    const title = (item.nombre || item.titulo || item.title || '').toLowerCase();
    const description = (item.descripcion || item.description || '').toLowerCase();

    queryTokens.forEach(token => {
      if (title.includes(token)) {
        score += 0.3; // Título vale más
      }
      if (description.includes(token)) {
        score += 0.2; // Descripción vale algo
      }
    });

    // Normalizar score
    const maxPossibleScore = 1.0 + (queryTokens.length * 0.5) + (queryTokens.length * 0.5);
    return Math.min(score / maxPossibleScore, 1.0);
  }

  /**
   * Mejoras semánticas al scoring
   */
  private enhanceSemanticScore(item: any, query: string, baseScore: number): number {
    let enhancedScore = baseScore;

    // Detectar intención de búsqueda
    const queryLower = query.toLowerCase();
    
    // Búsquedas de proyectos
    if (queryLower.includes('proyecto') && (item.categoria === 'proyectos' || item.type === 'project')) {
      enhancedScore += 0.2;
    }

    // Búsquedas de servicios
    if (queryLower.includes('servicio') && (item.categoria === 'servicios' || item.type === 'service')) {
      enhancedScore += 0.2;
    }

    // Búsquedas por tecnología
    const techTerms = ['react', 'javascript', 'python', 'node', 'vue', 'angular', 'typescript'];
    techTerms.forEach(tech => {
      if (queryLower.includes(tech) && 
          JSON.stringify(item).toLowerCase().includes(tech)) {
        enhancedScore += 0.15;
      }
    });

    return Math.min(enhancedScore, 1.0);
  }

  /**
   * Encontrar matches específicos para highlighting
   */
  private findMatches(item: any, queryTokens: string[]): string[] {
    const searchableText = this.extractSearchableText(item);
    const matches: string[] = [];

    queryTokens.forEach(token => {
      const regex = new RegExp(`\\b${token}\\w*`, 'gi');
      const found = searchableText.match(regex);
      if (found) {
        matches.push(...found);
      }
    });

    return [...new Set(matches)]; // Remover duplicados
  }

  /**
   * Calcular distancia de Levenshtein para búsqueda difusa
   */
  private calculateLevenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Obtener estadísticas del índice
   */
  getIndexSize(): number {
    return this.index.size;
  }

  /**
   * Limpiar índice
   */
  clear() {
    this.index.clear();
    this.contentArray = [];
  }

  /**
   * Búsqueda de sugerencias (autocompletado)
   */
  getSuggestions(partial: string, limit: number = 5): string[] {
    const normalized = this.normalizeText(partial);
    const suggestions: string[] = [];

    this.index.forEach((_, token) => {
      if (token.startsWith(normalized) && suggestions.length < limit) {
        suggestions.push(token);
      }
    });

    return suggestions;
  }
}

export const searchEngine = new SearchEngine();