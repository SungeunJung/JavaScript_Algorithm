/*
    문제
    눈금의 간격이 1인 M×N(M,N≤100)크기의 모눈종이가 있다. 이 모눈종이 위에 눈금에 맞추어 K개의 직사각형을 그릴 때, 이들 K개의 직사각형의 내부를 제외한 나머지 부분이 몇 개의 분리된 영역으로 나누어진다.
    예를 들어 M=5, N=7 인 모눈종이 위에 <그림 1>과 같이 직사각형 3개를 그렸다면, 그 나머지 영역은 <그림 2>와 같이 3개의 분리된 영역으로 나누어지게 된다.

    <그림 2>와 같이 분리된 세 영역의 넓이는 각각 1, 7, 13이 된다.
    M, N과 K 그리고 K개의 직사각형의 좌표가 주어질 때, K개의 직사각형 내부를 제외한 나머지 부분이 몇 개의 분리된 영역으로 나누어지는지, 그리고 분리된 각 영역의 넓이가 얼마인지를 구하여 이를 출력하는 프로그램을 작성하시오.

    입력
    첫째 줄에 M과 N, 그리고 K가 빈칸을 사이에 두고 차례로 주어진다. M, N, K는 모두 100 이하의 자연수이다. 둘째 줄부터 K개의 줄에는 한 줄에 하나씩 직사각형의 왼쪽 아래 꼭짓점의 x, y좌표값과 오른쪽 위 꼭짓점의 x, y좌표값이 빈칸을 사이에 두고 차례로 주어진다. 모눈종이의 왼쪽 아래 꼭짓점의 좌표는 (0,0)이고, 오른쪽 위 꼭짓점의 좌표는(N,M)이다. 입력되는 K개의 직사각형들이 모눈종이 전체를 채우는 경우는 없다.

    출력
    첫째 줄에 분리되어 나누어지는 영역의 개수를 출력한다. 둘째 줄에는 각 영역의 넓이를 오름차순으로 정렬하여 빈칸을 사이에 두고 출력한다.

    예제 입력 1 
    5 7 3
    0 2 4 4
    1 1 2 5
    4 0 6 2

    예제 출력 1 
    3
    1 7 13
*/

var input = require('fs').readFileSync('./example2.txt').toString().trim().split('\n'); 
var total = input.shift().split(' ');
var map = [], answer = [];
var count;

function fillRect (startY, startX, endY, endX) {
    for(let i=startX; i<endX; i++) {
        for(let j=startY; j<endY; j++) {
            map[i][j]++;
        }
    }
}

var getAreaSize = (x, y) => {
    count++;
    map[x][y] = -1;
    if(x-1>=0 && map[x-1][y]===0) getAreaSize(x-1,y);
    if(x+1< total[0]&& map[x+1][y]===0) getAreaSize(x+1,y);
    if(y-1>=0 && map[x][y-1]===0) getAreaSize(x,y-1);
    if(y+1< total[1]&& map[x][y+1]===0) getAreaSize(x,y+1);

    return count;
}

for(let i=0; i<total[0]; i++) {
    map[i] = [];
    for(let j=0; j<total[1]; j++) {
        map[i][j] = 0;
    }
}

for(let i=0; i<total[2]; i++) {
    var temp = input[i].trim().split(' ');
    fillRect(Number(temp[0]), Number(temp[1]), Number(temp[2]), Number(temp[3]));
}

for(let i=0; i<total[0]; i++) {
    while(map[i].indexOf(0) !== -1) {
        count = 0;
        answer.push(getAreaSize(i, map[i].indexOf(0)));
    }
}

answer.sort((a,b) => a-b);
console.log(answer.length + '\n' + answer.join(' '));