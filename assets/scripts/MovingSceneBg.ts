import {_decorator, Component, Node} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('MovingSceneBg')
export class MovingSceneBg extends Component {

    @property(Node)
    bg01: Node = null

    @property(Node)
    bg02: Node = null

    @property()
    bgSpeed: number = 10//背景滚动速度

    @property()
    bgMovingRange: number = 20//背景滚动速度上限

    start() {
        this.init()
    }

    update(deltaTime: number) {
        this.moveBackground(deltaTime)
    }

    private init() {
        this.bg01.setPosition(0, 0, 0)
        this.bg02.setPosition(0, 0, -this.bgMovingRange)
    }

    private moveBackground(deltaTime: number) {
        this.bg01.setPosition(0, 0, this.bg01.position.z + this.bgSpeed * deltaTime)
        this.bg02.setPosition(0, 0, this.bg02.position.z + this.bgSpeed * deltaTime)

        if (this.bg01.position.z > this.bgMovingRange) {
            this.bg01.setPosition(0, 0, this.bg02.position.z - this.bgMovingRange)
        } else if (this.bg02.position.z > this.bgMovingRange) {
            this.bg02.setPosition(0, 0, this.bg01.position.z - this.bgMovingRange)
        }
    }
}

