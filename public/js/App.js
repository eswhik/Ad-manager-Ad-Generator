document.addEventListener('DOMContentLoaded', function() {
    $('.select2').select2();

    fetch('Backend/ad/sizes/beta/')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('opciones_seleccionadas');
            for (const [key, value] of Object.entries(data)) {
                const option = document.createElement('option');
                option.value = JSON.stringify(value);
                option.textContent = key;
                select.appendChild(option);
            }
        })
        .catch(error => {
            console.error(error);
        });

    document.getElementById('ad-form').addEventListener('submit', event => {
        event.preventDefault();

        const opcionesSeleccionadas = Array.from(document.getElementById('opciones_seleccionadas').selectedOptions).map(option => JSON.parse(option.value));

        const formData = {
            nombre_tag: document.getElementById('nombre_tag').value,
            codigo_editor: document.getElementById('codigo_editor').value,
            nombre_anuncio: document.getElementById('nombre_anuncio').value,
            medidas: opcionesSeleccionadas
        };

        fetch('Backend/api/v1/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.codigo) {
                    document.getElementById('generated-code').textContent = data.codigo;
                    document.getElementById('download-link').innerHTML = `<a href="Backend/${data.archivo}" download><button class="button-dl">Download Tag</button></a>`;
                    hljs.highlightAll();
                    showModal();
                    saveTagToLocalStorage({
                        id: Date.now(),
                        nombre_tag: formData.nombre_tag,
                        nombre_anuncio: formData.nombre_anuncio,
                        medidas: formData.medidas,
                        download_link: `Backend/${data.archivo}`
                    });
                    updateTagsTable();
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error(error);
            });
    });

    document.getElementById('nombre_tag').addEventListener('input', function() {
        document.getElementById('nombre_anuncio').value = this.value;
    });

    document.querySelector('.toggle-form').addEventListener('click', () => {
        const menu = document.querySelector('.toggle-menu');
        menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
    });

    document.querySelector('.show-form').addEventListener('click', () => {
        document.getElementById('ad-form').style.display = 'block';
        document.getElementById('history-list').style.display = 'none';
        document.querySelector('.toggle-menu').style.display = 'none';
        if (window.location.pathname.includes('historial-de-anuncios')) {
            history.pushState({}, '', window.location.pathname.replace('historial-de-anuncios', ''));
        }
    });

    document.querySelector('.show-history').addEventListener('click', () => {
        document.getElementById('ad-form').style.display = 'none';
        document.getElementById('history-list').style.display = 'block';
        document.querySelector('.toggle-menu').style.display = 'none';
        updateTagsTable();
        if (!window.location.pathname.includes('historial-de-anuncios')) {
            history.pushState({}, '', window.location.pathname + 'historial-de-anuncios');
        }
    });

    if (window.location.pathname.includes('historial-de-anuncios')) {
        document.getElementById('ad-form').style.display = 'none';
        document.getElementById('history-list').style.display = 'block';
        updateTagsTable();
    }
});

function showModal() {
    const modal = document.getElementById("ModalAdx");
    const closeBtn = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    closeBtn.onclick = () => {
        modal.style.animation = "fadeOut 0.3s ease-in-out";
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    window.onclick = event => {
        if (event.target === modal) {
            modal.style.animation = "fadeOut 0.3s ease-in-out";
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        }
    }
}

function saveTagToLocalStorage(tag) {
    let tags = JSON.parse(localStorage.getItem('tags')) || [];
    tags.push(tag);
    localStorage.setItem('tags', JSON.stringify(tags));
}

function updateTagsTable() {
    const tagsTableArticle = document.querySelector('.table-article');
    tagsTableArticle.innerHTML = '';
    let tags = JSON.parse(localStorage.getItem('tags')) || [];
    tags = tags.sort((a, b) => b.id - a.id);
    tags.forEach(tag => {
        const tagArticle = document.createElement('article');
        tagArticle.innerHTML = `
            <h2>ID: ${tag.id}</h2>
            <p>Nombre: ${tag.nombre_tag}</p>
            <p>Nombre del Anuncio: ${tag.nombre_anuncio}</p>
            <p>Medidas: ${tag.medidas.map(medida => `[${medida.join(', ')}]`).join(' ')}</p>
            <p><a href="${tag.download_link}" download><button class="button-dl">Download Tag</button></a></p>
        `;
        tagsTableArticle.appendChild(tagArticle);
    });
}