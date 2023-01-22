from flask import Blueprint, request
import json
from utils import *
from renderable import Renderable

player = Blueprint("player", __name__)

players = []

class Player(Renderable):
    radius = 0


@player.route('/initialize-player', methods=['POST'])
def initialize_player():
    data_from_client = convert_request_data_to_dict(request)
    global players
    players.append(Player(data_from_client["player-id"]))
    return '0'

@player.route('/remove-player', methods=['POST'])
def remove_player():
    data_from_client = convert_request_data_to_dict(request)
    global players
    players = [player for player in players if player.id !=
               data_from_client["player-id"]]
    return '0'

@player.route('/update-player', methods=['POST'])
def update_player():
    data_from_client = convert_request_data_to_dict(request)
    try:
        current_player = next(
            (player for player in players if player.id == data_from_client["player-id"]), None)
        current_player.xPos = data_from_client["x-pos"]
        current_player.yPos = data_from_client["y-pos"]
        current_player.radius = data_from_client["radius"]
        return '0'
    except:
        return '1'

@player.route('/get-players', methods=['GET'])
def get_players_data():
    return json.dumps([ob.__dict__ for ob in players])