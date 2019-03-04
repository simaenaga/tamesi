enchant();

var State=0;//ゲームプレイ中のステータス
const Nomal=0;
const GameEvent=1;

var message=makeMessage("日本語1");//メッセージ出力用
var eventKind=0;//イベントの種類
var talkProgress=0;//話し中の進捗度
var mapScale=240;//マップの大きさ
var mapTileScale=16;//マップ画像一つ分の大きさ
var itemList=new Array(10);//拾ったアイテム判定用
var mapArraySize= mapScale/mapTileScale;//一つの方向にあるマップ画像数

for(var i=0;i<itemList.length;i++){
    itemList[i]=0;
}

window.onload = function() {
    var game = new Game(mapScale, mapScale);
    game.fps = 15;
    game.preload('map1.gif', 'chara0.gif');
    game.onload = function() {
        var map = new Map(mapTileScale, mapTileScale);
        map.image = game.assets['map1.gif'];

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
        array2[0][0]=420;
        array2[0][1]=402;

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
        array3[0][0]=1;
        map.collisionData=array3;

        //プレイヤーデータ作成
        var player = new Sprite(32, 32);
        player.x = 6 * 16 - 8;
        player.y = 10 * 16;
        var image = new Surface(96, 128);
        image.draw(game.assets['chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
        player.image = image;

        //プレイヤー以外キャラクター作成
        var enemy=new Sprite(32,32);
        enemy.x=9*16-8;
        enemy.y=2*16;
        enemy.image=game.assets['chara0.gif'];
        enemy.frame=34;
        array3[3][9]=1;

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
        stage.addChild(enemy);
        game.rootScene.addChild(stage);

        //パッド作成(いじらない)
        var pad = new Pad();
        pad.x = -10;
        pad.y = 140;
        pad.scaleX=0.8;
        pad.scaleY=0.8;
        game.rootScene.addChild(pad);

        game.rootScene.addEventListener(Event.TOUCH_START, function(e) {
            //パッド以外をタッチしたとき
            if(touchJudge(e.x,e.y)){
                switch(State){
                    //イベント中でない時で、イベントが横にある状態で画面タッチすると
                    case Nomal:
                        //左上アイテムゲット
                        if(isSurroundEvent(playerToMapX(player.x),playerToMapY(player.y),player.direction,array2,420)){
                            message=makeMessage(player.x+","+player.y);
                            game.rootScene.addChild(message);
                            eventKind=1;
                            State=GameEvent;
                        }else if(player.x==9*16-8&&player.y==3*16){ //話しかける
                                if(eventKind==0){
                                message=makeMessage("我々は宇宙人だ");
                                game.rootScene.addChild(message);
                                eventKind=2;
                                State=GameEvent;
                            }
                        }/*else if(player.x==8&&player.y==-16){
                            /*game.rootScene.removeChild(stage);
                            game.rootScene.removeChild(pad);
                            game.pushScene(game.makeScene1());
                        }*/
                        /*else{
                            message=makeMessage(playerToMapX(player.x)+","+playerToMapY(player.y));
                            game.rootScene.addChild(message);
                            State=Item;
                        }*/
                        break;
                    case GameEvent:    //メッセージウィンドウが出た状態で画面タッチすると
                        switch(eventKind){
                            case 1:
                                game.rootScene.removeChild(message);
                                array2[0][0]=-1;
                                array3[0][0]=0;
                                map.loadData(array1,array2);
                                eventKind=0;
                                State=Nomal;
                                break;
                            case 2:
                                switch(talkProgress){
                                    case 0:
                                        game.rootScene.removeChild(message);
                                        message=makeMessage("金をよこせ");
                                        game.rootScene.addChild(message);
                                        talkProgress++;
                                        break;
                                    default:
                                        game.rootScene.removeChild(message);
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

    };

//2つめのシーン
    /*game.makeScene1=function(){
        var scene = new Scene();

    var map = new Map(16, 16);
            map.image = game.assets['map1.gif'];

            var array1 = new Array(30);
            for(var i=0;i<30;i++){
                array1[i]=new Array(30);
            }
            for(var i=0;i<30;i++){
                for(var j=0;j<30;j++){
                    array1[i][j]=323;
                }
            }
            array1[0][0]=420;
            array1[0][1]=402;
            map.loadData(array1);

            var array2 = new Array(30);
            for(var i=0;i<30;i++){
                array2[i]=new Array(30);
            }
            for(var i=0;i<30;i++){
                for(var j=0;j<30;j++){
                    array2[i][j]=0;
                }
            }
            array2[0][0]=1;
            map.collisionData=array2;

            var player = new Sprite(32, 32);
            player.x = 6 * 16 - 8;
            player.y = 10 * 16;
            var image = new Surface(96, 128);
            image.draw(game.assets['chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
            player.image = image;

            var enemy=new Sprite(32,32);
            enemy.x=9*16-8;
            enemy.y=2*16;
            enemy.image=game.assets['chara0.gif'];
            enemy.frame=34;
            array2[3][9]=1;

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

            var stage = new Group();
            stage.addChild(map);
            stage.addChild(enemy);
            stage.addChild(player);
            scene.addChild(stage);

            var pad = new Pad();
            pad.x = 60;
            pad.y = mapScale+60;
            scene.addChild(pad);

            scene.addEventListener(Event.TOUCH_START, function(e){
                game.popScene();
            });

            return scene;

    };*/

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
    if(((x-1)>=0 && array[x-1][y]==event &&direction==1) || ((x+1)<array.length && array[x+1][y]==event &&direction==2) || ((y+1)<array.length && array[x][y+1]==event &&direction==0) || ((y-1)>=0 && array[x][y-1]==event &&direction==3)){
        return true;
    }
    return false;
}
