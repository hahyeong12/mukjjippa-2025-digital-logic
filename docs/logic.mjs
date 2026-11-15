// Muk Jji Ppa rules for the interactive browser demonstration.
// Independent of the original 2025 Logisim .circ implementation.
export const HANDS = Object.freeze({
  S: { label: "가위", icon: "✌️" },
  R: { label: "바위", icon: "✊" },
  P: { label: "보", icon: "✋" },
});
export const createGame = () => ({
  score: { player: 0, computer: 0 },
  attacker: null,
  winner: null,
  turn: 0,
  last: null,
  history: [],
});
export function roundResult(playerHand, computerHand) {
  if (!(playerHand in HANDS) || !(computerHand in HANDS)) throw new Error("Unknown hand");
  if (playerHand === computerHand) return "tie";
  return (playerHand === "S" && computerHand === "P") ||
         (playerHand === "R" && computerHand === "S") ||
         (playerHand === "P" && computerHand === "R") ? "player" : "computer";
}
export function nextGame(game, playerHand, computerHand) {
  if (game.winner) return game;
  const winnerOfRps = roundResult(playerHand, computerHand);
  const state = {
    score: { ...game.score }, attacker: game.attacker,
    winner: null, turn: game.turn + 1,
    last: null, history: [...game.history],
  };
  let message = "";
  if (winnerOfRps === "tie") {
    if (state.attacker) {
      const scorer = state.attacker;
      state.score[scorer] += 1;
      message = (scorer === "player" ? "플레이어" : "컴퓨터") + "가 공격 중에 비겼습니다. 라운드 승리!";
      state.attacker = null;
      if (state.score[scorer] >= 2) {
        state.winner = scorer;
        message += " 2승 달성, 최종 승리!";
      } else {
        message += " 다음 라운드는 다시 가위바위보부터 시작합니다.";
      }
    } else {
      message = "비겼지만 아직 공격권이 없어 라운드는 계속됩니다.";
    }
  } else {
    const switched = state.attacker && state.attacker !== winnerOfRps;
    state.attacker = winnerOfRps;
    const name = winnerOfRps === "player" ? "플레이어" : "컴퓨터";
    message = switched ? name + "가 공격권을 빼앗았습니다." : name + "가 공격권을 가졌습니다.";
  }
  const event = {
    turn: state.turn, playerHand, computerHand,
    winnerOfRps, attacker: state.attacker,
    score: { ...state.score }, winner: state.winner, message,
  };
  state.last = event;
  state.history = [event, ...state.history].slice(0, 12);
  return state;
}
