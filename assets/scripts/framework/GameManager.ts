import {_decorator, Component, Node, Prefab, instantiate, math} from 'cc';
import {Bullet} from "../bullet/Bullet";
import {Constant} from "./Constant";
import {EnemyPlane} from "../plane/EnemyPlane";

const {ccclass, property} = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    public playerPlane: Node = null
    @property(Prefab) //子弹是预制资源，放到场景里叫做实例
    public bullet01: Prefab = null
    @property(Prefab)
    public bullet02: Prefab = null
    @property(Prefab)
    public bullet03: Prefab = null
    @property(Prefab)
    public bullet04: Prefab = null
    @property(Prefab)
    public bullet05: Prefab = null

    @property(Node)
    public bulletRoot: Node = null //子弹的管理节点

    //敌机
    @property(Prefab)
    public enemy01: Prefab = null;
    @property(Prefab)
    public enemy02: Prefab = null;
    @property()
    public createEnemyTime = 1
    @property()
    public enemy1Speed = 0.05
    @property()
    public enemy2Speed = 0.07


    @property
    public bulletSpeed = 1 // 子弹速度
    @property
    public shootTime = 0.3 //射击时间

    private curShootTime = 0 // 射击周期
    private isShooting: boolean = false
    private currentCreateEnemyTime = 0
    private combinationInteval = Constant.Combination.PLANE1//敌机的 组合状态

    start() {

        this.init()
    }

    update(deltaTime: number) {
        this.curShootTime += deltaTime

        //当我们触摸屏幕 并且 射击周期 > 射击时间 就可以发射子弹了
        if (this.isShooting && this.curShootTime > this.shootTime) {
            this.createPlayerBullet()//创建子弹
            this.curShootTime = 0
        }

        //判断敌机的组合方式
        this.currentCreateEnemyTime += deltaTime
        if (this.combinationInteval === Constant.Combination.PLANE1) {
            //判断敌机时间是不是大于它要求的时间
            if (this.currentCreateEnemyTime > this.createEnemyTime) {
                this.createEnemyPlane()//创建敌机
                this.currentCreateEnemyTime = 0
            }

        } else if (this.combinationInteval === Constant.Combination.PLANE2) {
            //判断敌机时间是不是大于它要求的时间
            if (this.currentCreateEnemyTime > this.createEnemyTime * 0.9) {
                const randomCombination = math.randomRangeInt(1, 3) //前闭后开 随机敌人组合
                if (randomCombination === Constant.Combination.PLANE2) {
                    //组合2 为一字型队形
                    this.createCombination1()
                } else {
                    this.createEnemyPlane()//创建敌机1
                }

                this.currentCreateEnemyTime = 0
            }
        } else {
            //判断敌机时间是不是大于它要求的时间
            if (this.currentCreateEnemyTime > this.createEnemyTime * 0.8) {
                const randomCombination = math.randomRangeInt(1, 4) //前闭后开 随机敌人组合
                if (randomCombination === Constant.Combination.PLANE2) {
                    //组合2 为一字型队形
                    this.createCombination1()
                } else if (randomCombination === Constant.Combination.PLANE3) {
                    //组合2 为人字型队形
                    this.createCombination2()
                } else {
                    this.createEnemyPlane()//创建敌机1
                }

                this.currentCreateEnemyTime = 0
            }
        }
    }

    //子蛋射击的时候，是我们触摸屏幕的时候才触发
    public isShoot(value: boolean) {
        this.isShooting = value
    }

    public createPlayerBullet() {
        //子弹是预制资源，放到场景里叫做实例,所以要调实例化接口,接口的返回值是node
        let bullet = instantiate(this.bullet01)

        //实例后的对象不在场景里，而是要必须执行一个setParent的操作,这时候可以定义一个子弹的管理节点，由层级管理器定义
        bullet.setParent(this.bulletRoot)

        //设置一下子弹在的位置,先找到飞机位置，然后相对定位找到一个合适位置放置子弹，z=-1可以
        const pos = this.playerPlane.position
        console.log(pos.x, pos.y, pos.z)
        bullet.setPosition(pos.x, pos.y, pos.z - 1)

        //设置子弹的速度
        const bulletComp = bullet.getComponent(Bullet)
        bulletComp.bulletSpeed = this.bulletSpeed
    }

    //敌机创建
    public createEnemyPlane() {
        //随机选出 敌机1和敌机2
        const whichEnemy = math.randomRangeInt(1, 3) //前闭后开
        let prefab: Prefab = null
        let speed = 0
        if (whichEnemy === Constant.EnemyType.TYPE1) {
            prefab = this.enemy01
            speed = this.enemy1Speed
        } else {
            prefab = this.enemy02
            speed = this.enemy2Speed
        }

        //实例化预制资源
        let enemy = instantiate(prefab);
        //放置在gameMrg下
        enemy.setParent(this.node)
        //获取它下面的组件
        const enemyComp = enemy.getComponent(EnemyPlane)
        //敌机出现
        enemyComp.show(speed)

        //敌机的坐标
        const randomPos = math.randomRangeInt(-4.5, 5)
        enemy.setPosition(randomPos, 1, -30)
    }

    //组合1敌机 一字队形
    public createCombination1() {
        let enemyArray = new Array<Node>(5)
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = instantiate(this.enemy01)
            const element = enemyArray[i]
            element.parent = this.node
            //一字队形，5架敌机，间隔1.5
            element.setPosition(-3 + i * 1.5, 1, -30)
            //设置速度
            const enemyComp = element.getComponent(EnemyPlane)
            enemyComp.show(this.enemy1Speed)
        }

    }

    //组合2敌机
    public createCombination2() {
        let enemyArray = new Array<Node>(7)
        const combinationPos = [
            -4.5, 1, -33,
            -3, 1, -32,
            -1.5, 1, -31,
            0, 1, -30,
            1.5, 1, -31,
            3, 1, -32,
            4.5, 1, -33
        ]

        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = instantiate(this.enemy02)
            const element = enemyArray[i]
            element.parent = this.node
            //人队形，5架敌机，间隔1.5
            const startIndex = i * 3 //3是偏移量  7架飞机  21个元素
            element.setPosition(combinationPos[startIndex], combinationPos[startIndex + 1], combinationPos[startIndex + 2])
            //设置速度
            const enemyComp = element.getComponent(EnemyPlane)
            enemyComp.show(this.enemy2Speed)
        }
    }


    private init() {
        //初始化，默认射击周期 = 射击时间，这样第一次触摸一定发射一颗子弹
        this.curShootTime = this.shootTime

        //启动敌机组合方式
        this.changePlaneMode()
    }

    //设定一个定时器，用来触发敌机的组合模型
    private changePlaneMode() {
        //每10s执行一次定时器，重复3次
        this.schedule(() => {
            this.combinationInteval++
        }, 20, 3)
    }
}

