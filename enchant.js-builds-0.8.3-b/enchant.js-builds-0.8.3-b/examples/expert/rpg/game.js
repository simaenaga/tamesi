enchant.Sound.enabledInMobileSafari = true;
enchant();

var State=0;//ゲームプレイ中のステータス
var Nomal=0;
var GameEvent=1;

var message;//メッセージ出力用
var select;//選択用
var selectState=2;
var eventKind=0;//イベントの種類
var talkProgress=0;//話し中の進捗度
var mapScale=320;//マップの大きさ
var mapTileScale=16;//マップ画像一つ分の大きさ
var itemList=new Array(15);//拾ったアイテム判定用
var mapArraySize= 30;//一つの方向にあるマップ画像数
var windowY=1;
var bgm=false;//bgmかけるかどうか
var nowScene=0;//今のシーン（シーン遷移用）
var previousScene=0;//前のシーン
var nextScene=0;//複数シーンをワンシーンとして扱う用
var previousCharaLocate=0;//シーン遷移後のプレイヤーの位置調整用

for(var i=0;i<itemList.length;i++){
    itemList[i]=0;
}
//itemList[0]=1;

window.onload = function() {
    var game = new Game(mapScale, mapScale);
    game.fps = 15;
    game.preload('kira.mp3','hyun.mp3','knife.mp3','heya_girl3.png','greenmirror.png','door2.mp3','drink1.mp3','splash.mp3','yuka.png','Bath2.png','Bath.png','music.mp3','chara.gif','map1.gif', 'chara0.gif','heya_girl.png','heya_girl2.png','makkuraEnterMirror.png','makkuraOut.mp3','door.mp3','Knock.mp3','future.mp3','musmus_btn_set\\btn01.mp3','bird.mp3','darkwhole.mp3','makkura.mp3','oinarisama.png','stair.png','ie0.png','door-open1.mp3','nomen.png','run.mp3','gusari.mp3');

    game.wholeSound=Sound.load('future.mp3');

    game.onload=function(){
        game.pushScene(game.controlScene());
    };

    game.controlScene=function(){
        var scene = new Scene();
        wholeSound=game.wholeSound;
        scene.addEventListener('enterframe', function(e) {
            switch(nowScene){
                case 0:
                    game.pushScene(game.makeScene0());
                    break;
                case 1:
                    game.pushScene(game.makeScene1(wholeSound));
                    break;
                case 2:
                    game.pushScene(game.makeScene2(wholeSound));
                    break;
                case 3:
                    game.pushScene(game.makeScene3(wholeSound));
                    break;
                case 4:
                    game.pushScene(game.makeScene4(wholeSound));
                    break;
                case 5:
                    game.pushScene(game.makeScene5(wholeSound));
                    break;
                case 6:
                    game.pushScene(game.makeScene6(wholeSound));
                    break;
                case 7:
                    game.pushScene(game.makeScene7(wholeSound));
                    break;
                case 8:
                    game.pushScene(game.makeScene8(wholeSound));
                    break;
                case 9:
                    game.pushScene(game.makeScene9(wholeSound));
                    break;
                case 10:
                    game.pushScene(game.makeScene10(wholeSound));
                    break;
                default:
                    game.popScene();
            }
        });

        return scene;
    };

    game.makeScene0=function(){
        var scene = new Scene();
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

        scene.addChild(map);

        var label = new Label("GameStart");
        label.font="32px monospace";
        label.color = "rgb(255,0,0)";
        label.y=mapScale/2-mapTileScale;
        label.x=mapScale/2-mapTileScale*5;

        scene.addChild(label);

        var label = new Label("ミラは鏡の国にいる");
        label.font="32px monospace";
        label.color = "rgb(0,0,255)";
        label.y=mapScale/2-mapTileScale*7;
        label.x=mapScale/2-mapTileScale*9;

        scene.addChild(label);

        scene.addEventListener(Event.TOUCH_START, function(e) {
            scene.removeChild(map);
            nowScene=1;
            previousScene=0;
            nextScene=1;
            game.popScene();
        });

        return scene;
    };

    game.makeScene1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['heya_girl.png'];
        var doorSound = game.assets['door.mp3'].clone();
        var knockSound = game.assets['Knock.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var birdSound = game.assets['bird.mp3'].clone();
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
        var kiraSound=game.assets['kira.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);

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

        scene.backgroundColor ="black";

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
                    array1[j][i]=-1;
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
                    this.isMoving =false ;
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

        //プレイヤー2データ作成
        var player2 = new Sprite(32, 32);
        player2.x = 8 * 16 - 8;
        player2.y = 11 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*3, 0, 96, 128, 0, 0, 96, 128);
        player2.image = image;

        //プレイヤー2の動き作成(いじらない)
        player2.isMoving = false;
        player2.direction = 0;
        player2.walk = 1;

        player2.addEventListener('enterframe', function() {
            this.frame = this.direction * 3 + this.walk;
            if (this.isMoving) {
                this.moveBy(this.vx, this.vy);
                if (!(game.frame % 3)) {
                    this.walk++;
                    this.walk %= 3;
                }
                if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                    this.isMoving =false ;
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

        //くろくろ作成
        var player3 = new Sprite(32, 32);
        player3.x = 14 * 16;
        player3.y = 13 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player3.image = image;
        player3.scaleX=2;

        //くろくろ作成(いじらない)
        player3.isMoving = false;
        player3.direction = 0;
        player3.walk = 1;
        player3.addEventListener('enterframe', function() {

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
                
            }
        });

        //マップ、キャラをグループ化して描画
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(player);
        if(itemList[14]==1){
            stage.addChild(player2);
        }
        stage.addChild(foregroundMap);
        stage.addChild(foregroundMap2);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        if(itemList[14]==0){
            //プレイする時コメントアウトはずす
            State=GameEvent;
            eventKind=1;
            talkProgress=-1;
            birdSound.play();
        }else{
            State=GameEvent;
            eventKind=7;
            talkProgress=0;
            player.direction=0;
            player.y= 6 * 16;
            if(previousCharaLocate==0){
                player.x= 15 * 16 - 8;
            }else{
                player.x= 16 * 16 - 8;
            }
        }

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
                player.tick++;
                if(player.tick==16){
                    player.tick=0;
                    talkProgress++;
                    nowScene=2;
                    previousScene=1;
                    game.popScene();
                }
            }else if(eventKind==7){
                if(talkProgress==0){
                    player.tick++;
                    if(player.tick==24){
                        player.tick=0;
                        message=makeMessage('？？？「.....っ！　入ってこないでよ！」');
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==2){
                    if(playerToMapX(player2.x)<playerToMapX(player.x)){
                        player2.vx=4;
                        player2.isMoving=true;
                        player2.direction=2;
                    }else if(playerToMapY(player2.y)>playerToMapY(player.y)+3){
                        player2.vx=0;
                        player2.vy=-4;
                        player2.direction=3;
                        player2.isMoving=true;
                    }else{
                        player2.vx=0;
                        player2.vy=0;
                        player2.isMoving=false;
                        talkProgress++;
                    }
                }else if(talkProgress==3){
                    player.tick++;
                    if(player.tick==8){
                        player.tick=0;
                        message=makeMessage('？？？「え？　わたし？」');
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress == 37){
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
                }
            }else if(eventKind==8){
                if(talkProgress==3){
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        message=makeMessage('ミラ・カラ「！？！？！？」');
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==5){
                    if(playerToMapX(player.x)>14){
                        player.vx=-1;
                        player.direction=1;
                        player.isMoving=true;
                    }else{
                        player.vx=0;
                        player.direction=2;
                        player.isMoving=false;
                        talkProgress++;
                    }
                }else if(talkProgress==6){
                    player.tick++;
                    if(player.tick==8){
                        player.tick=0;
                        message=screenDark(1);
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==7){
                    player.tick++;
                    if(player.tick==8){
                        player.tick++;
                        player3.x=11*16;
                        player3.y=6*16;
                        scene.addChild(player3);
                        scene.removeChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==8){
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        message=makeMessage('ミラ「な、なに！？」');
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==11){
                    if(playerToMapY(player3.y)<9){
                        player3.vy=4;
                        player3.isMoving=true;
                    }else{
                        player3.vy=0;
                        player3.isMoving=false;
                        talkProgress++;
                    }
                }else if(talkProgress==12){
                    player.tick++;
                    if(player.tick>15){
                        if(playerToMapY(player3.y)>8){
                            player3.vy=-4;
                            player2.vy=-4;
                            player3.isMoving=true;
                            player2.isMoving=true;
                        }else{
                            player3.vy=0;
                            player2.vy=0;
                            player3.isMoving=false;
                            player2.isMoving=false;
                            player.tick=0;
                            talkProgress++;
                        }
                    }
                }else if(talkProgress==13){
                    player.tick++;
                    if(player.tick>15){
                        if(playerToMapY(player3.y)>7){
                            player3.vy=-4;
                            player2.vy=-4;
                            player3.isMoving=true;
                            player2.isMoving=true;
                        }else{
                            player3.vy=0;
                            player2.vy=0;
                            player3.isMoving=false;
                            player2.isMoving=false;
                            player.tick=0;
                            talkProgress++;
                        }
                    }
                }else if(talkProgress==14){
                    message=makeMessage('カラ「やだ！　助けて！　ママ！　パパ！」');
                    buttonSound.play();
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==16){
                    player.tick++;
                    if(player.tick==15){
                        message=screenDark(0.6);
                        scene.addChild(message);
                    }else if(player.tick==30){
                        message=screenDark(0.6);
                        scene.addChild(message);
                    }else if(player.tick==45){
                        player.tick=0;
                        message=screenDark(1);
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==17){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('.....カラは鏡の中に消えていった');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==18){
                    player.tick++;
                    if(player.tick==30){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==19){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('あれから、わたしは鏡の中にはいれなくなった。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==20){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==21){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('夢だったのだろうか。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==22){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==23){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('わからない。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==24){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==25){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('でも、カラが言ったんだ。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==26){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==27){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('わたしのかわりになって、って。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==28){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==29){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('だから今日もわたしはカラになる');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==30){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==31){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('今日の給食は何だっただろうか....？');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==32){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==33){
                    nowScene=0;
                    previousScene=1;
                    nextScene=0;
                    for(var i=0;i<itemList.length;i++){
                        itemList[i]=0;
                    }
                    game.popScene();
                }
            }else if(eventKind==9){
                if(talkProgress==7){
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        message=makeMessage('カラ「鏡の中から、何か.....！」');
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==9){
                    if(playerToMapX(player.x)>14){
                        player.vx=-2;
                        player.direction=1;
                        player.isMoving=true;
                    }else{
                        player.vx=0;
                        player.direction=2;
                        player.isMoving=false;
                        talkProgress++;
                    }
                }else if(talkProgress==10){
                    player.tick++;
                    if(player.tick==8){
                        player.tick=0;
                        message=screenDark(1);
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==11){
                    player.tick++;
                    if(player.tick==8){
                        player.tick=0;
                        player3.x=11*16;
                        player3.y=6*16;
                        scene.addChild(player3);
                        scene.removeChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==12){
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        message=makeMessage('カラ「いやっ！　こないで！」');
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==23){
                    player.tick++;
                    if(player.tick==8){
                        player.tick++;
                        kiraSound.play();
                        talkProgress++;
                    }
                }else if(talkProgress==24){
                    player.tick++;
                    if(player.tick==30){
                        message=screenDark(1);
                        player.tick=0;
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==25){
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        scene.removeChild(player3);
                        scene.removeChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==26){
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        message=makeMessage('ミラ「えっへん。どうだ、まいったかー！」');
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==29){
                    if(playerToMapX(player.x)<15){
                        player.vx=1;
                        player.isMoving=true;
                    }else{
                        player.vx=0;
                        player.isMoving=false;
                        player.direction=0;
                        player.tick++;
                        if(player.tick==8){
                            scene.removeChild(message);
                            message=makeMessage('ミラ「ねえ、カラ」');
                            buttonSound.play();
                            scene.addChild(message);
                            talkProgress++;
                        }
                    }
                    
                }
                else if(talkProgress==35){
                    player.tick++;
                    if(player.tick==8){
                        message=makeMessage('ミラ「あとは、この部屋を出るだけ」');
                        player.direction=3;
                        buttonSound.play();
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==42){
                    darkwholeSound.play();
                    talkProgress++;
                }else if(talkProgress==43){
                    player.tick++;
                    if(player.tick==15){
                        message=screenDark(0.6);
                        scene.addChild(message);
                    }else if(player.tick==30){
                        message=screenDark(0.6);
                        scene.addChild(message);
                    }else if(player.tick==45){
                        player.tick=0;
                        message=screenDark(1);
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==44){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('.....ミラは鏡の中に消えていった');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==45){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==46){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('言いたいことを好きなだけ言ってあらしのように。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==47){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==48){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('夢だったのだろうか。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==49){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==50){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('わからない。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==51){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==52){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('......でも、ミラが言ったんだ。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==53){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==54){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('きっとこれからは楽しいことがまってる、って');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==55){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==56){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('だからわたしはこの部屋を出る');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==57){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==58){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('久しぶりの学校だ。笑われるだろうか。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==59){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==60){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('だったら、わたしも笑って楽しんでやればいい。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==61){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==62){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('それに.....');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==63){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==64){
                    player.tick++;
                    if(player.tick==15){
                        message=lastMessage('今日の給食はみかんゼリーだ。');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==65){
                    player.tick++;
                    if(player.tick==45){
                        scene.removeChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==66){
                    player.tick++;
                    if(player.tick==30){
                        nowScene=0;
                        nextScene=0;
                        previousScene=1;
                        for(var i=0;i<itemList.length;i++){
                            itemList[i]=0;
                        }
                        game.popScene();
                    }
                }
                
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
                                        wholeSound.volume=0.5;
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
                            case 7:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                    case 3:
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「おはよう、カラ。.....ううん、違うね」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「おはよう、本物のわたし」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「何を、言ってるの？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 7:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「わたしはね、鏡の国から来たもう一人のカラ。名前はミラっていうの」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 8:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ママもパパも心配してたよ？　こんなところにとじこもってないで学校に行こうよ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 9:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「今日の給食はみかんゼリーだよ。カラも知ってるでしょ？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「持ってきてくれたプリント、ちゃんと見てたもんね」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「うっさい、出てけ！　わたしは行かない！　わたしには、行けない！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 12:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「.....どうして？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 13:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「だって、わたし、なんにもできない」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 14:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「いっつも失敗ばっかだし、いっぱいまちがえる」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 15:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「それでみんな笑うんだ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 16:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「カラのからは空っぽのカラだ。わたし、なんにもない」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 17:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「.....こわかったんだね」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 18:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ここまでくるのに、いっぱいぼーけんしてきたんだ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 19:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「うすぐらくて、ぶきみな場所ばっかりで、しかもくろくろがわたしを笑ってくるんだ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 20:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「.....外はこわいとこだよね」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 21:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「でも、くろくろがわたしのことほめてくれたよ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 22:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「ウソだ！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 23:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「わたしの時はみんな失敗したら笑ってバカにしてきたもん！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 24:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「だから、カラはいっぱいれんしゅーしたんだよね」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 25:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「きっと、みんなもカラががんばってるのは知ってたと思うよ？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 26:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「あとね、はい、これ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 26:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラはカラになふだとランドセルを手渡した');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 27:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ぼーけんの途中でひろってきた。すてちゃったら、ダメだよ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 28:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「.....すごいなあ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 29:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「わたしはもうダメだよ。部屋からも出れなくなっちゃった」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 30:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「外がこわいんだ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 31:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「もうがんばれないよ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 32:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「ねえ、ミラ。ミラがわたしなら.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 33:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「わたしのかわりに学校に行かない？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 34:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「ミラならわたしとちがっていくらバカにされてもがんばって、きっとみんなにもみとめられる」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 35:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「ミカンゼリーもあげる。だから......」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 36:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        scene.addChild(message);
                                        scene.addChild(selectMessage1);
                                        scene.addChild(selectMessage2);
                                        selectState=2;
                                        select=selectWindow(selectState);
                                        scene.addChild(select);
                                        talkProgress++;
                                        break;
                                    case 37:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            message=makeMessage('カラ「よかった.....」');
                                            buttonSound.play();
                                            scene.addChild(message);
                                            eventKind=8;
                                            talkProgress=0;
                                        }else{
                                            message=makeMessage('カラ「なんで？」');
                                            buttonSound.play();
                                            scene.addChild(message);
                                            talkProgress=0;
                                            eventKind=9;
                                        }
                                        break;
                                }
                                break;
                            case 8:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「これでママに心配かけずにすむ....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「カラ....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        darkwholeSound.play();
                                        talkProgress++;
                                        break;
                                    case 3:
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                    case 6:
                                    case 7:
                                    case 8:
                                        break;
                                    case 9:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「鏡の中から！？　や、やめて！こないで！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                    case 12:
                                    case 13:
                                    case 14:
                                        break;
                                    case 15:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                }
                                break;
                            case 9:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「ミラが学校に行ったほうが絶対にいいよ！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「ママも、パパも、学校のみんなも、わたしより、ミラと一緒にいたほうが絶対に楽しい！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「....それでも」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「わたしは鏡の中に帰らなくちゃ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ここにいるのはカラじゃなくちゃ！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「カラがいなくちゃ、わたしは鏡にも映らない」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        darkwholeSound.play();
                                        talkProgress++;
                                        break;
                                    case 7:
                                        break;
                                    case 8:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 9:
                                    case 10:
                                    case 11:
                                    case 12:
                                        break;
                                    case 13:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「...きっとわたしを連れ戻しにきたん'+'<br>'+'だよ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 14:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「下がってて、カラ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 15:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「どうするつもりなの？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 16:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「えへへ、これを使うんだ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 17:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「これって、まじかるすてっき？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 18:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「うん、これも拾ってきた」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 19:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「それおもちゃだよ！　あんなのに勝てっこないよ！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 20:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ふふん！　そんなの」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 21:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「やってみなくちゃ、わからない！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 22:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 23:
                                    case 24:
                                    case 25:
                                    case 26:
                                        break;
                                    case 27:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「うそ......」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 28:
                                        scene.removeChild(message);
                                        talkProgress++;
                                    case 29:
                                        
                                        break;
                                    case 30:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「....なに？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 31:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「わたしができることはカラにもできるよ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 32:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「カラのはずかしさも、くるしいのも、いっぱいがんばったのだって知ってる」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        talkProgress=36;
                                        break;
                                    case 33:
                                        scene.removeChild(message);
                                        talkProgress++;
                                    case 34:
                                        talkProgress++;
                                    case 35:
                                        break;
                                    case 36:
                                        scene.removeChild(message);
                                        player.direction=0;
                                        message=makeMessage('ミラ「だいじょうぶ！　きっとこれからは楽しいことが待ってるよ！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 37:
                                        scene.removeChild(message);
                                        message=makeMessage('カラ「ミラ......」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 38:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「うん、いい顔！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 39:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「そうやって笑ってたほうが女の子はかわいいんだって、ママも言ってたもんね！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 40:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「.....それじゃあね！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 41:
                                        player.direction=3;
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;

                                }
                                
                        }
                        break;
                }
            }
        });
        return scene;

    };

    //まっくら石畳の道
    game.makeScene2 = function(wholeSound){
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['oinarisama.png'];
        var makkuraSound = game.assets['makkura.mp3'].clone();
        var makkuraEnterSound = game.assets['makkuraOut.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();


        //ループ音声再生
        bgm=true;


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
            array1[j][4]=20*10+10;
            for(var i=5; i<14; i+=2){
                array1[j][i]=20*10+11;
                array1[j][i+1]=20*10+12;
             }
            array1[j][15]=20*10+13;



            array1[j+1][4]=20*9+10;
            for(var i=5;i<14;i+=2){
                array1[j+1][i]=20*9+11;
                array1[j+1][i+1]=20*9+12;
            }
            array1[j+1][15]=20*9+13;
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
            if(i>11||i<8){array3[11][i]=1;}
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
        map2.image = game.assets['heya_girl.png'];

        var array5=new Array(mapArraySize);
        for(var i=0;i<array5.length;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<array5.length;i++){
            for(var j=0;j<array5.length;j++){
                array5[j][i]=-1;
            }
        }

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
        map4.image = game.assets['makkuraEnterMirror.png'];
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



        //
        // var map5 = new Map(16,16);
        // map5.image = game.assets['nomen.png'];
        // var array8=new Array(mapArraySize);
        // for(var i=0;i<array8.length;i++){
        //     array8[i]=new Array(mapArraySize);
        // }
        // for(var i=0;i<array8.length;i++){
        //     for(var j=0;j<array8.length;j++){
        //         array8[j][i]=-1;
        //     }
        // }
        // array8[9][5]=5*10+2;
        // array8[9][6]=5*10+3;
        // array8[10][5]=6*10+2;
        // array8[10][6]=6*10+3;
        // array8[11][5]=7*10+2;
        // array8[11][6]=7*10+3;
        //
        //
        // map5.loadData(array8);


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 9 * 16 - 8;
        player.y = 27 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        // プレイするとき
        State=GameEvent;
        eventKind=1;
        talkProgress=-1;

        //デバック時
        // State=Nomal;
        // eventKind=0;
        // talkProgress=0;

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
        // stage.addChild(map2);
        stage.addChild(map3);
        stage.addChild(map4);
        // stage.addChild(map5);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

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
                makkuraSound.play();
            }else{
                makkuraSound.stop();
            }

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
                makkuraEnterSound.play();
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
                player.tick++;
                if(player.tick==16){
                    player.tick=0;
                    talkProgress++;
                    nowScene=3;
                    previousScene=2;
                    game.popScene();
                }
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
                                       bgm=false;//ループＢＧＭの停止

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

    game.makeScene3 = function(wholeSound){
        var scene = new Scene();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==2　|| nextScene==31){
                game.pushScene(game.makeScene3_1(wholeSound));
            }else if(nextScene==32){
                game.pushScene(game.makeScene3_2(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    }

    game.makeScene3_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['heya_girl.png'];
        var doorSound = game.assets['door.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var doorOpenSound = game.assets['door-open1.mp3'].clone();
        var runSound = game.assets['run.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();

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

        eventMap[6][10]=0;
        eventMap[6][11]=0;
        eventMap[13][10]=1;
        eventMap[13][11]=1;
        eventMap[13][17]=2;
        eventMap[13][18]=2;
        eventMap[7][15]=3;
        eventMap[8][15]=3;
        eventMap[9][6]=4;
        eventMap[10][6]=4;
        if(itemList[14]==1){
            eventMap[9][6]=5;
            eventMap[10][6]=5;
        }

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

        for(var i=7;i<13;i++){
            //床
            for(var j=7;j<20;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
            //壁
            for(var j=2;j<7;j++){
                array1[j][i]=5*16+2;
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
        //マット
        array2[10][7]=62*16+15;
        array2[11][7]=63*16+15;

        array2[10][12]=62*16+10;
        array2[11][12]=63*16+10;

        array2[17][12]=62*16+10;
        array2[18][12]=63*16+10;

        //鏡
        array2[3][9]=58*16+2;
        array2[3][10]=58*16+3;
        array2[4][9]=59*16+2;
        array2[4][10]=59*16+3;
        array2[5][9]=60*16+2;
        array2[5][10]=60*16+3;
        array2[6][9]=61*16+2;
        array2[6][10]=61*16+3;
        

        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<6;i++){
            array3[6][7+i]=1;
            array3[20][7+i]=1;
        }

        for(var i=0;i<15;i++){
            array3[6+i][6]=1;
            array3[6+i][13]=1;
        }

        //階段衝突
        array3[14][9]=1;
        array3[15][9]=1;
        array3[16][9]=1;
        array3[17][9]=1;

        array3[17][7]=1;
        array3[17][8]=1;
        array3[17][9]=1;

        if(itemList[14]==0){
            array3[14][7]=1;
            array3[14][8]=1;
            array3[14][9]=1;
        }

        map.collisionData=array3;

        //階段用マップ
        var map2 = new Map(mapTileScale, mapTileScale);
        map2.image = game.assets['ie0.png'];

        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[12][7]=86*16+2;
        array4[12][8]=86*16+3;
        array4[13][7]=87*16+2;
        array4[13][8]=87*16+3;
        array4[14][7]=88*16+2;
        array4[14][8]=88*16+3;
        array4[14][9]=88*16+4;
        array4[15][7]=89*16+2;
        array4[15][8]=89*16+3;
        array4[15][9]=89*16+4;
        array4[17][7]=91*16+2;
        array4[17][8]=91*16+3;
        array4[17][9]=91*16+4;

        map2.loadData(array4);
        map2.y+=6;

        var map3 = new Map(mapTileScale, mapTileScale);
        map3.image = game.assets['ie0.png'];

        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array5[i][j]=-1;
            }
        }

        array5[12][9]=86*16+4;
        array5[13][9]=87*16+4;
        array5[16][7]=90*16+2;
        array5[16][8]=90*16+3;
        array5[16][9]=90*16+4;

        map3.loadData(array5);
        map3.y+=6;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 9 * 16 - 8;
        player.y = 6 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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

        //見えない壁作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.3)";
        label.height=mapTileScale/2;
        label.width=mapTileScale*2+8;
        label.y=mapTileScale*14;
        label.x=mapTileScale*7;

        //マップ、キャラをグループ化して描画
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(map2);
        stage.addChild(player);
        stage.addChild(map3);
        if(itemList[14]==0)
            stage.addChild(label);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==2){
            State=GameEvent;
            eventKind=4;
            talkProgress=0;
        }else if(previousScene==32){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            player.x = 12 * 16 - 8;
            player.y = 9 * 16;
        }else if(previousScene==71){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            player.y = 12 * 16;
            if(previousCharaLocate==0){
                player.x = 7 * 16 - 8;
            }else{
                player.x = 8 * 16 - 8;
            }
            
        }else if(previousScene==101){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,0)){
                    doorSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.right && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                    doorSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(game.input.right && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,1)){
                    doorOpenSound.play();
                    eventKind=3;
                    State=GameEvent;
                }else if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,3)){
                    runSound.play();
                    eventKind=5;
                    State=GameEvent;
                }
            }

            if(eventKind==1 && talkProgress == 0){
                player.tick++;
                if(player.tick==15){
                    doorSound.stop();
                    player.tick=0;
                    buttonSound.play();
                    message=makeMessage("開かないみたいだ...");
                    scene.addChild(message);
                    talkProgress++;
                }
            }else if(eventKind==2 && talkProgress == 0){
                player.tick++;
                if(player.tick==15){
                    doorSound.stop();
                    player.tick=0;
                    buttonSound.play();
                    message=makeMessage("開かないみたいだ...");
                    scene.addChild(message);
                    talkProgress++;
                }
            }else if(eventKind==3 && talkProgress == 0){
                player.tick++;
                if(player.tick==15){
                    player.tick=0;
                    nextScene=32;
                    previousScene=31;
                    game.popScene();
                }
            }else if(eventKind==4 && talkProgress == 0){
                player.tick++;
                if(player.tick==15){
                    player.tick=0;
                    buttonSound.play();
                    message=makeMessage("ミラ「出れた！」");
                    scene.addChild(message);
                    talkProgress++;
                }
            }else if(eventKind==4 && talkProgress == 4 && playerToMapY(player.x)>=9){
                player.direction = 1;
                player.vx = -4;
                player.isMoving=true;
            }else if(eventKind==4 && talkProgress == 4 && playerToMapY(player.y)!=13){
                player.vx = 0;
                player.direction = 0;
                player.vy = 4;
                player.isMoving=true;
            }else if(eventKind==4 && talkProgress == 4){
                player.vy=0;
                player.isMoving=false;
                player.tick++;
                if(player.tick==16){
                    buttonSound.play();
                    message=makeMessage("ミラ「かべだ.....」");
                    scene.addChild(message);
                    talkProgress++;
                    player.tick=0;
                }
            }else if(eventKind==4 && talkProgress == 6){
                buttonSound.play();
                message=makeMessage("ミラ「うー！　にゅー！」");
                scene.addChild(message);
                talkProgress++;
            }else if(eventKind==4 && talkProgress == 7){
                player.tick++;
                player.frame = player.direction * 3 + Math.floor((player.tick/4)%3);
                if(player.tick==32){
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==4 && talkProgress == 8){
                scene.removeChild(message);
                buttonSound.play();
                message=makeMessage("ミラ「やっぱり通れないやー。これじゃ下に行けないよー......」");
                scene.addChild(message);
                talkProgress++;
            }else if(eventKind==5){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nowScene=7;
                    nextScene=71;
                    previousScene=31;
                    game.popScene();
                    if(playerToMapX(player.x)==7){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }else if(eventKind==7 && talkProgress == 0){
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
            }else if(eventKind==7 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==7 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==7 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=10;
                    nextScene=101;
                    previousScene=31;
                    if(playerToMapX(player.x)==9)
                        previousCharaLocate=0;
                    else
                        previousCharaLocate=1;
                    game.popScene();
                }
            }
            


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                            buttonSound.play();
                            message=makeMessage('ミラ「とりあえず先に進もう！」');
                            scene.addChild(message);
                            eventKind=6;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,5)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=7;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        State=Nomal;
                                        eventKind=0;
                                        talkProgress=0;
                                        break;
                                }
                            case 2:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        State=Nomal;
                                        eventKind=0;
                                        talkProgress=0;
                                        break;
                                }
                                break;
                            case 3:
                                break;
                            case 4:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「これで外に出れ.....あれ？」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「かいだんの前の、何だろう？」");
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
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        break;
                                    case 7:
                                        break;
                                    case 8:
                                        break;
                                    case 9:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「......さっきみたいに鏡の中を通れば！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「ほかの鏡をさがしてみよう！　きっと、さっきみたいな鏡があるはず！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        wholeSound.play();
                                        bgm=true;
                                        wholeSound.volume=0.5;
                                        break;
                                }
                                break;
                            case 6:
                                eventKind=0;
                                scene.removeChild(message);
                                State=Nomal;
                                break;
                            case 7:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        break;
                                }
                        }
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene3_2 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['heya_girl.png'];
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
        var doorOpenSound = game.assets['door-open1.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);

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

        eventMap[6][12]=0;
        eventMap[14][12]=1;
        eventMap[15][12]=1;
        eventMap[17][12]=2;
        eventMap[18][12]=2;
        eventMap[7][7]=3;
        eventMap[8][7]=3;
        eventMap[9][7]=3;
        eventMap[10][7]=3;
        eventMap[13][6]=4;
        eventMap[14][6]=4;
        eventMap[16][6]=5;
        eventMap[17][6]=5;

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

        for(var i=7;i<19;i++){
            for(var j=7;j<15;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
        }

        for(var i=7;i<19;i++){
            for(var j=2;j<7;j++){
                array1[j][i]=5*16+1;
            }
        }
        
        for(var j=2;j<7;j++){
            array1[j][7]=5*16+9;
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

        //窓
        array2[2][12]=16*7+3;
        array2[2][13]=16*7+3;
        array2[3][12]=16*7+3;
        array2[3][13]=16*7+3;
        array2[2][14]=16*7+3;
        array2[2][15]=16*7+3;
        array2[3][14]=16*7+3;
        array2[3][15]=16*7+3;

        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                array2[j+3][i+12]=16*(14+j)+i;
            }
        }

        //鏡作成
        array2[3][16]=58*16+2;
        array2[3][17]=58*16+3;
        array2[4][16]=59*16+2;
        array2[4][17]=59*16+3;
        array2[5][16]=60*16+2;
        array2[5][17]=60*16+3;
        array2[6][16]=61*16+2;
        array2[6][17]=61*16+3;
        
        //マット
        array2[12][7]=16*62+15;
        array2[13][7]=16*63+15;

        //タンス
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                array2[5+i][7+j]=(22+i)*16+2+j;
            }
        }
        
        //カーテン用
        var array0 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array0[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array0[i][j]=-1;
            }
        }

        //カーテン
        array0[3][12]=14*16+8;
        array0[4][12]=15*16+8;
        array0[5][12]=16*16+8;
        array0[6][12]=17*16+8;

        array0[3][15]=14*16+11;
        array0[4][15]=15*16+11;
        array0[5][15]=16*16+11;
        array0[6][15]=17*16+11;

        array0[3][14]=14*16+9;
        array0[3][13]=14*16+10;

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
            array3[6+i][19]=1;
        }

        for(var i=0;i<12;i++){
            array3[6][7+i]=1;
            array3[15][7+i]=1;
        }
        //青ベッド衝突
        array3[11][14]=1;
        array3[11][15]=1;
        array3[13][14]=1;
        array3[13][15]=1;
        array3[14][14]=1;
        array3[14][15]=1;

        //赤ベッド衝突
        array3[11][17]=1;
        array3[11][18]=1;
        array3[13][17]=1;
        array3[13][18]=1;
        array3[14][17]=1;
        array3[14][18]=1;

        //タンス衝突
        array3[7][7]=1;
        array3[7][8]=1;
        array3[7][9]=1;
        array3[7][10]=1;

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

        //ベッド作成(青、赤)
        array2[11][17]=23*16+12;
        array2[12][17]=24*16+12;
        array4[13][17]=25*16+12;
        array4[14][17]=26*16+12;
        array2[11][18]=23*16+13;
        array2[12][18]=24*16+13;
        array4[13][18]=25*16+13;
        array4[14][18]=26*16+13;

        array2[11][14]=23*16+14;
        array2[12][14]=24*16+14;
        array4[13][14]=25*16+14;
        array4[14][14]=26*16+14;
        array2[11][15]=23*16+15;
        array2[12][15]=24*16+15;
        array4[13][15]=25*16+15;
        array4[14][15]=26*16+15;
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

        array5[12][17]=20*16+12;
        array5[13][17]=21*16+12;
        array5[12][18]=20*16+13;
        array5[13][18]=21*16+13;

        array5[12][14]=20*16+14;
        array5[13][14]=21*16+14;
        array5[12][15]=20*16+15;
        array5[13][15]=21*16+15;
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

        //プレイヤーの動き作成(いじらない)
        player.isMoving = false;
        //player.direction = 0;
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

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==31){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=2;
            player.x = 7 * 16 - 8;
            player.y = 11 * 16;
        }else if(previousScene==41){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 16 * 16 - 8;
            }else{
                player.x = 17 * 16 - 8;
            }
            player.y = 6 * 16;
            bgm=true;
            wholeSound.volume=0.5;
        }

        //マップ、キャラをグループ化して描画
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(player);
        stage.addChild(foregroundMap);
        stage.addChild(foregroundMap2);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

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
                wholeSound.volume=0.5;
            }

            if(State==Nomal){
                if(game.input.left && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,0)){
                    doorOpenSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            /*if(eventKind==1 && talkProgress == -1){
                player.tick++;
                if(player.tick==48){
                    player.tick=0;
                    buttonSound.play();
                    message=makeMessage("ミラ「うー、ねむいー・・・・・」");
                    scene.addChild(message);
                    talkProgress++;
                }
            }*/

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    player.tick=0;
                    nextScene=31;
                    previousScene=32;
                    game.popScene();
                }
            }else if(eventKind==5 && talkProgress == 0){
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
            }else if(eventKind==5 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==5 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==5 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=4;
                    nextScene=4;
                    previousScene=32;
                    game.popScene();
                }
            }


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                            buttonSound.play();
                            message=makeMessage('カギは開かないみたいだ...');
                            scene.addChild(message);
                            eventKind=2;
                            State=GameEvent;
                        }else if( isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                            buttonSound.play();
                            message=makeMessage('お父さんのおふとん');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }else if( isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                            buttonSound.play();
                            message=makeMessage('お母さんのおふとん');
                            scene.addChild(message);
                            eventKind=4;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('お父さんとお母さんの着替えが入っている');
                            scene.addChild(message);
                            eventKind=6;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,5)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=5;
                            State=GameEvent;
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
                                }
                                break;
                            case 2:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                break;
                            case 3:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                break;
                            case 4:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                break;
                            case 5:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        break;
                                }
                                break;
                            case 6:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                break;
                            
                        }
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene4 = function(wholeSound){
        var scene = new Scene();
        var wholeSound = game.assets['makkura.mp3'].clone();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==32　|| nextScene==41){
                game.pushScene(game.makeScene4_1(wholeSound));
            }else if(nextScene==42){
                game.pushScene(game.makeScene4_2(wholeSound));
            }else if(nextScene==43){
                game.pushScene(game.makeScene4_3(wholeSound));
            }else if(nextScene==44){
                game.pushScene(game.makeScene4_4(wholeSound));
            }else if(nextScene==45){
                game.pushScene(game.makeScene4_5(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    };

    game.makeScene4_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2=new Map(mapTileScale, mapTileScale);
        var foregroundMap2=new Map(mapTileScale, mapTileScale);
        var foregroundMap=new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
        var doleSound = game.assets['gusari.mp3'].clone();


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

        eventMap[15][18]=1;
        eventMap[14][18]=1;
        eventMap[11][10]=2;
        eventMap[10][10]=2;
        eventMap[14][25]=3;
        eventMap[15][25]=3;


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

        for(var i=0;i<8;i++){
            array1[26-i][15]=342;
            array1[26-i][14]=342;
            array1[26-i][13]=341;
            array1[26-i][16]=341;
        }

        for(var i=0;i<4;i++){
            for(var j=0;j<6;j++){
                array1[15+i][12+j]=342;
            }
        }

        array1[16][18]=342;
        array1[17][18]=342;
        array1[16][19]=342;
        array1[17][19]=342;

        for(var i=0;i<4;i++){
            array1[14-i][15]=342;
            array1[14-i][14]=342;
        }

        for(var i=0;i<4;i++){
            array1[11][13-i]=342;
            array1[12][13-i]=342;
        }

        for(var i=0;i<4;i++){
            array1[11][13-i]=342;
            array1[12][13-i]=342;
        }

        array1[10][10]=342;
        array1[10][11]=342;


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
        map.loadData(array1,array2);

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

        for(var i=0;i<8;i++){
            array3[26-i][13]=1;
            array3[26-i][16]=1;
        }

        array3[26][14]=1;
        array3[26][15]=1;

        array3[19][12]=1;
        array3[19][17]=1;

        array3[19][11]=1;
        array3[19][18]=1;

        array3[18][11]=1;
        array3[18][18]=1;
        array3[18][19]=1;
        array3[18][20]=1;
        array3[17][20]=1;
        array3[16][20]=1;
        array3[15][20]=1;
        array3[15][19]=1;
        array3[15][18]=1;
        array3[14][18]=1;
        array3[14][17]=1;
        array3[14][16]=1;
        array3[13][16]=1;
        array3[12][16]=1;
        array3[11][16]=1;
        array3[10][16]=1;
        array3[10][15]=1;
        array3[10][14]=1;
        array3[10][13]=1;
        array3[10][12]=1;
        array3[9][12]=1;
        array3[9][11]=1;
        array3[9][10]=1;
        array3[9][9]=1;
        array3[10][9]=1;
        array3[11][9]=1;
        array3[12][9]=1;
        array3[13][9]=1;
        array3[13][10]=1;
        array3[13][11]=1;
        array3[13][12]=1;
        array3[13][13]=1;
        array3[14][13]=1;
        array3[14][12]=1;
        array3[14][11]=1;
        array3[13][11]=1;
        array3[14][11]=1;
        array3[15][11]=1;
        array3[16][11]=1;
        array3[17][11]=1;

        //人形衝突判定
        array3[16][14]=68;
        array3[17][14]=78;
        array3[16][15]=69;
        array3[17][15]=79;

        map.collisionData=array3;

        //怖い系配置
        map2.image=game.assets['nomen.png'];

        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[9][13]=2;
        array4[10][13]=12;
        array4[9][14]=3;
        array4[10][14]=13;

        array4[16][18]=68;
        array4[17][18]=78;
        array4[16][19]=69;
        array4[17][19]=79;

        map2.loadData(array4);

        //人形頭部用
        foregroundMap.image=game.assets['nomen.png'];

        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array5[i][j]=-1;
            }
        }

        array5[15][18]=58;
        array5[15][19]=59;

        foregroundMap.loadData(array5);

        //前のシーン鏡用
        foregroundMap2.image = game.assets['makkuraEnterMirror.png'];

        var array6 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array6[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array6[i][j]=-1;
            }
        }

        array6[26][14]=2;
        array6[26][15]=3;
        foregroundMap2.loadData(array6);

        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*10;
        label.x=mapTileScale*10;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(map2);
        stage.addChild(label);
        stage.addChild(player);
        stage.addChild(foregroundMap);
        stage.addChild(foregroundMap2);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==32){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            player.x = 15 * 16 - 8;
            player.y = 24 * 16;
            bgm=true;
        }else if(previousScene==42){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 10 * 16 - 8;
            }else{
                player.x = 11 * 16 - 8;
            }
            player.y = 9 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    array4[16][18]=-1;
                    array4[17][18]=-1;
                    array4[16][19]=-1;
                    array4[17][19]=-1;
                    array5[15][18]=-1;
                    array5[15][19]=-1;

                    array4[16][14]=62;
                    array4[17][14]=72;
                    array4[16][15]=63;
                    array4[17][15]=73;
                    array5[15][14]=52;
                    array5[15][15]=53;

                    eventMap[15][18]=0;
                    eventMap[14][18]=0;
                    doleSound.play();

                }else if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,3)){
                    darkwholeSound.play();
                    eventKind=3;
                    State=GameEvent;
                    bgm=false;
                }
            }

            if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=42;
                    previousScene=41;
                    game.popScene();
                    if(playerToMapX(player.x)==10){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }else if(eventKind==3){
                player.tick++;
                if(player.tick==15){
                    darkwholeSound.stop();
                    nextScene=32;
                    previousScene=41;
                    nowScene=3;
                    if(playerToMapX(player.x)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }
            


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene4_2 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2=new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        map2.image = game.assets['nomen.png'];
        var runSound = game.assets['run.mp3'].clone();


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

        eventMap[6][12]=2;
        eventMap[6][13]=2;
        eventMap[10][21]=1;
        eventMap[11][21]=1;


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

        array1[20][10]=342;
        array1[20][11]=342;
        array1[21][10]=342;
        array1[21][11]=342;


        for(var i=0;i<12;i++){
            array1[18][10+i]=342;
            array1[19][10+i]=342;
        }

        for(var i=0;i<6;i++){
            array1[17-i][20]=342;
            array1[17-i][21]=342;
        }

        for(var i=0;i<14;i++){
            array1[12][19-i]=342;
            array1[13][19-i]=342;
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
        map.loadData(array1,array2);

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

        array3[11][5]=1;
        array3[12][5]=1;
        array3[22][10]=1;
        array3[22][11]=1;

        array3[20][9]=1;
        array3[20][2]=1;
        array3[21][9]=1;
        array3[21][2]=1;


        array3[19][9]=1;
        array3[18][9]=1;
        array3[17][9]=1;
        array3[17][10]=1;
        array3[17][11]=1;
        for(var i=0;i<8;i++){
            array3[17][12+i]=1;
            array3[20][12+i]=1;
        }

        for(var i=0;i<4;i++){
            array3[17-i][19]=1;
            array3[17-i][22]=1;
        }
        array3[13][22]=1;
        array3[12][22]=1;
        array3[11][22]=1;
        array3[11][21]=1;
        array3[11][20]=1;

        for(var i=0;i<14;i++){
            array3[11][19-i]=1;
            array3[14][19-i]=1;
        }

        array3[13][5]=1;

        map.collisionData=array3;

        //お面
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[10][18]=0;
        array4[10][19]=1;
        array4[11][18]=10;
        array4[11][19]=11;

        map2.loadData(array4);

        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale*2;
        label.width=mapTileScale;
        label.y=mapTileScale*12;
        label.x=mapTileScale*6;

        //マップ移動分かりやすいよう2作成
        var label2 = new Label();
        label2.backgroundColor = "rgba(255,255,255,0.1)";
        label2.height=mapTileScale;
        label2.width=mapTileScale*2;
        label2.y=mapTileScale*21;
        label2.x=mapTileScale*10;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(map2);
        stage.addChild(label);
        stage.addChild(label2);
        stage.addChild(player);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==41){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            player.x = 10 * 16 - 8;
            player.y = 20 * 16;
            bgm=true;
        }else if(previousScene==43){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=2;
            player.x = 6 * 16 - 8;
            if(previousCharaLocate==0){
                player.y = 11 * 16;
            }else{
                player.y = 12 * 16;
            }
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=41;
                    previousScene=42;
                    game.popScene();
                    if(playerToMapX(player.x)==10){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }else if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=43;
                    previousScene=42;
                    game.popScene();
                    if(playerToMapY(player.y)==12){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }
            


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene4_3 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2=new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        map2.image = game.assets['nomen.png'];
        var runSound = game.assets['run.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();


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

        eventMap[22][10]=1;
        eventMap[22][11]=1;
        eventMap[16][17]=2;
        eventMap[15][17]=2;

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

        for(var i=0;i<8;i++){
            for(var j=0;j<2;j++){
                array1[j+10][i+15]=342;
            }
        }

        for(var i=0;i<2;i++){
            for(var j=0;j<6;j++){
                array1[j+12][i+15]=342;
            }
        }

        for(var i=0;i<3;i++){
            for(var j=0;j<3;j++){
                array1[j+10][i]=342;
            }
        }

        array1[10][3]=342;
        array1[11][3]=342;
        array1[10][4]=342;
        array1[11][4]=342;


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
        map.loadData(array1,array2);

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

        array3[10][23]=1;
        array3[11][23]=1;
        array3[18][15]=1;
        array3[18][16]=1;

        array3[9][15]=1;
        array3[9][16]=1;
        for(var i=0;i<6;i++){
            array3[9][i+17]=1;
            array3[12][i+17]=1;
        }

        for(var i=0;i<12;i++){
            array3[9][i+3]=1;
            array3[12][i+3]=1;
        }

        for(var i=0;i<3;i++){
            array3[9][i]=1;
            array3[13][i]=1;
        }

        for(var j=0;j<6;j++){
            array3[j+12][14]=1;
            array3[j+12][17]=1;
        }

        map.collisionData=array3;

        //お面
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[8][18]=4;
        array4[8][19]=5;
        array4[9][18]=14;
        array4[9][19]=15;

        map2.loadData(array4);

        //アイテム「リコーダー」用
        if(itemList[0]==0){
            eventMap[1][11]=3;
            array3[11][1]=1;
            array2[11][1]=420;
        }

        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale*2;
        label.width=mapTileScale;
        label.y=mapTileScale*10;
        label.x=mapTileScale*22;

        //マップ移動分かりやすいよう2作成
        var label2 = new Label();
        label2.backgroundColor = "rgba(255,255,255,0.1)";
        label2.height=mapTileScale;
        label2.width=mapTileScale*2;
        label2.y=mapTileScale*17;
        label2.x=mapTileScale*15;

        //暗闇マスク作成
        var label3 = new Label();
        label3.backgroundColor = "rgba(0,0,0,1)";
        label3.height=mapTileScale*4;
        label3.width=mapTileScale*10;
        label3.y=mapTileScale*9;
        label3.x=mapTileScale*5;

        //マップ移動分かりやすいよう3作成
        var label4 = new Label();
        label4.backgroundColor = "rgba(255,255,255,0.1)";
        label4.height=mapTileScale*2;
        label4.width=mapTileScale;
        label4.y=mapTileScale*10;
        label4.x=mapTileScale*15;

        //マップ移動分かりやすいよう4作成
        var label5 = new Label();
        label5.backgroundColor = "rgba(255,255,255,0.1)";
        label5.height=mapTileScale*2;
        label5.width=mapTileScale;
        label5.y=mapTileScale*10;
        label5.x=mapTileScale*4;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(map2);
        stage.addChild(label);
        stage.addChild(label2);
        stage.addChild(label4);
        stage.addChild(label5);
        stage.addChild(player);
        stage.addChild(label3);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==42){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            player.x = 22 * 16 - 8;
            if(previousCharaLocate==0){
                player.y = 9 * 16;
            }else{
                player.y = 10 * 16;
            }
            bgm=true;
        }else if(previousScene==44){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            if(previousCharaLocate==0){
                player.x = 15 * 16 - 8;
            }else{
                player.x = 16 * 16 - 8;
            }
            player.y = 16 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.right && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=42;
                    previousScene=43;
                    if(playerToMapY(player.y)==10){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=44;
                    previousScene=43;
                    if(playerToMapX(player.x)==15){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }
            


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('アイテム「リコーダー」を手に入れた');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }else{
                            //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                            //scene.addChild(message);
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 3:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                eventMap[1][11]=0;
                                array2[11][1]=-1;
                                map.loadData(array1,array2);
                                array3[11][1]=0;
                                itemList[0]=1;
                                break;
                        }
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene4_4 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2=new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        map2.image = game.assets['nomen.png'];
        var runSound = game.assets['run.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var doleSound = game.assets['gusari.mp3'].clone();

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

        eventMap[20][6]=1;
        eventMap[21][6]=1;
        eventMap[7][6]=2;
        eventMap[8][6]=2;
        eventMap[20][17]=4;
        eventMap[21][17]=4;

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

        for(var i=0;i<2;i++){
            for(var j=0;j<4;j++){
                array1[j+6][i+20]=342;
            }
        }

        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                array1[j+10][i+19]=342;
            }
        }

        for(var i=0;i<3;i++){
            for(var j=0;j<2;j++){
                array1[j+11][i+23]=342;
            }
        }

        for(var i=0;i<2;i++){
            for(var j=0;j<6;j++){
                array1[j+14][i+20]=342;
            }
        }

        for(var i=0;i<13;i++){
            for(var j=0;j<2;j++){
                array1[j+20][i+9]=342;
            }
        }

        for(var i=0;i<13;i++){
            for(var j=0;j<2;j++){
                array1[j+11][i+9]=342;
            }
        }

        for(var i=0;i<2;i++){
            for(var j=0;j<16;j++){
                array1[j+6][i+7]=342;
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

        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<4;i++){
            array3[6+i][19]=1;
            array3[6+i][22]=1;
        }

        for(var i=0;i<3;i++){
            array3[10][23+i]=1;
            array3[13][23+i]=1;
        }

        array3[11][26]=1;
        array3[12][26]=1;
        array3[13][18]=1;

        for(var i=0;i<6;i++){
            array3[14+i][19]=1;
            array3[14+i][22]=1;
        }

        array3[20][22]=1;
        array3[21][22]=1;
        array3[22][21]=1;
        array3[22][20]=1;

        for(var i=0;i<11;i++){
            array3[19][19-i]=1;
            array3[22][19-i]=1;
        }

        for(var i=0;i<10;i++){
            array3[10][18-i]=1;
            array3[13][18-i]=1;
        }

        array3[20][6]=1;
        array3[21][6]=1;
        array3[22][7]=1;
        array3[22][8]=1;

        for(var i=0;i<5;i++){
            array3[6+i][6]=1;
            array3[6+i][9]=1;
        }

        array3[11][6]=1;
        array3[12][6]=1;

        for(var i=0;i<7;i++){
            array3[13+i][6]=1;
            array3[13+i][9]=1;
        }

        array3[5][20]=1;
        array3[5][21]=1;
        array3[5][7]=1;
        array3[5][8]=1;

        //人形衝突判定
        array3[11][23]=1;
        array3[12][23]=1;

        map.collisionData=array3;

        //お面たち用
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        //人形
        array4[10][23]=98;
        array4[10][24]=99;
        array4[11][23]=108;
        array4[11][24]=109;
        array4[12][23]=118;
        array4[12][24]=119;

        //鬼の面
        for(var i=0;i<6;i++){
            array4[9][9+i]=i;
            array4[10][9+i]=10+i;
        }
        for(var i=0;i<4;i++){
            array4[9][15+i]=20+i;
            array4[10][15+i]=30+i;
        }

        map2.loadData(array4);

        //アイテム「なふだ」用
        if(itemList[1]==0){
            eventMap[25][12]=3;
            array3[12][25]=1;
            array2[12][25]=420;
        }

        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*6;
        label.x=mapTileScale*20;

        //マップ移動分かりやすいよう2作成
        var label2 = new Label();
        label2.backgroundColor = "rgba(255,255,255,0.1)";
        label2.height=mapTileScale;
        label2.width=mapTileScale*2;
        label2.y=mapTileScale*6;
        label2.x=mapTileScale*7;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(map2);
        stage.addChild(label);
        stage.addChild(label2);
        stage.addChild(player);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==43){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 20 * 16 - 8;
            }else{
                player.x = 21 * 16 - 8;
            }
            player.y = 5 * 16;
            bgm=true;
        }else if(previousScene==45){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 7 * 16 - 8;
            }else{
                player.x = 8 * 16 - 8;
            }
            player.y = 5 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,4)){
                    doleSound.play();
                    
                    array4[10][23]=-1;
                    array4[10][24]=-1;
                    array4[11][23]=-1;
                    array4[11][24]=-1;
                    array4[12][23]=-1;
                    array4[12][24]=-1;

                    array3[11][23]=0;
                    array3[12][23]=0;

                    array4[14][20]=92;
                    array4[14][21]=93;
                    array4[15][20]=102;
                    array4[15][21]=103;
                    array4[16][20]=112;
                    array4[16][21]=113;

                    array3[14][20]=1;
                    array3[14][21]=1;
                    array3[16][20]=1;
                    array3[16][21]=1;

                    eventMap[20][17]=0;
                    eventMap[21][17]=0;

                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=43;
                    previousScene=44;
                    if(playerToMapX(player.x)==20){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=45;
                    previousScene=44;
                    if(playerToMapX(player.x)==7){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }
            


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('アイテム「なふだ」を手に入れた');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }else{
                            //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                            //scene.addChild(message);
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 3:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                eventMap[25][12]=0;
                                array2[12][25]=-1;
                                map.loadData(array1,array2);
                                array3[12][25]=0;
                                itemList[1]=1;
                                break;
                        }
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene4_5 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2=new Map(mapTileScale, mapTileScale);
        var map3=new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        map2.image = game.assets['heya_girl2.png'];
        map3.image = game.assets['heya_girl2.png'];
        var runSound = game.assets['run.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var musicSound = game.assets['music.mp3'].clone();
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);


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

        if(itemList[3]==0){
            eventMap[14][14]=3;
            eventMap[15][14]=3;
        }
        eventMap[14][19]=1;
        eventMap[15][19]=1;
        eventMap[14][13]=2;
        eventMap[15][13]=2;


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

        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                array1[j+10][i+10]=342;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<11;i++){
            array3[9+i][9]=1;
            array3[9][9+i]=1;
            array3[20][9+i]=1;
            array3[9+i][20]=1;
        }

        if(itemList[14]==0){
            array3[14][14]=1;
            array3[14][15]=1;
        }
        array3[13][14]=1;
        array3[13][15]=1;

        map.collisionData=array3;

        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[10][14]=58*16+2;
        array4[10][15]=58*16+3;
        array4[11][14]=59*16+2;
        array4[11][15]=59*16+3;
        array4[12][14]=60*16+2;
        array4[12][15]=60*16+3;

        map2.loadData(array4);

        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array5[i][j]=-1;
            }
        }

        array5[13][14]=61*16+2;
        array5[13][15]=61*16+3;

        map3.loadData(array5);

        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*19;
        label.x=mapTileScale*14;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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

        //くろくろ作成
        var player2 = new Sprite(32, 32);
        player2.x = 14 * 16;
        player2.y = 13 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player2.image = image;
        player2.scaleX=2;

        //くろくろ作成(いじらない)
        player2.isMoving = false;
        player2.direction = 0;
        player2.walk = 1;
        player2.addEventListener('enterframe', function() {
            if(bgm==true) wholeSound.play();

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
                
            }
        });

        //マップ、キャラをグループ化して描画
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(map3);
        stage.addChild(label);
        if(itemList[3]==0)
            stage.addChild(player2);
        stage.addChild(player);
        stage.addChild(map2);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==44){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            if(previousCharaLocate==0){
                player.x = 14 * 16 - 8;
            }else{
                player.x = 15 * 16 - 8;
            }
            player.y = 18 * 16;
            if(itemList[2]==0){
                eventKind=4;
                State=GameEvent;
                bgm=false;
            }else{
                bgm=true;
            }
        }else if(previousScene==51){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 14 * 16 - 8;
            }else{
                player.x = 15 * 16 - 8;
            }
            player.y = 12 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=44;
                    previousScene=45;
                    game.popScene();
                    if(playerToMapX(player.x)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }else if(eventKind==4){
                if(talkProgress==0){
                    player.tick++;
                    if(player.tick==10){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==1){
                    buttonSound.play();
                    message=makeMessage("ミラ「あ！　鏡あった！」");
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==5 && playerToMapY(player.y)!=15){
                    player.vx = 0;
                    player.direction = 3;
                    player.vy = -4;
                    player.isMoving=true;
                }else if(talkProgress == 5){
                    player.vy=0;
                    player.isMoving=false;
                    talkProgress++;

                    player.tick=0;
                }else if(talkProgress==6){
                    player.tick++;
                    if(player.tick==10){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==7){
                    buttonSound.play();
                    message=makeMessage("？？？「ケケ....ケケケ.....」");
                    scene.addChild(message);
                    talkProgress++;
                }
            }else if(eventKind==5){
                if(talkProgress==1){
                    scene.removeChild(message);
                    musicSound.play();
                    talkProgress++;
                }else if(talkProgress==2){
                    player.tick++;
                    if(player.tick==75){
                        player.tick=0;
                        buttonSound.play();
                        message=makeMessage('ミラ「わたしだってれんしゅうしたんだよーだ！」');
                        scene.addChild(message);
                        talkProgress++;
                    }
                }else if(talkProgress==5){
                    player.tick++;
                    if(player.tick==30){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==6){
                    scene.removeChild(message);
                    message=screenDark(1);
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==7){
                    player.tick++;
                    if(player.tick==5){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==8){
                    stage.removeChild(player2);
                    array3[14][14]=0;
                    array3[14][15]=0;
                    eventMap[14][14]=0;
                    eventMap[15][14]=0;
                    scene.removeChild(message);
                    talkProgress++;
                }else if(talkProgress==9){
                    player.tick++;
                    if(player.tick==15){
                        buttonSound.play();
                        message=makeMessage('ミラ「あ、行っちゃった」');
                        scene.addChild(message);
                        talkProgress++;
                        player.tick=0;
                    }
                }
            }else if(eventKind==2 && talkProgress == 0){
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
            }else if(eventKind==2 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==2 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==2 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=5;
                    nextScene=51;
                    previousScene=45;
                    game.popScene();
                    if(playerToMapX(player.x)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }
            


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            if(itemList[0]==0){
                                buttonSound.play();
                                message=makeMessage('くろくろ「おまえのリコーダー、音がずれててきもちわるーい！　ケラケラケラ！！」');
                                scene.addChild(message);
                                eventKind=3;
                                State=GameEvent;
                            }else{
                                bgm=false;
                                buttonSound.play();
                                message=makeMessage('ミラ「よーし、これでどうだ！」');
                                scene.addChild(message);
                                eventKind=5;
                                State=GameEvent;
                            }
                        }else if(player.direction==3 && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=2;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 2:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        break;
                                }
                                break;
                            case 3:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「やい、くろくろ！　ちょっとまってろー！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「もうちょっとまわりをさがせばなにかおちてるかも......」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        break;
                                }
                                break;
                            case 4:
                                switch(talkProgress){
                                    case 0:
                                        
                                        break;
                                    case 1:
                                            
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「.....でも、前にいるのなんだろう」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「おーい、まっくろくろすけさーん！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        break;
                                    case 6:
                                        
                                        break;
                                    case 7:
                                        break;
                                    case 8:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「そこをどいてくれませんかー？　わたし、その鏡の向こうに行きたいの」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 9:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("？？？「......へたっぴー！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「...え？」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("？？？「おまえのリコーダー、音がずれててきもちわるーい！　ケラケラケラケラ！！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 12:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「な、なんでそのことを！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 13:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「わたし、へたっぴだけど、へたっぴだけどー........！　うーっ！　あったまきた！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 14:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「やい、くろくろ！　ちょっとまってろー！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        itemList[2]=1;
                                        bgm=true;
                                        break;
                                }
                                break;

                            case 5:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 1:
                                        
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('くろくろ「.....キキ！　けっこうやるじゃん！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('くろくろ「あー、おもしろかったー！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        
                                        break;
                                    case 6:
                                        
                                        break;
                                    case 7:
                                        
                                        break;
                                    case 8:
                                        
                                        break;
                                    case 9:
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「ついムカってなっちゃったけど、なんだったんだろう.....？」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「まあいっか！　急がないとちこくしちゃう！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        itemList[3]=1;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        bgm=true;
                                        break;
                                }
                                break;
                        }
                }
            }
        });
        return scene;

    };

    game.makeScene5 = function(wholeSound){
        var scene = new Scene();
        var wholeSound = game.assets['future.mp3'].clone();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==45　|| nextScene==51){
                game.pushScene(game.makeScene5_1(wholeSound));
            }else if(nextScene==52){
                game.pushScene(game.makeScene5_2(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    };

    game.makeScene5_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2 = new Map(mapTileScale, mapTileScale);
        var map3 = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['heya_girl.png'];
        map2.image = game.assets['Bath.png'];
        map3.image = game.assets['Bath2.png'];
        var doorSound = game.assets['door.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var runSound = game.assets['run.mp3'].clone();
        var doorOpenSound = game.assets['door-open1.mp3'].clone();

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

        eventMap[12][10]=1;
        eventMap[13][10]=1;
        eventMap[19][14]=2;
        eventMap[19][15]=2;
        eventMap[10][10]=3;
        eventMap[11][10]=3;
        eventMap[14][10]=5;
        eventMap[15][10]=5;
        eventMap[14][11]=5;
        eventMap[15][11]=5;
        eventMap[16][10]=6;
        eventMap[17][10]=6;
        eventMap[10][14]=7;
        eventMap[10][15]=7;
        if(itemList[14]==1){
            eventMap[10][14]=8;
            eventMap[10][15]=8;
        }

        scene.backgroundColor ="black";

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

        for(var i=10;i<18;i++){
            for(var j=10;j<18;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
        }

        array1[14][18]=0;
        array1[14][19]=0;
        array1[15][18]=17;
        array1[15][19]=17;

        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                    array5[j][i]=-1;
            }
        }

        array5[14][10]=62*16+15;
        array5[15][10]=63*16+15;

        map.loadData(array1,array5);

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

        for(var i=6;i<9;i++){
            for(var j=11;j<18;j++){
                array2[i][j]=32*i+1;
            }
        }
        for(var j=11;j<18;j++){
            array2[9][j]=32*9+2;
        }

        for(var j=11;j<18;j++){
            array2[6][j]=32*6+1;
        }

        array2[6][10]=32*6;
        array2[7][10]=32*7;
        array2[8][10]=32*8;
        array2[9][10]=32*9;

        for(var i=10;i<13;i++){
            for(var j=18;j<20;j++){
                array2[i][j]=32*(i-4)+1;
            }
        }
        for(var j=18;j<20;j++){
            array2[13][j]=32*9+2;
        }

        map2.loadData(array2);

        var array3 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array3[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array3[i][j]=-1;
            }
        }

        //ソープ台
        array3[8][10]=32*16+16;
        array3[8][11]=32*16+17;
        array3[9][10]=32*17+16;
        array3[9][11]=32*17+17;
        array3[10][10]=32*18+16;
        array3[10][11]=32*18+17;

        //洗面台
        array3[6][12]=32*0+22;
        array3[6][13]=32*0+23;
        array3[7][12]=32*1+22;
        array3[7][13]=32*1+23;
        array3[8][12]=32*2+22;
        array3[8][13]=32*2+23;
        array3[9][12]=32*3+22;
        array3[9][13]=32*3+23;
        array3[10][12]=32*4+22;
        array3[10][13]=32*4+23;

        //洗濯かご
        array3[10][14]=32*6+16;
        array3[10][15]=32*6+17;
        array3[11][14]=32*7+16;
        array3[11][15]=32*7+17;

        //洗濯機
        array3[8][16]=32*8+20;
        array3[8][17]=32*8+21;
        array3[9][16]=32*9+20;
        array3[9][17]=32*9+21;
        array3[10][16]=32*10+20;
        array3[10][17]=32*10+21;
        array3[11][16]=32*11+20;
        array3[11][17]=32*11+21;

        //バスマット
        array3[14][18]=32*2+28;
        array3[14][19]=32*2+29;
        array3[15][18]=32*3+28;
        array3[15][19]=32*3+29;

        map3.loadData(array3);

        //衝突判定
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=0;
            }
        }

        for(var i=0;i<10;i++){
            array4[9][9+i]=1;
        }

        for(var i=0;i<4;i++){
            array4[10+i][18]=1;
        }

        array4[13][19]=1;

        for(var i=0;i<4;i++){
            array4[13+i][20]=1;
        }

        array4[16][19]=1;

        for(var i=0;i<3;i++){
            array4[16+i][18]=1;
        }

        for(var i=0;i<9;i++){
            array4[18][9+i]=1;
        }

        for(var i=0;i<8;i++){
            array4[10+i][9]=1;
        }

        for(var i=0;i<8;i++){
            array4[10][10+i]=1;
        }

        for(var i=0;i<2;i++){
            array4[11][14+i]=1;
        }

        map.collisionData=array4;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 8 * 16 - 8;
        player.y = 11 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        //飛ばす時コメントアウトはずす
        // State=GameEvent;
        // eventKind=4;
        // talkProgress=9;



        //プレイする時コメントアウトはずす
        //State=GameEvent;
        //eventKind=1;
        //talkProgress=-1;

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
        stage.addChild(map2);
        stage.addChild(map3);
        stage.addChild(player);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==45){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 12 * 16 - 8;
            }else{
                player.x = 13 * 16 - 8;
            }
            player.y = 10 * 16;
            if(itemList[4]==0){
                eventKind=3;
                State=GameEvent;
                bgm=false;
            }else{
                bgm=true;
            }
        }else if(previousScene==52){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            if(previousCharaLocate==0){
                player.y = 13 * 16;
            }else{
                player.y = 14 * 16;
            }
            player.x = 19 * 16 - 8;
            bgm=true;
        }else if(previousScene==71){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=2;
            if(previousCharaLocate==0){
                player.y = 13 * 16;
            }else{
                player.y = 14 * 16;
            }
            player.x = 10 * 16 - 8;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,7)){
                    doorSound.play();
                    eventKind=4;
                    State=GameEvent;
                }else if(game.input.right && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,8)){
                    doorOpenSound.play();
                    eventKind=8;
                    State=GameEvent;
                }
            }

            if(eventKind==3){
                if(talkProgress==0){
                    player.tick++;
                    if(player.tick==10){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==1){
                    buttonSound.play();
                    message=makeMessage("ミラ「洗面所だ！」");
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==3){
                    if(playerToMapY(player.y)!=14){
                        player.isMoving=true;
                        player.vy=4;
                    }else if(playerToMapX(player.x)!=10){
                        player.vy=0;
                        player.direction=1;
                        player.isMoving=true;
                        player.vx=-4;
                    }else{
                        player.isMoving=false;
                        talkProgress++;
                    }
                }else if(talkProgress==4){
                    player.tick++;
                    if(player.tick==5){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==5){
                    buttonSound.play();
                    message=makeMessage("ミラ「ここを出れば玄関はすぐ.....」");
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==7){
                    player.tick++;
                    if(player.tick==10){
                        doorSound.stop();
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==8){
                    buttonSound.play();
                    message=makeMessage("ミラ「もーっ！　またつうこーどめなの！？」");
                    scene.addChild(message);
                    talkProgress++;
                }
                
            }else if(eventKind==4){
                if(talkProgress==0){
                    player.tick++;
                    if(player.tick==10){
                        doorSound.stop();
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==1){
                    buttonSound.play();
                    message=makeMessage("カギがかかっている");
                    scene.addChild(message);
                    talkProgress++;
                }
                
            }else if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=52;
                    previousScene=51;
                    if(playerToMapY(player.y)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
                
            }else if(eventKind==8){
                player.tick++;
                if(player.tick==15){
                    nextScene=71;
                    nowScene=7;
                    previousScene=51;
                    if(playerToMapY(player.y)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
                
            }

        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage("ミラ「シャンプーがなくなってる！　ママに言わなくちゃ」");
                            State=GameEvent;
                            eventKind=5;
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,5)){
                            buttonSound.play();
                            message=makeMessage("ミラ「ちゃんとせんたくしないと！」");
                            State=GameEvent;
                            eventKind=6;
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,6)){
                            buttonSound.play();
                            message=makeMessage("ミラ「あとでせんたくしといてあげよう」");
                            State=GameEvent;
                            eventKind=7;
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,1)){
                            buttonSound.play();
                            message=makeMessage("ミラ「自分がでてきた鏡だ！」");
                            State=GameEvent;
                            eventKind=1;
                            scene.addChild(message);
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「とりあえず他を調べてみよう！」");
                                        State=GameEvent;
                                        eventKind=1;
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
                            case 3:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        break;
                                    case 4:
                                        break;
                                    case 5:
                                        break;
                                    case 6:
                                        doorSound.play();
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 7:
                                        break;
                                    case 8:
                                        break;
                                    case 9:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「ほかの鏡を探さないと.....」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「でも、ここにはもう鏡なんてない、よね？」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「......もしかして」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        bgm=true;
                                        break;

                                }
                                break;
                            case 4:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        break;
                                }
                            case 5:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                            case 6:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                            case 7:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                                
                        }
                        
                        break;
                }
            }
        });

        return scene;

    };

    game.makeScene5_2 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2 = new Map(mapTileScale, mapTileScale);
        var map3 = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['yuka.png'];
        map2.image = game.assets['Bath.png'];
        map3.image = game.assets['Bath2.png'];
        var splashSound = game.assets['splash.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var runSound = game.assets['run.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);

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

        eventMap[8][14]=1;
        eventMap[8][15]=1;
        eventMap[19][10]=2;
        eventMap[19][11]=2;
        eventMap[19][12]=2;
        eventMap[20][13]=2;
        eventMap[12][10]=3;
        eventMap[13][10]=3;
        eventMap[14][9]=4;
        eventMap[15][9]=4;
        eventMap[14][12]=5;
        eventMap[15][12]=5;
        eventMap[14][13]=5;
        eventMap[15][13]=5;
        eventMap[16][10]=6;
        eventMap[17][10]=6;
        eventMap[16][11]=6;
        eventMap[17][11]=6;
        

        scene.backgroundColor ="black";

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

        for(var i=10;i<22;i++){
            for(var j=10;j<18;j++){
                if(i%2==1)
                    array1[j][i]=32*6+2;
                else
                    array1[j][i]=32*7+2;
            }
        }

        array1[14][8]=32*6+2;
        array1[14][9]=32*6+2;
        array1[15][8]=32*7+2;
        array1[15][9]=32*7+2;

        map.loadData(array1);

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

        for(var i=6;i<10;i++){
            for(var j=10;j<22;j++){
                array2[i][j]=32*i+12+(j%4);
            }
        }

        for(var i=10;i<14;i++){
            for(var j=8;j<10;j++){
                array2[i][j]=32*(i-4)+12+(j%4);
            }
        }
        

        map2.loadData(array2);

        var array3 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array3[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array3[i][j]=-1;
            }
        }

        //ソープ台
        array3[8][12]=32*26+10;
        array3[8][13]=32*26+11;
        array3[9][12]=32*27+10;
        array3[9][13]=32*27+11;
        array3[10][12]=32*28+10;
        array3[10][13]=32*28+11;

        //シャワーヘッド
        array3[6][14]=32*20+8;
        array3[7][14]=32*21+8;
        array3[8][14]=32*22+8;
        array3[9][14]=32*23+8;
        array3[9][15]=32*23+9;
        array3[9][16]=32*23+10;

        //洗面器
        array3[10][16]=32*24+6;
        array3[10][17]=32*24+7;
        array3[11][16]=32*25+6;
        array3[11][17]=32*25+7;

        //風呂
        array3[8][19]=32*10+5;
        array3[8][20]=32*10+6;
        array3[8][21]=32*10+7;
        array3[9][19]=32*11+5;
        array3[9][20]=32*11+6;
        array3[9][21]=32*11+7;
        array3[10][19]=32*12+5;
        array3[10][20]=32*12+6;
        array3[10][21]=32*12+7;
        array3[11][19]=32*13+5;
        array3[11][20]=32*13+6;
        array3[11][21]=32*13+7;
        array3[12][19]=32*14+5;
        array3[12][20]=32*14+6;
        array3[12][21]=32*14+7;
        array3[13][19]=32*15+5;
        array3[13][20]=32*15+6;
        array3[13][21]=32*15+7;

        //椅子
        array3[12][14]=32*26+6;
        array3[12][15]=32*26+7;
        array3[13][14]=32*27+6;
        array3[13][15]=32*27+7;

        map3.loadData(array3);

        //衝突判定
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=0;
            }
        }

        for(var i=0;i<16;i++){
            array4[9][7+i]=1;
        }

        for(var i=0;i<9;i++){
            array4[10+i][22]=1;
        }


        for(var i=0;i<13;i++){
            array4[18][9+i]=1;
        }

        array4[17][9]=1;

        for(var i=0;i<3;i++){
            array4[16][7+i]=1;
        }

        for(var i=0;i<3;i++){
            array4[13+i][7]=1;
        }

        for(var i=0;i<2;i++){
            array4[13][8+i]=1;
        }

        for(var i=0;i<4;i++){
            array4[10+i][9]=1;
        }

        //ふろ
        array4[10][19]=1;
        array4[11][19]=1;
        array4[12][19]=1;
        array4[13][19]=1;
        array4[13][20]=1;
        array4[13][21]=1;

        //洗面器
        array4[10][16]=1;
        array4[10][17]=1;
        array4[11][16]=1;
        array4[11][17]=1;

        //ソープ台
        array4[10][12]=1;
        array4[10][13]=1;

        //いす
        array4[12][14]=1;
        array4[12][15]=1;
        array4[13][14]=1;
        array4[13][15]=1;

        map.collisionData=array4;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 8 * 16 - 8;
        player.y = 11 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        //飛ばす時コメントアウトはずす
        // State=GameEvent;
        // eventKind=4;
        // talkProgress=9;



        //プレイする時コメントアウトはずす
        //State=GameEvent;
        //eventKind=1;
        //talkProgress=-1;

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
        stage.addChild(map2);
        stage.addChild(map3);
        stage.addChild(player);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==51){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=2;
            if(previousCharaLocate==0){
                player.y = 13 * 16;
            }else{
                player.y = 14 * 16;
            }
            player.x = 8 * 16 - 8;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.right && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }
            }

            if(eventKind==7){
                if(talkProgress==0){
                    player.tick++;
                    if(player.tick==10){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==1){
                    buttonSound.play();
                    message=makeMessage("ミラ「洗面所だ！」");
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==3){
                    if(playerToMapY(player.y)!=14){
                        player.isMoving=true;
                        player.vy=4;
                    }else if(playerToMapX(player.x)!=10){
                        player.vy=0;
                        player.direction=1;
                        player.isMoving=true;
                        player.vx=-4;
                    }else{
                        player.isMoving=false;
                        talkProgress++;
                    }
                }else if(talkProgress==4){
                    player.tick++;
                    if(player.tick==5){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==5){
                    buttonSound.play();
                    message=makeMessage("ミラ「ここを出れば玄関はすぐ.....」");
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==7){
                    player.tick++;
                    if(player.tick==10){
                        doorSound.stop();
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==8){
                    buttonSound.play();
                    message=makeMessage("ミラ「もーっ！　またつうこーどめなの！？」");
                    scene.addChild(message);
                    talkProgress++;
                }
                
            }else if(eventKind==2 && talkProgress == 0){
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
            }else if(eventKind==2 && talkProgress == 1){
                buttonSound.play();
                message=makeMessage('ミラ「やっぱりだ。水のおくに広がってる」');
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==2 && talkProgress == 6){
                talkProgress++;
            }else if(eventKind==2 && talkProgress == 7){
                player.tick++;
                player.y-=6;
                if(player.tick==2){
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==2 && talkProgress == 8){
                player.tick++;
                if(playerToMapX(player.x)!=20){
                    player.x+=4;
                    
                }else{
                    player.y-=4;
                }

                if(player.tick==8){
                    talkProgress++;
                    player.tick=0;
                }
            }else if(eventKind==2 && talkProgress == 9){
                splashSound.play();
                player.tick++;
                player.y+=4;

                if(player.tick==2){
                    talkProgress++;
                    nowScene=6;
                    nextScene=61;
                    previousScene=52;
                }
            }else if(eventKind==2 && talkProgress == 10){
                player.tick++;

                if(player.tick==10){
                    game.popScene();
                }
            }else if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=51;
                    previousScene=52;
                    if(playerToMapY(player.y)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
                
            }
            


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage("ミラ「シャンプーなくなっちゃうよ！」");
                            State=GameEvent;
                            eventKind=3;
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                            buttonSound.play();
                            message=makeMessage("ミラ「シャワー浴びたいなー..."+"<br>"+"じゃなくて早く学校行かなくちゃ！」");
                            State=GameEvent;
                            eventKind=4;
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,6)){
                            buttonSound.play();
                            message=makeMessage("ミラ「この中には...さすがに入れないや」");
                            State=GameEvent;
                            eventKind=6;
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,5)){
                            buttonSound.play();
                            message=makeMessage("椅子がある");
                            State=GameEvent;
                            eventKind=5;
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            buttonSound.play();
                            message=makeMessage('おふろを調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=2;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                                
                                break;
                            case 2:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            if(itemList[14]==1){
                                                talkProgress=6;
                                            }else{
                                                talkProgress++;
                                            }
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「鏡のかわりってこと？」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「じゃあ、ここに飛び込めば....」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「よーし！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        scene.removeChild(message);
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
                                    case 10:
                                        break;
                                }
                                break;
                            case 3:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                            case 4:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                            case 5:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                            case 6:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                                
                        }
                        
                        break;
                }
            }
        });

        return scene;

    };

    game.makeScene6 = function(wholeSound){
        var scene = new Scene();
        var wholeSound = game.assets['makkura.mp3'].clone();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==52　|| nextScene==61){
                game.pushScene(game.makeScene6_1(wholeSound));
            }else if(nextScene==62){
                game.pushScene(game.makeScene6_2(wholeSound));
            }else if(nextScene==63){
                game.pushScene(game.makeScene6_3(wholeSound));
            }else if(nextScene==64){
                game.pushScene(game.makeScene6_4(wholeSound));
            }else if(nextScene==65){
                game.pushScene(game.makeScene6_5(wholeSound));
            }else if(nextScene==66){
                game.pushScene(game.makeScene6_6(wholeSound));
            }else if(nextScene==67){
                game.pushScene(game.makeScene6_7(wholeSound));
            }else if(nextScene==68){
                game.pushScene(game.makeScene6_8(wholeSound));
            }else if(nextScene==69){
                game.pushScene(game.makeScene6_9(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    };

    game.makeScene6_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();


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

        eventMap[14][10]=2;
        eventMap[15][10]=2;


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

        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                    array1[j+10][i+10]=323;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<12;i++){
            array3[9][9+i]=1;
            array3[20][9+i]=1;
            array3[9+i][9]=1;
            array3[9+i][20]=1;
        }

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*10;
        label.x=mapTileScale*14;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==52){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            player.x = 14 * 16 - 8;
            player.y = 15 * 16;
            bgm=true;
        }else if(previousScene==62){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 14 * 16 - 8;
            }else{
                player.x = 15 * 16 - 8;
            }
            player.y = 9 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }
            }

            if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=62;
                    previousScene=61;
                    game.popScene();
                    if(playerToMapX(player.x)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }   


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_2 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();


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

        eventMap[12][10]=3;
        eventMap[13][10]=3;
        eventMap[12][15]=1;
        eventMap[13][15]=1;
        eventMap[10][12]=2;
        eventMap[10][13]=2;
        eventMap[15][12]=4;
        eventMap[15][13]=4;


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

        for(var i=0;i<6;i++){
            for(var j=0;j<6;j++){
                    array1[j+10][i+10]=323;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<8;i++){
            array3[9][9+i]=1;
            array3[16][9+i]=1;
            array3[9+i][9]=1;
            array3[9+i][16]=1;
        }

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*10;
        label.x=mapTileScale*12;

        //マップ移動分かりやすいよう作成
        var label2 = new Label();
        label2.backgroundColor = "rgba(255,255,255,0.1)";
        label2.height=mapTileScale;
        label2.width=mapTileScale*2;
        label2.y=mapTileScale*15;
        label2.x=mapTileScale*12;

        //マップ移動分かりやすいよう作成
        var label3 = new Label();
        label3.backgroundColor = "rgba(255,255,255,0.1)";
        label3.height=mapTileScale*2;
        label3.width=mapTileScale;
        label3.y=mapTileScale*12;
        label3.x=mapTileScale*10;

        //マップ移動分かりやすいよう作成
        var label4 = new Label();
        label4.backgroundColor = "rgba(255,255,255,0.1)";
        label4.height=mapTileScale*2;
        label4.width=mapTileScale;
        label4.y=mapTileScale*12;
        label4.x=mapTileScale*15;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(label2);
        stage.addChild(label3);
        stage.addChild(label4);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==61){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            if(previousCharaLocate==0){
                player.x = 12 * 16 - 8;
            }else{
                player.x = 13 * 16 - 8;
            }
            player.y = 14 * 16;
            bgm=true;
        }else if(previousScene==63){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=2;
            if(previousCharaLocate==0){
                player.y = 11 * 16;
            }else{
                player.y = 12 * 16;
            }
            player.x = 10 * 16-8;
            bgm=true;
        }else if(previousScene==64){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 12 * 16 - 8;
            }else{
                player.x = 13 * 16 - 8;
            }
            player.y = 9 * 16;
            bgm=true;
        }else if(previousScene==65){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            if(previousCharaLocate==0){
                player.y = 11 * 16;
            }else{
                player.y = 12 * 16;
            }
            player.x = 15 * 16-8;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,3)){
                    runSound.play();
                    eventKind=3;
                    State=GameEvent;
                }else if(game.input.right && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,4)){
                    runSound.play();
                    eventKind=4;
                    State=GameEvent;
                }
            }

            if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=63;
                    previousScene=62;
                    if(playerToMapY(player.y)==12){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=61;
                    previousScene=62;
                    if(playerToMapX(player.x)==12){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==3){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=64;
                    previousScene=62;
                    if(playerToMapX(player.x)==12){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==4){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=65;
                    previousScene=62;
                    if(playerToMapY(player.y)==12){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }    


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_3 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();


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

        eventMap[14][10]=3;
        eventMap[15][10]=3;
        eventMap[19][11]=1;
        eventMap[19][12]=1;
        eventMap[10][11]=2;
        eventMap[10][12]=2;


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

        for(var i=0;i<10;i++){
            for(var j=0;j<4;j++){
                    array1[j+10][i+10]=323;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<12;i++){
            array3[9][9+i]=1;
            array3[14][9+i]=1;
        }

        for(var i=0;i<6;i++){
            array3[9+i][9]=1;
            array3[9+i][20]=1;
        }

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*10;
        label.x=mapTileScale*14;

        //マップ移動分かりやすいよう作成
        var label2 = new Label();
        label2.backgroundColor = "rgba(255,255,255,0.1)";
        label2.height=mapTileScale*2;
        label2.width=mapTileScale;
        label2.y=mapTileScale*11;
        label2.x=mapTileScale*10;

        //マップ移動分かりやすいよう作成
        var label3 = new Label();
        label3.backgroundColor = "rgba(255,255,255,0.1)";
        label3.height=mapTileScale*2;
        label3.width=mapTileScale;
        label3.y=mapTileScale*11;
        label3.x=mapTileScale*19;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(label2);
        stage.addChild(label3);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==62){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            if(previousCharaLocate==0){
                player.y = 10 * 16;
            }else{
                player.y = 11 * 16;
            }
            player.x = 19 * 16-8;
            bgm=true;
        }else if(previousScene==66){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=2;
            if(previousCharaLocate==0){
                player.y = 10 * 16;
            }else{
                player.y = 11 * 16;
            }
            player.x = 10 * 16-8;
            bgm=true;
        }else if(previousScene==67){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 14 * 16 - 8;
            }else{
                player.x = 15 * 16 - 8;
            }
            player.y = 9 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(game.input.right && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,3)){
                    runSound.play();
                    eventKind=3;
                    State=GameEvent;
                }
            }

            if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=66;
                    previousScene=63;
                    if(playerToMapY(player.y)==11){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=62;
                    previousScene=63;
                    if(playerToMapY(player.y)==11){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==3){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=67;
                    previousScene=63;
                    if(playerToMapX(player.x)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }   


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_4 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();


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

        eventMap[11][19]=1;
        eventMap[12][19]=1;
        if(itemList[5]==0)
            eventMap[11][11]=2;
        


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

        for(var i=0;i<4;i++){
            for(var j=0;j<10;j++){
                    array1[j+10][i+10]=323;
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

        if(itemList[5]==0)
            array2[11][11]=420;

        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<6;i++){
            array3[9][9+i]=1;
            array3[20][9+i]=1;
        }

        for(var i=0;i<12;i++){
            array3[9+i][9]=1;
            array3[9+i][14]=1;
        }

        array3[11][11]=1;

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*19;
        label.x=mapTileScale*11;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==62){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            if(previousCharaLocate==0){
                player.x = 11 * 16-8;
            }else{
                player.x = 12 * 16-8;
            }
            player.y = 18 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=62;
                    previousScene=64;
                    if(playerToMapX(player.x)==11){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            buttonSound.play();
                            message=makeMessage('アイテム「まじかるすてっき」を手に入れた');
                            scene.addChild(message);
                            State=GameEvent;
                            eventKind=2;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 2:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                eventMap[11][11]=0;
                                array3[11][11]=0;
                                array2[11][11]=-1;
                                itemList[5]=1;
                                map.loadData(array1,array2);
                                break;
                        }
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_5 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();


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

        eventMap[13][10]=3;
        eventMap[14][10]=3;
        eventMap[13][17]=1;
        eventMap[14][17]=1;
        eventMap[10][13]=2;
        eventMap[10][14]=2;


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

        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                    array1[j+10][i+10]=323;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<8;i++){
            array3[9][9+i]=1;
            array3[18][9+i]=1;
            array3[9+i][9]=1;
            array3[9+i][18]=1;
        }

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*10;
        label.x=mapTileScale*13;

        //マップ移動分かりやすいよう作成
        var label2 = new Label();
        label2.backgroundColor = "rgba(255,255,255,0.1)";
        label2.height=mapTileScale;
        label2.width=mapTileScale*2;
        label2.y=mapTileScale*17;
        label2.x=mapTileScale*13;

        //マップ移動分かりやすいよう作成
        var label3 = new Label();
        label3.backgroundColor = "rgba(255,255,255,0.1)";
        label3.height=mapTileScale*2;
        label3.width=mapTileScale;
        label3.y=mapTileScale*13;
        label3.x=mapTileScale*10;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(label2);
        stage.addChild(label3);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==68){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            if(previousCharaLocate==0){
                player.x = 13 * 16 - 8;
            }else{
                player.x = 14 * 16 - 8;
            }
            player.y = 16 * 16;
            bgm=true;
        }else if(previousScene==62){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=2;
            if(previousCharaLocate==0){
                player.y = 12 * 16;
            }else{
                player.y = 13 * 16;
            }
            player.x = 10 * 16-8;
            bgm=true;
        }else if(previousScene==69){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 13 * 16 - 8;
            }else{
                player.x = 14 * 16 - 8;
            }
            player.y = 9 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    runSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,3)){
                    runSound.play();
                    eventKind=3;
                    State=GameEvent;
                }
            }

            if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=62;
                    previousScene=65;
                    if(playerToMapY(player.y)==13){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=68;
                    previousScene=65;
                    if(playerToMapX(player.x)==13){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==3){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=69;
                    previousScene=65;
                    if(playerToMapX(player.x)==13){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }  


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_6 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();


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

        eventMap[15][12]=1;
        eventMap[15][13]=1;


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

        for(var i=0;i<6;i++){
            for(var j=0;j<6;j++){
                    array1[j+10][i+10]=323;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<8;i++){
            array3[9][9+i]=1;
            array3[16][9+i]=1;
            array3[9+i][9]=1;
            array3[9+i][16]=1;
        }

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale*2;
        label.width=mapTileScale;
        label.y=mapTileScale*12;
        label.x=mapTileScale*15;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==63){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            if(previousCharaLocate==0){
                player.y = 11 * 16;
            }else{
                player.y = 12 * 16;
            }
            player.x = 15 * 16-8;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.right && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=63;
                    previousScene=66;
                    if(playerToMapY(player.y)==12){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }  


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_7 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();


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

        eventMap[12][15]=1;
        eventMap[13][15]=1;

        if(itemList[6]==0)
            eventMap[12][11]=2;


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

        for(var i=0;i<6;i++){
            for(var j=0;j<6;j++){
                    array1[j+10][i+10]=323;
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

        if(itemList[6]==0)
            array2[11][12]=420;


        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<8;i++){
            array3[9][9+i]=1;
            array3[16][9+i]=1;
            array3[9+i][9]=1;
            array3[9+i][16]=1;
        }

        if(itemList[6]==0)
            array3[11][12]=1;

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*15;
        label.x=mapTileScale*12;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==63){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=3;
            if(previousCharaLocate==0){
                player.x = 12 * 16-8;
            }else{
                player.x = 13 * 16-8;
            }
            player.y = 14 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=63;
                    previousScene=67;
                    if(playerToMapX(player.x)==12){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }  


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            buttonSound.play();
                            message=makeMessage('アイテム「牛乳」を手に入れた');
                            scene.addChild(message);
                            State=GameEvent;
                            eventKind=2;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 2:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                eventMap[12][11]=0;
                                array3[11][12]=0;
                                array2[11][12]=-1;
                                itemList[6]=1;
                                map.loadData(array1,array2);
                                break;
                        }
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_8 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        var runSound = game.assets['run.mp3'].clone();


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

        eventMap[11][10]=1;
        eventMap[12][10]=1;


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

        for(var i=0;i<4;i++){
            for(var j=0;j<8;j++){
                    array1[j+10][i+10]=323;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<6;i++){
            array3[9][9+i]=1;
            array3[18][9+i]=1;
        }

        for(var i=0;i<10;i++){
            array3[9+i][9]=1;
            array3[9+i][14]=1;
        }

        map.collisionData=array3;


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*10;
        label.x=mapTileScale*11;


        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(label);
        stage.addChild(player);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==65){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            if(previousCharaLocate==0){
                player.x = 11 * 16-8;
            }else{
                player.x = 12 * 16-8;
            }
            player.y = 9 * 16;
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.up && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=65;
                    previousScene=68;
                    if(playerToMapX(player.x)==11){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }  


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        
                        break;
                }
            }
        });
        return scene;

    };

    game.makeScene6_9 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2 = new Map(mapTileScale, mapTileScale);
        var map3 = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        map2.image = game.assets['heya_girl2.png'];
        map3.image = game.assets['heya_girl2.png'];
        var runSound = game.assets['run.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var drinkSound = game.assets['drink1.mp3'].clone();
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);

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

        eventMap[14][19]=1;
        eventMap[15][19]=1;

        if(itemList[8]==0){
            eventMap[14][14]=2;
            eventMap[15][14]=2;
        }

        eventMap[14][13]=3;
        eventMap[15][13]=3;


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

        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                    array1[j+10][i+10]=323;
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



        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<12;i++){
            array3[9][9+i]=1;
            array3[20][9+i]=1;
            array3[9+i][9]=1;
            array3[9+i][20]=1;
        }

        if(itemList[8]==0){
            array3[14][14]=1;
            array3[14][15]=1;
        }
        array3[13][14]=1;
        array3[13][15]=1;

        map.collisionData=array3;

        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[10][14]=58*16+2;
        array4[10][15]=58*16+3;
        array4[11][14]=59*16+2;
        array4[11][15]=59*16+3;
        array4[12][14]=60*16+2;
        array4[12][15]=60*16+3;

        map2.loadData(array4);

        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array5[i][j]=-1;
            }
        }

        array5[13][14]=61*16+2;
        array5[13][15]=61*16+3;

        map3.loadData(array5);


        //マップ移動分かりやすいよう作成
        var label = new Label();
        label.backgroundColor = "rgba(255,255,255,0.1)";
        label.height=mapTileScale;
        label.width=mapTileScale*2;
        label.y=mapTileScale*19;
        label.x=mapTileScale*14;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 20 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        //くろくろ作成
        var player2 = new Sprite(32, 32);
        player2.x = 14 * 16;
        player2.y = 13 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player2.image = image;
        player2.scaleX=2;

        //くろくろ作成(いじらない)
        player2.isMoving = false;
        player2.direction = 0;
        player2.walk = 1;
        player2.addEventListener('enterframe', function() {
            if(bgm==true) wholeSound.play();

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
                
            }
        });

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
        stage.addChild(map3);
        stage.addChild(label);
        if(itemList[8]==0)
            stage.addChild(player2);
        stage.addChild(player);
        stage.addChild(map2);
        scene.addChild(stage);
        

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==65){
            player.direction=3;
            player.x = 14 * 16 - 8;
            player.y = 18 * 16;
            if(itemList[7]==0){
                itemList[7]=1;
                State=GameEvent;
                eventKind=2;
                player.tick=0;
                talkProgress=0;
                bgm=false;
            }else{
                State=Nomal;
                eventKind=0;
                talkProgress=0;
                bgm=true;
            }
        }else if(previousScene==71){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            player.y = 13 * 16;
            if(previousCharaLocate==0){
                player.x = 14 * 16 - 8;
            }else{
                player.x = 15 * 16 - 8;
            }
            bgm=true;
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.down && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    runSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    runSound.stop();
                    nextScene=65;
                    previousScene=69;
                    game.popScene();
                    if(playerToMapX(player.x)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }else if(eventKind==2){
                if(talkProgress==0){
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==1){
                    buttonSound.play();
                    message=makeMessage('ミラ「鏡あった！　けど....」');
                    scene.addChild(message);
                    talkProgress++;
                    talkProgress++;
                }
            }else if(eventKind==4){
                if(talkProgress==3){
                    player.tick++;
                    if(player.tick==45){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==4){
                    buttonSound.play();
                    message=makeMessage('ミラ「うえっ、まっずい.....」');
                    scene.addChild(message);
                    talkProgress++;
                }else if(talkProgress==8){
                    player.tick++;
                    if(player.tick==10){
                        player.tick=0;
                        talkProgress++;
                        message=screenDark(1);
                        scene.addChild(message);
                        stage.removeChild(player2);
                        array3[14][14]=0;
                        array3[14][15]=0;
                        eventMap[14][14]=0;
                        eventMap[15][14]=0;
                    }
                }else if(talkProgress==9){
                    player.tick++;
                    if(player.tick==8){
                        player.tick=0;
                        talkProgress++;
                        scene.removeChild(message);
                    }
                }else if(talkProgress==10){
                    player.tick++;
                    if(player.tick==10){
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==11){
                    buttonSound.play();
                    message=makeMessage('ミラ「がんばったのに、反応うすいよー！」');
                    scene.addChild(message);
                    talkProgress++;
                    itemList[8]=1;
                }
            }else if(eventKind==5 && talkProgress == 0){
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
            }else if(eventKind==5 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==5 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==5 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=7;
                    nextScene=71;
                    previousScene=69;
                    game.popScene();
                    if(playerToMapX(player.x)==14){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                }
            }


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){

                            if(itemList[6]==0){
                                buttonSound.play();
                                message=makeMessage('くろくろ「ケーラケラ！　まーた牛乳のこしてるー！　いーけないんだー！」');
                                scene.addChild(message);
                                eventKind=3;
                                talkProgress++;
                                State=GameEvent;
                            }else{
                                bgm=false;
                                buttonSound.play();
                                message=makeMessage('ミラ「よーし、これでどうだ！」');
                                scene.addChild(message);
                                eventKind=4;
                                State=GameEvent;
                            }
                        }else if(player.direction==3 && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=5;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 2:
                                switch(talkProgress){
                                    case 3:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「また、くろくろいるし」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        message=makeMessage('くろくろ「ケーラケラ！　まーた牛乳残してるー！　いーけないんだー！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「うげ、そうくるかー.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「これってわたしが牛乳飲まないと通してくれないってことだよね.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 7:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「あきらめてへやにもどってねちゃおうかな」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 8:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「はぁ.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 9:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「人のすききらいをわらうのはどうかと思うよ、まったく！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        message=makeMessage('くろくろ「アハハハハハ！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「もーう！　ちょっとまってなー！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 12:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        bgm=true;
                                        itemList[7]=1;
                                    default:
                                        break;
                                }
                                break;
                            case 3:
                                switch(talkProgress){
                                    case 1:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「人のすききらいをわらうのはどうかと思うなー！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「うう、いやだけど探してくるかー.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 4:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「もってきた、けど.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「えーい！　ちゃんと飲むから見とけよー！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        drinkSound.play();
                                        talkProgress++;
                                        break;
                                    case 5:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「でもちゃんと飲んだよ！　これでまんぞくかー！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        message=makeMessage('くろくろ「ケケケー！　さきにいくぜー！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 7:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 12:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「もう.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 13:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「なんで、くろくろは学校のみんなみたいなこと言うんだろ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 14:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「まあいいやー。急ご」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 15:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        bgm=true;
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 5:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
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

    game.makeScene7 = function(wholeSound){
        var scene = new Scene();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==69　|| nextScene==71){
                game.pushScene(game.makeScene7_1(wholeSound));
            }else if(nextScene==72){
                game.pushScene(game.makeScene7_2(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    }

    game.makeScene7_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map3 = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['heya_girl.png'];
        map3.image = game.assets['heya_girl.png'];
        var doorSound = game.assets['door.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var doorOpenSound = game.assets['door-open1.mp3'].clone();
        var door2Sound = game.assets['door2.mp3'].clone();
        var runSound = game.assets['run.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();


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

        eventMap[6][10]=0;
        eventMap[6][11]=0;
        eventMap[13][10]=1;
        eventMap[13][11]=1;
        eventMap[13][16]=2;
        eventMap[13][17]=2;
        eventMap[9][6]=3;
        eventMap[10][6]=3;
        eventMap[7][13]=4;
        eventMap[8][13]=4;
        eventMap[9][20]=6;
        eventMap[10][20]=6;
        if(itemList[14]==1){
            eventMap[6][10]=7;
            eventMap[6][11]=7;
            eventMap[9][6]=8;
            eventMap[10][6]=8;
            eventMap[13][10]=9;
            eventMap[13][11]=9;
        }



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

        for(var i=7;i<13;i++){
            //床
            for(var j=7;j<20;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
            //壁
            for(var j=2;j<7;j++){
                array1[j][i]=5*16+2;
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
        //マット
        array2[10][7]=62*16+15;
        array2[11][7]=63*16+15;

        array2[10][12]=62*16+10;
        array2[11][12]=63*16+10;

        array2[16][12]=62*16+10;
        array2[17][12]=63*16+10;

        //鏡
        array2[3][9]=58*16+2;
        array2[3][10]=58*16+3;
        array2[4][9]=59*16+2;
        array2[4][10]=59*16+3;
        array2[5][9]=60*16+2;
        array2[5][10]=60*16+3;
        array2[6][9]=61*16+2;
        array2[6][10]=61*16+3;

        //玄関
        array2[18][7]=16*64+8;
        array2[19][7]=16*65+8;
        array2[18][8]=16*64+9;
        array2[19][8]=16*65+9;
        array2[18][9]=16*64+10;
        array2[19][9]=16*65+10;
        array2[18][10]=16*64+11;
        array2[19][10]=16*65+11;
        array2[18][11]=16*64+12;
        array2[19][11]=16*65+12;
        array2[18][12]=16*64+13;
        array2[19][12]=16*65+13;
        

        //マップデータの作成
        map.loadData(array1,array2);

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

        for(var i=0;i<6;i++){
            array3[6][7+i]=1;
            array3[20][7+i]=1;
        }

        for(var i=0;i<15;i++){
            array3[6+i][6]=1;
            array3[6+i][13]=1;
        }

        //階段衝突

        array3[16][9]=1;
        array3[15][9]=1;
        array3[14][9]=1;
        array3[13][9]=1;

        array3[13][7]=1;
        array3[13][8]=1;
        array3[13][9]=1;

        map.collisionData=array3;

        //階段用マップ
        var map2 = new Map(mapTileScale, mapTileScale);
        map2.image = game.assets['ie0.png'];

        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[16][7]=16*99+2;
        array4[16][8]=16*99+3;
        array4[16][9]=16*99+4;
        array4[15][7]=16*98+2;
        array4[15][8]=16*98+3;
        array4[15][9]=16*98+4;
        array4[14][7]=16*97+2;
        array4[14][8]=16*97+3;
        array4[14][9]=16*97+4;
        array4[13][7]=16*96+2;
        array4[13][8]=16*96+3;
        array4[13][9]=16*96+4;

        map2.loadData(array4);
        //map2.y+=6;

        /*var map3 = new Map(mapTileScale, mapTileScale);
        map3.image = game.assets['ie0.png'];

        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array5[i][j]=-1;
            }
        }

        array5[12][9]=86*16+4;
        array5[13][9]=87*16+4;
        array5[16][7]=90*16+2;
        array5[16][8]=90*16+3;
        array5[16][9]=90*16+4;

        map3.loadData(array5);
        map3.y+=6;*/

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 9 * 16 - 8;
        player.y = 6 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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

        //階段とぎれ
        var label = new Label();
        label.backgroundColor = "rgba(0,0,0,1)";
        label.height=mapTileScale/2;
        label.width=mapTileScale*3;
        label.y=mapTileScale*12+8;
        label.x=mapTileScale*7;

        //玄関
        var label2 = new Label();
        label2.backgroundColor = "rgba(255,255,255,0.1)";
        label2.height=mapTileScale;
        label2.width=mapTileScale*2;
        label2.y=mapTileScale*19;
        label2.x=mapTileScale*9;

        //マップ、キャラをグループ化して描画
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(map2);
        stage.addChild(label2);
        stage.addChild(player);
        stage.addChild(map3);
        stage.addChild(label);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==69){
            if(itemList[9]==0){
                State=GameEvent;
                eventKind=4;
                talkProgress=0;
                bgm=false;
                itemList[9]=1;
            }else{
                State=Nomal;
                eventKind=0;
                talkProgress=0;
                bgm=true;
            }
            player.y = 6 * 16;
            if(previousCharaLocate==0){
                player.x = 9 * 16 - 8;
            }else{
                player.x = 10 * 16 - 8;
                
            }
        }else if(previousScene==72){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            player.x = 12 * 16 - 8;
            player.y = 15 * 16;
        }else if(previousScene==91){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            bgm=true;
            player.direction=2;
            player.x = 7 * 16 - 8;
            if(previousCharaLocate==0){
                player.y = 9 * 16;
            }else{
                player.y = 10 * 16;
                
            }
        }else if(previousScene==31){
            State=Nomal;
                eventKind=0;
                talkProgress=0;
                bgm=true;
            player.y = 15 * 16;
            if(previousCharaLocate==0){
                player.x = 7 * 16 - 8;
            }else{
                player.x = 8 * 16 - 8;
                
            }
        }else if(previousScene==51){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            bgm=true;
            player.direction=1;
            player.x = 12 * 16 - 8;
            if(previousCharaLocate==0){
                player.y = 9 * 16;
            }else{
                player.y = 10 * 16;
                
            }
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,0)){
                    doorSound.play();
                    eventKind=1;
                    State=GameEvent;
                }else if(game.input.right && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                    doorOpenSound.play();
                    eventKind=2;
                    State=GameEvent;
                }else if(game.input.right && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,1)){
                    doorSound.play();
                    eventKind=3;
                    State=GameEvent;
                }else if(game.input.up && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                    eventKind=6;
                    State=GameEvent;
                    if(itemList[14]==1){
                        runSound.play();
                        eventKind=7;
                        State=GameEvent;
                    }
                }else if(game.input.down && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,6)){
                    door2Sound.play();
                    eventKind=5;
                    State=GameEvent;
                }else if(game.input.left && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,7)){
                    doorOpenSound.play();
                    eventKind=8;
                    State=GameEvent;
                }else if(game.input.right && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,9)){
                    doorOpenSound.play();
                    eventKind=11;
                    State=GameEvent;
                }
            }

            if(eventKind==10 && talkProgress == 0){
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
            }else if(eventKind==10 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==10 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==10 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=6;
                    nextScene=69;
                    previousScene=71;
                    if(playerToMapX(player.x)==9)
                        previousCharaLocate=0;
                    else
                        previousCharaLocate=1;
                    game.popScene();
                }
            }

            switch(eventKind){
                case 3:
                case 1:
                    if(talkProgress==0){
                        player.tick++;
                        if(player.tick==15){
                            doorSound.stop();
                            player.tick=0;
                            buttonSound.play();
                            message=makeMessage("開かないみたいだ...");
                            scene.addChild(message);
                            talkProgress++;
                        }
                    }
                    break;
                case 2:
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        previousScene=71;
                        nextScene=72;
                        talkProgress=0;
                        eventKind=0;
                        game.popScene();
                    }
                    break;
                case 4:
                    switch(talkProgress){
                        case 0:
                            player.tick++;
                            if(player.tick==8){
                                buttonSound.play();
                                message=makeMessage('あ、一階に出れた！');
                                scene.addChild(message);
                                talkProgress++;
                                player.tick=0;
                            }
                            break;
                        case 3:
                            if(playerToMapX(player.x)<10){
                                player.direction = 2;
                                player.vx = 4;
                                player.isMoving=true;
                            }else if(playerToMapY(player.y)<19){
                                player.vx = 0;
                                player.direction = 0;
                                player.vy = 4;
                                player.isMoving=true;
                            }else{
                                door2Sound.play();
                                talkProgress++;
                            }
                            break;
                        case 4:
                            player.tick++;
                            if(player.tick==20){
                                door2Sound.stop();
                                buttonSound.play();
                                message=makeMessage('あかないかあ.....');
                                scene.addChild(message);
                                player.tick=0;
                                talkProgress++;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case 6:
                    if(talkProgress==0){
                        buttonSound.play();
                        message=makeMessage("ミラ「階段のかべがなくなってる！」");
                        scene.addChild(message);
                        talkProgress++;
                    }
                    break;
                case 5:
                    if(talkProgress==0){
                        player.tick++;
                        if(player.tick==15){
                            doorSound.stop();
                            player.tick=0;
                            buttonSound.play();
                            message=makeMessage("ミラ「やっぱり開かないかー」");
                            scene.addChild(message);
                            talkProgress++;
                        }
                    }
                    break;
                case 7:
                    player.tick++;
                    if(player.tick==15){
                        runSound.stop();
                        nowScene=3
                        nextScene=31;
                        previousScene=71;
                        if(playerToMapX(player.x)==7){
                            previousCharaLocate=0;
                        }else{
                            previousCharaLocate=1;
                        }
                        game.popScene();
                    }
                case 8:
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        nowScene=9;
                        previousScene=71;
                        nextScene=91;
                        talkProgress=0;
                        eventKind=0;
                        if(playerToMapY(player.y)==10){
                            previousCharaLocate=0;
                        }else{
                            previousCharaLocate=1;
                        }
                        game.popScene();
                    }
                    break;
                case 11:
                    player.tick++;
                    if(player.tick==15){
                        player.tick=0;
                        nowScene=5;
                        previousScene=71;
                        nextScene=51;
                        talkProgress=0;
                        eventKind=0;
                        if(playerToMapY(player.y)==10){
                            previousCharaLocate=0;
                        }else{
                            previousCharaLocate=1;
                        }
                        game.popScene();
                    }
                    break;
                default:
                    break;
            }


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,8)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=10;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('ミラ「こっちではないみたい」');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 5:
                            case 3:
                            case 1:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('他の部屋を探そう！');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        State=Nomal;
                                        eventKind=0;
                                        talkProgress=0;
                                        break;
                                }
                            case 2:
                                break;
                            case 4:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage("ミラ「早く学校に行かなくちゃ！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        
                                        break;
                                    case 4:
                                        break;
                                    case 5:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「こうなったら、他の出口を探すしかないか！」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        scene.removeChild(message);
                                        message=makeMessage("ミラ「鏡を探そう!」");
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 7:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        bgm=true;
                                        break;
                                    default:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        wholeSound.play();
                                        bgm=true;
                                        wholeSound.volume=0.5;
                                        break;
                                }
                                break;
                            case 6:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「けど、こっちはさっき行ったから他を探そう！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        player.vy=4;
                                        player.isMoving=true;
                                        player.direction=0;
                                        State=Nomal;
                                        eventKind=0;
                                        talkProgress=0;
                                        break;
                                }
                            case 7:
                                break;
                            case 10:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
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

    game.makeScene7_2 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2 = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['heya_girl.png'];
        map2.image = game.assets['Bath2.png'];
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var doorOpenSound = game.assets['door-open1.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();


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

        eventMap[5][9]=1;
        eventMap[5][10]=1;
        eventMap[5][8]=2;
        eventMap[6][8]=2;
        eventMap[8][8]=3;
        eventMap[9][8]=3;
        eventMap[10][7]=4;
        eventMap[11][7]=5;
        eventMap[13][7]=6;
        eventMap[14][7]=6;
        eventMap[7][8]=7;

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

        for(var i=7;i<17;i++){
            //床
            for(var j=7;j<11;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
            //壁
            for(var j=2;j<7;j++){
                array1[j][i]=5*16+2;
                if(j==6){
                    array1[j][i]=13*16+2;
                }
            }
        }

        for(var i=5;i<7;i++){
            //床
            for(var j=9;j<11;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
            //壁
            for(var j=4;j<9;j++){
                array1[j][i]=5*16+2;
                if(j==8){
                    array1[j][i]=13*16+2;
                }
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

        array2[9][5]=16*62+15;
        array2[10][5]=16*63+15;
        

        //マップデータの作成
        map.loadData(array1,array2);

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
            array3[6][7+i]=1;
            array3[11][7+i]=1;
        }

        for(var i=0;i<8;i++){
            array3[6+i][6]=1;
            array3[6+i][17]=1;
        }

        array3[9][6]=0;
        array3[10][6]=0;
        array3[9][4]=1;
        array3[10][4]=1;
        array3[8][5]=1;
        array3[11][5]=1;
        array3[8][6]=1;
        array3[11][6]=1;

        //トイレットペーパー
        array3[8][7]=1;

        //トイレ
        array3[8][8]=1;
        array3[8][9]=1;

        //ゴミ箱
        array3[7][10]=1;
        array3[7][11]=1;

        //洗面台
        array3[7][13]=1;
        array3[7][14]=1;

        map.collisionData=array3;
        
        //トイレっぽくする
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                    array4[j][i]=-1;
            }
        }

        for(var i=0;i<2;i++){
            for(var j=0;j<4;j++){
                array4[5+j][8+i]=32*(16+j)+28+i;
            }
        }

        //掃除用具
        array4[6][10]=32*17+26;
        array4[7][10]=32*18+26;
        array4[6][11]=32*17+27;
        array4[7][11]=32*18+27;

        //トイレットペーパー
        array4[7][7]=32*16+24;

        //トイレットペーパー台
        array4[3][10]=32*16+18;
        array4[3][11]=32*16+19;
        array4[4][10]=32*17+18;
        array4[4][11]=32*17+19;

        //タオル
        array4[7][5]=32*14+26;
        array4[7][6]=32*14+27;
        array4[8][5]=32*15+26;
        array4[8][6]=32*15+27;

        //手洗い
        for(var i=0;i<2;i++){
            for(var j=0;j<5;j++){
                array4[3+j][13+i]=32*j+22+i;
            }
        }
        

        map2.loadData(array4);

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 9 * 16 - 8;
        player.y = 6 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

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
        stage.addChild(map2);
        stage.addChild(player);
        scene.addChild(stage);

        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);

        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==71){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            bgm=true;
            player.direction=2;
            player.x = 5 * 16-8;
            if(previousCharaLocate==0){
                player.y = 8 * 16;
            }else{
                player.y = 9 * 16;
                
            }
        }else if(previousScene==81){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=0;
            player.y = 7 * 16;
            bgm=true;
            if(previousCharaLocate==0){
                player.x = 13 * 16 - 8;
            }else{
                player.x = 14 * 16 - 8;
                
            }
        }

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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.left && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,1)){
                    doorOpenSound.play();
                    eventKind=1;
                    State=GameEvent;
                }
            }

            if(eventKind==1){
                player.tick++;
                if(player.tick==15){
                    nextScene=71;
                    previousScene=72;
                    if(playerToMapY(player.y)==9){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                }
            }else if(eventKind==6 && talkProgress == 0){
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
            }else if(eventKind==6 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==6 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==6 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=8;
                    nextScene=8;
                    previousScene=72;
                    previousCharaLocate=playerToMapX(player.x)==13 ? 0:1;
                    game.popScene();
                }
            }


        });

        scene.addEventListener(Event.TOUCH_START , function(e) {

            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            State=GameEvent;
                            eventKind=2;
                            buttonSound.play();
                            message=makeMessage('ミラ「うへー、ぬれぬれタオルだよー....」');
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            State=GameEvent;
                            eventKind=3;
                            buttonSound.play();
                            message=makeMessage('ミラ「毎日みがいてるからピッカピカ」');
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                            State=GameEvent;
                            eventKind=4;
                            buttonSound.play();
                            message=makeMessage('ミラ「ゴミ箱ー　中身は空っぽだ」');
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,5)){
                            State=GameEvent;
                            eventKind=5;
                            buttonSound.play();
                            message=makeMessage('ミラ「帰ったらもう一回掃除しよう！」');
                            scene.addChild(message);
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,7)){
                            State=GameEvent;
                            eventKind=7;
                            buttonSound.play();
                            message=makeMessage('ミラ「トイレットペーパーまだまだありそう」');
                            scene.addChild(message);
                        }else if(player.direction==3 && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,6)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=6;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 7:
                            case 5:
                            case 4:
                            case 3:
                            case 2:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                break;
                            case 6:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
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

    game.makeScene8 = function(wholeSound){
        var scene = new Scene();
        var wholeSound = game.assets['makkura.mp3'].clone();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==72　|| nextScene==81){
                game.pushScene(game.makeScene8_1(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    };

    game.makeScene8_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2 = new Map(mapTileScale, mapTileScale);
        var map3 = new Map(mapTileScale, mapTileScale);
        var map4 = new Map(mapTileScale, mapTileScale);
        var map5 = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];
        map2.image = game.assets['map1.gif'];
        map3.image = game.assets['greenmirror.png'];
        map4.image = game.assets['heya_girl3.png'];
        map5.image = game.assets['heya_girl3.png'];
        var knifeSound = game.assets['knife.mp3'].clone();
        var hyunSound = game.assets['hyun.mp3'].clone();
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
    
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

        eventMap[12][29]=1;
        eventMap[13][29]=1;
        if(itemList[11]==0){
            eventMap[1][29]=2;
        }
        eventMap[12][23]=3;
        eventMap[13][23]=3;
        if(itemList[10]==0){
            eventMap[12][9]=5;
            eventMap[13][9]=5;
        }
        eventMap[12][8]=6;
        eventMap[13][8]=6;
    
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
    
        for(var i=0;i<30;i++){
            for(var j=0;j<30;j++){
                array1[i][j]=322;
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
        
        for(var i=0;i<3;i++){
            for(var j=0;j<3;j++){
                array2[27+i][j+4]=20*(i+4)+j;
                array2[24+i][j+4]=20*(i+4)+j;
                array2[27+i][j+19]=20*(i+4)+j;
                array2[24+i][j+19]=20*(i+4)+j;
                array2[21+i][j+4]=20*(i+9)+j;
                array2[21+i][j+19]=20*(i+4)+j;
                array2[18+i][j+19]=20*(i+9)+j+4;
                array2[18+i][j+4]=20*(i+4)+j;
                array2[13+i][j+1]=20*(i+4)+j;
                array2[13+i][j+4]=20*(i+4)+j;
                array2[15+i][j+19]=20*(i+4)+j;
                array2[12+i][j+19]=20*(i+4)+j;
                array2[9+i][j+19]=20*(i+4)+j;
                array2[6+i][j+19]=20*(i+4)+j;
                array2[3+i][j+19]=20*(i+4)+j;
                array2[0+i][j+19]=20*(i+4)+j;
                array2[10+i][j+4]=20*(i+4)+j;
                array2[7+i][j+4]=20*(i+4)+j;
                array2[4+i][j+4]=20*(i+4)+j;
                array2[1+i][j+4]=20*(i+4)+j;
                
            }
        }

        for(var i=0;i<3;i++){
            array2[13+i][1]=100;
            array2[13+i][6]=102;
        }

        for(var i=0;i<3;i++){
            for(var j=0;j<4;j++){
                array2[13+i][2+j]=101;
            }
        }

        for(var i=0;i<30;i++){
            array2[0+i][0]=83;
            array2[0+i][27]=83;
            array2[0][0+i]=83;
        }

        array2[22][12]=461;
        array2[22][13]=462;
        array2[23][12]=481;
        array2[23][13]=482;

        //ランドセル
        if(itemList[11]==0)
            array2[29][1]=420;
    
        //マップデータの作成
        map.loadData(array1,array2);
    
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

        for(var i=0;i<mapArraySize;i++){
            array3[i][0]=1;
            array3[i][29]=1;
            array3[0][i]=1;
        }
        
        for(var i=0;i<15;i++){
            array3[i][6]=1;
        }

        for(var i=0;i<6;i++){
            array3[15][i+1]=1;
        }

        for(var i=0;i<12;i++){
            array3[18+i][4]=1;
            array3[18+i][6]=1;
        }

        array3[18][5]=1;

        for(var i=0;i<30;i++){
            array3[i][19]=1;
        }

        array3[23][12]=1;
        array3[23][13]=1;

        array3[29][12]=1;
        array3[29][13]=1;

        array3[8][12]=1;
        array3[8][13]=1;

        if(itemList[10]==0){
            array3[9][12]=1;
            array3[9][13]=1;
        }

        if(itemList[11]==0){
            array3[29][1]=1;
        }
    
        map.collisionData=array3;

        //マップの背景の上書き作成(アイテムなどの)
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        array4[22][12]=461;
        array4[22][13]=462;
        
        //マップデータの作成
        map2.loadData(array4);

        //マップの背景の上書き作成(アイテムなどの)
        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array5[i][j]=-1;
            }
        }

        array5[29][12]=2;
        array5[29][13]=3;
        
        //マップデータの作成
        map3.loadData(array5);

        //マップの背景の上書き作成(アイテムなどの)
        var array6 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array6[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array6[i][j]=-1;
            }
        }

        array6[5][12]=16*58+2;
        array6[5][13]=16*58+3;
        array6[6][12]=16*59+2;
        array6[6][13]=16*59+3;
        array6[7][12]=16*60+2;
        array6[7][13]=16*60+3;
        
        //マップデータの作成
        map4.loadData(array6);

        //マップの背景の上書き作成(アイテムなどの)
        var array7 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array7[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array7[i][j]=-1;
            }
        }

        array7[8][12]=16*61+2;
        array7[8][13]=16*61+3;
        
        //マップデータの作成
        map5.loadData(array7);
    
        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 9 * 16 - 8;
        player.y = 6 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;
    
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

        //くろくろ作成
        var player2 = new Sprite(32, 32);
        player2.x = 12 * 16;
        player2.y = 8 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player2.image = image;
        player2.scaleX=2;

        //くろくろ作成(いじらない)
        player2.isMoving = false;
        player2.direction = 0;
        player2.walk = 1;
        player2.addEventListener('enterframe', function() {
            if(bgm==true) wholeSound.play();

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
                
            }
        });

        //全体暗く作成
        var label = new Label();
        label.backgroundColor = "rgba(0,0,0,0.5)";
        label.height=mapScale;
        label.width=mapScale;
        label.y=0;
        label.x=0;
    
        //マップ、キャラをグループ化して描画
        var stage = new Group();
        stage.addChild(map);
        stage.addChild(map5);
        if(itemList[10]==0)
            stage.addChild(player2);
        stage.addChild(player);
        stage.addChild(map2);
        stage.addChild(map3);
        stage.addChild(map4);
        scene.addChild(stage);
        scene.addChild(label);
    
        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);
    
        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);
    
        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==72){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            bgm=true;
            player.direction=3;
            player.y = 27 * 16;
            if(previousCharaLocate==0){
                player.x = 12 * 16 - 8;
            }else{
                player.x = 13 * 16 - 8;
                
            }
        }else if(previousScene==91){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            bgm=true;
            player.direction=0;
            player.y = 8 * 16;
            if(previousCharaLocate==0){
                player.x = 12 * 16 - 8;
            }else{
                player.x = 13 * 16 - 8;
            }
        }
    
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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(eventKind==1 && talkProgress == 0){
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
            }else if(eventKind==1 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==1 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==1 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=7;
                    nextScene=72;
                    previousScene=81;
                    if(playerToMapX(player.x)==12)
                        previousCharaLocate=0;
                    else
                        previousCharaLocate=1;
                    game.popScene();
                }
            }else if(eventKind==4){
                if(talkProgress==2){
                    knifeSound.play();
                    talkProgress++;
                }else if(talkProgress==3){
                    player.tick++;
                    if(player.tick==15){
                        buttonSound.play();
                        message=makeMessage('アイテム「野球のボール」を手に入れた');
                        scene.addChild(message);
                        talkProgress++;
                        player.tick=0;
                    }
                }
            }else if(eventKind==7){
                if(talkProgress==1){
                    if(playerToMapY(player.y)<15){
                        player.isMoving=true;
                        player.vy=4;
                    }else{
                        player.vy=0;
                        player.isMoving=false;
                        player.direction=3;
                        talkProgress++;
                    }
                }else if(talkProgress==2){
                    player.tick++;
                    if(player.tick==8){
                        buttonSound.play();
                        message=makeMessage('ミラ「くらえっ！　スーパーミラクルボール！」');
                        scene.addChild(message);
                        talkProgress++;
                        player.tick=0;
                    }
                }else if(talkProgress==4){
                    player.tick++;
                    if(player.tick%8<4){
                        player2.y--;
                    }else{
                        player2.y++;
                    }
                    if(player.tick==15){
                        hyunSound.stop();
                        buttonSound.play();
                        message=makeMessage('ミラ「よし！」');
                        scene.addChild(message);
                        talkProgress++;
                        player.tick=0;
                    }
                }else if(talkProgress==7){
                    player.tick++;
                    if(player.tick==8){
                        player.tick=0;
                        scene.removeChild(label);
                        label.backgroundColor = "rgba(0,0,0,1)";
                        scene.addChild(label);
                        eventMap[12][9]=0;
                        eventMap[13][9]=0;
                        array3[9][12]=0;
                        array3[9][13]=0;
                        stage.removeChild(player2);
                        talkProgress++;
                    }
                }else if(talkProgress==8){
                    player.tick++;
                    if(player.tick==12){
                        player.tick=0;
                        scene.removeChild(label);
                        label.backgroundColor = "rgba(0,0,0,0.5)";
                        scene.addChild(label);
                        talkProgress++;
                    }
                }else if(talkProgress==9){
                    player.tick++;
                    if(player.tick==8){
                        scene.removeChild(message);
                        buttonSound.play();
                        message=makeMessage('ミラ「ふー、ちゃんとまっすぐいってよかったー」');
                        scene.addChild(message);
                        talkProgress++;
                    }
                }
            }else  if(eventKind==6 && talkProgress == 0){
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
            }else if(eventKind==6 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==6 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==6 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=9;
                    nextScene=91;
                    previousScene=81;
                    if(playerToMapX(player.x)==12)
                        previousCharaLocate=0;
                    else
                        previousCharaLocate=1;
                    game.popScene();
                }
            }
    
    
        });
    
        scene.addEventListener(Event.TOUCH_START , function(e) {
    
            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(player.direction==0 && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,1)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=1;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            buttonSound.play();
                            message=makeMessage('アイテム「ランドセル」を手に入れた');
                            scene.addChild(message);
                            eventKind=2;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('ミラ「わー、大きな木だー！」');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                            buttonSound.play();
                            message=makeMessage('ミラ「ん？　なにかひっかかってる」');
                            scene.addChild(message);
                            eventKind=4;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,5)){
                            bgm=false;
                            buttonSound.play();
                            message=makeMessage('ミラ「やっぱりいるんだね、くろくろ」');
                            scene.addChild(message);
                            eventKind=5;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,7)){
                            if(itemList[12]==1){
                                bgm=false;
                                buttonSound.play();
                                message=makeMessage('ミラ「持ってきたよ。それじゃあ....」');
                                scene.addChild(message);
                                eventKind=7;
                                State=GameEvent;
                            }else{
                                buttonSound.play();
                                message=makeMessage('くろくろ「ケケケー！　はやく、はやくー！」');
                                scene.addChild(message);
                                eventKind=8;
                                State=GameEvent;
                            }
                        }else if(player.direction==3 && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,6)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=6;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        break;
                                }
                                break;
                            case 2:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                array2[29][1]=-1;
                                array3[29][1]=0;
                                itemList[11]=1;
                                eventMap[1][29]=0;
                                map.loadData(array1,array2);
                                break;
                            case 3:
                                scene.removeChild(message);
                                State=Nomal;
                                eventKind=0;
                                if(itemList[12]==0){
                                    eventMap[12][23]=4;
                                    eventMap[13][23]=4;
                                }
                                break;
                            case 4:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「おちてくるー！！」');
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
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        itemList[12]=1;
                                        eventMap[12][23]=3;
                                        eventMap[13][23]=3;
                                        State=Nomal;
                                }
                                break;
                            case 5:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「いいよ。ここまできたらなんだってやってやるー！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('くろくろ「ノーコンピッチャー！　ちゃんとまっすぐ投げてこーい！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「むむ....こんどは野球かー」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「体育は好きだけど、ボール使うの苦手なんだよー」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('くろくろ「ケケケー！　はやく、はやくー！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 5:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「よし、ボールを探してこよう」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        eventMap[12][9]=7;
                                        eventMap[13][9]=7;
                                        bgm=true;
                                        break;
                                    
                                }
                                break;
                            case 6:
                            switch(talkProgress){
                                case 0:
                                    scene.removeChild(message);
                                    scene.removeChild(select);
                                    scene.removeChild(selectMessage1);
                                    scene.removeChild(selectMessage2);
                                    if(selectState==1){
                                        bgm=false;
                                        wholeSound.stop();
                                        talkProgress++;
                                    }else{
                                        talkProgress=0;
                                        State=Nomal;
                                        eventKind=0;
                                    }
                                    break;
                                case 1:
                                    break;
                                case 2:
                                    break;
                                case 3:
                                    break;
                            }
                            break;
                            case 7:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        player.direction=0;
                                        break;
                                    case 1:
                                    case 2:
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        hyunSound.play();
                                        talkProgress++;
                                        break;
                                    case 4:
                                        break;
                                    case 5:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('くろくろ「ひえー！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 7:
                                    case 8:
                                        break;
                                    case 9:
                                        
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「よし、先に進もう」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        itemList[10]=1;
                                        bgm=true;
                                        State=Nomal;
                                }
                                break;
                            case 8:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「よし、ボールを探してこよう！」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        eventKind=0;
                                        talkProgress=0;
                                        State=Nomal;
                                        break;
                                }
                                break;
                        }
                }
            }
        });
        return scene;
    
    };

    game.makeScene9 = function(wholeSound){
        var scene = new Scene();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==81　|| nextScene==91){
                game.pushScene(game.makeScene9_1(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    };

    game.makeScene9_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        var map2 = new Map(mapTileScale, mapTileScale);
        var map3 = new Map(mapTileScale, mapTileScale);
        var map4 = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['ie0.png'];
        map2.image = game.assets['ie0.png'];
        map3.image = game.assets['ie0.png'];
        map4.image = game.assets['chara.gif'];
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var doorOpenSound = game.assets['door-open1.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
    
    
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

        eventMap[7][6]=1;
        eventMap[8][6]=1;
        eventMap[21][10]=2;
        eventMap[21][11]=2;
        eventMap[16][6]=3;
        eventMap[17][6]=3;
        eventMap[18][6]=3;
        eventMap[19][6]=3;
        eventMap[11][8]=4;
        eventMap[12][8]=4;
        eventMap[13][8]=4;
        eventMap[14][8]=4;
        eventMap[10][7]=5;
    
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
    
        for(var i=7;i<22;i++){
            //床
            for(var j=7;j<17;j++){
                if(i%2==1)
                    array1[j][i]=0;
                else
                    array1[j][i]=17;
            }
            //壁
            for(var j=2;j<7;j++){
                array1[j][i]=5*16+2;
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
        
        //窓
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                array2[i+3][j+16]=16*(16+i)+j;
            }
        }

        //鏡
        for(var i=0;i<4;i++){
            for(var j=0;j<2;j++){
                array2[i+3][j+7]=16*(38+i)+j+10;
            }
        }

        //テレビ台
        for(var i=0;i<3;i++){
            for(var j=0;j<6;j++){
                array2[i+6][j+9]=16*(55+i)+j+2;
            }
        }


        //机
        for(var i=0;i<2;i++){
            for(var j=0;j<4;j++){
                array2[i+10][j+10]=16*(26+i)+j+5;
            }
        }

        //ソファ
        for(var i=0;i<3;i++){
            for(var j=0;j<6;j++){
                array2[i+12][j+9]=16*(28+i)+j+4;
            }
        }

        //マット
        array2[10][21]=16*86+10;
        array2[11][21]=16*87+10;
    
        //マップデータの作成
        map.loadData(array1,array2);
    
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
    
        for(var i=0;i<12;i++){
            array3[i+6][6]=1;
            array3[i+6][22]=1;
        }

        for(var i=0;i<17;i++){
            array3[6][6+i]=1;
            array3[17][6+i]=1;
        }

        for(var i=0;i<6;i++){
            array3[7][9+i]=1;
        }

        for(var i=0;i<4;i++){
            array3[10][10+i]=1;
            array3[11][10+i]=1;
        }

        for(var i=0;i<6;i++){
            array3[13][9+i]=1;
            array3[14][9+i]=1;
        }
        
        for(var i=0;i<4;i++){
            array3[8][11+i]=1;
        }
    
        map.collisionData=array3;

        //マップの背景作成
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                    array4[j][i]=-1;
            }
        }

        //テレビ
        for(var i=0;i<3;i++){
            for(var j=0;j<4;j++){
                array4[i+4][j+10]=16*(33+i)+j+5;
            }
        }

        map2.loadData(array4);

        //マップの背景作成
        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                    array5[j][i]=-1;
            }
        }

        //ソファ
        for(var i=0;i<6;i++){
            array5[12][i+9]=16*(28)+i+4;
        }

        map3.loadData(array5);

        //お父さんお母さん
        var array6 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array6[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                    array6[j][i]=-1;
            }
        }

        array6[7][13]=18*2+8;
        array6[8][13]=18*3+8;
        array6[7][14]=18*2+9;
        array6[8][14]=18*3+9;

        array6[7][11]=18*4+2;
        array6[8][11]=18*5+2;
        array6[7][12]=18*4+3;
        array6[8][12]=18*5+3;

        map4.loadData(array6);
    
        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 9 * 16 - 8;
        player.y = 6 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;
    
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
        stage.addChild(map2);
        stage.addChild(map4);
        stage.addChild(player);
        stage.addChild(map3);
        scene.addChild(stage);
    
        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);
    
        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);
    
        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==81){
            State=GameEvent;
            if(itemList[14]==0){
                eventKind=6;
                talkProgress=0;
                itemList[14]=1;
                bgm=false;
            }else{
                eventKind=0;
                talkProgress=0;
                State=Nomal;
                bgm=true;
            }

            player.y = 6 * 16;
            if(previousCharaLocate==0){
                player.x = 7 * 16 - 8;
            }else{
                player.x = 8 * 16 - 8;
                
            }
        }else if(previousScene==71){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            player.direction=1;
            player.x = 21 * 16 - 8;
            if(previousCharaLocate==0)
                player.y = 9 * 16;
            else
                player.y = 10 * 16;
        }
    
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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(State==Nomal){
                if(game.input.right && isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,2)){
                    doorOpenSound.play();
                    eventKind=2;
                    State=GameEvent;
                }
            }

            if(eventKind==6){
                if(talkProgress==0){
                    player.tick++;
                    if(player.tick==15){
                        buttonSound.play();
                        message=makeMessage('ミラ「ここは....」');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==4){
                    if(playerToMapY(player.y)<8){
                        player.isMoving=true;
                        player.vy=2;
                    }else if(playerToMapX(player.x)<8){
                        player.direction=2;
                        player.vy=0;
                        player.isMoving=true;
                        player.vx=2;
                    }else{
                        player.vx=0;
                        player.isMoving=false;
                        talkProgress++;
                    }
                }else if(talkProgress==5){
                    buttonSound.play();
                    message=makeMessage('ミラ「ママ！　パパ！」');
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }else if(talkProgress==7){
                    player.tick++;
                    if(player.tick==32){
                        buttonSound.play();
                        message=makeMessage('ミラ「あれ？」');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }else if(talkProgress==12){
                    player.tick++;
                    if(player.tick==32){
                        buttonSound.play();
                        message=makeMessage('ミラ「ママ、パパ」');
                        scene.addChild(message);
                        player.tick=0;
                        talkProgress++;
                    }
                }
            }else if(eventKind==2){
                player.tick++;
                if(player.tick==15){
                    nextScene=71;
                    nowScene=7;
                    previousScene=91;
                    if(playerToMapY(player.y)==10){
                        previousCharaLocate=0;
                    }else{
                        previousCharaLocate=1;
                    }
                    game.popScene();
                    
                }
            }else if(eventKind==1 && talkProgress == 0){
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
            }else if(eventKind==1 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==1 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==1 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=8;
                    nextScene=81;
                    previousScene=91;
                    if(playerToMapX(player.x)==7)
                        previousCharaLocate=0;
                    else
                        previousCharaLocate=1;
                    game.popScene();
                }
            }
    
    
        });
    
        scene.addEventListener(Event.TOUCH_START , function(e) {
    
            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,1)){
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                            eventKind=1;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,3)){
                            buttonSound.play();
                            message=makeMessage('ミラ「学校....楽しそうだなぁ....」');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,4)){
                            buttonSound.play();
                            message=makeMessage('ミラ「お父さん、お母さん....私、頑張るから」');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }else if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,5)){
                            buttonSound.play();
                            message=makeMessage('ミラ「みんなでのんびりみたいなぁ....」');
                            scene.addChild(message);
                            eventKind=3;
                            State=GameEvent;
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 6:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「リビングだ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ママとパパもいる！」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 3:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 4:
                                    case 5:
                                        break;
                                    case 6:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 7:
                                        scene.removeChild(message);
                                        message=makeMessage('パパ「.....カラはまだ部屋から出てこれないのか？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 8:
                                        scene.removeChild(message);
                                        message=makeMessage('ママ「そうみたいね。あの子は友達のいうことを気にしすぎなのよ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 9:
                                        scene.removeChild(message);
                                        message=makeMessage('ママ「はやく、あの子も学校に行けるようになればいいのだけれど.....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 10:
                                        scene.removeChild(message);
                                        message=makeMessage('パパ「そうだな」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 11:
                                        scene.removeChild(message);
                                        talkProgress++;
                                        break;
                                    case 12:
                                        break;
                                    case 13:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「わたし、ちゃんと学校に行けるよ？　行きたいよ？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 14:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「どうして、わたしを見てくれないの？」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 15:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「なんで...」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 16:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「....あっ、そっかあ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 17:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ずっと、わたしが鏡の国を行き来してたと思っていたけど」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 18:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「こっちが鏡の国、だったんだね」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 19:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「だから、ママもパパも私に気付いてくれないんだ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 20:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「ママたちはこっちで話しかけてもわからないんだね」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 21:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「じゃあ、鏡の向こうのわたしは....」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 22:
                                        scene.removeChild(message);
                                        message=makeMessage('ミラ「......会いに行かなくちゃ」');
                                        buttonSound.play();
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 23:
                                        scene.removeChild(message);
                                        talkProgress=0;
                                        eventKind=0;
                                        State=Nomal;
                                        bgm=true;
                                        itemList[13]=1;
                                        break;
                                }
                                break;
                            case 3:
                                scene.removeChild(message);
                                eventKind=0;
                                State=Nomal;
                                break;
                            case 1:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        break;
                                }
                            break;
                        }
                }
            }
        });
        return scene;
    
    };

    game.makeScene10 = function(wholeSound){
        var scene = new Scene();

        scene.addEventListener('enterframe', function(e) {
            if(previousScene==31　|| nextScene==101){
                game.pushScene(game.makeScene10_1(wholeSound));
            }else{
                game.popScene();
            }
        });

        return scene;
    };

    game.makeScene10_1 = function(wholeSound) {
        var scene = new Scene();
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['oinarisama.png'];
        var map2 = new Map(mapTileScale, mapTileScale);
        map2.image = game.assets['stair.png'];
        var map3 = new Map(mapTileScale, mapTileScale);
        map3.image = game.assets['makkuraEnterMirror.png'];
        var map4 = new Map(mapTileScale, mapTileScale);
        map4.image = game.assets['heya_girl2.png'];
        var buttonSound = game.assets['musmus_btn_set\\btn01.mp3'].clone();
        var selectMessage1=selectMessage('はい',1);
        var selectMessage2=selectMessage('いいえ',2);
        var darkwholeSound = game.assets['makkuraOut.mp3'].clone();
    
    
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

        eventMap[14][29]=1;
        eventMap[15][29]=1;
        eventMap[14][9]=2;
        eventMap[15][9]=2;
        if(itemList[1]==0 || itemList[5]==0 || itemList[11]==0){
            eventMap[14][14]=3;
            eventMap[15][14]=3;
        }

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
    
        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                array1[i+20][j+10]=20*(9+i%2)+11+j%2;
            }
        }

        array1[9][14]=20*9+11;
        array1[9][15]=20*9+12;

    
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
        map.loadData(array1,array2);
    
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

        for(var i=0;i<11;i++){
            array3[19+i][9]=1;
            array3[19+i][20]=1;
        }
        for(var i=0;i<4;i++){
            array3[19][10+i]=1;
            array3[19][16+i]=1;
        }

        for(var i=0;i<11;i++){
            array3[9+i][13]=1;
            array3[9+i][16]=1;
        }

        array3[29][14]=1;
        array3[29][15]=1;
        array3[9][14]=1;
        array3[9][15]=1;
    
        map.collisionData=array3;

        //マップの背景の上書き作成(アイテムなどの)
        var array4 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array4[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array4[i][j]=-1;
            }
        }

        for(var i=0;i<10;i++){
            for(var j=0;j<2;j++){
                array4[i+10][j+14]=16*(29+i%2)+10+j%2;
            }
        }

        map2.loadData(array4);

        var array5 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array5[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array5[i][j]=-1;
            }
        }

        array5[29][14]=2;
        array5[29][15]=3;

        map3.loadData(array5);

        var array6 = new Array(mapArraySize);
        for(var i=0;i<mapArraySize;i++){
            array6[i]=new Array(mapArraySize);
        }
        for(var i=0;i<mapArraySize;i++){
            for(var j=0;j<mapArraySize;j++){
                array6[i][j]=-1;
            }
        }

        for(var i=0;i<2;i++){
            for(var j=0;j<4;j++){
                array6[j+6][i+14]=16*(58+j)+2+i;
            }
        }

        map4.loadData(array6);
        
    
        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 14 * 16 - 8;
        player.y = 25 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 32*6, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;
    
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
        stage.addChild(map2);
        stage.addChild(map3);
        stage.addChild(map4);
        stage.addChild(player);
        scene.addChild(stage);
    
        //パッド見える用
        var mask=new Label();
        mask.height=100;
        mask.width=100;
        mask.x=mapScale-100;
        mask.y=mapScale-200;
        mask.backgroundColor='rgba(255,255,255,0.1)';
        scene.addChild(mask);
    
        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = mapScale-100;
        pad.y = mapScale-200;
        scene.addChild(pad);
    
        //前のシーンに応じてこのシーンの状態変更
        if(previousScene==31){
            State=Nomal;
            eventKind=0;
            talkProgress=0;
            bgm=false;
            player.direction=3;
            player.y = 27 * 16;
            if(previousCharaLocate==0){
                player.x = 14 * 16 - 8;
            }else{
                player.x = 15 * 16 - 8;
                
            }
        }
    
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
                wholeSound.volume=0.5;
            }else{
                wholeSound.stop();
            }

            if(isEventHere(playerToMapX(player.x),playerToMapY(player.y),eventMap,3) && talkProgress==0){
                buttonSound.play();
                message=makeMessage('ミラ「まだ何か忘れているような...」');
                scene.addChild(message);
                eventKind=3;
                talkProgress++;
                State=GameEvent;
            }

            if(eventKind==1 && talkProgress == 0){
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
            }else if(eventKind==1 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==1 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==1 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=3;
                    nextScene=31;
                    previousScene=101;
                    if(playerToMapX(player.x)==14)
                        previousCharaLocate=0;
                    else
                        previousCharaLocate=1;
                    game.popScene();
                }
            }else if(eventKind==2 && talkProgress == 0){
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
            }else if(eventKind==2 && talkProgress == 1){
                darkwholeSound.play();
                message=screenDark(0.6);
                scene.addChild(message);
                player.tick=0;
                talkProgress++;
            }else if(eventKind==2 && talkProgress == 2){
                player.tick++;
                if(player.tick==8){
                    message=screenDark(0.6);
                    scene.addChild(message);
                    player.tick=0;
                    talkProgress++;
                }
            }else if(eventKind==2 && talkProgress == 3){
                player.tick++;
                if(player.tick==8){
                    player.tick=0;
                    talkProgress++;
                    nowScene=1;
                    nextScene=1;
                    previousScene=101;
                    if(playerToMapX(player.x)==14)
                        previousCharaLocate=0;
                    else
                        previousCharaLocate=1;
                    game.popScene();
                }
            }else if(eventKind==3 && talkProgress==3){
                player.direction=0;
                player.vy=4;
                player.isMoving=true;
                talkProgress++;
            }else if(eventKind==3 && talkProgress==4){
                player.vy=0;
                player.isMoving=false;
                eventKind=0;
                talkProgress=0;
                State=Nomal;
            }
    
    
        });
    
        scene.addEventListener(Event.TOUCH_START , function(e) {
    
            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //message=makeMessage(playerToMapX(player.x)+','+playerToMapY(player.y));
                        //scene.addChild(message);
                        if(player.direction == 0 && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,1)){
                            State=GameEvent;
                            eventKind=1;
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                        }else if(player.direction == 3 && isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,eventMap,2)){
                            State=GameEvent;
                            eventKind=2;
                            buttonSound.play();
                            message=makeMessage('鏡を調べますか？');
                            scene.addChild(message);
                            scene.addChild(selectMessage1);
                            scene.addChild(selectMessage2);
                            selectState=2;
                            select=selectWindow(selectState);
                            scene.addChild(select);
                        }
                        break;
                    case GameEvent:    //イベントの種類ごとの処理
                        switch(eventKind){
                            case 1:
                            case 2:
                                switch(talkProgress){
                                    case 0:
                                        scene.removeChild(message);
                                        scene.removeChild(select);
                                        scene.removeChild(selectMessage1);
                                        scene.removeChild(selectMessage2);
                                        if(selectState==1){
                                            bgm=false;
                                            wholeSound.stop();
                                            talkProgress++;
                                        }else{
                                            talkProgress=0;
                                            State=Nomal;
                                            eventKind=0;
                                        }
                                        break;
                                    case 1:
                                        break;
                                    case 2:
                                        break;
                                    case 3:
                                        break;
                                }
                                break;
                            case 3:
                                switch(talkProgress){
                                    case 0:
                                        break;
                                    case 1:
                                        scene.removeChild(message);
                                        buttonSound.play();
                                        message=makeMessage('ミラ「一度、戻ってみよう」');
                                        scene.addChild(message);
                                        talkProgress++;
                                        break;
                                    case 2:
                                        scene.removeChild(message);
                                        talkProgress++;
                                    case 3:
                                        break;
                                    case 4:     
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

function lastMessage(text){
    var label = new Label(text);
    label.font="16px monospace";
    label.color = "rgb(255,255,255)";
    label.y=mapTileScale*8;
    return label;
}

function selectMessage(text,lebel){
    var label = new Label(text);
    label.font="16px monospace";
    label.color = "rgb(255,255,255)";
    label.y=mapScale-mapTileScale*6+lebel*16;
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