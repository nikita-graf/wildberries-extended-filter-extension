const url = require('url');
const find = require('lodash.find');
const filtersObserver = new MutationObserver(function() {
    addBrandsFilterControl(createSelectAllControl());
});
const filtersPanel = document.getElementById('filterPanelLeft'); 

if (filtersPanel) {
    filtersObserver.observe(filtersPanel, { childList: true });
}

function addBrandsFilterControl (control) {
    const brandsList = document.getElementById('brand_list_left');
    brandsList.parentNode.insertBefore(
        control, 
        brandsList
    );
}

function fetchFilters () {
    return fetch('https://www.wildberries.ru/api/filters/get', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: document.getElementById('filterPanelLeft').getAttribute('data-filter-model')
    })
        .then(function(response) {
            return response.json();
        });
}

function createSelectAllControl () {
    const selectAll = document.createElement('a');
    selectAll.style.color = '#ccc';
    selectAll.style.marginLeft = '30px';
    selectAll.innerText = 'Выбрать все';
    selectAll.onclick = function () {
        fetchFilters()
            .then(function(filters) {
                let brandsFilter = find(filters, (filter) => filter.id === 0);
                if (brandsFilter) {
                    const parsedUrl = url.parse(window.location.href, true);
                    const ids = brandsFilter.items.map((brand) => brand.value);
                    parsedUrl.query.brand = ids.join(';');
                    window.location = url.format(parsedUrl);
                }
            });
    };
    return selectAll;
}