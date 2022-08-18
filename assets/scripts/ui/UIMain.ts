import {_decorator, Component, EventTouch, Node, SystemEvent, systemEvent, Touch} from 'cc';
import {GameManager} from "../framework/GameManager";
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property()
    public speed = 1

    @property(GameManager)
    public gameManage : GameManager = null

    @property(Node)
    public palyerPlane : Node = null

    start() {

        // TOUCH_START   TOUCH_END 用来做触摸屏幕的时候发射子弹判断
        this.node.on(SystemEvent.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(SystemEvent.EventType.TOUCH_MOVE, this.touchMove, this)
        this.node.on(SystemEvent.EventType.TOUCH_END, this.touchEnd, this)
    }

    touchMove(touch: Touch, event: EventTouch) {

        //获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性
        let delta = touch.getDelta();
        let pos = this.palyerPlane.position;
        //乘以 0.01 表示移动的是单位，而我们实际移动的是像素，0.01是单位和像素的比例，大概调节用的，不确定
        this.palyerPlane.setPosition(pos.x + 0.01 * this.speed * delta.x, pos.y, pos.z - 0.01 * this.speed * delta.y)
    }

    touchStart(touch: Touch, event: EventTouch) {
        this.gameManage.isShoot(true)
    }

    touchEnd(touch: Touch, event: EventTouch) {
        this.gameManage.isShoot(false)
    }


    update(deltaTime: number) {

    }
}

