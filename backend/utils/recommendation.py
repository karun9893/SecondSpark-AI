def get_recommendation(soh, rul):

    if soh >= 90 and rul >= 500:
        return "Reuse in EV"

    elif soh >= 80 and rul >= 200:
        return "Second-Life Energy Storage"

    elif soh >= 70:
        return "Low-Demand Applications"

    else:
        return "Recycle Battery"