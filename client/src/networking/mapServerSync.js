import axios from 'axios';
import Eatable from '../gameGraphics/eatable';
import { serverUrl } from '../utils/config';

let getMapFromServer = async () => (await axios.get(serverUrl + '/get-map')).data;

export let getFoodArrayFromServer = async () => {
  return (await getMapFromServer()).map((mapPiece) => new Eatable(mapPiece.id, mapPiece.xPos, mapPiece.yPos));
};

export let supplementMapOnServer = async () => {
  await axios.get(serverUrl + '/supplement-map');
};

export let removeMapPieceOnRerver = async (id) => {
  await axios.post(serverUrl + '/remove-piece', JSON.stringify({ id: id }));
};
