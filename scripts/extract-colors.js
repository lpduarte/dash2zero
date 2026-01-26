#!/usr/bin/env node

/**
 * Script para extrair cores CSS e gerar constantes TypeScript
 *
 * Lê as variáveis CSS de src/index.css e gera src/lib/colors.ts
 * com as cores em formato HEX e HSL string.
 *
 * Uso:
 *   node scripts/extract-colors.js
 *   npm run generate:colors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_PATH = path.join(__dirname, '../src/index.css');
const OUTPUT_PATH = path.join(__dirname, '../src/lib/colors.ts');

/**
 * Converts HSL values to HEX color
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} HEX color string
 */
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Converts CSS variable name to camelCase
 * @param {string} name - CSS variable name (e.g., "primary-light", "scope-1")
 * @returns {string} camelCase name (e.g., "primaryLight", "scope1")
 */
function toCamelCase(name) {
  return name.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

/**
 * Parses HSL values from CSS variable value
 * @param {string} value - CSS value (e.g., "175 66% 38%")
 * @returns {{h: number, s: number, l: number} | null}
 */
function parseHslValue(value) {
  // Match patterns like "175 66% 38%" or "175 66 38"
  const match = value.match(/(\d+)\s+(\d+)%?\s+(\d+)%?/);
  if (!match) return null;

  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3])
  };
}

/**
 * Extracts CSS variables from a CSS block
 * @param {string} css - CSS content
 * @param {string} selector - CSS selector to extract from (":root" or ".dark")
 * @returns {Map<string, {h: number, s: number, l: number}>}
 */
function extractVariables(css, selector) {
  const variables = new Map();

  // Find the block for the selector
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockRegex = new RegExp(`${escapedSelector}\\s*\\{([^}]+)\\}`, 's');
  const blockMatch = css.match(blockRegex);

  if (!blockMatch) return variables;

  const block = blockMatch[1];

  // Extract variables - only color variables (not radius, shadows, etc.)
  const varRegex = /--([\w-]+):\s*(\d+\s+\d+%?\s+\d+%?)\s*;/g;
  let match;

  while ((match = varRegex.exec(block)) !== null) {
    const [, name, value] = match;
    const hsl = parseHslValue(value);
    if (hsl) {
      variables.set(name, hsl);
    }
  }

  return variables;
}

/**
 * Generates the TypeScript file content
 * @param {Map<string, {h: number, s: number, l: number}>} lightVars
 * @param {Map<string, {h: number, s: number, l: number}>} darkVars
 * @returns {string}
 */
function generateTypeScript(lightVars, darkVars) {
  const lightColors = {};
  const darkColors = {};
  const hslStrings = {};

  // Process light mode variables
  for (const [name, hsl] of lightVars) {
    const camelName = toCamelCase(name);
    lightColors[camelName] = hslToHex(hsl.h, hsl.s, hsl.l);
    hslStrings[camelName] = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  // Process dark mode variables
  for (const [name, hsl] of darkVars) {
    const camelName = toCamelCase(name);
    darkColors[camelName] = hslToHex(hsl.h, hsl.s, hsl.l);
  }

  const timestamp = new Date().toISOString();

  // Email-specific colors: mapping CSS vars to semantic email colors
  // These are manually mapped for better email template usage
  const emailColorsObj = {
    // Text colors
    text: lightColors.foreground || '#172625',
    textSecondary: '#4a4a4a',  // Darker than muted, lighter than foreground
    textMuted: lightColors.mutedForeground || '#577573',
    textLight: '#6a6a6a',  // For captions and small text
    textLighter: '#8a8a8a',  // For footer and legal text

    // Background colors
    background: lightColors.card || '#FFFFFF',
    backgroundMuted: lightColors.muted || '#EDF2F1',
    backgroundSubtle: '#f5f5f5',  // Slightly off-white for sections
    backgroundAlt: '#f8f9fa',  // Alternative subtle background

    // Brand colors
    primary: lightColors.primary || '#21A196',
    primaryDark: lightColors.primaryDark || '#157971',
    primaryLight: lightColors.primaryLight || '#37BEB2',

    // Status colors
    warning: lightColors.warning || '#F2AD0D',
    danger: lightColors.danger || '#DD3C3C',

    // UI colors
    border: lightColors.border || '#DAE7E6',
    borderLight: '#e5e5e5',  // Lighter border for separators
    borderLighter: '#f0f0f0',  // Very light border
  };

  return `// GERADO AUTOMATICAMENTE - NAO EDITAR
// Fonte: src/index.css
// Gerado em: ${timestamp}
// Script: scripts/extract-colors.js

/**
 * Cores do tema extraidas do CSS
 * Para usar em templates de email e outros contextos onde CSS vars nao funcionam
 */
export const colors = {
  /**
   * Cores do tema claro (light mode) em formato HEX
   */
  light: ${JSON.stringify(lightColors, null, 4).replace(/"/g, "'")},

  /**
   * Cores do tema escuro (dark mode) em formato HEX
   */
  dark: ${JSON.stringify(darkColors, null, 4).replace(/"/g, "'")},

  /**
   * Cores em formato HSL string (para CSS inline)
   */
  hsl: ${JSON.stringify(hslStrings, null, 4).replace(/"/g, "'")}
} as const;

/**
 * Cores especificas para templates de email
 * Mapeamento semantico das cores CSS para uso em emails
 */
export const emailColors = ${JSON.stringify(emailColorsObj, null, 2).replace(/"/g, "'")} as const;

/**
 * Helper para criar cor com opacidade (retorna HSL string)
 * Util para backgrounds subtis em emails
 * @param color - Nome da cor em colors.hsl
 * @param opacity - Valor de 0 a 1
 */
export function withOpacity(color: keyof typeof colors.hsl, opacity: number): string {
  const hsl = colors.hsl[color];
  // Converte "hsl(h, s%, l%)" para "hsl(h s% l% / opacity)"
  const match = hsl.match(/hsl\\((\\d+),\\s*(\\d+)%,\\s*(\\d+)%\\)/);
  if (!match) return hsl;
  return \`hsl(\${match[1]} \${match[2]}% \${match[3]}% / \${opacity})\`;
}

/**
 * Tipo das cores disponiveis
 */
export type ColorName = keyof typeof colors.light;
export type EmailColorName = keyof typeof emailColors;
`;
}

// Main execution
try {
  console.log('Extracting colors from CSS...');

  const css = fs.readFileSync(CSS_PATH, 'utf-8');

  const lightVars = extractVariables(css, ':root');
  const darkVars = extractVariables(css, '.dark');

  console.log(`  Found ${lightVars.size} light mode colors`);
  console.log(`  Found ${darkVars.size} dark mode colors`);

  const output = generateTypeScript(lightVars, darkVars);

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');

  console.log(`Generated: ${OUTPUT_PATH}`);
  console.log('');

  // List extracted colors
  console.log('Light mode colors:');
  for (const [name, hsl] of lightVars) {
    const hex = hslToHex(hsl.h, hsl.s, hsl.l);
    console.log(`  --${name}: ${hex}`);
  }

} catch (error) {
  console.error('Error extracting colors:', error.message);
  process.exit(1);
}
