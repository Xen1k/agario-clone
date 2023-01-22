import ast


def convert_request_data_to_dict(axios_data):
    return ast.literal_eval(next(iter(axios_data.form.to_dict())))