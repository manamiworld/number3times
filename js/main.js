'use strict';
// メソッド経由で作動するようにする

{
  // パネルを管理するclass
  class Panel {
    constructor(game) {
      this.game = game;
      this.el = document.createElement('li');
      this.el.classList.add('pressed');
      this.el.addEventListener('click', () => {
        this.check();
      });
    }

    // 要素を返すときに必要 オブジェクト指向のカプセル化
    getEl() {
      return this.el;
    }

    activate(num) {
      this.el.classList.remove('pressed');
      this.el.textContent = num;
    }

    // 押し込んだ数字があっていれば押し込まれる
    check() {
      if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        this.el.classList.add('pressed');
        this.game.addCurrentNum();

        // すべて終わったら終了される
        // 下の数字を変える
        if (this.game.getCurrentNum() === 3 * (this.game.getLevel() ** 2) + 3) {
          clearTimeout(this.game.getTimeoutId());
        }
      }
    }
  }

  class Board {
    constructor(game) {
      // ゲームクラスに作用できるようにする
      this.game = game;
      this.panels = [];
      // パネルの数を決めている
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        this.panels.push(new Panel(this.game));
      }
      this.setup();
    }

    // borad要素
    setup() {
      const board = document.getElementById('board');
      this.panels.forEach(panel => {
        board.appendChild(panel.getEl());
      });
    }


    // 数字をnumに入れていく
    activate() {
      const nums = [];
      // 数字の設定
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {

        // i=0なのでi+1にする
        // 下の数字を変える
        nums.push(3 * (i+1));
      }

      // 数字をランダムに配置する
      this.panels.forEach(panel => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.activate(num);
      });
    }
  }

  // ゲームクラス
  class Game {
    constructor(level) {
      this.level = level;
      this.board = new Board(this);
      // 値が決まっていないからundefined
      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;

      // ボタン要素
      const btn = document.getElementById('btn');
      btn.addEventListener('click', () => {
        this.start();
      });
      this.setup();
    }

    // サイズの変更
    setup() {
      const container = document.getElementById('container');
      const PANEL_WIDTH = 50;
      const BOARD_PADDING = 10;
      /* 50px * 2 + 10px * 2 */
      container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
    }

    // タイマーを止める
    start() {
      if (typeof this.timeoutId !== 'undefined') {
        clearTimeout(this.timeoutId);
      }

      // はじめの数字
      // this.currentNum = 1;
      // 下の数字を変える
      this.currentNum = 3;
      this.board.activate();

      // 時間を保持する
      this.startTime = Date.now();
      this.runTimer();
    }

    // 時間の表示
    runTimer() {
      const timer = document.getElementById('timer');
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);

      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }

    // メソッド経由でクラスにアクセスするためにすべてリターンしている

    // ルール通りのボタンのみ押せる
    addCurrentNum() {
      // this.currentNum++;
      // 下の数字を変える
      this.currentNum = this.currentNum + 3;
    }

    getCurrentNum() {
      return this.currentNum;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }

  }

  // パネルの難易度を決める n × n
  // 下の数字を変える
  new Game(3);
}