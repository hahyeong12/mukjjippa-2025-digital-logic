# 회로 설계: 가위바위보를 ‘기억하는 게임’으로 확장하기

**디지털논리시스템 · Logisim-evolution · 개인 텀프로젝트**

가위바위보는 두 손을 비교하는 조합논리로 끝나지만, 묵찌빠는 **누가 공격권을 가졌는지 기억하는 순차논리**가 필요합니다. 입력 → 손 저장 → 승패 판정 → 공격권 관리 → 점수 기록 → LED 출력으로 기능을 나눴습니다.

~~~mermaid
flowchart TD
    A["플레이어 버튼"] --> PE["Player_Encoder"]
    B["Comp_RNG"] --> CH["Com_Hold"]
    PE --> PH["Player_Hold"]
    PH --> REF["RPS_Reference"]
    CH --> REF
    REF --> FSM["FSM_Controller"]
    FSM --> S["Score_Counter × 2"]
    S --> FINAL["2승 판정 / 결과 LED"]
    PH --> DISP["Display_Controller"]
    CH --> DISP
    DISP --> LED["LED 손 모양"]
~~~

## 기능별 구현과 이유

| 서브회로 | 실제 구성 | 이렇게 만든 이유 |
| --- | --- | --- |
| **Player_Encoder** | BTN_S·BTN_R·BTN_P → P1·P0·CLK, OR 게이트 3개 | 버튼을 공통 2비트 코드로 바꾸기 위해 |
| **Comp_RNG** | D Flip-Flop 2개와 XOR/OR 게이트 | 컴퓨터도 내부 회로로 손 선택 신호를 만들기 위해 |
| **Player_Hold / Com_Hold** | 각각 D Flip-Flop 2개 | 입력 이후 손 모양을 고정해 판정 기준을 유지하기 위해 |
| **RPS_Reference** | AND/OR/NOT/XNOR, PW·CW·Tie 출력 | 가위바위보 비교 회로를 다른 로직과 분리하기 위해 |
| **FSM_Controller** | D Flip-Flop 3개, PW·CW·Tie·CLK·Reset | 공격권과 직전 상태를 기억하고 비김을 라운드 승리로 바꾸기 위해 |
| **Score_Counter** | D Flip-Flop 2개, INC·Q0/Q1·WIN | 라운드 승점을 누적해 2선승을 판정하기 위해 |
| **Display_Controller** | 2비트 입력과 논리 게이트 | 손 모양 코드를 LED 점등으로 변환하기 위해 |
| **Blink_Gen** | D Flip-Flop 3개 | 승패에 따른 점멸 표시를 만들기 위해 |
| **Main** | LED 327개, 배선 1,099개 | 입력부터 점수와 손 모양까지 한 화면에 표시하기 위해 |

### 1. 세 가지 손을 2비트로 표시

가위 **01**, 바위 **10**, 보 **11**을 사용했습니다. Player_Encoder가 버튼 입력을 변환하고 RPS_Reference에서 양쪽 손을 비교해 **PW(플레이어 승), CW(컴퓨터 승), Tie(비김)** 신호를 냅니다.

### 2. 선택을 저장하는 D Flip-Flop

Player_Hold와 Com_Hold에 각각 2개의 D Flip-Flop을 넣어 입력 시점의 손 모양을 기억합니다. 손의 선택과 판정이 다른 순간에 이뤄지더라도 같은 승부의 정보를 사용하도록 구성한 것입니다.

### 3. 공격권 FSM

비겼다는 사실만으로는 묵찌빠의 승자를 알 수 없습니다. FSM_Controller는 **이전 공격권과 지금의 비김 신호**를 함께 판단합니다.

| 상태·사건 | 결과 |
| --- | --- |
| 공격권 없음 + 비김 | 득점 없음 |
| 플레이어 승리 | 플레이어가 공격권 확보 |
| 컴퓨터 승리 | 컴퓨터가 공격권 확보 |
| 플레이어 공격 + 비김 | 플레이어 라운드 승리 |
| 컴퓨터 공격 + 비김 | 컴퓨터 라운드 승리 |

초기 FSM은 AND/OR 게이트 조합이 너무 복잡해 디버깅이 어려웠습니다. **K-Map으로 논리식을 간소화한 뒤 Probe를 각 입력·출력에 꽂아 신호를 추적하면서** 문제를 해결했습니다.

### 4. 점수 기억과 최종 승리

FSM에서 나온 Round_pw / Round_cw를 Score_Counter에서 누적하고, **WIN** 신호로 2승 달성을 판정했습니다. 개발 중 점수가 0→1→3이나 0→1→2→4로 건너뛰는 현상이 있었는데, 값 자체뿐 아니라 **신호가 도착하고 저장되는 순서**가 문제였습니다.

### 5. 전파 지연과 동작 순서

포스터에는 손을 저장하는 경로에 NOT 게이트 **2개**, Score_CLK에 **8개**, FSM_CLK에 **14개**를 연결해 신호 순서를 조정한 과정이 기록돼 있습니다. 이는 당시 Logisim 시뮬레이션에서 적용한 방법으로, 실제 하드웨어의 범용 클록 설계 규칙을 뜻하지는 않습니다.

### 6. LED 게임 화면

Logisim으로 오락기 화면을 그대로 꾸미기 어려워 **LED 327개를 직접 배치**했습니다. 가위·바위·보별로 손 전체를 따로 만들기보다 하나의 손 윤곽에서 점등 패턴을 변경했고, 배선과 Tunnel이 화면에 드러나는 문제도 조정했습니다.

## 설계 파일

[실행용 회로](../circuit/mukjjippa-main.circ) · [제출 원본 회로](../archive/kim_hahyeong_original.circ) · [실제 Logisim 시연 영상](https://youtu.be/myTF7Nq_vY8)

포스터에는 **Main + 19개 Subcircuit**으로 설명했고, 현재 원본 파일에는 이전 설계와 실험용 회로까지 포함해 27개 회로 정의가 남아 있습니다. 초기 FSM 회로들도 설계 과정을 보여주는 자료입니다.
