'use strict';

// DOM에 존재하는 캔버스 요소를 가져와서 2DContext를 생성해놓음.
const ctx = document.querySelector('canvas').getContext('2d');

// size값을 input 요소에서 입력받아 캔버스에 룩업 테이블 정육면체의 각 면을 렌더해주는 함수
// 이 함수가 그려내는 게 뭐냐면, size * size * size 크기의 정육면체가 있다면, 
// 이 정육면체를 한 방향으로 size 번 만큼 썰어놓은 단면을 캔버스 위에 가로 방향으로 펼쳐서 렌더해놓은 것임.
function drawColorCubeImage(ctx, size) {
  const canvas = ctx.canvas; // 2dcontext에는 항상 canvas 요소를 가지고 있음
  canvas.width = size * size; // size만큼의 너비를 갖는 육면체를 size 횟수만큼 자른 단면을 캔버스에 가로 방향으로 펼쳐서 렌더해주기 위해 canvas.width를 size * size로 할당함.
  canvas.height = size; // size만큼의 높이를 갖는 육면체의 단면을 렌더하려면 canvas.height을 size로 할당해야겠지

  for (let zz = 0; zz < size; zz++) {
    for (let yy = 0; yy < size; yy++) {
      for (let xx = 0; xx < size; xx++) {
        // xx / (size - 1)은 0 ~ 1 사이의 값이고, 이거를 255랑 곱한 값을 소수점 버림하여 정수값만 r에 할당함.
        // 그러면 size*size로 나누어지는 각 단면의 픽셀들의 r, g, b값들에 (255 / size) 단위로 대략 구해지는 0 ~ 255 사이의 정수값들을 각각 할당해 줌.
        // 따라서 각 단면의 픽셀들이 각자의 육면체 상에서의 Vector3 좌표값에 비례하는 r, g, b값을 부여받기 때문에 색상값이 약간씩 다를거임.
        const r = Math.floor(xx / (size - 1) * 255);
        const g = Math.floor(yy / (size - 1) * 255);
        const b = Math.floor(zz / (size - 1) * 255);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`; // 각 픽셀의 색상값을 fillStyle로 지정해주고
        // z방향으로 단면을 자르기 때문에, zz * size는 단면 하나의 너비라고 볼 수 있음. 그렇다면 여기에 xx를 더한다면?
        // 단면 하나 안에서의 픽셀의 x좌표값, y는 말그대로 픽셀의 y좌표값일거고...
        // 이거를 위치값으로 하는 1*1 정사각형을 캔버스에 하나씩 그려주라는 것.
        // 위에서 canvas.width, height도 size로 지정해줬고, 3중 for loop도 size 횟수만큼 돌리고 있기 때문에
        // 지정된 캔버스 크기에 딱 맞는 갯수로 픽셀들이 렌더될거임. 
        ctx.fillRect(zz * size + xx, yy, 1, 1);
      }
    }
  }

  // 캔버스 요소 아래에 존재하는 span 태그들을 가져와서 캔버스의 사이즈를 각 요소의 내부 텍스트로 할당해 줌.
  document.querySelector('#width').textContent = canvas.width;
  document.querySelector('#height').textContent = canvas.height;
}

// 페이지를 맨 처음 로드했을 때 size를 8로 전달하여 호출해주면 
// 8*8*8 사이즈의 정육면체를 8개의 단면으로 채썰어서(?) 캔버스에 가로방향의 띠 형태로 렌더해 줌. 
drawColorCubeImage(ctx, 8);

function handleSizeChange(e) {
  // e.target은 이벤트가 '일어난' 객체를 리턴해 줌. 원래 이것은 반드시 이벤트핸들러가 등록된 객체는 아님. 
  // 만약 change 이벤트가 발생한다면, DOM 트리를 따라 이벤트가 발생한 가장 안쪽 요소(여기서는 input 태그가 이벤트가 발생한 가장 최하위 요소니까)가 리턴됨.
  // 이벤트 전파를 캡쳐링으로 지정해줬기 때문에, document에서 input까지 내려가다가 change 이벤트가 등록된 핸들러들도 동작시키겠지? 그게 바로 아래 sizeElem에 대해 등록한 이벤트리스너임. 
  const elem = e.target; // 어쨋든 input 태그가 들어가게 되겠지
  elem.style.background = '';

  /**
   * try {
   *   // 코드... 
   * } catch (err) {
   *   // 에러 핸들링
   * }
   * 
   * try..catch 문법은 뭐냐면,
   * 원래 자바스크립트는 런타임 중 에러가 발생하면 스크립트가 중단되고 콘솔창에 에러메시지가 출력되는 게 당연하잖아?
   * 이거를 '스크립트가 죽는다'라고 표현함. 근데 이 상황에서는 사용자가 개발자 도구를 열어보지 않는 한 뭐가 문제인지 알 수가 없다.
   * 
   * 그럼 사용자는 여기서 가만히 있어야 할까? 안되겠지.
   * 사용자는 그냥 스크립트가 죽어버리고 끝나는 것을 싫어함. 어떻게 해야 할 지를 모르니까. 어쩌라는 건지 모르잖아.
   * 
   * 그래서 try..catch구문을 사용하면 
   * try 안의 코드를 먼저 실행해 줌. 만약 에러가 없으면 catch block은 건너뛰고 다음 코드를 실행함.
   * 근데 만약 에러가 있다? 그럼 try 내부의 코드는 중단되고, catch block으로 넘어가서 에러를 제어하는 코드를 실행함.
   * 
   * 이때 catch는 항상 무슨 일이 발생했는지에 대한 설명이 담긴 에러 객체(err)를 인자로 받도록 해줘야 함.
   */
  try {
    // parseInt는 원래 숫자가 포함된 문자열을 받아서 그것을 정수로 변환하여 리턴해주는 메서드임.
    // 근데 input은 애초에 type을 number로 지정해서 숫자만 받도록 했는데 굳이 이게 필요할까?
    // 그런 상황이 있을수 있음. 예를 들어, 8을 넣어주려는 걸 실수로 08 또는 8.34 이런 값으로 넣어주더라도,
    // parseInt는 전달받은 숫자(문자열이 아닌 값)를 다시 문자열로 변환하여 그거를 정수값으로 만들어서 리턴해 주는거지.
    const size = parseInt(elem.value);
    if (size >= 2 && size <= 64) {
      // 입력받은 값을 정수로 변환하여 리턴받은 size값이 2보다 크고, 64보다 작을 경우에만 if block을 수행하여 size값을 넘겨주면서 drawColorCubeImage 함수를 실행함.
      drawColorCubeImage(ctx, size);
    }
  } catch (e) {
    // 만약 try 내의 구문을 실행하는 도중 에러가 발생한다면, 스크립트를 중단하지 않고 catch 블록으로 넘어와서
    // input 태그의 배경색을 red로 지정해주는 에러 처리 작업을 진행함.
    elem.style.background = 'red';
  }
}

const sizeElem = document.querySelector('#size'); // size값을 입력받는 input 태그를 가져옴.
// change event는 <input>, <select>, <textarea> 등의 요소에서 사용자에 의해 요소 값이 변경되었을 때 발생함.
// input의 숫자값을 사용자가 바꾸면 handleSizeChange() 함수를 호출하는 이벤트를 걸어놓았는데, 이때 해당 이벤트를 캡쳐렁으로 전파하도록 함.
// 따라서 DOM 최상위 노드이자 전역객체인 document에서부터 input요소까지 이벤트를 전파함.
sizeElem.addEventListener('change', handleSizeChange, true);

/**
 * 아래와 같이
 * 
 * function() {
 * 
 * }();
 * 
 * 이렇게 끝에 (); 를 붙여주는 것을
 * 함수를 정의하자마자 호출하는 '즉시실행함수'라고 함. 
 * 
 * 아래의 즉시실행함수가 정의되자마자 실행되면, function saveData() 함수가 리턴되어서
 * const saveData에 할당되기 때문에, 얘를 아래의 이벤트핸들러 콜백함수에서 toBlob 메서드 내부에서 
 * saveData(blob, filename) 이렇게 호출해주면, const saveData를 호출했지만, 결과적으로 그 안에 할당된 내부 중첩함수가
 * 호출되는 셈이 되어버림.
 * 
 * 1번 예제에서 사용했던 것과 동일한 방식. 
 * 이런 즉시실행함수의 첫 번째 함수는 익명함수로 작성된다는 점.
 * 그리고 즉시실행함수를 생성하는 (); 괄호를 마지막에 추가해줘야 한다는 점을 기억할 것!
 * 
 * 또 참고로 three-basic-screenshot 에서도 아래와 같이 캔버스에 렌더된 이미지를 blob으로 변환해서 다운받는 코드를 작성했으니 참고할 것.
 */
const saveData = (function () {
  const a = document.createElement('a'); // a 태그 생성
  document.body.appendChild(a); // a 태그를 body에 추가
  a.style.display = 'none'; // a 태그를 body에 추가했지만 화면에는 안보이도록 함.

  return function saveData(blob, fileName) {
    // createObjectURL(object)는 File, Blob, MediaSource 등의 객체를 전달받아서 해당 객체의 참조 URL을 담은 DOMString으로 리턴해 줌.
    // 여기서는 toBlob의 콜백함수로부터 전달받은 blob객체를 전달해 줌.
    const url = window.URL.createObjectURL(blob);

    // 위의 blob객체의 참조 URL이 담긴 DOMString을 a태그의 href에 할당함.
    a.href = url;

    // a태그의 download 속성을 할당하여 링크를 클릭하면 a태그의 href에 지정된 파일이 다운로드될 수 있도록 함.
    // 참고로 download 속성에 fileName을 입력하면 다운로드받는 파일의 이름도 지정해줄 수 있음.
    a.download = fileName;

    // DOMElemnt의 click 이벤트를 시뮬레이션해줌. -> href에 지정된 blob객체 파일이 다운로드되겠지
    a.click();
  }
}());

/**
 * save button을 클릭하면 blob을 생성하도록 함.
 * 
 * canvas.toBlob은
 * WebGLRenderer에 담긴 캔버스에 그려진 이미지를 
 * Blob Object(이미지, 사운드, 동영상 등 대용량 바이너리 데이터를 담을 수 있는 객체)로 만들어 줌.
 * 
 * 이 때, canvas.toBlob()은 새롭게 생성한 blob 오브젝트를 단일 인자로 받는 콜백함수를
 * 파라미터로 전달받을 수 있음.
 */
document.querySelector('button').addEventListener('click', () => {
  ctx.canvas.toBlob((blob) => {
    saveData(blob, `identity-lut-s${ctx.canvas.height}.png`);
  })
});