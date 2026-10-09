import json
import re
import time
from pathlib import Path

import yfinance as yf


FILE = Path("data/meesman-top-100-met-tickers.json")


def normalize(name):
    name = name.upper()
    name = re.sub(r"[^A-Z0-9 ]", " ", name)

    words_to_remove = {
        "INC", "CORP", "CORPORATION", "CO", "COMPANY",
        "LTD", "LIMITED", "PLC", "SA", "AG", "NV",
        "THE", "CLASS", "CL", "A", "B", "C"
    }

    words = [
        word for word in name.split()
        if word not in words_to_remove
    ]

    return " ".join(words)


def matches_company(holding_name, yahoo_name):
    a = normalize(holding_name)
    b = normalize(yahoo_name)

    if not a or not b:
        return False

    # Alleen een sterke naamovereenkomst accepteren.
    return a == b or (
        len(a) >= 6 and
        (b.startswith(a + " ") or a.startswith(b + " "))
    )


def main():
    with FILE.open("r", encoding="utf-8") as f:
        data = json.load(f)

    verified = 0
    needs_review = 0

    for company in data["holdings"]:
        name = company["name"]
        ticker = company.get("tickerCandidate")

        if company.get("tickerStatus") == "verified":
            verified += 1
            print(f"AL GOEDGEKEURD: {name} ({ticker})")
            continue

        if not ticker:
            needs_review += 1
            print(f"GEEN TICKER: {name}")
            continue

        try:
            stock = yf.Ticker(ticker)
            info = stock.info

            yahoo_name = (
                info.get("longName")
                or info.get("shortName")
                or ""
            )

            quote_type = info.get("quoteType", "")

            if (
                quote_type == "EQUITY"
                and matches_company(name, yahoo_name)
            ):
                company["tickerStatus"] = "verified"
                verified += 1
                print(
                    f"GOEDGEKEURD: {name} "
                    f"({ticker}) -> {yahoo_name}"
                )
            else:
                needs_review += 1
                print(
                    f"CONTROLEREN: {name} "
                    f"({ticker}) -> {yahoo_name}"
                )

        except Exception as error:
            needs_review += 1
            print(f"FOUT BIJ {name}: {error}")

        time.sleep(0.5)

    with FILE.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print()
    print(f"Geverifieerd: {verified}")
    print(f"Nog controleren: {needs_review}")
    print(f"Totaal: {len(data['holdings'])}")


if _name_ == "_main_":
    main()
