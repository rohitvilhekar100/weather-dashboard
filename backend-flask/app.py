from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze_weather():
    data = request.json
    temp_c = data.get('temp')
    description = data.get('description', '').lower()

    temp_f = round((temp_c * 9 / 5) + 32, 2)
    suggestion = "Looks like a normal day!"

    if "rain" in description:
        suggestion = "Take an umbrella ☔"
    elif temp_c > 35:
        suggestion = "Stay cool and drink water! 🥵"
    elif temp_c < 10:
        suggestion = "Bundle up, it's cold! 🧥"

    return jsonify({
        "temp_f": temp_f,
        "suggestion": suggestion
    })

if __name__ == '__main__':
    app.run(port=5000)
