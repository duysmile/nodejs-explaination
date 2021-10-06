import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 10,
    iterations: 100,
};

export default function() {
    const res = http.get('http://localhost:3000/logic');

    check(res, { 'status was 200': (r) => r.status == 200 });
}