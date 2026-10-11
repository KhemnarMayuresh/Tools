'use strict';
importScripts('game-core.js','ai.js');
self.onmessage = function (event) {
  const {round,requestId} = event.data;
  try {
    const result = self.TicAI.chooseMove(round,{level:round.config.difficulty,maxMs:50});
    self.postMessage({requestId,roundId:round.id,move:result.move});
  } catch (error) {
    self.postMessage({requestId,roundId:round.id,error:'Computer decision failed.'});
  }
};
