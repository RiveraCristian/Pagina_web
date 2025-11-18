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

      console.log('🔧 Admin API plugin configured');
      console.log(`   Data directory: ${dataDir}`);
      console.log(`   Uploads directory: ${uploadsDir}`);
    },
  };
}

export default adminApiPlugin;
