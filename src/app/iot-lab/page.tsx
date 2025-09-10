"use client";

import * as React from "react";
import Tilt from "react-parallax-tilt";
import mqtt, { MqttClient } from "mqtt";
import { Wifi, WifiOff, Send, Activity, Info, Copy, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Msg = {
  ts: number;
  topic: string;
  payload: string;
  parsed?: unknown;
};

export default function IoTLabPage() {
  // ======= CONFIG BÁSICA =======
  const [brokerUrl, setBrokerUrl] = React.useState<string>("wss://broker.hivemq.com:8884/mqtt");
  const [subTopic, setSubTopic] = React.useState<string>("btricode/iot/teste/#");
  const [pubTopic, setPubTopic] = React.useState<string>("btricode/iot/teste/command");
  const [pubPayload, setPubPayload] = React.useState<string>(
    JSON.stringify({ device: "sensor01", action: "toggle", value: 1 }, null, 2)
  );

  // ======= ESTADOS DE CONEXÃO/MENSAGENS =======
  const clientRef = React.useRef<MqttClient | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [copied, setCopied] = React.useState<string | null>(null);

  // ======= MODAL DE INSTRUÇÕES =======
  const [openGuide, setOpenGuide] = React.useState<boolean>(false);

  // ======= CONECTA AO BROKER =======
  React.useEffect(() => {
    // encerra anterior
    clientRef.current?.end(true);

    const clientId = `btricode-iotlab-${Math.random().toString(16).slice(2)}`;
    const client = mqtt.connect(brokerUrl, {
      clientId,
      // mantém leve e compatível com públicos
      clean: true,
      reconnectPeriod: 3000,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setConnected(true);
      // (re)assina o tópico configurado
      if (subTopic?.trim()) {
        client.subscribe(subTopic, (err) => {
          if (err) {
            console.error("Erro ao assinar:", err);
          }
        });
      }
    });

    client.on("reconnect", () => setConnected(false));
    client.on("close", () => setConnected(false));
    client.on("error", (err) => console.error("MQTT error:", err?.message || err));

    client.on("message", (topic, payloadBuf) => {
      const payload = payloadBuf.toString();
      let parsed: unknown | undefined;
      try {
        parsed = JSON.parse(payload);
      } catch {
        parsed = undefined;
      }
      setMessages((prev) => [
        { ts: Date.now(), topic, payload, parsed },
        ...prev.slice(0, 199), // mantém no máx 200 msgs
      ]);
    });

    return () => {
      client.end(true);
      clientRef.current = null;
    };
    // reconecta quando brokerUrl mudar
  }, [brokerUrl]);

  // ======= REASSINAR QUANDO subTopic MUDAR =======
  React.useEffect(() => {
    const client = clientRef.current;
    if (!client || !connected) return;
    // unsubscribe do antigo e subscribe no novo
    // (para simplificar, apenas assinamos novamente)
    if (subTopic?.trim()) {
      client.subscribe(subTopic, (err) => {
        if (err) console.error("Erro ao assinar novo tópico:", err);
      });
    }
  }, [subTopic, connected]);

  // ======= PUBLICAR =======
  function publish() {
    const client = clientRef.current;
    if (!client || !connected) return;
    const payload = pubPayload || "";
    client.publish(pubTopic, payload, { qos: 0, retain: false }, (err) => {
      if (err) console.error("Erro ao publicar:", err);
    });
  }

  // ======= HELPERS =======
  function fmtTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleTimeString();
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // fallback
      // eslint-disable-next-line no-alert
      alert("Copie manualmente:\n" + text);
    }
  }

  const statusColor = connected ? "bg-emerald-500" : "bg-red-500";

  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">IoT Lab</h1>
            <p className="text-slate-400 mt-1">
              Conecte, publique e visualize telemetria em tempo real via MQTT.
            </p>
          </div>
          <div className="inline-flex items-center gap-3">
            <span className={`inline-block w-3 h-3 rounded-full ${statusColor}`} />
            <span className="text-sm opacity-90">
              {connected ? "Conectado" : "Desconectado"}
            </span>
            {connected ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
          </div>
        </header>

        {/* Grid principal */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-8">
          {/* Coluna esquerda: Controles + Mensagens */}
          <div className="space-y-8">
            {/* CONTROLES */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Conexão & Tópicos
              </h2>

              {/* Broker */}
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Broker (WebSocket)</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                      value={brokerUrl}
                      onChange={(e) => setBrokerUrl(e.target.value)}
                      placeholder="wss://broker.hivemq.com:8000/mqtt"
                      spellCheck={false}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => copyToClipboard(brokerUrl)}
                    >
                      {copied === brokerUrl ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Tópico de assinatura */}
                <div>
                  <label className="text-sm text-slate-300">Assinar tópico</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
                      value={subTopic}
                      onChange={(e) => setSubTopic(e.target.value)}
                      placeholder="btricode/iot/teste/#"
                      spellCheck={false}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => copyToClipboard(subTopic)}
                    >
                      {copied === subTopic ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Publicar */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Publicar em</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={pubTopic}
                      onChange={(e) => setPubTopic(e.target.value)}
                      placeholder="btricode/iot/teste/command"
                      spellCheck={false}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => copyToClipboard(pubTopic)}
                    >
                      {copied === pubTopic ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Payload (JSON)</label>
                  <textarea
                    className="mt-1 min-h-[100px] w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                    value={pubPayload}
                    onChange={(e) => setPubPayload(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="mt-3 flex gap-3">
                <Button type="button" onClick={publish} disabled={!connected}>
                  <Send className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMessages([])}
                >
                  Limpar mensagens
                </Button>
              </div>
            </div>

            {/* MENSAGENS AO VIVO */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Mensagens (tempo real)</h2>
              <div className="mt-4 max-h-[420px] overflow-auto space-y-3 pr-1">
                {messages.length === 0 && (
                  <p className="text-slate-400 text-sm">
                    Nenhuma mensagem ainda. Publique no tópico{" "}
                    <span className="text-cyan-400 font-mono">{subTopic}</span>{" "}
                    usando o cliente HiveMQ para ver aqui em tempo real.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.ts + m.topic + m.payload}
                    className="rounded-lg border border-white/10 bg-slate-900/70 p-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">{m.topic}</span>
                      <span>{fmtTime(m.ts)}</span>
                    </div>
                    {m.parsed ? (
                      <pre className="mt-2 text-sm overflow-x-auto">
                        {JSON.stringify(m.parsed, null, 2)}
                      </pre>
                    ) : (
                      <p className="mt-2 text-sm break-words">{m.payload}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita: Card 3D com instruções rápidas */}
          <div className="space-y-8">
            <Tilt
              glareEnable
              glareMaxOpacity={0.18}
              scale={1.02}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-[0_0_60px_-15px_rgba(56,189,248,0.3)]"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-xl bg-cyan-500/20 blur-xl" />
                  <div className="relative rounded-xl bg-slate-950/60 border border-white/10 p-3">
                    <Info className="w-6 h-6 text-cyan-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">Como testar o IoT Lab</h3>
                  <p className="text-slate-300 mt-1">
                    Passo a passo rápido usando o cliente WebSocket da HiveMQ.
                  </p>
                </div>
              </div>

              <ol className="mt-5 space-y-3 text-slate-200">
                <li>
                  1. Abra o{" "}
                  <a
                    href="https://www.hivemq.com/demos/websocket-client/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 underline"
                  >
                    HiveMQ WebSocket Client
                  </a>
                  .
                </li>
                <li>2. Conecte em <span className="font-mono">broker.hivemq.com</span> porta <span className="font-mono">8000</span>.</li>
                <li>
                  3. Em <strong>Subscribe</strong>, use o tópico{" "}
                  <code className="px-2 py-0.5 rounded bg-slate-900 border border-white/10">btricode/iot/teste/#</code>.
                </li>
                <li>
                  4. Em <strong>Publish</strong>, tópico{" "}
                  <code className="px-2 py-0.5 rounded bg-slate-900 border border-white/10">btricode/iot/teste/command</code>{" "}
                  e payload JSON:
                  <pre className="mt-2 p-3 rounded-lg bg-slate-950 border border-white/10 text-sm overflow-x-auto">
{`{ "device": "sensor01", "action": "toggle", "value": 1 }`}
                  </pre>
                </li>
              </ol>

              <div className="mt-5 flex gap-3">
                <Button asChild>
                  <a
                    href="https://www.hivemq.com/demos/websocket-client/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir HiveMQ
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpenGuide(true)}
                >
                  Saiba mais
                </Button>
              </div>
            </Tilt>

            {/* Pequenos atalhos de cópia */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h4 className="font-semibold mb-3">Atalhos</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => copyToClipboard("btricode/iot/teste/#")}
                  className="group inline-flex items-center justify-between rounded-lg bg-slate-900 border border-white/10 px-3 py-2 hover:bg-slate-800"
                >
                  <span className="font-mono">btricode/iot/teste/#</span>
                  {copied === "btricode/iot/teste/#" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  )}
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(
                        { device: "sensor01", action: "toggle", value: 1 },
                        null,
                        2
                      )
                    )
                  }
                  className="group inline-flex items-center justify-between rounded-lg bg-slate-900 border border-white/10 px-3 py-2 hover:bg-slate-800"
                >
                  <span className="truncate">Payload JSON de exemplo</span>
                  {copied?.startsWith("{ \"device\"") ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SAIBA MAIS */}
      <Dialog open={openGuide} onOpenChange={setOpenGuide}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-950 text-slate-100 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 text-2xl">Guia completo do experimento IoT Lab</DialogTitle>
            <DialogDescription className="text-slate-400">
              Aprenda a usar o broker, assinar tópicos e publicar comandos com segurança.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-2">
            <section>
              <h5 className="font-semibold text-emerald-400 mb-1">1) Conexão</h5>
              <p className="text-slate-300">
                Use um broker público (ex.: HiveMQ). Em <strong>Host</strong> informe{" "}
                <code className="px-2 py-0.5 rounded bg-slate-900 border border-white/10">broker.hivemq.com</code> e{" "}
                <strong>Port</strong>{" "}
                <code className="px-2 py-0.5 rounded bg-slate-900 border border-white/10">8000</code> (WebSocket).
              </p>
            </section>

            <section>
              <h5 className="font-semibold text-emerald-400 mb-1">2) Assinatura</h5>
              <p className="text-slate-300">
                Assine o tópico{" "}
                <code className="px-2 py-0.5 rounded bg-slate-900 border border-white/10">btricode/iot/teste/#</code>{" "}
                para receber telemetria. O <code>#</code> permite ouvir todos os subcaminhos.
              </p>
            </section>

            <section>
              <h5 className="font-semibold text-emerald-400 mb-1">3) Publicação</h5>
              <p className="text-slate-300">
                Publique em{" "}
                <code className="px-2 py-0.5 rounded bg-slate-900 border border-white/10">
                  btricode/iot/teste/command
                </code>{" "}
                com payload JSON, por exemplo:
              </p>
              <pre className="mt-2 p-3 rounded-lg bg-slate-950 border border-white/10 text-sm overflow-x-auto">
{`{
  "device": "sensor01",
  "action": "toggle",
  "value": 1
}`}
              </pre>
              <p className="text-slate-400 mt-2 text-sm">
                Dica: dispare um comando e veja-o chegando no painel de mensagens (lado esquerdo).
              </p>
            </section>

            <section>
              <h5 className="font-semibold text-emerald-400 mb-1">4) Boas práticas & segurança</h5>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Evite enviar dados sensíveis em brokers públicos.</li>
                <li>Em produção, use broker próprio com TLS e autenticação.</li>
                <li>Padronize tópicos: <code>empresa/produto/dispositivo/...</code></li>
                <li>Prefira JSON válido; fica fácil depurar e integrar.</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
