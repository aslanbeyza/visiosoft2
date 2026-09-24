
const modelViewers = document.querySelectorAll('model-viewer');
modelViewers.forEach((modelViewer) => {
    const progressBar = modelViewer.querySelector('.progress-bar');
    if (!progressBar) {
        return;
    }
    const updateBar = progressBar.querySelector('.update-bar');
    if (!updateBar) {
        return;
    }
    modelViewer.addEventListener('progress', (event) => {
        const progress = event.detail.totalProgress;
        updateBar.style.width = `${Math.round(progress * 100)}%`;
        progressBar.classList.toggle('hide', progress === 1);
    });
});

// Modal Handler
const modal = document.querySelector('[data-viewer-modal]');
const modalModel = modal?.querySelector('model-viewer');
const openButtons = document.querySelectorAll('[data-viewer-fullscreen]');
const closeButtons = modal?.querySelectorAll('[data-viewer-close]');

const openModal = (modelViewer) => {
    if (!modal || !modalModel || !modelViewer) {
        return;
    }
    const src = modelViewer.getAttribute('src');
    if (src) {
        modalModel.setAttribute('src', src);
    }
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    if (!modal || !modalModel) {
        return;
    }
    modal.classList.remove('is-open');
    modal.hidden = true;
    modalModel.removeAttribute('src');
    document.body.style.overflow = '';
};

openButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const card = button.closest('.viewer-card');
        const modelViewer = card?.querySelector('model-viewer');
        openModal(modelViewer);
    });
});

closeButtons?.forEach((button) => {
    button.addEventListener('click', closeModal);
});

modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
        closeModal();
    }
});
