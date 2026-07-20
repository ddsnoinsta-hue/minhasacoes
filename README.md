# Painel de Ações B3 — Graham & Barsi

Painel web simples e rápido, inspirado no Status Invest / TradingView, que consulta o
[Fundamentus](https://www.fundamentus.com.br/) e exibe 5 ações da B3:

**PETR4 · VALE3 · BBAS3 · TAEE11 · ITUB4**

Cada card mostra: preço atual, Preço Justo de Graham, Preço Teto (Barsi), Dividend Yield, P/L, P/VP,
setor e data da última atualização, com um selo verde/vermelho indicando se o preço atual está
abaixo ou acima do preço teto.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Clique em **Atualizar dados** para buscar os dados mais recentes.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Fórmulas utilizadas

- **Preço Justo de Graham** = √(22,5 × LPA × VPA) — só é calculado quando LPA e VPA são positivos.
- **Preço Teto (Barsi)** = Dividendo Anual ÷ 0,06 — o Dividendo Anual é estimado como
  `Cotação × Dividend Yield (%) / 100`, já que o Fundamentus não expõe o valor do dividendo em R$
  diretamente na página de detalhes.
- **Boa oportunidade 🟢**: preço atual < preço teto. **Acima do preço teto 🔴**: caso contrário.

## Importante: sobre o acesso ao Fundamentus a partir do navegador

O Fundamentus não expõe uma API pública nem envia cabeçalhos CORS, então o navegador bloqueia
requisições diretas a partir de outro domínio. Para contornar isso sem precisar de um servidor
próprio, o app usa proxies públicos de CORS (`allorigins.win`, `corsproxy.io`, `codetabs.com`) e
tenta cada um em sequência até um responder.

Isso é ótimo para rodar localmente sem complicação, mas tem duas limitações a saber:

1. **Disponibilidade**: proxies públicos podem ficar fora do ar ou aplicar limites de uso. Se todas
   as tentativas falharem, o card daquela ação mostra uma mensagem de erro e sugestão de tentar
   novamente.
2. **Produção real**: se for publicar isso para uso contínuo/compartilhado, o ideal é trocar os
   proxies por um pequeno backend próprio (ex.: uma function serverless) que busca o HTML do
   Fundamentus e repassa para o front-end — assim você tem controle total sobre confiabilidade e
   limites de requisição. A camada que precisaria mudar é só `src/services/fundamentusService.ts`.

## Estrutura do projeto

```
src/
 ├── components/    # Header, StockCard, OpportunityBadge, ErrorBanner, Skeleton
 ├── services/      # fundamentusService.ts — busca e parsing do HTML do Fundamentus
 ├── hooks/         # useStocks.ts — estado, carregamento e refresh
 ├── utils/         # calculations.ts (Graham/Barsi) e formatters.ts (moeda, %, data)
 ├── pages/         # Dashboard.tsx — página única
 ├── types/         # stock.ts
 └── App.tsx
```

## Stack

React 18 · Vite 6 · TypeScript · Tailwind CSS · Axios · Lucide React — sem login, sem banco de
dados, apenas consulta.
