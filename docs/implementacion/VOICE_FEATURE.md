# 🎤 Entrada por Voz - Documentación

## Descripción General

La aplicación ahora soporta **entrada de texto por voz** además de la entrada manual por teclado. Los usuarios pueden hacer clic en el botón del micrófono y hablar para realizar búsquedas.

## 🛠️ Tecnología Utilizada

### Web Speech API
- **API Nativa del navegador** - No requiere instalaciones adicionales
- **SpeechRecognition** - Convierte voz en texto en tiempo real
- **Gratis y sin límites** - No requiere keys de API

### Compatibilidad de Navegadores

✅ **Totalmente compatible:**
- Google Chrome (Desktop y Android)
- Microsoft Edge
- Safari (iOS 14.5+)
- Samsung Internet

⚠️ **Compatibilidad limitada:**
- Firefox (solo en Android, no en Desktop)

❌ **No compatible:**
- Internet Explorer
- Navegadores antiguos

## 📁 Archivos Agregados

### 1. Hook personalizado: `useSpeechRecognition.ts`
**Ubicación:** `src/hooks/useSpeechRecognition.ts`

Responsabilidades:
- Inicializar Web Speech API
- Gestionar estados de escucha
- Capturar transcripciones
- Manejar errores y permisos
- Configuración de idioma (español)

### 2. Componente: `VoiceButton.tsx`
**Ubicación:** `src/components/VoiceButton.tsx`

Características:
- Botón de micrófono con icono SVG
- Animación de pulso cuando está escuchando
- Indicadores visuales (barras animadas)
- Estados: normal / escuchando

### 3. Tipos TypeScript: `speech-recognition.d.ts`
**Ubicación:** `src/types/speech-recognition.d.ts`

Define los tipos de la Web Speech API que no están incluidos por defecto en TypeScript.

### 4. Estilos: `VoiceButton.css`
**Ubicación:** `src/styles/VoiceButton.css`

Estilos del botón, animaciones y efectos visuales.

## 🎨 Cambios en Componentes Existentes

### PromptBox.tsx (Actualizado)
- ✅ Integra el hook `useSpeechRecognition`
- ✅ Muestra el `VoiceButton`
- ✅ Auto-envía la consulta después de recibir transcript
- ✅ Muestra mensajes de estado (escuchando, errores)
- ✅ Deshabilita input mientras escucha

### PromptBox.css (Actualizado)
- ✅ Diseño flexible para input + botón
- ✅ Animaciones para mensajes de voz
- ✅ Estilos responsive

## 🎯 Cómo Funciona

### Flujo de Usuario

1. **Usuario hace clic en el logo** → Aparece el input de búsqueda
2. **Opción A - Escribir:**
   - Usuario escribe en el input
   - Presiona Enter
   - Se envía la consulta
   
3. **Opción B - Hablar:**
   - Usuario hace clic en el botón de micrófono 🎤
   - El navegador solicita permiso al micrófono (primera vez)
   - El botón se pone rojo y pulsa
   - Usuario habla: "soy corredor de seguros"
   - La voz se convierte a texto automáticamente
   - El texto aparece en el input
   - Se envía automáticamente después de 500ms

### Flujo Técnico

```
Usuario click → startListening() 
              → SpeechRecognition.start()
              → Navegador escucha
              → onresult recibe transcript
              → setTranscript(text)
              → useEffect detecta cambio
              → setQuery(transcript)
              → setTimeout 500ms
              → onSubmit(transcript)
```

## ⚙️ Configuración

### Idioma
Por defecto está configurado en **español (es-ES)**. 

Para cambiar el idioma, edita `src/hooks/useSpeechRecognition.ts`:

```typescript
recognitionInstance.lang = 'en-US';  // Inglés
recognitionInstance.lang = 'pt-BR';  // Portugués
recognitionInstance.lang = 'fr-FR';  // Francés
```

### Comportamiento
**Actual:** Se detiene automáticamente después de una frase (`continuous: false`)

Para grabación continua:
```typescript
recognitionInstance.continuous = true;
```

### Resultados intermedios
**Actual:** Solo muestra el resultado final (`interimResults: false`)

Para ver transcripción en tiempo real:
```typescript
recognitionInstance.interimResults = true;
```

## 🔒 Permisos

### Primera vez
El navegador solicitará permiso para acceder al micrófono:

- **Permitir** → Funciona correctamente
- **Denegar** → Se muestra mensaje de error

### Permisos denegados
Si el usuario denegó el permiso, debe ir a:

**Chrome/Edge:**
1. Configuración del sitio (🔒 en la barra de direcciones)
2. Permisos → Micrófono
3. Cambiar a "Permitir"

**Safari:**
1. Safari → Preferencias → Sitios web
2. Micrófono → Permitir

## 🐛 Manejo de Errores

### Errores comunes y soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `not-allowed` | Permiso denegado | Permitir micrófono en configuración |
| `no-speech` | No se detectó voz | Hablar más cerca del micrófono |
| `audio-capture` | Micrófono no disponible | Verificar hardware |
| `network` | Sin conexión | Verificar internet (algunos navegadores) |
| `not-supported` | Navegador incompatible | Usar Chrome, Edge o Safari |

## 💡 Mejoras Futuras

### Posibles implementaciones:

1. **Múltiples idiomas**
   - Selector de idioma en UI
   - Detección automática del idioma del navegador

2. **Comandos de voz**
   - "Borrar" → Limpiar el input
   - "Enviar" → Enviar consulta
   - "Cancelar" → Detener grabación

3. **Feedback visual mejorado**
   - Nivel de volumen en tiempo real
   - Visualización de ondas de audio
   - Transcripción en tiempo real

4. **Historial de búsquedas por voz**
   - Guardar las últimas búsquedas
   - Sugerencias basadas en historial

5. **Integración con IA más avanzada**
   - Procesamiento de lenguaje natural
   - Entender contexto y sinónimos
   - Preguntas de seguimiento

## 📝 Notas Importantes

- ⚠️ **Privacidad:** La voz NO se envía a servidores externos. Todo el procesamiento es local en el navegador.
- 🌐 **Chrome en producción:** Requiere HTTPS (no funciona con HTTP simple)
- 📱 **Mobile:** Funciona excelente en Chrome Android y Safari iOS
- 🔋 **Batería:** El uso del micrófono consume batería en dispositivos móviles
- 🎯 **Precisión:** Depende de:
  - Calidad del micrófono
  - Ruido ambiental
  - Claridad al hablar
  - Acento del usuario

## 🧪 Testing

### Para probar la funcionalidad:

1. Abre la app en Chrome/Edge: http://localhost:5174/
2. Haz clic en el logo
3. Haz clic en el botón del micrófono
4. Permite el acceso al micrófono
5. Di una frase de prueba:
   - "Soy corredor de seguros"
   - "Necesito una plataforma educativa"
   - "Trabajo en el gobierno"
6. Observa cómo se convierte a texto y envía automáticamente

### Debug

Para ver logs en consola, revisa:
```javascript
console.log('Transcript recibido:', transcript);
console.log('Error de voz:', event.error);
```

## 📚 Referencias

- [MDN - Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Can I Use - Speech Recognition](https://caniuse.com/speech-recognition)
- [W3C Specification](https://wicg.github.io/speech-api/)
