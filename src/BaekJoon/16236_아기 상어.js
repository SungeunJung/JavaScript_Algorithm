/*
    문제
    N×N 크기의 공간에 물고기 M마리와 아기 상어 1마리가 있다. 공간은 1×1 크기의 정사각형 칸으로 나누어져 있다. 한 칸에는 물고기가 최대 1마리 존재한다.
    아기 상어와 물고기는 모두 크기를 가지고 있고, 이 크기는 자연수이다. 가장 처음에 아기 상어의 크기는 2이고, 아기 상어는 1초에 상하좌우로 인접한 한 칸씩 이동한다.
    아기 상어는 자신의 크기보다 큰 물고기가 있는 칸은 지나갈 수 없고, 나머지 칸은 모두 지나갈 수 있다. 아기 상어는 자신의 크기보다 작은 물고기만 먹을 수 있다. 따라서, 크기가 같은 물고기는 먹을 수 없지만, 그 물고기가 있는 칸은 지나갈 수 있다.
    
    아기 상어가 어디로 이동할지 결정하는 방법은 아래와 같다.
    
    - 더 이상 먹을 수 있는 물고기가 공간에 없다면 아기 상어는 엄마 상어에게 도움을 요청한다.
    - 먹을 수 있는 물고기가 1마리라면, 그 물고기를 먹으러 간다.
    - 먹을 수 있는 물고기가 1마리보다 많다면, 거리가 가장 가까운 물고기를 먹으러 간다.
        - 거리는 아기 상어가 있는 칸에서 물고기가 있는 칸으로 이동할 때, 지나야하는 칸의 개수의 최솟값이다.
        - 거리가 가까운 물고기가 많다면, 가장 위에 있는 물고기, 그러한 물고기가 여러마리라면, 가장 왼쪽에 있는 물고기를 먹는다.
    
    아기 상어의 이동은 1초 걸리고, 물고기를 먹는데 걸리는 시간은 없다고 가정한다. 즉, 아기 상어가 먹을 수 있는 물고기가 있는 칸으로 이동했다면, 이동과 동시에 물고기를 먹는다. 물고기를 먹으면, 그 칸은 빈 칸이 된다.
    아기 상어는 자신의 크기와 같은 수의 물고기를 먹을 때 마다 크기가 1 증가한다. 예를 들어, 크기가 2인 아기 상어는 물고기를 2마리 먹으면 크기가 3이 된다.
    공간의 상태가 주어졌을 때, 아기 상어가 몇 초 동안 엄마 상어에게 도움을 요청하지 않고 물고기를 잡아먹을 수 있는지 구하는 프로그램을 작성하시오.

    입력
    첫째 줄에 공간의 크기 N(2 ≤ N ≤ 20)이 주어진다.
    둘째 줄부터 N개의 줄에 공간의 상태가 주어진다. 공간의 상태는 0, 1, 2, 3, 4, 5, 6, 9로 이루어져 있고, 아래와 같은 의미를 가진다.
        0: 빈 칸
        1, 2, 3, 4, 5, 6: 칸에 있는 물고기의 크기
        9: 아기 상어의 위치
    아기 상어는 공간에 한 마리 있다.

    출력
    첫째 줄에 아기 상어가 엄마 상어에게 도움을 요청하지 않고 물고기를 잡아먹을 수 있는 시간을 출력한다.

    예제 입력 1     예제 입력 2     예제 입력 3      예제 입력 4        예제 입력 5         예제 입력 6
    3               3               4               6                  6                   6
    0 0 0           0 0 1           4 3 2 1         5 4 3 2 3 4        6 0 6 0 6 1         1 1 1 1 1 1
    0 0 0           0 0 0           0 0 0 0         4 3 2 3 4 5        0 0 0 0 0 2         2 2 6 2 2 3
    0 9 0           0 9 0           0 0 9 0         3 2 9 5 6 6        2 3 4 5 6 6         2 2 5 2 2 3
                                    1 2 3 4         2 1 2 3 4 5        0 0 0 0 0 2         2 2 2 4 6 3
                                                    3 2 1 6 5 4        0 2 0 0 0 0         0 0 0 0 0 6
                                                    6 6 6 6 6 6        3 9 3 0 0 1         0 0 0 0 0 9

    예제 출력 1     예제 출력 2     예제 출력 3     예제 출력 4         예제 출력 5         예제 출력 6
    0               3               14             60                  48                  39
*/

var [N, ...info] = require('fs').readFileSync('./example.txt').toString().trim().split('\n'); 

function solution(size, board) {
    var shark = {size:2, fish:0, pos:[]};
    const dx = [-1, 0, 1, 0], dy = [0, -1, 0, 1];
    var time = 0;

    for(var i=0; i<size; i++) {
        for(var j=0; j<size; j++) {
            if(board[i][j]===9) {
                shark.pos = [i,j];
                board[i][j] = 0;
            }
        }
    }

    var out_of_range = (x, y) => x<0 || y<0 || x>=size || y>=size;
    var bigger_than_shark = (x,y) => board[x][y]>shark.size;

    var eat_next_fish = () => { 
        var queue = [[shark.pos, 0]];
        var visited = Array.from({length:size}, ()=>Array(size).fill(false));
        var min_time = Number.MAX_SAFE_INTEGER;
        var dest_pos = [];

        visited[shark.pos[0]][shark.pos[1]] = true;
        while(queue.length) {
            var [[curX, curY], curT] = queue.shift();
            if(curT>min_time) continue;
            for(var i=0; i<dx.length; i++) {
                var [nextX, nextY] = [curX+dx[i], curY+dy[i]];
                if(out_of_range(nextX, nextY) || bigger_than_shark(nextX,nextY)) continue;
                if(visited[nextX][nextY]) continue;
                visited[nextX][nextY] = true;
                if(board[nextX][nextY]===0 || board[nextX][nextY]===shark.size) {
                    queue.push([[nextX,nextY], curT+1]);
                } else if(curT+1<=min_time) {
                    dest_pos.push([nextX,nextY]);
                    min_time = Math.min(min_time,curT+1);
                }
            }
        }
        // 가까운 거리 배열 여러개 일 때 좌표 비교해서 가장 상단, 가장 좌측에 있는걸로 선택
        if(!dest_pos.length) return;
        
        dest_pos.sort((a,b)=>a[1]-b[1]).sort((a,b)=>a[0]-b[0]);
        board[dest_pos[0][0]][dest_pos[0][1]] = 0;
        shark.pos = dest_pos[0];
        time += min_time;
        
        if(shark.size === shark.fish+1) {
            shark.size++;
            shark.fish = 0;
        } else shark.fish++;
        
        return eat_next_fish();
    }

    eat_next_fish();

    return time;
}

console.log(solution(+N, info.map(v=>v.split(' ').map(Number))));