# 묵찌빠 — Digital Logic Circuit Term Project

**2025년 2학기 · 디지털논리시스템 · 개인 텀프로젝트 · Logisim-evolution · 만점**

> **“단순 가위바위보라면 최하점”이라는 말에서 출발해, 오히려 가위바위보를 발전시켜 보자고 생각했습니다.** 공격권을 기억하는 묵찌빠, 3판 2선승, 점수 기록, LED 손 모양과 결과 표시까지 직접 회로로 만들었습니다.

## 작품 미리보기

### 🎮 실제 Logisim 시연

[![묵찌빠 Logisim 회로 시연 영상](https://img.youtube.com/vi/myTF7Nq_vY8/hqdefault.jpg)](https://youtu.be/myTF7Nq_vY8)

▶ **시연 영상 바로가기** (썸네일 클릭)

### 🖼️ 발표 포스터

[<img src="docs/poster.png" width="720" alt="디지털논리시스템 묵찌빠 발표 포스터 — 주요 회로, 디버깅 과정, 최종 LED 게임 화면">](docs/poster.png)

*포스터 클릭 시 확대해서 볼 수 있습니다.*

**[▶ 회로 직접 실행하기](circuit/README.md)** · [실행용 Logisim 파일](circuit/mukjjippa-main.circ) · [회로 설계 자세히 보기](docs/implementation.md)

> 이 프로젝트의 작품은 웹 게임이 아닌 **Logisim-evolution으로 만든 디지털 논리회로(.circ)** 입니다. 회로 파일을 내려받아 Logisim에서 직접 조작할 수 있습니다.

---
## 1. 왜 묵찌빠였나?

교수님은 텀프로젝트에서 구현 주제와 난이도는 자유롭게 정하되, **하루 만에 만들 수 없는 작품, 공부와 노력의 흔적이 드러나는 작품**을 기대한다고 하셨습니다. 또 단순 가위바위보를 구현한다면 최하점을 받을 수 있다는 말씀도 하셨습니다.

그 말을 듣고 오히려 **“가위바위보를 출발점으로 삼아 더 복잡한 게임으로 확장하면 어떨까?”** 하는 생각이 들었습니다.

일반 가위바위보는 현재의 손 두 개를 비교하면 끝납니다. 반면 묵찌빠는 **직전 승부의 공격권을 기억**해야 합니다. 여기에 **3판 2선승**, 게임 점수 저장, 최종 승리 표시를 더하면 수업에서 배운 **논리 게이트·D Flip-Flop·FSM·Decoder·Counter**를 하나의 작품 안에서 활용할 수 있었습니다.

## 2. 게임의 규칙과 결과

| 게임 상황 | 회로가 해야 하는 일 |
| --- | --- |
| 사용자와 컴퓨터가 손을 선택 | 각 손을 2비트 값으로 변환하고 저장 |
| 한쪽이 가위바위보 승리 | 승자에게 공격권 부여 |
| 공격권을 가진 쪽이 비김 | 그쪽의 라운드 승리, 점수 1 증가 |
| 다른 쪽이 승리 | 공격권 이동 |
| 먼저 2승 달성 | 최종 승리 결과 LED 점등 |

**최종 결과: 텀프로젝트 만점.**

제출 포스터에는 **공격권 기억, 라운드 판정, 점수 누적과 최종 승리 LED까지 구현한 모습**이 담겨 있습니다.

## 3. 어떻게 만들었나?

~~~mermaid
flowchart TD
    A["플레이어 버튼"] --> PE["Player_Encoder"]
    B["Comp_RNG"] --> CH["Com_Hold"]
    PE --> PH["Player_Hold"]
    PH --> REF["RPS_Reference"]
    CH --> REF
    REF --> FSM["FSM_Controller / 공격권 기억"]
    FSM --> SCORE["Score_Counter × 2"]
    SCORE --> WIN["2승 판정 · 결과 LED"]
    PH --> DISP["Display_Controller"]
    CH --> DISP
    DISP --> LED["LED 손 모양"]
~~~

| 기능 | 구현 회로 | 설계 이유 |
| --- | --- | --- |
| 손 선택 | Player_Encoder / Comp_RNG | 사용자 버튼과 컴퓨터 손 선택을 공통 신호로 처리 |
| 손 모양 기억 | Player_Hold / Com_Hold | 판정 중에도 선택한 손을 유지 |
| 가위바위보 판정 | RPS_Reference | 승·패·무를 PW / CW / Tie로 분리 |
| 공격권과 라운드 | FSM_Controller | **이전 상태를 기억**해 비김을 라운드 승리로 판정 |
| 2선승 점수 관리 | Score_Counter | D Flip-Flop으로 점수를 저장하고 2승 판정 |
| 디스플레이 | Display_Controller / Blink_Gen | LED 손 모양과 승패·결과 점등 |

**[회로별 게이트 구성과 설계 이유 자세히 보기](docs/implementation.md)**

## 4. 가장 어려웠던 부분

**FSM 재설계.** 일반 승패 판정은 됐지만 묵찌빠의 공격권 상태와 라운드 승리를 연결하자 회로가 복잡해졌습니다. **K-Map으로 논리식을 줄이고**, 여러 지점에 **Probe를 연결해 신호를 직접 추적**하면서 FSM을 다시 구성했습니다. 보고서에는 이 문제로 **하루 약 2시간씩 10일 이상** 고민했다고 적었습니다.

**신호 순서와 점수 오류.** 손 저장·승패 판정·점수·FSM 갱신이 어긋나 점수가 0→1→3처럼 건너뛰기도 했습니다. 저장·판정·카운터가 동작하는 순서를 조정하며 원인을 추적했습니다. 최종 구현 범위는 당시 제출 포스터와 회로 파일을 기준으로 설명합니다.

**직접 그린 LED 화면.** 원하는 그래픽을 사용하기 어려워 **Main에 LED 327개**를 배치해 손 모양과 게임 화면을 만들었습니다. 배선과 Tunnel을 정리하고, 한 손 윤곽에서 가위·바위·보를 다르게 점등하는 방식으로 다듬었습니다.

[**기획 계기와 디버깅 과정 자세히 읽기**](docs/retrospective.md)

## 5. 직접 실행과 원본 자료

1. [Logisim-evolution 3.9.0](https://github.com/logisim-evolution/logisim-evolution/releases/tag/v3.9.0)을 설치합니다.
2. [실행용 회로 (.circ)](circuit/mukjjippa-main.circ) 파일 화면에서 **Download raw file**을 눌러 저장합니다.
3. Logisim에서 **File → Open**으로 해당 파일을 열고 **Main** 화면의 버튼을 조작합니다.

GitHub에서 `.circ` 파일을 누르면 회로 대신 XML 텍스트가 보일 수 있습니다. [실행 안내와 이미지가 있는 circuit 폴더](circuit/README.md)에서 시작하는 것이 편리합니다.

[2025년 제출 원본](archive/kim_hahyeong_original.circ)은 별도로 보존했습니다. 실행용 파일은 시작 화면을 Main으로 설정한 사본입니다.

---

서울과학기술대학교 · Digital Logic Systems · 2025
