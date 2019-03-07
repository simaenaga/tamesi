enchant();

var State=0;//ゲームプレイ中のステータス
const Nomal=0;
const GameEvent=1;

var message;//メッセージ出力用
var eventKind=0;//イベントの種類
var talkProgress=0;//話し中の進捗度
var mapScale=320;//マップの大きさ
var mapTileScale=16;//マップ画像一つ分の大きさ
var itemList=new Array(10);//拾ったアイテム判定用
var mapArraySize= 30;//一つの方向にあるマップ画像数
var windowY=4;

for(var i=0;i<itemList.length;i++){
    itemList[i]=0;
}

window.onload = function() {

    var game = new Game(mapScale, mapScale);
    game.fps = 15;
    game.preload('map1.gif', 'chara0.gif','heya_girl.png','door.mp3','Knock.mp3','deep.mp3');
    game.onload=function(){
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];

        var array1=new Array(mapArraySize);//イベント判定用
        for(var i=0;i<mapArraySize;i++){
            array1[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array1[i][j]=322;
            }
        }
        map.loadData(array1);

        game.rootScene.addChild(map);

        var label = new Label("GameStart");
        label.font="32px monospace";
        label.color = "rgb(255,255,255)";
        label.y=2;
        label.x=2;

        game.rootScene.addEventListener(Event.TOUCH_START, function(e) {
            game.rootScene.removeChild(map);
            game.pushScene(game.makeScene1());
        });
    }

    game.makeScene1 = function() {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['heya_girl.png'];
        var doorSound = game.assets['door.mp3'].clone();
        var knockSound = game.assets['Knock.mp3'].clone();
        var futureSound = game.assets['deep.mp3'].clone();

        var eventMap=new Array(mapArraySize);//イベント判定用
        for(var i=0;i<mapArraySize;i++){
            eventMap[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                eventMap[i][j]=-1;
            }
        }

        //マップの背景作成
        var array1 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array1[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                    array1[j][i]=33;
            }
        }

        for(var i=7;i<17;i++){
            for(var j=7;j<15;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
        }

        //マップの背景の上書き作成(アイテムなどの)
        var array2 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array2[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array2[i][j]=-1;
            }
        }

        //上左壁
        array2[2][7]=16*5+8;
        array2[3][7]=16*6+8;
        array2[4][7]=16*7+8;
        array2[5][7]=16*7+8;
        array2[6][7]=16*7+8;

        array2[2][8]=16*5+2;
        array2[3][8]=16*5+2;
        array2[4][8]=16*5+2;
        array2[5][8]=16*5+2;
        array2[6][8]=16*5+2;

        //窓
        array1[2][9]=16*7+3;
        array1[2][10]=16*7+3;
        array1[3][9]=16*7+3;
        array1[3][10]=16*7+3;
        array1[2][11]=16*7+3;
        array1[2][12]=16*7+3;
        array1[3][11]=16*7+3;
        array1[3][12]=16*7+3;

        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                array2[j+3][i+9]=16*(14+j)+i;
            }
        }

        //上右壁
        for(var i=0;i<3;i++){
            for(var j=0;j<5;j++){
                array2[j+2][i+14]=16*5+2;
            }
        }

        array2[2][13]=16*5+2;
        array2[3][13]=16*5+2;
        array2[4][13]=16*5+2;
        array2[5][13]=16*5+2;
        array2[6][13]=16*5+2;

        var array0 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array0[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array0[i][j]=-1;
            }
        }

        //鏡作成
        array0[3][15]=58*16+2;
        array0[3][16]=58*16+3;
        array0[4][15]=59*16+2;
        array0[4][16]=59*16+3;
        array0[5][15]=60*16+2;
        array0[5][16]=60*16+3;
        array0[6][15]=61*16+2;
        array0[6][16]=61*16+3;

        //カーテン
        array0[3][9]=14*16+8;
        array0[4][9]=15*16+8;
        array0[5][9]=16*16+8;
        array0[6][9]=17*16+8;
    
        array0[3][12]=14*16+11;
        array0[4][12]=15*16+11;
        array0[5][12]=16*16+11;
        array0[6][12]=17*16+11;
    
        array0[3][10]=14*16+9;
        array0[3][11]=14*16+10;

        //本棚
        array0[4][7]=16*33;
        array0[4][8]=16*33+1;
        array0[5][7]=16*34;
        array0[5][8]=16*34+1;
        array0[6][7]=16*35;
        array0[6][8]=16*35+1;
        array0[7][7]=16*36;
        array0[7][8]=16*36+1;

        //マット
        array0[10][16]=16*64+14;
        array0[11][16]=16*69+14;

        //マップデータの作成
        map.loadData(array1,array2,array0);

        //衝突判定作成
        var array3 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array3[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array3[i][j]=0;
            }
        }
        
        for(var i=0;i<10;i++){
            array3[6+i][6]=1;
            array3[6+i][17]=1;
            array3[6][7+i]=1;
            array3[15][7+i]=1;
        }
        array3[7][7]=1;
        array3[7][8]=1;
        array3[11][7]=1;
        array3[11][8]=1;
        array3[13][7]=1;
        array3[13][8]=1;
        array3[14][7]=1;
        array3[14][8]=1;
        map.collisionData=array3;

        var foregroundMap = new Map(16, 16);
        foregroundMap.image = game.assets['heya_girl.png'];

        var array4=new Array(mapArraySize);
        for(var i=0;i<array4.length;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<array4.length;i++){
            for(var j=0;j<array4.length;j++){
                array4[j][i]=-1;
            }
        }

        //ベッド作成
        array2[11][7]=23*16+12;
        array2[12][7]=24*16+12;
        array4[13][7]=25*16+12;
        array4[14][7]=26*16+12;
        array2[11][8]=23*16+13;
        array2[12][8]=24*16+13;
        array4[13][8]=25*16+13;
        array4[14][8]=26*16+13;
        foregroundMap.loadData(array4);

        var foregroundMap2 = new Map(16, 16);
        foregroundMap2.image = game.assets['heya_girl.png'];

        var array5=new Array(mapArraySize);
        for(var i=0;i<array5.length;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<array5.length;i++){
            for(var j=0;j<array5.length;j++){
                array5[j][i]=-1;
            }
        }
        array5[12][7]=20*16+12;
        array5[13][7]=21*16+12;
        array5[12][8]=20*16+13;
        array5[13][8]=21*16+13;
        foregroundMap2.loadData(array5);
        foregroundMap2.y+=1;
        //ベッド作成ここまで
        

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 8 * 16 - 8;
        player.y = 11 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        State=GameEvent;
        eventKind=1;

        /*//プレイヤー以外キャラクター作成
        var enemy=new Sprite(32,32);
        enemy.x=9*16-8;
        enemy.y=2*16;
        enemy.image=game.assets['chara0.gif'];
        enemy.frame=34;
        array3[3][9]=1;
        eventMap[9][3]=0;*/

        //プレイヤーの動き作成(いじらない)
        player.isMoving = false;
        player.direction = 0;
        player.walk = 1;
        player.addEventListener('enterframe', function() {
            this.frame = this.direction * 3 + this.walk;
            if (this.isMoving) {
                this.moveBy(this.vx, this.vy);
 
                if (!(game.frame % 3)) {
                    this.walk++;
                    this.walk %= 3;
                }
                if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                    this.isMoving = false;
                    this.walk = 1;
                }
            } else {
                this.vx = this.vy = 0;
                //イベント中は行動できない
                if(State==Nomal){
                    if (game.input.left) {
                        this.direction = 1;
                        this.vx = -4;
                    } else if (game.input.right) {
                        this.direction = 2;
                        this.vx = 4;
                    } else if (game.input.up) {
                        this.direction = 3;
                        this.vy = -4;
                    } else if (game.input.down) {
                        this.direction = 0;
                        this.vy = 4;
                    }
                    if (this.vx || this.vy) {
                        var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
                        var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
                        if (0 <= x && x < map.width && 0 <= y && y < map.height && !map.hitTest(x, y)) {
                            this.isMoving = true;
                            arguments.callee.call(this);
                        }
                    }
                }
            }
        });

        //マップ、キャラをグループ化して描画
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(player);
        stage.addChild(foregroundMap);
        stage.addChild(foregroundMap2);
        scene.addChild(stage);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = -10;
        pad.y = 20;
        pad.scaleX=0.5;
        pad.scaleY=0.5;
        scene.addChild(pad);

        scene.addEventListener('enterframe', function(e) {
            var x = Math.min((game.width  - 16) / 2 - player.x, 0);
            var y = Math.min((game.height - 16) / 2 - player.y, 0);
            x = Math.max(game.width,  x + map.width)  - map.width;
            y = Math.max(game.height, y + map.height) - map.height;
            stage.x = x;
            stage.y = y;

            if(eventKind==1 && talkProgress == 4 && playerToMapX(player.x)!=16){
                player.direction = 2;
                player.vx = 4;
                player.isMoving=true;
            }else if(eventKind==1 && talkProgress == 4 && playerToMapY(player.y)!=10){
                player.vx = 0;
                player.direction = 3;
                player.vy = -4;
                player.isMoving=true;
            }else if(eventKind==1 && talkProgress == 4 && playerToMapX(player.x)==16 && playerToMapY(player.y)==10){
                player.vy=0;
                player.direction=2;
                talkProgress++;

                doorSound.play();
                player.tick=0;
            }else if(eventKind==1 && talkProgress == 5){
                player.tick++;
                if(player.tick==15){
                    player.tick=0;
                    talkProgress++;
                    doorSound.stop();
                }
            }else if(eventKind==1 && talkProgress == 6){
                message=makeMessage("ミラ「・・・・・あれっ？」");
                scene.addChild(message);
                talkProgress++;
            }else if(eventKind==1 && talkProgress == 8){
                player.tick++;
                if(player.tick==32){
                    player.tick=0;
                    talkProgress++;
                    doorSound.stop();
                }
            }else if(eventKind==1 && talkProgress == 9){
                scene.removeChild(message);
                message=makeMessage("ミラ「な、なんであかないのーっ！？」");
                scene.addChild(message);
                talkProgress++;
            }else if(eventKind==1 && talkProgress == 13){
                player.tick++;
                if(player.tick==48){
                    player.tick=0;
                    talkProgress++;
                    knockSound.stop();
                }
            }else if(eventKind==1 && talkProgress == 14){
                scene.removeChild(message);
                message=makeMessage("ミラ「だめだー、ぜんぜん気づいてくれないよう。うう、わたしのみかんゼリー・・・・」");
                scene.addChild(message);
                talkProgress++;
            }

            
        });

        scene.addEventListener(Event.TOUCH_START, function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //左上アイテムゲット
                        /*if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,420)){
                            message=makeMessage(player.x+","+player.y);
                            game.rootScene.addChild(message);
                            eventKind=1;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,0)){ //話しかける
                                message=makeMessage("我々は宇宙人だ");
                                game.rootScene.addChild(message);
                                eventKind=2;
                                State=GameEvent;
                        }else if(playerToMapX(player.x)==2 && playerToMapY(player.y)==0){
                            //game.pushScene(game.makeScene1());
                        }
                        else{*/
                            message=makeMessage(playerToMapX(player.x)+","+playerToMapY(player.y));
                            scene.addChild(message);
                            State=GameEvent;
                            eventKind=2;
                        //}
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                                switch(talkProgress){//トークイベントの時は、トーク進捗度により処理変更
                                    case 0:
                                        message=makeMessage("ミラ「うー、ねむいー・・・・・」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                        
                                    case 1:
                                        scene.removeChild(message);
                                        player.direction = 2;
                                        player.vx = 4;
                                        player.isMoving=true;
                                        message=makeMessage("ミラ「ふあー・・・・・よし、起きれた！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    
                                    case 2:
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「きょーのきゅーしょくはみっかんゼリー、ねぼすけさんでも早起きなのだー♪」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 3:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        
                                        break;

                                    case 5:
                                        
                                        break;

                                    case 6:
                                        
                                        break;

                                    case 7:
                                        scene.removeChild(message);
                                        doorSound.play();
                                        talkProgress++;
                                        break;
                                    
                                    case 8:

                                        break;

                                    case 9:
                                        
                                        break;

                                    case 10:
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「とじこめられた？　お、おのれ、ママがやったのかー！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 10:
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「・・・なんて、そんなことママは絶対しないよねー。うーん・・・」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 11:
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「ママ―！　パパー！　あけてよー！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 12:
                                        scene.removeChild(message);
                                        knockSound.play();
                                        talkProgress++;
                                        break;

                                    case 13:

                                        break;

                                    case 14:
                                        
                                        break;

                                    case 14:
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「こんなことであきらめちゃダメ、だよね。うん、がんばれわたし！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 15:
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「もしかしたら、ほかの出口があるかもしれない！　どうにかしてここから出よう！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    default:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        //futureSound.play();
                                        //futureSound.loop=true;
                                        //futureSound.volume=0.1;
                                        break;
                                }
                                break;
                            case 2:
                                switch(talkProgress){//トークイベントの時は、トーク進捗度により処理変更
                                    case 0:
                                        scene.removeChild(message);
                                        message=makeMessage("金をよこせ");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        break;
                                }
                                break;
                        }
                        break;
                }
            }
        });
        return scene;

    };
    game.start();

};

//メッセージ作成(いじらない)
function makeMessage(text){
    var label = new Label(text);
    label.font="16px monospace";
    label.color = "rgb(255,255,255)";
    label.backgroundColor = "rgba(0,0,0,0.6)";
    label.height=mapTileScale*6;
    label.y=mapScale-label.height;
    label.width=mapScale;
    return label;   
}

//タッチ判定を自分で調整(いじらない)
function touchJudge(x,y){
    if(!(x<80&&y>140))
        return true;
    return false;
}

//マップ上のプレイヤーのｘ座標をマップの配列番目に変換
function playerToMapX(px){
    px+=8;
    px/=mapTileScale;
    return px;
}

//マップ上のプレイヤーのy座標をマップの配列番目に変換
function playerToMapY(py){
    py+=16;
    py/=mapTileScale;
    return py;
}

//プレイヤーの向いている方向に[event]がある状態ならtrue,違ったらfalse
function isSurroundEvent(x,y,direction,array,event){
    if(x%1!=0 && y%1!=0) return false;
    if(((x-1)>=0 && array[x-1][y]==event &&direction==1) || ((x+1)<array.length && array[x+1][y]==event &&direction==2) || ((y+1)<array.length && array[x][y+1]==event &&direction==0) || ((y-1)>=0 && array[x][y-1]==event &&direction==3)){
        return true;
    }
    return false;
}
