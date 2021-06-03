const serveJSON = 'https://603e38c548171b0017b2ecf7.mockapi.io/homes'
const valueSearch = document.querySelector('#filter')
const preview = document.querySelector('.preview')

function numPricePound (num){
    return '£' + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function sendRequest(method, url, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

        xhr.onload = () => {
            if (xhr.status === 400) {
                reject(xhr.response.data)
            } else {
                resolve(xhr.response)
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
        xhr.send(body)
    })
}

sendRequest('GET', serveJSON)
    .then(data => {
        render(data)
    })
    .catch(err => console.log(err))

function render(data){
    data.forEach(item => {
        if (!item) return
        preview.insertAdjacentHTML('beforeend', `
           <a class="preview__item" tabindex="0" href="/details/${item.id}" style="display: block;">
                <div class="preview__img ratio ratio16x9">
                    <img src="https://via.placeholder.com/300x150/" alt=""/>
                    <span class="preview__lable ${item.type === 'IndependentLiving' ? 'blue' : 'orange'}">${item.type}</span>
                </div>
                <span class="preview__info">
                    <h2 class="preview__title">${item.title}</h2>
                    <address>${item.address}</address>
                    <p class="preview__price">New Properties for Sale from <strong>${numPricePound(item.price)}</strong></p>
                    <p class="preview__text-smal">Shared Ownership Available</p>
                </span>
           </a>
        `)
    })
}

valueSearch.oninput = async function () {
    let val = this.value.trim()
    let elems = Array.prototype.slice.call(preview.children)
    if (val != '' && val.length >= 3){
        searchItem(elems, val)
    }else{
        elems.forEach(function(elem) {
            elem.classList.remove('hide')
        })
    }
}

function searchItem(elems, val){
    elems.forEach(function(elem) {
        if(elem.querySelector('h2').innerHTML.toLowerCase().search(val.toLowerCase()) == -1) {
            elem.classList.add('hide')
        }else{
            elem.classList.remove('hide')
        }
    });
}