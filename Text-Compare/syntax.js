// Local lexical highlighting; user input is always rendered as text.
(function(root){
  function detectLanguage(text,name=''){
    const extension=name.split('.').pop().toLowerCase();
    const languages={js:'javascript',ts:'javascript',jsx:'javascript',tsx:'javascript',json:'json',html:'html',htm:'html',css:'css',py:'python'};
    if(languages[extension])return languages[extension];
    if(/^\s*[\[{]/.test(text)){try{JSON.parse(text);return 'json';}catch{}}
    if(/^\s*<(!doctype|html|div|body)/i.test(text))return 'html';
    if(/\b(const|let|function)\b|=>/.test(text))return 'javascript';
    if(/^(def |class |import |from )/m.test(text))return 'python';
    return 'plain';
  }
  function syntaxTokens(text,language){
    if(language==='plain'||text.length>20000)return [{text,type:''}];
    const patterns={
      javascript:/(\/\/[^\n]*|\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|for|while|class|new|import|export|from|true|false|null|async|await|try|catch|throw)\b|\b\d+(?:\.\d+)?\b)/g,
      python:/(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:def|class|return|if|else|elif|for|while|import|from|True|False|None|try|except|raise|with|as|in|and|or|not)\b|\b\d+(?:\.\d+)?\b)/g,
      json:/("(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b)/g,
      html:/(<!--[\s\S]*?-->|<\/?[\w-]+|\b[\w-]+(?==)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
      css:/(\/\*.*?\*\/|#[\da-fA-F]{3,8}\b|[\w-]+(?=\s*:)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?(?:px|em|rem|%|s)?)/g
    };
    const pattern=patterns[language];if(!pattern)return [{text,type:''}];
    const result=[];let start=0;
    for(const match of text.matchAll(pattern)){if(match.index>start)result.push({text:text.slice(start,match.index),type:''});const t=match[0];result.push({text:t,type:/^(\/\/|\/\*|<!--)/.test(t)||(language==='python'&&t[0]==='#')?'comment':/^["'`]/.test(t)?'string':/^-?\d/.test(t)?'number':'keyword'});start=match.index+t.length;}
    if(start<text.length)result.push({text:text.slice(start),type:''});return result;
  }
  const api={detectLanguage,syntaxTokens};if(typeof module!=='undefined')module.exports=api;else root.Syntax=api;
})(globalThis);

