(function(){
  const paths={
    plus:'M12 5v14M5 12h14',up:'M12 19V5m-5 5 5-5 5 5',down:'M12 5v14m-5-5 5 5 5-5',chevron:'m8 5 7 7-7 7',chevronDown:'m5 9 7 7 7-7',
    search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',close:'m6 6 12 12M6 18 18 6',
    undo:'M4 10h10a6 6 0 0 1 0 12M4 10l5-5M4 10l5 5',redo:'M20 10H10a6 6 0 0 0 0 12m10-12-5-5m5 5-5 5',
    lock:'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4',unlock:'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0',
    expand:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5',sliders:'M4 7h16M4 17h16M9 4v6m6 4v6',
    structure:'M7 5h14M7 12h14M7 19h14M3 5h.01M3 12h.01M3 19h.01',
    save:'M4 3h13l4 4v14H3V3zM7 3v6h10V3M7 21v-8h10v8',download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    file:'M14 2H5v20h14V7zM14 2v5h5M8 12h8M8 16h8',import:'M14 2H5v6m9-6v5h5v15H5v-6M2 12h10m-4-4 4 4-4 4',
    print:'M6 8V3h12v5M6 17H3V9h18v8h-3M6 14h12v8H6zM17 11h.01',trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',shield:'M12 2l8 3v6c0 5-8 11-8 11S4 16 4 11V5zM8 11l3 3 5-6',grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',align:'M3 5h18M3 10h12M3 15h18M3 20h12',alignCenter:'M3 5h18M6 10h12M3 15h18M6 20h12',alignRight:'M3 5h18M9 10h12M3 15h18M9 20h12'
  };
  function icon(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('ui-icon');
    if(name==='grip'||name==='more'){for(const [x,y] of name==='grip'?[[9,5],[15,5],[9,12],[15,12],[9,19],[15,19]]:[[5,12],[12,12],[19,12]]){const circle=document.createElementNS(svg.namespaceURI,'circle');circle.setAttribute('cx',x);circle.setAttribute('cy',y);circle.setAttribute('r','1.5');circle.setAttribute('fill','currentColor');circle.setAttribute('stroke','none');svg.append(circle);}}
    else{const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.plus);svg.append(path);}return svg;
  }
  function label(element,name,text){element.replaceChildren(icon(name));if(text){const span=document.createElement('span');span.textContent=text;element.append(span);}}
  window.JSONIcons={icon,label};const actions={format:'align',minify:'alignCenter',copy:'file',download:'download',cancel:'close',clear:'trash',open:'import',sample:'file',textTab:'file',treeTab:'structure',previous:'up',next:'down',collapse:'chevronDown',expand:'expand',more:'plus',closeFallback:'close'};for(const [id,name] of Object.entries(actions)){const element=document.getElementById(id);if(element){const text=element.textContent;label(element,name,['previous','next'].includes(id)?'':text);}}
})();
