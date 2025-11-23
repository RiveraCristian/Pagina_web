/**
 * Vite Plugin - Admin API
 * 
 * Proporciona endpoints HTTP para que el panel admin pueda:
 * - Leer/escribir archivos JSON de configuración
 * - Subir imágenes
 * - Gestionar contenido en tiempo de desarrollo
 * 
 * Solo funciona en modo desarrollo (npm run dev)
 */

import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs/promises';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import path from 'path';

interface AdminApiOptions {
  dataDir?: string;
  uploadsDir?: string;
}

export function adminApiPlugin(options: AdminApiOptions = {}): Plugin {
  const dataDir = options.dataDir || path.join(process.cwd(), 'src/data');
  const uploadsDir = options.uploadsDir || path.join(process.cwd(), 'public/images/uploads');

  return {
    name: 'vite-plugin-admin-api',
    
    configureServer(server: ViteDevServer) {
      // ==================== UTILITY FUNCTIONS ====================

      /**
       * Leer body JSON de un request
       */
      async function readBody(req: any): Promise<any> {
        return new Promise((resolve, reject) => {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (error) {
              reject(new Error('Invalid JSON'));
            }
          });
          req.on('error', reject);
        });
      }

      /**
       * Enviar respuesta JSON
       */
      function sendJSON(res: any, data: any, status = 200) {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, 2));
      }

      /**
       * Enviar error
       */
      function sendError(res: any, message: string, status = 500) {
        console.error(`[Admin API Error] ${message}`);
        sendJSON(res, { error: message }, status);
      }

      /**
       * Asegurar que un directorio existe
       */
      async function ensureDir(dirPath: string) {
        if (!existsSync(dirPath)) {
          await fs.mkdir(dirPath, { recursive: true });
        }
      }

      // ==================== API ENDPOINTS ====================

      // POST /api/upload - Upload de imágenes (Base64 para admin)
      server.middlewares.use('/api/upload', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        
        try {
          console.log('📤 Upload request received - Content-Type:', req.headers['content-type']);
          
          // Verificar si es JSON (base64) o FormData
          const contentType = req.headers['content-type'] || '';
          
          if (contentType.includes('application/json')) {
            // Manejo de upload base64 desde admin
            const { fileName, fileData, fileType } = await readBody(req);
            
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
            if (!allowedTypes.includes(fileType)) {
              return sendError(res, 'Tipo de archivo no soportado', 400);
            }
            
            // Crear directorio de uploads si no existe
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            await ensureDir(uploadsDir);
            
            // Generar nombre único
            const timestamp = Date.now();
            const ext = path.extname(fileName);
            const uniqueFileName = `logo_${timestamp}${ext}`;
            const filePath = path.join(uploadsDir, uniqueFileName);
            
            // Convertir base64 a buffer y guardar
            const base64Data = fileData.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            await fs.writeFile(filePath, buffer);
            
            const publicPath = `/uploads/${uniqueFileName}`;
            console.log('✅ Image uploaded (base64):', publicPath);
            
            sendJSON(res, {
              success: true,
              path: publicPath,
              fileName: uniqueFileName
            });
          } else {
            // Redirigir a endpoint de FormData
            return next();
          }
        } catch (error: any) {
          console.error('❌ Upload error:', error);
          sendError(res, `Error al subir archivo: ${error.message}`);
        }
      });

      // GET/PUT /api/config - Leer/Guardar configuración
      server.middlewares.use('/api/config', async (req, res, next) => {
        const configPath = path.join(process.cwd(), 'src/data/config.json');
        
        if (req.method === 'GET') {
          try {
            // Verificar si el archivo existe
            await fs.access(configPath);
            const data = await fs.readFile(configPath, 'utf-8');
            sendJSON(res, JSON.parse(data));
          } catch (error: any) {
            console.log('⚠️ Config file not found, using existing file...');
            sendError(res, `Failed to read config: ${error.message}`);
          }
        } else if (req.method === 'PUT') {
          try {
            const config = await readBody(req);
            
            // Validar que el config no esté vacío
            if (!config || typeof config !== 'object') {
              throw new Error('Invalid configuration data');
            }
            
            // Crear directorio si no existe
            await fs.mkdir(path.dirname(configPath), { recursive: true });
            
            // Guardar configuración
            await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
            
            console.log('✅ Site config saved successfully to:', configPath);
            sendJSON(res, { success: true, message: 'Configuration updated successfully' });
          } catch (error: any) {
            console.error('❌ Error saving config:', error);
            sendError(res, `Failed to save config: ${error.message}`);
          }
        } else {
          return next();
        }
      });

      // El endpoint de guardado ahora está en PUT /api/config

      // GET /api/theme - Leer tema
      server.middlewares.use('/api/theme', async (req, res, next) => {
        if (req.method !== 'GET') return next();

        try {
          const themePath = path.join(dataDir, 'theme.json');
          const data = await fs.readFile(themePath, 'utf-8');
          sendJSON(res, JSON.parse(data));
        } catch (error: any) {
          sendError(res, `Failed to read theme: ${error.message}`);
        }
      });

      // POST /api/save-theme - Guardar tema
      server.middlewares.use('/api/save-theme', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          const theme = await readBody(req);
          const themePath = path.join(dataDir, 'theme.json');
          
          await fs.writeFile(themePath, JSON.stringify(theme, null, 2), 'utf-8');
          
          console.log('✅ Theme saved successfully');
          sendJSON(res, { success: true, message: 'Theme saved' });
        } catch (error: any) {
          sendError(res, `Failed to save theme: ${error.message}`);
        }
      });

      // GET /api/categories - Leer categorías
      server.middlewares.use('/api/categories', async (req, res, next) => {
        if (req.method !== 'GET') return next();

        try {
          const categoriesPath = path.join(dataDir, 'categories.json');
          const data = await fs.readFile(categoriesPath, 'utf-8');
          sendJSON(res, JSON.parse(data));
        } catch (error: any) {
          sendError(res, `Failed to read categories: ${error.message}`);
        }
      });

      // POST /api/save-categories - Guardar categorías
      server.middlewares.use('/api/save-categories', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          const categories = await readBody(req);
          const categoriesPath = path.join(dataDir, 'categories.json');
          
          await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2), 'utf-8');
          
          console.log('✅ Categories saved successfully');
          sendJSON(res, { success: true, message: 'Categories saved' });
        } catch (error: any) {
          sendError(res, `Failed to save categories: ${error.message}`);
        }
      });

      // GET /api/items/:categoryId - Leer items de una categoría
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET') return next();
        
        const match = req.url?.match(/^\/api\/items\/([^/?]+)(?:\?.*)?$/);
        if (!match) return next();

        const categoryId = decodeURIComponent(match[1]);
        try {
          const itemsPath = path.join(dataDir, 'items', `${categoryId}.json`);
          
          if (!existsSync(itemsPath)) {
            sendJSON(res, { items: [] });
            return;
          }

          const data = await fs.readFile(itemsPath, 'utf-8');
          const parsed = JSON.parse(data);
          sendJSON(res, parsed);
        } catch (error: any) {
          console.error(`❌ Error reading items for ${categoryId}:`, error);
          sendError(res, `Failed to read items for ${categoryId}: ${error.message}`);
        }
      });

      // POST /api/save-items/:categoryId - Guardar items de una categoría
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST') return next();

        const match = req.url?.match(/^\/api\/save-items\/([^/?]+)(?:\?.*)?$/);
        if (!match) return next();

        const categoryId = decodeURIComponent(match[1]);
        try {
          const items = await readBody(req);
          const itemsDir = path.join(dataDir, 'items');
          const itemsPath = path.join(itemsDir, `${categoryId}.json`);
          
          await ensureDir(itemsDir);
          await fs.writeFile(itemsPath, JSON.stringify(items, null, 2), 'utf-8');
          
          console.log(`✅ Saved ${items.items?.length || 0} items to ${categoryId}.json`);
          sendJSON(res, { success: true, message: `Items for ${categoryId} saved` });
        } catch (error: any) {
          console.error(`❌ Error saving items for ${categoryId}:`, error);
          sendError(res, `Failed to save items for ${categoryId}: ${error.message}`);
        }
      });

      // POST /api/upload/image - Subir imagen
      server.middlewares.use('/api/upload/image', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          let data = Buffer.alloc(0);
          
          req.on('data', (chunk: Buffer) => {
            data = Buffer.concat([data, chunk]);
          });

          req.on('end', async () => {
            try {
              const contentType = req.headers['content-type'] || '';
              
              if (!contentType.includes('multipart/form-data')) {
                sendError(res, 'Content-Type debe ser multipart/form-data', 400);
                return;
              }

              // Extraer boundary
              const boundaryMatch = contentType.match(/boundary=(.+)$/);
              if (!boundaryMatch) {
                sendError(res, 'Boundary no encontrado', 400);
                return;
              }

              const boundary = '--' + boundaryMatch[1];
              const parts = data.toString('binary').split(boundary);
              
              for (const part of parts) {
                if (!part.includes('Content-Disposition: form-data')) continue;
                if (!part.includes('filename=')) continue;

                // Extraer información del archivo
                const filenameMatch = part.match(/filename="([^"]+)"/);
                if (!filenameMatch) continue;

                const originalFilename = filenameMatch[1];
                
                // Validar extensión
                const ext = path.extname(originalFilename).toLowerCase();
                const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
                if (!allowedExts.includes(ext)) {
                  sendError(res, 'Tipo de archivo no permitido. Solo: JPG, PNG, GIF, WebP', 400);
                  return;
                }

                // Extraer contenido del archivo
                const headerEnd = part.indexOf('\r\n\r\n');
                if (headerEnd === -1) continue;

                const fileContent = part.substring(headerEnd + 4, part.length - 2); // -2 para quitar \r\n final
                const buffer = Buffer.from(fileContent, 'binary');

                // Validar tamaño (5MB máximo)
                const maxSize = 5 * 1024 * 1024;
                if (buffer.length > maxSize) {
                  sendError(res, 'Archivo muy grande. Máximo 5MB', 400);
                  return;
                }

                // Validar que sea una imagen real (magic bytes)
                const isValidImage = 
                  buffer.subarray(0, 4).equals(Buffer.from([0xFF, 0xD8, 0xFF])) || // JPEG
                  buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) || // PNG
                  buffer.subarray(0, 6).equals(Buffer.from([0x47, 0x49, 0x46, 0x38])); // GIF

                if (!isValidImage && ext !== '.webp') {
                  sendError(res, 'Archivo no es una imagen válida', 400);
                  return;
                }

                // Generar nombre único
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 9);
                const uniqueFilename = `${timestamp}-${randomStr}${ext}`;

                // Asegurar directorio y guardar
                await ensureDir(uploadsDir);
                const filePath = path.join(uploadsDir, uniqueFilename);
                await fs.writeFile(filePath, buffer);

                const publicUrl = `/images/uploads/${uniqueFilename}`;
                console.log(`✅ Imagen subida: ${publicUrl} (${(buffer.length / 1024).toFixed(1)}KB)`);
                
                sendJSON(res, {
                  success: true,
                  url: publicUrl,
                  filename: uniqueFilename,
                  originalName: originalFilename,
                  size: buffer.length,
                  sizeFormatted: `${(buffer.length / 1024).toFixed(1)}KB`
                });
                return;
              }

              sendError(res, 'No se encontró archivo en la petición', 400);
            } catch (error: any) {
              console.error('Error processing upload:', error);
              sendError(res, `Error al procesar archivo: ${error.message}`, 500);
            }
          });

          req.on('error', (error: any) => {
            console.error('Request error:', error);
            sendError(res, `Error en petición: ${error.message}`, 500);
          });

        } catch (error: any) {
          console.error('Upload handler error:', error);
          sendError(res, `Error al subir imagen: ${error.message}`, 500);
        }
      });

      // POST /api/delete-image - Eliminar imagen
      server.middlewares.use('/api/delete-image', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          const { url } = await readBody(req);
          
          // Extraer nombre de archivo de la URL
          const filename = path.basename(url);
          const filePath = path.join(uploadsDir, filename);

          if (existsSync(filePath)) {
            await fs.unlink(filePath);
            console.log(`✅ Image deleted: ${url}`);
            sendJSON(res, { success: true, message: 'Image deleted' });
          } else {
            sendError(res, 'Image not found', 404);
          }
        } catch (error: any) {
          sendError(res, `Failed to delete image: ${error.message}`);
        }
      });

      // POST /api/test-ai - Probar configuración de IA
      server.middlewares.use('/api/test-ai', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          const { query, config } = await readBody(req);
          
          if (!query) {
            sendError(res, 'Query is required', 400);
            return;
          }

          // Simular prueba de IA (en una implementación real, aquí llamarías a OpenAI)
          const mockResponse = {
            answer: `Respuesta simulada para: "${query}". Esta es una prueba del sistema de IA configurado.`,
            source: config?.openai?.enabled ? 'openai' : 'local',
            confidence: Math.random() * 0.4 + 0.6, // Entre 60% y 100%
            processingTime: Math.random() * 1000 + 500,
            tokens: config?.openai?.enabled ? {
              prompt: Math.floor(Math.random() * 50 + 20),
              completion: Math.floor(Math.random() * 100 + 50),
              total: Math.floor(Math.random() * 150 + 70)
            } : undefined
          };

          console.log(`🤖 AI Test: "${query}" -> ${mockResponse.source}`);
          sendJSON(res, { success: true, response: mockResponse });
        } catch (error: any) {
          sendError(res, `Failed to test AI: ${error.message}`);
        }
      });

      // GET /api/config/test - Verificar estado de configuración
      server.middlewares.use('/api/config/test', async (req, res, next) => {
        if (req.method !== 'GET') return next();
        
        try {
          const configPath = path.join(process.cwd(), 'src/data/config.json');
          const exists = await fs.access(configPath).then(() => true).catch(() => false);
          
          if (exists) {
            const stats = await fs.stat(configPath);
            const content = await fs.readFile(configPath, 'utf-8');
            
            sendJSON(res, {
              exists: true,
              path: configPath,
              size: stats.size,
              modified: stats.mtime,
              valid: true,
              preview: content.substring(0, 200)
            });
          } else {
            sendJSON(res, {
              exists: false,
              path: configPath,
              error: 'File not found'
            });
          }
        } catch (error: any) {
          sendJSON(res, {
            exists: false,
            error: error.message
          });
        }
      });

      // Configuración del sitio
      server.middlewares.use('/api/config/site', async (req, res, next) => {
        if (req.method !== 'GET') return next();
        
        try {
          const configPath = path.join(process.cwd(), 'src/data/config.json');
          const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
          sendJSON(res, {
            siteName: config.site?.name || 'Mi Sitio Web',
            siteSubtitle: config.site?.description || 'Sitio configurable',
            welcomeMessage: config.site?.tagline || 'Haz clic para comenzar'
          });
        } catch (error) {
          console.log('⚠️ Config site error:', error);
          sendJSON(res, {
            siteName: 'Colabi Spa',
            siteSubtitle: 'Sitio configurable', 
            welcomeMessage: 'Haz clic para comenzar'
          });
        }
      });

      server.middlewares.use('/api/config/empty-state', async (req, res, next) => {
        if (req.method !== 'GET') return next();
        
        try {
          const configPath = path.join(process.cwd(), 'src/data/config.json');
          const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
          sendJSON(res, {
            title: '¿Qué estás buscando?',
            description: config.site?.description || 'Explora nuestro contenido',
            suggestions: [
              '¿Qué servicios ofrecen?',
              'Cuéntame sobre sus proyectos',
              'Información de contacto',
              'Necesito ayuda'
            ]
          });
        } catch (error) {
          sendJSON(res, {
            title: '¿Qué estás buscando?',
            description: 'Explora nuestro contenido',
            suggestions: [
              '¿Qué servicios ofrecen?',
              'Cuéntame sobre sus proyectos', 
              'Información de contacto',
              'Necesito ayuda'
            ]
          });
        }
      });

      // GET /api/pages - Leer páginas
      server.middlewares.use('/api/pages', async (req, res, next) => {
        if (req.method !== 'GET') return next();

        try {
          const pagesPath = path.join(dataDir, 'pages.json');
          
          if (!existsSync(pagesPath)) {
            sendJSON(res, { pages: [] });
            return;
          }

          const data = await fs.readFile(pagesPath, 'utf-8');
          sendJSON(res, JSON.parse(data));
        } catch (error: any) {
          sendError(res, `Failed to read pages: ${error.message}`);
        }
      });

      // GET /api/pages/:id - Leer página específica
      server.middlewares.use('/api/pages/', async (req, res, next) => {
        if (req.method !== 'GET') return next();

        const match = req.url?.match(/^\/api\/pages\/([^/]+)$/);
        if (!match) return next();

        const pageId = match[1];

        try {
          const pagesPath = path.join(dataDir, 'pages.json');
          
          if (!existsSync(pagesPath)) {
            sendError(res, 'Page not found', 404);
            return;
          }

          const data = await fs.readFile(pagesPath, 'utf-8');
          const pagesData = JSON.parse(data);
          const page = pagesData.pages.find((p: any) => p.id === pageId);

          if (!page) {
            sendError(res, 'Page not found', 404);
            return;
          }

          sendJSON(res, page);
        } catch (error: any) {
          sendError(res, `Failed to read page: ${error.message}`);
        }
      });

      // POST /api/save-page - Guardar página
      server.middlewares.use('/api/save-page', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          const pageData = await readBody(req);
          const pagesPath = path.join(dataDir, 'pages.json');
          
          let pagesData = { pages: [] };
          
          // Cargar páginas existentes
          if (existsSync(pagesPath)) {
            const existingData = await fs.readFile(pagesPath, 'utf-8');
            pagesData = JSON.parse(existingData);
          }

          // Buscar si la página existe
          const existingIndex = pagesData.pages.findIndex((p: any) => p.id === pageData.id);
          
          if (existingIndex >= 0) {
            // Actualizar página existente
            pagesData.pages[existingIndex] = pageData;
          } else {
            // Agregar nueva página
            pagesData.pages.push(pageData);
          }

          await fs.writeFile(pagesPath, JSON.stringify(pagesData, null, 2), 'utf-8');
          
          console.log(`✅ Page saved: ${pageData.title}`);
          sendJSON(res, { success: true, message: 'Page saved', page: pageData });
        } catch (error: any) {
          sendError(res, `Failed to save page: ${error.message}`);
        }
      });

      // POST /api/delete-page - Eliminar página
      server.middlewares.use('/api/delete-page', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          const { id } = await readBody(req);
          const pagesPath = path.join(dataDir, 'pages.json');
          
          if (!existsSync(pagesPath)) {
            sendError(res, 'Page not found', 404);
            return;
          }

          const data = await fs.readFile(pagesPath, 'utf-8');
          const pagesData = JSON.parse(data);
          
          const originalLength = pagesData.pages.length;
          pagesData.pages = pagesData.pages.filter((p: any) => p.id !== id);
          
          if (pagesData.pages.length === originalLength) {
            sendError(res, 'Page not found', 404);
            return;
          }

          await fs.writeFile(pagesPath, JSON.stringify(pagesData, null, 2), 'utf-8');
          
          console.log(`✅ Page deleted: ${id}`);
          sendJSON(res, { success: true, message: 'Page deleted' });
        } catch (error: any) {
          sendError(res, `Failed to delete page: ${error.message}`);
        }
      });

      // Solo loguear operaciones importantes
      server.middlewares.use((req, res, next) => {
        if (req.url?.includes('save-') || req.url?.includes('upload')) {
          console.log(`💾 ${req.method} ${req.url}`);
        }
        next();
      });

      // TEST endpoint para verificar que las rutas funcionan
      server.middlewares.use('/api/test', async (req, res, next) => {
        if (req.method !== 'GET') return next();
        
        sendJSON(res, {
          status: 'API Working',
          method: req.method,
          url: req.url,
          timestamp: new Date().toISOString()
        });
      });

      console.log('🔧 Admin API plugin configured');
      console.log(`   Data directory: ${dataDir}`);
      console.log(`   Uploads directory: ${uploadsDir}`);
      console.log(`   API endpoints configured:`);
      console.log(`     GET  /api/test`);
      console.log(`     GET  /api/categories`);
      console.log(`     GET  /api/items/:categoryId`);
      console.log(`     POST /api/save-items/:categoryId`);
      console.log(`     POST /api/upload`);
      console.log(`     POST /api/upload/image`);
    },
  };
}

export default adminApiPlugin;
