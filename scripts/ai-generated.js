import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.05'],
  },
};

// АНХААР 1: AI-ийн эх хувилбарт BASE_URL = 'https://example-shop.com' гэсэн
// санамсаргүй, зөвшөөрөгдөөгүй домэйн байсан. Ажиллуулахын өмнө гараар
// зөвшөөрөгдсөн test.k6.io болгож сольсон.
//
// АНХААР 2: AI-ийн эх хувилбарт `stages` БОЛОН `vus`/`duration` хоёуланг
// зэрэг ашигласан байсан — энэ бол k6-д зөвшөөрөгдөөгүй хослол
// ("using `duration` and `stages` options simultaneously is not allowed").
// vus/duration-г устгаж, зөвхөн stages-ийг үлдээсэн.
const BASE_URL = 'https://test.k6.io';

export default function () {
  const loginRes = http.get(`${BASE_URL}/`);
  check(loginRes, {
    'homepage status 200': (r) => r.status === 200,
  });

  sleep(1);

  const searchRes = http.get(`${BASE_URL}/`);
  check(searchRes, {
    'search-equivalent status 200': (r) => r.status === 200,
  });

  sleep(2);
}
