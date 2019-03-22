import PreloaderDom from '../src/PreloaderDom';

const imgPath = './template/example_loader.gif';
PreloaderDom.themes.add('test', {});

const preloaderDOM = document.getElementById('preloader');
const preloader = new PreloaderDom(preloaderDOM, {
  theme: 'test'
});

console.log(preloader);

setTimeout(() => {
  preloader.show();
}, 2000);

setTimeout(() => {
  preloader.destructor();
}, 6000);

const preloaderDOM2 = document.getElementById('preloader2');
const preloader2 = new PreloaderDom(preloaderDOM2, {
  imgPath
});
PreloaderDom.loadImg(imgPath).then(pathImg => {
  console.log(`load img = "${pathImg}"`);
});
PreloaderDom.defaultImgPreloader = imgPath;

setInterval(() => {
  preloader2.show();
}, 3000);

setInterval(() => {
  preloader2.hide();
}, 4500);

const preloaderDOM3 = document.getElementById('preloader3');
const preloader3 = new PreloaderDom(preloaderDOM3, {
  beforeCloseCallback: () => {
    console.log('close!');
  },
  afterOpenCallback: () => {
    console.log('open!');
  }
});

document.getElementById('show').addEventListener('click', () => {
  preloader3.show();
});
document.getElementById('error').addEventListener('click', () => {
  preloader3.error();
});
document.getElementById('hide').addEventListener('click', () => {
  preloader3.hide();
});
