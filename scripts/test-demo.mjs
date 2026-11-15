import test from "node:test";
import assert from "node:assert/strict";
import { createGame, roundResult, nextGame } from "../docs/logic.mjs";

test("all 9 RPS results", () => {
  const results = [
    ["S","S","tie"], ["S","R","computer"], ["S","P","player"],
    ["R","S","player"], ["R","R","tie"], ["R","P","computer"],
    ["P","S","computer"], ["P","R","player"], ["P","P","tie"],
  ];
  for (const [p,c,result] of results) assert.equal(roundResult(p,c),result);
});
test("without attack, a tie does not score",()=>{
  const x=nextGame(createGame(),"S","S");
  assert.equal(x.attacker,null);assert.deepEqual(x.score,{player:0,computer:0});
});
test("player gains attack, then tie scores and resets attack",()=>{
  const a=nextGame(createGame(),"R","S");
  assert.equal(a.attacker,"player");
  const b=nextGame(a,"P","P");
  assert.deepEqual(b.score,{player:1,computer:0});
  assert.equal(b.attacker,null);assert.equal(b.winner,null);
});
test("attack switches after opposite wins, then tie scores opponent",()=>{
  let s=nextGame(createGame(),"S","P");
  s=nextGame(s,"S","R");
  assert.equal(s.attacker,"computer");
  s=nextGame(s,"R","R");
  assert.deepEqual(s.score,{player:0,computer:1});
});
test("two round wins finish game and ignore later turns",()=>{
  let s=createGame();
  s=nextGame(s,"R","S");s=nextGame(s,"S","S");
  s=nextGame(s,"P","R");s=nextGame(s,"P","P");
  assert.equal(s.winner,"player");assert.equal(s.score.player,2);
  assert.equal(nextGame(s,"S","R"),s);
});
test("computer can win 2 rounds",()=>{
  let s=createGame();s=nextGame(s,"S","R");s=nextGame(s,"S","S");
  s=nextGame(s,"P","S");s=nextGame(s,"R","R");
  assert.equal(s.winner,"computer");assert.equal(s.score.computer,2);
});
test("invalid hands are rejected",()=>assert.throws(()=>roundResult("invalid","P")));
