import {_decorator, Component, Node} from 'cc';

const {ccclass, property} = _decorator;

const OUTOFRANGE = 10;

@ccclass('Bullet')
export class Bullet extends Component {

    @property()
    public bulletSpeed = 1

    start() {

    }

    update(deltaTime: number) {
        //让子弹每帧根据速度移动！
        //先获取到子弹的位置
        let pos = this.node.position

        //让每帧都减去子弹移动的速度
        let moveLength = pos.z - this.bulletSpeed

        //将得到移动后的位置传给子弹节点
        this.node.setPosition(pos.x, pos.y, moveLength)

        if (Math.abs(moveLength) > OUTOFRANGE){
            this.node.destroy()
            console.log('子弹超越边界了，销毁')
        }
    }
}

