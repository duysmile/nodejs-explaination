import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 100,
    iterations: 100,
};

export default function () {
    const res = http.post('http://localhost:4001/ivr', JSON.stringify({
        "botId": "62175e6661d17adcc1f9f0dd",
        "shortcode": "842367109106",
        "userId": "0902123123",
        "inputText": "xin chao",
        "isStartConversation": true,
    }), {
        headers: {
            'authorization': 'bW=bD&X8+@gcJCmMxCmZY?6p*JGCrc#7',
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
