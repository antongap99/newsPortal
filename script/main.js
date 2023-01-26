import createCard from './createCards.js'
import {fetchRequest} from './fetchreq.js';
import preload from './preload.js';
import loadImg from './loud.js';


const newsApiController = () => {
    preload.show();
    const apiKey = '28bda8837c2c4e6daf7d725aef19ea46';
 
    const formSearch = document.querySelector('.form-search');
    const container = document.querySelector('.card__container');


    const addHeadlinesContainer  = (inputValue, countCard) => {
        const main = document.querySelector('.main');

        const headlinesTitleContainer = document.createElement('section');
        headlinesTitleContainer.className = 'section__title section__title__headlines';

        const headlinesTitleWrapper = document.createElement('div');
        headlinesTitleWrapper.className = 'wrapper wrapper__headlines';

        const headlinesTitle = document.createElement('h1');
        headlinesTitle.className = 'main__title main__title__headlines';
        headlinesTitle.textContent = `По вашему запросу “${inputValue}” найдено ${countCard} результатов`;

        headlinesTitleWrapper.append(headlinesTitle);
        headlinesTitleContainer.append(headlinesTitleWrapper);

        const headlinesContainerWrapper = document.createElement('section');
        headlinesContainerWrapper.className = 'wrapper wrapper__headlines'
        const headlinesContainer = document.createElement('div');
        headlinesContainer.className = 'card__container card__headlines';

        headlinesContainerWrapper.append(headlinesContainer);

        main.prepend(headlinesTitleContainer, headlinesContainerWrapper);

        return headlinesContainer;
    }

    const formEventHandlerSubmit =() => {
        const main = document.querySelector('.main');
        if(main.firstElementChild.classList.contains('section__title__headlines')){
            main.removeChild(main.firstElementChild);
            main.removeChild((main.firstElementChild));
        }

        const from = '2022-08-21'
        const to = '2022-09-20'
        // const country = 'ru'
        const countCard = 8;
        const countCardEvery = 4;
        const URLHEADLINES = `https://newsapi.org/v2/top-headlines?q=${formSearch.input.value}&pageSize=${countCard}&apiKey=28bda8837c2c4e6daf7d725aef19ea46`
        const URL = `https://newsapi.org/v2/everything?q=${formSearch.input.value}&pageSize=${countCardEvery}&from=${from}&to=${to}&sortBy=popularity&apiKey=${apiKey}`;
        
        const  headlinesContainer = addHeadlinesContainer(formSearch.input.value, countCard);
        Promise.all([
            renderCards(URLHEADLINES, headlinesContainer),
            renderCards(URL, container),
        ])
    }

    const formEventHandlerKeyUp =(e) => { 
        if(e.code === '13'){
            const main = document.querySelector('.main');
            if(main.firstElementChild.classList.contains('section__title__headlines')){
                main.removeChild(main.firstElementChild);
                main.removeChild((main.firstElementChild));
            }
            const from = '2022-08-21'
            const to = '2022-09-20'
            const country = 'ru'
            const countCard = 8
            const countCardEvery = 4
            console.log(formSearch.input.value);
            const URLHEADLINES = `https://newsapi.org/v2/top-headlines?q=${formSearch.input.value}&pageSize=${countCard}&apiKey=28bda8837c2c4e6daf7d725aef19ea46`
            const URL = `https://newsapi.org/v2/everything?pageSize=${countCardEvery}&from=${from}&to=${to}&sortBy=popularity&apiKey=${apiKey}`;
            
            const  headlinesContainer = addHeadlinesContainer(formSearch.input.value, countCard);
            Promise.all([
                renderCards(URLHEADLINES, headlinesContainer),
                renderCards(URL, container)
            ])
        }
    }

    const removeChildElems = (parent) => {
        while(parent.firstChild){
            parent.removeChild(parent.lastChild);
        }
    }

    const renderCards = async (url, containerElem) => {
        removeChildElems(containerElem);
        
        preload.show();

        return fetchRequest(url ,{
            headers: {
                'X-Api-Key': `${apiKey}`,
                mode: 'no-cors',
            },
            callback: createCard,
            })
            .then((result) => {
                const imgs =  result.data.articles.map((item) => item.urlToImage);
                const prom = Promise.allSettled(imgs.map(img => loadImg(new Error('not found'), img)));

                prom.then((imgs) => {
                    for(let i = 0; i < imgs.length; i++){
                        if(imgs[i].status === 'fulfilled'){
                            result.cards[i].prepend(imgs[i].value);
                        }
                        if(imgs[i].status === 'rejected'){
                            const img = new Image();
                            img.className = 'card__img';
                            img.src = './../img/notFound.jpg';
                            result.cards[i].prepend(img);
                        }
                    }
                    return result.cards
                })
                .then((cards) => {
                    const tamplate = document.createDocumentFragment();
                    tamplate.append(...cards);
                    containerElem.append(tamplate);
                })
                .then(() => {
                    preload.remove();
                })
            }).catch((err) => {
                console.log('К сожелению апи платное, поэтому запрос проходит только с local хоста');
            }).finally(() => {
                preload.remove();
            })
    }

    window.addEventListener('DOMContentLoaded', (e) => {
        e.preventDefault();
        const countCard = 8;
        const url = `https://newsapi.org/v2/everything?q=keyword&pageSize=${countCard}&apiKey=${apiKey}`;
        // renderCards(url, container);

        //закончились бесплатные запросты
        const jsonUrl =  './script/file.json'
        renderCards(jsonUrl, container);
            

        });
        
    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        formEventHandlerSubmit();
        });
    
    formSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            formEventHandlerKeyUp(e);
        }
    )
}

newsApiController();


