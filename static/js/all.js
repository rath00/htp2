const saveBtn = document.querySelector('.saveBtn');
const brushSize = document.querySelector('.brushSize');
const done = document.querySelector('.done');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const paintBoard = document.querySelector("#paint_board");
let posX, posY;
let mouse;
let touch = false;
let ww, wh;
let step = 0;
let status = false;
let updateHistory = false;
let drawHistory = [];
let content = [];
let brush = {
  color:"#000000",
  size:5,
};

let chunksLis = [];
const stream = canvas.captureStream(60); // 60 FPS recording
const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9'
});
recorder.ondataavailable = e => {
  chunksLis.push(
        e.data
    );
};

const startRecord = () => {
  recorder.start(10);
};

const interfaceSetup = () => {
  const header = document.querySelector('#paint_board .header');
  const footer = document.querySelector('#paint_board .footer');
  const container = document.querySelector('#paint_board .container');
  const functionBar = document.querySelectorAll('.functionBar');
  const barContainer = document.querySelectorAll('.barContainer');
  const {innerWidth, innerHeight} = window;
  header.style.width = innerWidth + 'px';
  footer.style.width = innerWidth + 'px';
  container.style.height = innerHeight * 0.8 + 'px';
  for(let i = 0;i<functionBar.length;i++){
    functionBar[i].style.width = innerWidth * 0.1 + 'px';
  };
  for(let i = 0;i<barContainer.length;i++){
    barContainer[i].style.width = innerWidth * 0.1 * 0.9 + 'px';
  };
  done.style.width = innerWidth * 0.1 * 0.9 + 'px';
};

const dowloadVedio = () => {
  const link = document.createElement('a');
  link.style.display = 'none';
  const fullBlob = new Blob(chunksLis);
  const downloadUrl = window.URL.createObjectURL(fullBlob);
  link.href = downloadUrl;
  link.download = `test${Math.random()}.webm`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

const drawDone = () => {
  const image = canvas.toDataURL('image/png');
  const resultPage = document.querySelector('#result_page');
  recorder.setAttribute('href', image);

  saveBtn.setAttribute('href', image);

  done.ATTRIBUTE_NODE
  changePage(resultPage);
  trackingImg(image);
};

const save = () =>{
  const image = canvas.toDataURL('image/png');
  saveBtn.setAttribute('href', image);
};


const initial = () =>{
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.8;
  ctx.lineWidth = brush.size;
  ctx.lineCap = 'round'
  ctx.strokeStyle = brush.color;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ww, wh);
  step = 0;
  drawHistory = [];
  pushHistory();
}

const undo = (e) =>{
  e.preventDefault;
  if(step < 0){
    return;
  }
  const pic = new Image();
  step -= 1;
  pic.src = drawHistory[step];;
  pic.onload = () =>{
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.drawImage(pic, 0, 0);
    updateHistory = true;
  }
}

const redo = (e) =>{
  e.preventDefault;
  if((step < 0)&&(step == (drawHistory.length-1))){
    return;;
  };
  const pic = new Image();
  step += 1;
  pic.src = drawHistory[step];
  pic.onload = () =>{
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.drawImage(pic, 0, 0);
    console.log(step)
    console.log(drawHistory.length)
  }
}

const getPos = (e) =>{
  mouse = e.button;
  status = true;
  posX = e.offsetX;
  posY = e.offsetY;
  if(e.type == "touchstart"){
    touch = true;
    posX = e.touches[0].clientX;
    posY = e.touches[0].clientY;
  }
}

const draw = (e) =>{
  e.preventDefault();
  if(((status==false)||(mouse != 0))&&((status==false)||(touch != true))){
    return;
  }
  ctx.beginPath();
  ctx.moveTo(posX, posY);
  if(touch){
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
    ctx.stroke();
    posX = e.touches[0].clientX;
    posY = e.touches[0].clientY;
    return
  }
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.stroke();
  posX = e.offsetX;
  posY = e.offsetY;
}

const changeSize = (e) =>{
  const {size} = e.target.dataset;
  brush.size = size;
  ctx.lineWidth = brush.size;
}

const changeColor = (e) =>{
  brush.color = e.target.style.background;
  ctx.strokeStyle = brush.color;
}

const brushFn = () =>{
   ctx.strokeStyle = brush.color;
}

const eraser = () =>{
  ctx.strokeStyle = '#fff';
}

const stopDraw = () =>{
  status = false;
  if(updateHistory){
    drawHistory.splice(step+1);
    updateHistory = false;
  }
  step += 1;
  pushHistory()
}

const pushHistory = () =>{
  drawHistory.push(canvas.toDataURL())
}

const load = () =>{
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
  initial();
}

const eventListaner = () => {
  const undoBtn = document.querySelector('.undoBtn');
  const redoBtn = document.querySelector('.redoBtn');
  const clearAll  = document.querySelector('.clearAll');
  const brushType = document.querySelector('.brushType');
  const eraserBtn = document.querySelector('.eraserBtn');
  const color = document.querySelectorAll('.color');
  const size = document.querySelectorAll('.size');
  const canvasContainer = document.querySelector('.canvasContainer');
  const downloadResult = document.querySelector('.download_result');
  const downloadVedio = document.querySelector('.download_vedio');
  canvas.addEventListener('mousedown', getPos);
  canvas.addEventListener('touchstart', getPos, false);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('touchmove', draw, false);
  canvas.addEventListener('mouseup', stopDraw);
  saveBtn.addEventListener('click', save);
  undoBtn.addEventListener('click', undo);
  redoBtn.addEventListener('click', redo);
  clearAll.addEventListener('click', initial);
  brushType.addEventListener('click', brushFn);
  eraserBtn.addEventListener('click', eraser);
  done.addEventListener('click', drawDone);
  downloadResult.addEventListener('click', ()=>dowloadFile(0));
  downloadVedio.addEventListener('click',  ()=>dowloadFile(1));
  canvasContainer.addEventListener('mouseleave', ()=> status = false, false);

  window.addEventListener('resize', initial);
  /*()=>{ 
    touch = false;
  })*/
  const a = document.querySelectorAll('a');
  a.forEach(item => {
    item.addEventListener('click', (e)=> {
      e.preventDefault
    })
  });
  for(i=0;i<color.length;i++){
    color[i].addEventListener('click', changeColor)
  };
  
  for(i=0;i<size.length;i++){
    size[i].addEventListener('click', changeSize)
  }
};

const changePage = (pageEl, displayValue = 'block') => {
  const page = document.querySelectorAll('section');
  page.forEach((item) => item.style.display = 'none');
  pageEl.style.display = displayValue;
};

interfaceSetup();
load();
startRecord();
eventListaner();
changePage(paintBoard);


const panel = document.getElementById('panel');
const resultPage = document.querySelector('#result_page');
const analyzeResult = {};

const trackingImg = (url) => {
  const resultImg = document.querySelector('.result_img img')
  const faceTracker = new tracking.ObjectTracker(['face']);
  faceTracker.setStepSize(1.7);

  const img = new Image();
  img.src = url;
  resultImg.src = url;
  img.src = '../../result-pic/images23.jpg';
  img.onload = function() {
      tracking.track(img, faceTracker);
  };

  faceTracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      plotRect(rect.x, rect.y, rect.width, rect.height);
      const face = cutImage(img, rect.x, rect.y, rect.width, rect.height);
      const hair = getHairRect(img, rect.x, rect.y, rect.width, rect.height);
      // document.body.appendChild(face)
      const hairColor = getMainColor(hair);
      analyzeResult['hairColor'] = hairColor;
    });
  });
  getBody(img);
}

const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  return {canvas, context}
};

const loadFinish = () =>{
  const loadingPage = document.querySelector('.loading_page');
  loadingPage.style.display = 'none';
}


const plotRect = (x, y, w, h) => {
    const rect = document.createElement('div');
    document.querySelector('#panel').appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (panel.offsetLeft + x) + 'px';
    rect.style.top = y + 'px';
};

const cutImage = (img, x, y, w, h) =>{
  const {width, height} = img;
  const {canvas, context} = createCanvas(w, h);
  context.drawImage(img, -x, -y, width, height);
  return canvas;
};

const getHairRect = (img, x, y , w, h) => {
    const translateY = h / 3;
    y -= translateY;
    h = translateY;
    return cutImage(img, x, y, w, h);
};

const getMainColor = (canvas) => {
    const {width, height} = canvas;
    const context = canvas.getContext("2d");
    const data = context.getImageData(0, 0, width, height).data;
    const temp = {}
    const len = data.length
  
    let max = 0;
    let color = ''
    let i = 0
    while(i < len) {
      if (data[i + 3] !== 0) {
        const k = `${data[i]},${data[i + 1]},${data[i + 2]},${(data[i + 3] / 255)}`
        temp[k] = temp[k] ? temp[k] + 1 : 1
        if (temp[k] > max) {
          max = temp[k]
          color = k
        }
      }
      i += 4
    };
    const colorData = [];
    (color.split(',')).forEach((item) => {
      colorData.push(parseInt(item))
    })
    return colorData
};

const isMainArea = (canvas) => {
  const {width, height} = canvas;
  const context = canvas.getContext("2d");
  const data = context.getImageData(0, 0, width, height).data;
  const temp = {transparent:0, printed:0}
  const len = data.length;
  let i = 0;
  while(i < len) {
    const {r, g, b, a} = {
      r: data[i],
      g: data[i+1],
      b: data[i+2],
      a: data[i+3]/255
    };
    if((r == 0)&&(g == 0)&&(b == 0)&&(a == 0)){
      temp['transparent'] = temp['transparent'] ? temp['transparent']+1: 1;
    }else{
      temp['printed'] = temp['printed'] ? temp['printed']+1: 1;
    }
    i += 4;
  };
  return temp['transparent'] > temp['printed'] ? false : true
};



const bodyPixOption = {
  multiplier: 0.75, // 1.0, 0.75, or 0.50, 0.25
  outputStride: 16, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.5, // 0 - 1, defaults to 0.5
  palette: {
    leftFace: {
      id: 0,
      color: [255, 0, 0],
    },
    rightFace: {
      id: 1,
      color: [255, 0, 0],
    },
    rightUpperLegFront: {
      id: 2,
      color: [100, 81, 196],
    },
    rightLowerLegBack: {
      id: 3,
      color: [92, 91, 206],
    },
    rightUpperLegBack: {
      id: 4,
      color: [84, 101, 214],
    },
    leftLowerLegFront: {
      id: 5,
      color: [75, 113, 221],
    },
    leftUpperLegFront: {
      id: 6,
      color: [66, 125, 224],
    },
    leftUpperLegBack: {
      id: 7,
      color: [56, 138, 226],
    },
    leftLowerLegBack: {
      id: 8,
      color: [48, 150, 224],
    },
    rightFeet: {
      id: 9,
      color: [40, 163, 220],
    },
    rightLowerLegFront: {
      id: 10,
      color: [33, 176, 214],
    },
    leftFeet: {
      id: 11,
      color: [29, 188, 205],
    },
    torsoFront: {
      id: 12,
      color: [26, 199, 194],
    },
    torsoBack: {
      id: 13,
      color: [26, 210, 182],
    },
    rightUpperArmFront: {
      id: 14,
      color: [28, 219, 169],
    },
    rightUpperArmBack: {
      id: 15,
      color: [33, 227, 155],
    },
    rightLowerArmBack: {
      id: 16,
      color: [41, 234, 141],
    },
    leftLowerArmFront: {
      id: 17,
      color: [51, 240, 128],
    },
    leftUpperArmFront: {
      id: 18,
      color: [64, 243, 116],
    },
    leftUpperArmBack: {
      id: 19,
      color: [79, 246, 105],
    },
    leftLowerArmBack: {
      id: 20,
      color: [96, 247, 97],
    },
    rightHand: {
      id: 21,
      color: [115, 246, 91],
    },
    rightLowerArmFront: {
      id: 22,
      color: [134, 245, 88],
    },
    leftHand: {
      id: 23,
      color: [155, 243, 88],
    },
  },
};



const getBody = (img) => {
  const bodypix = ml5.bodyPix(async() => {
    await bodypix.segmentWithParts(img,bodyPixOption,getBodyPartMask);
    await bodypix.segment(img,bodyPixOption,getResult);
    loadFinish();
  });
};

const renderResult = (resultContent) => {
  const result = document.querySelector('#result');
  resultContent.forEach(item => {
    result.innerHTML += `<li>${item}</li>`;
  })
}

const getResult = (error, result) => {
  if (error) {
    console.log(error);
    return;
  };
  const {width, height} = result.segmentation;
  const {backgroundMask} = result;
  const {canvas, context} = createCanvas(width, height);
  const imgData = createImageData(backgroundMask, width, height);
  context.putImageData(imgData, 0, 0);
  const url = canvas.toDataURL();
  const img = new Image();
  img.src = url;
  img.onload = async() => {
    analyzeResult['mainAreaData'] = dividePic(canvas);
    await resultDesc(analyzeResult);
    renderResult(content);
  }
};


const getBodyPartMask = (error, result) => {
  if (error) {
    console.log(error);
    return;
  };
  const {width, height} = result.segmentation;
  const {partMask, bodyParts} = result;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  const imgData = createImageData(partMask, width, height);
  context.putImageData(imgData, 0, 0);
  const partSet = havePart(imgData.data, bodyParts);
  analyzeResult['partSet'] = partSet;
  analyzeResult['isTotalBody'] = isTotalBody(partSet);
};


const isTotalBody = (bodySet) => {
  const leftLowerLegFront = bodySet.has(5); 
  const rightFeet = bodySet.has(9);
  const rightLowerLegFront = bodySet.has(10);
  const leftFeet = bodySet.has(11);
  const lowLegFront = leftLowerLegFront && rightLowerLegFront;
  const feet = rightFeet && leftFeet;
  return (lowLegFront && feet) ? true : false;
};

const saveBodyPart = (bodyParts) => {
  const bodyPartSetting = [];
  for(let part in bodyParts){
    let {id, color} = bodyParts[part];
    const [r, g, b] = color;
    bodyPartSetting.push({
      id: id,
      name: part,
      color: {
        r: r,
        g: g,
        b: b
      }
    });
  };
  return bodyPartSetting;
};

const havePart = (imgData, bodyParts) => {
  const partSet =   new Set();
  let bodyPartColorData = saveBodyPart(bodyParts);
  for (let i=0; i < imgData.length;i += 4) {
    const r =  imgData[i];
    const g =  imgData[i+1];
    const b =  imgData[i+2];
    bodyPartColorData.forEach(item => {
      const {color, name, id} = item;
        if((r == color.r) && (g == color.g) && (b == color.b)){
          partSet.add(id)
          // partSet.add({
          //   id: id,
          //   name: name
          // });
          bodyPartColorData = bodyPartColorData.filter((item) => item.name !== name);
        };
    })
  };
  return partSet;
};


const createImageData = (uint8ClampedAry, width, height) => {
  const array = new Uint8ClampedArray(uint8ClampedAry);
  const imgData = new ImageData(array, width, height);
  return imgData
};

const calculateMediaDuration = (media) => {
  return new Promise( (resolve,reject)=>{
    media.onloadedmetadata = function(){
      // set the mediaElement.currentTime  to a high value beyond its real duration
      media.currentTime = Number.MAX_SAFE_INTEGER;
      // listen to time position change
      media.ontimeupdate = function(){
        media.ontimeupdate = function(){};
        // setting player currentTime back to 0 can be buggy too, set it first to .1 sec
        media.currentTime = 0.1;
        media.currentTime = 0;
        // media.duration should now have its correct value, return it...
        resolve(media.duration);
      }
    }
  });
}
let duraiton;
const waitLoadVedio = () => {
  return new Promise(async(resolve, reject) => {
    const fullBlob = new Blob(chunksLis);
    const url = window.URL.createObjectURL(fullBlob);
    const audio = new Audio(url);
    duraiton = calculateMediaDuration(audio);
    resolve(duraiton)
  })
}

const resultDesc = async(analyzeResult) => {
  const {hairColor, mainAreaData, isTotalBody} = analyzeResult;
  return waitLoadVedio().then((duraiton) => {
    const time = Math.round(duraiton);
    if(time <= 300) content.push(`繪畫時間：${time}秒，缺乏自信，可能不願意表現真實的自我，或不知道該把哪些方面表現出來；具有講求細節、追求完美、注重過程的性格`)
    else if((time > 300)&&(time <= 600)) content.push(`繪畫時間：${time}秒，具自信、能夠控制自己，適應能力強，追求平衡`)
    else content.push(`繪畫時間：${time}秒，講求細節、追求完美、注重過程`)
    if(hairColor){
      const colorName = rgbToName(hairColor);
      if(colorName == '黑色'){
        content.push('頭髮為黑色：依本能而生活，追求事物的原始狀態');
      }else if(colorName == '紅色'){
        content.push('頭髮為紅色：喜歡追求刺激，充滿活力和熱情');
      }else if((colorName == '藍色')||(colorName == '靛色')){
        content.push('頭髮為藍色：希望追求浪漫，追求外在的平衡和內在的恬靜');
      }else{
        content.push('頭髮為'+ colorName + '。');
      }
    }else{
      content.push('無法偵測人像');
    }
    if(mainAreaData){
      // console.log(mainAreaData)
      if((!mainAreaData.includes('E'))&& mainAreaData.length != 0){
        content.push('繪畫位置邊緣：沒有安全感、缺乏自信，逃避、沉迷在幻想中');
      };
      if(mainAreaData.length == 9){
        content.push('佔滿畫布：缺乏安全感或內心焦慮');
      };
      if(mainAreaData.length == 3){
        if((mainAreaData.includes('B')&&mainAreaData.includes('E')&&mainAreaData.includes('H'))){
          content.push('人像處於B、E、H區域：具追求均衡的傾向');
        };
        if((mainAreaData.includes('A')&&mainAreaData.includes('D')&&mainAreaData.includes('G'))){
          content.push('人像處於A、D、G區域：具極端的傾向');
        };
        if((mainAreaData.includes('C')&&mainAreaData.includes('F')&&mainAreaData.includes('I'))){
          content.push('人像處於C、F、I區域：具極端的傾向');
        };
      }
      if(mainAreaData.length == 0){
        content.push('無法辨別主要區域');
      };
    };
    if(isTotalBody){
      content.push('人物結構完整：對自身有完整的整體認識，自我意識清楚，自我整合良好');
    }else{
      content.push('人物結構不完整/僅有半身：缺乏對自身的整體認識');
    };
  })
};

const rgbToName = ([r, g, b, a]) => {
  if((r==255)&&(g==0)&&(b==0)) return '紅色';
  if((r==255)&&(g==165)&&(b==0)) return '橙色';
  if((r==255)&&(g==255)&&(b==0)) return '黃色';
  if((r==76)&&(g==175)&&(b==80)) return '綠色';
  if((r==3)&&(g==169)&&(b==244)) return '藍色';
  if((r==63)&&(g==81)&&(b==181)) return '靛色';
  if((r==138)&&(g==74)&&(b==243)) return '紫色';
  if((r==255)&&(g==224)&&(b==210)) return '膚色';
  if((r==255)&&(g==145)&&(b==174)) return '粉色';
  if((r==121)&&(g==85)&&(b==72)) return '褐色';
  if((r==165)&&(g==165)&&(b==165)) return '灰色';
  if((r==0)&&(g==0)&&(b==0)) return '黑色';
  if((r==255)&&(g==255)&&(b==255)) return '白色';
  if((r==88)&&(g==88)&&(b==88)) return '灰色';
};


const getColorName = () => {
    return null
};

const dividePic = (img) => {
  const areaName = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const mainAreaData = [];
  const {width, height} = img;
  const w = width/3;
  const h = height/3;
  const areaA = cutImage(img, 0, 0, w, h);
  const areaB = cutImage(img, w, 0, w, h);
  const areaC = cutImage(img, w*2, 0, w, h);
  const areaD = cutImage(img, 0, h, w, h);
  const areaE = cutImage(img, w, h, w, h);
  const areaF = cutImage(img, w*2, h, w, h);
  const areaG = cutImage(img, 0, h*2, w, h);
  const areaH = cutImage(img, w, h*2, w, h);
  const areaI = cutImage(img, w*2, h*2, w, h);
  const areaCanvasGroup = [areaA, areaB, areaC, areaD, areaE, areaF, areaG, areaH, areaI]
  for(let index in areaCanvasGroup){
    const area = areaCanvasGroup[index];
    const isMain = isMainArea(area);
    if(isMain){
      mainAreaData.push(areaName[index])
    }
  }
  return mainAreaData;
};
const screenshot = () => {
  html2canvas(document.querySelector('body')).then((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
      a.download = 'image.jpg';
      a.click();
  });
}
const dowloadFile = (file) => {
  if(file == 0) screenshot();
  if(file == 1) dowloadVedio();
};


$(function () {
  $(".loader-inner").loaders();
});