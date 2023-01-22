from flask import Flask
from flask_cors import CORS
from player import player
from map import map

app = Flask(__name__)
app.register_blueprint(player, url_prefix="")
app.register_blueprint(map, url_prefix="")
cors = CORS(app)


if __name__ == '__main__':
    app.run(debug=True, port=80)
