const http = require('http');
const url = require('url');
const fs = require('fs');

///////////////////////////////////////////////////////////////////////////////
//SERVER
const tempCard = fs.readFileSync(`${__dirname}/template-card.html`,'utf-8');
const tempIndex = fs.readFileSync(`${__dirname}/template-index.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8');
const dataObj = JSON.parse(data);


const replaceTemplate = (temp,product) => {
    let output = temp.replace(/{{PRODUCTNAME}}/g, product.productName);
    output = output.replace(/{{IMAGE}}/g, product.image);
    output = output.replace(/{{PRICE}}/g, product.price);
    output = output.replace(/{{ORIGIN}}/g, product.from);
    output = output.replace(/{{NUTRIENTS}}/g, product.nutrients);
    output = output.replace(/{{QUANTITY}}/g, product.quantity);
    output = output.replace(/{{DESCRIPTION}}/g, product.description);
    output = output.replace(/{{ID}}/g, product.id);

    if(!product.organic) output = output.replace(/{{ISORGANIC}}/g, 'is-organic')

    return output;
}

const server = http.createServer((req,res) => {
    
    const { query,pathname } = url.parse(req.url,true);


    // INDEX PAGE
    if(pathname === '/index' || pathname === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempIndex.replace('{{PRODUCT_CARDS}}',cardsHtml);
        res.end(output);

    }

    // PRODUCT PAGE
    else if(pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }

    // API
    else if(pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    }

    // 404
    else {
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header': 'hello-chrome'
        });

        res.end('<h1> sorry, 404! </h1>');

    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('listening...');
})