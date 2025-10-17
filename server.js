import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 이래야 JSON 요청을 읽을 수 있음
app.use(express.json());

app.use(express.static('docs'));

app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.get('/bbb', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;

    res.send(`${a} + ${b} = ${Number(a) + Number(b)}`);
});

app.post('/hello', (req, res) => {
    try {
        const { name, age } = req.body;

        if (!age) {
            throw new Error('나이가 없습니다.');
        }

        res.json({
            message: `이름: ${name}, 나이: ${age}`
        })
    } catch (err) {
        res.json({ message: err.message });
    }
});

app.listen(3000, () => {
    console.log('서버 시작: http://localhost:3000');
});