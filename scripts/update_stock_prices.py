#!/usr/bin/env python3
"""Update one-month returns for verified Meesman top-100 listings.

Requires: pip install yfinance
Run from repository root: python scripts/update_stock_prices.py
Unverified ticker candidates are deliberately excluded from rankings.
"""
import json
import math
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yfinance as yf

SOURCE = Path('data/meesman-top-100-met-tickers.json')
DEST = Path('public/data/stock-rankings.json')


def main():
    source = json.loads(SOURCE.read_text(encoding='utf-8'))
    today = datetime.now(timezone.utc).date()
    start_target = today - timedelta(days=30)
    entries = []
    skipped = []

    for company in source['holdings']:
        name = company['name']
        ticker = company.get('tickerCandidate')
        # Only explicitly reviewed listings can enter the rankings.
        if not ticker or company.get('tickerStatus') != 'verified':
            skipped.append({'name': name, 'reason': 'Beurscode nog niet gecontroleerd'})
            continue
        try:
            history = yf.Ticker(ticker).history(
                start=(start_target - timedelta(days=8)).isoformat(),
                end=(today + timedelta(days=1)).isoformat(),
                auto_adjust=True,
                actions=False,
            )
            if history.empty or 'Close' not in history:
                raise ValueError('Geen historische slotkoersen')
            closes = history['Close'].dropna()
            if closes.empty:
                raise ValueError('Geen geldige slotkoersen')
            # Use the last session on/before the target day, and the latest session.
            earlier = closes[closes.index.date <= start_target]
            if earlier.empty:
                raise ValueError('Geen koers op of voor de begindatum')
            first, last = float(earlier.iloc[-1]), float(closes.iloc[-1])
            if not (math.isfinite(first) and math.isfinite(last) and first > 0 and last > 0):
                raise ValueError('Ongeldige koerswaarden')
            first_date = earlier.index[-1].date()
            last_date = closes.index[-1].date()
            if last_date <= first_date or (today - last_date).days > 7:
                raise ValueError('Koersen ontbreken of zijn verouderd')
            entries.append({
                'name': name, 'ticker': ticker,
                'currency': (company.get('currencies') or [None])[0],
                'weightPercent': company['weightPercent'],
                'startDate': first_date.isoformat(), 'endDate': last_date.isoformat(),
                'startPrice': round(first, 6), 'endPrice': round(last, 6),
                'returnPercent': round((last / first - 1) * 100, 4),
            })
        except Exception as exc:
            skipped.append({'name': name, 'ticker': ticker, 'reason': str(exc)[:180]})

    ordered = sorted(entries, key=lambda item: item['returnPercent'])
    result = {
        'fund': source.get('fund'), 'holdingsDate': source.get('holdingsDate'),
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'period': 'ongeveer 1 maand (30 kalenderdagen, handelsdagen)',
        'method': 'Aangepaste slotkoersen in lokale noteringsvaluta; geen valutaomrekening naar EUR',
        'universeCount': len(source['holdings']), 'calculatedCount': len(entries),
        'complete': len(entries) == len(source['holdings']),
        'status': 'ready' if len(entries) == len(source['holdings']) else 'incomplete',
        'topGainers': list(reversed(ordered[-5:])),
        'topLosers': ordered[:5],
        'skipped': skipped,
    }
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Berekend: {len(entries)}/{len(source['holdings'])}; overgeslagen: {len(skipped)}")
    print(f'Bestand: {DEST}')
    if not result['complete']:
        print('LET OP: ranglijsten zijn onvolledig; publiceer niet als volledige Top 100.')


if __name__ == "__main__":
    main()
