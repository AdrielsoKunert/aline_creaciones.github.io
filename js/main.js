// Aline Creaciones - Catálogo dinámico
// Lee products.json y arma las tarjetas de producto en el DOM.
//
// NOTA: por ahora solo está activa la funcionalidad de CATEGORÍAS
// (nombres y orden de los botones de filtro), que se leen de config.json
// para que se puedan administrar desde el panel de admin.
// El resto de lo que hacía config.json (logo, colores, footer, redes,
// SEO dinámico) está comentado más abajo, sin borrar, por si en el
// futuro se quiere volver a activar.

// Nombres por defecto si config.json no carga por algún motivo.
const NOMBRES_CATEGORIA_POR_DEFECTO = {
    'todos': 'Todos',
    'rosas-eternas': 'Rosas eternas',
    'girasoles': 'Girasoles',
    'lirios': 'Lirios',
    'individuales': 'Individuales',
    'con-peluche': 'Con peluche',
    'maquillaje': 'Maquillaje',
    'corazones': 'Corazones',
    'bouquets': 'Bouquets',
    'otros': 'Otros'
};

let config = null;
let productos = [];
let categoriaActiva = 'todos';

/* ============================================================
   BLOQUE COMENTADO: aplicación de empresa/colores/footer/redes/SEO
   desde config.json. Se deja el código por si se reactiva más
   adelante (junto con los ids correspondientes en index.html).
   ============================================================

const ICONOS_RED = {
    whatsapp: { icono: 'fab fa-whatsapp', color: '#25d366', label: 'WhatsApp' },
    facebook: { icono: 'fab fa-facebook-f', color: '#1877f2', label: 'Facebook' },
    instagram: { icono: 'fab fa-instagram', color: '#e4405f', label: 'Instagram' },
    tiktok: { icono: 'fab fa-tiktok', color: '#ffffff', label: 'TikTok' },
    youtube: { icono: 'fab fa-youtube', color: '#ff0000', label: 'YouTube' },
    twitter: { icono: 'fab fa-x-twitter', color: '#000000', label: 'X / Twitter' },
    telegram: { icono: 'fab fa-telegram', color: '#26a5e4', label: 'Telegram' }
};

function armarLinkWhatsappGenerico(numero, mensaje) {
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

function fijarTexto(id, texto) {
    const el = document.getElementById(id);
    if (!el) { console.warn(`main.js: no se encontró #${id} en el HTML`); return; }
    el.textContent = texto;
}

function fijarAtributo(id, atributo, valor) {
    const el = document.getElementById(id);
    if (!el) { console.warn(`main.js: no se encontró #${id} en el HTML`); return; }
    el.setAttribute(atributo, valor);
}

function aplicarColores(colores) {
    if (!colores) return;
    const root = document.documentElement;
    if (colores.principal) root.style.setProperty('--rosa-principal', colores.principal);
    if (colores.claro) root.style.setProperty('--rosa-claro', colores.claro);
    if (colores.dorado) root.style.setProperty('--dorado', colores.dorado);
    if (colores.oscuro) root.style.setProperty('--oscuro', colores.oscuro);
}

function aplicarMetaYFavicon(empresa) {
    if (!empresa) return;
    const tituloCompleto = `${empresa.nombre} - ${empresa.tituloCatalogo || 'Catálogo'}`;
    fijarTexto('meta-title', tituloCompleto);
    fijarAtributo('meta-description', 'content', empresa.descripcionSeo || '');
    fijarAtributo('og-title', 'content', tituloCompleto);
    fijarAtributo('og-description', 'content', empresa.descripcionFooter || empresa.descripcionSeo || '');
    if (empresa.logo) fijarAtributo('og-image', 'content', empresa.logo);
    if (empresa.favicon) fijarAtributo('favicon-icon', 'href', empresa.favicon);
    if (empresa.appleTouchIcon) fijarAtributo('favicon-apple', 'href', empresa.appleTouchIcon);
}

function aplicarHero(empresa) {
    if (!empresa) return;
    fijarAtributo('logo-img', 'src', empresa.logo || '');
    fijarAtributo('logo-img', 'alt', `${empresa.nombre} Logo`);
    fijarTexto('hero-titulo', empresa.tituloCatalogo || '');
    fijarTexto('hero-subtitulo', empresa.subtitulo || '');
}

function aplicarFooter(empresa, contacto, redes) {
    if (empresa) {
        fijarTexto('footer-marca', empresa.nombre || '');
        fijarTexto('footer-descripcion', empresa.descripcionFooter || '');
        fijarTexto('footer-copyright', empresa.copyright || '');
    }

    if (contacto) {
        fijarTexto('footer-direccion', contacto.direccionTexto || '');
        fijarAtributo('footer-direccion', 'href', contacto.mapsUrl || '#');

        if (contacto.whatsapp) {
            const linkWa = armarLinkWhatsappGenerico(contacto.whatsapp, `¡Hola! Quisiera hacer una consulta.`);
            fijarAtributo('footer-whatsapp', 'href', linkWa);
            fijarAtributo('whatsapp-flotante', 'href', linkWa);
        }
    }

    const contenedorRedes = document.getElementById('footer-redes');
    if (contenedorRedes && Array.isArray(redes)) {
        contenedorRedes.innerHTML = redes.map(red => {
            const info = ICONOS_RED[red.tipo] || { icono: 'fas fa-link', color: '#ffffff', label: red.tipo };
            return `<a href="${red.url}" target="_blank" rel="noopener" class="footer-red-icono" aria-label="${info.label}" style="--color-red:${info.color};"><i class="${info.icono}"></i></a>`;
        }).join('');
    }
}

   ============================================================
   FIN DEL BLOQUE COMENTADO
   ============================================================ */

async function cargarConfig() {
    try {
        const respuesta = await fetch('config.json');
        if (!respuesta.ok) throw new Error('No se pudo cargar config.json');
        config = await respuesta.json();
    } catch (error) {
        console.error(error);
        config = null;
    }

    // Por ahora solo usamos config.json para los nombres/orden de categorías.
    // aplicarColores(config && config.colores);
    // aplicarMetaYFavicon(config && config.empresa);
    // aplicarHero(config && config.empresa);
    // aplicarFooter(config && config.empresa, config && config.contacto, config && config.redes);
}

function armarLinkWhatsapp(producto) {
    const mensaje = `¡Hola! Me interesa este producto:\n${producto.name} - ${producto.price}\n¿Sigue disponible?`;
    const base = producto.whatsapp.split('?')[0];
    return `${base}?text=${encodeURIComponent(mensaje)}`;
}

function crearTarjeta(producto) {
    const descripcionHtml = producto.description
        ? `<p class="card-text text-muted small flex-grow-1" style="white-space: pre-line;">${producto.description}</p>`
        : `<p class="card-text text-muted small flex-grow-1"></p>`;

    const disponible = producto.disponible !== false;

    const badgeHtml = disponible
        ? `<span class="badge-new">Aline Creaciones</span>`
        : `<span class="badge-new badge-agotado">Agotado</span>`;

    const botonHtml = disponible
        ? `<a href="${armarLinkWhatsapp(producto)}" target="_blank" rel="noopener" class="btn-whatsapp mt-3">Consultar</a>`
        : `<span class="btn-whatsapp mt-3 btn-whatsapp-disabled">No disponible</span>`;

    return `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 ${disponible ? '' : 'card-agotada'}">
                <div class="img-wrapper">
                    <img src="${producto.image}" class="card-img-top" alt="${producto.alt || producto.name}" loading="lazy" width="400" height="350" data-id="${producto.id}">
                    ${badgeHtml}
                </div>
                <div class="card-body d-flex flex-column p-4">
                    <h5 class="card-title mb-2">${producto.name}</h5>
                    <span class="price-tag">${producto.price}</span>
                    ${descripcionHtml}
                    ${botonHtml}
                </div>
            </div>
        </div>
    `;
}

function renderizarCatalogo() {
    const contenedor = document.getElementById('catalogo');
    const estado = document.getElementById('estado-catalogo');

    const lista = categoriaActiva === 'todos'
        ? productos
        : productos.filter(p => p.category === categoriaActiva);

    if (lista.length === 0) {
        contenedor.innerHTML = '';
        estado.textContent = 'No hay productos en esta categoría por ahora.';
        estado.style.display = 'block';
        return;
    }

    estado.style.display = 'none';
    contenedor.innerHTML = lista.map(crearTarjeta).join('');
}

function renderizarFiltros() {
    // Nombres y orden de categorías: vienen de config.json > categorias
    // (así se pueden agregar/renombrar/reordenar desde el panel de admin).
    // Si config.json no cargó, se usan los nombres por defecto de arriba.
    const nombresCategoria = (config && config.categorias) || NOMBRES_CATEGORIA_POR_DEFECTO;
    const categoriasConProductos = new Set(productos.map(p => p.category));

    const categoriasPresentes = [
        'todos',
        ...Object.keys(nombresCategoria).filter(cat => cat !== 'todos' && categoriasConProductos.has(cat))
    ];

    const contenedor = document.getElementById('filtros');

    contenedor.innerHTML = categoriasPresentes.map(cat => `
        <button class="filtro-btn ${cat === categoriaActiva ? 'activo' : ''}" data-categoria="${cat}">
            ${nombresCategoria[cat] || cat}
        </button>
    `).join('');

    contenedor.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            categoriaActiva = btn.dataset.categoria;
            contenedor.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            renderizarCatalogo();
        });
    });
}

function abrirLightbox(producto) {
    document.getElementById('lightbox-imagen').src = producto.image;
    document.getElementById('lightbox-imagen').alt = producto.alt || producto.name;
    document.getElementById('lightbox-nombre').textContent = producto.name;
    document.getElementById('lightbox-precio').textContent = producto.price;

    const btnWhatsapp = document.getElementById('lightbox-whatsapp');
    const disponible = producto.disponible !== false;
    if (disponible) {
        btnWhatsapp.style.display = 'block';
        btnWhatsapp.href = armarLinkWhatsapp(producto);
    } else {
        btnWhatsapp.style.display = 'none';
    }

    document.getElementById('lightbox').classList.add('activo');
    document.body.style.overflow = 'hidden';
}

function cerrarLightbox() {
    document.getElementById('lightbox').classList.remove('activo');
    document.body.style.overflow = '';
}

function inicializarLightbox() {
    const overlay = document.getElementById('lightbox');
    const contenedor = document.getElementById('catalogo');

    contenedor.addEventListener('click', (e) => {
        const img = e.target.closest('.card-img-top');
        if (!img) return;
        const producto = productos.find(p => p.id === Number(img.dataset.id));
        if (producto) abrirLightbox(producto);
    });

    document.getElementById('lightbox-cerrar').addEventListener('click', cerrarLightbox);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarLightbox();
    });
}

async function iniciarCatalogo() {
    const estado = document.getElementById('estado-catalogo');

    await cargarConfig();

    try {
        const respuesta = await fetch('products.json');
        if (!respuesta.ok) throw new Error('No se pudo cargar products.json');
        productos = await respuesta.json();
        renderizarFiltros();
        renderizarCatalogo();
        inicializarLightbox();
    } catch (error) {
        console.error(error);
        estado.textContent = 'No se pudieron cargar los productos. Intentá recargar la página.';
        estado.style.display = 'block';
    }
}

function inicializarBotonArriba() {
    const boton = document.getElementById('btn-arriba');
    if (!boton) return;

    const alternarVisibilidad = () => {
        if (window.scrollY > 400) {
            boton.classList.add('visible');
        } else {
            boton.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', alternarVisibilidad);
    alternarVisibilidad();

    boton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarCatalogo();
    inicializarBotonArriba();
});