import discord
import requests
import json
import os
import asyncio


# Initialize Discord client
client = discord.Client()

portfolio = [
    {'symbol': 'usdt', 'quantity': 20381.6},
    {'symbol': 'eth', 'quantity': 8.63366346},
    {'symbol': 'btc', 'quantity': 0.43206592},
    {'symbol': 'algo', 'quantity': 146034.0},
    {'symbol': 'usdp', 'quantity': 8994.910000000003},
    {'symbol': 'ilv', 'quantity': 181.02},
    {'symbol': 'usdc', 'quantity': 1943.556999999997},
    {'symbol': 'ncash', 'quantity': 17532031.0},
    {'symbol': 'dimo', 'quantity': 17121.0},
    {'symbol': 'dpr', 'quantity': 150845.681},
    {'symbol': 'tusd', 'quantity': 300.0},
    {'symbol': 'planets', 'quantity': 199214.0},
    {'symbol': 'mxc', 'quantity': 22400.38},
    {'symbol': 'hnt', 'quantity': 39.06},
    {'symbol': 'silv2', 'quantity': 1.0},
    {'symbol': 'iot', 'quantity': 60777.0}
]

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

def fetch_token_data(symbol):
    response = requests.get(f'https://api.coingecko.com/api/v3/simple/price?ids={symbol}&vs_currencies=usd')
    if response.status_code == 200:
        return response.json()
    else:
        return None


@client.event
async def on_message(message):
    if message.content.startswith('!show_portfolio'):
        portfolio_summary = 'Your portfolio:\n'
        total_portfolio_value = 0

        for token in portfolio:
            data = fetch_token_data(token['symbol'])
            if data:
                price = data[token['symbol']]['usd']
                total_value = price * token['quantity']
                total_portfolio_value += total_value
                portfolio_summary += f"{token['symbol'].upper()}: {token['quantity']} tokens, Current Price: ${price}, Total Value: ${total_value}\n"

        portfolio_summary += f"Total Portfolio Value: ${total_portfolio_value}"
        await message.channel.send(portfolio_summary)

client.run('YOUR_DISCORD_BOT_TOKEN')


