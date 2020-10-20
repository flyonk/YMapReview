export default class InteractiveMap {
    constructor(mapID, onClick) {
        this.mapID = mapID;
       this.onClick  = onClick;
    }

    async init() {
        await this.injectYMapsScript();
        await this.loadYMaps();
        this.initMap();
    }

    injectYMapsScript() {
        return new Promise((resolve) => {
            const ymapsScript = document.createElement('script');
            ymapsScript.src = 'https://api-maps.yandex.ru/2.1/?apikey=c89bcbc3-2fae-49be-811f-8ea8921472c7&lang=ru_RU';
            document.body.appendChild(ymapsScript);
            ymapsScript.addEventListener('load', resolve);
        });
    }

    loadYMaps() {
        return new Promise((resolve) => ymaps.ready(resolve));
    }

    initMap() {
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: false
        });
        this.clusterer.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
            // console.log(coords);
        });
        this.map = new ymaps.Map(this.mapID, {
            center: [55.76, 37.64],
            zoom: 10
        });
        this.map.events.add('click', (e) => this.onClick(e.get('coords')));
        this.map.geoObjects.add(this.clusterer);
    }
    openBalloon(coords, content) {
        this.map.balloon.open(coords, content)
    }

    setBalloonContent(content) {
    this.map.balloon.setData(content);
  }

    closeBalloon() {
        this.map.balloon.close();
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords);
        placemark.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(placemark);
    }
}