import { Bubble, PlayerBubble } from '../gameGraphics/bubble';
import axios from 'axios';
import { serverUrl } from '../utils/config';
import { getRandomInt } from '../utils/randUtils';

export let getServerPlayersWithoutCurrent = (serverPlayers) =>
  serverPlayers.filter((serverPlayer) => serverPlayer.id !== PlayerBubble._instance.id);


export let checkIfPlayerIsAliveOnServer = async() => {
  let allPlayers = await getAllPlayersFromServer();
  return allPlayers.filter(player => PlayerBubble._instance.id === player.id).length > 0
}

// Upadtes client players coordinates to server coordiantes
export let updatePlayersCoordiatesFromServer = (serverPlayers, clientPlayers) => {
  serverPlayers.forEach((serverPlayer) => {
    let exists = false;
    clientPlayers.forEach((clientPlayer) => {
      if (serverPlayer.id === clientPlayer.id) exists = true;
    });
    if (!exists) clientPlayers.push(new Bubble(serverPlayer.id, serverPlayer.xPos, serverPlayer.yPos, 'orange', serverPlayer.radius));
  });
};

export let initliaizePlayerOnServer = async () => {
  let generateInitializationCode = () => getRandomInt(0, Number.MAX_SAFE_INTEGER);

  let initCode = generateInitializationCode();
  await axios.post(serverUrl + '/initialize-player', JSON.stringify({ 'player-id': initCode }));
  return initCode;
};

export let getAllPlayersFromServer = async () => (await axios.get(serverUrl + '/get-players')).data;

export let removePlayerFromServer = async (id) => {
  return await axios.post(serverUrl + '/remove-player', JSON.stringify({ 'player-id': id }));
};

export let updatePlayerOnServer = async (player) => {
  await axios.post(
    serverUrl + '/update-player',
    JSON.stringify({
      'player-id': player.id,
      'x-pos': player.xPos,
      'y-pos': player.yPos,
      radius: player.radius,
    })
  );
};
