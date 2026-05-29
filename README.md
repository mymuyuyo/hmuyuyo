# Hostal Muyuyo - Guia digital

Sitio web estatico para la guia rapida de huespedes de Hostal Muyuyo en Galapagos.

Incluye secciones para buenas practicas de agua, energia y sanitarios, clasificacion de residuos, cuentas bancarias, emergencias y reglas del Parque Nacional Galapagos.

## Archivos principales

- `index.html`: pagina principal de la guia.
- `muyuyo-common.css`: estilos compartidos.
- `muyuyo-common.js`: comportamiento compartido.
- `Agua Energia Sanitarios/aeds.html`: buenas practicas de agua, energia y sanitarios.
- `Clasificacion Residuos/ClasificaR.HTML`: guia de clasificacion de residuos.
- `Cuentas Banco/QRcuentas.html`: informacion bancaria.
- `Emergencias/ecu911_emergencias.html`: contactos de emergencia.
- `ReglasPNG/ReglasPNG.HTML`: reglas del Parque Nacional Galapagos.

## Como abrir localmente

Abre `index.html` directamente en el navegador.

Tambien puedes usar un servidor local si quieres probarlo como sitio web:

```powershell
cd "C:\Users\SCHUBERT\Documents\Codex\MUYUYO"
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000/
```

## Publicacion en GitHub Pages

1. Sube este proyecto a un repositorio de GitHub.
2. En GitHub, entra a `Settings`.
3. Abre `Pages`.
4. En `Build and deployment`, selecciona `Deploy from a branch`.
5. Elige la rama `main` y la carpeta `/root`.
6. Guarda los cambios.

La pagina quedara disponible en una direccion similar a:

```text
https://USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/
```

## Idiomas

La guia detecta el idioma del navegador al abrirse. Desde el selector de idioma se puede cambiar manualmente.

## Notas

Este proyecto no necesita instalacion de dependencias ni proceso de compilacion.
