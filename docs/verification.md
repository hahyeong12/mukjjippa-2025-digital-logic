# 2026년 회로 검증 기록

**검증 시점:** 2026년 11월 15일  
**범위:** 2025년 제출 파일의 XML 형식, 회로 구조, 참조 및 원본 보존  
**미검증:** Logisim-evolution GUI에서 실제 묵찌빠 플레이 전 과정

## 확인한 항목

- [x] 원본 `.circ` UTF-8 XML 파싱
- [x] Logisim-evolution 소스 버전 `3.9.0` 확인
- [x] XML에 `Main`을 포함한 27개 회로 정의 존재
- [x] 회로 이름 중복 여부 확인
- [x] 프로젝트 시작 회로: 원본 `RPS_Reference_rip`, 실행용 사본 `Main`
- [x] 실제 원본 Git blob 해시 대조: `c5090f9ac27314de4bc20c842939a3fd7c41f5fa`
- [x] 실행용 파일의 Git blob 해시 대조: `b892daef3a371014a953c8b3cdadd347340dcbf7`
- [x] 실행용 사본은 기본 시작 회로만 1줄 변경
- [x] 프로젝트 내부 서브회로 이름의 정의 여부 확인
- [ ] 실제 Logisim GUI에서 모든 게임 시나리오 재생 및 결과 검증
- [ ] 컴퓨터 손 선택 신호의 통계적 무작위성 검증
- [ ] 타이밍 회로가 실제 하드웨어에서 안전한지 검증

## 로컬 검증

```bash
python scripts/validate_circuit.py
```

Python 3.10 이상 표준 라이브러리만 사용합니다. **이 검증이 묵찌빠 회로의 전기적·기능적 완전성을 증명하지는 않습니다.**

## 출처와 보존

`archive/kim_hahyeong_original.circ`는 2025년 제출 파일 그대로 보존하고, `circuit/mukjjippa-main.circ`는 열었을 때 `Main`으로 이동하기 쉽도록 만든 2026년 편의 사본입니다.

발표 포스터·보고서는 2025년 제출 자료이며, README와 이 문서 및 검사 스크립트는 2026년에 추가한 아카이브 기록입니다.
