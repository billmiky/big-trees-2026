// Champion Trees Explorer - Core Logic

let allTrees = [];
let filteredTrees = [];
let currentCategory = 'all';
let map = null;
let markers = [];

// State management for the modal
let isModalOpen = false;
let currentView = 'list';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    try {
        await fetchTrees();
        renderApp();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Error loading data. Please try again later.');
    }
}

async function fetchTrees() {
    const response = await fetch('trees.json');
    if (!response.ok) throw new Error('Network response was not ok');
    allTrees = await response.json();
    filteredTrees = [...allTrees];
}

// Rendering functions will be implemented in the next step
function renderApp() {
    const randomTree = allTrees[Math.floor(Math.random() * allTrees.length)];
    renderHero(randomTree);

    // Pick 3 random trees for recent champions for now, sorted by nomination year if available
    const sortedTrees = [...allTrees].sort((a, b) => parseInt(b['Year Nominated']) - parseInt(a['Year Nominated']));
    renderRecentChampions(sortedTrees.slice(0, 3));

    // Pick 4 random trees for seasonal favorites
    const shuffled = [...allTrees].sort(() => 0.5 - Math.random());
    renderSeasonalFavorites(shuffled.slice(0, 4));
}

// Placeholder rendering functions
function renderHero(tree) {
    if (!tree) return;
    document.getElementById('hero-scientific').textContent = tree['Scientific Name'];
    document.getElementById('hero-common').textContent = tree['Common Name'];
    document.getElementById('hero-height').textContent = `${tree['Height (ft)']} ft`;
    document.getElementById('hero-points').textContent = tree['Total Points'];
    document.getElementById('hero-card').dataset.treeId = tree['NCTP Tree Id'];

    if (tree['image_url']) {
        document.getElementById('hero-image').src = tree['image_url'];
    }
}

function renderRecentChampions(trees) {
    const grid = document.getElementById('recent-champions-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (trees.length === 0) {
        grid.innerHTML = '<div class="col-span-12 text-center py-12 text-on-surface-variant">No trees found.</div>';
        return;
    }

    // First tree is the large one
    const mainTree = trees[0];
    const mainCard = createRecentChampionMainCard(mainTree);
    grid.appendChild(mainCard);

    // Other trees in the side column
    const sideCol = document.createElement('div');
    sideCol.className = 'md:col-span-5 grid grid-rows-2 gap-6';

    for (let i = 1; i < Math.min(trees.length, 3); i++) {
        const sideCard = createRecentChampionSideCard(trees[i]);
        sideCol.appendChild(sideCard);
    }

    grid.appendChild(sideCol);
}

function createRecentChampionMainCard(tree) {
    const div = document.createElement('div');
    div.className = 'md:col-span-7 bg-surface-container-low rounded-xl overflow-hidden relative group cursor-pointer';
    div.dataset.treeId = tree['NCTP Tree Id'];

    const fallbackImg = `https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2232&auto=format&fit=crop`;
    const imgUrl = tree['image_url'] || fallbackImg;

    div.innerHTML = `
        <img class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" src="${imgUrl}" alt="${tree['Common Name']}"/>
        <div class="absolute inset-0 bg-gradient-to-t from-[#1c1c18]/80 to-transparent"></div>
        <div class="absolute bottom-6 left-6">
            <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">New Record</span>
            <h4 class="text-white font-headline text-2xl font-bold">${tree['Common Name']}</h4>
            <p class="text-secondary-fixed-dim text-xs font-label">${tree['State']} • ${tree['Height (ft)']} ft tall</p>
        </div>
    `;

    div.addEventListener('click', () => openModal(tree['NCTP Tree Id']));
    return div;
}

function createRecentChampionSideCard(tree) {
    const div = document.createElement('div');
    div.className = 'bg-surface-container rounded-xl flex items-center p-6 gap-6 group cursor-pointer hover:bg-surface-container-high transition-colors';
    div.dataset.treeId = tree['NCTP Tree Id'];

    const fallbackImg = `https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2340&auto=format&fit=crop`;
    const imgUrl = tree['image_url'] || fallbackImg;

    div.innerHTML = `
        <div class="w-24 h-24 shrink-0 organic-mask-xl overflow-hidden">
            <img class="w-full h-full object-cover" src="${imgUrl}" alt="${tree['Common Name']}"/>
        </div>
        <div>
            <h4 class="font-headline text-lg font-bold text-on-surface line-clamp-1">${tree['Common Name']}</h4>
            <p class="text-on-surface-variant text-sm mb-3">${tree['Scientific Name']}</p>
            <span class="text-secondary text-xs font-bold uppercase tracking-widest">${tree['Height (ft)']}ft High</span>
        </div>
    `;

    div.addEventListener('click', () => openModal(tree['NCTP Tree Id']));
    return div;
}

function renderSeasonalFavorites(trees) {
    const container = document.getElementById('seasonal-favorites-container');
    if (!container) return;
    container.innerHTML = '';

    trees.forEach(tree => {
        const div = document.createElement('div');
        div.className = 'w-72 shrink-0 cursor-pointer group';
        div.dataset.treeId = tree['NCTP Tree Id'];

        const fallbackImg = `https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2341&auto=format&fit=crop`;
        const imgUrl = tree['image_url'] || fallbackImg;

        div.innerHTML = `
            <div class="h-96 rounded-2xl overflow-hidden relative mb-4">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${imgUrl}" alt="${tree['Common Name']}"/>
                <div class="absolute top-4 left-4 bg-white/30 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest">${tree['State']}</div>
            </div>
            <h5 class="font-headline text-xl font-bold">${tree['Common Name']}</h5>
            <p class="text-on-surface-variant text-xs mt-1">${tree['Scientific Name']}</p>
        `;

        div.addEventListener('click', () => openModal(tree['NCTP Tree Id']));
        container.appendChild(div);
    });
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

    // Filter Chips
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => handleFilter(chip.dataset.category));
    });

    // Hero dossier button
    document.getElementById('hero-dossier-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const treeId = document.getElementById('hero-card').dataset.treeId;
        openModal(treeId);
    });

    document.getElementById('hero-card').addEventListener('click', () => {
        const treeId = document.getElementById('hero-card').dataset.treeId;
        openModal(treeId);
    });

    // Modal
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-close-overlay').addEventListener('click', closeModal);
    document.getElementById('modal-collect-btn').addEventListener('click', () => {
        showToast('Tree added to your grove!');
        closeModal();
    });

    // Nav Items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            if (item.id === 'nav-explore' || item.id === 'nav-map') {
                navItems.forEach(i => {
                    i.classList.remove('bg-primary', 'text-on-primary');
                    i.classList.add('text-secondary', 'dark:text-primary-fixed-dim');
                });
                item.classList.add('bg-primary', 'text-on-primary');
                item.classList.remove('text-secondary', 'dark:text-primary-fixed-dim');

                if (item.id === 'nav-explore') {
                    switchView('list');
                } else if (item.id === 'nav-map') {
                    switchView('map');
                }
            } else {
                showToast('Feature coming soon!');
            }
        });
    });

    // Logo & Avatar
    document.getElementById('logo').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('profile-avatar').addEventListener('click', () => showToast('Profile coming soon!'));
    document.getElementById('search-btn').addEventListener('click', () => searchInput.focus());
    document.getElementById('filter-btn').addEventListener('click', () => showToast('Advanced filters coming soon!'));
    document.getElementById('see-all-btn').addEventListener('click', () => showToast('Viewing all champions...'));
    document.getElementById('fab').addEventListener('click', () => showToast('Camera tool coming soon!'));
}

function handleSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
        filteredTrees = [...allTrees];
    } else {
        filteredTrees = allTrees.filter(tree =>
            tree['Common Name'].toLowerCase().includes(q) ||
            tree['Scientific Name'].toLowerCase().includes(q) ||
            tree['State'].toLowerCase().includes(q) ||
            tree['County'].toLowerCase().includes(q)
        );
    }
    renderAppFromFiltered();
}

function handleFilter(category) {
    currentCategory = category;

    // Update chip styles
    document.querySelectorAll('.filter-chip').forEach(chip => {
        if (chip.dataset.category === category) {
            chip.classList.add('bg-tertiary-container', 'text-on-tertiary-container');
            chip.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
        } else {
            chip.classList.remove('bg-tertiary-container', 'text-on-tertiary-container');
            chip.classList.add('bg-surface-container-high', 'text-on-surface-variant');
        }
    });

    if (category === 'all') {
        filteredTrees = [...allTrees];
    } else if (category === 'washington') {
        filteredTrees = allTrees.filter(tree => tree['State'] === 'WA');
    } else if (category === 'california') {
        filteredTrees = allTrees.filter(tree => tree['State'] === 'CA');
    } else if (category === 'conifers') {
        const conifers = ['Pinus', 'Abies', 'Sequoia', 'Sequoiadendron', 'Picea', 'Tsuga', 'Pseudotsuga', 'Cupressus', 'Taxus', 'Juniperus'];
        filteredTrees = allTrees.filter(tree => conifers.some(c => tree['Scientific Name'].startsWith(c)));
    } else if (category === 'deciduous') {
        const conifers = ['Pinus', 'Abies', 'Sequoia', 'Sequoiadendron', 'Picea', 'Tsuga', 'Pseudotsuga', 'Cupressus', 'Taxus', 'Juniperus'];
        filteredTrees = allTrees.filter(tree => !conifers.some(c => tree['Scientific Name'].startsWith(c)));
    }

    renderAppFromFiltered();
}

function renderAppFromFiltered() {
    const countEl = document.getElementById('specimen-count');
    if (countEl) {
        countEl.textContent = `${filteredTrees.length} specimens found`;
    }

    if (filteredTrees.length > 0) {
        renderHero(filteredTrees[0]);
        renderRecentChampions(filteredTrees.slice(0, 3));
        renderSeasonalFavorites(filteredTrees.slice(0, 12));
    } else {
        renderRecentChampions([]);
        renderSeasonalFavorites([]);
    }
}

function openModal(treeId) {
    const tree = allTrees.find(t => t['NCTP Tree Id'] === treeId);
    if (!tree) return;

    document.getElementById('modal-scientific').textContent = tree['Scientific Name'];
    document.getElementById('modal-common').textContent = tree['Common Name'];
    document.getElementById('modal-location').textContent = `${tree['County']}, ${tree['State']}`;
    document.getElementById('modal-year').textContent = tree['Year Nominated'];
    document.getElementById('modal-height').textContent = `${tree['Height (ft)']} ft`;
    document.getElementById('modal-circ').textContent = `${tree['Circ. (in)']} in`;
    document.getElementById('modal-dbh').textContent = `${tree['DBH (in)']} in`;
    document.getElementById('modal-points').textContent = tree['Total Points'];
    document.getElementById('modal-measurer').textContent = tree['Measurer(s)'] || 'Unknown Measurer';

    const modalImgContainer = document.getElementById('modal-image-container');
    const modalImg = document.getElementById('modal-image');
    if (tree['image_url']) {
        modalImg.src = tree['image_url'];
        modalImg.alt = tree['Common Name'];
        modalImgContainer.classList.remove('hidden');
    } else {
        modalImgContainer.classList.add('hidden');
    }

    const modal = document.getElementById('tree-modal');
    const content = document.getElementById('modal-content');

    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('translate-y-full');
    }, 10);
    isModalOpen = true;
}

function closeModal() {
    const modal = document.getElementById('tree-modal');
    const content = document.getElementById('modal-content');

    content.classList.add('translate-y-full');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 500);
    isModalOpen = false;
}

function switchView(view) {
    if (currentView === view) return;
    currentView = view;

    const listView = document.getElementById('list-view');
    const mapView = document.getElementById('map-view');

    if (view === 'map') {
        listView.classList.add('hidden');
        mapView.classList.remove('hidden');
        initMap();
    } else {
        listView.classList.remove('hidden');
        mapView.classList.add('hidden');
    }
}

function initMap() {
    if (map) return;

    // Standard Leaflet initialization
    map = L.map('map').setView([39.8283, -98.5795], 4);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    renderMarkers();
}

function renderMarkers() {
    if (!map) return;

    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    // Custom marker icon using simple CSS for the modern look
    const treeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#021c10; width:12px; height:12px; border-radius:50%; border:2px solid white;'></div>",
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    // We only render a subset if there are too many for performance,
    // but with 547 it should be fine.
    allTrees.forEach(tree => {
        if (tree.lat && tree.lng) {
            const marker = L.marker([tree.lat, tree.lng], { icon: treeIcon })
                .addTo(map)
                .on('click', () => openModal(tree['NCTP Tree Id']));
            markers.push(marker);
        }
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');

    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
    }, 3000);
}
