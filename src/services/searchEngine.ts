/**
 * Motor de búsqueda local con procesamiento de lenguaje natural
 * Utiliza algoritmos de similitud textual y análisis semántico básico
 */

export interface SearchResult {
  content: any;
  score: number;
  relevance: number;
  matches: string[];
  explanation?: string;
  highlights?: { field: string; matches: string[] }[];
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  fuzzy?: boolean;
  categories?: string[];
  sortBy?: 'relevance' | 'date' | 'popularity' | 'alphabetical';
  facets?: boolean;
  includeStats?: boolean;
  boostFields?: Record<string, number>;
}

export interface SearchStats {
  totalResults: number;
  processingTime: number;
  indexSize: number;
  queryComplexity: number;
  topCategories: Array<{ category: string; count: number }>;
}

export interface SynonymMap {
  [key: string]: string[];
}

class SearchEngine {
  private index: Map<string, Set<number>> = new Map();
  private contentArray: any[] = [];
  private categoryIndex: Map<string, Set<number>> = new Map();
  private dateIndex: Map<string, Set<number>> = new Map();
  private popularityScores: Map<number, number> = new Map();
  
  private stopWords = new Set([
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le',
    'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'sus',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'muy', 'más', 'como', 'todo', 'hasta', 'esto', 'ese', 'esa', 'han', 'está', 'ser'
  ]);
  
  private synonyms: SynonymMap = {
    'programación': ['código', 'desarrollo', 'software', 'coding', 'dev'],
    'diseño': ['design', 'ui', 'ux', 'gráfico', 'visual'],
    'web': ['website', 'sitio', 'página', 'internet', 'online'],
    'móvil': ['mobile', 'app', 'aplicación', 'smartphone', 'celular'],
    'datos': ['data', 'información', 'analytics', 'estadísticas'],
    'inteligencia': ['ia', 'ai', 'machine learning', 'ml', 'artificial'],
    'empresa': ['negocio', 'business', 'corporativo', 'comercial'],
    'educación': ['educativo', 'escuela', 'colegio', 'universidad', 'académico']
  };
  
  private fieldBoosts = {
    'nombre': 2.0,
    'titulo': 2.0,
    'title': 2.0,
    'descripcion': 1.5,
    'description': 1.5,
    'categoria': 1.3,
    'tecnologias': 1.2,
    'keywords': 1.8
  };

  /**
   * Indexar contenido para búsqueda rápida
   */
  indexContent(content: any[]) {
    const startTime = Date.now();
    this.contentArray = content;
    this.index.clear();
    this.categoryIndex.clear();
    this.dateIndex.clear();
    this.popularityScores.clear();

    content.forEach((item, index) => {
      // Crear texto indexable combinando todos los campos relevantes
      const searchableText = this.extractSearchableText(item);
      
      // Tokenizar y normalizar
      const tokens = this.tokenize(searchableText);
      
      // Indexar por tokens principales
      tokens.forEach(token => {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token)!.add(index);
        
        // Agregar sinónimos al índice
        this.addSynonymsToIndex(token, index);
      });
      
      // Indexar por categoría
      const category = item.categoria || item.category || 'general';
      if (!this.categoryIndex.has(category)) {
        this.categoryIndex.set(category, new Set());
      }
      this.categoryIndex.get(category)!.add(index);
      
      // Indexar por fecha
      const date = item.fecha || item.date || item.createdAt;
      if (date) {
        const dateKey = new Date(date).toISOString().split('T')[0];
        if (!this.dateIndex.has(dateKey)) {
          this.dateIndex.set(dateKey, new Set());
        }
        this.dateIndex.get(dateKey)!.add(index);
      }
      
      // Calcular score de popularidad
      const popularity = this.calculatePopularityScore(item);
      this.popularityScores.set(index, popularity);
    });

    const indexTime = Date.now() - startTime;
    console.log(`🔍 Enhanced indexing completed:`);
    console.log(`   - ${content.length} items indexed`);
    console.log(`   - ${this.index.size} unique tokens`);
    console.log(`   - ${this.categoryIndex.size} categories`);
    console.log(`   - ${indexTime}ms indexing time`);
  }

  /**
   * Agregar sinónimos al índice
   */
  private addSynonymsToIndex(token: string, itemIndex: number) {
    Object.entries(this.synonyms).forEach(([mainTerm, synonymList]) => {
      if (synonymList.includes(token) || mainTerm === token) {
        // Agregar el término principal y todos sus sinónimos
        const allTerms = [mainTerm, ...synonymList];
        allTerms.forEach(synonym => {
          if (!this.index.has(synonym)) {
            this.index.set(synonym, new Set());
          }
          this.index.get(synonym)!.add(itemIndex);
        });
      }
    });
  }

  /**
   * Calcular score de popularidad
   */
  private calculatePopularityScore(item: any): number {
    let score = 0.5; // Base score
    
    // Factores de popularidad
    if (item.views) score += Math.log(item.views + 1) * 0.1;
    if (item.likes) score += Math.log(item.likes + 1) * 0.15;
    if (item.downloads) score += Math.log(item.downloads + 1) * 0.12;
    if (item.stars) score += item.stars * 0.1;
    
    // Recencia (más reciente = más popular)
    const date = new Date(item.fecha || item.date || item.createdAt || Date.now());
    const daysSinceCreation = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysSinceCreation / 365); // Decae en un año
    score += recencyScore * 0.3;
    
    return Math.min(score, 2.0); // Máximo 2.0
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
   * Obtener facetas de búsqueda
   */
  getFacets(query: string = ''): Record<string, Array<{ value: string; count: number }>> {
    const results = query ? this.search(query, { limit: 1000 }) : 
                   this.contentArray.map((content, index) => ({ content, score: 1, relevance: 1, matches: [] }));
    
    const facets: Record<string, Map<string, number>> = {
      categories: new Map(),
      years: new Map(),
      technologies: new Map()
    };
    
    results.forEach(result => {
      const item = result.content;
      
      // Categorías
      const category = item.categoria || item.category || 'General';
      facets.categories.set(category, (facets.categories.get(category) || 0) + 1);
      
      // Años
      const date = item.fecha || item.date || item.createdAt;
      if (date) {
        const year = new Date(date).getFullYear().toString();
        facets.years.set(year, (facets.years.get(year) || 0) + 1);
      }
      
      // Tecnologías
      const techs = item.tecnologias || item.technologies || [];
      if (Array.isArray(techs)) {
        techs.forEach((tech: string) => {
          facets.technologies.set(tech, (facets.technologies.get(tech) || 0) + 1);
        });
      }
    });
    
    // Convertir a formato final
    const finalFacets: Record<string, Array<{ value: string; count: number }>> = {};
    
    Object.entries(facets).forEach(([key, valueMap]) => {
      finalFacets[key] = Array.from(valueMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 por categoría
    });
    
    return finalFacets;
  }

  /**
   * Obtener estadísticas detalladas
   */
  getSearchStats(query: string): SearchStats {
    const startTime = Date.now();
    const results = this.search(query, { limit: 1000, includeStats: true });
    const processingTime = Date.now() - startTime;
    
    const categories = new Map<string, number>();
    results.forEach(result => {
      const category = result.content.categoria || result.content.category || 'General';
      categories.set(category, (categories.get(category) || 0) + 1);
    });
    
    return {
      totalResults: results.length,
      processingTime,
      indexSize: this.index.size,
      queryComplexity: this.tokenize(query).length,
      topCategories: Array.from(categories.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    };
  }

  /**
   * Búsqueda de sugerencias (autocompletado) mejorada
   */
  getSuggestions(partial: string, limit: number = 8): string[] {
    const normalized = this.normalizeText(partial);
    const suggestions: Array<{ term: string; frequency: number }> = [];

    this.index.forEach((indices, token) => {
      if (token.startsWith(normalized) && token.length > normalized.length) {
        suggestions.push({
          term: token,
          frequency: indices.size
        });
      }
    });

    // Ordenar por frecuencia y longitud
    return suggestions
      .sort((a, b) => {
        if (a.frequency !== b.frequency) return b.frequency - a.frequency;
        return a.term.length - b.term.length;
      })
      .slice(0, limit)
      .map(s => s.term);
  }

  /**
   * Búsqueda por categoría específica
   */
  searchByCategory(category: string, query: string = '', options: SearchOptions = {}): SearchResult[] {
    const categoryIndices = this.categoryIndex.get(category);
    if (!categoryIndices) return [];
    
    if (!query.trim()) {
      // Devolver todos los elementos de la categoría
      return Array.from(categoryIndices).map(index => ({
        content: this.contentArray[index],
        score: this.popularityScores.get(index) || 0.5,
        relevance: 0.5,
        matches: []
      })).slice(0, options.limit || 10);
    }
    
    // Buscar dentro de la categoría
    return this.search(query, { ...options, categories: [category] });
  }

  /**
   * Encontrar elementos similares a uno dado
   */
  findSimilar(itemId: string, limit: number = 5): SearchResult[] {
    const targetItem = this.contentArray.find(item => 
      item.id === itemId || item._id === itemId);
    
    if (!targetItem) return [];
    
    const targetCategory = targetItem.categoria || targetItem.category;
    const targetTechs = targetItem.tecnologias || targetItem.technologies || [];
    const targetText = this.extractSearchableText(targetItem);
    
    const similarities: Array<{ index: number; score: number }> = [];
    
    this.contentArray.forEach((item, index) => {
      if (item === targetItem) return; // Skip mismo elemento
      
      let similarityScore = 0;
      
      // Similitud por categoría
      if ((item.categoria || item.category) === targetCategory) {
        similarityScore += 0.4;
      }
      
      // Similitud por tecnologías
      const itemTechs = item.tecnologias || item.technologies || [];
      const commonTechs = targetTechs.filter((tech: string) => 
        itemTechs.includes(tech));
      similarityScore += (commonTechs.length / Math.max(targetTechs.length, itemTechs.length)) * 0.3;
      
      // Similitud textual básica
      const itemText = this.extractSearchableText(item);
      const commonWords = this.tokenize(targetText).filter(word => 
        this.tokenize(itemText).includes(word));
      const textSimilarity = commonWords.length / Math.max(
        this.tokenize(targetText).length, 
        this.tokenize(itemText).length
      );
      similarityScore += textSimilarity * 0.3;
      
      if (similarityScore > 0.1) {
        similarities.push({ index, score: similarityScore });
      }
    });
    
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ index, score }) => ({
        content: this.contentArray[index],
        score,
        relevance: score,
        matches: []
      }));
  }

  /**
   * Obtener tendencias de búsqueda
   */
  getTrends(timeframe: 'day' | 'week' | 'month' = 'week'): Array<{ term: string; frequency: number; growth: number }> {
    // Por ahora retorna términos más comunes del índice
    const termFrequencies = new Map<string, number>();
    
    this.index.forEach((indices, term) => {
      if (term.length > 3 && !this.stopWords.has(term)) {
        termFrequencies.set(term, indices.size);
      }
    });
    
    return Array.from(termFrequencies.entries())
      .map(([term, frequency]) => ({
        term,
        frequency,
        growth: Math.random() * 0.5 - 0.25 // Simulado por ahora
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }
}

export const searchEngine = new SearchEngine();