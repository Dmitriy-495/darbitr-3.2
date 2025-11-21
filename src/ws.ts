import WebSocket from "ws";
import { ConfigLoader } from "./config/loader";

export class WSManager {
  private connections = new Map();
  private prices = new Map();
  private configLoader = new ConfigLoader();

  async start() {
    console.log("🚀 Запуск WS...");

    const exchanges = this.configLoader.getEnabledExchanges();
    const actives = this.configLoader.getEnabledActives();

    for (const exchange of exchanges) {
      if (exchange.enabled) {
        this.connect(exchange, actives);
      }
    }
  }

  private connect(exchange: any, actives: any[]) {
    const ws = new WebSocket(exchange.ws_url);

    ws.on("open", () => {
      console.log(`✅ ${exchange.name} подключен`);
      actives.forEach((active) => {
        ws.send(
          JSON.stringify({
            op: "subscribe",
            args: [`tickers.${active.symbol}`],
          })
        );
      });
    });

    ws.on("message", (data: any) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.data?.lastPrice) {
          const price = parseFloat(parsed.data.lastPrice);
          this.prices.set(`${exchange.code}_${parsed.data.symbol}`, price);
          console.log(`📊 ${parsed.data.symbol}: $${price}`);
        }
      } catch (e) {}
    });

    ws.on("close", () => {
      setTimeout(() => this.connect(exchange, actives), 5000);
    });
  }

  getPrice(symbol: string, exchange: string) {
    return this.prices.get(`${exchange}_${symbol}`);
  }
}
