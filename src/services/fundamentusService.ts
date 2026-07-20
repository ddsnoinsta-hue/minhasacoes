import axios from 'axios';
import type { StockData, StockDefinition } from '../types/stock';
import { grahamFairPrice, barsiCeilingPrice, estimateAnnualDividend } from '../utils/calculations';

/**
 * As 5 ações acompanhadas pelo painel.
 */
export const TRACKED_STOCKS: StockDefinition[] = [
  { ticker: 'PETR4', companyName: 'Petrobras', sector: 'Petróleo e Gás' },
  { ticker: 'VALE3', companyName: 'Vale', sector: 'Mineração' },
  { ticker: 'BBAS3', companyName: 'Banco do Brasil', sector: 'Bancos' },
  { ticker: 'TAEE11', companyName: 'Taesa', sector: 'Energia Elétrica' },
  { ticker: 'ITUB4', companyName: 'Itaú Unibanco', sector: 'Bancos' },
];

const FUNDAMENTUS_URL = (ticker: string) => `https://www.fundamentus.com.br/detalhes.php?papel=${ticker}`;

// Proxies públicos usados apenas para contornar CORS no navegador.
// Caso um proxy fique indisponível, o próximo da lista é tentado automaticamente.
const CORS_PROXIES: Array<(url: string) => string> = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

async function fetchRawHtml(ticker: string): Promise<string> {
  const targetUrl = FUNDAMENTUS_URL(ticker);
  let lastError: unknown = null;

  for (const buildProxyUrl of CORS_PROXIES) {
    try {
      const response = await axios.get<string>(buildProxyUrl(targetUrl), {
        timeout: 15000,
        responseType: 'text',
        transformResponse: (data) => data,
      });
      if (typeof response.data === 'string' && response.data.length > 500) {
        return response.data;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    lastError instanceof Error
      ? `Falha ao consultar o Fundamentus (${ticker}): ${lastError.message}`
      : `Falha ao consultar o Fundamentus (${ticker}).`,
  );
}

/**
 * Converte números no formato brasileiro ("12.345,67" ou "8,42%") para float.
 */
function parseBrNumber(raw: string | undefined): number {
  if (!raw) return NaN;
  const cleaned = raw
    .replace(/\s/g, '')
    .replace(/%/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : NaN;
}

/**
 * Extrai os pares label -> valor das tabelas de indicadores do Fundamentus.
 * A página organiza os dados em <td class="label">...<span class="txt">Rótulo</span></td>
 * seguido por <td class="data">...<span class="txt">Valor</span></td>.
 */
function extractLabelValueMap(html: string): Record<string, string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const map: Record<string, string> = {};

  const labelCells = doc.querySelectorAll('td.label');
  labelCells.forEach((labelCell) => {
    const label = labelCell.querySelector('span.txt')?.textContent?.trim() ?? labelCell.textContent?.trim();
    const dataCell = labelCell.nextElementSibling;
    if (!label || !dataCell) return;

    const value = dataCell.querySelector('span.txt')?.textContent?.trim() ?? dataCell.textContent?.trim();
    if (value) map[label] = value;
  });

  return map;
}

function findByLabel(map: Record<string, string>, ...candidates: string[]): string | undefined {
  const keys = Object.keys(map);
  for (const candidate of candidates) {
    const target = candidate.toLowerCase();
    const exact = keys.find((k) => k.toLowerCase() === target);
    if (exact) return map[exact];
  }
  for (const candidate of candidates) {
    const target = candidate.toLowerCase();
    const partial = keys.find((k) => k.toLowerCase().includes(target));
    if (partial) return map[partial];
  }
  return undefined;
}

export async function fetchStockData(definition: StockDefinition): Promise<StockData> {
  const { ticker, companyName, sector } = definition;

  try {
    const html = await fetchRawHtml(ticker);
    const map = extractLabelValueMap(html);

    const currentPrice = parseBrNumber(findByLabel(map, 'Cotação'));
    const pl = parseBrNumber(findByLabel(map, 'P/L'));
    const pvp = parseBrNumber(findByLabel(map, 'P/VP'));
    const lpa = parseBrNumber(findByLabel(map, 'LPA'));
    const vpa = parseBrNumber(findByLabel(map, 'VPA'));
    const dividendYield = parseBrNumber(findByLabel(map, 'Div. Yield', 'Div.Yield', 'Dividend Yield'));

    if (!Number.isFinite(currentPrice)) {
      throw new Error('Não foi possível localizar a cotação na página retornada.');
    }

    const annualDividend = estimateAnnualDividend(currentPrice, dividendYield);
    const grahamPrice = grahamFairPrice(lpa, vpa);
    const barsiCeiling = barsiCeilingPrice(annualDividend);

    return {
      ticker,
      companyName,
      sector,
      currentPrice,
      lpa,
      vpa,
      dividendYield,
      annualDividend,
      pl,
      pvp,
      grahamPrice,
      barsiCeiling,
      lastUpdate: new Date().toISOString(),
    };
  } catch (err) {
    return {
      ticker,
      companyName,
      sector,
      currentPrice: NaN,
      lpa: NaN,
      vpa: NaN,
      dividendYield: NaN,
      annualDividend: NaN,
      pl: NaN,
      pvp: NaN,
      grahamPrice: null,
      barsiCeiling: null,
      lastUpdate: new Date().toISOString(),
      error: err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados.',
    };
  }
}

export async function fetchAllStocks(): Promise<StockData[]> {
  const results = await Promise.all(TRACKED_STOCKS.map((def) => fetchStockData(def)));
  return results;
}
