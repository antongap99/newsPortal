import loudImg from "./loud.js";

const fixProp = (prop) => {
    if(!prop || prop.includes('http')) {
        prop = '';
    }
    return prop;
}



const createCard =  (err, data) => {
    const container = document.querySelector('.card__container')
    if (err) {
        console.warn(err, data);
        return;
    }
   
    if(data.totalResults === 0) {
        const resp = document.createElement('h1');
        resp.textContent = 'По вашему запросу ничего не найдено';
        container.append(resp);
    }   
      
      
      const imgs = [];
      const cards = data.articles.map((item) => {
        imgs.push(item.urlToImage);
        
        const card = document.createElement('div');
        card.className = 'news__card';

        const h1 = document.createElement('h1');
        h1.className = 'card__title';
        
        
        const a = document.createElement('a');
        a.href = `${item.url}`
        a.className = 'card__title-link';
        a.textContent = `${item.title}`;
        a.target = '_black';
        h1.append(a)

        const cardDescription = document.createElement('p');
        cardDescription.className = 'card__description';
        const discript = fixProp(item.description);
        cardDescription.textContent = `${discript}`

        const cardPublishedAt = document.createElement('p');
        cardPublishedAt.className = 'card__publishedAt';
        fixProp(item.publishedAt);
        cardPublishedAt.textContent = `${item.publishedAt}`;
        const cardFooter = document.createElement('div');
        cardFooter.className = 'card__footer';
        
        const author = document.createElement('p');
        author.className = 'card__author';
        const newProp =  fixProp(item.author);
        author.textContent = `${newProp}`;
       

        cardFooter.append(cardPublishedAt, author)
        card.append(h1, cardDescription, cardFooter);
        return card;
      })
        
      
        
        const result = {
            cards,
            data,
          } 
      return result;
}


export default createCard;