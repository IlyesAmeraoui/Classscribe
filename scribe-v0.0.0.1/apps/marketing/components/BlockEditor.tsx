'use client'

import { useState, useRef, useCallback, useEffect, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  GripVertical,
  MoreHorizontal,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  CheckSquare,
  Quote,
  Code,
  Image as ImageIcon,
  Calculator,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Table,
  ChevronDown,
  Wand2
} from 'lucide-react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// Función para resaltar sintaxis (implementación simple pero efectiva)
const highlightCode = (code: string, language: string): string => {
  if (!code.trim()) return code.replace(/\n/g, '<br>')

  // Patrones de sintaxis para diferentes lenguajes
  const patterns: Record<string, Array<{ pattern: RegExp; className: string; priority: number }>> = {
    javascript: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g, className: 'string', priority: 2 },
      { pattern: /\$\{[^}]*\}/g, className: 'template', priority: 2 },
      { pattern: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|try|catch|finally|throw|new|this|class|extends|import|export|from|default|async|await|of|in|instanceof|typeof|delete|void|super|static|get|set)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(Array|Object|String|Number|Boolean|Date|RegExp|Error|Promise|Map|Set|WeakMap|WeakSet|Symbol|Proxy|Reflect|JSON|Math|console|window|document|global|process)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /\/(?![*/])(?:[^/\\\n\r]|\\.)+\/[gimuy]*/g, className: 'regex', priority: 4 },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'type', priority: 5 },
      { pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    typescript: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g, className: 'string', priority: 2 },
      { pattern: /\$\{[^}]*\}/g, className: 'template', priority: 2 },
      { pattern: /\b(const|let|var|function|return|if|else|for|while|do|break|continue|try|catch|finally|throw|new|this|class|extends|import|export|from|default|async|await|interface|type|enum|namespace|declare|public|private|protected|readonly|static|abstract|implements|keyof|infer|never|unknown|any|void|of|in|instanceof|typeof|delete|super|get|set)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(string|number|boolean|object|any|void|never|unknown|bigint|symbol)\b/g, className: 'type', priority: 3 },
      { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(Array|Object|String|Number|Boolean|Date|RegExp|Error|Promise|Map|Set|WeakMap|WeakSet|Symbol|Proxy|Reflect|JSON|Math|console|window|document|global|process)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /\/(?![*/])(?:[^/\\\n\r]|\\.)+\/[gimuy]*/g, className: 'regex', priority: 4 },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'type', priority: 5 },
      { pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    python: [
      { pattern: /#.*$/gm, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|"""[\s\S]*?"""|'''[\s\S]*?'''/g, className: 'string', priority: 2 },
      { pattern: /f"([^"\\]|\\.)*"|f'([^'\\]|\\.)*'/g, className: 'fstring', priority: 2 },
      { pattern: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|pass|break|continue|global|nonlocal|assert|del|raise|async|await)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(True|False|None)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(int|float|str|bool|list|dict|tuple|set|frozenset|bytes|bytearray|range|enumerate|zip|map|filter|len|print|input|open|type|isinstance|hasattr|getattr|setattr|delattr|super|property|staticmethod|classmethod)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /@\w+/g, className: 'decorator', priority: 4 },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'type', priority: 5 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~]/g, className: 'operator', priority: 8 }
    ],
    java: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"/g, className: 'string', priority: 2 },
      { pattern: /'([^'\\]|\\.)*'/g, className: 'char', priority: 2 },
      { pattern: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|if|else|for|while|do|try|catch|finally|throw|throws|new|this|super|return|void|synchronized|volatile|transient|native|strictfp|enum|assert|switch|case|default|break|continue|instanceof)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(int|long|short|byte|float|double|boolean|char|String|Object|Integer|Long|Short|Byte|Float|Double|Boolean|Character)\b/g, className: 'type', priority: 3 },
      { pattern: /\b(true|false|null)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(System|Math|String|Object|ArrayList|HashMap|HashSet|Scanner|Random|Collections|Arrays)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+[lL]?\b|\b\d+\.?\d*([eE][+-]?\d+)?[fFdDlL]?\b/g, className: 'number', priority: 4 },
      { pattern: /@\w+/g, className: 'annotation', priority: 4 },
      { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, className: 'type', priority: 5 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    cpp: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"/g, className: 'string', priority: 2 },
      { pattern: /'([^'\\]|\\.)*'/g, className: 'char', priority: 2 },
      { pattern: /#\s*(include|define|ifdef|ifndef|endif|if|else|elif|pragma|error|warning|undef|line)\b/g, className: 'preprocessor', priority: 2 },
      { pattern: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|class|private|protected|public|friend|inline|template|virtual|explicit|mutable|namespace|operator|this|try|catch|throw|new|delete|const_cast|dynamic_cast|reinterpret_cast|static_cast|typeid|using|bool|wchar_t|true|false|and|or|not|xor|bitand|bitor|compl|and_eq|or_eq|xor_eq|not_eq)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(std|cout|cin|endl|vector|string|map|set|list|deque|stack|queue|priority_queue|pair|make_pair|sort|find|begin|end|size|empty|push_back|pop_back|insert|erase|clear)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b(true|false|NULL|nullptr)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+[uUlL]*\b|\b\d+\.?\d*([eE][+-]?\d+)?[fFlL]?\b/g, className: 'number', priority: 4 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, className: 'type', priority: 5 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    c: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"/g, className: 'string', priority: 2 },
      { pattern: /'([^'\\]|\\.)*'/g, className: 'char', priority: 2 },
      { pattern: /#\s*(include|define|ifdef|ifndef|endif|if|else|elif|pragma|error|warning|undef|line)\b/g, className: 'preprocessor', priority: 2 },
      { pattern: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(printf|scanf|malloc|free|strlen|strcpy|strcmp|strcat|memcpy|memset|fopen|fclose|fread|fwrite|fprintf|fscanf)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b(NULL|true|false)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+[uUlL]*\b|\b\d+\.?\d*([eE][+-]?\d+)?[fFlL]?\b/g, className: 'number', priority: 4 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, className: 'type', priority: 5 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    php: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /#.*$/gm, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /<<<\w+[\s\S]*?\w+;/g, className: 'heredoc', priority: 2 },
      { pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, className: 'variable', priority: 2 },
      { pattern: /\b(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|yield_from)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(true|false|null|TRUE|FALSE|NULL)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(string|int|float|bool|array|object|resource|mixed|callable|iterable|void|never)\b/g, className: 'type', priority: 3 },
      { pattern: /\b(strlen|substr|str_replace|preg_match|preg_replace|explode|implode|array_merge|array_push|array_pop|count|sizeof|is_array|is_string|is_numeric|isset|empty|unset|var_dump|print_r|die|exit|header|session_start|mysqli_connect|PDO)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:.]/g, className: 'operator', priority: 8 }
    ],
    ruby: [
      { pattern: /#.*$/gm, className: 'comment', priority: 1 },
      { pattern: /=begin[\s\S]*?=end/g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /%[qQwWiIrxs]?[({[<].*?[)}\]>]/g, className: 'string', priority: 2 },
      { pattern: /:[a-zA-Z_][a-zA-Z0-9_]*[?!]?/g, className: 'symbol', priority: 2 },
      { pattern: /@@?[a-zA-Z_][a-zA-Z0-9_]*/g, className: 'variable', priority: 2 },
      { pattern: /\b(alias|and|begin|break|case|class|def|defined|do|else|elsif|end|ensure|false|for|if|in|module|next|nil|not|or|redo|rescue|retry|return|self|super|then|true|undef|unless|until|when|while|yield|__FILE__|__LINE__|attr_reader|attr_writer|attr_accessor|private|protected|public|require|include|extend)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(true|false|nil)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(String|Integer|Float|Array|Hash|Symbol|Regexp|Time|Date|File|IO|Class|Module|Object|Numeric|Fixnum|Bignum|Range|Proc|Method)\b/g, className: 'type', priority: 3 },
      { pattern: /\b(puts|print|p|gets|chomp|length|size|empty|include|join|split|gsub|sub|match|scan|upcase|downcase|capitalize|strip|to_s|to_i|to_f|to_a|to_h|each|map|select|reject|find|sort|reverse|uniq|flatten|compact)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /\/(?![*/])(?:[^/\\\n\r]|\\.)+\/[imxo]*/g, className: 'regex', priority: 4 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*[?!]?(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    go: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|`[^`]*`/g, className: 'string', priority: 2 },
      { pattern: /'([^'\\]|\\.)*'/g, className: 'char', priority: 2 },
      { pattern: /\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr)\b/g, className: 'type', priority: 3 },
      { pattern: /\b(true|false|nil|iota)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(fmt|os|io|net|http|time|strings|strconv|math|sort|sync|json|xml|log|flag|regexp|bufio|bytes|crypto|encoding|errors|hash|image|path|reflect|runtime|testing|unsafe)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    rust: [
      { pattern: /\/\/.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|r#".*?"#/g, className: 'string', priority: 2 },
      { pattern: /'([^'\\]|\\.)*'/g, className: 'char', priority: 2 },
      { pattern: /\b(as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|unsafe|use|where|while|abstract|become|box|do|final|macro|override|priv|typeof|unsized|virtual|yield|try)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b(bool|char|str|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|String|Vec|HashMap|HashSet|Option|Result|Box|Rc|Arc|RefCell|Mutex|RwLock)\b/g, className: 'type', priority: 3 },
      { pattern: /\b(true|false|None|Some|Ok|Err)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b(std|core|alloc|collections|io|fs|net|thread|sync|time|fmt|mem|ptr|slice|vec|str|string|option|result|iter|ops|cmp|convert|default|clone|copy|debug|display|drop|eq|hash|ord|send|sync)\b/g, className: 'builtin', priority: 3 },
      { pattern: /\b0x[0-9a-fA-F]+[iu]?(?:8|16|32|64|128|size)?\b|\b\d+\.?\d*([eE][+-]?\d+)?[f]?(?:32|64)?\b/g, className: 'number', priority: 4 },
      { pattern: /#\[.*?\]/g, className: 'attribute', priority: 4 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*!(?=\s*\()/g, className: 'macro', priority: 5 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function', priority: 6 },
      { pattern: /[{}[\]()]/g, className: 'punctuation', priority: 7 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, className: 'operator', priority: 8 }
    ],
    html: [
      { pattern: /<!--[\s\S]*?-->/g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /&[a-zA-Z0-9#]+;/g, className: 'entity', priority: 2 },
      { pattern: /<\/?[a-zA-Z0-9-]+(?:\s|>|$)/g, className: 'tag', priority: 3 },
      { pattern: /\s[a-zA-Z-]+(?==)/g, className: 'attribute', priority: 4 },
      { pattern: /<!DOCTYPE[^>]*>/gi, className: 'doctype', priority: 3 }
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /@[a-zA-Z-]+/g, className: 'at-rule', priority: 2 },
      { pattern: /[.#]?[a-zA-Z-]+(?=\s*\{)/g, className: 'selector', priority: 3 },
      { pattern: /[a-zA-Z-]+(?=\s*:)/g, className: 'property', priority: 4 },
      { pattern: /#[0-9a-fA-F]{3,6}\b/g, className: 'color', priority: 4 },
      { pattern: /\b\d+\.?\d*(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|deg|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?\b/g, className: 'number', priority: 4 },
      { pattern: /\b(important|inherit|initial|unset|auto|none|normal|bold|italic|underline|solid|dashed|dotted|block|inline|flex|grid|absolute|relative|fixed|static|sticky)\b/g, className: 'value', priority: 5 }
    ],
    sql: [
      { pattern: /--.*$/gm, className: 'comment', priority: 1 },
      { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment', priority: 1 },
      { pattern: /'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|DATABASE|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|AS|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|EXISTS|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|AUTO_INCREMENT|IDENTITY|SEQUENCE)\b/gi, className: 'keyword', priority: 3 },
      { pattern: /\b(INT|INTEGER|VARCHAR|CHAR|TEXT|DATE|DATETIME|TIMESTAMP|TIME|YEAR|BOOLEAN|BOOL|DECIMAL|NUMERIC|FLOAT|DOUBLE|REAL|BIGINT|SMALLINT|TINYINT|MEDIUMINT|BLOB|CLOB|BINARY|VARBINARY|ENUM|SET)\b/gi, className: 'type', priority: 3 },
      { pattern: /\b(COUNT|SUM|AVG|MIN|MAX|CONCAT|SUBSTRING|LENGTH|UPPER|LOWER|TRIM|NOW|CURDATE|CURTIME|DATE_FORMAT|YEAR|MONTH|DAY|HOUR|MINUTE|SECOND)\b/gi, className: 'builtin', priority: 3 },
      { pattern: /\b\d+\.?\d*\b/g, className: 'number', priority: 4 }
    ],
    json: [
      { pattern: /"([^"\\]|\\.)*"/g, className: 'string', priority: 2 },
      { pattern: /\b(true|false|null)\b/g, className: 'boolean', priority: 3 },
      { pattern: /\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /[{}[\],]/g, className: 'punctuation', priority: 5 }
    ],
    yaml: [
      { pattern: /#.*$/gm, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /^\s*[a-zA-Z_][a-zA-Z0-9_-]*\s*:/gm, className: 'key', priority: 3 },
      { pattern: /\b(true|false|null|yes|no|on|off)\b/gi, className: 'boolean', priority: 3 },
      { pattern: /\b-?\d+\.?\d*([eE][+-]?\d+)?\b/g, className: 'number', priority: 4 },
      { pattern: /^\s*-\s/gm, className: 'list-marker', priority: 4 },
      { pattern: /[|>][-+]?/g, className: 'block-scalar', priority: 4 }
    ],
    xml: [
      { pattern: /<!--[\s\S]*?-->/g, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /&[a-zA-Z0-9#]+;/g, className: 'entity', priority: 2 },
      { pattern: /<\?[\s\S]*?\?>/g, className: 'processing-instruction', priority: 2 },
      { pattern: /<\/?[a-zA-Z0-9-:]+(?:\s|>|$)/g, className: 'tag', priority: 3 },
      { pattern: /\s[a-zA-Z-:]+(?==)/g, className: 'attribute', priority: 4 },
      { pattern: /<!DOCTYPE[^>]*>/gi, className: 'doctype', priority: 3 }
    ],
    bash: [
      { pattern: /#.*$/gm, className: 'comment', priority: 1 },
      { pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string', priority: 2 },
      { pattern: /\$\{[^}]*\}|\$[a-zA-Z_][a-zA-Z0-9_]*/g, className: 'variable', priority: 2 },
      { pattern: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|in|select|time|until|break|continue|exit|export|local|readonly|unset|declare|typeset|alias|unalias|set|shift|test|eval|exec|source|cd|pwd|echo|printf|read|getopts|trap|kill|jobs|bg|fg|wait|sleep|find|grep|sed|awk|cut|sort|uniq|head|tail|wc|cat|less|more|ls|cp|mv|rm|mkdir|rmdir|chmod|chown|chgrp|ln|touch|which|whereis|locate|file|stat|du|df|mount|umount|ps|top|htop|netstat|ss|ping|wget|curl|tar|gzip|gunzip|zip|unzip|ssh|scp|rsync|crontab)\b/g, className: 'keyword', priority: 3 },
      { pattern: /\b\d+\b/g, className: 'number', priority: 4 },
      { pattern: /[|&;(){}[\]<>]/g, className: 'punctuation', priority: 5 },
      { pattern: /[!$?*+\-=~]/g, className: 'operator', priority: 6 }
    ],
    markdown: [
      { pattern: /<!--[\s\S]*?-->/g, className: 'comment', priority: 1 },
      { pattern: /```[\s\S]*?```|`[^`]+`/g, className: 'code', priority: 2 },
      { pattern: /!\[([^\]]*)\]\([^)]+\)/g, className: 'image', priority: 2 },
      { pattern: /\[([^\]]+)\]\([^)]+\)/g, className: 'link', priority: 2 },
      { pattern: /^#{1,6}\s+.+$/gm, className: 'heading', priority: 3 },
      { pattern: /^\s*[*+-]\s+/gm, className: 'list-marker', priority: 3 },
      { pattern: /^\s*\d+\.\s+/gm, className: 'list-marker', priority: 3 },
      { pattern: /\*\*([^*]+)\*\*|__([^_]+)__/g, className: 'bold', priority: 4 },
      { pattern: /\*([^*]+)\*|_([^_]+)_/g, className: 'italic', priority: 4 },
      { pattern: /~~([^~]+)~~/g, className: 'strikethrough', priority: 4 },
      { pattern: /^\s*>\s+/gm, className: 'blockquote', priority: 4 }
    ]
  }

  // Aplicar patrones específicos del lenguaje
  const langPatterns = patterns[language] || patterns.javascript
  let highlightedCode = code

  // Escapar HTML primero
  highlightedCode = highlightedCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Aplicar resaltado usando un enfoque más robusto
  if (langPatterns) {
    // Crear un array de tokens con sus posiciones
    interface Token {
      start: number
      end: number
      className: string
      priority: number
      text: string
    }
    
    const tokens: Token[] = []
    
    // Encontrar todos los tokens
    langPatterns.forEach(({ pattern, className, priority }) => {
      let match
      while ((match = pattern.exec(highlightedCode)) !== null) {
        tokens.push({
          start: match.index,
          end: match.index + match[0].length,
          className,
          priority,
          text: match[0]
        })
        
        // Evitar bucle infinito con patrones globales
        if (!pattern.global) break
      }
    })
    
    // Ordenar tokens por posición y prioridad
    tokens.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start
      return a.priority - b.priority
    })
    
    // Eliminar tokens superpuestos (mantener el de mayor prioridad)
    const validTokens: Token[] = []
    for (const token of tokens) {
      const hasOverlap = validTokens.some(existing => 
        (token.start < existing.end && token.end > existing.start)
      )
      if (!hasOverlap) {
        validTokens.push(token)
      }
    }
    
    // Aplicar el resaltado desde el final hacia el principio para no afectar las posiciones
    validTokens.reverse().forEach(token => {
      const before = highlightedCode.substring(0, token.start)
      const highlighted = `<span class="syntax-${token.className}">${token.text}</span>`
      const after = highlightedCode.substring(token.end)
      highlightedCode = before + highlighted + after
    })
  }

  // Procesar saltos de línea
  highlightedCode = highlightedCode.replace(/\n/g, '<br>')

  return highlightedCode
}

// Tipos de bloques disponibles
type BlockType = 
  | 'paragraph' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3' 
  | 'bulletList' 
  | 'numberedList' 
  | 'todo' 
  | 'quote' 
  | 'code' 
  | 'divider'
  | 'image'
  | 'math'
  | 'table'

interface Block {
  id: string
  type: BlockType
  content: string
  htmlContent?: string // Para preservar formato HTML
  completed?: boolean // Para todos
  level?: number // Para listas anidadas
  indent?: number // Nivel de indentación (0 = sin indentación, 1 = primer nivel, etc.)
  // Propiedades para columnas
  isColumn?: boolean // Si este bloque es un contenedor de columnas
  columnChildren?: string[] // IDs de los bloques hijos en las columnas
  columnIndex?: number // En qué columna está este bloque (0, 1, 2...)
  parentColumnId?: string // ID del bloque padre que contiene las columnas
  columnWidths?: number[] // Anchos de las columnas en porcentajes (ej: [40, 60])
  // Propiedades para tablas
  tableData?: string[][] // Datos de la tabla como matriz de strings
  tableHeaders?: boolean // Si la primera fila son encabezados
  // Propiedades para código
  codeLanguage?: string // Lenguaje de programación para bloques de código
}

interface BlockComponentProps {
  block: Block
  index: number
  isSelected: boolean
  onUpdate: (id: string, content: string, htmlContent?: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onTypeChange: (id: string, type: BlockType) => void
  onSelect: (id: string) => void
  onKeyDown: (e: React.KeyboardEvent, id: string, index: number) => void
  onAddBlock: (afterId: string, type: BlockType) => string
  onToggleComplete: (id: string, completed: boolean) => void
  onOpenPlusMenu?: (blockId: string, event: React.MouseEvent) => void
  plusMenuBlockId?: string | null
  isFirst: boolean
  isLast: boolean
  allBlocks: Block[]
  // Drag and drop props
  onDragStart?: (e: React.DragEvent, blockId: string) => void
  onDragEnd?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent, blockId: string) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, blockId: string) => void
  isDragging?: boolean
  isDragOver?: boolean
  dragPosition?: 'top' | 'bottom' | null
  // Props para columnas
  dragColumnPosition?: 'left' | 'right' | null
  showColumnPreview?: boolean
  canExitColumn?: boolean
}

// Componente para editar ecuaciones matemáticas estilo Notion
function MathEditor({ 
  block, 
  onUpdate, 
  isSelected,
  onAddBlock,
  onSelect
}: { 
  block: Block
  onUpdate: (id: string, content: string, htmlContent?: string) => void
  isSelected: boolean 
  onAddBlock?: (afterId: string, type: BlockType) => string
  onSelect?: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [mathExpression, setMathExpression] = useState(block.content || '')
  const [renderedMath, setRenderedMath] = useState('')
  const [hasError, setHasError] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Placeholder por defecto si no hay contenido
  const defaultPlaceholder = '|x| = \\begin{cases}\n    x, & \\quad x \\geq 0 \\\\\n   -x, & \\quad x < 0\n\\end{cases}'

  // Inicializar con placeholder si está vacío
  useEffect(() => {
    if (!block.content && !mathExpression) {
      setMathExpression(defaultPlaceholder)
      setIsEditing(true)
    }
  }, [block.content, mathExpression])

  // Renderizar matemáticas cuando cambie la expresión
  useEffect(() => {
    const expression = mathExpression || defaultPlaceholder
    
    try {
      const rendered = katex.renderToString(expression, {
        throwOnError: false,
        displayMode: true,
        strict: false,
        trust: true,
        macros: {
          // Macros personalizadas estilo TeX
          "\\f": "#1f(#2)",
          "\\R": "\\mathbb{R}",
          "\\N": "\\mathbb{N}",
          "\\Z": "\\mathbb{Z}",
          "\\Q": "\\mathbb{Q}",
          "\\C": "\\mathbb{C}",
          "\\d": "\\mathrm{d}",
          "\\e": "\\mathrm{e}",
          "\\i": "\\mathrm{i}",
          "\\grad": "\\nabla",
          "\\curl": "\\nabla \\times",
          "\\div": "\\nabla \\cdot",
          "\\laplacian": "\\nabla^2"
        }
      })
      setRenderedMath(rendered)
      setHasError(false)
    } catch (error) {
      setHasError(true)
      setRenderedMath('')
    }
  }, [mathExpression])

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current && isEditing) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = Math.max(textarea.scrollHeight, 60) + 'px'
    }
  }, [mathExpression, isEditing])

  // Enfocar automáticamente cuando se selecciona y está editando
  useEffect(() => {
    if (isSelected && isEditing && textareaRef.current) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          // Si es el placeholder por defecto, seleccionar todo
          if (mathExpression === defaultPlaceholder) {
            textareaRef.current.select()
          }
        }
      }, 0)
    }
  }, [isSelected, isEditing, mathExpression, defaultPlaceholder])

  const handleSave = () => {
    const finalExpression = mathExpression.trim() || defaultPlaceholder
    onUpdate(block.id, finalExpression, finalExpression)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setMathExpression(block.content || defaultPlaceholder)
      setIsEditing(false)
    }
  }

  const handleContainerClick = () => {
    if (!isEditing) {
      setIsEditing(true)
    }
    onSelect?.(block.id)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMathExpression(e.target.value)
  }

  // Detectar si estamos en modo oscuro
  const isDark = typeof window !== 'undefined' && (
    window.matchMedia('(prefers-color-scheme: dark)').matches ||
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('data-theme') === 'dark'
  )

  return (
    <div 
      ref={containerRef}
      className={cn(
        "math-editor-block relative w-full my-4 group/math-editor",
        isEditing && "editing"
      )}
      onClick={handleContainerClick}
    >
      {isEditing ? (
        // Modo edición
        <div 
          className="math-editor-container bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          style={{
            width: '100%',
            maxWidth: '400px',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px'
          }}
        >
          {/* Input area */}
          <div 
            className="flex items-center p-2 w-full bg-gray-50 dark:bg-gray-900 bg-opacity-60"
            style={{ padding: '8px 10px' }}
          >
            <textarea
              ref={textareaRef}
              value={mathExpression}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={defaultPlaceholder}
              className={cn(
                "flex-1 resize-none outline-none border-none bg-transparent",
                "font-mono text-sm mr-2 word-break-break-word max-h-[50vh] overflow-auto min-h-[60px]",
                isDark ? "text-gray-300" : "text-gray-600"
              )}
              style={{
                fontFamily: 'iawriter-mono, Nitti, Menlo, Courier, monospace',
                fontSize: '14px',
                color: 'rgba(70, 68, 64, 0.8)',
                wordBreak: 'break-word'
              }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
            
            {/* Botón Done */}
            <button
              onClick={handleSave}
              className={cn(
                "inline-flex items-center justify-center h-7 px-3 rounded-md",
                "text-sm font-medium text-white bg-blue-600 hover:bg-blue-700",
                "transition-colors duration-200 flex-shrink-0",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              )}
              style={{
                background: 'rgb(35, 131, 226)',
                color: 'white',
                fill: 'white',
                lineHeight: '1.2',
                fontWeight: '500',
                alignSelf: 'flex-start'
              }}
            >
              Done
              <svg 
                aria-hidden="true" 
                role="graphics-symbol" 
                viewBox="0 0 16 16" 
                className="ml-1.5 mt-0.5"
                style={{ width: '14px', height: '14px', display: 'block', fill: 'currentcolor', flexShrink: 0 }}
              >
                <path d="M5.38965 14.1667C5.81812 14.1667 6.10156 13.8767 6.10156 13.468C6.10156 13.2571 6.01587 13.0989 5.89062 12.967L4.18994 11.3125L3.02979 10.3369L4.55908 10.4028H12.7922C14.4402 10.4028 15.1389 9.65796 15.1389 8.04297V4.13403C15.1389 2.48608 14.4402 1.78735 12.7922 1.78735H9.13379C8.70532 1.78735 8.4021 2.11035 8.4021 2.50586C8.4021 2.90137 8.69873 3.22437 9.13379 3.22437H12.7593C13.4316 3.22437 13.7151 3.50781 13.7151 4.17358V7.99683C13.7151 8.67578 13.425 8.95923 12.7593 8.95923H4.55908L3.02979 9.03174L4.18994 8.04956L5.89062 6.39502C6.01587 6.26978 6.10156 6.11157 6.10156 5.89404C6.10156 5.48535 5.81812 5.19531 5.38965 5.19531C5.21167 5.19531 5.01392 5.27441 4.8689 5.41943L1.08521 9.1438C0.933594 9.28882 0.854492 9.48657 0.854492 9.68433C0.854492 9.87549 0.933594 10.0732 1.08521 10.2183L4.8689 13.9492C5.01392 14.0876 5.21167 14.1667 5.38965 14.1667Z"></path>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        // Modo visualización
        <div 
          className={cn(
            "math-display-container p-4 rounded-lg cursor-pointer transition-all duration-200",
            "hover:bg-gray-50 dark:hover:bg-gray-800/50",
            "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
            hasError && "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
          )}
        >
          {hasError ? (
            <div className="text-center text-red-600 dark:text-red-400">
              <div className="text-sm font-medium mb-1">Error en la expresión LaTeX</div>
              <div className="text-xs opacity-75">Haz clic para editar</div>
            </div>
          ) : renderedMath ? (
            <div 
              className="katex-display text-center"
              dangerouslySetInnerHTML={{ __html: renderedMath }}
            />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-sm mb-1">Ecuación matemática vacía</div>
              <div className="text-xs">Haz clic para agregar una expresión LaTeX</div>
            </div>
          )}
          
          {/* Indicador de edición en hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover/math-editor:opacity-100 transition-opacity duration-200">
            <div className="bg-black/80 dark:bg-white/80 text-white dark:text-black text-xs px-2 py-1 rounded">
              Clic para editar
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para editar tablas - Implementación limpia desde cero
function TableEditor({ 
  block, 
  onUpdate, 
  isSelected,
  onAddBlock,
  onSelect
}: { 
  block: Block
  onUpdate: (id: string, content: string, htmlContent?: string) => void
  isSelected: boolean 
  onAddBlock?: (afterId: string, type: BlockType) => string
  onSelect?: (id: string) => void
}) {
  // Usar directamente los datos del bloque padre, sin estado local separado
  const tableData = block.tableData || [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<number | null>(null)
  const [columnWidths, setColumnWidths] = useState<number[]>(() => {
    const numColumns = tableData[0]?.length || 3
    return new Array(numColumns).fill(120) // 120px por defecto
  })
  
  // Estados para selección múltiple
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<{ row: number; col: number } | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [autoScrolling, setAutoScrolling] = useState(false)
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const autoScrollRef = useRef<number | null>(null)

  const updateTableData = (newData: string[][]) => {
    const content = newData.map(row => row.join('\t')).join('\n')
    onUpdate(block.id, content)
  }

  const addRow = () => {
    const numColumns = tableData[0]?.length || 3
    const newRow = new Array(numColumns).fill('')
    const newTableData = [...tableData, newRow]
    updateTableData(newTableData)
  }

  const addColumn = () => {
    const newData = tableData.map(row => [...row, ''])
    setColumnWidths(prev => [...prev, 120]) // Añadir ancho por defecto para nueva columna
    updateTableData(newData)
  }

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData]
    if (!newData[rowIndex]) newData[rowIndex] = []
    newData[rowIndex]![colIndex] = value
    updateTableData(newData)
  }

  const handleCellKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const totalCols = tableData[0]?.length || 0
      const totalRows = tableData.length
      
      if (e.shiftKey) {
        // Ir a celda anterior
        if (colIndex > 0) {
          setEditingCell({ row: rowIndex, col: colIndex - 1 })
        } else if (rowIndex > 0) {
          setEditingCell({ row: rowIndex - 1, col: totalCols - 1 })
        }
      } else {
        // Ir a siguiente celda
        if (colIndex < totalCols - 1) {
          setEditingCell({ row: rowIndex, col: colIndex + 1 })
        } else if (rowIndex < totalRows - 1) {
          setEditingCell({ row: rowIndex + 1, col: 0 })
        } else {
          // Si estamos en la última celda, crear nueva fila
          addRow()
          setTimeout(() => setEditingCell({ row: rowIndex + 1, col: 0 }), 0)
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (rowIndex < tableData.length - 1) {
        setEditingCell({ row: rowIndex + 1, col: colIndex })
      } else {
        addRow()
        setTimeout(() => setEditingCell({ row: rowIndex + 1, col: colIndex }), 0)
      }
    } else if (e.key === 'ArrowDown') {
      // Si estamos en la última fila, salir de la tabla y crear nuevo bloque
      if (rowIndex === tableData.length - 1) {
        e.preventDefault()
        setEditingCell(null)
        if (onAddBlock && onSelect) {
          const newBlockId = onAddBlock(block.id, 'paragraph')
          if (newBlockId) {
            setTimeout(() => {
              onSelect(newBlockId)
              // Enfocar el nuevo bloque
              const newBlockElement = document.querySelector(`[data-block-id="${newBlockId}"] [contenteditable]`) as HTMLElement
              if (newBlockElement) {
                newBlockElement.focus()
              }
            }, 10)
          }
        }
      } else {
        // Ir a la celda de abajo
        e.preventDefault()
        setEditingCell({ row: rowIndex + 1, col: colIndex })
      }
    } else if (e.key === 'ArrowUp') {
      // Ir a la celda de arriba
      if (rowIndex > 0) {
        e.preventDefault()
        setEditingCell({ row: rowIndex - 1, col: colIndex })
      }
    } else if (e.key === 'ArrowLeft') {
      // Solo prevenir comportamiento por defecto si estamos al inicio del input
      const input = e.target as HTMLInputElement
      if (input.selectionStart === 0 && colIndex > 0) {
        e.preventDefault()
        setEditingCell({ row: rowIndex, col: colIndex - 1 })
      }
    } else if (e.key === 'ArrowRight') {
      // Solo prevenir comportamiento por defecto si estamos al final del input
      const input = e.target as HTMLInputElement
      if (input.selectionStart === input.value.length && colIndex < (tableData[0]?.length || 0) - 1) {
        e.preventDefault()
        setEditingCell({ row: rowIndex, col: colIndex + 1 })
      }
    }
  }

  // Función para manejar el redimensionamiento de columnas
  const handleColumnResize = (columnIndex: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizingColumn(columnIndex)
    
    const startX = e.clientX
    const startWidth = columnWidths[columnIndex] || 120
    
    // Obtener la tabla para calcular límites
    const table = (e.target as HTMLElement).closest('table')
    const tableRect = table?.getBoundingClientRect()
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      
      const deltaX = e.clientX - startX
      let newWidth = startWidth + deltaX
      
      // Aplicar límites más flexibles
      newWidth = Math.max(60, Math.min(newWidth, 400)) // Mínimo 60px, máximo 400px
      
      setColumnWidths(prev => {
        const newWidths = [...prev]
        newWidths[columnIndex] = newWidth
        return newWidths
      })
    }
    
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      
      setIsResizing(false)
      setResizingColumn(null)
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('mouseup', handleMouseUp, true)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.body.style.pointerEvents = ''
    }
    
    // Configurar cursor y eventos globales
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.body.style.pointerEvents = 'none' // Prevenir interferencias
    
    // Usar capture para asegurar que capturamos todos los eventos
    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('mouseup', handleMouseUp, true)
  }

  // Actualizar columnWidths cuando cambie el número de columnas
  useEffect(() => {
    const numColumns = tableData[0]?.length || 3
    if (columnWidths.length !== numColumns) {
      setColumnWidths(prev => {
        const newWidths = [...prev]
        while (newWidths.length < numColumns) {
          newWidths.push(120)
        }
        return newWidths.slice(0, numColumns)
      })
    }
  }, [tableData, columnWidths.length])

  // Funciones para selección múltiple
  const getCellKey = (row: number, col: number) => `${row}-${col}`
  
  const updateSelectedCells = useCallback(() => {
    // Solo actualizar si estamos en modo de selección por arrastre
    if (!isSelecting || !selectionStart || !selectionEnd) {
      return
    }
    
    const minRow = Math.min(selectionStart.row, selectionEnd.row)
    const maxRow = Math.max(selectionStart.row, selectionEnd.row)
    const minCol = Math.min(selectionStart.col, selectionEnd.col)
    const maxCol = Math.max(selectionStart.col, selectionEnd.col)
    
    const newSelectedCells = new Set<string>()
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        newSelectedCells.add(getCellKey(row, col))
      }
    }
    
    setSelectedCells(newSelectedCells)
  }, [isSelecting, selectionStart, selectionEnd])
  
  useEffect(() => {
    updateSelectedCells()
  }, [selectionStart, selectionEnd, updateSelectedCells])
  
  const handleCellMouseDown = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    // Si es doble click, editar la celda inmediatamente
    if (e.detail === 2) {
      setEditingCell({ row: rowIndex, col: colIndex })
      setSelectedCells(new Set()) // Limpiar selecciones
      return
    }
    
    const cellKey = getCellKey(rowIndex, colIndex)
    
    // Si se mantiene Ctrl presionado, alternar selección individual
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      setEditingCell(null)
      
      setSelectedCells(prev => {
        const newSelection = new Set(prev)
        if (newSelection.has(cellKey)) {
          newSelection.delete(cellKey)
        } else {
          newSelection.add(cellKey)
        }
        return newSelection
      })
      return
    }
    
    // Si se hace click en una celda ya seleccionada y hay múltiples selecciones,
    // mantener la selección actual para permitir arrastre
    const isClickingOnSelected = selectedCells.has(cellKey)
    const hasMultipleSelections = selectedCells.size > 1
    
    if (isClickingOnSelected && hasMultipleSelections) {
      setIsSelecting(false)
      setEditingCell(null)
      e.preventDefault()
      return
    }
    
    // Usar un timeout para distinguir entre clic rápido y arrastre
    const startTime = Date.now()
    const startX = e.clientX
    const startY = e.clientY
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX)
      const deltaY = Math.abs(moveEvent.clientY - startY)
      const timeDiff = Date.now() - startTime
      
      // Si se mueve más de 5px o pasa más de 200ms, iniciar selección
      if (deltaX > 5 || deltaY > 5 || timeDiff > 200) {
        // Iniciar selección por arrastre
        setIsSelecting(true)
        setSelectionStart({ row: rowIndex, col: colIndex })
        setSelectionEnd({ row: rowIndex, col: colIndex })
        setEditingCell(null)
        setSelectedCells(new Set())
        
        // Limpiar listeners
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      const deltaX = Math.abs(upEvent.clientX - startX)
      const deltaY = Math.abs(upEvent.clientY - startY)
      const timeDiff = Date.now() - startTime
      
      // Si fue un clic rápido sin movimiento, editar la celda
      if (deltaX <= 5 && deltaY <= 5 && timeDiff <= 200) {
        setEditingCell({ row: rowIndex, col: colIndex })
        setSelectedCells(new Set()) // Limpiar selecciones
        setIsSelecting(false)
      }
      
      // Limpiar listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    // Agregar listeners temporales
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    e.preventDefault()
  }
  
  const handleCellMouseEnter = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd({ row: rowIndex, col: colIndex })
      
      // Auto-scroll horizontal suave
      const tableContainer = e.currentTarget.closest('.table-scroll') as HTMLElement
      if (tableContainer) {
        const containerRect = tableContainer.getBoundingClientRect()
        const mouseX = e.clientX
        const scrollThreshold = 50 // Píxeles desde el borde para activar scroll
        
        let scrollDirection = 0
        let scrollSpeed = 0
        
        // Determinar dirección y velocidad basada en distancia al borde
        if (mouseX < containerRect.left + scrollThreshold) {
          scrollDirection = -1
          scrollSpeed = Math.max(2, (scrollThreshold - (mouseX - containerRect.left)) / 5)
        } else if (mouseX > containerRect.right - scrollThreshold) {
          scrollDirection = 1
          scrollSpeed = Math.max(2, (scrollThreshold - (containerRect.right - mouseX)) / 5)
        }
        
        // Iniciar auto-scroll si hay dirección
        if (scrollDirection !== 0 && !autoScrolling) {
          setAutoScrolling(true)
          
          const scroll = () => {
            if (tableContainer && isSelecting) {
              const newScrollLeft = tableContainer.scrollLeft + (scrollDirection * scrollSpeed)
              tableContainer.scrollLeft = Math.max(0, newScrollLeft)
              
              // Continuar scrolling
              autoScrollRef.current = requestAnimationFrame(scroll)
            } else {
              setAutoScrolling(false)
              if (autoScrollRef.current) {
                cancelAnimationFrame(autoScrollRef.current)
                autoScrollRef.current = null
              }
            }
          }
          
          autoScrollRef.current = requestAnimationFrame(scroll)
        } else if (scrollDirection === 0 && autoScrolling) {
          // Detener auto-scroll si el mouse no está en los bordes
          setAutoScrolling(false)
          if (autoScrollRef.current) {
            cancelAnimationFrame(autoScrollRef.current)
            autoScrollRef.current = null
          }
        }
      }
    }
  }
  
  const handleMouseUp = (e?: MouseEvent) => {
    const wasSelecting = isSelecting
    setIsSelecting(false)
    setAutoScrolling(false)
    
    // Limpiar auto-scroll
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current)
      autoScrollRef.current = null
    }
    
    // Si no estábamos seleccionando y hay una selección múltiple,
    // verificar si el click fue en una celda seleccionada para editarla
    if (!wasSelecting && selectedCells.size > 0 && e) {
      const target = e.target as HTMLElement
      const cellElement = target.closest('td')
      
      if (cellElement) {
        const cellData = cellElement.querySelector('[data-cell]')
        if (cellData) {
          const cellKey = cellData.getAttribute('data-cell')
          if (cellKey && selectedCells.has(cellKey)) {
            // Click simple en celda seleccionada - limpiar selección y permitir edición
            const parts = cellKey.split('-').map(Number)
            if (parts.length === 2 && !isNaN(parts[0]!) && !isNaN(parts[1]!)) {
              const row = parts[0]!
              const col = parts[1]!
              setSelectedCells(new Set())
              setTimeout(() => {
                setEditingCell({ row, col })
              }, 0)
            }
          }
        }
      }
    }
  }
  
  // Agregar listener global para mouseup y limpiar auto-scroll
  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      handleMouseUp(e)
    }
    
    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      // Limpiar auto-scroll al desmontar
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current)
      }
    }
  }, [isSelecting, selectedCells])
  
  // Limpiar auto-scroll cuando cambia isSelecting
  useEffect(() => {
    if (!isSelecting && autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current)
      autoScrollRef.current = null
      setAutoScrolling(false)
    }
  }, [isSelecting])

  // Función para seleccionar fila completa
  const selectRow = (rowIndex: number, addToSelection: boolean = false) => {
    const rowCells = new Set<string>()
    if (tableData.length > 0 && tableData[0]) {
      for (let col = 0; col < tableData[0].length; col++) {
        rowCells.add(getCellKey(rowIndex, col))
      }
    }
    
    if (addToSelection) {
      setSelectedCells(prev => new Set([...prev, ...rowCells]))
    } else {
      setSelectedCells(rowCells)
    }
  }
  
  // Función para seleccionar columna completa
  const selectColumn = (colIndex: number, addToSelection: boolean = false) => {
    const colCells = new Set<string>()
    for (let row = 0; row < tableData.length; row++) {
      colCells.add(getCellKey(row, colIndex))
    }
    
    if (addToSelection) {
      setSelectedCells(prev => new Set([...prev, ...colCells]))
    } else {
      setSelectedCells(colCells)
    }
  }
  
  // Función para limpiar selección cuando se hace clic fuera
  const handleTableClick = (e: React.MouseEvent) => {
    // Si el clic no fue en una celda y no se mantiene Ctrl, limpiar selección
    if (!e.ctrlKey && !e.metaKey && e.target === e.currentTarget) {
      setSelectedCells(new Set())
      setSelectionStart(null)
      setSelectionEnd(null)
    }
  }

  // Detectar cuando se presiona/suelta Ctrl y manejar atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressed(true)
      }
      
      // Solo procesar atajos si hay celdas seleccionadas y no estamos editando
      if (selectedCells.size > 0 && !editingCell) {
        // Ctrl+A - Seleccionar todas las celdas
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
          e.preventDefault()
          const allCells = new Set<string>()
          if (tableData.length > 0 && tableData[0]) {
            for (let row = 0; row < tableData.length; row++) {
              for (let col = 0; col < tableData[0].length; col++) {
                allCells.add(getCellKey(row, col))
              }
            }
          }
          setSelectedCells(allCells)
        }
        
        // Escape - Limpiar selección
        if (e.key === 'Escape') {
          setSelectedCells(new Set())
          setSelectionStart(null)
          setSelectionEnd(null)
        }
        
        // Delete/Backspace - Limpiar contenido de celdas seleccionadas
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          const newTableData = [...tableData]
          selectedCells.forEach(cellKey => {
            const parts = cellKey.split('-')
            const row = parseInt(parts[0] || '0', 10)
            const col = parseInt(parts[1] || '0', 10)
            if (!isNaN(row) && !isNaN(col) && row < newTableData.length && newTableData[row] && col < newTableData[row].length) {
              newTableData[row][col] = ''
            }
          })
          updateTableData(newTableData)
        }
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setIsCtrlPressed(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [selectedCells, editingCell, tableData])

      return (
      <div className={cn(
        "w-full py-1 mb-1 group/table", 
        isSelecting && "table-selecting",
        isCtrlPressed && "table-selecting-ctrl"
      )}>

      {/* Tabla con scroll horizontal */}
      <div 
        className="relative max-w-full table-scroll" 
        style={{ 
          overflowX: 'auto',
          overflowY: 'visible',
          maxHeight: 'none',
          height: 'auto',
          paddingBottom: '15px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent'
        }}
        onClick={(e) => e.stopPropagation()} // Prevenir que el clic se propague al área vacía
      >
        <div className="relative inline-block" style={{ 
          minWidth: `${columnWidths.reduce((sum, width) => sum + width, 0)}px`
        }}>
        <table 
          className="border-collapse border border-gray-200 dark:border-gray-700" 
          style={{ 
            tableLayout: 'fixed',
            width: `${columnWidths.reduce((sum, width) => sum + width, 0)}px`
          }}
          onClick={(e) => {
            e.stopPropagation() // Prevenir propagación
            handleTableClick(e)
          }}
        >
          <colgroup>
            {columnWidths.map((width, index) => (
              <col key={index} style={{ width: `${width}px` }} />
            ))}
          </colgroup>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex
                  const isLastColumn = colIndex === row.length - 1
                  const cellKey = getCellKey(rowIndex, colIndex)
                  const isSelected = selectedCells.has(cellKey)
                  
                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "border border-gray-200 dark:border-gray-700 p-0 relative",
                        "bg-white dark:bg-gray-900",
                        isSelected && !isEditing && "table-cell-selected"
                      )}
                      style={{ width: `${columnWidths[colIndex]}px` }}
                      onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
                      onMouseEnter={(e) => handleCellMouseEnter(rowIndex, colIndex, e)}
                    >
                      <div
                        data-cell={`${rowIndex}-${colIndex}`}
                        className={cn(
                          "w-full h-full px-3 py-2 cursor-text",
                          "min-h-[32px] text-sm font-normal"
                        )}
                        style={{
                          direction: 'ltr',
                          textAlign: 'left',
                          unicodeBidi: 'normal'
                        }}
                        onClick={(e) => {
                          // Solo permitir click para editar si no estamos seleccionando
                          if (!isSelecting) {
                            setEditingCell({ row: rowIndex, col: colIndex })
                          }
                          e.stopPropagation()
                        }}
                      >
                        {cell}
                      </div>
                      
                      {isEditing && (
                        <input
                          type="text"
                          value={cell}
                          className={cn(
                            "absolute inset-0 px-3 py-2 outline-none border-none bg-transparent",
                            "text-sm resize-none font-normal"
                          )}
                          style={{
                            direction: 'ltr',
                            textAlign: 'left',
                            unicodeBidi: 'normal',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            zIndex: 10
                          }}
                          onChange={(e) => {
                            updateCell(rowIndex, colIndex, e.target.value)
                          }}
                          onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
                          onBlur={() => setEditingCell(null)}
                          autoFocus
                        />
                      )}
                      

                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Handles de redimensionamiento para cada columna */}
        {columnWidths.slice(0, -1).map((_, colIndex) => (
          <div
            key={`resize-${colIndex}`}
            className={cn(
              "absolute top-0 bottom-0 w-2 cursor-col-resize z-20",
              "bg-transparent",
              isResizing && resizingColumn === colIndex ? "bg-blue-500/10" : ""
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleColumnResize(colIndex, e)
            }}
            title="Drag to resize column"
            style={{
              left: `${columnWidths.slice(0, colIndex + 1).reduce((sum, width) => sum + width, 0)}px`,
              transform: 'translateX(-50%)'
            }}
          >
            {/* Línea invisible por defecto, visible solo al hover */}
            <div 
              className={cn(
                "absolute inset-y-0 left-1/2 w-0 border-l-0",
                "hover:border-l hover:border-blue-400 transition-all duration-150",
                "transform -translate-x-1/2"
              )}
            />
          </div>
        ))}

        {/* Botón para añadir columna - se adapta a la altura de la tabla */}
        <button
          onClick={addColumn}
          className={cn(
            "absolute top-0 bottom-0",
            "w-4 flex items-center justify-center",
            "opacity-0 group-hover/table:opacity-100 transition-opacity",
            "hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md cursor-pointer",
            "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
          )}
          style={{
            left: `${columnWidths.reduce((sum, width) => sum + width, 0) + 4}px`,
            height: '100%'
          }}
          title="Add column"
        >
          <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Botón para añadir fila - se adapta al ancho total de la tabla */}
        <button
          onClick={addRow}
          className={cn(
            "absolute left-0",
            "h-4 flex items-center justify-center",
            "opacity-0 group-hover/table:opacity-100 transition-opacity",
            "hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md cursor-pointer",
            "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
          )}
          style={{
            bottom: '-20px',
            width: `${columnWidths.reduce((sum, width) => sum + width, 0)}px`
          }}
          title="Add row"
        >
          <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </button>

        </div>
      </div>
    </div>
  )
}

// Componente selector de lenguaje personalizado
function LanguageSelector({ 
  value, 
  onChange 
}: { 
  value: string
  onChange: (language: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  
  const languages = [
    { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
    { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
    { value: 'python', label: 'Python', color: '#3776ab' },
    { value: 'java', label: 'Java', color: '#ed8b00' },
    { value: 'cpp', label: 'C++', color: '#00599c' },
    { value: 'c', label: 'C', color: '#a8b9cc' },
    { value: 'csharp', label: 'C#', color: '#239120' },
    { value: 'php', label: 'PHP', color: '#777bb4' },
    { value: 'ruby', label: 'Ruby', color: '#cc342d' },
    { value: 'go', label: 'Go', color: '#00add8' },
    { value: 'rust', label: 'Rust', color: '#ce422b' },
    { value: 'html', label: 'HTML', color: '#e34f26' },
    { value: 'css', label: 'CSS', color: '#1572b6' },
    { value: 'sql', label: 'SQL', color: '#336791' },
    { value: 'bash', label: 'Bash', color: '#4eaa25' },
    { value: 'json', label: 'JSON', color: '#000000' },
    { value: 'xml', label: 'XML', color: '#0060ac' },
    { value: 'yaml', label: 'YAML', color: '#cb171e' },
    { value: 'markdown', label: 'Markdown', color: '#083fa1' },
    { value: 'swift', label: 'Swift', color: '#fa7343' },
    { value: 'kotlin', label: 'Kotlin', color: '#7f52ff' },
    { value: 'scala', label: 'Scala', color: '#dc322f' },
    { value: 'perl', label: 'Perl', color: '#39457e' },
    { value: 'lua', label: 'Lua', color: '#000080' },
    { value: 'dart', label: 'Dart', color: '#0175c2' },
    { value: 'r', label: 'R', color: '#276dc3' },
    { value: 'matlab', label: 'MATLAB', color: '#e16737' },
    { value: 'haskell', label: 'Haskell', color: '#5d4f85' },
    { value: 'elixir', label: 'Elixir', color: '#6e4a7e' },
    { value: 'erlang', label: 'Erlang', color: '#a90533' },
    { value: 'clojure', label: 'Clojure', color: '#5881d8' },
    { value: 'fsharp', label: 'F#', color: '#378bba' },
    { value: 'ocaml', label: 'OCaml', color: '#3be133' },
    { value: 'assembly', label: 'Assembly', color: '#6e4c13' },
    { value: 'vhdl', label: 'VHDL', color: '#543978' },
    { value: 'verilog', label: 'Verilog', color: '#b2b7f8' },
    { value: 'powershell', label: 'PowerShell', color: '#012456' },
    { value: 'dockerfile', label: 'Dockerfile', color: '#384d54' },
    { value: 'nginx', label: 'Nginx', color: '#009639' },
    { value: 'apache', label: 'Apache', color: '#d22128' },
    { value: 'graphql', label: 'GraphQL', color: '#e10098' },
    { value: 'solidity', label: 'Solidity', color: '#363636' },
    { value: 'toml', label: 'TOML', color: '#9c4221' },
    { value: 'ini', label: 'INI', color: '#d1dbe0' },
    { value: 'makefile', label: 'Makefile', color: '#427819' },
    { value: 'cmake', label: 'CMake', color: '#064f8c' },
    { value: 'gradle', label: 'Gradle', color: '#02303a' },
    { value: 'maven', label: 'Maven', color: '#c71a36' },
    { value: 'latex', label: 'LaTeX', color: '#008080' },
    { value: 'bibtex', label: 'BibTeX', color: '#778899' },
    { value: 'vim', label: 'Vim Script', color: '#199f4b' },
    { value: 'emacs', label: 'Emacs Lisp', color: '#c065db' },
    { value: 'prolog', label: 'Prolog', color: '#74283c' },
    { value: 'cobol', label: 'COBOL', color: '#e42d40' },
    { value: 'fortran', label: 'Fortran', color: '#4d41b1' },
    { value: 'ada', label: 'Ada', color: '#02f88c' },
    { value: 'pascal', label: 'Pascal', color: '#e3f171' },
    { value: 'delphi', label: 'Delphi', color: '#cc342d' },
    { value: 'smalltalk', label: 'Smalltalk', color: '#596706' },
    { value: 'tcl', label: 'Tcl', color: '#e4cc98' },
    { value: 'scheme', label: 'Scheme', color: '#1e4aec' },
    { value: 'racket', label: 'Racket', color: '#3c5caa' },
    { value: 'crystal', label: 'Crystal', color: '#000100' },
    { value: 'nim', label: 'Nim', color: '#ffc200' },
    { value: 'zig', label: 'Zig', color: '#ec915c' },
    { value: 'v', label: 'V', color: '#4f87c4' },
    { value: 'julia', label: 'Julia', color: '#9558b2' },
    { value: 'wolfram', label: 'Wolfram', color: '#dd1100' },
    { value: 'mathematica', label: 'Mathematica', color: '#dd1100' },
    { value: 'sas', label: 'SAS', color: '#b34936' },
    { value: 'stata', label: 'Stata', color: '#1a5490' },
    { value: 'spss', label: 'SPSS', color: '#c41e3a' },
    { value: 'plain', label: 'Plain Text', color: '#666666' }
  ]
  
  const currentLanguage = languages.find(lang => lang.value === value) || languages[0]
  
  const filteredLanguages = searchQuery
    ? languages.filter(lang => 
        lang.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : languages
  
  // Calcular posición del dropdown
  const calculatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      })
    }
  }, [])
  
  // Abrir/cerrar dropdown
  const toggleDropdown = () => {
    if (!isOpen) {
      calculatePosition()
      lastScrollY.current = window.scrollY // Inicializar posición de scroll
      setIsOpen(true)
    } else {
      setIsOpen(false)
      setSearchQuery('')
    }
  }
  
  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }
    
    const handleScroll = (event: Event) => {
      if (isOpen) {
        const currentScrollY = window.scrollY
        const scrollDifference = Math.abs(currentScrollY - lastScrollY.current)
        
        // Si el scroll es significativo (más de 100px), cerrar el dropdown
        if (scrollDifference > 100) {
          setIsOpen(false)
          setSearchQuery('')
        } else {
          // Solo recalcular posición para scrolls pequeños
          calculatePosition()
        }
        
        lastScrollY.current = currentScrollY
      }
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    
    // Usar passive: true para no bloquear el scroll
    if (isOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', calculatePosition, { passive: true })
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculatePosition)
    }
  }, [isOpen, calculatePosition])
  
  const handleSelect = (language: string) => {
    onChange(language)
    setIsOpen(false)
    setSearchQuery('')
  }
  
  // Componente del dropdown que se renderiza en un portal
  const DropdownPortal = () => {
    if (!isOpen) return null
    
    return createPortal(
      <div 
        ref={dropdownRef}
        className="fixed z-[10000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-[180px] max-w-[220px]"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`
        }}
      >
        {/* Search input */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Buscar lenguaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
            autoFocus
          />
        </div>
        
        {/* Language list */}
        <div className="max-h-48 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
              <button
                key={language.value}
                type="button"
                onClick={() => handleSelect(language.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  value === language.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: language.color }}
                />
                <span className="font-medium">{language.label}</span>
                {value === language.value && (
                  <svg className="w-3 h-3 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              No se encontraron lenguajes
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  }
  
  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors cursor-pointer"
      >
        <div 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: currentLanguage!.color }}
        />
        <span className="font-medium">{currentLanguage!.label}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown renderizado en portal */}
      <DropdownPortal />
    </>
  )
}

// Componente individual de bloque completamente rediseñado
function BlockComponent({ 
  block, 
  index,
  isSelected, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onMoveUp, 
  onMoveDown, 
  onTypeChange,
  onSelect,
  onKeyDown,
  onAddBlock,
  onToggleComplete,
  onOpenPlusMenu,
  plusMenuBlockId,
  isFirst,
  isLast,
  allBlocks,
  // Drag and drop props
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  isDragOver,
  dragPosition,
  // Props para columnas
  dragColumnPosition,
  showColumnPreview,
  canExitColumn
}: BlockComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)

  // Sincronizar el contenido cuando cambia externamente
  useEffect(() => {
    if (contentRef.current) {
      // Si hay HTML formateado, usarlo; si no, usar el texto plano
      if (block.htmlContent && block.htmlContent !== block.content) {
        contentRef.current.innerHTML = block.htmlContent
      } else if (contentRef.current.textContent !== block.content) {
        contentRef.current.textContent = block.content
      }
    }
  }, [block.content, block.htmlContent])

  // Focus cuando se selecciona
  useEffect(() => {
    if (isSelected) {
      // Para bloques de código, enfocar el textarea
      if (block.type === 'code' && textareaRef.current && document.activeElement !== textareaRef.current) {
        setTimeout(() => {
          if (textareaRef.current && isSelected) {
            textareaRef.current.focus()
            // Posicionar cursor al final
            const textLength = textareaRef.current.value.length
            textareaRef.current.setSelectionRange(textLength, textLength)
          }
        }, 0)
      }
      // Para otros bloques, usar contentRef
      else if (block.type !== 'code' && contentRef.current && document.activeElement !== contentRef.current) {
        setTimeout(() => {
          if (contentRef.current && isSelected) {
            contentRef.current.focus()
            
            // Posicionar cursor al final
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(contentRef.current)
            range.collapse(false)
            selection?.removeAllRanges()
            selection?.addRange(range)
          }
        }, 0)
      }
    }
  }, [isSelected, block.type])

  // Auto-resize del textarea cuando cambia el contenido
  useEffect(() => {
    if (block.type === 'code' && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = Math.max(textarea.scrollHeight, 64) + 'px'
    }
  }, [block.content, block.type])

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.textContent || ''
      const newHtmlContent = contentRef.current.innerHTML || ''
      
      // Actualizar tanto el contenido de texto como el HTML
      onUpdate(block.id, newContent, newHtmlContent)
      
      // Auto-conversión de texto a tipos de bloque
      handleAutoConversion(newContent)
    }
  }

  const handleAutoConversion = (content: string) => {
    // Solo aplicar auto-conversión en bloques de párrafo
    if (block.type !== 'paragraph') return
    
    // Definir patrones de auto-conversión
    const patterns: Array<{ pattern: RegExp; type: BlockType; removeChars: number }> = [
      { pattern: /^- $/, type: 'bulletList', removeChars: 2 },
      { pattern: /^• $/, type: 'bulletList', removeChars: 2 },
      { pattern: /^\* $/, type: 'bulletList', removeChars: 2 },
      { pattern: /^1\. $/, type: 'numberedList', removeChars: 3 },
      { pattern: /^# $/, type: 'heading1', removeChars: 2 },
      { pattern: /^## $/, type: 'heading2', removeChars: 3 },
      { pattern: /^### $/, type: 'heading3', removeChars: 4 },
      { pattern: /^> $/, type: 'quote', removeChars: 2 },
      { pattern: /^``` $/, type: 'code', removeChars: 4 },
      { pattern: /^\[\] $/, type: 'todo', removeChars: 3 },
      { pattern: /^--- $/, type: 'divider', removeChars: 4 },
    ]
    
    // Buscar coincidencia con algún patrón
    const match = patterns.find(p => p.pattern.test(content))
    
    if (match) {
      // Cambiar tipo de bloque
      onTypeChange(block.id, match.type)
      
      // Limpiar el contenido (quitar los caracteres del patrón)
      const cleanContent = content.substring(match.removeChars)
      
      // Actualizar contenido sin los caracteres del patrón
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.textContent = cleanContent
          onUpdate(block.id, cleanContent || '', cleanContent || '')
          
          // Posicionar cursor al final
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(contentRef.current)
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Si estamos en un bloque de código, manejar Enter de forma especial
    if (block.type === 'code' && e.key === 'Enter' && !e.shiftKey) {
      // No prevenir el comportamiento por defecto - permitir nueva línea en código
      return
    }
    
    // Manejar teclas de flecha para navegación alrededor de elementos matemáticos
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const currentNode = range.startContainer
        
                 // Verificar si estamos cerca de un elemento matemático
         let mathElement: Element | null = null
         if (currentNode.nodeType === Node.TEXT_NODE && currentNode.parentElement) {
           mathElement = currentNode.parentElement.querySelector('.katex-math, .katex-fallback') ||
                        currentNode.parentElement.closest('.katex-math, .katex-fallback')
         } else {
           mathElement = (currentNode as Element).querySelector('.katex-math, .katex-fallback') ||
                        (currentNode as Element).closest('.katex-math, .katex-fallback')
         }
        
        if (mathElement) {
          e.preventDefault()
          
          const newRange = document.createRange()
          const newSelection = window.getSelection()
          
          if (e.key === 'ArrowRight') {
            // Mover cursor después del elemento matemático
            const nextSibling = mathElement.nextSibling
            if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
              newRange.setStart(nextSibling, 0)
            } else {
              // Crear un nodo de texto después si no existe
              const textNode = document.createTextNode(' ')
              mathElement.parentNode?.insertBefore(textNode, mathElement.nextSibling)
              newRange.setStart(textNode, 1)
            }
          } else if (e.key === 'ArrowLeft') {
            // Mover cursor antes del elemento matemático
            const prevSibling = mathElement.previousSibling
            if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
              newRange.setStart(prevSibling, prevSibling.textContent?.length || 0)
            } else {
              // Crear un nodo de texto antes si no existe
              const textNode = document.createTextNode(' ')
              mathElement.parentNode?.insertBefore(textNode, mathElement)
              newRange.setStart(textNode, 1)
            }
          }
          
          newRange.collapse(true)
          newSelection?.removeAllRanges()
          newSelection?.addRange(newRange)
          return
        }
      }
    }
    
    // Manejar Delete/Backspace para elementos matemáticos
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        
        // Verificar si hay un elemento matemático seleccionado
        if (range.startContainer === range.endContainer) {
          const selectedNode = range.startContainer.nodeType === Node.TEXT_NODE 
            ? range.startContainer.parentElement 
            : range.startContainer as Element
          
          const mathElement = selectedNode?.closest('.katex-math, .katex-fallback')
          
          if (mathElement) {
            e.preventDefault()
            
            // Crear un nodo de texto vacío para reemplazar el elemento matemático
            const textNode = document.createTextNode('')
            mathElement.parentNode?.replaceChild(textNode, mathElement)
            
            // Posicionar cursor donde estaba el elemento
            const newRange = document.createRange()
            newRange.setStart(textNode, 0)
            newRange.collapse(true)
            selection.removeAllRanges()
            selection.addRange(newRange)
            
            // Actualizar el contenido del bloque
            if (contentRef.current) {
              const newContent = contentRef.current.textContent || ''
              const newHtmlContent = contentRef.current.innerHTML || ''
              onUpdate(block.id, newContent, newHtmlContent)
            }
            
            return
          }
        }
        
        // También verificar si toda la selección incluye elementos matemáticos
        const fragment = range.cloneContents()
        const mathElements = fragment.querySelectorAll('.katex-math, .katex-fallback')
        
        if (mathElements.length > 0) {
          e.preventDefault()
          
          // Eliminar el contenido seleccionado (incluyendo elementos matemáticos)
          range.deleteContents()
          
          // Actualizar el contenido del bloque
          setTimeout(() => {
            if (contentRef.current) {
              const newContent = contentRef.current.textContent || ''
              const newHtmlContent = contentRef.current.innerHTML || ''
              onUpdate(block.id, newContent, newHtmlContent)
            }
          }, 0)
          
          return
        }
      }
    }
    
    // Manejar Enter especialmente para mantener la funcionalidad (excepto para código)
    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault()
      onKeyDown(e, block.id, index)
      return
    }
    
    onKeyDown(e, block.id, index)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(block.id)
    
    // Verificar si se hizo clic en un elemento matemático
    const target = e.target as HTMLElement
    const mathElement = target.closest('.katex-math, .katex-fallback')
    
    if (mathElement) {
      if (e.detail === 2) { // Doble clic
        e.preventDefault()
        handleMathEdit(mathElement as HTMLElement)
        return
      } else if (e.detail === 1) { // Clic simple
        e.preventDefault()
        // Solo seleccionar el elemento matemático, no editarlo
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNode(mathElement)
        selection?.removeAllRanges()
        selection?.addRange(range)
        return
      }
    }
    
    // Asegurar focus inmediato
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus()
        
        // Si hay contenido, posicionar cursor donde se hizo click
        // Si no hay contenido, posicionar al final
        if (!block.content) {
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(contentRef.current)
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }
    }, 0)
  }

  // Función para manejar la edición de elementos matemáticos
  const handleMathEdit = (mathElement: HTMLElement) => {
    // Prevenir múltiples ediciones simultáneas
    if (mathElement.hasAttribute('data-editing')) return
    
    const originalExpression = mathElement.getAttribute('data-math-expression') || mathElement.textContent || ''
    const mathType = mathElement.getAttribute('data-math-type') || 'katex'
    
    // Marcar como editando
    mathElement.setAttribute('data-editing', 'true')
    
    // Crear un input temporal para editar la expresión
    const input = document.createElement('input')
    input.type = 'text'
    input.value = originalExpression
    input.className = 'math-editor-input'
    input.setAttribute('data-math-editing', 'true')
    input.spellcheck = false
    input.autocomplete = 'off'
    input.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    input.style.fontSize = '14px'
    input.style.padding = '6px 10px'
    input.style.border = '2px solid #3b82f6'
    input.style.borderRadius = '6px'
    input.style.background = '#fff'
    input.style.color = '#000'
    input.style.outline = 'none'
    input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
    input.style.minWidth = '200px'
    input.style.maxWidth = '400px'
    input.style.width = Math.max(200, originalExpression.length * 8 + 40) + 'px'
    input.style.zIndex = '10000'
    input.style.position = 'relative'
    input.style.display = 'inline-block'
    input.style.verticalAlign = 'baseline'
    input.style.lineHeight = '1.4'
    input.style.userSelect = 'text'
    input.style.cursor = 'text'
    input.style.pointerEvents = 'auto'
    input.style.caretColor = '#3b82f6'
    input.style.margin = '0'
    input.style.whiteSpace = 'nowrap'
    input.style.overflow = 'visible'
    input.style.textOverflow = 'clip'
    
    // Detectar modo oscuro
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                  document.documentElement.classList.contains('dark')
    
    if (isDark) {
      input.style.background = '#1f2937'
      input.style.color = '#f9fafb'
      input.style.border = '2px solid #60a5fa'
    }
    
    // Reemplazar temporalmente el elemento matemático
    mathElement.style.display = 'none'
    mathElement.parentNode?.insertBefore(input, mathElement)
    
    // Focus y seleccionar todo el texto - mejorado para evitar problemas
    const focusInput = () => {
      try {
        // Asegurar que el input está en el DOM antes de enfocar
        if (!document.contains(input)) return
        
        // Forzar el foco inmediatamente
        input.focus({ preventScroll: true })
        
        // Seleccionar todo el texto
        input.setSelectionRange(0, input.value.length)
        
        // Verificar que el foco se mantuvo
        if (document.activeElement !== input) {
          // Si perdió el foco, intentar de nuevo
          setTimeout(() => {
            if (document.contains(input)) {
              input.focus({ preventScroll: true })
              input.setSelectionRange(0, input.value.length)
            }
          }, 10)
        }
      } catch (error) {
        console.warn('Error focusing math input:', error)
      }
    }
    
    // Intentar enfocar con múltiples estrategias
    setTimeout(focusInput, 0)
    setTimeout(focusInput, 10)
    setTimeout(focusInput, 50)
    
    let isFinishing = false
    let updateTimeout: NodeJS.Timeout | null = null
    
    const finishEdit = (save: boolean = true) => {
      if (isFinishing) return
      isFinishing = true
      
      // Limpiar timeout pendiente
      if (updateTimeout) {
        clearTimeout(updateTimeout)
        updateTimeout = null
      }
      
      // Remover marca de edición
      mathElement.removeAttribute('data-editing')
      
      if (save && input.value.trim() !== '') {
        const newExpression = input.value.trim()
        
        // Solo actualizar si la expresión ha cambiado (ya debería estar actualizada por la vista previa)
        if (mathElement.getAttribute('data-math-expression') !== newExpression) {
          updatePreview(newExpression)
        }
      } else if (!save) {
        // Si se cancela (Escape), restaurar la expresión original completamente
        try {
          if (mathType === 'katex') {
            const mathHtml = katex.renderToString(originalExpression, {
              throwOnError: false,
              displayMode: false,
              strict: false,
              trust: true
            })
            
            mathElement.innerHTML = mathHtml
            mathElement.setAttribute('data-math-expression', originalExpression)
          } else {
            mathElement.textContent = originalExpression
            mathElement.setAttribute('data-math-expression', originalExpression)
          }
        } catch (error) {
          mathElement.textContent = originalExpression
          mathElement.setAttribute('data-math-expression', originalExpression)
        }
        
        // Asegurar que se limpia cualquier estado de error
        mathElement.classList.remove('math-error')
      } else if (save && input.value.trim() === '') {
        // Si se guarda vacío, eliminar el elemento matemático
        const textNode = document.createTextNode('')
        mathElement.parentNode?.replaceChild(textNode, mathElement)
        
        // No continuar con el resto de la función
        return
      }
      
      // Restaurar el elemento matemático al estado normal
      mathElement.style.display = 'inline-block'
      mathElement.removeAttribute('data-editing')
      mathElement.classList.remove('math-error')
      
      // Limpiar eventos antes de remover el input
      cleanupEvents()
      
      // Remover el input
      if (input.parentNode) {
        input.parentNode.removeChild(input)
      }
      
      // Posicionar cursor después del elemento y devolver el foco al editor
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus()
          
          // Crear un espacio después del elemento matemático si no existe
          const nextSibling = mathElement.nextSibling
          if (!nextSibling || (nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent === '')) {
            // Agregar un espacio en blanco después del elemento matemático
            const spaceNode = document.createTextNode(' ')
            mathElement.parentNode?.insertBefore(spaceNode, mathElement.nextSibling)
          }
          
          const selection = window.getSelection()
          const range = document.createRange()
          
          // Posicionar el cursor después del elemento matemático
          if (mathElement.nextSibling && mathElement.nextSibling.nodeType === Node.TEXT_NODE) {
            // Si hay un nodo de texto después, posicionar al inicio de ese nodo
            range.setStart(mathElement.nextSibling, 0)
          } else {
            // Si no hay nodo de texto, crear uno y posicionar ahí
            const textNode = document.createTextNode(' ')
            mathElement.parentNode?.insertBefore(textNode, mathElement.nextSibling)
            range.setStart(textNode, 1)
          }
          
          range.collapse(true)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }, 50)
    }
    
    // Manejar eventos del input
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation()
      
      if (e.key === 'Enter') {
        e.preventDefault()
        finishEdit(true)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        finishEdit(false)
      }
      // Para otras teclas, no prevenir el comportamiento por defecto
      // para que el input funcione normalmente
    }
    
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation()
    }
    
    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation()
    }
    
    const handlePaste = (e: ClipboardEvent) => {
      e.stopPropagation()
      e.preventDefault()
      
      try {
        // Obtener el texto del portapapeles
        const pastedText = e.clipboardData?.getData('text/plain') || ''
        
        if (!pastedText) return
        
        // Asegurar que el input tiene foco antes de pegar
        if (document.activeElement !== input) {
          input.focus({ preventScroll: true })
          // Esperar un momento para que el foco se establezca
          setTimeout(() => {
            performPaste(pastedText)
          }, 10)
        } else {
          performPaste(pastedText)
        }
        
        function performPaste(text: string) {
          // Insertar el texto en la posición actual del cursor
          const start = input.selectionStart || 0
          const end = input.selectionEnd || 0
          const currentValue = input.value
          
          // Construir el nuevo valor
          const newValue = currentValue.substring(0, start) + text + currentValue.substring(end)
          
          // Actualizar el valor del input
          input.value = newValue
          
          // Disparar evento input manualmente para actualizar el estado
          const inputEvent = new Event('input', { bubbles: true })
          input.dispatchEvent(inputEvent)
          
          // Posicionar el cursor después del texto pegado
          const newCursorPosition = start + text.length
          setTimeout(() => {
            if (document.contains(input)) {
              input.setSelectionRange(newCursorPosition, newCursorPosition)
              input.focus({ preventScroll: true })
            }
          }, 0)
          
          // Ajustar el ancho del input
          const newWidth = Math.max(200, input.value.length * 8 + 40)
          input.style.width = Math.min(400, newWidth) + 'px'
          
          // Actualizar la vista previa
          if (updateTimeout) {
            clearTimeout(updateTimeout)
          }
          
          updateTimeout = setTimeout(() => {
            updatePreview(input.value)
          }, 150)
        }
      } catch (error) {
        console.warn('Error handling paste in math input:', error)
      }
    }
    
    const handleInput = (e: Event) => {
      e.stopPropagation()
      
      // Asegurar que el input mantiene el foco
      if (document.activeElement !== input) {
        setTimeout(() => {
          if (document.contains(input)) {
            input.focus({ preventScroll: true })
          }
        }, 0)
      }
      
      // Ajustar el ancho del input dinámicamente
      const newWidth = Math.max(200, input.value.length * 8 + 40)
      input.style.width = Math.min(400, newWidth) + 'px'
      
      // Debounce la actualización para evitar demasiadas renderizaciones
      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }
      
      updateTimeout = setTimeout(() => {
        updatePreview(input.value)
      }, 150) // 150ms de delay
    }
    
    // Función para actualizar la vista previa en tiempo real
    const updatePreview = (expression: string) => {
      if (!expression.trim()) {
        // Si está vacío, mostrar placeholder
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                      document.documentElement.classList.contains('dark')
        const placeholderColor = isDark ? '#6b7280' : '#9ca3af'
        mathElement.innerHTML = `<span style="color: ${placeholderColor}; font-style: italic; font-size: 0.9em;">Escribe LaTeX...</span>`
        return
      }
      
      try {
        if (mathType === 'katex') {
          // Intentar renderizar con KaTeX
          const mathHtml = katex.renderToString(expression, {
            throwOnError: false,
            displayMode: false,
            strict: false,
            trust: true
          })
          
          mathElement.innerHTML = mathHtml
          mathElement.setAttribute('data-math-expression', expression)
          
          // Remover clases de error si existían
          mathElement.classList.remove('math-error')
        } else {
          // Fallback: solo mostrar el texto
          mathElement.textContent = expression
          mathElement.setAttribute('data-math-expression', expression)
          mathElement.classList.remove('math-error')
        }
      } catch (error) {
        // En caso de error, mostrar el texto plano con indicador de error
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                      document.documentElement.classList.contains('dark')
        const errorColor = isDark ? '#f87171' : '#ef4444'
        const errorBg = isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        
        mathElement.innerHTML = `<span style="color: ${errorColor}; background: ${errorBg}; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;" title="Error de sintaxis LaTeX">${expression} ⚠️</span>`
        mathElement.setAttribute('data-math-expression', expression)
        mathElement.classList.add('math-error')
      }
    }
    
    const handleBlur = (e: FocusEvent) => {
      // Solo finalizar si realmente perdimos el foco y no es un cambio temporal
      setTimeout(() => {
        if (document.activeElement !== input && document.contains(input)) {
          finishEdit(true)
        }
      }, 150)
    }
    
    // Función para manejar clics fuera del input
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Si el clic es en el input mismo, asegurar que mantiene el foco
      if (input.contains(target) || target === input) {
        setTimeout(() => {
          if (document.contains(input)) {
            input.focus({ preventScroll: true })
          }
        }, 0)
        return
      }
      
      // Si el clic es en el elemento matemático, no hacer nada (para permitir reselección)
      if (mathElement.contains(target)) {
        return
      }
      
      // Si el clic es fuera del input y del elemento matemático, cerrar edición
      setTimeout(() => {
        if (document.contains(input)) {
          finishEdit(true)
        }
      }, 50)
    }
    
    input.addEventListener('keydown', handleKeyDown)
    input.addEventListener('click', handleClick)
    input.addEventListener('mousedown', handleMouseDown)
    input.addEventListener('input', handleInput)
    input.addEventListener('blur', handleBlur)
    input.addEventListener('paste', handlePaste)
    
    // Agregar listener global para clics fuera
    document.addEventListener('click', handleClickOutside)
    
    // Función para limpiar todos los eventos
    const cleanupEvents = () => {
      input.removeEventListener('keydown', handleKeyDown)
      input.removeEventListener('click', handleClick)
      input.removeEventListener('mousedown', handleMouseDown)
      input.removeEventListener('input', handleInput)
      input.removeEventListener('blur', handleBlur)
      input.removeEventListener('paste', handlePaste)
      document.removeEventListener('click', handleClickOutside)
    }
    
    // Limpiar eventos cuando se remueva el input
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === input) {
            cleanupEvents()
            observer.disconnect()
          }
        })
      })
    })
    
    if (input.parentNode) {
      observer.observe(input.parentNode, { childList: true })
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    const selection = window.getSelection()
    if (!selection?.rangeCount) return
    
    selection.deleteFromDocument()
    selection.getRangeAt(0).insertNode(document.createTextNode(text))
    selection.collapseToEnd()
    
    handleContentChange()
  }

  const getBlockStyles = () => {
    const baseStyles = "outline-none min-h-[1.5em] cursor-text w-full border-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none"
    
    switch (block.type) {
      case 'heading1':
        return cn(baseStyles, 
          block.id === 'title' 
            ? "text-[40px] font-bold text-[#37352F] dark:text-gray-100 leading-[1.2]" 
            : "text-[30px] font-bold text-[#37352F] dark:text-gray-100 leading-[1.3] mt-2"
        )
      case 'heading2':
        return cn(baseStyles, "text-[24px] font-semibold text-[#37352F] dark:text-gray-100 leading-[1.3] mt-1.5")
      case 'heading3':
        return cn(baseStyles, "text-[20px] font-semibold text-[#37352F] dark:text-gray-100 leading-[1.3] mt-1")
      case 'quote':
        return cn(baseStyles, "text-[16px] text-[#37352F] dark:text-gray-100 leading-[1.5]")
      case 'code':
        return cn(baseStyles, "text-[85%] font-mono bg-[#F7F6F3] dark:bg-gray-800 text-[#EB5757] dark:text-red-400 p-3 rounded")
      case 'divider':
        return "w-full"
      default:
        return cn(baseStyles, "text-[16px] text-[#37352F] dark:text-gray-100 leading-[1.5]")
    }
  }

  // Función para detectar si el elemento tiene formato matemático
  const hasMathFormat = () => {
    if (!contentRef.current) return false
    
    // Verificar si hay elementos KaTeX renderizados
    const katexElements = contentRef.current.querySelectorAll('.katex, .katex-math, .katex-fallback')
    if (katexElements.length > 0) return true
    
    // Verificar si hay elementos con estilo matemático (fallback)
    const mathElements = contentRef.current.querySelectorAll('span[style*="KaTeX_Math"], span[style*="Times New Roman"]')
    if (mathElements.length > 0) return true
    
    // Verificar si el propio elemento tiene estilo matemático
    const computedStyle = window.getComputedStyle(contentRef.current)
    if (computedStyle.fontFamily.includes('KaTeX_Math') || 
        computedStyle.fontFamily.includes('Times New Roman')) {
      return true
    }
    
    return false
  }

  const getPlaceholder = () => {
    // Para el título, siempre mostrar placeholder cuando esté vacío
    if (block.id === 'title') return 'Untitled'
    
    // Para otros bloques, solo mostrar cuando están seleccionados
    if (!isSelected) return ''
    
    // Si el menú plus está abierto para este bloque, mostrar placeholder de filtro
    if (plusMenuBlockId === block.id) {
      return 'Search through filter...'
    }
    
    // Si tiene formato matemático, mostrar placeholder específico
    if (hasMathFormat()) {
      return 'Enter LaTeX expression (e.g., x^2 + y^2 = z^2)...'
    }
    
    switch (block.type) {
      case 'heading1': return 'Heading 1'
      case 'heading2': return 'Heading 2'
      case 'heading3': return 'Heading 3'
      case 'bulletList': return 'List item'
      case 'numberedList': return 'Numbered item'
      case 'todo': return 'To-do'
      case 'quote': return 'Quote or note'
      case 'code': return 'Code'
      default: return 'Type something or use / for commands'
    }
  }

  const renderContent = () => {
    const commonProps = {
      ref: contentRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: getBlockStyles(),
      onInput: handleContentChange,
      onKeyDown: handleKeyDown,
      onClick: handleClick,
      onPaste: handlePaste,
      onFocus: () => onSelect(block.id),

      style: { 
        minHeight: block.id === 'title' ? '60px' : '24px',
        wordBreak: 'break-word' as const,
        whiteSpace: 'pre-wrap' as const,
        outline: 'none',
        border: 'none',
        boxShadow: 'none',
        background: 'transparent'
      }
    }

    switch (block.type) {
      case 'bulletList':
        return (
          <div className="flex items-start gap-2">
            <span className="text-[#37352F] dark:text-gray-100 mt-0 select-none flex-shrink-0 leading-[1.5] flex items-center h-6">•</span>
            <div className="flex-1 relative">
            <div {...commonProps} />
              {/* Placeholder para listas con viñetas vacías */}
              {!block.content && isSelected && (
                <div 
                  className="absolute inset-0 pointer-events-none text-[#C7C7C5] dark:text-gray-500 text-[16px] leading-[1.5]"
                  style={{ top: 0, left: 0 }}
                >
                  Write a list item...
                </div>
              )}
            </div>
          </div>
        )
      
      case 'numberedList':
        // Calcular el número de la lista basado en listas numeradas consecutivas
        const getListNumber = () => {
          let listNumber = 1
          
          // Buscar hacia atrás para contar cuántas listas numeradas consecutivas hay antes de esta
          for (let i = index - 1; i >= 0; i--) {
            const prevBlock = allBlocks?.[i]
            if (prevBlock?.type === 'numberedList') {
              listNumber++
            } else {
              // Si encontramos un bloque que no es lista numerada, paramos
              break
            }
          }
          
          return listNumber
        }
        
        return (
          <div className="flex items-start gap-2">
            <span className="text-[#37352F] dark:text-gray-100 mt-0 select-none flex-shrink-0 leading-[1.5] flex items-center h-6">{getListNumber()}.</span>
            <div className="flex-1 relative">
            <div {...commonProps} />
              {/* Placeholder para listas numeradas vacías */}
              {!block.content && isSelected && (
                <div 
                  className="absolute inset-0 pointer-events-none text-[#C7C7C5] dark:text-gray-500 text-[16px] leading-[1.5]"
                  style={{ top: 0, left: 0 }}
                >
                  Write a list item...
                </div>
              )}
            </div>
          </div>
        )
      
      case 'todo':
        return (
          <div className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <input
                type="checkbox"
                checked={block.completed || false}
                onChange={(e) => onToggleComplete(block.id, e.target.checked)}
                className="sr-only"
              />
              <div
                onClick={() => onToggleComplete(block.id, !block.completed)}
                className={cn(
                  "w-4 h-4 border-2 transition-all duration-200 cursor-pointer flex items-center justify-center",
                  block.completed 
                    ? "bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700" 
                    : "border-gray-400 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {block.completed && (
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1 relative">
              <div 
                {...commonProps} 
                className={cn(commonProps.className, "flex-1", {
                  'line-through opacity-50 text-gray-500 dark:text-gray-400': block.completed
                })}
              />
              {/* Placeholder para tareas vacías */}
              {!block.content && (
                <div 
                  className="absolute inset-0 pointer-events-none text-gray-400 dark:text-gray-500 text-[16px] leading-[1.5]"
                  style={{ top: 0, left: 0 }}
                >
                  Write a task...
                </div>
              )}
            </div>
          </div>
        )
      
      case 'quote':
        return (
          <div className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
            <div {...commonProps} className={cn(commonProps.className, "italic text-[#4B5563] dark:text-gray-300")} />
          </div>
        )
      
      case 'divider':
        return (
          <div 
            className={cn(
              "w-full py-2 cursor-pointer rounded-md transition-all duration-200 group",
              "hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
            )}
            onClick={handleClick}
            onFocus={() => onSelect(block.id)}
            onKeyDown={(e) => {
              if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault()
                onDelete(block.id)
              } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onAddBlock(block.id, 'paragraph')
              } else {
                onKeyDown(e, block.id, index)
              }
            }}
            tabIndex={0}
          >
            {/* Línea principal del divisor */}
            <div className="relative flex items-center justify-center">
              <div className={cn(
                "w-full h-px transition-all duration-200 divider-line",
                "bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent group-hover:via-gray-400 dark:group-hover:via-gray-500"
              )}></div>
              

              
              {/* Texto de ayuda cuando está seleccionado */}
              {isSelected && (
                <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <kbd className="bg-gray-700 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">Delete</kbd>
                      <span>delete</span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <kbd className="bg-gray-700 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">Enter</kbd>
                      <span>new block</span>
                    </div>
                    {/* Flecha hacia arriba */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-800"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'table':
        return <TableEditor 
        block={block} 
        onUpdate={(id, content, htmlContent) => onUpdate(id, content, htmlContent)} 
        isSelected={isSelected}
        onAddBlock={onAddBlock}
        onSelect={onSelect}
      />
      
      case 'math':
        return <MathEditor 
        block={block} 
        onUpdate={(id, content, htmlContent) => onUpdate(id, content, htmlContent)} 
        isSelected={isSelected}
        onAddBlock={onAddBlock}
        onSelect={onSelect}
      />
      
      case 'code':
        return (
          <div className="code-block group/code-block relative" style={{ 
            width: '100%', 
            marginTop: '8px', 
            marginBottom: '8px' 
          }}>
            {/* Contenedor principal del código */}
            <div className="relative bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Header con controles */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {/* Selector de lenguaje personalizado */}
                <LanguageSelector 
                  value={block.codeLanguage || 'javascript'}
                  onChange={(newLanguage: string) => {
                    // Actualizar el lenguaje del bloque y forzar re-render
                    block.codeLanguage = newLanguage
                    onUpdate(block.id, block.content || '', block.htmlContent || '')
                    
                    // Forzar actualización del componente
                    setTimeout(() => {
                      const codeContainer = document.querySelector(`[data-block-id="${block.id}"] .relative.p-4`)
                      if (codeContainer) {
                        // Trigger re-render forzando un cambio en el DOM
                        codeContainer.setAttribute('data-language', newLanguage)
                      }
                    }, 0)
                  }}
                />

                {/* Botón copiar */}
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(block.content || '')
                      // Feedback visual temporal
                      const button = document.activeElement as HTMLButtonElement
                      if (button) {
                        const originalText = button.textContent
                        button.textContent = '✓ Copiado'
                        button.classList.add('text-green-600')
                        setTimeout(() => {
                          button.textContent = originalText
                          button.classList.remove('text-green-600')
                        }, 1500)
                      }
                    } catch (err) {
                      console.error('Error al copiar:', err)
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copiar
                </button>
              </div>

              {/* Área de código con resaltado de sintaxis */}
              <div className="relative p-4">
                {/* Capa de resaltado de sintaxis */}
                <div 
                  className="absolute inset-4 pointer-events-none overflow-hidden"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    zIndex: 1
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(block.content || '', block.codeLanguage || 'javascript')
                  }}
                />
                
                {/* Textarea transparente para edición */}
                <textarea
                  ref={textareaRef}
                  value={block.content || ''}
                  className={cn(
                    "relative w-full outline-none border-none focus:outline-none focus:ring-0 resize-none overflow-hidden bg-transparent",
                    "font-mono text-sm text-transparent caret-gray-800 dark:caret-gray-200"
                  )}
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    minHeight: '100px',
                    height: 'auto',
                    tabSize: 2,
                    padding: 0,
                    margin: 0,
                    zIndex: 2,
                    color: 'transparent',
                    caretColor: 'inherit'
                  }}
                  onChange={(e) => {
                    const newContent = e.target.value
                    onUpdate(block.id, newContent, newContent)
                    
                    // Auto-resize del textarea
                    const textarea = e.target as HTMLTextAreaElement
                    textarea.style.height = 'auto'
                    textarea.style.height = Math.max(textarea.scrollHeight, 100) + 'px'
                  }}
                  onKeyDown={(e) => {
                    // Para Escape, salir del bloque de código
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      const newBlockId = onAddBlock(block.id, 'paragraph')
                      setTimeout(() => {
                        const newBlockElement = document.querySelector(`[data-block-id="${newBlockId}"] [contenteditable]`) as HTMLElement
                        if (newBlockElement) {
                          newBlockElement.focus()
                        }
                      }, 10)
                      return
                    }
                    
                    // Para Tab, insertar espacios
                    if (e.key === 'Tab') {
                      e.preventDefault()
                      const textarea = e.target as HTMLTextAreaElement
                      const start = textarea.selectionStart
                      const end = textarea.selectionEnd
                      const newValue = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end)
                      onUpdate(block.id, newValue, newValue)
                      
                      // Restaurar posición del cursor
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 2
                      }, 0)
                      return
                    }
                  }}
                  onScroll={(e) => {
                    // Sincronizar scroll entre textarea y capa de resaltado
                    const target = e.target as HTMLTextAreaElement
                    const highlightLayer = target.previousElementSibling as HTMLElement
                    if (highlightLayer) {
                      highlightLayer.scrollTop = target.scrollTop
                      highlightLayer.scrollLeft = target.scrollLeft
                    }
                  }}
                  onClick={handleClick}
                  onFocus={() => onSelect(block.id)}
                  placeholder={!block.content && isSelected ? "// Escribe tu código aquí..." : ""}
                  spellCheck={false}
                />
                
                {/* Placeholder visible cuando no hay contenido */}
                {!block.content && isSelected && (
                  <div 
                    className="absolute inset-4 pointer-events-none text-gray-400 dark:text-gray-500"
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      zIndex: 0
                    }}
                  >
                    // Escribe tu código aquí...
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="relative">
            <div {...commonProps} />
            {/* Placeholder manual para el título */}
            {block.id === 'title' && !block.content && (
              <div 
                className="absolute inset-0 pointer-events-none text-[#A0A09D] dark:text-gray-500 font-bold text-[40px] leading-[1.2]"
                style={{ top: 0, left: 0 }}
              >
                Untitled
              </div>
            )}
            {/* Placeholders para otros bloques cuando están activos */}
            {block.id !== 'title' && !block.content && isSelected && (
              <div 
                className={cn(
                  "absolute inset-0 pointer-events-none text-[#C7C7C5] dark:text-gray-500",
                  block.type === 'heading1' ? "text-[30px] font-bold leading-[1.3]" :
                  block.type === 'heading2' ? "text-[24px] font-semibold leading-[1.3]" :
                  block.type === 'heading3' ? "text-[20px] font-semibold leading-[1.3]" :
                  hasMathFormat() ? "text-[1.1em] font-normal" :
                  "text-[16px] leading-[1.5]"
                )}
                style={{ 
                  top: 0, 
                  left: '0',
                  fontFamily: hasMathFormat() ? 'KaTeX_Math, "Times New Roman", serif' : undefined
                }}
              >
                {getPlaceholder()}
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div 
      ref={blockRef}
      className={cn(
        "group relative flex items-start w-full py-0 cursor-text transition-all duration-200",
        // Agregar estilo sutil cuando el menú plus está abierto para este bloque (sin bordes azules)
        plusMenuBlockId === block.id && "bg-gray-50/50 dark:bg-gray-800/30",
        // Estilos para drag and drop (removidas las líneas CSS para evitar duplicación)
        isDragging && "opacity-50",
        // Estilos para preview de columnas
        isDragOver && showColumnPreview && "relative overflow-hidden"
      )}
      style={{
        marginLeft: `${(block.indent || 0) * 32}px` // 32px por cada nivel de indentación
      }}
      data-block-id={block.id}
      onMouseDown={(e) => {
        // Si el click fue en el espacio vacío, enfocar el contenido
        if (e.target === e.currentTarget || e.target === blockRef.current) {
          e.preventDefault()
          onSelect(block.id)
          
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.focus()
              
              // Posicionar cursor al final
              const selection = window.getSelection()
              const range = document.createRange()
              range.selectNodeContents(contentRef.current)
              range.collapse(false)
              selection?.removeAllRanges()
              selection?.addRange(range)
            }
          }, 0)
        }
      }}
      // Eventos de drag and drop
      onDragOver={onDragOver ? (e) => onDragOver(e, block.id) : undefined}
      onDragLeave={onDragLeave}
      onDrop={onDrop ? (e) => onDrop(e, block.id) : undefined}
    >
      {/* Indicador visual de inserción durante drag and drop */}
      {isDragOver && !showColumnPreview && dragPosition === 'top' && (
        <div className="absolute -top-2 left-0 right-0 z-20 flex items-center justify-center">
          <div className="relative w-full">
            {/* Línea principal con gradiente mejorado */}
            <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 dark:via-blue-400 to-transparent rounded-full shadow-md">
              {/* Efecto de resplandor sutil */}
              <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 dark:via-blue-300/30 to-transparent rounded-full blur-sm"></div>
            </div>
            
            {/* Indicadores circulares en los extremos */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm animate-pulse"></div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm animate-pulse"></div>
          </div>
        </div>
      )}
      {isDragOver && !showColumnPreview && dragPosition === 'bottom' && (
        <div className="absolute -bottom-2 left-0 right-0 z-20 flex items-center justify-center">
          <div className="relative w-full">
            {/* Línea principal con gradiente mejorado */}
            <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 dark:via-blue-400 to-transparent rounded-full shadow-md">
              {/* Efecto de resplandor sutil */}
              <div className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 dark:via-blue-300/30 to-transparent rounded-full blur-sm"></div>
            </div>
            
            {/* Indicadores circulares en los extremos */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm animate-pulse"></div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm animate-pulse"></div>
          </div>
        </div>
      )}
      
      {/* Indicadores visuales para columnas */}
      {isDragOver && showColumnPreview && dragColumnPosition === 'left' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Preview de columna izquierda */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500/20 dark:bg-blue-400/20 border-2 border-blue-500 dark:border-blue-400 border-dashed rounded-l-lg animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-500 dark:bg-blue-400 text-white text-xs px-2 py-1 rounded font-medium">
                Left Column
              </div>
            </div>
          </div>
          {/* Preview de columna derecha (bloque actual) */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gray-300/20 dark:bg-gray-600/20 border-2 border-gray-400 dark:border-gray-500 border-dashed rounded-r-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-500 dark:bg-gray-400 text-white text-xs px-2 py-1 rounded font-medium">
                Right Column
              </div>
            </div>
          </div>
        </div>
      )}
      {isDragOver && showColumnPreview && dragColumnPosition === 'right' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Preview de columna izquierda (bloque actual) */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-300/20 dark:bg-gray-600/20 border-2 border-gray-400 dark:border-gray-500 border-dashed rounded-l-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-500 dark:bg-gray-400 text-white text-xs px-2 py-1 rounded font-medium">
                Left Column
              </div>
            </div>
          </div>
          {/* Preview de columna derecha */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-blue-500/20 dark:bg-blue-400/20 border-2 border-blue-500 dark:border-blue-400 border-dashed rounded-r-lg animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-500 dark:bg-blue-400 text-white text-xs px-2 py-1 rounded font-medium">
                Right Column
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Indicador para sacar bloque de columnas */}
      {isDragOver && canExitColumn && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-green-500/20 dark:bg-green-400/20 border-2 border-green-500 dark:border-green-400 border-dashed rounded-lg animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-green-500 dark:bg-green-400 text-white text-xs px-3 py-1 rounded font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11H16a1 1 0 110 2H2.586l3.707 3.707a1 1 0 01-1.414 1.414l-5.414-5.414a1 1 0 010-1.414l5.414-5.414a1 1 0 011.414 1.414L2.586 9H16a1 1 0 110 2H7.707z" clipRule="evenodd" />
                </svg>
                Move out of column
              </div>
            </div>
          </div>
        </div>
      )}

            {/* Controles del bloque estilo Notion - solo para bloques que no son título */}
      {block.id !== 'title' && (
        <div className="absolute -left-14 top-0.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
          <div className="relative group/plus">
            <button
              className="w-6 h-6 p-0 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpenPlusMenu?.(block.id, e)
              }}
            >
              <Plus className="w-4 h-4 text-[#A2A2A0] dark:text-gray-400" />
            </button>
            
            {/* Tooltip para el botón plus */}
            <div className="absolute -bottom-[120px] left-1/2 transform -translate-x-1/2 z-[10000] opacity-0 group-hover/plus:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-black/90 dark:bg-black/95 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-white/10 min-w-[260px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 font-medium">Click</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white font-medium">Open block menu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <kbd className="bg-white/20 text-white px-2 py-1 rounded-md text-xs font-mono shadow-sm">Alt</kbd>
                      <span className="text-white/70">+</span>
                      <span className="text-white/70 font-medium">Click</span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-white font-medium">Add above</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <kbd className="bg-white/20 text-white px-2 py-1 rounded-md text-xs font-mono shadow-sm">Ctrl</kbd>
                      <span className="text-white/70">+</span>
                      <span className="text-white/70 font-medium">Click</span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-white font-medium">Add below</span>
                  </div>
                </div>
                {/* Flecha hacia arriba mejorada */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-black/90 dark:border-b-black/95"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group/drag">
            <button
              className="drag-handle w-6 h-6 p-0 rounded cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              draggable={true}
              onDragStart={onDragStart ? (e) => onDragStart(e, block.id) : undefined}
              onDragEnd={onDragEnd}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <svg 
                viewBox="0 0 10 10" 
                className="w-3 h-3 text-[#A2A2A0] dark:text-gray-400 pointer-events-none"
              >
                <path fill="currentColor" d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path>
              </svg>
            </button>
            
            {/* Tooltip para el drag handle */}
            <div className="absolute -bottom-[105px] left-1/2 transform -translate-x-1/2 z-[10000] opacity-0 group-hover/drag:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-black/90 dark:bg-black/95 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-white/10 min-w-[260px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 font-medium">Drag</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white font-medium">Reorder blocks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 font-medium">Drag to edges</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white font-medium">Create columns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 font-medium">Click</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white font-medium">Select block</span>
                  </div>
                </div>
                {/* Flecha hacia arriba mejorada */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-black/90 dark:border-b-black/95"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenido del bloque */}
      <div className="flex-1 min-w-0 pl-2">
        {renderContent()}
      </div>
    </div>
  )
}

// CSS para estilos básicos
const basicStyles = `
  <style>
    /* Estilos para resaltado de sintaxis */
    .syntax-keyword {
      color: #0066cc !important;
      font-weight: 600 !important;
    }
    
    .syntax-string {
      color: #22c55e !important;
    }
    
    .syntax-number {
      color: #f59e0b !important;
    }
    
    .syntax-boolean {
      color: #8b5cf6 !important;
      font-weight: 600 !important;
    }
    
    .syntax-comment {
      color: #6b7280 !important;
      font-style: italic !important;
    }
    
    .syntax-type {
      color: #06b6d4 !important;
      font-weight: 500 !important;
    }
    
    .syntax-template {
      color: #f97316 !important;
      background-color: rgba(249, 115, 22, 0.1) !important;
      padding: 1px 2px !important;
      border-radius: 2px !important;
    }
    
    .syntax-tag {
      color: #dc2626 !important;
      font-weight: 600 !important;
    }
    
    .syntax-attribute {
      color: #7c3aed !important;
    }
    
    .syntax-entity {
      color: #059669 !important;
    }
    
    .syntax-selector {
      color: #0891b2 !important;
      font-weight: 600 !important;
    }
    
    .syntax-property {
      color: #be185d !important;
    }
    
    .syntax-color {
      color: #dc2626 !important;
      font-weight: 600 !important;
    }
    
    /* Nuevos estilos para elementos adicionales */
    .syntax-builtin {
      color: #e11d48 !important;
      font-weight: 500 !important;
    }
    
    .syntax-function {
      color: #7c3aed !important;
      font-weight: 500 !important;
    }
    
    .syntax-punctuation {
      color: #64748b !important;
    }
    
    .syntax-operator {
      color: #0891b2 !important;
      font-weight: 500 !important;
    }
    
    .syntax-regex {
      color: #dc2626 !important;
      background-color: rgba(220, 38, 38, 0.1) !important;
      padding: 1px 2px !important;
      border-radius: 2px !important;
    }
    
    .syntax-variable {
      color: #059669 !important;
      font-weight: 500 !important;
    }
    
    .syntax-fstring {
      color: #10b981 !important;
      background-color: rgba(16, 185, 129, 0.1) !important;
      padding: 1px 2px !important;
      border-radius: 2px !important;
    }
    
    .syntax-decorator {
      color: #f59e0b !important;
      font-weight: 500 !important;
    }
    
    .syntax-char {
      color: #84cc16 !important;
    }
    
    .syntax-preprocessor {
      color: #8b5cf6 !important;
      font-weight: 600 !important;
    }
    
    .syntax-annotation {
      color: #f59e0b !important;
      font-weight: 500 !important;
    }
    
    .syntax-heredoc {
      color: #22c55e !important;
      background-color: rgba(34, 197, 94, 0.1) !important;
      padding: 1px 2px !important;
      border-radius: 2px !important;
    }
    
    .syntax-symbol {
      color: #ec4899 !important;
      font-weight: 500 !important;
    }
    
    .syntax-attribute {
      color: #a855f7 !important;
    }
    
    .syntax-macro {
      color: #f97316 !important;
      font-weight: 600 !important;
    }
    
    .syntax-doctype {
      color: #6366f1 !important;
      font-weight: 600 !important;
    }
    
    .syntax-at-rule {
      color: #8b5cf6 !important;
      font-weight: 600 !important;
    }
    
    .syntax-value {
      color: #0891b2 !important;
    }
    
    .syntax-key {
      color: #dc2626 !important;
      font-weight: 500 !important;
    }
    
    .syntax-list-marker {
      color: #6366f1 !important;
      font-weight: 600 !important;
    }
    
    .syntax-block-scalar {
      color: #8b5cf6 !important;
      font-weight: 600 !important;
    }
    
    .syntax-processing-instruction {
      color: #f59e0b !important;
      background-color: rgba(245, 158, 11, 0.1) !important;
      padding: 1px 2px !important;
      border-radius: 2px !important;
    }
    
    .syntax-heading {
      color: #1e40af !important;
      font-weight: 700 !important;
    }
    
    .syntax-link {
      color: #2563eb !important;
      text-decoration: underline !important;
    }
    
    .syntax-image {
      color: #059669 !important;
      font-weight: 500 !important;
    }
    
    .syntax-bold {
      font-weight: 700 !important;
    }
    
    .syntax-italic {
      font-style: italic !important;
    }
    
    .syntax-strikethrough {
      text-decoration: line-through !important;
    }
    
    .syntax-blockquote {
      color: #6b7280 !important;
      font-style: italic !important;
    }
    
    .syntax-code {
      color: #dc2626 !important;
      background-color: rgba(220, 38, 38, 0.1) !important;
      padding: 1px 3px !important;
      border-radius: 3px !important;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
      font-size: 0.9em !important;
    }
    
    /* Modo oscuro para resaltado de sintaxis */
    @media (prefers-color-scheme: dark) {
      .syntax-keyword {
        color: #60a5fa !important;
      }
      
      .syntax-string {
        color: #34d399 !important;
      }
      
      .syntax-number {
        color: #fbbf24 !important;
      }
      
      .syntax-boolean {
        color: #a78bfa !important;
      }
      
      .syntax-comment {
        color: #9ca3af !important;
      }
      
      .syntax-type {
        color: #22d3ee !important;
      }
      
      .syntax-template {
        color: #fb923c !important;
        background-color: rgba(251, 146, 60, 0.1) !important;
      }
      
      .syntax-tag {
        color: #f87171 !important;
      }
      
      .syntax-attribute {
        color: #c084fc !important;
      }
      
      .syntax-entity {
        color: #10b981 !important;
      }
      
      .syntax-selector {
        color: #06b6d4 !important;
      }
      
      .syntax-property {
        color: #f472b6 !important;
      }
      
      .syntax-color {
        color: #f87171 !important;
      }
      
      /* Nuevos estilos para modo oscuro */
      .syntax-builtin {
        color: #fb7185 !important;
      }
      
      .syntax-function {
        color: #c084fc !important;
      }
      
      .syntax-punctuation {
        color: #94a3b8 !important;
      }
      
      .syntax-operator {
        color: #22d3ee !important;
      }
      
      .syntax-regex {
        color: #f87171 !important;
        background-color: rgba(248, 113, 113, 0.15) !important;
      }
      
      .syntax-variable {
        color: #10b981 !important;
      }
      
      .syntax-fstring {
        color: #34d399 !important;
        background-color: rgba(52, 211, 153, 0.15) !important;
      }
      
      .syntax-decorator {
        color: #fbbf24 !important;
      }
      
      .syntax-char {
        color: #a3e635 !important;
      }
      
      .syntax-preprocessor {
        color: #a78bfa !important;
      }
      
      .syntax-annotation {
        color: #fbbf24 !important;
      }
      
      .syntax-heredoc {
        color: #34d399 !important;
        background-color: rgba(52, 211, 153, 0.15) !important;
      }
      
      .syntax-symbol {
        color: #f472b6 !important;
      }
      
      .syntax-macro {
        color: #fb923c !important;
      }
      
      .syntax-doctype {
        color: #818cf8 !important;
      }
      
      .syntax-at-rule {
        color: #a78bfa !important;
      }
      
      .syntax-value {
        color: #22d3ee !important;
      }
      
      .syntax-key {
        color: #f87171 !important;
      }
      
      .syntax-list-marker {
        color: #818cf8 !important;
      }
      
      .syntax-block-scalar {
        color: #a78bfa !important;
      }
      
      .syntax-processing-instruction {
        color: #fbbf24 !important;
        background-color: rgba(251, 191, 36, 0.15) !important;
      }
      
      .syntax-heading {
        color: #60a5fa !important;
      }
      
      .syntax-link {
        color: #3b82f6 !important;
      }
      
      .syntax-image {
        color: #10b981 !important;
      }
      
      .syntax-blockquote {
        color: #9ca3af !important;
      }
      
      .syntax-code {
        color: #f87171 !important;
        background-color: rgba(248, 113, 113, 0.15) !important;
      }
    }
    
    /* Estilos específicos para dark mode en elementos del DOM */
    .dark .syntax-keyword {
      color: #60a5fa !important;
    }
    
    .dark .syntax-string {
      color: #34d399 !important;
    }
    
    .dark .syntax-number {
      color: #fbbf24 !important;
    }
    
    .dark .syntax-boolean {
      color: #a78bfa !important;
    }
    
    .dark .syntax-comment {
      color: #9ca3af !important;
    }
    
    .dark .syntax-type {
      color: #22d3ee !important;
    }
    
    .dark .syntax-template {
      color: #fb923c !important;
      background-color: rgba(251, 146, 60, 0.1) !important;
    }
    
    .dark .syntax-tag {
      color: #f87171 !important;
    }
    
    .dark .syntax-attribute {
      color: #c084fc !important;
    }
    
    .dark .syntax-entity {
      color: #10b981 !important;
    }
    
    .dark .syntax-selector {
      color: #06b6d4 !important;
    }
    
    .dark .syntax-property {
      color: #f472b6 !important;
    }
    
    .dark .syntax-color {
      color: #f87171 !important;
    }
    
    /* Nuevos estilos dark mode específicos */
    .dark .syntax-builtin {
      color: #fb7185 !important;
    }
    
    .dark .syntax-function {
      color: #c084fc !important;
    }
    
    .dark .syntax-punctuation {
      color: #94a3b8 !important;
    }
    
    .dark .syntax-operator {
      color: #22d3ee !important;
    }
    
    .dark .syntax-regex {
      color: #f87171 !important;
      background-color: rgba(248, 113, 113, 0.15) !important;
    }
    
    .dark .syntax-variable {
      color: #10b981 !important;
    }
    
    .dark .syntax-fstring {
      color: #34d399 !important;
      background-color: rgba(52, 211, 153, 0.15) !important;
    }
    
    .dark .syntax-decorator {
      color: #fbbf24 !important;
    }
    
    .dark .syntax-char {
      color: #a3e635 !important;
    }
    
    .dark .syntax-preprocessor {
      color: #a78bfa !important;
    }
    
    .dark .syntax-annotation {
      color: #fbbf24 !important;
    }
    
    .dark .syntax-heredoc {
      color: #34d399 !important;
      background-color: rgba(52, 211, 153, 0.15) !important;
    }
    
    .dark .syntax-symbol {
      color: #f472b6 !important;
    }
    
    .dark .syntax-macro {
      color: #fb923c !important;
    }
    
    .dark .syntax-doctype {
      color: #818cf8 !important;
    }
    
    .dark .syntax-at-rule {
      color: #a78bfa !important;
    }
    
    .dark .syntax-value {
      color: #22d3ee !important;
    }
    
    .dark .syntax-key {
      color: #f87171 !important;
    }
    
    .dark .syntax-list-marker {
      color: #818cf8 !important;
    }
    
    .dark .syntax-block-scalar {
      color: #a78bfa !important;
    }
    
    .dark .syntax-processing-instruction {
      color: #fbbf24 !important;
      background-color: rgba(251, 191, 36, 0.15) !important;
    }
    
    .dark .syntax-heading {
      color: #60a5fa !important;
    }
    
    .dark .syntax-link {
      color: #3b82f6 !important;
    }
    
    .dark .syntax-image {
      color: #10b981 !important;
    }
    
    .dark .syntax-blockquote {
      color: #9ca3af !important;
    }
    
    .dark .syntax-code {
      color: #f87171 !important;
      background-color: rgba(248, 113, 113, 0.15) !important;
    }
    /* Estilo de selección como Notion */
    ::selection {
      background-color: #1D4ED8 !important;
      color: white !important;
    }
    
    /* Dark mode selection */
    @media (prefers-color-scheme: dark) {
      ::selection {
        background-color: #1E40AF !important;
        color: white !important;
      }
    }
    
    /* Forzar que los elementos con formato mantengan el color de selección */
    *::selection {
      background-color: #1D4ED8 !important;
      color: white !important;
    }
    
    @media (prefers-color-scheme: dark) {
      *::selection {
        background-color: #1E40AF !important;
        color: white !important;
      }
    }
    
    /* Estilos mejorados para código inline */
    span[style*="ui-monospace"], 
    span[style*="SFMono-Regular"],
    span[style*="monospace"] {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
      background-color: #F8FAFC !important;
      color: #E11D48 !important;
      padding: 3px 8px !important;
      border-radius: 6px !important;
      font-size: 0.85em !important;
      font-weight: 600 !important;
      border: 1px solid #E2E8F0 !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
      line-height: 1.2 !important;
      vertical-align: baseline !important;
      white-space: nowrap !important;
      transition: all 0.15s ease-in-out !important;
      display: inline-block !important;
      position: relative !important;
    }
    
    /* Efecto hover para código inline */
    span[style*="ui-monospace"]:hover, 
    span[style*="SFMono-Regular"]:hover,
    span[style*="monospace"]:hover {
      background-color: #F1F5F9 !important;
      border-color: #CBD5E1 !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      transform: translateY(-1px) !important;
    }
    
    /* Modo oscuro para código inline */
    @media (prefers-color-scheme: dark) {
      span[style*="ui-monospace"], 
      span[style*="SFMono-Regular"],
      span[style*="monospace"] {
        background-color: #0F172A !important;
        color: #60A5FA !important;
        border: 1px solid #1E293B !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05) !important;
      }
      
      span[style*="ui-monospace"]:hover, 
      span[style*="SFMono-Regular"]:hover,
      span[style*="monospace"]:hover {
        background-color: #1E293B !important;
        color: #93C5FD !important;
        border-color: #334155 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1) !important;
        transform: translateY(-1px) !important;
      }
    }
    
    /* Estilos específicos para dark mode en elementos del DOM */
    .dark span[style*="ui-monospace"], 
    .dark span[style*="SFMono-Regular"],
    .dark span[style*="monospace"],
    [data-theme="dark"] span[style*="ui-monospace"], 
    [data-theme="dark"] span[style*="SFMono-Regular"],
    [data-theme="dark"] span[style*="monospace"] {
      background-color: #0F172A !important;
      color: #60A5FA !important;
      border: 1px solid #1E293B !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05) !important;
    }
    
    .dark span[style*="ui-monospace"]:hover, 
    .dark span[style*="SFMono-Regular"]:hover,
    .dark span[style*="monospace"]:hover,
    [data-theme="dark"] span[style*="ui-monospace"]:hover, 
    [data-theme="dark"] span[style*="SFMono-Regular"]:hover,
    [data-theme="dark"] span[style*="monospace"]:hover {
      background-color: #1E293B !important;
      color: #93C5FD !important;
      border-color: #334155 !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1) !important;
      transform: translateY(-1px) !important;
    }

    /* Específicamente para elementos con formato */
    b::selection, strong::selection,
    i::selection, em::selection,
    u::selection,
    s::selection, del::selection, strike::selection,
    code::selection,
    span[style*="font-weight"]::selection,
    span[style*="font-style"]::selection,
    span[style*="text-decoration"]::selection,
    span[style*="monospace"]::selection,
    span[style*="ui-monospace"]::selection {
      background-color: #1D4ED8 !important;
      color: white !important;
    }
    
    @media (prefers-color-scheme: dark) {
      b::selection, strong::selection,
      i::selection, em::selection,
      u::selection,
      s::selection, del::selection, strike::selection,
      code::selection,
      span[style*="font-weight"]::selection,
      span[style*="font-style"]::selection,
      span[style*="text-decoration"]::selection,
      span[style*="monospace"]::selection {
        background-color: #1E40AF !important;
        color: white !important;
      }
    }
    
    /* Cursor visible y estable */
    [contenteditable] {
      caret-color: #37352F !important;
      cursor: text !important;
    }
    
    /* Dark mode cursor - más específico y forzado */
    @media (prefers-color-scheme: dark) {
      [contenteditable] {
        caret-color: #60a5fa !important;
      }
      
      .dark [contenteditable] {
        caret-color: #60a5fa !important;
      }
      
      [data-theme="dark"] [contenteditable] {
        caret-color: #60a5fa !important;
      }
      
      body[style*="color-scheme: dark"] [contenteditable] {
        caret-color: #60a5fa !important;
      }
      
      html[class*="dark"] [contenteditable] {
        caret-color: #60a5fa !important;
      }
    }
    
    /* Forzar cursor azul en todos los elementos contenteditable en dark mode */
    .block-editor-container [contenteditable] {
      caret-color: #37352F;
    }
    
    @media (prefers-color-scheme: dark) {
      .block-editor-container [contenteditable] {
        caret-color: #60a5fa !important;
      }
    }
    
    /* Asegurar que el cursor sea visible cuando está enfocado */
    [contenteditable]:focus {
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
      caret-color: #37352F !important;
    }
    
    /* Dark mode focus - más específico */
    @media (prefers-color-scheme: dark) {
      [contenteditable]:focus {
        caret-color: #ffffff !important;
      }
      
      .dark [contenteditable]:focus {
        caret-color: #ffffff !important;
      }
      
      [data-theme="dark"] [contenteditable]:focus {
        caret-color: #ffffff !important;
      }
    }
    
    /* Quitar outline en divs pero mantener cursor */
    div:focus {
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
    }
    
    /* Evitar que se pierda el focus */
    [contenteditable]:focus-visible {
      outline: none !important;
    }
    
    /* Animaciones suaves para el divisor */
    @keyframes divider-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    /* Efecto hover mejorado para el divisor */
    .divider-line {
      position: relative;
      overflow: hidden;
    }
    
    .divider-line::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    .divider-line:hover::before {
      left: 100%;
    }
    
    /* Dark mode divider effect */
    @media (prefers-color-scheme: dark) {
      .divider-line::before {
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
      }
    }
    
    /* Drag and drop styles */
    .dragging {
      opacity: 0.5 !important;
      transform: rotate(2deg) scale(1.02);
      transition: all 0.2s ease;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }
    
    .drag-over-top {
      border-top: 2px solid #3B82F6 !important;
      border-radius: 4px 4px 0 0;
    }
    
    .drag-over-bottom {
      border-bottom: 2px solid #3B82F6 !important;
      border-radius: 0 0 4px 4px;
    }
    
    /* Hover effect for drag handle */
    .drag-handle:hover {
      background-color: rgba(55, 53, 47, 0.08);
    }
    
    @media (prefers-color-scheme: dark) {
      .drag-handle:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      .drag-over-top,
      .drag-over-bottom {
        border-color: #60A5FA !important;
      }
    }
    
    /* Smooth transitions for drag states */
    [data-block-id] {
      transition: opacity 0.2s ease, border-color 0.15s ease;
    }
    
    /* Cursor states */
    .cursor-grabbing * {
      cursor: grabbing !important;
    }
    
    /* Indentation styles */
    .block-indented {
      position: relative;
    }
    
    .block-indented::before {
      content: '';
      position: absolute;
      left: -16px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(55, 53, 47, 0.1);
    }
    
    @media (prefers-color-scheme: dark) {
      .block-indented::before {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    
    /* Hover effect for indented blocks */
    .block-indented:hover::before {
      background: rgba(59, 130, 246, 0.3);
    }
    
    /* Visual guides for drag indentation */
    .indent-guide {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(59, 130, 246, 0.3);
      pointer-events: none;
    }
    
    /* Column layout styles */
    .column-container {
      display: flex;
      margin: 8px 0;
      position: relative;
      transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .column-block {
      min-width: 0;
      transition: width 0.05s ease-out;
    }
    
    .column-container.resizing .column-block {
      transition: none !important;
    }
    
    /* Column resizer */
    .column-resizer {
      width: 12px;
      cursor: col-resize;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      margin: 0 10px; /* 32px gap total (12px + 10px + 10px) */
      min-height: 20px;
      z-index: 10;
    }
    
    .column-resizer::before {
      content: '';
      position: absolute;
      width: 1px;
      height: 100%;
      background: rgba(55, 53, 47, 0.2);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      left: 50%;
      transform: translateX(-50%);
    }
    
    .column-resizer:hover::before {
      background: rgba(55, 53, 47, 0.4);
      width: 3px;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .column-resizer.resizing::before {
      background: #2383e2;
      width: 3px;
      transition: background 0.1s ease;
    }
    
    .column-resizer:hover {
      background: rgba(55, 53, 47, 0.05);
      border-radius: 4px;
      transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .column-resizer.resizing:hover {
      background: rgba(35, 131, 226, 0.1);
    }
    
    @media (prefers-color-scheme: dark) {
      .column-resizer::before {
        background: rgba(255, 255, 255, 0.16);
      }
      
      .column-resizer:hover::before {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .column-resizer.resizing::before {
        background: #529cca;
      }
    }
    
    /* Column preview animations */
    .column-preview {
      animation: columnPreview 0.3s ease-in-out;
    }
    
    @keyframes columnPreview {
      0% {
        opacity: 0;
        transform: scale(0.95);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    

    
    /* Column drag indicators */
    .column-drop-left {
      border-left: 3px solid #3B82F6 !important;
      background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent) !important;
    }
    
    .column-drop-right {
      border-right: 3px solid #3B82F6 !important;
      background: linear-gradient(to left, rgba(59, 130, 246, 0.1), transparent) !important;
    }
    
    @media (prefers-color-scheme: dark) {
      .column-drop-left {
        border-left-color: #60A5FA !important;
        background: linear-gradient(to right, rgba(96, 165, 250, 0.1), transparent) !important;
      }
      
      .column-drop-right {
        border-right-color: #60A5FA !important;
        background: linear-gradient(to left, rgba(96, 165, 250, 0.1), transparent) !important;
      }
    }

    /* Estilos para KaTeX */
    .katex-math {
      display: inline-block !important;
      margin: 0 2px !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
      user-select: all !important;
      vertical-align: baseline !important;
      position: relative !important;
      border: 1px solid transparent !important;
    }
    
    .katex-math:hover {
      background-color: rgba(59, 130, 246, 0.1) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2) !important;
    }
    
    .katex-math:focus,
    .katex-math[data-selected="true"] {
      background-color: rgba(59, 130, 246, 0.15) !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
      outline: none !important;
    }
    
    .katex-math[data-editing="true"] {
      background-color: rgba(255, 193, 7, 0.1) !important;
      border-color: rgba(255, 193, 7, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3) !important;
    }
    
    .katex-math .katex {
      font-size: 1.1em !important;
      line-height: 1.2 !important;
      display: inline-block !important;
    }
    
    .katex-math .katex .katex-html {
      color: inherit !important;
    }
    
    .katex-fallback {
      font-family: 'KaTeX_Math', 'Times New Roman', serif !important;
      font-size: 1.1em !important;
      font-style: normal !important;
      display: inline-block !important;
      margin: 0 2px !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
      user-select: all !important;
      vertical-align: baseline !important;
      position: relative !important;
      border: 1px solid transparent !important;
    }
    
    .katex-fallback:hover {
      background-color: rgba(59, 130, 246, 0.1) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2) !important;
    }
    
    .katex-fallback:focus,
    .katex-fallback[data-selected="true"] {
      background-color: rgba(59, 130, 246, 0.15) !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
      outline: none !important;
    }
    
    .katex-fallback[data-editing="true"] {
      background-color: rgba(255, 193, 7, 0.1) !important;
      border-color: rgba(255, 193, 7, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3) !important;
    }
    
    /* Asegurar que KaTeX se vea bien en modo oscuro */
    @media (prefers-color-scheme: dark) {
      .katex-math .katex .katex-html {
        color: #f9fafb !important;
      }
      
      .katex-math:hover {
        background-color: rgba(96, 165, 250, 0.1) !important;
        border-color: rgba(96, 165, 250, 0.3) !important;
        box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.2) !important;
      }
      
      .katex-math:focus,
      .katex-math[data-selected="true"] {
        background-color: rgba(96, 165, 250, 0.15) !important;
        border-color: rgba(96, 165, 250, 0.5) !important;
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3) !important;
      }
      
      .katex-fallback:hover {
        background-color: rgba(96, 165, 250, 0.1) !important;
        border-color: rgba(96, 165, 250, 0.3) !important;
        box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.2) !important;
      }
      
      .katex-fallback:focus,
      .katex-fallback[data-selected="true"] {
        background-color: rgba(96, 165, 250, 0.15) !important;
        border-color: rgba(96, 165, 250, 0.5) !important;
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3) !important;
      }
    }
    
    .dark .katex-math .katex .katex-html {
      color: #f9fafb !important;
    }
    
    .dark .katex-math:hover {
      background-color: rgba(96, 165, 250, 0.1) !important;
      border-color: rgba(96, 165, 250, 0.3) !important;
      box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.2) !important;
    }
    
    .dark .katex-math:focus,
    .dark .katex-math[data-selected="true"] {
      background-color: rgba(96, 165, 250, 0.15) !important;
      border-color: rgba(96, 165, 250, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3) !important;
    }
    
    .dark .katex-fallback:hover {
      background-color: rgba(96, 165, 250, 0.1) !important;
      border-color: rgba(96, 165, 250, 0.3) !important;
      box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.2) !important;
    }
    
    .dark .katex-fallback:focus,
    .dark .katex-fallback[data-selected="true"] {
      background-color: rgba(96, 165, 250, 0.15) !important;
      border-color: rgba(96, 165, 250, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3) !important;
    }
    
    /* Mejorar la selección de elementos KaTeX */
    .katex-math::selection {
      background-color: #1D4ED8 !important;
      color: white !important;
    }
    
    .katex-math .katex::selection {
      background-color: #1D4ED8 !important;
      color: white !important;
    }
    
    .katex-fallback::selection {
      background-color: #1D4ED8 !important;
      color: white !important;
    }
    
    /* Evitar problemas de selección con elementos internos de KaTeX */
    .katex-math * {
      user-select: none !important;
      pointer-events: none !important;
    }
    
    .katex-fallback * {
      user-select: none !important;
      pointer-events: none !important;
    }
    
    /* Estilos para scroll horizontal de tablas */
    .table-scroll {
      overflow-x: auto !important;
      overflow-y: visible !important;
      max-height: none !important;
      height: auto !important;
      padding-bottom: 25px !important;
      user-select: none; /* Prevenir selección de texto durante drag */
    }
    
    /* Estilos para selección múltiple de celdas */
    .table-cell-selected {
      background-color: rgba(59, 130, 246, 0.12) !important;
      border-color: rgba(75, 85, 99, 0.4) !important;
      position: relative;
      transition: border-color 0.1s ease;
    }
    
    /* Efecto hover para celdas cuando se mantiene Ctrl */
    .table-selecting-ctrl .table-cell-selected:hover {
      background-color: rgba(59, 130, 246, 0.18) !important;
      transform: scale(1.01);
    }
    
    .table-selecting-ctrl td:hover {
      background-color: rgba(59, 130, 246, 0.06) !important;
      transition: background-color 0.05s ease;
    }
    
    /* Feedback visual durante selección por arrastre */
    .table-selecting td {
      transition: background-color 0.02s ease !important;
    }
    
    .table-selecting .table-cell-selected {
      background-color: rgba(59, 130, 246, 0.15) !important;
    }
    
    /* Animación instantánea para nuevas selecciones */
    .table-cell-selected {
      animation: cellSelectPulse 0.1s ease-out;
    }
    
    @keyframes cellSelectPulse {
      0% {
        background-color: rgba(59, 130, 246, 0.08);
      }
      100% {
        background-color: rgba(59, 130, 246, 0.12);
      }
    }
    
    @media (prefers-color-scheme: dark) {
      .table-cell-selected {
        background-color: rgba(96, 165, 250, 0.15) !important;
        border-color: rgba(156, 163, 175, 0.4) !important;
      }
    }
    
    /* Cursor durante selección */
    .table-selecting {
      cursor: crosshair !important;
    }
    
    .table-selecting * {
      cursor: crosshair !important;
    }
    
    .table-scroll::-webkit-scrollbar {
      height: 3px; /* Súper fino */
    }
    
    .table-scroll::-webkit-scrollbar:horizontal {
      height: 3px;
      display: block;
    }
    
    .table-scroll::-webkit-scrollbar:vertical {
      width: 0px !important;
      display: none !important;
    }
    
    /* Eliminar botones de flecha completamente */
    .table-scroll::-webkit-scrollbar-button {
      display: none !important;
      width: 0px !important;
      height: 0px !important;
      background: transparent !important;
    }
    
    .table-scroll::-webkit-scrollbar-button:start:decrement {
      display: none !important;
      width: 0px !important;
    }
    
    .table-scroll::-webkit-scrollbar-button:end:increment {
      display: none !important;
      width: 0px !important;
    }
    
    .table-scroll::-webkit-scrollbar-button:horizontal:start:decrement {
      display: none !important;
    }
    
    .table-scroll::-webkit-scrollbar-button:horizontal:end:increment {
      display: none !important;
    }
    
    .table-scroll::-webkit-scrollbar-corner {
      display: none !important;
    }
    
    .table-scroll::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.02); /* Casi invisible */
      border-radius: 2px;
      margin: 0 6px; /* Más márgenes para que sea más discreto */
    }
    
    .table-scroll::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15); /* Muy transparente */
      border-radius: 2px;
      transition: all 0.3s ease;
      min-width: 20px; /* Ancho mínimo del thumb */
    }
    
    .table-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.25); /* Ligeramente más visible al hover */
    }
    
    .table-scroll::-webkit-scrollbar-thumb:active {
      background: rgba(0, 0, 0, 0.4); /* Más visible cuando se arrastra */
    }
    
    @media (prefers-color-scheme: dark) {
      .table-scroll::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.03);
      }
      
      .table-scroll::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .table-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .table-scroll::-webkit-scrollbar-thumb:active {
        background: rgba(255, 255, 255, 0.45);
      }
    }
    
    /* Estilos para el menú plus con scroll mejorado */
    .plus-menu .flex-1::-webkit-scrollbar {
      width: 6px;
    }
    
    .plus-menu .flex-1::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
    }
    
    .plus-menu .flex-1::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    
    .plus-menu .flex-1::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }
    
    @media (prefers-color-scheme: dark) {
      .plus-menu .flex-1::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }
      
      .plus-menu .flex-1::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .plus-menu .flex-1::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
    
    .dark .plus-menu .flex-1::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .dark .plus-menu .flex-1::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .dark .plus-menu .flex-1::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Estilos para el input de edición matemática */
    .math-editor-input {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
      user-select: text !important;
      pointer-events: auto !important;
      cursor: text !important;
      caret-color: #3b82f6 !important;
      position: relative !important;
      z-index: 10000 !important;
      display: inline-block !important;
      vertical-align: baseline !important;
      margin: 0 !important;
      padding: 6px 10px !important;
      border: 2px solid #3b82f6 !important;
      border-radius: 6px !important;
      background: #fff !important;
      color: #000 !important;
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      min-width: 200px !important;
      max-width: 400px !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
      white-space: nowrap !important;
      overflow: visible !important;
      text-overflow: clip !important;
    }
    
    .math-editor-input:focus {
      outline: none !important;
      border-color: #2563eb !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
      caret-color: #3b82f6 !important;
    }
    
    @media (prefers-color-scheme: dark) {
      .math-editor-input {
        caret-color: #60a5fa !important;
        background: #1f2937 !important;
        color: #f9fafb !important;
        border: 2px solid #60a5fa !important;
      }
      
      .math-editor-input:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
        caret-color: #60a5fa !important;
      }
    }
    
    .dark .math-editor-input {
      caret-color: #60a5fa !important;
      background: #1f2937 !important;
      color: #f9fafb !important;
      border: 2px solid #60a5fa !important;
    }
    
    .dark .math-editor-input:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
      caret-color: #60a5fa !important;
    }
    
    /* Asegurar que el input no se vea afectado por otros estilos */
    .math-editor-input * {
      pointer-events: none !important;
    }
    
    /* Asegurar que el input puede recibir eventos de paste */
    .math-editor-input {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
      -webkit-touch-callout: default !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    /* Prevenir que otros elementos interfieran con el paste */
    .math-editor-input::-webkit-input-placeholder {
      user-select: none !important;
    }
    
    .math-editor-input::-moz-placeholder {
      user-select: none !important;
    }
    
    .math-editor-input:-ms-input-placeholder {
      user-select: none !important;
    }
    
    .math-editor-input::placeholder {
      user-select: none !important;
    }
    
    /* Estilos para elementos matemáticos con error */
    .math-error {
      animation: mathErrorPulse 2s ease-in-out infinite;
    }
    
    @keyframes mathErrorPulse {
      0%, 100% { 
        opacity: 1; 
      }
      50% { 
        opacity: 0.7; 
      }
    }
    
    /* Indicador de vista previa en tiempo real */
    .katex-math[data-editing="true"]::after,
    .katex-fallback[data-editing="true"]::after {
      content: "✏️";
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 10px;
      opacity: 0.6;
      pointer-events: none;
    }
    
    /* Estilos para bloque de código estilo Notion */
    .notion-code-block {
      position: relative;
      margin: 4px 0;
    }
    
    .notion-code-block .line-numbers {
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    }
    
    .notion-code-block .line-numbers::-webkit-scrollbar {
      height: 6px;
    }
    
    .notion-code-block .line-numbers::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
    }
    
    .notion-code-block .line-numbers::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    
    .notion-code-block .line-numbers::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }
    
    /* Estilos de hover para controles del código */
    .group\\/code-block:hover .opacity-0 {
      opacity: 1 !important;
    }
    
    /* Adaptaciones para modo oscuro */
    @media (prefers-color-scheme: dark) {
      .notion-code-block .line-numbers::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }
      
      .notion-code-block .line-numbers::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .notion-code-block .line-numbers::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
    
    .dark .notion-code-block .line-numbers::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .dark .notion-code-block .line-numbers::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .dark .notion-code-block .line-numbers::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }

  </style>
`

interface BlockEditorProps {
  initialBlocks?: Block[]
  onUpdate?: (blocks: Block[]) => void
  className?: string
  title?: string
  onTitleChange?: (title: string) => void
}

// Definición de categorías de bloques
const blockCategories: Array<{
  title: string;
  blocks: Array<{
    type: BlockType;
    icon: () => JSX.Element;
    label: string;
    description: string;
    keywords: string[];
    shortcut: string;
    preview: {
      title: string;
      description: string;
      example: string;
    };
  }>;
}> = [
  {
    title: "Basic",
    blocks: [
      { type: 'paragraph' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M4.875 4.825c0-.345.28-.625.625-.625h9c.345 0 .625.28.625.625v1.8a.625.625 0 1 1-1.25 0V5.45h-3.25v9.1h.725a.625.625 0 1 1 0 1.25h-2.7a.625.625 0 1 1 0-1.25h.725v-9.1h-3.25v1.175a.625.625 0 1 1-1.25 0z"/>
        </svg>
      ), label: 'Text', description: 'Start writing with plain text.', keywords: ['text', 'paragraph', 'p'], shortcut: '', 
        preview: {
          title: 'Text paragraph',
          description: 'The most basic block for writing. Perfect for general content, explanations and any text that doesn\'t need special formatting.',
          example: 'This is an example of a normal paragraph. Here you can write ideas, explanations, descriptions or any text content you need for your document.'
        }},
      { type: 'heading1' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M4.1 4.825a.625.625 0 1 0-1.25 0v10.35a.625.625 0 0 0 1.25 0V10.4h6.4v4.775a.625.625 0 0 0 1.25 0V4.825a.625.625 0 1 0-1.25 0V9.15H4.1zM17.074 8.45a.6.6 0 0 1 .073.362q.003.03.003.063v6.3a.625.625 0 1 1-1.25 0V9.802l-1.55.846a.625.625 0 1 1-.6-1.098l2.476-1.35a.625.625 0 0 1 .848.25"/>
        </svg>
              ), label: 'Heading 1', description: 'Large section heading.', keywords: ['title', 'h1', 'heading'], shortcut: '#',
        preview: {
          title: 'Main heading',
          description: 'The most important title on your page. Use it to mark main sections and create clear visual hierarchy.',
          example: 'Project Introduction\n\nThis would be the main title of an important section in your document.'
        }},
      { type: 'heading2' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M3.65 4.825a.625.625 0 1 0-1.25 0v10.35a.625.625 0 0 0 1.25 0V10.4h6.4v4.775a.625.625 0 0 0 1.25 0V4.825a.625.625 0 1 0-1.25 0V9.15h-6.4zm10.104 5.164c.19-.457.722-.84 1.394-.84.89 0 1.48.627 1.48 1.238 0 .271-.104.53-.302.746l-3.837 3.585a.625.625 0 0 0 .427 1.082h4.5a.625.625 0 1 0 0-1.25H14.5l2.695-2.518.027-.028c.406-.43.657-.994.657-1.617 0-1.44-1.299-2.488-2.731-2.488-1.128 0-2.145.643-2.548 1.608a.625.625 0 0 0 1.154.482"/>
        </svg>
              ), label: 'Heading 2', description: 'Medium section heading.', keywords: ['title', 'h2', 'heading'], shortcut: '##',
        preview: {
          title: 'Section subtitle',
          description: 'Perfect for dividing content into subsections. Creates an organized and easy-to-navigate structure.',
          example: 'Work Methodology\n\nIdeal for organizing subsections within a main topic.'
        }},
      { type: 'heading3' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M2.877 4.2c.346 0 .625.28.625.625V9.15h6.4V4.825a.625.625 0 0 1 1.25 0v10.35a.625.625 0 0 1-1.25 0V10.4h-6.4v4.775a.625.625 0 0 1-1.25 0V4.825c0-.345.28-.625.625-.625M14.93 9.37c-.692 0-1.183.34-1.341.671a.625.625 0 1 1-1.128-.539c.416-.87 1.422-1.382 2.47-1.382.686 0 1.33.212 1.818.584.487.373.843.932.843 1.598 0 .629-.316 1.162-.76 1.533l.024.018c.515.389.892.972.892 1.669 0 .696-.377 1.28-.892 1.668s-1.198.61-1.926.61c-1.1 0-2.143-.514-2.599-1.389a.625.625 0 0 1 1.109-.578c.187.36.728.717 1.49.717.482 0 .895-.148 1.174-.358s.394-.453.394-.67-.116-.46-.394-.67c-.28-.21-.692-.358-1.174-.358h-.461a.625.625 0 0 1 0-1.25h.357a1 1 0 0 1 .104-.01c.437 0 .81-.135 1.06-.326s.351-.41.351-.605-.101-.415-.351-.606-.623-.327-1.06-.327"/>
        </svg>
              ), label: 'Heading 3', description: 'Small section heading.', keywords: ['title', 'h3', 'heading'], shortcut: '###',
        preview: {
          title: 'Minor subtitle',
          description: 'Ideal for specific details within subsections. Maintains visual hierarchy without overloading the design.',
          example: 'Technical Considerations\n\nPerfect for specific details and important points within a subsection.'
        }},
      { type: 'quote' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M15.796 4.971a5.067 5.067 0 0 0-5.067 5.067v.635a4.433 4.433 0 0 0 4.433 4.433 3.164 3.164 0 1 0-3.11-3.75 3.2 3.2 0 0 1-.073-.683v-.635a3.817 3.817 0 0 1 3.817-3.817h.635a.625.625 0 1 0 0-1.25zm-9.054 0a5.067 5.067 0 0 0-5.067 5.068v.634a4.433 4.433 0 0 0 4.433 4.433 3.164 3.164 0 1 0-3.11-3.75 3.2 3.2 0 0 1-.073-.683v-.634A3.817 3.817 0 0 1 6.742 6.22h.635a.625.625 0 1 0 0-1.25z"/>
        </svg>
              ), label: 'Quote', description: 'Capture a quote or highlight information.', keywords: ['quote', 'citation'], shortcut: '"',
        preview: {
          title: 'Quote block',
          description: 'Highlight important quotes, testimonials or key information. Displayed with a distinctive side line.',
          example: '"Success is the sum of small efforts repeated day in and day out."\n\n- Robert Collier\n\nPerfect for highlighting inspirational quotes, testimonials or important information.'
        }},
      { type: 'divider' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10z"/>
          <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
        </svg>
              ), label: 'Divider', description: 'Create an elegant visual separation between sections.', keywords: ['divider', 'separator', 'hr', 'line', 'horizontal'], shortcut: '---',
        preview: {
          title: 'Línea divisoria horizontal',
          description: 'Añade una línea horizontal elegante para separar secciones de contenido. Se muestra con un gradiente sutil y efectos visuales cuando está seleccionada.',
          example: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        }}
    ]
  },
  {
    title: "Lists",
    blocks: [
      { type: 'bulletList' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M4.809 12.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M16 13.375a.625.625 0 1 1 0 1.25H8.5a.625.625 0 0 1 0-1.25zM4.809 4.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M16 5.375a.625.625 0 1 1 0 1.25H8.5a.625.625 0 0 1 0-1.25z"/>
        </svg>
      ), label: 'Bullet list', description: 'Create a simple list with bullet points.', keywords: ['list', 'bullet', 'ul'], shortcut: '-',
        preview: {
          title: 'Lista con puntos',
          description: 'Organiza información en elementos con viñetas. Perfecta para listas de características, beneficios o elementos relacionados.',
          example: '• Características principales del producto\n• Beneficios para el usuario\n• Ventajas competitivas\n• Funcionalidades destacadas'
        }},
      { type: 'numberedList' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M5.088 3.026a.55.55 0 0 1 .27.474v4a.55.55 0 0 1-1.1 0V4.435l-.24.134a.55.55 0 1 1-.535-.962l1.059-.588a.55.55 0 0 1 .546.007M8.5 5.375a.625.625 0 1 0 0 1.25H16a.625.625 0 1 0 0-1.25zm0 8a.625.625 0 0 0 0 1.25H16a.625.625 0 1 0 0-1.25zM6 16.55H3.5a.55.55 0 0 1-.417-.908l1.923-2.24a.7.7 0 0 0 .166-.45.335.335 0 0 0-.266-.327l-.164-.035a.6.6 0 0 0-.245.004l-.03.007a.57.57 0 0 0-.426.44.55.55 0 1 1-1.08-.206 1.67 1.67 0 0 1 1.248-1.304l.029-.007c.24-.058.49-.061.732-.01l.164.035c.664.14 1.138.726 1.138 1.404 0 .427-.153.84-.432 1.165L4.697 15.45H6a.55.55 0 0 1 0 1.1"/>
        </svg>
      ), label: 'Lista numerada', description: 'Crea una lista ordenada con números.', keywords: ['lista', 'numerada', 'ol'], shortcut: '1.',
        preview: {
          title: 'Lista ordenada',
          description: 'Ideal para pasos, instrucciones o cualquier contenido que requiera un orden específico.',
          example: '1. Analizar los requisitos del proyecto\n2. Diseñar la arquitectura del sistema\n3. Implementar las funcionalidades principales\n4. Realizar pruebas y validación\n5. Desplegar en producción'
        }},
      { type: 'todo' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M7.82 4.037a.625.625 0 0 0-1.072-.644L4.344 7.4 3.008 5.842a.625.625 0 1 0-.949.813l1.9 2.217a.625.625 0 0 0 1.01-.085zm1.928 1.992a.625.625 0 1 0 0 1.25h7.125a.625.625 0 1 0 0-1.25zm-.625 7.275c0-.345.28-.625.625-.625h7.125a.625.625 0 1 1 0 1.25H9.748a.625.625 0 0 1-.625-.625M4.534 10.68a2.625 2.625 0 1 0 0 5.249 2.625 2.625 0 0 0 0-5.25m-1.375 2.624a1.375 1.375 0 1 1 2.75 0 1.375 1.375 0 0 1-2.75 0"/>
        </svg>
      ), label: 'Lista de tareas', description: 'Rastrea tareas con casillas de verificación.', keywords: ['tareas', 'todo', 'checkbox'], shortcut: '[]',
        preview: {
          title: 'Lista de tareas',
          description: 'Mantén el control de tus tareas pendientes. Puedes marcar elementos como completados con un simple clic.',
          example: '☐ Revisar documentación del proyecto\n☑ Completar el diseño de la interfaz\n☐ Implementar autenticación de usuarios\n☐ Configurar base de datos\n☐ Realizar pruebas de integración'
        }}
    ]
  },
  {
    title: "Media",
    blocks: [
      { type: 'table' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h11A1.5 1.5 0 0 1 17 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5zM4.5 3.25a.25.25 0 0 0-.25.25v2.75h11.5V3.5a.25.25 0 0 0-.25-.25zM4.25 7.5v2.25h4.5V7.5zm5.75 0v2.25h5.75V7.5zm-5.75 3.5v2.25h4.5V11zm5.75 0v2.25h5.75V11zm-5.75 3.5v2.25h11.5v-2a.25.25 0 0 0-.25-.25H4.5a.25.25 0 0 0-.25.25z"/>
        </svg>
      ), label: 'Table', description: 'Create a table with rows and columns.', keywords: ['table', 'grid', 'data'], shortcut: '',
        preview: {
          title: 'Tabla interactiva',
          description: 'Organiza datos en filas y columnas. Incluye funciones para añadir/eliminar filas y columnas, y alternar encabezados.',
          example: '┌─────────────┬──────────┬──────────┐\n│ Producto    │ Precio   │ Stock    │\n├─────────────┼──────────┼──────────┤\n│ Laptop      │ $999     │ 25       │\n│ Mouse       │ $29      │ 150      │\n│ Teclado     │ $79      │ 80       │\n└─────────────┴──────────┴──────────┘'
        }},
      { type: 'image' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v11A2.5 2.5 0 0 0 4.5 18h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 15.5 2zM3.25 4.5c0-.69.56-1.25 1.25-1.25h11c.69 0 1.25.56 1.25 1.25v7.64l-2.72-2.72a.75.75 0 0 0-1.06 0L9.53 12.06l-1.72-1.72a.75.75 0 0 0-1.06 0L3.25 13.84zm0 11V15.56l3.75-3.75 1.72 1.72a.75.75 0 0 0 1.06 0l3.44-3.44L16.75 13.64v1.86c0 .69-.56 1.25-1.25 1.25h-11c-.69 0-1.25-.56-1.25-1.25M13.5 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
        </svg>
      ), label: 'Image', description: 'Upload or embed with a link.', keywords: ['image', 'picture', 'photo'], shortcut: '',
        preview: {
          title: 'Bloque de imagen',
          description: 'Añade imágenes para enriquecer tu contenido. Soporta arrastrar y soltar, enlaces de imagen y subida de archivos.',
          example: '🖼️ [Imagen: diagrama-arquitectura.png]\n\nDiagrama de arquitectura del sistema mostrando los componentes principales y sus interacciones.'
        }},
      { type: 'code' as BlockType, icon: () => (
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path d="M12.6 3.172a.625.625 0 0 0-1.201-.344l-4 14a.625.625 0 0 0 1.202.344zM5.842 5.158a.625.625 0 0 1 0 .884L1.884 10l3.958 3.958a.625.625 0 0 1-.884.884l-4.4-4.4a.625.625 0 0 1 0-.884l4.4-4.4a.625.625 0 0 1 .884 0m8.316 0a.625.625 0 0 1 .884 0l4.4 4.4a.625.625 0 0 1 0 .884l-4.4 4.4a.625.625 0 0 1-.884-.884L18.116 10l-3.958-3.958a.625.625 0 0 1 0-.884"/>
        </svg>
      ), label: 'Code', description: 'Capture a code snippet.', keywords: ['code', 'snippet'], shortcut: '```',
        preview: {
          title: 'Bloque de código',
          description: 'Perfecto para mostrar código de programación con formato y resaltado de sintaxis. Mantiene la indentación original.',
          example: 'const calcularTotal = (items) => {\n  return items.reduce((total, item) => {\n    return total + (item.precio * item.cantidad);\n  }, 0);\n};\n\n// Ejemplo de uso\nconst total = calcularTotal(productos);'
        }},
      { type: 'math' as BlockType, icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="9" x2="9" y1="4" y2="20"/>
          <path d="M4 7c0-1.7 1.3-3 3-3h13"/>
          <path d="M18 20c-1.7 0-3-1.3-3-3V4"/>
        </svg>
      ), label: 'Equation', description: 'Display a mathematical equation.', keywords: ['math', 'equation', 'formula'], shortcut: '$$',
        preview: {
          title: 'Ecuación matemática',
          description: 'Escribe fórmulas y expresiones matemáticas usando LaTeX. Ideal para contenido académico y científico.',
          example: 'Ecuación de segundo grado:\nax² + bx + c = 0\n\nFórmula cuadrática:\nx = (-b ± √(b² - 4ac)) / 2a\n\nTeoría de la relatividad:\nE = mc²'
        }}
    ]
  }
]

export function BlockEditor({ 
  initialBlocks = [],
  onUpdate,
  className,
  title = "Untitled",
  onTitleChange
}: BlockEditorProps) {
  const titleBlock: Block = {
    id: 'title',
    type: 'heading1',
    content: title
  }

  const [blocks, setBlocks] = useState<Block[]>(
    initialBlocks.length > 0 
      ? initialBlocks 
      : [{ id: '1', type: 'paragraph', content: '' }]
  )
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [slashMenuBlockId, setSlashMenuBlockId] = useState<string | null>(null)
  const [plusMenuBlockId, setPlusMenuBlockId] = useState<string | null>(null)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })
  const [slashQuery, setSlashQuery] = useState<string>('')
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  
  // Estados para drag and drop
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<'top' | 'bottom' | null>(null)
  // Estados para columnas
  const [dragColumnPosition, setDragColumnPosition] = useState<'left' | 'right' | null>(null)
  const [showColumnPreview, setShowColumnPreview] = useState(false)
  const [canExitColumn, setCanExitColumn] = useState(false)
  // Estados para redimensionamiento de columnas
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumnId, setResizingColumnId] = useState<string | null>(null)
  
  // Estados para la barra de herramientas flotante
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [textFormatState, setTextFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    superscript: false,
    subscript: false
  })
  const [isApplyingFormat, setIsApplyingFormat] = useState(false)
  
  // Estados para el menú de colores
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [colorMenuPosition, setColorMenuPosition] = useState({ top: 0, left: 0 })



  
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

  // Inyectar CSS dinámico para el cursor
  useEffect(() => {
    const styleId = 'dynamic-caret-style'
    
    const updateCaretStyle = () => {
      // Remover estilo anterior si existe
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }
      
      // Detectar dark mode dinámicamente
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                    document.documentElement.classList.contains('dark') ||
                    document.documentElement.getAttribute('data-theme') === 'dark'
      
      const color = isDark ? '#ffffff' : '#37352F' // Blanco en dark, gris oscuro en light
      
      // Crear nuevo estilo
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .block-editor-container [contenteditable] {
          caret-color: ${color} !important;
        }
        .block-editor-container [contenteditable]:focus {
          caret-color: ${color} !important;
        }
        [contenteditable] {
          caret-color: ${color} !important;
        }
        * {
          caret-color: ${color} !important;
        }
      `
      document.head.appendChild(style)
    }

    updateCaretStyle()
    
    // Escuchar cambios de tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateCaretStyle)
    
    // Observar cambios en las clases del HTML/body para detectar cambios manuales de tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
          updateCaretStyle()
        }
      })
    })
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    })
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    })
    
    // También actualizar cada vez que se hace clic (por si hay botones de toggle)
    document.addEventListener('click', updateCaretStyle)
    
    return () => {
      mediaQuery.removeEventListener('change', updateCaretStyle)
      observer.disconnect()
      document.removeEventListener('click', updateCaretStyle)
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  // Función para calcular posición de la toolbar
  const calculateToolbarPosition = useCallback((range: Range) => {
    // Obtener las coordenadas exactas de la selección (relativas al viewport)
    const rect = range.getBoundingClientRect()
    
    // Para position: fixed, NO necesitamos sumar el scroll
    // rect ya nos da las coordenadas correctas relativas al viewport
    
    const toolbarWidth = 350 // Reducido para mejor centrado
    const toolbarHeight = 44
    
    // Posicionar mucho más a la izquierda
    let x = rect.left + (rect.width / 2) - (toolbarWidth / 2) - 380
    
    // Posición vertical: MUCHO más arriba del texto
    let y = rect.top - toolbarHeight - 100
    
    // Asegurar que no se salga por los lados (DESPUÉS de calcular la posición)
    if (x < 10) x = 10
    if (x + toolbarWidth > window.innerWidth - 10) {
      x = window.innerWidth - toolbarWidth - 10
    }
    
    return { top: y, left: x }
  }, [])

  // Función para detectar el formato del texto seleccionado
  const detectTextFormat = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      setTextFormatState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        code: false,
        superscript: false,
        subscript: false
      })
      return
    }

    const range = selection.getRangeAt(0)
    
    // Verificar el elemento que contiene el inicio de la selección
    let elementToCheck = range.startContainer.nodeType === Node.TEXT_NODE 
      ? range.startContainer.parentElement 
      : range.startContainer as Element

    // Primero verificar si estamos dentro de un elemento de código
    let isInCodeElement = false
    if (elementToCheck) {
      const codeElement = elementToCheck.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
      if (codeElement) {
        isInCodeElement = true
      } else {
        // También verificar por estilos computados
        const computedStyle = window.getComputedStyle(elementToCheck)
        if (computedStyle.fontFamily.includes('monospace') || 
            computedStyle.fontFamily.includes('ui-monospace') ||
            computedStyle.fontFamily.includes('SFMono-Regular')) {
          isInCodeElement = true
        }
      }
    }

    // Función auxiliar para detectar superíndice y subíndice
    const detectSuperSubscript = (element: Element | null) => {
      if (!element) return { superscript: false, subscript: false }
      
      // Verificar si el elemento o algún ancestro es <sup> o <sub>
      const supElement = element.closest('sup')
      const subElement = element.closest('sub')
      
      if (supElement) return { superscript: true, subscript: false }
      if (subElement) return { superscript: false, subscript: true }
      
      // También verificar por estilos CSS
      const computedStyle = window.getComputedStyle(element)
      const verticalAlign = computedStyle.verticalAlign
      
      if (verticalAlign === 'super') return { superscript: true, subscript: false }
      if (verticalAlign === 'sub') return { superscript: false, subscript: true }
      
      return { superscript: false, subscript: false }
    }

    // Si estamos en código, solo mostrar el estado de código
    if (isInCodeElement) {
      setTextFormatState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        code: true,
        superscript: false,
        subscript: false
      })
      return
    }

    // Detectar superíndice y subíndice
    const superSubState = detectSuperSubscript(elementToCheck)

    // Si no estamos en código, detectar formato normal
    const formatState = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      code: false,
      superscript: superSubState.superscript,
      subscript: superSubState.subscript
    }

    // Debug temporal
    console.log('Format state detected:', formatState)
    
    setTextFormatState(formatState)
  }, [])

  // Detectar selección de texto
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        setShowFloatingToolbar(false)
        setShowColorMenu(false)
        return
      }

      const range = selection.getRangeAt(0)
      const selectedText = selection.toString().trim()
      
      // Solo mostrar si hay texto seleccionado y está dentro del editor
      if (selectedText.length > 0) {
        const container = range.commonAncestorContainer
        const editorElement = document.querySelector('.block-editor-container')
        
        if (editorElement && (editorElement.contains(container) || container === editorElement)) {
          setSelectedText(selectedText)
          
          // Calcular y establecer la posición
          const position = calculateToolbarPosition(range)
          setToolbarPosition(position)
          setShowFloatingToolbar(true)
          
          // Detectar el formato del texto seleccionado
          setTimeout(() => {
            console.log('Detecting text format after selection...')
            detectTextFormat()
          }, 10)
        } else {
          setShowFloatingToolbar(false)
          setShowColorMenu(false)
        }
      } else {
        setShowFloatingToolbar(false)
        setShowColorMenu(false)
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [calculateToolbarPosition, detectTextFormat])

  // Ocultar toolbar cuando se hace clic fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.floating-toolbar') && !target.closest('.color-menu') && !target.closest('.block-editor-container')) {
        setShowFloatingToolbar(false)
        setShowColorMenu(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Funciones para aplicar formato
  const applyFormat = useCallback((command: string, value?: string) => {
    // Para superíndice y subíndice, usar una implementación más robusta
    if (command === 'superscript' || command === 'subscript') {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return
      
      const range = selection.getRangeAt(0)
      const selectedText = range.toString().trim()
      
      if (selectedText === '') return
      
      // Verificar si ya tiene el formato aplicado
      const parentElement = range.startContainer.nodeType === Node.TEXT_NODE 
        ? range.startContainer.parentElement 
        : range.startContainer as Element
      
      const tagName = command === 'superscript' ? 'sup' : 'sub'
      const existingElement = parentElement?.closest(tagName)
      
      if (existingElement) {
        // Remover el formato
        const textContent = existingElement.textContent || ''
        const textNode = document.createTextNode(textContent)
        existingElement.parentNode?.replaceChild(textNode, existingElement)
        
        // Restaurar la selección
        setTimeout(() => {
          const newSelection = window.getSelection()
          if (newSelection && textNode.parentNode) {
            const newRange = document.createRange()
            newRange.selectNodeContents(textNode)
            newSelection.removeAllRanges()
            newSelection.addRange(newRange)
          }
        }, 0)
      } else {
        // Aplicar el formato
        const element = document.createElement(tagName)
        try {
          range.surroundContents(element)
        } catch (e) {
          const content = range.extractContents()
          element.appendChild(content)
          range.insertNode(element)
        }
        
        // Seleccionar el nuevo elemento
        const newRange = document.createRange()
        newRange.selectNodeContents(element)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    } else {
      // Para otros formatos, usar document.execCommand
      document.execCommand(command, false, value)
    }
    
    // Mantener la selección después del formato y actualizar el estado
    setTimeout(() => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0)
        const position = calculateToolbarPosition(range)
        setToolbarPosition(position)
        // Actualizar el estado del formato después de aplicarlo
        detectTextFormat()
      }
    }, 10)
  }, [calculateToolbarPosition, detectTextFormat])

  // Función para aplicar color de texto
  const applyTextColor = useCallback((color: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    const selectedText = range.toString().trim()
    
    if (selectedText === '') return
    
    // Verificar si ya existe un span con color
    const parentElement = range.startContainer.nodeType === Node.TEXT_NODE 
      ? range.startContainer.parentElement 
      : range.startContainer as Element
    
    const existingColorElement = parentElement?.closest('span[style*="color"]')
    
    if (color === 'inherit') {
      // Para el botón "Default", quitar el color completamente
      if (existingColorElement) {
        const textContent = existingColorElement.textContent || ''
        const textNode = document.createTextNode(textContent)
        existingColorElement.parentNode?.replaceChild(textNode, existingColorElement)
        
        // Restaurar la selección
        setTimeout(() => {
          const newSelection = window.getSelection()
          if (newSelection && textNode.parentNode) {
            const newRange = document.createRange()
            newRange.selectNodeContents(textNode)
            newSelection.removeAllRanges()
            newSelection.addRange(newRange)
          }
        }, 0)
      }
    } else {
      // Para otros colores, aplicar o cambiar el color
      if (existingColorElement) {
        // Si ya existe un elemento con color, cambiar el color
        const colorElement = existingColorElement as HTMLElement
        colorElement.style.color = color
        
        // Mantener la selección
        const newRange = document.createRange()
        newRange.selectNodeContents(existingColorElement)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } else {
        // Crear un nuevo span con el color
        const span = document.createElement('span')
        span.style.color = color
        
        try {
          range.surroundContents(span)
        } catch (e) {
          const content = range.extractContents()
          span.appendChild(content)
          range.insertNode(span)
        }
        
        // Seleccionar el nuevo elemento
        const newRange = document.createRange()
        newRange.selectNodeContents(span)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
    
    // Cerrar el menú de colores
    setShowColorMenu(false)
    
    // Mantener la toolbar visible
    setTimeout(() => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0)
        const position = calculateToolbarPosition(range)
        setToolbarPosition(position)
      }
    }, 10)
  }, [calculateToolbarPosition])

  // Función para aplicar color de fondo
  const applyBackgroundColor = useCallback((color: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    const selectedText = range.toString().trim()
    
    if (selectedText === '') return
    
    // Verificar si ya existe un span con backgroundColor
    const parentElement = range.startContainer.nodeType === Node.TEXT_NODE 
      ? range.startContainer.parentElement 
      : range.startContainer as Element
    
    const existingBgElement = parentElement?.closest('span[style*="background-color"]')
    
    if (existingBgElement) {
      // Si ya existe un elemento con fondo, reemplazar el color
      if (color === 'inherit') {
        // Quitar el fondo completamente
        const textContent = existingBgElement.textContent || ''
        const textNode = document.createTextNode(textContent)
        existingBgElement.parentNode?.replaceChild(textNode, existingBgElement)
        
        // Restaurar la selección
        setTimeout(() => {
          const newSelection = window.getSelection()
          if (newSelection && textNode.parentNode) {
            const newRange = document.createRange()
            newRange.selectNodeContents(textNode)
            newSelection.removeAllRanges()
            newSelection.addRange(newRange)
          }
        }, 0)
             } else {
         // Cambiar el color de fondo existente
         const bgElement = existingBgElement as HTMLElement
         bgElement.style.backgroundColor = color
         bgElement.style.padding = '2px 0px'
         bgElement.style.borderRadius = '0px'
        
        // Mantener la selección
        const newRange = document.createRange()
        newRange.selectNodeContents(existingBgElement)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    } else {
      // No existe elemento con fondo, crear uno nuevo
      if (color !== 'inherit') {
        const span = document.createElement('span')
        span.style.backgroundColor = color
        span.style.padding = '2px 0px'
        span.style.borderRadius = '0px'
        
        try {
          range.surroundContents(span)
        } catch (e) {
          const content = range.extractContents()
          span.appendChild(content)
          range.insertNode(span)
        }
        
        // Seleccionar el nuevo elemento
        const newRange = document.createRange()
        newRange.selectNodeContents(span)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
    
    // Cerrar el menú de colores
    setShowColorMenu(false)
    
    // Mantener la toolbar visible
    setTimeout(() => {
      const selection = window.getSelection()
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0)
        const position = calculateToolbarPosition(range)
        setToolbarPosition(position)
      }
    }, 10)
  }, [calculateToolbarPosition])



  // Componente de la barra de herramientas flotante
  const FloatingToolbar = () => {
    if (!showFloatingToolbar) return null

    return (
      <div 
        className="floating-toolbar fixed z-[9999]"
        style={{
          top: `${toolbarPosition.top}px`,
          left: `${toolbarPosition.left}px`
        }}
      >
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600" style={{
          display: 'inline-flex',
          alignItems: 'stretch',
          height: '36px',
          overflow: 'hidden',
          fontSize: '14px',
          lineHeight: '1.2',
          borderRadius: '8px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px',
          pointerEvents: 'auto',
          padding: '4px'
        }}>

          

          {/* Controles de formato */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Negrita */}
            <button
              onClick={() => {
                // Verificar si estamos en código antes de aplicar bold
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                const range = selection.getRangeAt(0)
                let element = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element
                
                // Si estamos en código, no permitir bold
                if (element) {
                  const codeElement = element.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                  if (codeElement) {
                    return // No hacer nada si estamos en código
                  }
                }
                
                applyFormat('bold')
              }}
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in',
                cursor: textFormatState.code ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
                height: '28px',
                width: '28px',
                padding: '6px',
                border: textFormatState.bold ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                background: 'transparent',
                position: 'relative',
                opacity: textFormatState.code ? 0.5 : 1
            }}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={textFormatState.code}
              title="Negrita"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.954,10.663A6.986,6.986,0,0,0,12,0H5A2,2,0,0,0,3,2V22a2,2,0,0,0,2,2H15a6.994,6.994,0,0,0,2.954-13.337ZM7,4h5a3,3,0,0,1,0,6H7Zm8,16H7V14h8a3,3,0,0,1,0,6Z"/>
            </svg>
              {textFormatState.bold && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>

            {/* Cursiva */}
            <button
              onClick={() => {
                // Verificar si estamos en código antes de aplicar cursiva
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                const range = selection.getRangeAt(0)
                let element = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element
                
                if (element) {
                  const codeElement = element.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                  if (codeElement) return
                }
                
                applyFormat('italic')
              }}
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in',
              cursor: textFormatState.code ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              height: '28px',
              width: '28px',
              padding: '6px',
              border: textFormatState.italic ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
              background: 'transparent',
              position: 'relative',
              opacity: textFormatState.code ? 0.5 : 1
            }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={textFormatState.code}
              title="Cursiva"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,0H7A1,1,0,0,0,7,2h5.354L9.627,22H4a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2H11.646L14.373,2H20a1,1,0,0,0,0-2Z"/>
              </svg>
              {textFormatState.italic && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>

            {/* Subrayado */}
            <button
              onClick={() => {
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                const range = selection.getRangeAt(0)
                let element = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element
                
                if (element) {
                  const codeElement = element.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                  if (codeElement) return
                }
                
                applyFormat('underline')
              }}
              style={{
                userSelect: 'none',
                transition: 'background 20ms ease-in',
                cursor: textFormatState.code ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                height: '28px',
                width: '28px',
                padding: '6px',
                border: textFormatState.underline ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                background: 'transparent',
                position: 'relative',
                opacity: textFormatState.code ? 0.5 : 1
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={textFormatState.code}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,20a8.009,8.009,0,0,0,8-8V1a1,1,0,0,0-2,0V12A6,6,0,0,1,6,12V1A1,1,0,0,0,4,1V12A8.009,8.009,0,0,0,12,20Z"/>
                <path d="M23,22H1a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"/>
              </svg>
              {textFormatState.underline && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>

            {/* Tachado */}
            <button
              onClick={() => {
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                const range = selection.getRangeAt(0)
                let element = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element
                
                if (element) {
                  const codeElement = element.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                  if (codeElement) return
                }
                
                applyFormat('strikeThrough')
              }}
              style={{
                userSelect: 'none',
                transition: 'background 20ms ease-in',
                cursor: textFormatState.code ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                height: '28px',
                width: '28px',
                padding: '6px',
                border: textFormatState.strikethrough ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                background: 'transparent',
                position: 'relative',
                opacity: textFormatState.code ? 0.5 : 1
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={textFormatState.code}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="m24,12c0,.553-.448,1-1,1H1c-.552,0-1-.447-1-1s.448-1,1-1h4.081c-1.863-1.003-3.081-2.97-3.081-5.151C2,2.624,4.624,0,7.848,0h8.235c3.262,0,5.917,2.654,5.917,5.917v1.083c0,.553-.448,1-1,1s-1-.447-1-1v-1.083c0-2.16-1.757-3.917-3.917-3.917H7.848c-2.122,0-3.848,1.727-3.848,3.849,0,1.732,1.167,3.26,2.84,3.714l5.293,1.438h10.867c.552,0,1,.447,1,1Zm-3.943,3.11c-.495.244-.698.844-.454,1.34.259.524.396,1.113.396,1.701,0,2.122-1.726,3.849-3.848,3.849H7.917c-2.16,0-3.917-1.757-3.917-3.917v-1.083c0-.553-.448-1-1-1s-1,.447-1,1v1.083c0,3.263,2.654,5.917,5.917,5.917h8.235c3.225,0,5.848-2.624,5.848-5.849,0-.894-.208-1.788-.604-2.588-.245-.494-.844-.699-1.339-.453Z"/>
              </svg>
              {textFormatState.strikethrough && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>

            {/* Código */}
            <button
              onClick={() => {
                // Prevenir clics múltiples rápidos
                if (isApplyingFormat) return
                setIsApplyingFormat(true)
                
                try {
                  // Para código inline, podemos usar un span con estilo
                  const selection = window.getSelection()
                  if (!selection || selection.rangeCount === 0) {
                    setIsApplyingFormat(false)
                    return
                  }

                  const range = selection.getRangeAt(0)
                  const selectedText = range.toString().trim()
                  
                  // Si no hay texto seleccionado, no hacer nada
                  if (selectedText === '') {
                    setIsApplyingFormat(false)
                    return
                  }
                  
                  // Verificar si ya estamos dentro de un elemento de código
                  const parentElement = range.startContainer.nodeType === Node.TEXT_NODE 
                    ? range.startContainer.parentElement 
                    : range.startContainer as Element
                  
                  const existingCodeElement = parentElement?.closest('span[style*="ui-monospace"]') ||
                                            parentElement?.closest('span[style*="monospace"]') || 
                                            parentElement?.closest('code')
                  
                  // Si ya tiene formato de código, removerlo
                  if (existingCodeElement) {
                    const textContent = existingCodeElement.textContent || ''
                    const textNode = document.createTextNode(textContent)
                    existingCodeElement.parentNode?.replaceChild(textNode, existingCodeElement)
                    
                    // Restaurar la selección
                    setTimeout(() => {
                      const newSelection = window.getSelection()
                      if (newSelection && textNode.parentNode) {
                        const newRange = document.createRange()
                        newRange.selectNodeContents(textNode)
                        newSelection.removeAllRanges()
                        newSelection.addRange(newRange)
                      }
                    }, 0)
                    
                    // Forzar actualización inmediata del estado
                    setTextFormatState(prev => ({
                      ...prev,
                      code: false
                    }))
                  } else {
                    // Aplicar formato de código
                    const span = document.createElement('span')
                    
                    // Detectar si estamos en modo oscuro
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                                  document.documentElement.classList.contains('dark') ||
                                  document.documentElement.getAttribute('data-theme') === 'dark'
                    
                    // Aplicar estilos base
                    span.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                    span.style.padding = '3px 8px'
                    span.style.borderRadius = '6px'
                    span.style.fontSize = '0.85em'
                    span.style.fontWeight = '600'
                    span.style.lineHeight = '1.2'
                    span.style.verticalAlign = 'baseline'
                    span.style.whiteSpace = 'nowrap'
                    span.style.transition = 'all 0.15s ease-in-out'
                    span.style.display = 'inline-block'
                    span.style.position = 'relative'
                    
                    // Aplicar estilos de tema
                    if (isDark) {
                      span.style.backgroundColor = '#0F172A'
                      span.style.color = '#60A5FA'
                      span.style.border = '1px solid #1E293B'
                      span.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                    } else {
                      span.style.backgroundColor = '#F8FAFC'
                      span.style.color = '#E11D48'
                      span.style.border = '1px solid #E2E8F0'
                      span.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }
                    
                    try {
                      range.surroundContents(span)
                    } catch (e) {
                      // Si no se puede rodear, extraer contenido e insertar
                      const content = range.extractContents()
                      span.appendChild(content)
                      range.insertNode(span)
                    }
                    
                    // Seleccionar el nuevo elemento creado
                    const newRange = document.createRange()
                    newRange.selectNodeContents(span)
                    selection.removeAllRanges()
                    selection.addRange(newRange)
                    
                    // Forzar actualización inmediata del estado
                    setTextFormatState(prev => ({
                      ...prev,
                      code: true
                    }))
                  }
                } catch (error) {
                  console.warn('Error applying code format:', error)
                } finally {
                  // Liberar el bloqueo inmediatamente ya que actualizamos el estado manualmente
                  setIsApplyingFormat(false)
                }
              }}
              style={{
                userSelect: 'none',
                transition: 'background 20ms ease-in',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                height: '28px',
                width: '28px',
                padding: '6px',
                border: textFormatState.code ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                background: 'transparent',
                position: 'relative'
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,22c-.249,0-.498-.093-.692-.278L1.187,14.894c-1.575-1.574-1.575-4.112-.015-5.672L8.303,2.283c.396-.385,1.029-.377,1.414,.02,.385,.396,.376,1.029-.02,1.414L2.576,10.646c-.77,.77-.77,2.04,.01,2.819l7.106,6.813c.399,.382,.412,1.016,.03,1.414-.196,.204-.459,.308-.722,.308Zm6.698-.284l7.112-6.94c1.559-1.56,1.559-4.098-.014-5.671L15.693,2.279c-.398-.382-1.031-.369-1.414,.028-.382,.398-.37,1.031,.028,1.414l7.089,6.811c.779,.78,.779,2.049,.009,2.82l-7.104,6.932c-.396,.386-.403,1.019-.018,1.414,.196,.201,.456,.302,.716,.302,.252,0,.504-.095,.698-.284Z"/>
              </svg>
              {textFormatState.code && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>

            {/* Superíndice */}
            <button
              onClick={() => {
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                const range = selection.getRangeAt(0)
                let element = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element
                
                if (element) {
                  const codeElement = element.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                  if (codeElement) return
                }
                
                applyFormat('superscript')
              }}
              style={{
                userSelect: 'none',
                transition: 'background 20ms ease-in',
                cursor: textFormatState.code ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                height: '28px',
                width: '28px',
                top: '-1.5px',
                padding: '6px',
                border: 'none',
                background: 'transparent',
                position: 'relative',
                opacity: textFormatState.code ? 0.5 : 1,
                color: textFormatState.superscript ? '#3b82f6' : undefined
              }}
              className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${textFormatState.superscript ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}
              disabled={textFormatState.code}
              title="Superíndice (x²)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="m24,1v9c0,.553-.448,1-1,1s-1-.447-1-1V3.386l-.78.809c-.383.397-1.017.409-1.414.025-.397-.384-.409-1.017-.025-1.414l2.413-2.5c.188-.195.448-.306.72-.306.552,0,1.087.447,1.087,1Zm-9.37,5.224c-.427-.347-1.058-.283-1.406.146l-5.724,7.045L1.776,6.369c-.348-.429-.978-.492-1.406-.146-.429.349-.494.979-.146,1.407l5.987,7.369L.224,22.369c-.349.429-.283,1.059.146,1.407.185.15.408.224.63.224.291,0,.579-.126.776-.369l5.724-7.045,5.724,7.045c.197.243.486.369.776.369.222,0,.445-.073.63-.224.429-.349.494-.979.146-1.407l-5.987-7.369,5.987-7.369c.349-.429.283-1.059-.146-1.407Z"/>
              </svg>
            </button>

                        {/* Subíndice */}
            <button
              onClick={() => {
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                  const range = selection.getRangeAt(0)
                let element = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element
                
                if (element) {
                  const codeElement = element.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                  if (codeElement) return
                }
                
                applyFormat('subscript')
              }}
              style={{
                userSelect: 'none',
                transition: 'background 20ms ease-in',
                cursor: textFormatState.code ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                height: '28px',
                width: '28px',
                top: '2px',
                padding: '6px',
                border: 'none',
                background: 'transparent',
                position: 'relative',
                opacity: textFormatState.code ? 0.5 : 1,
                color: textFormatState.subscript ? '#3b82f6' : undefined
              }}
              className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${textFormatState.subscript ? 'text-blue-500 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}
              disabled={textFormatState.code}
              title="Subíndice (H₂O)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="m24,14v9c0,.553-.448,1-1,1s-1-.447-1-1v-6.614l-.78.809c-.383.398-1.017.409-1.414.025s-.409-1.017-.025-1.414l2.413-2.5c.188-.195.448-.306.72-.306.552,0,1.087.447,1.087,1ZM14.63.224c-.428-.348-1.058-.283-1.406.146l-5.724,7.045L1.776.369C1.428-.061.797-.124.37.224-.059.572-.125,1.202.224,1.631l5.987,7.369L.224,16.369c-.349.429-.283,1.059.146,1.407.185.15.408.224.63.224.291,0,.579-.126.776-.369l5.724-7.045,5.724,7.045c.197.243.486.369.776.369.222,0,.445-.073.63-.224.429-.349.494-.979.146-1.407l-5.987-7.369L14.776,1.631c.349-.429.283-1.059-.146-1.407Z"/>
              </svg>
            </button>

            {/* Ecuación */}
            <button
              onClick={() => {
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                const range = selection.getRangeAt(0)
                const selectedText = range.toString().trim()
                
                if (selectedText === '') return
                
                // Verificar si estamos en código antes de aplicar formato matemático
                let element = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element
                
                if (element) {
                  const codeElement = element.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                  if (codeElement) return
                }
                
                try {
                  // Renderizar con KaTeX (con más macros tipo TeX)
                  const mathHtml = katex.renderToString(selectedText, {
                    throwOnError: false,
                    displayMode: false,
                    strict: false,
                    trust: true,
                    macros: {
                      // Macros personalizadas estilo TeX
                      "\\f": "#1f(#2)",
                      "\\R": "\\mathbb{R}",
                      "\\N": "\\mathbb{N}",
                      "\\Z": "\\mathbb{Z}",
                      "\\Q": "\\mathbb{Q}",
                      "\\C": "\\mathbb{C}",
                      "\\d": "\\mathrm{d}",
                      "\\e": "\\mathrm{e}",
                      "\\i": "\\mathrm{i}",
                      "\\grad": "\\nabla",
                      "\\curl": "\\nabla \\times",
                      "\\div": "\\nabla \\cdot",
                      "\\laplacian": "\\nabla^2"
                    }
                  })
                  
                  // Crear un span contenedor con mejor manejo de selección
                  const span = document.createElement('span')
                  span.innerHTML = mathHtml
                  span.classList.add('katex-math')
                  span.style.display = 'inline-block'
                  span.style.position = 'relative'
                  span.style.userSelect = 'all' // Facilita la selección
                  span.contentEditable = 'false' // Evita edición interna
                  span.tabIndex = 0 // Permite enfoque con Tab
                  
                  // Agregar atributos para mejor manejo
                  span.setAttribute('data-math-expression', selectedText)
                  span.setAttribute('data-math-type', 'katex')
                  span.setAttribute('title', `Doble clic para editar: ${selectedText}`)
                  
                  // Reemplazar el texto seleccionado con el HTML renderizado
                  range.deleteContents()
                  range.insertNode(span)
                  
                  // Crear un espacio después del elemento matemático y posicionar cursor
                  const spaceNode = document.createTextNode(' ')
                  span.parentNode?.insertBefore(spaceNode, span.nextSibling)
                  
                  const newRange = document.createRange()
                  newRange.setStart(spaceNode, 1)
                  newRange.collapse(true)
                  selection.removeAllRanges()
                  selection.addRange(newRange)
                  
                } catch (error) {
                  console.warn('Error rendering KaTeX:', error)
                  // Si hay error, aplicar formato simple como antes
                  const span = document.createElement('span')
                  span.style.fontFamily = 'KaTeX_Math, "Times New Roman", serif'
                  span.style.fontSize = '1.1em'
                  span.style.fontWeight = 'normal'
                  span.style.userSelect = 'all'
                  span.contentEditable = 'false'
                  span.tabIndex = 0
                  span.classList.add('katex-fallback')
                  span.setAttribute('data-math-expression', selectedText)
                  span.setAttribute('data-math-type', 'fallback')
                  span.setAttribute('title', `Doble clic para editar: ${selectedText}`)
                  
                  try {
                    range.surroundContents(span)
                  } catch (e) {
                    const content = range.extractContents()
                    span.appendChild(content)
                    range.insertNode(span)
                  }
                  
                  // Posicionar cursor después del elemento
                  // Crear un espacio después del elemento matemático y posicionar cursor
                  const spaceNode = document.createTextNode(' ')
                  span.parentNode?.insertBefore(spaceNode, span.nextSibling)
                  
                  const newRange = document.createRange()
                  newRange.setStart(spaceNode, 1)
                  newRange.collapse(true)
                  selection.removeAllRanges()
                  selection.addRange(newRange)
                }
                
                // Cerrar el menú de colores si está abierto
                setShowColorMenu(false)
                
                // Mantener la toolbar visible
                setTimeout(() => {
                  const selection = window.getSelection()
                  if (selection && selection.toString().trim()) {
                    const range = selection.getRangeAt(0)
                    const position = calculateToolbarPosition(range)
                    setToolbarPosition(position)
                  }
                }, 10)
              }}
              style={{
                userSelect: 'none',
                transition: 'background 20ms ease-in',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                height: '28px',
                width: '28px',
                padding: '6px',
                border: 'none',
                background: 'transparent'
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              title="Insertar ecuación matemática"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="m16.04 4a3.009 3.009 0 0 0 -2.891 2.2l-4.049 14.568a1.678 1.678 0 0 1 -1.6 1.232 1.747 1.747 0 0 1 -1.622-1.159l-2.793-7.68a3.461 3.461 0 0 0 -2.312-2.189 1 1 0 0 1 .471-1.944 5.434 5.434 0 0 1 3.721 3.45l2.474 6.8 3.784-13.616a5.015 5.015 0 0 1 4.817-3.662h6.96a1 1 0 0 1 0 2zm7.56 8.2a1 1 0 0 0 -1.4.2l-2.2 2.933-2.2-2.933a1 1 0 0 0 -1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 1 0 1.6-1.2l-2.55-3.4 2.55-3.4a1 1 0 0 0 -.2-1.4z"/>
              </svg>
            </button>
          </div>

          {/* Botón de enlace */}
          <div 
            role="button" 
            tabIndex={0} 
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
              paddingLeft: '8px',
              paddingRight: '8px',
              whiteSpace: 'nowrap',
              height: '28px'
            }}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Link className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </div>
          </div>

          {/* Color de texto */}
          <div 
            role="button" 
            tabIndex={0} 
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '6px',
              paddingRight: '6px',
              whiteSpace: 'nowrap',
              borderRadius: '6px',
              height: '28px',
              position: 'relative'
            }}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation()
              const rect = e.currentTarget.getBoundingClientRect()
              setColorMenuPosition({
                top: rect.top - 60, // Aparece arriba del botón
                left: rect.left - 350 // Más hacia la izquierda
              })
              setShowColorMenu(!showColorMenu)
            }}
          >
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              textAlign: 'center',
              fontSize: '14px',
              borderRadius: '4px',
              fontWeight: '600',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}>
              A
            </div>
            <ChevronDown className="w-3 h-3 ml-1.5 text-gray-600 dark:text-gray-400" />
          </div>

          {/* Separador */}
          <div className="border-r border-gray-300 dark:border-gray-500" style={{
            height: '20px',
            width: '1px',
            margin: 'auto 8px'
          }}></div>

          {/* Botón para limpiar formato */}
          <button
            onClick={() => {
              try {
                const selection = window.getSelection()
                if (!selection || selection.rangeCount === 0) return
                
                const range = selection.getRangeAt(0)
                const selectedText = range.toString()
                
                if (selectedText.trim() === '') return
                
                // Primero verificar si estamos dentro de un elemento de código
                let elementToCheck = range.startContainer.nodeType === Node.TEXT_NODE 
                  ? range.startContainer.parentElement 
                  : range.startContainer as Element

                const codeElement = elementToCheck?.closest('span[style*="ui-monospace"], span[style*="monospace"], code')
                
                if (codeElement) {
                  // Si estamos dentro de un elemento de código, reemplazarlo completamente
                  const textContent = codeElement.textContent || ''
                  const textNode = document.createTextNode(textContent)
                  
                  // Reemplazar el elemento de código completo con texto plano
                  codeElement.parentNode?.replaceChild(textNode, codeElement)
                  
                  // Seleccionar el nuevo texto
                  const newRange = document.createRange()
                  newRange.selectNodeContents(textNode)
                  selection.removeAllRanges()
                  selection.addRange(newRange)
                } else {
                  // Para otros formatos, usar execCommand y limpieza manual
                  document.execCommand('removeFormat', false, '')
                  
                  // Verificar si hay otros elementos formateados en la selección
                  const fragment = range.cloneContents()
                  const formattedElements = fragment.querySelectorAll('b, strong, i, em, u, s, del, strike')
                  
                  if (formattedElements.length > 0) {
                    // Si hay elementos formateados, extraer solo el texto
                    const textContent = range.toString()
                    const textNode = document.createTextNode(textContent)
                    
                    // Reemplazar el contenido seleccionado
                    range.deleteContents()
                    range.insertNode(textNode)
                    
                    // Seleccionar el nuevo texto
                    const newRange = document.createRange()
                    newRange.selectNodeContents(textNode)
                    selection.removeAllRanges()
                    selection.addRange(newRange)
                  }
                }
                
                // Actualizar estado para mostrar que no hay formato
                setTextFormatState({
                  bold: false,
                  italic: false,
                  underline: false,
                  strikethrough: false,
                  code: false,
                  superscript: false,
                  subscript: false
                })
                
                // También ejecutar detectTextFormat para asegurar consistencia
                setTimeout(() => {
                  detectTextFormat()
                }, 10)
                
              } catch (error) {
                console.warn('Error removing formatting:', error)
              }
            }}
            title="Quitar formato"
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              padding: '6px',
              border: 'none',
              background: 'transparent'
            }}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2a10.032,10.032,0,0,1,7.122,3H16a1,1,0,0,0-1,1h0a1,1,0,0,0,1,1h4.143A1.858,1.858,0,0,0,22,5.143V1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1V3.078A11.981,11.981,0,0,0,.05,10.9a1.007,1.007,0,0,0,1,1.1h0a.982.982,0,0,0,.989-.878A10.014,10.014,0,0,1,12,2Z"/>
              <path d="M22.951,12a.982.982,0,0,0-.989.878A9.986,9.986,0,0,1,4.878,19H8a1,1,0,0,0,1-1H9a1,1,0,0,0-1-1H3.857A1.856,1.856,0,0,0,2,18.857V23a1,1,0,0,0,1,1H3a1,1,0,0,0,1-1V20.922A11.981,11.981,0,0,0,23.95,13.1a1.007,1.007,0,0,0-1-1.1Z"/>
            </svg>
          </button>

          {/* Botón de más opciones */}
          <button
            style={{
              userSelect: 'none',
              transition: 'opacity 200ms ease-in',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              padding: '6px',
              border: 'none',
              background: 'transparent'
            }}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

    // Componente del menú de colores
  const ColorMenu = () => {
    if (!showColorMenu) return null

    const colors = [
      { 
        name: 'Default', 
        value: 'inherit', 
        lightColor: '#6B7280', 
        darkColor: '#F3F4F6',
        lightBg: '#F8FAFC', 
        darkBg: '#101729'
      },
      { 
        name: 'Gray', 
        value: '#dcdbdd', 
        lightColor: '#dcdbdd', 
        darkColor: '#dcdbdd',
        lightBg: '#dcdbdd', 
        darkBg: '#dcdbdd'
      },
      { 
        name: 'Stone', 
        value: '#A8A29E', 
        lightColor: '#A8A29E', 
        darkColor: '#A8A29E',
        lightBg: '#A8A29E', 
        darkBg: '#A8A29E'
      },
      { 
        name: 'Slate', 
        value: '#94A3B8', 
        lightColor: '#94A3B8', 
        darkColor: '#94A3B8',
        lightBg: '#94A3B8', 
        darkBg: '#94A3B8'
      },
      { 
        name: 'Blue', 
        value: '#93C5FD', 
        lightColor: '#93C5FD', 
        darkColor: '#93C5FD',
        lightBg: '#93C5FD', 
        darkBg: '#93C5FD'
      },
      { 
        name: 'Indigo', 
        value: '#A5B4FC', 
        lightColor: '#A5B4FC', 
        darkColor: '#A5B4FC',
        lightBg: '#A5B4FC', 
        darkBg: '#A5B4FC'
      },
      { 
        name: 'Emerald', 
        value: '#c8f1d5', 
        lightColor: '#c8f1d5', 
        darkColor: '#c8f1d5',
        lightBg: '#c8f1d5', 
        darkBg: '#c8f1d5'
      },
      { 
        name: 'Amber', 
        value: '#FDF2CC', 
        lightColor: '#FDF2CC', 
        darkColor: '#fdf2cc',
        lightBg: '#fdf2cc', 
        darkBg: '#fdf2cc'
      },
      { 
        name: 'Rose', 
        value: '#FBC6CD', 
        lightColor: '#FBC6CD', 
        darkColor: '#FBC6CD',
        lightBg: '#FBC6CD', 
        darkBg: '#FBC6CD'
      },
      { 
        name: 'Violet', 
        value: '#E9D2FF', 
        lightColor: '#E9D2FF', 
        darkColor: '#E9D2FF',
        lightBg: '#E9D2FF', 
        darkBg: '#E9D2FF'
      }
    ]

    return (
      <div 
        role="dialog"
        aria-modal="true"
        className="color-menu fixed z-[10000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        style={{
          top: `${colorMenuPosition.top}px`,
          left: `${colorMenuPosition.left}px`,
          borderRadius: '12px',
          backdropFilter: 'blur(20px)',
          maxWidth: 'calc(-24px + 100vw)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        <div className="flex flex-col w-48 min-w-44 max-w-[calc(100vw-24px)] h-full max-h-[70vh]">
          <div className="z-[1] flex-grow min-h-0 transform-gpu overflow-hidden overflow-y-auto">
            <div 
              tabIndex={0}
              role="menu"
              className="rounded-xl"
            >
              {/* Sección color de texto */}
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Color
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={color.name}
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => applyTextColor(color.value)}
                      className="group relative w-8 h-8 rounded-lg border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm hover:shadow-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      title={`${color.name} text`}
                    >
                      <div 
                        className={`w-full h-full rounded-md flex items-center justify-center font-semibold text-sm ${
                          color.name === 'Default' ? 'text-black dark:text-white' : ''
                        }`}
                        style={{ 
                          color: color.name !== 'Default' ? color.lightColor : undefined,
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        A
                      </div>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-lg bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      {/* Selection indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full opacity-0 scale-75 transition-all duration-200 group-active:opacity-100 group-active:scale-100">
                        <svg className="w-1.5 h-1.5 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección color de fondo */}
              <div className="p-3">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Fondo
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color, index) => (
                    <button
                      key={`bg-${color.name}`}
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => applyBackgroundColor(color.value)}
                      className={`group relative w-8 h-8 rounded-lg border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm hover:shadow-md ${
                        color.name === 'Default' 
                          ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      style={{
                        backgroundColor: color.name !== 'Default' ? color.lightBg : undefined
                      }}
                      title={`${color.name} background`}
                    >
                      <div 
                        className="w-full h-full rounded-md flex items-center justify-center relative overflow-hidden"
                        style={{ 
                          backgroundColor: color.name !== 'Default' ? color.lightBg : 'transparent'
                        }}
                      >
                      </div>
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-lg bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      {/* Selection indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full opacity-0 scale-75 transition-all duration-200 group-active:opacity-100 group-active:scale-100">
                        <svg className="w-1.5 h-1.5 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const updateBlock = useCallback((id: string, content: string, htmlContent?: string) => {
    if (id === 'title') {
      onTitleChange?.(content)
      return
    }
    
    setBlocks(prev => {
      const updated = prev.map(block => {
        if (block.id === id) {
          // Para tablas, preservar las propiedades específicas de tabla
          if (block.type === 'table') {
            // Si el contenido es tabular (separado por tabs), parsear a tableData
            if (content.includes('\t') || content.includes('\n')) {
              const rows = content.split('\n')
              // No filtrar filas vacías para tablas - mantener la estructura
              const tableData = rows.map(row => row.split('\t'))
              return { 
                ...block, 
                content, 
                htmlContent: htmlContent || content,
                tableData,
                tableHeaders: block.tableHeaders // Preservar el estado de headers
              }
            }
            // Si no hay contenido tabular, mantener tableData existente
            return { 
              ...block, 
              content, 
              htmlContent: htmlContent || content 
            }
          }
          // Para otros tipos de bloque, comportamiento normal
          return { ...block, content, htmlContent: htmlContent || content }
        }
        return block
      })
      onUpdate?.(updated)
      return updated
    })
    
    // Función para detectar si estamos en modo matemático en este bloque
    const isInMathMode = () => {
      const blockElement = document.querySelector(`[data-block-id="${id}"] [contenteditable]`) as HTMLElement
      if (!blockElement) return false
      
      // Verificar si hay elementos KaTeX renderizados
      const katexElements = blockElement.querySelectorAll('.katex, .katex-math, .katex-fallback')
      if (katexElements.length > 0) return true
      
      // Verificar si hay elementos con estilo matemático (fallback)
      const mathElements = blockElement.querySelectorAll('span[style*="KaTeX_Math"], span[style*="Times New Roman"]')
      if (mathElements.length > 0) return true
      
      // Verificar si el propio elemento tiene estilo matemático
      const computedStyle = window.getComputedStyle(blockElement)
      if (computedStyle.fontFamily.includes('KaTeX_Math') || 
          computedStyle.fontFamily.includes('Times New Roman')) {
        return true
      }
      
      return false
    }

    // Detectar comando slash y extraer query (solo si NO estamos en modo matemático)
    const slashIndex = content.lastIndexOf('/')
    if (!isInMathMode() && slashIndex !== -1 && slashIndex === content.length - 1) {
      // Si termina con "/" y NO estamos en modo matemático, mostrar menú completo
      setSlashMenuBlockId(id)
      setSlashQuery('')
      
      // Calcular posición del menú
      setTimeout(() => {
        const blockElement = document.querySelector(`[data-block-id="${id}"] [contenteditable]`) as HTMLElement
        if (blockElement) {
          const rect = blockElement.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
          
          setSlashMenuPosition({
            top: rect.top + scrollTop + rect.height + 12,
            left: rect.left + scrollLeft
          })
        }
      }, 0)
    } else if (!isInMathMode() && slashIndex !== -1 && slashIndex < content.length - 1) {
      // Si hay texto después de "/" y NO estamos en modo matemático, filtrar
      const query = content.substring(slashIndex + 1)
      setSlashMenuBlockId(id)
      setSlashQuery(query)
    } else {
      setSlashMenuBlockId(null)
      setSlashQuery('')
    }
  }, [onUpdate, onTitleChange])

  const deleteBlock = useCallback((id: string) => {
    if (id === 'title') return
    
    setBlocks(prev => {
      const blockToDelete = prev.find(block => block.id === id)
      let filtered = prev.filter(block => block.id !== id)
      
      // Si el bloque eliminado estaba en una columna, limpiar la estructura de columnas si es necesario
      if (blockToDelete?.parentColumnId) {
        const columnContainer = filtered.find(block => block.id === blockToDelete.parentColumnId)
        if (columnContainer?.columnChildren) {
          const remainingChildren = columnContainer.columnChildren.filter(childId => childId !== id)
          
          // Si solo queda un bloque en la columna, convertir de vuelta a bloque normal
          if (remainingChildren.length === 1) {
            const remainingBlockId = remainingChildren[0]!
            filtered = filtered.map(block => {
              if (block.id === remainingBlockId) {
                // Quitar las propiedades de columna del bloque restante
                const { columnIndex, parentColumnId, ...cleanBlock } = block
                return cleanBlock
              }
              return block
            })
            // Eliminar el contenedor de columnas
            filtered = filtered.filter(block => block.id !== blockToDelete.parentColumnId)
          } else {
            // Actualizar la lista de hijos en el contenedor
            filtered = filtered.map(block => 
              block.id === blockToDelete.parentColumnId 
                ? { ...block, columnChildren: remainingChildren }
                : block
            )
          }
        }
      }
      
      const updated = filtered.length > 0 ? filtered : [{ id: generateId(), type: 'paragraph' as BlockType, content: '' }]
      onUpdate?.(updated)
      return updated
    })
  }, [onUpdate])

  const addBlock = useCallback((afterId: string, type: BlockType) => {
    const newBlockId = generateId()
    setBlocks(prev => {
      const blockIndex = prev.findIndex(block => block.id === afterId)
      const previousBlock = afterId === 'title' ? null : prev[blockIndex]
      
      // Heredar la indentación del bloque anterior
      const inheritedIndent = previousBlock?.indent || 0
      
      // Si el bloque anterior está en una columna, el nuevo bloque también debe estar en la misma columna
      let columnProps = {}
      if (previousBlock?.parentColumnId) {
        columnProps = {
          columnIndex: previousBlock.columnIndex,
          parentColumnId: previousBlock.parentColumnId
        }
        
        // También necesitamos actualizar el contenedor de columnas para incluir el nuevo bloque
        const columnContainer = prev.find(block => block.id === previousBlock.parentColumnId)
        if (columnContainer?.columnChildren) {
          // Encontrar la posición correcta dentro de los hijos de la columna
          const siblingIndex = columnContainer.columnChildren.indexOf(afterId)
          const updatedChildren = [
            ...columnContainer.columnChildren.slice(0, siblingIndex + 1),
            newBlockId,
            ...columnContainer.columnChildren.slice(siblingIndex + 1)
          ]
          
          // Crear el nuevo bloque
          const newBlock: Block = { 
            id: newBlockId, 
            type, 
            content: '',
            indent: inheritedIndent,
            ...columnProps,
            ...(type === 'table' ? {
              tableData: [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
              ],
              tableHeaders: false
            } : {})
          }
          
          // Actualizar el contenedor de columnas Y insertar el nuevo bloque
          const updatedBlocks = prev.map(block => 
            block.id === previousBlock.parentColumnId 
              ? { ...block, columnChildren: updatedChildren }
              : block
          )
          
          // Insertar el nuevo bloque justo después del bloque actual
          const updated = [
            ...updatedBlocks.slice(0, blockIndex + 1),
            newBlock,
            ...updatedBlocks.slice(blockIndex + 1)
          ]
          
          onUpdate?.(updated)
          return updated
        }
      }
      
      const newBlock: Block = { 
        id: newBlockId, 
        type, 
        content: '',
        indent: inheritedIndent,
        ...columnProps,
        ...(type === 'table' ? {
          tableData: [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
          ],
          tableHeaders: false
        } : {})
      }
      
      const updated = afterId === 'title' 
        ? [newBlock, ...prev]
        : [...prev.slice(0, blockIndex + 1), newBlock, ...prev.slice(blockIndex + 1)]
      
      onUpdate?.(updated)
      return updated
    })
    
    setTimeout(() => {
      setSelectedBlockId(newBlockId)
      setTimeout(() => {
        const blockElement = document.querySelector(`[data-block-id="${newBlockId}"] [contenteditable]`) as HTMLElement
        if (blockElement) {
          blockElement.focus()
        }
      }, 10)
    }, 0)
    
    return newBlockId
  }, [onUpdate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, blockId: string, index: number) => {
    const currentBlock = blocks[index]
    
    // Manejar Tab para indentación
    if (e.key === 'Tab') {
      e.preventDefault()
      
      if (e.shiftKey) {
        // Shift+Tab: Reducir indentación
        setBlocks(prev => {
          const updated = prev.map(block => 
            block.id === blockId 
              ? { ...block, indent: Math.max((block.indent || 0) - 1, 0) }
              : block
          )
          onUpdate?.(updated)
          return updated
        })
      } else {
        // Tab: Aumentar indentación (máximo 5 niveles)
        setBlocks(prev => {
          const updated = prev.map(block => 
            block.id === blockId 
              ? { ...block, indent: Math.min((block.indent || 0) + 1, 5) }
              : block
          )
          onUpdate?.(updated)
          return updated
        })
      }
      return
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      // Si estamos en un bloque de código, permitir Enter normal (nueva línea)
      if (currentBlock?.type === 'code') {
        // No prevenir el comportamiento por defecto - permitir nueva línea
        return
      }
      
      e.preventDefault()
      
      // Si estamos en una lista con viñetas, crear otra lista con viñetas
      if (currentBlock?.type === 'bulletList') {
        // Siempre crear nueva lista con viñetas, sin importar si está vacía o no
        addBlock(blockId, 'bulletList')
        return
      }
      
      // Si estamos en una lista numerada, crear otra lista numerada
      if (currentBlock?.type === 'numberedList') {
        // Siempre crear nueva lista numerada, sin importar si está vacía o no
        addBlock(blockId, 'numberedList')
        return
      }
      
      // Si estamos en una lista de tareas, crear otra lista de tareas
      if (currentBlock?.type === 'todo') {
        // Si la tarea actual está vacía, convertir a párrafo normal (salir de la lista)
        if (!currentBlock.content || currentBlock.content.trim() === '') {
          setBlocks(prev => {
            const updated = prev.map(block => 
              block.id === blockId ? { ...block, type: 'paragraph' as BlockType } : block
            )
            onUpdate?.(updated)
            return updated
          })
          return
        }
        // Si tiene contenido, crear nueva tarea
        addBlock(blockId, 'todo')
        return
      }
      
      // Para otros tipos de bloque, crear párrafo normal
      addBlock(blockId, 'paragraph')
    } else if (e.key === 'Escape') {
      // Si estamos en un bloque de código, salir del bloque y crear uno nuevo
      if (currentBlock?.type === 'code') {
        e.preventDefault()
        const newBlockId = addBlock(blockId, 'paragraph')
        // Enfocar el nuevo bloque
        setTimeout(() => {
          const newBlockElement = document.querySelector(`[data-block-id="${newBlockId}"] [contenteditable]`) as HTMLElement
          if (newBlockElement) {
            newBlockElement.focus()
          }
        }, 10)
        return
      }
    } else if (e.key === 'Backspace') {
      // Verificar si estamos al principio del bloque
      const selection = window.getSelection()
      const isAtStart = selection && selection.rangeCount > 0 && 
                       selection.getRangeAt(0).startOffset === 0 && 
                       selection.getRangeAt(0).collapsed
      
      // Si estamos al principio del bloque (vacío o con contenido) y tiene indentación
      if (isAtStart && currentBlock && (currentBlock.indent || 0) > 0) {
        e.preventDefault()
        
        setBlocks(prev => {
          const updated = prev.map(block => 
            block.id === blockId ? { ...block, indent: Math.max((block.indent || 0) - 1, 0) } : block
          )
          onUpdate?.(updated)
          return updated
        })
        
        // Mantener el foco en el bloque después de reducir indentación
        setTimeout(() => {
          const blockElement = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement
          if (blockElement) {
            blockElement.focus()
            
            // Posicionar cursor al principio
            const selection = window.getSelection()
            const range = document.createRange()
            range.setStart(blockElement, 0)
            range.collapse(true)
            selection?.removeAllRanges()
            selection?.addRange(range)
          }
        }, 10)
        return
      }
      
      // Si el bloque está completamente vacío, continuar con la lógica original
      if (blocks[index]?.content === '') {
        e.preventDefault()
        
        // Si estamos en una lista (viñetas, numerada, tareas), cita, encabezados o código, convertir a párrafo normal
        if (currentBlock?.type === 'bulletList' || currentBlock?.type === 'numberedList' || currentBlock?.type === 'todo' || currentBlock?.type === 'quote' || currentBlock?.type === 'heading1' || currentBlock?.type === 'heading2' || currentBlock?.type === 'heading3' || currentBlock?.type === 'code') {
        setBlocks(prev => {
          const updated = prev.map(block => 
            block.id === blockId ? { ...block, type: 'paragraph' as BlockType } : block
          )
          onUpdate?.(updated)
          return updated
        })
        
        // Mantener el foco en el bloque después de convertir a párrafo
        setTimeout(() => {
          const blockElement = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement
          if (blockElement) {
            blockElement.focus()
            
            // Posicionar cursor al final
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(blockElement)
            range.collapse(false)
            selection?.removeAllRanges()
            selection?.addRange(range)
          }
        }, 10)
        return
      }
      
      // Si es el primer bloque (index 0), ir al título en lugar de eliminar
      if (index === 0) {
        setSelectedBlockId('title')
        setTimeout(() => {
          const titleElement = document.querySelector(`[data-block-id="title"] [contenteditable]`) as HTMLElement
          if (titleElement) {
            titleElement.focus()
            
            // Posicionar cursor al final del título
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(titleElement)
            range.collapse(false)
            selection?.removeAllRanges()
            selection?.addRange(range)
          }
        }, 0)
      } else {
        // Para otros bloques, comportamiento normal: eliminar y ir al anterior
        deleteBlock(blockId)
        if (index > 0) {
          setSelectedBlockId(blocks[index - 1]?.id || null)
        }
      }
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      setSelectedBlockId(blocks[index - 1]?.id || null)
    } else if (e.key === 'ArrowDown' && index < blocks.length - 1) {
      e.preventDefault()
      setSelectedBlockId(blocks[index + 1]?.id || null)
    }
  }, [blocks, addBlock, deleteBlock, onUpdate])

  const duplicateBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const blockIndex = prev.findIndex(block => block.id === id)
      if (blockIndex === -1) return prev
      
      const blockToDuplicate = prev[blockIndex]
      if (!blockToDuplicate) return prev
      
      // Capturar el HTML actual del bloque antes de duplicar
      const blockElement = document.querySelector(`[data-block-id="${id}"] [contenteditable]`) as HTMLElement
      let currentHtmlContent = blockToDuplicate.htmlContent
      
      if (blockElement) {
        currentHtmlContent = blockElement.innerHTML
      }
      
      const newBlock: Block = { 
        ...blockToDuplicate, 
        id: generateId(),
        htmlContent: currentHtmlContent
      }
      
      const updated = [...prev.slice(0, blockIndex + 1), newBlock, ...prev.slice(blockIndex + 1)]
      onUpdate?.(updated)
      return updated
    })
  }, [onUpdate])

  const moveBlockUp = useCallback((id: string) => {
    setBlocks(prev => {
      const blockIndex = prev.findIndex(block => block.id === id)
      if (blockIndex <= 0) return prev
      
      const updated = [...prev]
      const temp = updated[blockIndex]!
      updated[blockIndex] = updated[blockIndex - 1]!
      updated[blockIndex - 1] = temp
      
      onUpdate?.(updated)
      return updated
    })
  }, [onUpdate])

  const moveBlockDown = useCallback((id: string) => {
    setBlocks(prev => {
      const blockIndex = prev.findIndex(block => block.id === id)
      if (blockIndex >= prev.length - 1) return prev
      
      const updated = [...prev]
      const temp = updated[blockIndex]!
      updated[blockIndex] = updated[blockIndex + 1]!
      updated[blockIndex + 1] = temp
      
      onUpdate?.(updated)
      return updated
    })
  }, [onUpdate])

  const changeBlockType = useCallback((id: string, type: BlockType) => {
    setBlocks(prev => {
      const updated = prev.map(block => {
        if (block.id === id) {
          // Si cambiamos a tabla, inicializar con datos vacíos
          if (type === 'table') {
            return {
              ...block,
              type,
              tableData: [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
              ],
              tableHeaders: false
            }
          }
          // Si cambiamos desde tabla a otro tipo, limpiar propiedades de tabla
          if ('tableData' in block && (type as string) === 'table') {
            return { ...block, type }
          }
          if ('tableData' in block) {
            const { tableData, tableHeaders, ...cleanBlock } = block as any
            return { ...cleanBlock, type }
          }
          // Para otros casos, cambio normal
          return { ...block, type }
        }
        return block
      })
      onUpdate?.(updated)
      return updated
    })
  }, [onUpdate])

  const handleToggleComplete = useCallback((id: string, completed: boolean) => {
    setBlocks(prev => {
      const updated = prev.map(block => 
        block.id === id ? { ...block, completed } : block
      )
      onUpdate?.(updated)
      return updated
    })
  }, [onUpdate])

  // Funciones para drag and drop
  const handleDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', blockId)
    
    // Capturar el HTML del bloque antes de moverlo para preservar el formato
    const blockElement = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement
    if (blockElement) {
      const htmlContent = blockElement.innerHTML
      const textContent = blockElement.textContent || ''
      
      // Actualizar el bloque con el HTML actual antes del drag
      setBlocks(prev => {
        const updated = prev.map(block => 
          block.id === blockId ? { ...block, content: textContent, htmlContent } : block
        )
        onUpdate?.(updated)
        return updated
      })
    }
    
    // Crear una imagen fantasma personalizada para el drag
    const draggedElement = e.currentTarget.closest('[data-block-id]') as HTMLElement
    if (draggedElement) {
      // Clonar el elemento para la imagen fantasma
      const clone = draggedElement.cloneNode(true) as HTMLElement
      
      // Detectar si estamos en modo oscuro
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                    document.documentElement.classList.contains('dark') ||
                    document.documentElement.getAttribute('data-theme') === 'dark'
      
      // Estilos mejorados para el clon
      clone.style.transform = 'rotate(3deg) scale(1.02)'
      clone.style.opacity = '0.9'
      clone.style.background = isDark ? '#1f2937' : '#ffffff'
      clone.style.border = isDark ? '2px solid #374151' : '2px solid #e5e7eb'
      clone.style.borderRadius = '12px'
      clone.style.padding = '12px 16px'
      clone.style.position = 'absolute'
      clone.style.top = '-2000px'
      clone.style.left = '-2000px'
      clone.style.width = Math.min(draggedElement.offsetWidth, 400) + 'px'
      clone.style.maxWidth = '400px'
      clone.style.zIndex = '9999'
      clone.style.cursor = 'grabbing'
      clone.style.userSelect = 'none'
      clone.style.pointerEvents = 'none'
      
      // Añadir sombra elegante
      clone.style.boxShadow = isDark 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 20px rgba(59, 130, 246, 0.3)'
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 20px rgba(59, 130, 246, 0.15)'
      
      // Añadir efecto de gradiente sutil en el borde
      const gradientOverlay = document.createElement('div')
      gradientOverlay.style.position = 'absolute'
      gradientOverlay.style.top = '0'
      gradientOverlay.style.left = '0'
      gradientOverlay.style.right = '0'
      gradientOverlay.style.bottom = '0'
      gradientOverlay.style.borderRadius = '12px'
      gradientOverlay.style.background = isDark
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
      gradientOverlay.style.pointerEvents = 'none'
      
      // Añadir indicador visual de arrastre
      const dragIndicator = document.createElement('div')
      dragIndicator.style.position = 'absolute'
      dragIndicator.style.top = '8px'
      dragIndicator.style.right = '8px'
      dragIndicator.style.width = '20px'
      dragIndicator.style.height = '20px'
      dragIndicator.style.borderRadius = '50%'
      dragIndicator.style.background = isDark 
        ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
        : 'linear-gradient(135deg, #60a5fa, #a78bfa)'
      dragIndicator.style.display = 'flex'
      dragIndicator.style.alignItems = 'center'
      dragIndicator.style.justifyContent = 'center'
      dragIndicator.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
      dragIndicator.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z" fill="white"/>
        </svg>
      `
      
      // Ocultar los controles de hover del clon
      const controls = clone.querySelector('.group') as HTMLElement
      if (controls) {
        const hoverElements = controls.querySelectorAll('.opacity-0, .group-hover\\:opacity-100')
        hoverElements.forEach(el => {
          (el as HTMLElement).style.display = 'none'
        })
      }
      
      // Asegurar que el contenido del clon sea legible
      clone.style.color = isDark ? '#f9fafb' : '#111827'
      
      // Ensamblar el clon final
      clone.style.position = 'relative'
      clone.appendChild(gradientOverlay)
      clone.appendChild(dragIndicator)
      
      // Posicionar fuera de la pantalla y añadir al DOM
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.top = '-2000px'
      container.style.left = '-2000px'
      container.style.zIndex = '9999'
      container.appendChild(clone)
      
      document.body.appendChild(container)
      e.dataTransfer.setDragImage(clone, 20, 20)
      
      // Limpiar el clon después de un tiempo
      setTimeout(() => {
        if (document.body.contains(container)) {
          document.body.removeChild(container)
        }
      }, 150)
    }
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedBlockId(null)
    setDragOverBlockId(null)
    setDragPosition(null)
    setDragColumnPosition(null)
    setShowColumnPreview(false)
    setCanExitColumn(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, blockId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (draggedBlockId === blockId) return
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midPoint = rect.top + rect.height / 2
    const threshold = rect.height * 0.2 // 20% del altura del bloque
    
    // Verificar si el bloque arrastrado está en una columna
    const draggedBlock = blocks.find(b => b.id === draggedBlockId)
    const targetBlock = blocks.find(b => b.id === blockId)
    
    // Detectar posición horizontal para columnas
    const horizontalThreshold = 80 // 80px desde los bordes para activar columnas
    const leftEdge = rect.left + horizontalThreshold
    const rightEdge = rect.right - horizontalThreshold
    
    // Detectar si estamos arrastrando fuera del área de columnas
    const columnContainer = (e.currentTarget as HTMLElement).closest('.column-container')
    const isInColumnArea = columnContainer !== null
    
    // Si el bloque arrastrado está en una columna y estamos fuera del área de columnas,
    // permitir sacarlo de la estructura de columnas
    const canExitColumnNow = draggedBlock?.parentColumnId && !isInColumnArea
    
    let position: 'top' | 'bottom'
    let columnPosition: 'left' | 'right' | null = null
    let showPreview = false
    
    if (canExitColumnNow) {
      // Estamos arrastrando un bloque de columna fuera del área de columnas
      position = e.clientY < midPoint ? 'top' : 'bottom'
    } else if (!draggedBlock?.parentColumnId && !targetBlock?.parentColumnId) {
      // Lógica normal para bloques que no están en columnas
      // Verificar si estamos en los bordes laterales para crear columnas
      if (e.clientX < leftEdge) {
        columnPosition = 'left'
        showPreview = true
        position = 'bottom' // Posición por defecto para columnas
      } else if (e.clientX > rightEdge) {
        columnPosition = 'right'
        showPreview = true
        position = 'bottom' // Posición por defecto para columnas
      } else {
        // Detección vertical normal
        if (e.clientY < midPoint - threshold) {
          position = 'top'
        } else if (e.clientY > midPoint + threshold) {
          position = 'bottom'
        } else {
          // En la zona central, mantener la posición actual o usar 'bottom' por defecto
          position = dragPosition || 'bottom'
        }
      }
    } else {
      // Reordenamiento dentro de columnas
      if (e.clientY < midPoint - threshold) {
        position = 'top'
      } else if (e.clientY > midPoint + threshold) {
        position = 'bottom'
      } else {
        position = dragPosition || 'bottom'
      }
    }
    
    setDragOverBlockId(blockId)
    setDragPosition(position)
    setDragColumnPosition(columnPosition)
    setShowColumnPreview(showPreview)
    setCanExitColumn(!!canExitColumnNow)
  }, [draggedBlockId, dragPosition, blocks])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Solo limpiar si realmente salimos del elemento
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverBlockId(null)
      setDragPosition(null)
      setDragColumnPosition(null)
      setShowColumnPreview(false)
    }
  }, [])

  // Función para crear columnas
  const createColumnLayout = useCallback((targetBlockId: string, draggedBlockId: string, position: 'left' | 'right') => {
    setBlocks(prev => {
      const targetIndex = prev.findIndex(block => block.id === targetBlockId)
      const draggedIndex = prev.findIndex(block => block.id === draggedBlockId)
      
      if (targetIndex === -1 || draggedIndex === -1) return prev
      
      const targetBlock = prev[targetIndex]!
      const draggedBlock = prev[draggedIndex]!
      
      // Crear un nuevo bloque contenedor de columnas
      const columnContainerId = generateId()
      const columnContainer: Block = {
        id: columnContainerId,
        type: 'paragraph',
        content: '',
        isColumn: true,
        columnChildren: position === 'left' 
          ? [draggedBlockId, targetBlockId] 
          : [targetBlockId, draggedBlockId],
        columnWidths: [50, 50] // Empezar con 50/50
      }
      
      // Actualizar los bloques para que sepan que están en columnas
      const updatedTargetBlock = {
        ...targetBlock,
        columnIndex: position === 'left' ? 1 : 0,
        parentColumnId: columnContainerId
      }
      
      const updatedDraggedBlock = {
        ...draggedBlock,
        columnIndex: position === 'left' ? 0 : 1,
        parentColumnId: columnContainerId
      }
      
      // Crear la nueva estructura
      const newBlocks = prev.filter(block => block.id !== draggedBlockId && block.id !== targetBlockId)
      
      // Insertar el contenedor de columnas en la posición del bloque objetivo
      const updated = [
        ...newBlocks.slice(0, targetIndex > draggedIndex ? targetIndex - 1 : targetIndex),
        columnContainer,
        updatedTargetBlock,
        updatedDraggedBlock,
        ...newBlocks.slice(targetIndex > draggedIndex ? targetIndex - 1 : targetIndex)
      ]
      
      onUpdate?.(updated)
      return updated
    })
  }, [onUpdate])

    // Funciones para redimensionamiento de columnas
  const handleResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
    console.log('Resize start:', columnId) // Debug
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizingColumnId(columnId)
    
    const columnContainer = document.querySelector(`[data-column-id="${columnId}"]`) as HTMLElement
    if (!columnContainer) {
      console.log('Column container not found') // Debug
      return
    }
    
    console.log('Column container found:', columnContainer) // Debug
    
    let isMoving = false
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      
      if (isMoving) return
      isMoving = true
      
      // Usar requestAnimationFrame solo para suavizar, pero sin throttling excesivo
      requestAnimationFrame(() => {
        const rect = columnContainer.getBoundingClientRect()
        const totalWidth = rect.width
        const mouseX = e.clientX - rect.left
        
        // Calcular el porcentaje basado en la posición del mouse
        let leftPercentage = (mouseX / totalWidth) * 100
        
        // Aplicar límites: mínimo 15%, máximo 85%
        leftPercentage = Math.min(Math.max(leftPercentage, 15), 85)
        const rightPercentage = 100 - leftPercentage
        
        // Redondear a 1 decimal para suavidad
        const roundedLeft = Math.round(leftPercentage * 10) / 10
        const roundedRight = Math.round(rightPercentage * 10) / 10
        
        console.log('Resizing:', roundedLeft, roundedRight) // Debug
        
        // Actualizar los anchos de las columnas
        setBlocks(prev => {
          const updated = prev.map(block => 
            block.id === columnId 
              ? { ...block, columnWidths: [roundedLeft, roundedRight] }
              : block
          )
          onUpdate?.(updated)
          return updated
        })
        
        isMoving = false
      })
    }
    
    const handleMouseUp = (e: MouseEvent) => {
      console.log('Resize end') // Debug
      e.preventDefault()
      
      setIsResizing(false)
      setResizingColumnId(null)
      // isMoving will be reset automatically
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    
    // Cambiar el cursor globalmente mientras se redimensiona
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [onUpdate])

  const handleDrop = useCallback((e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault()
    
    if (!draggedBlockId || draggedBlockId === targetBlockId) return
    
    const draggedBlock = blocks.find(b => b.id === draggedBlockId)
    
    // Si estamos sacando un bloque de una columna
    if (canExitColumn && draggedBlock?.parentColumnId) {
      setBlocks(prev => {
        const draggedIndex = prev.findIndex(block => block.id === draggedBlockId)
        const targetIndex = prev.findIndex(block => block.id === targetBlockId)
        
        if (draggedIndex === -1 || targetIndex === -1) return prev
        
        const draggedBlock = prev[draggedIndex]!
        const columnContainer = prev.find(block => block.id === draggedBlock.parentColumnId)
        
        // Remover el bloque de la columna y limpiar sus propiedades de columna
        const cleanedBlock = {
          ...draggedBlock,
          parentColumnId: undefined,
          columnIndex: undefined
        }
        
        // Actualizar el contenedor de columnas
        let updatedBlocks = prev.filter(block => block.id !== draggedBlockId)
        
        if (columnContainer?.columnChildren) {
          const remainingChildren = columnContainer.columnChildren.filter(childId => childId !== draggedBlockId)
          
          // Si solo queda un bloque en la columna, convertir de vuelta a bloque normal
          if (remainingChildren.length === 1) {
            const remainingBlockId = remainingChildren[0]!
            updatedBlocks = updatedBlocks.map(block => {
              if (block.id === remainingBlockId) {
                // Quitar las propiedades de columna del bloque restante
                const { columnIndex, parentColumnId, ...cleanBlock } = block
                return cleanBlock
              }
              return block
            })
            // Eliminar el contenedor de columnas
            updatedBlocks = updatedBlocks.filter(block => block.id !== draggedBlock.parentColumnId)
          } else {
            // Actualizar la lista de hijos en el contenedor
            updatedBlocks = updatedBlocks.map(block => 
              block.id === draggedBlock.parentColumnId 
                ? { ...block, columnChildren: remainingChildren }
                : block
            )
          }
        }
        
        // Determinar la posición de inserción
        const newTargetIndex = updatedBlocks.findIndex(block => block.id === targetBlockId)
        let insertIndex = newTargetIndex
        
        if (dragPosition === 'bottom') {
          insertIndex += 1
        }
        
        // Insertar el bloque limpio en la nueva posición
        const updated = [
          ...updatedBlocks.slice(0, insertIndex),
          cleanedBlock,
          ...updatedBlocks.slice(insertIndex)
        ]
        
        onUpdate?.(updated)
        return updated
      })
    } else if (dragColumnPosition && showColumnPreview) {
      // Si estamos creando columnas
      createColumnLayout(targetBlockId, draggedBlockId, dragColumnPosition)
    } else {
      // Comportamiento normal de reordenamiento
      setBlocks(prev => {
        const draggedIndex = prev.findIndex(block => block.id === draggedBlockId)
        const targetIndex = prev.findIndex(block => block.id === targetBlockId)
        
        if (draggedIndex === -1 || targetIndex === -1) return prev
        
        const draggedBlock = prev[draggedIndex]!
        const newBlocks = prev.filter(block => block.id !== draggedBlockId)
        
        // Determinar la posición de inserción
        let insertIndex = targetIndex
        if (draggedIndex < targetIndex) {
          insertIndex = targetIndex - 1
        }
        
        if (dragPosition === 'bottom') {
          insertIndex += 1
        }
        
        // Insertar el bloque en la nueva posición
        const updated = [
          ...newBlocks.slice(0, insertIndex),
          draggedBlock,
          ...newBlocks.slice(insertIndex)
        ]
        
        onUpdate?.(updated)
        return updated
      })
    }
    
    setDraggedBlockId(null)
    setDragOverBlockId(null)
    setDragPosition(null)
    setDragColumnPosition(null)
    setShowColumnPreview(false)
    setCanExitColumn(false)
  }, [draggedBlockId, dragPosition, dragColumnPosition, showColumnPreview, createColumnLayout, onUpdate, blocks])

  const handleSlashCommand = useCallback((blockId: string, newType: BlockType) => {
    // Cambiar tipo de bloque
    changeBlockType(blockId, newType)
    
    // Limpiar el contenido del bloque (quitar el comando slash)
    const targetBlock = blocks.find(b => b.id === blockId)
    if (targetBlock) {
      const content = targetBlock.content
      const slashIndex = content.lastIndexOf('/')
      if (slashIndex !== -1) {
        const newContent = content.substring(0, slashIndex)
        updateBlock(blockId, newContent, newContent)
      }
    }
    
    // Cerrar menús
    setSlashMenuBlockId(null)
    setSlashQuery('')
    setPlusMenuBlockId(null) // También cerrar el menú plus si está abierto
    
    // Enfocar el bloque
    setTimeout(() => {
      const blockElement = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement
      if (blockElement) {
        blockElement.focus()
        // Posicionar cursor al final
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(blockElement)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }, 10)
  }, [blocks, changeBlockType, updateBlock])

  const [plusMenuPosition, setPlusMenuPosition] = useState({ top: 0, left: 0 })
  

  
  const handleOpenPlusMenu = useCallback((blockId: string, event: React.MouseEvent) => {
    // Encontrar el bloque completo en lugar del botón
    const blockElement = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement
    if (!blockElement) return
    
    const rect = blockElement.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    
    // Calcular posición con mejor adaptación a los bordes
    const menuHeight = 380 // Altura máxima del menú (reducida)
    const viewportHeight = window.innerHeight
    
    let top = rect.top + scrollTop - 70
    
    // Si el menú se saldría por abajo, posicionarlo arriba del bloque
    if (rect.top + menuHeight > viewportHeight) {
      top = rect.top + scrollTop - menuHeight + 20
    }
    
    // Asegurar que no se salga por arriba
    if (top < scrollTop + 10) {
      top = scrollTop + 10
    }
    
    setPlusMenuPosition({
      top: top,
      left: rect.left + scrollLeft - 320 // Extremadamente a la izquierda
    })
    setPlusMenuBlockId(blockId)
    setSlashMenuBlockId(null) // Cerrar el menú slash si está abierto
    
    // NO seleccionar el bloque automáticamente para evitar bordes azules
    // El bloque ya mantiene su estado actual sin cambios visuales
  }, [])



  // Cerrar menús cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      
      // Pequeño delay para asegurar que el estado se haya actualizado
      setTimeout(() => {
        const target = event.target as HTMLElement
        
        // Si el target es el botón plus o está dentro de él, no hacer nada
        const plusButton = target.closest('button')
        if (plusButton && (plusButton.querySelector('.lucide-plus') || target.classList.contains('lucide-plus'))) {
          return
        }
        
        // Si no está dentro del menú, cerrar
        if (!target.closest('.plus-menu') && !target.closest('.slash-menu')) {
          setPlusMenuBlockId(null)
          setSlashMenuBlockId(null)
          setHoveredBlock(null)
        }
      }, 10)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Menú de comandos slash estilo Notion con filtrado inteligente
  const SlashMenu = ({ blockId }: { blockId: string }) => {
    const basicBlocks = [
      { 
        type: 'paragraph' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M4.875 4.825c0-.345.28-.625.625-.625h9c.345 0 .625.28.625.625v1.8a.625.625 0 1 1-1.25 0V5.45h-3.25v9.1h.725a.625.625 0 1 1 0 1.25h-2.7a.625.625 0 1 1 0-1.25h.725v-9.1h-3.25v1.175a.625.625 0 1 1-1.25 0z"/>
          </svg>
        ), 
        label: 'Text', 
        description: 'Just start writing with plain text',
        keywords: ['text', 'paragraph', 'p', 'normal'],
        shortcut: ''
      },
      { 
        type: 'heading1' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M4.1 4.825a.625.625 0 1 0-1.25 0v10.35a.625.625 0 0 0 1.25 0V10.4h6.4v4.775a.625.625 0 0 0 1.25 0V4.825a.625.625 0 1 0-1.25 0V9.15H4.1zM17.074 8.45a.6.6 0 0 1 .073.362q.003.03.003.063v6.3a.625.625 0 1 1-1.25 0V9.802l-1.55.846a.625.625 0 1 1-.6-1.098l2.476-1.35a.625.625 0 0 1 .848.25"/>
          </svg>
        ), 
        label: 'Heading 1', 
        description: 'Big section heading',
        keywords: ['title', 'heading', 'h1', 'big', 'large'],
        shortcut: '#'
      },
      { 
        type: 'heading2' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M3.65 4.825a.625.625 0 1 0-1.25 0v10.35a.625.625 0 0 0 1.25 0V10.4h6.4v4.775a.625.625 0 0 0 1.25 0V4.825a.625.625 0 1 0-1.25 0V9.15h-6.4zm10.104 5.164c.19-.457.722-.84 1.394-.84.89 0 1.48.627 1.48 1.238 0 .271-.104.53-.302.746l-3.837 3.585a.625.625 0 0 0 .427 1.082h4.5a.625.625 0 1 0 0-1.25H14.5l2.695-2.518.027-.028c.406-.43.657-.994.657-1.617 0-1.44-1.299-2.488-2.731-2.488-1.128 0-2.145.643-2.548 1.608a.625.625 0 0 0 1.154.482"/>
          </svg>
        ), 
        label: 'Heading 2', 
        description: 'Medium section heading',
        keywords: ['title', 'heading', 'h2', 'medium'],
        shortcut: '##'
      },
      { 
        type: 'heading3' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M2.877 4.2c.346 0 .625.28.625.625V9.15h6.4V4.825a.625.625 0 0 1 1.25 0v10.35a.625.625 0 0 1-1.25 0V10.4h-6.4v4.775a.625.625 0 0 1-1.25 0V4.825c0-.345.28-.625.625-.625M14.93 9.37c-.692 0-1.183.34-1.341.671a.625.625 0 1 1-1.128-.539c.416-.87 1.422-1.382 2.47-1.382.686 0 1.33.212 1.818.584.487.373.843.932.843 1.598 0 .629-.316 1.162-.76 1.533l.024.018c.515.389.892.972.892 1.669 0 .696-.377 1.28-.892 1.668s-1.198.61-1.926.61c-1.1 0-2.143-.514-2.599-1.389a.625.625 0 0 1 1.109-.578c.187.36.728.717 1.49.717.482 0 .895-.148 1.174-.358s.394-.453.394-.67-.116-.46-.394-.67c-.28-.21-.692-.358-1.174-.358h-.461a.625.625 0 0 1 0-1.25h.357a1 1 0 0 1 .104-.01c.437 0 .81-.135 1.06-.326s.351-.41.351-.605-.101-.415-.351-.606-.623-.327-1.06-.327"/>
          </svg>
        ), 
        label: 'Heading 3', 
        description: 'Small section heading',
        keywords: ['title', 'heading', 'h3', 'small'],
        shortcut: '###'
      },
      { 
        type: 'bulletList' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M4.809 12.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M16 13.375a.625.625 0 1 1 0 1.25H8.5a.625.625 0 0 1 0-1.25zM4.809 4.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M16 5.375a.625.625 0 1 1 0 1.25H8.5a.625.625 0 0 1 0-1.25z"/>
          </svg>
        ), 
        label: 'Bulleted list', 
        description: 'Create a simple bulleted list',
        keywords: ['list', 'bullet', 'bullets', 'ul'],
        shortcut: '-'
      },
      { 
        type: 'numberedList' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M5.088 3.026a.55.55 0 0 1 .27.474v4a.55.55 0 0 1-1.1 0V4.435l-.24.134a.55.55 0 1 1-.535-.962l1.059-.588a.55.55 0 0 1 .546.007M8.5 5.375a.625.625 0 1 0 0 1.25H16a.625.625 0 1 0 0-1.25zm0 8a.625.625 0 0 0 0 1.25H16a.625.625 0 1 0 0-1.25zM6 16.55H3.5a.55.55 0 0 1-.417-.908l1.923-2.24a.7.7 0 0 0 .166-.45.335.335 0 0 0-.266-.327l-.164-.035a.6.6 0 0 0-.245.004l-.03.007a.57.57 0 0 0-.426.44.55.55 0 1 1-1.08-.206 1.67 1.67 0 0 1 1.248-1.304l.029-.007c.24-.058.49-.061.732-.01l.164.035c.664.14 1.138.726 1.138 1.404 0 .427-.153.84-.432 1.165L4.697 15.45H6a.55.55 0 0 1 0 1.1"/>
          </svg>
        ), 
        label: 'Numbered list', 
        description: 'Create a list with numbering',
        keywords: ['list', 'numbered', 'ol'],
        shortcut: '1.'
      },
      { 
        type: 'todo' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M7.82 4.037a.625.625 0 0 0-1.072-.644L4.344 7.4 3.008 5.842a.625.625 0 1 0-.949.813l1.9 2.217a.625.625 0 0 0 1.01-.085zm1.928 1.992a.625.625 0 1 0 0 1.25h7.125a.625.625 0 1 0 0-1.25zm-.625 7.275c0-.345.28-.625.625-.625h7.125a.625.625 0 1 1 0 1.25H9.748a.625.625 0 0 1-.625-.625M4.534 10.68a2.625 2.625 0 1 0 0 5.249 2.625 2.625 0 0 0 0-5.25m-1.375 2.624a1.375 1.375 0 1 1 2.75 0 1.375 1.375 0 0 1-2.75 0"/>
          </svg>
        ), 
        label: 'To-do list', 
        description: 'Track tasks with a to-do list',
        keywords: ['todo', 'task', 'checkbox'],
        shortcut: '[]'
      },
      { 
        type: 'quote' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M15.796 4.971a5.067 5.067 0 0 0-5.067 5.067v.635a4.433 4.433 0 0 0 4.433 4.433 3.164 3.164 0 1 0-3.11-3.75 3.2 3.2 0 0 1-.073-.683v-.635a3.817 3.817 0 0 1 3.817-3.817h.635a.625.625 0 1 0 0-1.25zm-9.054 0a5.067 5.067 0 0 0-5.067 5.068v.634a4.433 4.433 0 0 0 4.433 4.433 3.164 3.164 0 1 0-3.11-3.75 3.2 3.2 0 0 1-.073-.683v-.634A3.817 3.817 0 0 1 6.742 6.22h.635a.625.625 0 1 0 0-1.25z"/>
          </svg>
        ), 
        label: 'Quote', 
        description: 'Capture a quote',
        keywords: ['quote', 'citation'],
        shortcut: '"'
      },
      { 
        type: 'code' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M12.6 3.172a.625.625 0 0 0-1.201-.344l-4 14a.625.625 0 0 0 1.202.344zM5.842 5.158a.625.625 0 0 1 0 .884L1.884 10l3.958 3.958a.625.625 0 0 1-.884.884l-4.4-4.4a.625.625 0 0 1 0-.884l4.4-4.4a.625.625 0 0 1 .884 0m8.316 0a.625.625 0 0 1 .884 0l4.4 4.4a.625.625 0 0 1 0 .884l-4.4 4.4a.625.625 0 0 1-.884-.884L18.116 10l-3.958-3.958a.625.625 0 0 1 0-.884"/>
          </svg>
        ), 
        label: 'Code', 
        description: 'Capture a code snippet',
        keywords: ['code', 'snippet'],
        shortcut: '```'
      },
      { 
        type: 'divider' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10z"/>
            <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
          </svg>
        ), 
        label: 'Divider', 
        description: 'Visually divide blocks',
        keywords: ['divider', 'separator', 'line', 'hr', 'horizontal'],
        shortcut: '---'
      },
      { 
        type: 'table' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h11A1.5 1.5 0 0 1 17 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5zM4.5 3.25a.25.25 0 0 0-.25.25v2.75h11.5V3.5a.25.25 0 0 0-.25-.25zM4.25 7.5v2.25h4.5V7.5zm5.75 0v2.25h5.75V7.5zm-5.75 3.5v2.25h4.5V11zm5.75 0v2.25h5.75V11zm-5.75 3.5v2.25h11.5v-2a.25.25 0 0 0-.25-.25H4.5a.25.25 0 0 0-.25.25z"/>
          </svg>
        ), 
        label: 'Table', 
        description: 'Create a table with rows and columns',
        keywords: ['table', 'grid', 'data', 'rows', 'columns'],
        shortcut: ''
      },
      { 
        type: 'math' as BlockType, 
        icon: () => (
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
            <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008.25 14.5a20.565 20.565 0 003.385-3.318C13.42 9.644 15 7.65 15 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C7.359 3.486 6.123 2.5 4.75 2.5zM8.25 12.5c-.97-.97-2.5-2.796-2.5-5 0-.414.336-.75.75-.75s.75.336.75.75c0 2.204 1.53 4.03 2.5 5z"/>
            <path d="M12.5 16.5A2.5 2.5 0 0015 14v-1a.5.5 0 00-1 0v1a1.5 1.5 0 01-1.5 1.5h-1a.5.5 0 000 1h1zm-5 0a.5.5 0 000-1h-1A1.5 1.5 0 015 14v-1a.5.5 0 00-1 0v1a2.5 2.5 0 002.5 2.5h1z"/>
          </svg>
        ), 
        label: 'Math equation', 
        description: 'Display mathematical expressions with LaTeX',
        keywords: ['math', 'equation', 'formula', 'latex', 'mathematics'],
        shortcut: '$$'
      }
    ]

    // Filtrado inteligente con fuzzy search
    const filteredOptions = slashQuery 
      ? basicBlocks.filter(option => {
          const query = slashQuery.toLowerCase()
          return (
            option.label.toLowerCase().includes(query) ||
            option.description.toLowerCase().includes(query) ||
            option.keywords.some(keyword => keyword.includes(query)) ||
            option.type.toLowerCase().includes(query)
          )
        })
      : basicBlocks

    return (
      <div 
        className="slash-menu fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[10px] overflow-hidden"
        style={{
          top: `${slashMenuPosition.top}px`,
          left: `${slashMenuPosition.left}px`,
          width: '324px',
          minWidth: '180px',
          maxWidth: 'calc(100vw - 24px)',
          maxHeight: 'min(448px, 40vh)',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px'
        }}
      >
        {/* Header con filtro */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-[120%] select-none">
              Basic blocks
            </div>
          </div>
          {slashQuery && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Filtering by: <span className="font-medium text-gray-800 dark:text-gray-200">"{slashQuery}"</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="py-1 max-h-[300px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
              No blocks found for "{slashQuery}"
            </div>
          ) : (
            <div className="flex flex-col gap-px relative p-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.type}
                  className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-2 group rounded-md select-none cursor-pointer"
                  onClick={() => handleSlashCommand(blockId, option.type)}
                  style={{ minHeight: '28px', fontSize: '14px', lineHeight: '120%' }}
                >
                  <div className="flex items-center justify-center min-w-[20px] min-h-[20px] ml-2">
                    <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                      <option.icon />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 h-8 flex items-center">
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-gray-800 dark:text-gray-200 font-normal">{option.label}</span>
                      </div>
                    </div>
                  </div>
                  {option.shortcut && (
                    <div className="ml-auto min-w-0 flex-shrink-0 mr-2">
                      <span className="text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap pr-0.5">
                        {option.shortcut}{' '}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center pointer-events-none w-full h-0.5 flex-none">
            <div className="w-full h-px visible border-b border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="flex flex-col gap-px relative p-1">
            <div className="select-none transition-colors cursor-pointer w-full flex rounded-md">
              <div className="flex items-center gap-2 leading-[120%] w-full select-none min-h-7 text-sm px-2">
                <div className="ml-0 mr-0 min-w-0 flex-auto h-8 flex items-center">
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    <div>
                                                  <span className="text-gray-400 dark:text-gray-500">Type "/" for commands</span>
                    </div>
                  </div>
                </div>
                <div className="ml-auto min-w-0 flex-shrink-0">
                  <span className="text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">esc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleEmptyAreaClick = useCallback((e?: React.MouseEvent) => {
    // Si el clic viene de dentro de una tabla, no hacer nada
    if (e && (e.target as HTMLElement).closest('.table-scroll, table')) {
      return
    }

    // Caso 1: No hay bloques - crear el primero
    if (blocks.length === 0) {
      const newBlockId = generateId()
      const newBlock: Block = { id: newBlockId, type: 'paragraph', content: '' }
      setBlocks([newBlock])
      onUpdate?.([newBlock])
      
      setTimeout(() => {
        setSelectedBlockId(newBlockId)
        setTimeout(() => {
          const blockElement = document.querySelector(`[data-block-id="${newBlockId}"] [contenteditable]`) as HTMLElement
          if (blockElement) {
            blockElement.focus()
          }
        }, 10)
      }, 0)
      return
    }

    const lastBlock = blocks[blocks.length - 1]!
    
    // Caso 2: El último bloque está vacío - enfocarlo (excepto si es un divisor o tabla)
    if (lastBlock.type !== 'divider' && lastBlock.type !== 'table' && (!lastBlock.content || lastBlock.content.trim().length === 0)) {
      setSelectedBlockId(lastBlock.id)
      setTimeout(() => {
        const blockElement = document.querySelector(`[data-block-id="${lastBlock.id}"] [contenteditable]`) as HTMLElement
        if (blockElement) {
          blockElement.focus()
          
          // Posicionar cursor al final
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(blockElement)
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }, 10)
      return
    }
    
    // Caso 3: El último bloque tiene contenido O es una tabla/divisor - crear uno nuevo
    const newBlockId = generateId()
    const newBlock: Block = { id: newBlockId, type: 'paragraph', content: '' }
    
    setBlocks(prev => {
      const updated = [...prev, newBlock]
      onUpdate?.(updated)
      return updated
    })
    
    setTimeout(() => {
      setSelectedBlockId(newBlockId)
      setTimeout(() => {
        const blockElement = document.querySelector(`[data-block-id="${newBlockId}"] [contenteditable]`) as HTMLElement
        if (blockElement) {
          blockElement.focus()
        }
      }, 10)
    }, 0)
  }, [blocks, onUpdate])

  return (
    <>
      {/* Estilos básicos */}
      <div dangerouslySetInnerHTML={{ __html: basicStyles }} />
      
      <div className={cn("min-h-screen bg-white dark:bg-[#101729]", className)}>

        
        <div className="max-w-3xl mx-auto px-16 py-16 block-editor-container bg-white dark:bg-[#101729] rounded-lg">
          {/* Título */}
          <div>
            <BlockComponent
              key="title"
              block={titleBlock}
              index={-1}
              isSelected={selectedBlockId === 'title'}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onDuplicate={() => {}}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
              onTypeChange={() => {}}
              onSelect={setSelectedBlockId}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  addBlock('title', 'paragraph')
                } else if (e.key === 'ArrowDown' && blocks.length > 0) {
                  e.preventDefault()
                  setSelectedBlockId(blocks[0]?.id || null)
                }
              }}
              onAddBlock={addBlock}
              onToggleComplete={handleToggleComplete}
              onOpenPlusMenu={handleOpenPlusMenu}
              plusMenuBlockId={plusMenuBlockId}
              isFirst={true}
              isLast={false}
              allBlocks={blocks}
              canExitColumn={false}
            />
          </div>
          
          {/* Bloques */}
          <div className="mt-2">
            {blocks.map((block, index) => {
              // Si este bloque es un contenedor de columnas, renderizar las columnas
              if (block.isColumn && block.columnChildren) {
                // Agrupar los bloques por columna manteniendo el orden de columnChildren
                const columnGroups: Record<number, Block[]> = {}
                
                // Primero, inicializar los grupos de columnas
                const maxColumnIndex = Math.max(
                  ...block.columnChildren
                    .map(childId => blocks.find(b => b.id === childId)?.columnIndex)
                    .filter(index => index !== undefined) as number[]
                )
                
                for (let i = 0; i <= maxColumnIndex; i++) {
                  columnGroups[i] = []
                }
                
                // Ordenar los bloques hijos por su posición en el array principal para mantener el orden visual
                const sortedChildBlocks = block.columnChildren
                  .map(childId => ({
                    block: blocks.find(b => b.id === childId),
                    originalIndex: blocks.findIndex(b => b.id === childId)
                  }))
                  .filter(item => item.block && item.block.columnIndex !== undefined)
                  .sort((a, b) => a.originalIndex - b.originalIndex)
                
                // Luego, agregar los bloques en el orden correcto
                sortedChildBlocks.forEach(({ block: childBlock }) => {
                  if (childBlock && childBlock.columnIndex !== undefined) {
                    columnGroups[childBlock.columnIndex]!.push(childBlock)
                  }
                })
                
                // Convertir a array ordenado por índice de columna
                const sortedColumns = Object.keys(columnGroups)
                  .map(Number)
                  .sort((a, b) => a - b)
                  .map(columnIndex => columnGroups[columnIndex]!)
                  .filter(columnBlocks => columnBlocks.length > 0)
                
                const columnWidths = block.columnWidths || [50, 50]
                
                return (
                  <div 
                    key={block.id} 
                    className={`column-container ${isResizing && resizingColumnId === block.id ? 'resizing' : ''}`} 
                    data-column-id={block.id}
                  >
                                          {sortedColumns.map((columnBlocks, columnIndex) => (
                        <Fragment key={columnIndex}>
                        <div 
                          className="column-block" 
                          style={{ width: `${columnWidths[columnIndex]}%` }}
                        >
                          {columnBlocks.map((columnBlock) => (
                            <BlockComponent
                              key={columnBlock.id}
                              block={columnBlock}
                              index={blocks.findIndex(b => b.id === columnBlock.id)}
                              isSelected={selectedBlockId === columnBlock.id}
                              onUpdate={updateBlock}
                              onDelete={deleteBlock}
                              onDuplicate={duplicateBlock}
                              onMoveUp={moveBlockUp}
                              onMoveDown={moveBlockDown}
                              onTypeChange={changeBlockType}
                              onSelect={setSelectedBlockId}
                              onKeyDown={handleKeyDown}
                              onAddBlock={addBlock}
                              onToggleComplete={handleToggleComplete}
                              onOpenPlusMenu={handleOpenPlusMenu}
                              plusMenuBlockId={plusMenuBlockId}
                              isFirst={false}
                              isLast={false}
                              allBlocks={blocks}
                              // Drag and drop props
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              isDragging={draggedBlockId === columnBlock.id}
                              isDragOver={dragOverBlockId === columnBlock.id}
                              dragPosition={dragOverBlockId === columnBlock.id ? dragPosition : null}
                              // Props para columnas
                              dragColumnPosition={dragOverBlockId === columnBlock.id ? dragColumnPosition : null}
                              showColumnPreview={dragOverBlockId === columnBlock.id ? showColumnPreview : false}
                              canExitColumn={dragOverBlockId === columnBlock.id ? canExitColumn : false}
                            />
                          ))}
                        </div>
                        
                                                {/* Divisor redimensionable entre columnas */}
                        {columnIndex < sortedColumns.length - 1 && (
                          <div 
                            className={`column-resizer ${isResizing && resizingColumnId === block.id ? 'resizing' : ''}`}
                            onMouseDown={(e) => {
                              console.log('Mouse down on resizer') // Debug
                              handleResizeStart(e, block.id)
                            }}
                            title="Drag to resize columns"
                          />
                        )}
                       </Fragment>
                    ))}
                  </div>
                )
              }
              
              // Si este bloque está dentro de una columna, no renderizarlo aquí (ya se renderiza arriba)
              if (block.parentColumnId) {
                return null
              }
              
              // Renderizado normal para bloques que no están en columnas
              return (
                <div key={block.id}>
                  <BlockComponent
                    block={block}
                    index={index}
                    isSelected={selectedBlockId === block.id}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                    onDuplicate={duplicateBlock}
                    onMoveUp={moveBlockUp}
                    onMoveDown={moveBlockDown}
                    onTypeChange={changeBlockType}
                    onSelect={setSelectedBlockId}
                    onKeyDown={handleKeyDown}
                    onAddBlock={addBlock}
                    onToggleComplete={handleToggleComplete}
                    onOpenPlusMenu={handleOpenPlusMenu}
                    plusMenuBlockId={plusMenuBlockId}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                    allBlocks={blocks}
                    // Drag and drop props
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    isDragging={draggedBlockId === block.id}
                    isDragOver={dragOverBlockId === block.id}
                    dragPosition={dragOverBlockId === block.id ? dragPosition : null}
                    // Props para columnas
                    dragColumnPosition={dragOverBlockId === block.id ? dragColumnPosition : null}
                    showColumnPreview={dragOverBlockId === block.id ? showColumnPreview : false}
                    canExitColumn={dragOverBlockId === block.id ? canExitColumn : false}
                  />
                </div>
              )
            })}
          </div>
          
          {/* Área clickeable vacía */}
          <div 
            className="min-h-[200px] w-full cursor-text"
            onClick={(e) => handleEmptyAreaClick(e)}
          />
          
          {/* Menú slash */}
          {slashMenuBlockId && (
            <SlashMenu blockId={slashMenuBlockId} />
          )}
        </div>
      </div>
      
      {/* Barra de herramientas flotante */}
      <FloatingToolbar />
      
      {/* Menú de colores */}
      <ColorMenu />
      
      {/* Menús flotantes fuera del contenedor principal */}
      {plusMenuBlockId && (
        <div 
          className="plus-menu fixed z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[10px] overflow-hidden flex flex-col"
          style={{ 
            top: `${plusMenuPosition.top}px`,
            left: `${plusMenuPosition.left}px`,
            width: '320px',
            minWidth: '180px',
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: 'min(380px, 50vh)',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px'
          }}
        >
                      {(() => {
            return (
              <>
                                 {/* Contenido */}
                 <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800" style={{ maxHeight: 'calc(50vh - 50px)' }}>
                  {blockCategories.map((category, categoryIndex) => (
                    <div key={category.title}>
                                             {/* Header de categoría */}
                       <div className="px-3 py-1.5 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700">
                         <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-[120%] select-none">
                           {category.title}
                         </div>
                       </div>
                      
                                             {/* Bloques de la categoría */}
                       <div className="flex flex-col gap-px relative px-1 py-1">
                        {category.blocks.map((option) => (
                          <button
                            key={option.type}
                            className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-2 group rounded-md select-none cursor-pointer px-2 py-1.5"
                            onMouseEnter={() => setHoveredBlock(option.type)}
                            onMouseLeave={() => setHoveredBlock(null)}
                            onClick={() => {
                              changeBlockType(plusMenuBlockId, option.type)
                              setPlusMenuBlockId(null)
                              setHoveredBlock(null)
                              
                              // Enfocar el bloque después del cambio
                              setTimeout(() => {
                                const blockElement = document.querySelector(`[data-block-id="${plusMenuBlockId}"] [contenteditable]`) as HTMLElement
                                if (blockElement) {
                                  blockElement.focus()
                                  // Posicionar cursor al final
                                  const selection = window.getSelection()
                                  const range = document.createRange()
                                  range.selectNodeContents(blockElement)
                                  range.collapse(false)
                                  selection?.removeAllRanges()
                                  selection?.addRange(range)
                                }
                              }, 0)
                            }}
                            style={{ minHeight: '38px', fontSize: '14px', lineHeight: '120%' }}
                          >
                            <div className="flex items-center justify-center min-w-[20px] min-h-[20px]">
                              <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                                <option.icon />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight mb-0.5">
                                {option.label}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                {option.description}
                              </div>
                            </div>
                            {option.shortcut && (
                              <div className="ml-auto min-w-0 flex-shrink-0">
                                <span className="text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">
                                  {option.shortcut}
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Separador entre categorías */}
                      {categoryIndex < blockCategories.length - 1 && (
                        <div className="mx-3 h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex flex-col gap-px relative p-1">
                    <div className="select-none transition-colors cursor-pointer w-full flex rounded-md">
                      <div className="flex items-center gap-2 leading-[120%] w-full select-none min-h-7 text-sm px-2">
                        <div className="ml-0 mr-0 min-w-0 flex-auto h-8 flex items-center">
                          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                            <div>
                              <span className="text-gray-400 dark:text-gray-500">Type "/" for quick commands</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-auto min-w-0 flex-shrink-0">
                          <span className="text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">esc</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}
      
      {/* Tooltip de preview */}
      {plusMenuBlockId && hoveredBlock && (
        (() => {
          const hoveredOption = blockCategories
            .flatMap(cat => cat.blocks)
            .find(block => block.type === hoveredBlock)
          
          if (!hoveredOption?.preview) return null
          
          return (
            <div 
              className="fixed z-[10000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[10px] overflow-hidden pointer-events-none"
              style={{ 
                top: `${plusMenuPosition.top}px`,
                left: `${plusMenuPosition.left + 340}px`, // A la derecha del menú principal
                width: '280px',
                maxHeight: '300px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px'
              }}
            >
              {/* Header del preview */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {hoveredOption.preview.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {hoveredOption.preview.description}
                </p>
              </div>
              
              {/* Ejemplo visual */}
              <div className="px-4 py-3">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Vista previa
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 border border-gray-200 dark:border-gray-700 min-h-[80px]">
                  {/* Renderizado visual específico por tipo de bloque */}
                  {hoveredOption.type === 'heading1' && (
                    <div className="text-[24px] font-bold text-gray-800 dark:text-gray-200 leading-[1.3]">
                      Project Introduction
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-2 leading-relaxed">
                        This is how your main heading would look - large and prominent
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'heading2' && (
                    <div className="text-[20px] font-semibold text-gray-800 dark:text-gray-200 leading-[1.3]">
                      Work Methodology
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-2 leading-relaxed">
                        Perfect for organizing subsections
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'heading3' && (
                    <div className="text-[16px] font-semibold text-gray-800 dark:text-gray-200 leading-[1.3]">
                      Technical Considerations
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-2 leading-relaxed">
                        For specific details and important points
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'paragraph' && (
                    <div className="text-[14px] text-gray-800 dark:text-gray-200 leading-[1.5]">
                      This is an example of a normal paragraph. Here you can write any text content.
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        The most versatile block for all types of content
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'bulletList' && (
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-800 dark:text-gray-200 mt-[-0.1rem] select-none">•</span>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200">Main features</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-800 dark:text-gray-200 mt-[-0.1rem] select-none">•</span>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200">User benefits</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Perfect for organizing related information
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'numberedList' && (
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-800 dark:text-gray-200 mt-[-0.1rem] select-none">1.</span>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200">Analyze requirements</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-800 dark:text-gray-200 mt-[-0.1rem] select-none">2.</span>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200">Design architecture</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-800 dark:text-gray-200 mt-[-0.1rem] select-none">3.</span>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200">Implement features</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Ideal for step-by-step processes
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'todo' && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 flex items-center justify-center">
                        </div>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200">Review documentation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200 line-through opacity-60">Complete UI design</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 flex items-center justify-center">
                        </div>
                        <span className="text-[14px] text-gray-800 dark:text-gray-200">Implement authentication</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Keep track of your pending tasks
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'quote' && (
                    <div className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 rounded-r">
                      <div className="text-[14px] text-gray-600 dark:text-gray-300 italic py-2">
                        "Success is the sum of small efforts."
                        <div className="text-right text-[12px] text-gray-500 dark:text-gray-400 mt-1 not-italic">
                          — Robert Collier
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Highlight important quotes and testimonials
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'code' && (
                    <div className="bg-gray-900 dark:bg-black text-gray-100 dark:text-gray-200 p-2 rounded font-mono text-[10px] leading-tight">
                      <div>
                        <span className="text-blue-400">const</span>{' '}
                        <span className="text-blue-300">sum</span>{' = '}
                        <span className="text-gray-300">(</span>
                        <span className="text-blue-300">a</span>
                        <span className="text-gray-300">, </span>
                        <span className="text-blue-300">b</span>
                        <span className="text-gray-300">) {'=> '}</span>
                        <span className="text-blue-300">a</span>
                        <span className="text-gray-300"> + </span>
                        <span className="text-blue-300">b</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-1.5 rounded text-center">
                        Code with syntax highlighting
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'divider' && (
                    <div className="py-4">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-gray-400 dark:bg-gray-500 w-2 h-2 rounded-full"></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                        Elegantly separate sections
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'image' && (
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-100 dark:from-blue-900 to-purple-100 dark:to-purple-900 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-4 mb-2">
                        <div className="text-4xl mb-2">🖼️</div>
                        <div className="text-[12px] text-gray-800 dark:text-gray-200 font-medium">diagrama-arquitectura.png</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">1920 × 1080 • 2.4 MB</div>
                      </div>

                    </div>
                  )}
                  
                  {hoveredOption.type === 'math' && (
                    <div className="text-center">
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 mb-2">
                        <div className="text-[16px] text-gray-800 dark:text-gray-200 font-serif mb-2">
                          E = mc²
                        </div>
                        <div className="text-[14px] text-gray-600 dark:text-gray-400 font-serif">
                          x² + y² = z²
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        LaTeX mathematical equations
                      </div>
                    </div>
                  )}
                  
                  {hoveredOption.type === 'table' && (
                    <div>
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded overflow-hidden mb-2">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800">
                              <th className="px-2 py-1 text-left font-semibold border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">Product</th>
                              <th className="px-2 py-1 text-left font-semibold border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">Price</th>
                              <th className="px-2 py-1 text-left font-semibold text-gray-800 dark:text-gray-200">Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="px-2 py-1 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Laptop</td>
                              <td className="px-2 py-1 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">$999</td>
                              <td className="px-2 py-1 text-gray-700 dark:text-gray-300">25</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="px-2 py-1 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Mouse</td>
                              <td className="px-2 py-1 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">$29</td>
                              <td className="px-2 py-1 text-gray-700 dark:text-gray-300">150</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="px-2 py-1 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Keyboard</td>
                              <td className="px-2 py-1 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">$79</td>
                              <td className="px-2 py-1 text-gray-700 dark:text-gray-300">80</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Interactive table with editable cells
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()
      )}

    </>
  )
}  