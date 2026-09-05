// Aline Creaciones - Catálogo dinámico
// Lee products.json y arma las tarjetas de producto en el DOM.

const NOMBRES_CATEGORIA = {
    'todos': 'Todos',
    'rosas-eternas': 'Rosas eternas',
    'girasoles': 'Girasoles',
    'lirios': 'Lirios',
    'individuales': 'Individuales',
    'con-peluche': 'Con peluche',
    'maquillaje': 'Maquillaje',
    'corazones': 'Corazones',
    'bouquets': 'Bouquets',
    'otros': 'Otros',
    'amarillas': 'Flores amarillas'
};

let productos = [];
let categoriaActiva = 'todos';

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
    const categoriasPresentes = ['todos', ...new Set(productos.map(p => p.category))];
    const contenedor = document.getElementById('filtros');

    contenedor.innerHTML = categoriasPresentes.map(cat => `
        <button class="filtro-btn ${cat === categoriaActiva ? 'activo' : ''}" data-categoria="${cat}">
            ${NOMBRES_CATEGORIA[cat] || cat}
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

document.addEventListener('DOMContentLoaded', iniciarCatalogo);
