import { useMemo } from 'react'

// Token types and their colors

interface Token { text: string; color?: string }

function tokenizeCSharp(code: string): Token[] {
  const keywords = /\b(var|await|async|public|private|protected|internal|sealed|static|readonly|new|return|using|namespace|class|interface|record|struct|enum|void|string|bool|int|long|double|decimal|float|object|null|true|false|this|base|if|else|foreach|for|while|switch|case|break|continue|throw|try|catch|finally|is|as|in|out|ref|params|get|set|init|required|abstract|virtual|override)\b/g
  const types    = /\b([A-Z][A-Za-z0-9]*(?:Service|Repository|Handler|Command|Query|Event|Result|Config|Context|Hub|Controller|Factory|Builder|Options|Request|Response|Dto|Model|Entity|Aggregate|Exception|Behavior|Consumer|Producer)?)\b/g
  const methods  = /\b([a-z][A-Za-z0-9]*)\s*(?=\()/g
  const strings  = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g
  const comments = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g
  const numbers  = /\b(\d+(?:\.\d+)?[fFdDmMlLuU]?)\b/g
  const attrs    = /(\[(?:Required|HttpGet|HttpPost|ApiController|Route|FromBody|FromQuery|Range|MaxLength|EnumeratorCancellation|Function|ServiceBusTrigger|BlobTrigger|TimerTrigger|HttpTrigger)[^\]]*\])/g

  return tokenizeGeneric(code, [
    { pattern: comments, color: '#4a5580' },
    { pattern: strings,  color: '#a5d6a7' },
    { pattern: attrs,    color: '#ffb74d' },
    { pattern: keywords, color: '#ce93d8' },
    { pattern: types,    color: '#f48fb1' },
    { pattern: methods,  color: '#4fc3f7' },
    { pattern: numbers,  color: '#ffd54f' },
  ])
}

function tokenizeYaml(code: string): Token[] {
  const comments  = /(#[^\n]*)/g
  const strings   = /(["'])(?:(?!\1)[^\\]|\\.)*\1/g
  const numbers   = /\b(\d+(?:\.\d+)?)\b/g
  const booleans  = /\b(true|false|yes|no|null)\b/g

  return tokenizeGeneric(code, [
    { pattern: comments, color: '#4a5580' },
    { pattern: strings,  color: '#a5d6a7' },
    { pattern: booleans, color: '#ce93d8' },
    { pattern: numbers,  color: '#ffd54f' },
  ])
}

function tokenizeBash(code: string): Token[] {
  const comments = /(#[^\n]*)/g
  const strings  = /(["'])(?:(?!\1)[^\\]|\\.)*\1/g
  const keywords = /\b(cd|npm|npx|dotnet|mkdir|cp|cat|echo|ls|zip|node|git)\b/g
  const flags    = /(\s--?[\w-]+)/g
  const numbers  = /\b(\d+)\b/g

  return tokenizeGeneric(code, [
    { pattern: comments, color: '#4a5580' },
    { pattern: strings,  color: '#a5d6a7' },
    { pattern: keywords, color: '#ce93d8' },
    { pattern: flags,    color: '#ffb74d' },
    { pattern: numbers,  color: '#ffd54f' },
  ])
}

function tokenizeTypeScript(code: string): Token[] {
  const comments = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g
  const keywords = /\b(import|export|from|const|let|var|function|async|await|return|if|else|new|class|interface|type|extends|implements|typeof|instanceof|null|undefined|true|false|void|this|super|for|of|in|while|switch|case|break|default|throw|try|catch|finally)\b/g
  const types    = /\b([A-Z][A-Za-z0-9]*)\b/g
  const strings  = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g
  const methods  = /\b([a-z][A-Za-z0-9]*)\s*(?=\()/g
  const numbers  = /\b(\d+(?:\.\d+)?)\b/g

  return tokenizeGeneric(code, [
    { pattern: comments, color: '#4a5580' },
    { pattern: strings,  color: '#a5d6a7' },
    { pattern: keywords, color: '#ce93d8' },
    { pattern: types,    color: '#f48fb1' },
    { pattern: methods,  color: '#4fc3f7' },
    { pattern: numbers,  color: '#ffd54f' },
  ])
}

interface Rule { pattern: RegExp; color: string }

function tokenizeGeneric(code: string, rules: Rule[]): Token[] {
  // Mark regions with their color using index map
  const marks = new Array<string | undefined>(code.length).fill(undefined)

  rules.forEach(rule => {
    const rx = new RegExp(rule.pattern.source, rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g')
    let m: RegExpExecArray | null
    while ((m = rx.exec(code)) !== null) {
      const start = m.index, end = start + m[0].length
      // Only mark if not already colored (first rule wins)
      let canMark = true
      for (let i = start; i < end; i++) {
        if (marks[i] !== undefined) { canMark = false; break }
      }
      if (canMark) {
        for (let i = start; i < end; i++) marks[i] = rule.color
      }
    }
  })

  // Build token list
  const tokens: Token[] = []
  let i = 0
  while (i < code.length) {
    const color = marks[i]
    let j = i + 1
    while (j < code.length && marks[j] === color) j++
    tokens.push({ text: code.slice(i, j), color })
    i = j
  }
  return tokens
}

function highlight(code: string, lang: string): Token[] {
  switch (lang) {
    case 'csharp': return tokenizeCSharp(code)
    case 'yaml':   return tokenizeYaml(code)
    case 'bash':   return tokenizeBash(code)
    case 'typescript': return tokenizeTypeScript(code)
    default: return [{ text: code }]
  }
}

interface Props {
  code: string
  language: string
  className?: string
}

export function SyntaxHighlighter({ code, language, className }: Props) {
  const tokens = useMemo(() => highlight(code, language), [code, language])

  return (
    <pre
      className={className}
      style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--color-dim2)' }}
    >
      {tokens.map((tok, i) =>
        tok.color
          ? <span key={i} style={{ color: tok.color }}>{tok.text}</span>
          : <span key={i}>{tok.text}</span>
      )}
    </pre>
  )
}

