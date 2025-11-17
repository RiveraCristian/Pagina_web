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
import path from 'path';
import { existsSync } from 'fs';

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

      // GET /api/config - Leer configuración
      server.middlewares.use('/api/config', async (req, res, next) => {
        if (req.method !== 'GET') return next();

        try {
          const configPath = path.join(dataDir, 'config.json');
          const data = await fs.readFile(configPath, 'utf-8');
          sendJSON(res, JSON.parse(data));
        } catch (error: any) {
          sendError(res, `Failed to read config: ${error.message}`);
        }
      });

      // POST /api/save-config - Guardar configuración
      server.middlewares.use('/api/save-config', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          const config = await readBody(req);
          const configPath = path.join(dataDir, 'config.json');
          
          await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
          
          console.log('✅ Config saved successfully');
          sendJSON(res, { success: true, message: 'Config saved' });
        } catch (error: any) {
          sendError(res, `Failed to save config: ${error.message}`);
        }
      });

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
      server.middlewares.use('/api/items/', async (req, res, next) => {
        if (req.method !== 'GET') return next();

        const match = req.url?.match(/^\/api\/items\/([^/]+)$/);
        if (!match) return next();

        const categoryId = match[1];

        try {
          const itemsPath = path.join(dataDir, 'items', `${categoryId}.json`);
          
          if (!existsSync(itemsPath)) {
            sendJSON(res, { items: [] });
            return;
          }

          const data = await fs.readFile(itemsPath, 'utf-8');
          sendJSON(res, JSON.parse(data));
        } catch (error: any) {
          sendError(res, `Failed to read items for ${categoryId}: ${error.message}`);
        }
      });

      // POST /api/save-items/:categoryId - Guardar items de una categoría
      server.middlewares.use('/api/save-items/', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        const match = req.url?.match(/^\/api\/save-items\/([^/]+)$/);
        if (!match) return next();

        const categoryId = match[1];

        try {
          const items = await readBody(req);
          const itemsDir = path.join(dataDir, 'items');
          const itemsPath = path.join(itemsDir, `${categoryId}.json`);
          
          await ensureDir(itemsDir);
          await fs.writeFile(itemsPath, JSON.stringify(items, null, 2), 'utf-8');
          
          console.log(`✅ Items for ${categoryId} saved successfully`);
          sendJSON(res, { success: true, message: `Items for ${categoryId} saved` });
        } catch (error: any) {
          sendError(res, `Failed to save items for ${categoryId}: ${error.message}`);
        }
      });

      // POST /api/upload-image - Subir imagen
      server.middlewares.use('/api/upload-image', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        try {
          // Parse multipart form data (simplificado)
          // En producción, usar una librería como 'formidable' o 'busboy'
          let data = Buffer.alloc(0);
          
          req.on('data', (chunk: Buffer) => {
            data = Buffer.concat([data, chunk]);
          });

          req.on('end', async () => {
            try {
              // Extraer archivo del multipart (simplificado)
              const boundary = req.headers['content-type']?.split('boundary=')[1];
              if (!boundary) {
                sendError(res, 'Invalid content-type', 400);
                return;
              }

              const parts = data.toString('binary').split(`--${boundary}`);
              
              for (const part of parts) {
                if (part.includes('filename=')) {
                  const filenameMatch = part.match(/filename="([^"]+)"/);
                  if (!filenameMatch) continue;

                  const filename = filenameMatch[1];
                  const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);
                  
                  if (!contentTypeMatch) continue;

                  // Extraer contenido binario del archivo
                  const contentStart = part.indexOf('\r\n\r\n') + 4;
                  const contentEnd = part.lastIndexOf('\r\n');
                  const fileContent = part.substring(contentStart, contentEnd);

                  // Generar nombre único
                  const timestamp = Date.now();
                  const ext = path.extname(filename);
                  const uniqueFilename = `${timestamp}-${Math.random().toString(36).substring(2, 9)}${ext}`;

                  // Guardar archivo
                  await ensureDir(uploadsDir);
                  const filePath = path.join(uploadsDir, uniqueFilename);
                  
                  // Convertir de binary string a Buffer
                  const buffer = Buffer.from(fileContent, 'binary');
                  await fs.writeFile(filePath, buffer);

                  const publicUrl = `/images/uploads/${uniqueFilename}`;
                  console.log(`✅ Image uploaded: ${publicUrl}`);
                  
                  sendJSON(res, {
                    success: true,
                    url: publicUrl,
                    filename: uniqueFilename,
                    size: buffer.length,
                  });
                  return;
                }
              }

              sendError(res, 'No file found in request', 400);
            } catch (error: any) {
              sendError(res, `Failed to process upload: ${error.message}`);
            }
          });
        } catch (error: any) {
          sendError(res, `Failed to upload image: ${error.message}`);
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

      console.log('🔧 Admin API plugin configured');
      console.log(`   Data directory: ${dataDir}`);
      console.log(`   Uploads directory: ${uploadsDir}`);
    },
  };
}

export default adminApiPlugin;
