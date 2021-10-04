import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 100,
    iterations: 100000,
};

export default function () {
    const res = http.post(
        'http://localhost:3000/insert_batch',
        JSON.stringify({
            userId: "0368605407",
            text: "xin chào mình là Duy",
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        },
    );

    check(res, { 'status was 200': (r) => r.status == 200 });
}
