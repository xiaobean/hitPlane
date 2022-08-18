import {_decorator, Component, Node} from 'cc';
import {Constant} from "../framework/Constant";

const {ccclass, property} = _decorator;

const OUTOFRANGE = 11;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {


    private enemySpeed = 0;

    // public enemyType = Constant.EnemyType.TYPE1

    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.getPosition()
        const movePos = pos.z + this.enemySpeed
        this.node.setPosition(pos.x, pos.y, movePos)

        if (movePos > OUTOFRANGE)
            this.node.destroy()
    }

    show(speed: number) {
        this.enemySpeed = speed
    }
    
}

