from flask import Blueprint, request
import json
from utils import *
from renderable import Renderable
from random import randrange

map = Blueprint("map", __name__)

max_map_pieces = 60
generation_limits = {'min': -900, 'max': 900}
max_safe_js_int = 9007199254740991

map_pieces = []


@map.route('/supplement-map', methods=['GET'])
def supplement_map():
    for i in range(max_map_pieces - len(map_pieces)):
        new_piece = Renderable(randrange(max_safe_js_int))
        new_piece.xPos = randrange(
            generation_limits['min'], generation_limits['max'])
        new_piece.yPos = randrange(
            generation_limits['min'], generation_limits['max'])
        map_pieces.append(new_piece)
    return '0'


@map.route('/get-map', methods=['GET'])
def get_map():
    return json.dumps([ob.__dict__ for ob in map_pieces])


@map.route('/remove-piece', methods=['POST'])
def remove_piece():
    data_from_client = convert_request_data_to_dict(request)
    global map_pieces
    map_pieces = [piece for piece in map_pieces if piece.id !=
                  data_from_client["id"]]
    supplement_map()
    return '0'
