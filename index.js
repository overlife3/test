const express = require("express")
const fs = require('fs');
const cors = require("cors")
const categories = require("./data/categories.json")
const items = require("./data/products.json")

const app = express()

const port = process.env.PORT || 7074

app.use(cors());

// const categories = JSON.parse(categoriesJSON);
// const items = JSON.parse(productsJSON);
const topSaleIds = [66, 65, 73];
const moreCount = 6;

const itemBasicMapper = item => ({
    id: item.id,
    category: item.category,
    title: item.title,
    price: item.price,
    images: item.images,
});

const randomNumber = (start, stop) => {
    return Math.floor(Math.random() * (stop - start + 1)) + start;
}

const fortune = (res, body = null, status = 200) => {
    // Uncomment for delay
    const delay = randomNumber(1, 1) * 1000;
    // const delay = 0;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Uncomment for error generation
            if (Math.random() > 1) {
                reject(new Error('Something bad happened'));
                return;
            }

            res.status(status);
            res.send(body);
            resolve();
        }, delay);
    })
}


app.get('/api/top-sales', (req, res) => {
	return fortune(res, items.filter(o => topSaleIds.includes(o.id)).map(itemBasicMapper));
});

app.get('/api/categories', (req, res) => {
	return fortune(res, categories);
});

app.get('/api/items', async (req, res) => {
	const { query } = req;

	const categoryId = query.categoryId === undefined ? 0 : Number(query.categoryId);
	const offset = query.offset === undefined ? 0 : Number(query.offset);
	const q = query.q === undefined ? '' : query.q.trim().toLowerCase();

	const filtered = items
			.filter(o => categoryId === 0 || o.category === categoryId)
			.filter(o => o.title.toLowerCase().includes(q) || o.color.toLowerCase() === q)
			.slice(offset, offset + moreCount)
			.map(itemBasicMapper);

	return fortune(res, filtered);
});

app.get('/api/items/:id',  (req, res) => {
	const id = Number(req.params.id);
	const item = items.find(o => o.id === id);
	if (item === undefined) {
			return fortune(res, 'Not found', 404);
	}

	return fortune(res, item);
});

app.post('/api/order', (req, res) => {
	const { owner: { phone, address }, items } = req.body;
	if (typeof phone !== 'string') {
			return fortune(res, 'Bad Request: Phone', 400);
	}
	if (typeof address !== 'string') {
			return fortune(res, 'Bad Request: Address', 400);
	}
	if (!Array.isArray(items)) {
			return fortune(res, 'Bad Request: Items', 400);
	}
	if (!items.every(({ id, price, count }) => {
			if (typeof id !== 'number' || id <= 0) {
					return false;
			}
			if (typeof price !== 'number' || price <= 0) {
					return false;
			}
			if (typeof count !== 'number' || count <= 0) {
					return false;
			}
			return true;
	})) {
			return fortune(res, 'Bad Request', 400);
	}

	return fortune(res, null , 204);
});


app.listen(port, (error) => {
	error ? console.lof(error) : console.log('listening port ' + port)
})