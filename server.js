import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool } from './mysql.js';

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

app.post('/hello', async (req, res) => {
    try {
        const { name, age } = req.body;

        if (!name || !age) {
            throw new Error('이름이나 나이가 없습니다.');
        }

        res.json({
            message: `이름: ${name}, 나이: ${age}`
        })
    } catch (err) {
        console.log('쿼리 삽입 에러: ', err.message);

        res.json({ message: err.message });
    }
});

/**
 * CRUD
 * get - SELECT
 * post - INSERT
 * put - UPDATE
 * delete - DELETE
 */

app.get('/person', async (req, res) => {
    const [row] = await pool.query(`select name, age from users`);

    const result = row[0];

    console.log(result.name, result.age);

    res.json({
        name: result.name,
        age: result.age
    });
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('연결 성공');
        connection.release();

        app.listen(3000, () => {
            console.log('서버 시작: http://localhost:3000');
        });
    } catch (err) {
        console.error('서버 스타트 에러: ', err);
    }
})();
