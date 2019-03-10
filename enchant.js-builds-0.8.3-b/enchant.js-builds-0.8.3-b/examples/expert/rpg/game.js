enchant();

var State=0;//ゲームプレイ中のステータス
const Nomal=0;
const GameEvent=1;

var message;//メッセージ出力用
var select;//選択用
var selectState=2;
var eventKind=0;//イベントの種類
var talkProgress=0;//話し中の進捗度
var mapScale=320;//マップの大きさ
var mapTileScale=16;//マップ画像一つ分の大きさ
var itemList=new Array(10);//拾ったアイテム判定用
var mapArraySize= 30;//一つの方向にあるマップ画像数
var windowY=4;
var bgm=false;

for(var i=0;i<itemList.length;i++){
    itemList[i]=0;
}

window.onload = function() {
    enchant.Sound.enabledInMobileSafari = true;
    var game = new Game(mapScale, mapScale);
    game.fps = 15;
    game.preload('map1.gif', 'chara0.gif','heya_girl.png','heya_girl2.png','obakeEnterMirror.png','obakeOut.mp3','door.mp3','Knock.mp3','future.mp3','musmus_btn_set\\btn01.mp3','bird.mp3','darkwhole.mp3','obake.mp3','oinarisama.png','ohaka.png','nomen.png');

    //サウンドクラス
    SoundLoop = Class.create(Sprite, {
        Sound,
        SFlg:0,
        game,
        initialize:function(_game){ //クラスの初期化(コンストラクタ)
            game=_game;
            Sprite.call(this,0,0); //スプライトの初期化
            SFlg=0;
            game.onenterframe=function(){ //enterframeイベントのイベントリスナー
                if(SFlg==1){
                    try{
                        if(!Sound.src){ //もしSound.srcがないならenterframeによるループ再生
                            Sound.play();
                        }
                    }catch(e){}
                }
            };
         },
         Set:function(_Sound){
            Sound=_Sound;
            SFlg=0;
            try{
                Sound.stop();
            }catch(e){}
            Sound=game.assets[Sound];
            try{
                // もしSound.srcがあるなら、ループ再生フラグをtrueにする。
                if(Sound.src){
                    Sound.play();
                    Sound.src.loop = true;
                }
            }catch(e){}
            SFlg=1;
        },
        Stop:function(Sound){
            try{
                Sound.stop();
                SFlg=0;
            }catch(e){}
        }
     });

    //サウンドクラスここまで

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
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var birdSound = game.assets['bird.mp3'].clone();
        var darkwholeSound = game.assets['darkwhole.mp3'].clone();
        var wholeSound = game.assets['future.mp3'].clone();

        birdSound.play();

        //イベント判定用
        var eventMap=new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            eventMap[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                eventMap[i][j]=-1;
            }
        }

        eventMap[7][7]=0;
        eventMap[8][7]=0;
        eventMap[7][12]=1;
        eventMap[8][12]=1;
        eventMap[15][6]=2;
        eventMap[16][6]=2;
        eventMap[10][6]=3;
        eventMap[11][6]=3;

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

        /*State=GameEvent;
        eventKind=1;
        talkProgress=-1;*/

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
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        player.tick=0;
        scene.addEventListener('enterframe', function(e) {
            var x = Math.min((game.width  - 16) / 2 - player.x, 0);
            var y = Math.min((game.height - 16) / 2 - player.y, 0);
            x = Math.max(game.width,  x + map.width)  - map.width;
            y = Math.max(game.height, y + map.height) - map.height;
            stage.x = x;
            stage.y = y;

            if(bgm==true){
                wholeSound.play();
            }

            if(eventKind==1 && talkProgress == -1){
                player.tick++;
                if(player.tick==48){
                    player.tick=0;
                    buttonSound.play();
                    message=makeMessage("ミラ「うー、ねむいー・・・・・」");
                    scene.addChild(message);
                    talkProgress++;
                }
            }else if(eventKind==1 && talkProgress == 1){
                player.tick++;
                if(player.tick==32){
                    buttonSound.play();
                    message=makeMessage("ミラ「ふあー・・・・・よし、起きれた！」");
                    scene.addChild(message);
                    talkProgress++;
                }
            }else if(eventKind==1 && talkProgress == 4 && playerToMapX(player.x)!=16){
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
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    doorSound.stop();
                }
            }else if(eventKind==1 && talkProgress == 6){
                buttonSound.play();
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
                buttonSound.play();
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
                buttonSound.play();
                message=makeMessage("ミラ「だめだー、ぜんぜん気づいてくれないよう。うう、わたしのみかんゼリー・・・・」");
                scene.addChild(message);
                talkProgress++;
            }else if(eventKind==4 && talkProgress == 2){
                if(game.input.up && selectState==2){
                    scene.removeChild(select);
                    buttonSound.play();
                    selectState=1;
                    select=selectWindow(selectState);
                    scene.addChild(select);
                }else if(game.input.down && selectState==1){
                    scene.removeChild(select);
                    buttonSound.play();
                    selectState=2;
                    select=selectWindow(selectState);
                    scene.addChild(select);
                }
            }else if(eventKind==4 && talkProgress == 6){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==4 && talkProgress == 7){
                player.tick++;
                if(player.tick==16){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==4 && talkProgress == 8){
                player.tick++;
                if(player.tick==16){
                    message=screenDark(1);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==4 && talkProgress == 9){
                game.pushScene(game.makeScene2());
            }


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,0)){
                            buttonSound.play();
                            message=makeMessage('ミラ「本がいっぱいだー！」');
                            scene.addChild(message);
                            eventKind=2;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('ミラ「すずめさんがいっぱいとんでるー！」');
                            scene.addChild(message);
                            eventKind=5;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                            buttonSound.play();
                            message=makeMessage('ミラ「んー、窓が開かないよー...」');
                            scene.addChild(message);
                            eventKind=6;
                            State=GameEvent;
                        }else if(isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                            buttonSound.play();
                            message=makeMessage('ミラ「...もしかして夢なのかなー」');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                            talkProgress++;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            buttonSound.play();
                            message=makeMessage('ミラ「なにこれ、まっくろだ...」');
                            scene.addChild(message);
                            eventKind=4;
                            State=GameEvent;
                            talkProgress++;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                                switch(talkProgress){//トークイベントの時は、トーク進捗度により処理変更
                                    case -1:

                                        break;

                                    case 0:
                                        scene.removeChild(message);
                                        player.direction = 2;
                                        player.vx = 4;
                                        player.isMoving=true;
                                        talkProgress++;
                                        break;

                                    case 1:

                                        break;

                                    case 2:
                                        buttonSound.play();
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
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「とじこめられた？　お、おのれ、ママがやったのかー！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 10:
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「・・・なんて、そんなことママは絶対しないよねー。うーん・・・」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 11:
                                        buttonSound.play();
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
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「こんなことであきらめちゃダメ、だよね。うん、がんばれわたし！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 15:
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「もしかしたら、ほかの出口があるかもしれない！　どうにかしてここから出よう！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    default:
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        wholeSound.play();
                                        bgm=true;
                                        wholeSound.volume=0.1;
                                        break;
                                }
                                break;
                            case 2:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                break;
                            case 3:
                                switch(talkProgress){
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「にどね...いや、ダメダメ！　おきれ<br>なくなっちゃう！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「もうちょっと探してみよう」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        State=Nomal;
                                        eventKind=0;
                                        break;
                                }
                                break;
                            case 4:
                                switch(talkProgress){
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('鏡を調べますか？<br>はい<br>いいえ');
                                        scene.addChild(message);
                                        select=selectWindow(selectState);
                                        scene.addChild(select);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            buttonSound.play();
                                            message=makeMessage('ミラ「どうなってるのこれ？　ちょっとさわってみようかなー...」');
                                            scene.addChild(message);
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「うわっ！？　手が入って...」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「引きこまれるーっ！？」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        talkProgress++;
                                        break;
                                    case 6:
                                        break;
                                    case 7:
                                        break;
                                    case 8:
                                        break;
                                    case 9:
                                        break;
                                }
                                break;
                            case 5:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                eventMap[10][6]=4;
                                eventMap[11][6]=4;
                                break;
                            case 6:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                eventMap[10][6]=3;
                                eventMap[11][6]=3;
                                break;
                        }
                        break;
                }
            }
        });
        return scene;

    };

    //お化け屋敷
    game.makeScene2 = function(){
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['oinarisama.png'];
        var obakeSound = 'obake.mp3';
        var obakeEnterSound = game.assets['obakeOut.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();


        //ループ音声再生
        var M_Sound=new SoundLoop(game);
        M_Sound.Set(obakeSound);


        var array0 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array0[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array0[i][j]=-1;
            }
        }



        //イベント判定用
        var eventMap=new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            eventMap[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                eventMap[i][j]=-1;
            }
        }

        //入り口かがみ
        eventMap[9][29]=0;
        eventMap[10][29]=0;

        //出口かがみ
        eventMap[13][3]= 1;
        eventMap[14][3]= 1;

        //マップの背景作成
        var array1 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array1[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                    array1[j][i]=-1;
            }
        }

        scene.backgroundColor ="black";

        //通路
        for(var j=10;j<30;j+=2){
            array1[j][8]=20*9+10;
            array1[j][9]=20*9+11;
            array1[j][10]=20*9+12;
            array1[j][11]=20*9+13;

            array1[j+1][8]=20*10+10;
            array1[j+1][9]=20*10+11;
            array1[j+1][10]=20*10+12;
            array1[j+1][11]=20*10+13;

        }
        //広場
        for(var j=3;j<10;j+=2){
            array1[j][4]=20*9+10;
            for(var i=5; i<14; i+=2){
                array1[j][i]=20*9+11;
                array1[j][i+1]=20*9+12;
             }
            array1[j][15]=20*9+13;



            array1[j+1][4]=20*10+10;
            for(var i=5;i<14;i+=2){
                array1[j+1][i]=20*10+11;
                array1[j+1][i+1]=20*10+12;
            }
            array1[j+1][15]=20*10+13;
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
        //石畳
        for(var i=11;i<30;i++){
            array3[i][7]=1;
            array3[i][12]=1;
        }
        array3[29][9]=1;
        array3[29][10]=1;

        for(var i=4;i<17;i++){
            array3[2][i]=1;
            if(i>=11||i<=8){array3[11][i]=1;}
        }

        for(var j=3;j<11;j++){
            array3[j][3]=1;
            array3[j][16]=1;
        }
        //石畳ここまで

        //入り口かがみ
        array3[29][9]=1;
        array3[29][10]=1;

        //出口かがみ
        array3[3][13]= 1;
        array3[3][14]= 1;


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

        foregroundMap.loadData(array4);


        var map2 = new Map(16, 16);
        map2.image = game.assets['ohaka.png'];

        var array5=new Array(mapArraySize);
        for(var i=0;i<array5.length;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<array5.length;i++){
            for(var j=0;j<array5.length;j++){
                array5[j][i]=-1;
            }
        }



        //お墓
        array5[23][16] = 0;
        array5[23][17] = 1;
        array5[24][16] = 8;
        array5[24][17] = 8+1;


        map2.loadData(array5);


        var map3 = new Map(16,16);
        map3.image = game.assets['heya_girl2.png'];

        var array6=new Array(mapArraySize);
        for(var i=0;i<array6.length;i++){
            array6[i]=new Array(mapArraySize);
        }
        for(var i=0;i<array6.length;i++){
            for(var j=0;j<array6.length;j++){
                array6[j][i]=-1;
            }
        }

        //次への鏡
        array6[0][13]= 58*16 +2;
        array6[0][14]= 58*16 +3;
        array6[1][13]= 59*16 +2;
        array6[1][14]= 59*16 +3;
        array6[2][13]= 60*16 +2;
        array6[2][14]= 60*16 +3;
        array6[3][13]= 61*16 +2;
        array6[3][14]= 61*16 +3;
        map3.loadData(array6);

        var map4 = new Map(16,16);
        map4.image = game.assets['obakeEnterMirror.png'];
        var array7=new Array(mapArraySize);
        for(var i=0;i<array7.length;i++){
            array7[i]=new Array(mapArraySize);
        }
        for(var i=0;i<array7.length;i++){
            for(var j=0;j<array7.length;j++){
                array7[j][i]=-1;
            }
        }

        //入り口の鏡
        array7[28][9]= 0;
        array7[28][10]= 1;
        array7[29][9]= 2;
        array7[29][10]= 3;
        map4.loadData(array7);


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 9 * 16 - 8;
        player.y = 27 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        /*State=GameEvent;
        eventKind=1;
        talkProgress=-1;*/
        State=Nomal;
        eventKind=0;
        talkProgress=0;

        //プレイヤーの動き作成(いじらない)
        player.isMoving = false;
        player.direction = 3;
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
        stage.addChild(map2);
        stage.addChild(map3);
        stage.addChild(map4);
        scene.addChild(stage);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);



        player.tick=0;
        scene.addEventListener('enterframe', function(e) {
            var x = Math.min((game.width  - 16) / 2 - player.x, 0);
            var y = Math.min((game.height - 16) / 2 - player.y, 0);
            x = Math.max(game.width,  x + map.width)  - map.width;
            y = Math.max(game.height, y + map.height) - map.height;
            stage.x = x;
            stage.y = y;

           if(eventKind==1 && talkProgress == 2 && player.direction == 3){
                talkProgress++;
                player.tick++;
                player.direction = 2;
            }else if(eventKind==1 && talkProgress == 3 &&  player.direction == 2){
                if(player.tick == 15){
                    player.direction = 1;
                    talkProgress++;
                }
                player.tick++;
            }else if(eventKind==1 && talkProgress == 4 &&  player.direction == 1){
                if(player.tick == 30){
                    player.direction = 3;
                    talkProgress++;
                }
                player.tick++;
            }else if(eventKind==1 && talkProgress == 5){
                player.tick++;
                if(player.tick == 68){
                    buttonSound.play();

                    message=makeMessage("ミラ「かがみの向こう、なのかな」");
                    scene.addChild(message);
                    talkProgress++;
                }

            }
            if(eventKind==1 && talkProgress == 7 ){

                player.tick++;
                if(player.tick == 83){
                    talkProgress++;
                    player.direction = 0;
                }

            }
            if(eventKind==1 && talkProgress == 8 ){

                player.tick++;
                if(player.tick == 110){
                    buttonSound.play();
                    message=makeMessage("ミラ「わたしの部屋だ。じゃあここを通ればへやにもどれる?」");
                    scene.addChild(message);
                    talkProgress++;
                }

            }


            if(eventKind==1 && talkProgress == 10){
                player.tick++;
                if(player.tick == 125){
                    talkProgress++;
                    player.direction = 3;
                }
            }
            if(eventKind==1 && talkProgress == 11){
                player.tick++;
                if(player.tick == 130){
                  buttonSound.play();

                    message=makeMessage("ミラ「......とりあえず進んでみよう。帰るのはいつでもできるよね」");
                    scene.addChild(message);
                    talkProgress++;
                }
            }else if(eventKind==2 && talkProgress == 4){
                obakeEnterSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==2 && talkProgress == 5){
                player.tick++;
                if(player.tick==16){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==2 && talkProgress == 6){
                player.tick++;
                if(player.tick==16){
                    message=screenDark(1);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==2 && talkProgress == 7){

            }

        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    case Nomal://ノーマル状態で、イベントが発生した時の処理
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,1)){//出口
                            buttonSound.play();
                            message=makeMessage('ミラ「行き止まり?」');
                            scene.addChild(message);
                            eventKind=2;
                            State=GameEvent;
                            talkProgress = 1;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,0)){//入り口
                            buttonSound.play();
                            message=makeMessage('ミラ「とりあえず進もう！」');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                            talkProgress = 1;
                        }
                        break;

                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                                switch(talkProgress){
                                    case -1:
                                        buttonSound.play();
                                        message=makeMessage("ミラ「こ、ここは？」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 0:
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「まっくらだー……」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;

                                    case 1:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        break;

                                    case 3:
                                        break;

                                    case 4:
                                        break;

                                    case 5:
                                        break;

                                    case 6:

                                        scene.removeChild(message);
                                        talkProgress++;
                                    break;

                                    case 7:
                                        break;

                                    case 8:
                                        break;

                                    case 9:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;


                                    case 10:
                                        break;

                                    case 11:
                                        break;

                                    default:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        break;

                                }
                                break;
                            case 2:
                                switch(talkProgress){
                                    case 1:
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「この鏡に映ってるの、わたしのへやの外だ」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「よーし！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        M_Sound.Stop(Sound);//ループＢＧＭの停止

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
                                        break;
                              }
                                break;
                            case 3:
                                switch(talkProgress){
                                    case 1:
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        State=Nomal;
                                        eventKind=0;
                                        break;
                                }
                                break;
                        }
                        break;
                }
            }
        });
        return scene;
    }

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

//選択中の色を変える
function selectWindow(lebel){
    var label=new Label();
    label.backgroundColor="rgba(255,255,255,0.6)";
    label.height=16;
    label.width=mapScale;
    label.y=mapScale-mapTileScale*6+lebel*16;
    return label;
}

//タッチ判定を自分で調整(いじらない)
function touchJudge(x,y){
    if(!(x>220 && y>120 && y<220))
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
    if(x%1!=0 || y%1!=0) return false;
    if(((x-1)>=0 && array[x-1][y]==event &&direction==1) || ((x+1)<array.length && array[x+1][y]==event &&direction==2) || ((y+1)<array.length && array[x][y+1]==event &&direction==0) || ((y-1)>=0 && array[x][y-1]==event &&direction==3)){
        return true;
    }
    return false;
}

//プレイヤーのいる位置にイベントがあるかどうか
function isEventHere(x,y,array,event){
    if(x%1!=0 || y%1!=0) return false;
    if(array[x][y]==event){
        return true;
    }
    return false;
}

//スクリーンを指定の透明度で暗くする
function screenDark(darkness){
    var label = new Label();
    label.backgroundColor = "rgba(0,0,0,"+darkness+")";
    label.height=mapScale;
    label.width=mapScale;
    return label;
}
