import http from 'k6/http';
import { check, sleep } from 'k6';

// АНХААР: p(95)<50 threshold нь бодит baseline (~271ms)-аас хамаагүй хатуу,
// зориудаар сонгосон утга. Зорилго нь FAIL-ыг харуулах, тул серверт ердийн
// бус их ачаалал өгөхгүйгээр (30 VU-гийн энгийн ачаалал дор) threshold FAIL-ыг
// нотлохын тулд ийнхүү хийсэн.
export const options = {
  vus: 30,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<50'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
