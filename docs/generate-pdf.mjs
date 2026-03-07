import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
import { readFileSync } from 'fs';

const markdown = readFileSync('/home/user/commons/docs/cs-manager-comp-plan.md', 'utf-8');

// Simple markdown to HTML conversion for tables, headers, bold, lists, hrs
function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let inList = false;
  let headerRow = true;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Horizontal rule
    if (line.trim() === '---') {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
      if (inList) { html += '</ul>'; inList = false; }
      html += '<hr>';
      continue;
    }

    // Table row
    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());

      // Skip separator rows
      if (cells.every(c => /^[-:]+$/.test(c))) continue;

      if (!inTable) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<table>';
        headerRow = true;
        inTable = true;
      }

      if (headerRow) {
        html += '<thead><tr>' + cells.map(c => `<th>${applyInline(c)}</th>`).join('') + '</tr></thead><tbody>';
        headerRow = false;
      } else {
        html += '<tr>' + cells.map(c => `<td>${applyInline(c)}</td>`).join('') + '</tr>';
      }
      continue;
    }

    if (inTable && !line.includes('|')) {
      html += '</tbody></table>';
      inTable = false;
    }

    // Headers
    if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h1>${line.slice(2)}</h1>`;
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${line.slice(3)}</h2>`;
      continue;
    }
    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${line.slice(4)}</h3>`;
      continue;
    }

    // List items
    if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${applyInline(line.slice(2))}</li>`;
      continue;
    }

    if (inList && line.trim() === '') {
      html += '</ul>';
      inList = false;
    }

    // Empty line
    if (line.trim() === '') {
      continue;
    }

    // Paragraph
    if (inList) { html += '</ul>'; inList = false; }
    html += `<p>${applyInline(line)}</p>`;
  }

  if (inTable) html += '</tbody></table>';
  if (inList) html += '</ul>';

  return html;
}

function applyInline(text) {
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return text;
}

const htmlContent = `<!DOCTYPE html>
<html>
<head>
<style>
  @page { margin: 0.75in; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    color: #1a1a1a;
    line-height: 1.6;
    font-size: 11pt;
    max-width: 100%;
  }
  h1 {
    font-size: 22pt;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 8px;
    margin-top: 0;
    color: #111;
  }
  h2 {
    font-size: 14pt;
    color: #2563eb;
    margin-top: 28px;
    margin-bottom: 12px;
  }
  h3 {
    font-size: 12pt;
    color: #333;
    margin-top: 24px;
    margin-bottom: 8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
  }
  th {
    background-color: #f0f4ff;
    color: #1e40af;
    text-align: left;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    font-weight: 600;
  }
  td {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
  }
  tr:nth-child(even) {
    background-color: #f9fafb;
  }
  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 24px 0;
  }
  p { margin: 6px 0; }
  ul { margin: 8px 0; padding-left: 24px; }
  li { margin: 4px 0; }
  strong { color: #111; }
</style>
</head>
<body>
${mdToHtml(markdown)}
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(htmlContent, { waitUntil: 'networkidle' });
await page.pdf({
  path: '/home/user/commons/docs/cs-manager-comp-plan.pdf',
  format: 'Letter',
  printBackground: true,
});
await browser.close();
console.log('PDF generated: docs/cs-manager-comp-plan.pdf');
