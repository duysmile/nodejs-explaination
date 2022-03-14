import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 100,
    iterations: 100,
};

export default function () {
    const res = http.post('http://localhost:9000/app/game/start', JSON.stringify({
        "game_id": "DCGF8B5bAJGFdZa4jrGA"
    }), {
        headers: {
            'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiRENDcFRycmFEOXRIR1pHelk0UE8ifQ.Fg3VbxH80OqvliMjsZtesPO_1boZtMbzAeWhOYrBQoU',
            'Content-Type': 'application/json'
        },
    });

    check(res, { 'status was 200': (r) => r.status == 200 });
}

// export default function () {
//     const res = http.post('http://119.82.141.119/api/v1/transcripts', JSON.stringify({
//         "audioPath": "abc.wav",
//         "channelId": "1",
//         "transcript": "xin chào",
//     }), {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'wWPBZb7rKryrXLABP62cu2S6WqfSxcaQ',
//         },
//     });

//     check(res, { 'status was 200': (r) => r.status == 200 });
// }
