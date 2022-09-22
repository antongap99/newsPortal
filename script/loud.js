const loudImg  = (err ,url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.className = 'card__img';
    img.src = url;

    img.addEventListener('load', () => {
        resolve(img);
    });
    img.addEventListener('error', () => {
        reject(err);
    })
}) 


export default loudImg;