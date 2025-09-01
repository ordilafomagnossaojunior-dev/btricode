"use client";

import { useEffect, useMemo, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

type Msg = { topic: string; payload: string; ts: number };

const MQTT_URL = process.env.NEXT_PUBLIC_MQTT_URL!;
const TOPIC_SUB = process.env.NEXT_PUBLIC_MQTT_TOPIC_TELEMETRY || "btricode/telemetry/#";
const TOPIC_PUB = process.env.NEXT_PUBLIC_MQTT_TOPIC_COMMAND || "btricode/command";

export default function IoTLabPage() {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState<string>("");

  const opts = useMemo(
    () => ({
      clean: true,
      connectTimeout: 4000,
      // username/password se seu broker exigir
    }),
    []
  );

  useEffect(() => {
    // conecta ao entrar na página
    const c = mqtt.connect(MQTT_URL, opts);
    setStatus("Conectando…");

    c.on("connect", () => {
      setConnected(true);
      setStatus(`Conectado: ${MQTT_URL}`);
      c.subscribe(TOPIC_SUB, (err) => {
        if (err) setStatus(`Falha ao inscrever em ${TOPIC_SUB}`);
        else setStatus((s) => s + ` | Sub: ${TOPIC_SUB}`);
      });
    });

    c.on("reconnect", () => setStatus("Reconectando…"));
    c.on("error", (err) => setStatus(`Erro: ${err?.message || err}`));

    c.on("message", (topic, payload) => {
      const text = payload.toString();
      setMessages((prev) => [{ topic, payload: text, ts: Date.now() }, ...prev].slice(0, 200));
    });

    setClient(c);
    return () => {
      c.end(true);
      setConnected(false);
    };
  }, [opts]);

  function publish() {
    if (!client || !connected || !command.trim()) return;
    client.publish(TOPIC_PUB, command, { qos: 0, retain: false });
    setCommand("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-bold mb-2">IoT Lab</h1>
        <p className="text-sm text-slate-300 mb-4">
          Broker: <span className="text-sky-300">{MQTT_URL}</span><br />
          Status: <span className="text-emerald-300">{status}</span>
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm">Publicar comando</label>
            <div className="mt-1 flex gap-2">
              <input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder='Ex.: {"led": "on"}'
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10"
              />
              <button
                onClick={publish}
                disabled={!connected}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tópico de publicação: <span className="text-sky-300">{TOPIC_PUB}</span>
            </p>
          </div>

          <div className="rounded-xl border border-white/10 p-3">
            <div className="text-sm font-semibold mb-2">
              Telemetria (sub: <span className="text-sky-300">{TOPIC_SUB}</span>)
            </div>
            <div className="max-h-[420px] overflow-auto space-y-2 text-sm">
              {messages.length === 0 && <div className="text-slate-400">Aguardando mensagens…</div>}
              {messages.map((m, i) => {
                let pretty = m.payload;
                try {
                  const obj = JSON.parse(m.payload);
                  pretty = JSON.stringify(obj, null, 2);
                } catch {}
                const time = new Date(m.ts).toLocaleTimeString();
                return (
                  <div key={i} className="rounded-lg bg-slate-950/60 border border-white/5 p-2">
                    <div className="text-xs text-slate-400 mb-1">{time} • {m.topic}</div>
                    <pre className="whitespace-pre-wrap break-words text-slate-100 text-xs">{pretty}</pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1600&auto=format&fit=crop"
          alt="Laboratório IoT"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
