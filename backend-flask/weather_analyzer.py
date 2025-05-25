def analyze_weather(data):
    temp_c = data['temp']
    humidity = data['humidity']
    description = data['description']
    
    temp_f = round((temp_c * 9/5) + 32, 2)
    suggestion = "Looks good today!"
    if "rain" in description.lower():
        suggestion = "Carry an umbrella ☔"
    elif temp_c > 35:
        suggestion = "Stay hydrated! 🥵"

    return {
        "temp_f": temp_f,
        "suggestion": suggestion
    }
