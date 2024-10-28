// Глобальные переменные
const platformCheckboxes = document.querySelectorAll('input[name="platform"]');
const videoBannerOption = document.getElementById('videoBannerOption');
const videoCheckbox = videoBannerOption.querySelector('input');
const bannerSizesCheckboxes = document.querySelectorAll('input[name="banner_sizes"]');
const dataSourceInput = document.getElementById('dataSource');
const tagSelection = document.getElementById('tagSelection');
const productSelection = document.getElementById('productSelection');
const layoutChoiceRadios = document.querySelectorAll('input[name="layout_choice"]');
const clientLayout = document.getElementById('clientLayout');
const factoryLayout = document.getElementById('factoryLayout');
const coverDelivery = document.getElementById('coverDelivery');
const videoCoverRadios = document.querySelectorAll('input[name="video_cover"]');
const videoCoverOptions = document.getElementById('videoCoverOptions');
const videoFormat = document.getElementById('videoFormat');
const technicalTask = document.getElementById('technicalTask');
const videoLayoutChoiceRadios = document.querySelectorAll('input[name="video_layout_choice"]');
const videoClientLayout = document.getElementById('videoClientLayout');
const videoFactoryLayout = document.getElementById('videoFactoryLayout');

let easyMDE;

const allSizes = ['1:1', '3:4', '4:3', '16:9'];

const platformSizesMap = {
    'gallery': ['1:1'],
    'smart_banners': ['1:1', '3:4', '4:3', '16:9'],
    'ozon': ['1:1', '3:4'],
    'wildberries': ['3:4'],
    'website': ['1:1', '3:4']
};

const platformTasks = {
    'gallery': `#товарная_галерея:
1. Размер баннера: 1000х1000px.
2. Разместить на баннере:
— логотип клиента
— логотип бренда товара
— название товара
— ключевые УТП продавца (2-3): бесплатная доставка, официальная гарантия
3. Пожелания клиента к дизайну: яркий фон, шрифт Manrope...
4. Референсы: ссылка 1, ссылка 2...
5. Предыдущие варианты дизайна для бренда, если они есть. Описание того, что в них нравится, а что — не очень`,
    'smart_banners': `#смарт-баннеры:
1. Размер баннера: 1000х1000px (1:1), 900х1200px (3:4), 1200x900px (4:3), 1600x900px (16:9).
2. Разместить на баннере:
— логотип клиента
— логотип бренда товара
— название товара
— название акции
— ключевые УТП продавца (2-3): бесплатная доставка, официальная гарантия
3. Пожелания клиента к дизайну: яркий фон, шрифт Manrope...
4. Референсы: ссылка 1, ссылка 2...
5. Предыдущие варианты дизайна для бренда, если они есть. Описание того, что в них нравится, а что — не очень`,
    'ozon': `#ozon:
1. Размер баннера: 1000х1000px (1:1) или 900х1200px (3:4).
2. Разместить на баннере:
— логотип клиента
— логотип бренда товара
— название товара
— характеристики товара: УТП 1, УТП 2...
3. Пожелания клиента к дизайну: яркий фон, шрифт Manrope...
4. Референсы: ссылка 1, ссылка 2...
5. Предыдущие варианты дизайна для бренда, если они есть. Описание того, что в них нравится, а чо — не очень`,
    'wildberries': `#wildberries:
1. Размер баннера: 900х1200px (3:4).
2. Разместить на баннере:
— логотип клиента
— логотип бренда товара
— название товара
— характеристики товара: УТП 1, УТП 2...
3. Пожелания клиента к дизайну: яркий фон, шрифт Manrope...
4. Референсы: ссылка 1, ссылка 2...
5. Предыдущие варианты дизайна для бренда, если они есть. Описание того, что в них нравится, а что — не очень`,
    'website': `#веб-сайт:
1. Размер баннера: 900х1200px (3:4).
2. Разместить на баннере:
— логотип клиента
— логотип бренда товара
— название товара
— ключевые характеристики товара: УТП 1, УТП 2...
3. Пожелания клиента к дизайну: соответствие фирменному стилю сайта, шрифт Manrope...
4. Референсы: ссылка 1, ссылка 2...
5. Предыдущие варианты дизайна для бренда, если они есть. Описание тог, что в них нравится, а что — не очень`
};

function initializeEasyMDE() {
    try {
        easyMDE = new EasyMDE({
            element: technicalTask,
            spellChecker: false,
            status: false
        });
    } catch (error) {
        console.error('Ошибка при инициализации EasyMDE:', error);
    }
}

function updateGraphicsTypeSelection() {
    const selectedPlatforms = Array.from(platformCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const staticCheckbox = document.querySelector('input[name="graphics_type"][value="static"]');
    
    // Проверяем, есть ли выбранные площадки помимо Gallery и Wildberries
    const hasOtherPlatforms = selectedPlatforms.some(platform => 
        !['gallery', 'wildberries'].includes(platform)
    );
    
    // Проверяем, выбрана ли ТОЛЬКО Gallery или Wildberries
    const hasOnlyGalleryOrWildberries = selectedPlatforms.every(platform => 
        ['gallery', 'wildberries'].includes(platform)
    );
    
    if (selectedPlatforms.length > 0) {
        // Если выбрана хотя бы одна площадка, отмечаем статичные баннеры
        staticCheckbox.checked = true;
        
        if (hasOnlyGalleryOrWildberries) {
            // Если выбраны ТОЛЬКО Gallery или Wildberries
            videoCheckbox.checked = false;
            videoCheckbox.disabled = true;
            videoBannerOption.classList.add('disabled');
        } else {
            // Если выбраны другие площадки (возможно, вместе с Gallery/Wildberries)
            videoCheckbox.disabled = false;
            videoBannerOption.classList.remove('disabled');
            
            // Автоматически отмечаем видео-баннеры только если есть другие площадки
            if (hasOtherPlatforms) {
                videoCheckbox.checked = true;
            }
        }
    } else {
        // Если не выбрана ни одна площадка
        staticCheckbox.checked = false;
        videoCheckbox.checked = false;
        videoCheckbox.disabled = false;
        videoBannerOption.classList.remove('disabled');
    }

    // Обновляем отображение формата видео
    updateGraphicsType();
}

function updateBannerSizes() {
    // Сначала отлючаем все размеры
    bannerSizesCheckboxes.forEach(cb => {
        cb.disabled = true;
        cb.checked = false;
        cb.parentElement.classList.add('disabled');
    });

    const selectedPlatforms = Array.from(platformCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const sizesToEnable = new Set();

    selectedPlatforms.forEach(platform => {
        platformSizesMap[platform].forEach(size => sizesToEnable.add(size));
    });

    // Включаем и выбираем соответствующие размеры
    bannerSizesCheckboxes.forEach(cb => {
        if (sizesToEnable.has(cb.value)) {
            cb.disabled = false;
            cb.parentElement.classList.remove('disabled');
            
            // Выбираем по умолчанию только если выбрана одна платформа
            if (selectedPlatforms.length === 1) {
                if (selectedPlatforms[0] === 'gallery' || selectedPlatforms[0] === 'wildberries') {
                    cb.checked = true;
                } else if ((selectedPlatforms[0] === 'ozon' || selectedPlatforms[0] === 'website') && cb.value === '1:1') {
                    cb.checked = true;
                }
            }
        }
    });
}

function toggleTagAndProductSelection() {
    const dataSourceValue = dataSourceInput.value.trim();
    if (dataSourceValue !== '') {
        tagSelection.classList.remove('hidden');
        productSelection.classList.remove('hidden');
    } else {
        tagSelection.classList.add('hidden');
        productSelection.classList.add('hidden');
    }
}

function toggleLayoutOptions() {
    const selectedLayout = document.querySelector('input[name="layout_choice"]:checked');
    if (!selectedLayout) {
        return; // Если нет выбранной радиокнопки, просто выходим из функции
    }
    if (selectedLayout.value === 'client') {
        clientLayout.classList.remove('hidden');
        factoryLayout.classList.add('hidden');
    } else {
        clientLayout.classList.add('hidden');
        factoryLayout.classList.remove('hidden');
        updateTechnicalTask();
    }
}

function toggleCoverDelivery() {
    const selectedPlatforms = Array.from(platformCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    if (!selectedLayout) {
        return; // Если кнопка не выбрана, выходим из функции
    }
    if (selectedPlatforms.includes('ozon') || selectedPlatforms.includes('wildberries') || selectedPlatforms.includes('website')) {
        coverDelivery.classList.remove('hidden');
    } else {
        coverDelivery.classList.add('hidden');
    }
}

function toggleVideoCoverOptions() {
    const selectedVideoCover = document.querySelector('input[name="video_cover"]:checked');
    if (!selectedVideoCover) {
        return; // Если кнопка не выбрана, выходим из функции
    }
    if (selectedVideoCover.value === 'yes') {
        videoCoverOptions.classList.remove('hidden');
        videoFormat.classList.remove('hidden');
    } else {
        videoCoverOptions.classList.add('hidden');
        videoFormat.classList.add('hidden');
    }
}

function updateTechnicalTask() {
    const selectedPlatforms = Array.from(platformCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedLayout = document.querySelector('input[name="layout_choice"]:checked');
    
    if (selectedLayout && selectedLayout.value === 'factory') {
        let taskText = '';
        
        selectedPlatforms.forEach(platform => {
            if (platformTasks[platform]) {
                taskText += platformTasks[platform] + '\n\n';
            }
        });
        
        easyMDE.value(taskText.trim());
    }
}

function updateGraphicsType() {
    const videoCheckbox = document.querySelector('input[name="graphics_type"][value="video"]');
    const videoFormat = document.getElementById('videoFormat');
    
    if (videoCheckbox.checked) {
        videoFormat.classList.remove('hidden');
    } else {
        videoFormat.classList.add('hidden');
    }
}

// Добавляем слушатель для чекбокса видео
document.querySelector('input[name="graphics_type"][value="video"]').addEventListener('change', updateGraphicsType);

function updateDeliveryMethod() {
    const selectedPlatforms = Array.from(platformCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const feedTagPlatforms = ['gallery', 'smart_banners', 'website'];
    const archivePlatforms = ['ozon', 'wildberries'];

    const feedTagRadio = document.querySelector('input[name="delivery_method"][value="feed_tag"]');
    const archiveRadio = document.querySelector('input[name="delivery_method"][value="archive"]');

    // Проверяем, есть ли выбранные платформы из каждой группы
    const hasFeedTagPlatform = selectedPlatforms.some(platform => feedTagPlatforms.includes(platform));
    const hasArchivePlatform = selectedPlatforms.some(platform => archivePlatforms.includes(platform));

    if (hasFeedTagPlatform && !hasArchivePlatform) {
        feedTagRadio.checked = true;
    } else if (hasArchivePlatform && !hasFeedTagPlatform) {
        archiveRadio.checked = true;
    }

    // Делаем радио-кнопки неактивными, если выбрана хотя бы одна платформа
    const shouldDisable = selectedPlatforms.length > 0;
    feedTagRadio.disabled = shouldDisable;
    archiveRadio.disabled = shouldDisable;
}

// Обновленный код для коллапсибл секций
const collapsibles = document.getElementsByClassName("collapsible");
for (let i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
        
        // Обновляем высоту всех родительских .content
        let parent = this.parentElement;
        while (parent) {
            if (parent.classList.contains('content')) {
                parent.style.maxHeight = parent.scrollHeight + "px";
            }
            parent = parent.parentElement;
        }
    });
}

platformCheckboxes.forEach(cb => cb.addEventListener('change', () => {
    updateGraphicsTypeSelection(); // Заменяем updateVideoBannerOption на updateGraphicsTypeSelection
    updateBannerSizes();
    toggleCoverDelivery();
    updateTechnicalTask();
    updateDeliveryMethod();
}));

dataSourceInput.addEventListener('input', toggleTagAndProductSelection);

layoutChoiceRadios.forEach(rb => rb.addEventListener('change', () => {
    toggleLayoutOptions();
    updateTechnicalTask(); // Добавляем вызов updateTechnicalTask при изменении выбора макета
}));

videoCoverRadios.forEach(rb => rb.addEventListener('change', toggleVideoCoverOptions));

function toggleVideoLayoutOptions() {
    const selectedLayout = document.querySelector('input[name="video_layout_choice"]:checked');
    if (!selectedLayout) {
        return; // Если кнопка не выбрана, выходим из функции
    }
    if (selectedLayout.value === 'client') {
        videoClientLayout.classList.remove('hidden');
        videoFactoryLayout.classList.add('hidden');
    } else {
        videoClientLayout.classList.add('hidden');
        videoFactoryLayout.classList.remove('hidden');
    }
}

videoLayoutChoiceRadios.forEach(rb => rb.addEventListener('change', toggleVideoLayoutOptions));

// Инициализация формы
document.addEventListener('DOMContentLoaded', function() {
    initializeEasyMDE();
    updateGraphicsTypeSelection();
    updateBannerSizes();
    updateGraphicsType(); // Добавлен вызов функции
    toggleTagAndProductSelection();
    toggleLayoutOptions();
    toggleCoverDelivery();
    toggleVideoCoverOptions();
    updateTechnicalTask();
    toggleVideoLayoutOptions();
    updateDeliveryMethod();
});

// Добавляем в начало файла
const addTagPairButton = document.getElementById('addTagPair');
const tagPairsContainer = document.getElementById('tagPairsContainer');

function createTagPair() {
    const tagPair = document.createElement('div');
    tagPair.className = 'tag-pair';
    
    tagPair.innerHTML = `
        <div class="tag-inputs">
            <input type="text" class="tag-name" placeholder="Тег из фида (например, <model>)" required>
            <input type="text" class="tag-usage" placeholder="Элемент дизайна (например, "Текстовый слой модель товара")" required>
        </div>
    `;
    
    return tagPair;
}

addTagPairButton.addEventListener('click', () => {
    const newPair = createTagPair();
    tagPairsContainer.appendChild(newPair);
});

// Обновляем обработчик отправки формы, чтобы собирать данные из всех пар тегов
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};
    
    // Собираем обычные поля формы
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }

    // Собираем данные из пар тегов
    const tagPairs = [];
    document.querySelectorAll('.tag-pair').forEach(pair => {
        const tagName = pair.querySelector('.tag-name').value;
        const tagUsage = pair.querySelector('.tag-usage').value;
        if (tagName && tagUsage) {
            tagPairs.push({ tag: tagName, usage: tagUsage });
        }
    });
    data.tag_pairs = tagPairs;

    // Добавляем данные из EasyMDE и видео
    if (easyMDE) {
        data.technical_task = easyMDE.value();
    }

    const videoTechnicalTask = document.getElementById('videoTechnicalTask');
    if (videoTechnicalTask) {
        data.video_technical_task = videoTechnicalTask.value;
    }

    // Отправляем данные
    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Данные сохранены:', result);
        alert(result.message);
    })
    .catch(error => {
        console.error('Ошибка при сохранении:', error);
        alert('Произошла ошибка при отправке данных, попробуйте снова.');
    });    
});

