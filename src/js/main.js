import "../styles/main.scss";
import  InteractiveMap from'./modules/InteractiveMap.js'



class GeoReview {
    constructor() {
        this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
        this.map = new InteractiveMap('map', this.onClick.bind(this));
        this.map.init().then(this.onInit.bind(this));
    }
    onInit() {
        const coords = this.callApi('getCoords');
        for (const item of coords) {
            for (let i = 0; i < item.total; i++) {
                this.map.createPlacemark(JSON.parse(item.coords));
            }
        }

        document.body.addEventListener('click', this.onDocumentClick.bind(this));
    }

     callApi(method, body = {}) {
         let storage = JSON.parse(localStorage.getItem('reviews')) || {};
         let key = JSON.stringify(body.coords)
         if (method === 'add') {            
             let dataStorage = storage[key];
            if (dataStorage) {
              dataStorage = [...dataStorage, body.review]
            } else {
                dataStorage = [body.review]
            }
            storage[key] = dataStorage;
            return localStorage.setItem('reviews', JSON.stringify(storage))
         }
         if (method === 'getCoords') {
             let coords = [];
             for (const key in storage) {
                 coords.push({
                     coords: key,
                     total: storage[key].length
                 })
             }
             return coords;
         }
         if (method === 'getDataByCoords') {
            return storage[key] || [];
         }
    }

    createForm(coords, reviews) {
        const root = document.createElement('div');
        root.innerHTML = this.formTemplate;
        const reviewList = root.querySelector('.review-list');
        const reviewForm = root.querySelector('[data-role=review-form]');
        reviewForm.dataset.coords = JSON.stringify(coords);
        const closeBtn = document.querySelector('.close');

        for (const item of reviews) {
            const div = document.createElement('div');
            div.classList.add('review-item');
            div.innerHTML = `
            <div>
                <b>${item.name}<\b> [${item.place}]
            </div>
            <div>${item.text}</div>
            `;
            reviewList.appendChild(div)
        }


        return root;
    }
    onClick(coords) {
        this.map.openBalloon(coords, 'Загрузка...');
        const list = this.callApi('getDataByCoords', { coords });
        const form = this.createForm(coords, list);
        
        setTimeout(() => {
            this.map.setBalloonContent(form.innerHTML);
        }, 500);
  }

        onDocumentClick(e) {
        if (e.target.dataset.role === "review-add") {
            const reviewForm = document.querySelector('[data-role=review-form]');
            const coords = JSON.parse(reviewForm.dataset.coords);
            const data = {
                coords,
                review: {
                    name: document.querySelector('[data-role=review-name]').value,
                    place: document.querySelector('[data-role=review-place]').value,
                    text: document.querySelector('[data-role=review-text]').value
                },
            };

            try {
                this.callApi('add', data);
                this.map.createPlacemark(coords);
                this.map.closeBalloon();
            } catch (e) {
                const formError = document.querySelector('.form-error');
                formError.innerText = e.message;
            }
        }   
    }

}

new GeoReview();



