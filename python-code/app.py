import streamlit as st
import pandas as pd
from predict_recommendation import predict_crop

st.set_page_config(page_title="Crop Guidance System", layout="wide")

st.title("🌱 DCF-SEL Crop Guidance System")
st.write("Get crop recommendations powered by stacked ensemble ML + weather forecasts.")

cols = st.columns(3)
with cols[0]:
    N = st.number_input("Nitrogen (N)", 0, 200, 50)
    P = st.number_input("Phosphorus (P)", 0, 200, 50)
    K = st.number_input("Potassium (K)", 0, 200, 50)

with cols[1]:
    temp = st.number_input("Temperature (°C)", 0.0, 50.0, 25.0)
    hum = st.number_input("Humidity (%)", 0.0, 100.0, 65.0)
    ph = st.number_input("Soil pH", 0.0, 14.0, 6.5)

with cols[2]:
    rain = st.number_input("Rainfall (mm)", 0.0, 500.0, 100.0)
    hum_fc = st.number_input("Humidity Forecast 7d (optional)", 0.0, 100.0, 65.0)
    rain_fc = st.number_input("Rain Forecast 7d (optional)", 0.0, 500.0, 80.0)

if st.button("Recommend Crops"):
    sample = {
        "n": N, "p": P, "k": K,
        "temperature": temp, "humidity": hum,
        "ph": ph, "rainfall": rain,
        "hum_fc_7": hum_fc, "rain_fc_7": rain_fc,
        "pest_risk_index": (hum_fc/100 * 0.5) + (min(1, rain_fc/50)*0.3)
    }
    results = predict_crop(sample)
    st.subheader("Top Crop Recommendations")
    for crop, score in results:
        st.write(f"**{crop}** — Score: {round(score, 3)}")

