# Railway 배포 절차

## 1. Postgres 추가
Railway 프로젝트에서 **New → Database → PostgreSQL** 추가. `DATABASE_URL`이 프로젝트 변수로 생성된다.

## 2. `web` 서비스
- **New → GitHub Repo**로 이 레포 연결
- 기본 config-as-code 경로(`railway.json`)를 그대로 사용 — Nixpacks가 `npm run build`(prisma generate + migrate deploy + next build) 후 `npm run start` 실행
- Settings → Variables에서 `DATABASE_URL`을 Postgres 서비스 변수로 참조(`${{Postgres.DATABASE_URL}}`)
- Healthcheck Path는 `railway.json`에 이미 `/api/health`로 설정됨

## 3. `cron` 서비스
- 같은 레포로 **New Service** 추가 (동일 레포, 별도 서비스)
- Settings → Config-as-code Path를 `railway.cron.json`으로 지정 (`prisma generate` 후 `npm run feeds:fetch`만 실행, `next build` 생략)
- Settings → Variables에 동일하게 `DATABASE_URL` 연결
- Settings → Cron Schedule에 `0 */3 * * *` 입력 (3시간마다 실행, 실행 후 프로세스 종료)

## 4. 최초 시딩
로컬에서 프로덕션 `DATABASE_URL`을 가리키게 하고 1회 실행 (Railway 대시보드의 Postgres `Connect` 탭에서 외부 연결 문자열 확인):

```bash
DATABASE_URL="<production-url>" npm run db:seed
```

## 5. 배포 후 확인
- `web` 서비스 URL의 `/api/health` 호출 → `{ status: "ok", sources: [...] }` 및 각 소스 `lastFetchedAt`이 채워지는지 확인
- `cron` 서비스 Deployments 로그에서 소스별 `[ok]`/`[fail]` 라인 확인
- 첫 배포 직후에는 `lastFetchedAt`이 비어 있는 게 정상 — cron 첫 실행(최대 3시간 이내) 또는 대시보드에서 cron 서비스를 수동 트리거해 즉시 확인 가능
