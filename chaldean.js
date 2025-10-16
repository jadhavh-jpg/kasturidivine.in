// Chaldean mapping (9 is omitted)
const CHALDEAN = {
  A:1, I:1, J:1, Q:1, Y:1,
  B:2, K:2, R:2,
  C:3, G:3, L:3, S:3,
  D:4, M:4, T:4,
  E:5, H:5, N:5, X:5,
  U:6, V:6, W:6,
  O:7, Z:7,
  F:8, P:8
};

function onlyLetters(str){ return (str||'').toUpperCase().replace(/[^A-Z]/g,''); }

function chaldeanSum(name){
  const letters = onlyLetters(name).split('');
  const values = letters.map(ch => CHALDEAN[ch] || 0);
  const total = values.reduce((a,b)=>a+b,0);
  return { total, values, letters };
}

function digitalRoot(num, keepMasters=true){
  const masterSet = new Set([11,22,33]);
  if(keepMasters && masterSet.has(num)) return num;
  while(num>9){
    if(keepMasters && masterSet.has(num)) return num;
    num = num.toString().split('').reduce((a,b)=>a+parseInt(b,10),0);
  }
  return num;
}

function reduceDate(d, keepMasters=true){
  // d: YYYY-MM-DD
  const [y,m,day] = d.split('-').map(Number);
  const sum = y.toString().split('').concat(m.toString().split('')).concat(day.toString().split('')).reduce((a,b)=>a+parseInt(b,10),0);
  return digitalRoot(sum, keepMasters);
}

function lifePathFromDOB(d, keepMasters=true){
  // more canonical: reduce Y, M, D separately then sum
  const [y,m,day] = d.split('-').map(Number);
  const rY = digitalRoot(y.toString().split('').reduce((a,b)=>a+parseInt(b,10),0), keepMasters);
  const rM = digitalRoot(m, keepMasters);
  const rD = digitalRoot(day, keepMasters);
  return digitalRoot(rY + rM + rD, keepMasters);
}

function personalYear(dob, year, keepMasters=true){
  const [y,m,day] = dob.split('-').map(Number);
  const rM = digitalRoot(m, keepMasters);
  const rD = digitalRoot(day, keepMasters);
  const rY = digitalRoot(year.toString().split('').reduce((a,b)=>a+parseInt(b,10),0), keepMasters);
  return digitalRoot(rM + rD + rY, keepMasters);
}

function formatBreakdown(total, keepMasters=true){
  const reduced = digitalRoot(total, keepMasters);
  return { total, reduced };
}

function suggestAdditions(currentTotal, targetReduced){
  // find minimum k (0..100) such that digitalRoot(currentTotal + k) == targetReduced
  for(let k=0;k<=100;k++){
    if(digitalRoot(currentTotal + k) === targetReduced){
      return k;
    }
  }
  return null;
}

function letterOptionsForSum(k){
  // Simple suggestions: give single-letter options and a few pairs
  const entries = Object.entries(CHALDEAN).filter(([ch,val])=>val>0);
  const single = entries.filter(([ch,val])=>val===k).map(([ch])=>ch);
  const pairs = [];
  for(let i=0;i<entries.length;i++){
    for(let j=i;j<entries.length;j++){
      const a=entries[i], b=entries[j];
      if(a[1]+b[1]===k) pairs.push(a[0]+b[0]);
    }
  }
  return { single, pairs: pairs.slice(0,12) };
}

window.Chaldean = {
  CHALDEAN,
  chaldeanSum,
  digitalRoot,
  lifePathFromDOB,
  personalYear,
  formatBreakdown,
  suggestAdditions,
  letterOptionsForSum
};